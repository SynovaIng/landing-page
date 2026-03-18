import { Service } from "diod";
import { z } from "zod";

import { Testimonial } from "@/contexts/testimonials/domain/testimonial.entity";
import type {
  CreateTestimonialInput,
  GetAllTestimonialsOptions,
  UpdateTestimonialInput,
} from "@/contexts/testimonials/domain/testimonial.repository";
import { TestimonialRepository } from "@/contexts/testimonials/domain/testimonial.repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const toInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "CL";
};

type RelationWithName = { name?: string | null } | { name?: string | null }[] | null;

const relationWithNameSchema = z
  .union([
    z.object({ name: z.string().optional().nullable() }),
    z.array(z.object({ name: z.string().optional().nullable() })),
  ])
  .nullable()
  .optional();

const getNameFromRelation = (relation: unknown): string => {
  const parsed = relationWithNameSchema.safeParse(relation);

  if (!parsed.success || !parsed.data) {
    return "";
  }

  if (Array.isArray(parsed.data)) {
    return String(parsed.data[0]?.name ?? "");
  }

  return String(parsed.data.name ?? "");
};

const isMissingOrderIndexError = (error: { code?: string; message?: string } | null): boolean => {
  if (!error) {
    return false;
  }

  if (error.code === "42703") {
    return true;
  }

  return String(error.message ?? "").toLowerCase().includes("order_index");
};

@Service()
export class SupabaseTestimonialRepository extends TestimonialRepository {
  private getClientNameFromRelation(clientRelation: RelationWithName | undefined): string {
    return getNameFromRelation(clientRelation);
  }

  private getProjectNameFromRelation(projectRelation: RelationWithName | undefined): string {
    return getNameFromRelation(projectRelation);
  }

  async getAll(options?: GetAllTestimonialsOptions): Promise<Testimonial[]> {
    const includeUnpublished = options?.includeUnpublished ?? false;
    const supabase = await createSupabaseServerClient();

    const queryBaseWithOrder = supabase
      .from("reviews")
      .select("id, message, client_name, client_location, stars, is_published, client_id, project_id, order_index, clients(name), projects(name)")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });

    const queryWithOrder = includeUnpublished
      ? await queryBaseWithOrder
      : await queryBaseWithOrder.eq("is_published", true);

    const query = isMissingOrderIndexError(queryWithOrder.error)
      ? await (includeUnpublished
          ? supabase
              .from("reviews")
              .select("id, message, client_name, client_location, stars, is_published, client_id, project_id, clients(name), projects(name)")
              .order("created_at", { ascending: false })
          : supabase
              .from("reviews")
              .select("id, message, client_name, client_location, stars, is_published, client_id, project_id, clients(name), projects(name)")
              .eq("is_published", true)
              .order("created_at", { ascending: false }))
      : queryWithOrder;

    const { data, error } = query;

    if (error || !data) {
      return [];
    }

    return data.map((review) => new Testimonial({
      id: String(review.id),
      text: String(review.message ?? ""),
      authorName: String(review.client_name ?? ""),
      authorInitials: toInitials(String(review.client_name ?? "")),
      authorLocation: String(review.client_location ?? ""),
      rating: Number(review.stars ?? 0),
      isPublished: Boolean((review as { is_published?: boolean }).is_published ?? true),
      projectId: review.project_id ? String(review.project_id) : null,
      projectName: this.getProjectNameFromRelation((review as { projects?: RelationWithName }).projects),
      orderIndex: Number((review as { order_index?: number }).order_index ?? 0),
    }));
  }

  async getById(id: string): Promise<Testimonial | null> {
    const supabase = await createSupabaseServerClient();

    const queryWithOrder = await supabase
      .from("reviews")
      .select("id, message, client_name, client_location, stars, is_published, client_id, project_id, order_index, clients(name), projects(name)")
      .eq("id", id)
      .maybeSingle();

    const query = isMissingOrderIndexError(queryWithOrder.error)
      ? await supabase
          .from("reviews")
          .select("id, message, client_name, client_location, stars, is_published, client_id, project_id, clients(name), projects(name)")
          .eq("id", id)
          .maybeSingle()
      : queryWithOrder;

    const { data, error } = query;

    if (error || !data) {
      return null;
    }

    return new Testimonial({
      id: String(data.id),
      text: String(data.message ?? ""),
      authorName: String(data.client_name ?? ""),
      authorInitials: toInitials(String(data.client_name ?? "")),
      authorLocation: String(data.client_location ?? ""),
      rating: Number(data.stars ?? 0),
      isPublished: Boolean((data as { is_published?: boolean }).is_published ?? true),
      projectId: data.project_id ? String(data.project_id) : null,
      projectName: this.getProjectNameFromRelation((data as { projects?: RelationWithName }).projects),
      orderIndex: Number((data as { order_index?: number }).order_index ?? 0),
    });
  }

  async create(input: CreateTestimonialInput): Promise<Testimonial> {
    const supabase = await createSupabaseServerClient();
    const { data: maxOrderReview } = await supabase
      .from("reviews")
      .select("order_index")
      .order("order_index", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrderIndex = Number(maxOrderReview?.order_index ?? -1) + 1;

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        message: input.text,
        client_name: input.authorName,
        client_location: input.authorLocation,
        stars: input.rating,
        is_published: input.isPublished,
        project_id: input.projectId ?? null,
        order_index: nextOrderIndex,
      })
      .select("id, message, client_name, client_location, stars, is_published, project_id, order_index, projects(name)")
      .single();

    if (error || !data) {
      throw new Error("No se pudo crear la reseña");
    }

    return new Testimonial({
      id: String(data.id),
      text: String(data.message ?? input.text),
      authorName: String(data.client_name ?? input.authorName),
      authorInitials: input.authorInitials || toInitials(input.authorName),
      authorLocation: String(data.client_location ?? input.authorLocation),
      rating: Number(data.stars ?? input.rating),
      isPublished: Boolean(data.is_published ?? input.isPublished),
      projectId: data.project_id ? String(data.project_id) : (input.projectId ?? null),
      projectName: this.getProjectNameFromRelation((data as { projects?: RelationWithName }).projects),
      orderIndex: Number(data.order_index ?? nextOrderIndex),
    });
  }

  async update(id: string, input: UpdateTestimonialInput): Promise<Testimonial> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("reviews")
      .update({
        message: input.text,
        client_name: input.authorName,
        client_location: input.authorLocation,
        stars: input.rating,
        is_published: input.isPublished,
        project_id: input.projectId ?? null,
      })
      .eq("id", id)
      .select("id, message, client_name, client_location, stars, is_published, project_id, order_index, projects(name)")
      .single();

    if (error || !data) {
      throw new Error("No se pudo actualizar la reseña");
    }

    return new Testimonial({
      id: String(data.id),
      text: String(data.message ?? input.text),
      authorName: String(data.client_name ?? input.authorName),
      authorInitials: input.authorInitials || toInitials(input.authorName),
      authorLocation: String(data.client_location ?? input.authorLocation),
      rating: Number(data.stars ?? input.rating),
      isPublished: Boolean(data.is_published ?? input.isPublished),
      projectId: data.project_id ? String(data.project_id) : (input.projectId ?? null),
      projectName: this.getProjectNameFromRelation((data as { projects?: RelationWithName }).projects),
      orderIndex: Number(data.order_index ?? 0),
    });
  }

  async setVisibility(id: string, isPublished: boolean): Promise<Testimonial> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("reviews")
      .update({ is_published: isPublished })
      .eq("id", id)
      .select("id")
      .single();

    if (error || !data) {
      throw new Error("No se pudo actualizar la visibilidad de la reseña");
    }

    const updated = await this.getById(id);

    if (!updated) {
      throw new Error("No se pudo cargar la reseña actualizada");
    }

    return updated;
  }

  async deleteMany(ids: string[]): Promise<void> {
    const targetIds = Array.from(new Set(ids.map((id) => id.trim()).filter(Boolean)));

    if (targetIds.length === 0) {
      return;
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("reviews")
      .delete()
      .in("id", targetIds);

    if (error) {
      throw new Error("No se pudieron eliminar las reseñas seleccionadas");
    }
  }

  async reorder(ids: string[]): Promise<void> {
    const supabase = await createSupabaseServerClient();

    const updates = ids.map((id, index) =>
      supabase
        .from("reviews")
        .update({ order_index: index })
        .eq("id", id),
    );

    const results = await Promise.all(updates);
    const hasError = results.some((result) => Boolean(result.error));

    if (hasError) {
      throw new Error("No se pudo actualizar el orden de reseñas");
    }
  }
}
