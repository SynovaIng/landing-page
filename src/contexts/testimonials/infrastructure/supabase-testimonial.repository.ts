import { Service } from "diod";
import { z } from "zod";

import { Testimonial } from "@/contexts/testimonials/domain/testimonial.entity";
import type {
  CreateReviewLinkInput,
  CreateTestimonialInput,
  GetAllTestimonialsOptions,
  SubmitReviewByTokenInput,
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

interface ReviewRow {
  id: unknown;
  message?: unknown;
  client_name?: unknown;
  client_location?: unknown;
  stars?: unknown;
  is_published?: unknown;
  project_id?: unknown;
  order_index?: unknown;
  token?: unknown;
  token_active?: unknown;
  project_name?: unknown;
  projects?: RelationWithName;
}

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

  private mapReviewToEntity(review: ReviewRow): Testimonial {
    const projectNameFromFunction = review.project_name ? String(review.project_name) : "";

    return new Testimonial({
      id: String(review.id),
      text: String(review.message ?? ""),
      authorName: String(review.client_name ?? ""),
      authorInitials: toInitials(String(review.client_name ?? "")),
      authorLocation: String(review.client_location ?? ""),
      rating: Number(review.stars ?? 0),
      isPublished: Boolean(review.is_published ?? true),
      projectId: review.project_id ? String(review.project_id) : null,
      projectName: projectNameFromFunction || this.getProjectNameFromRelation(review.projects),
      orderIndex: Number(review.order_index ?? 0),
      token: review.token ? String(review.token) : null,
      tokenActive: Boolean(review.token_active ?? false),
    });
  }

  async getAll(options?: GetAllTestimonialsOptions): Promise<Testimonial[]> {
    const includeUnpublished = options?.includeUnpublished ?? false;
    const supabase = await createSupabaseServerClient();

    const queryBaseWithOrder = supabase
      .from("reviews")
      .select("id, message, client_name, client_location, stars, is_published, project_id, order_index, token, token_active, projects(name)")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });

    const queryWithOrder = includeUnpublished
      ? await queryBaseWithOrder
      : await queryBaseWithOrder.eq("is_published", true);

    const query = isMissingOrderIndexError(queryWithOrder.error)
      ? await (includeUnpublished
          ? supabase
              .from("reviews")
              .select("id, message, client_name, client_location, stars, is_published, project_id, token, token_active, projects(name)")
              .order("created_at", { ascending: false })
          : supabase
              .from("reviews")
              .select("id, message, client_name, client_location, stars, is_published, project_id, token, token_active, projects(name)")
              .eq("is_published", true)
              .order("created_at", { ascending: false }))
      : queryWithOrder;

    const { data, error } = query;

    if (error || !data) {
      return [];
    }

    return data.map((review) => this.mapReviewToEntity(review as ReviewRow));
  }

  async getById(id: string): Promise<Testimonial | null> {
    const supabase = await createSupabaseServerClient();

    const queryWithOrder = await supabase
      .from("reviews")
      .select("id, message, client_name, client_location, stars, is_published, project_id, order_index, token, token_active, projects(name)")
      .eq("id", id)
      .maybeSingle();

    const query = isMissingOrderIndexError(queryWithOrder.error)
      ? await supabase
          .from("reviews")
          .select("id, message, client_name, client_location, stars, is_published, client_id, project_id, token, token_active, clients(name), projects(name)")
          .eq("id", id)
          .maybeSingle()
      : queryWithOrder;

    const { data, error } = query;

    if (error || !data) {
      return null;
    }

    return this.mapReviewToEntity(data as ReviewRow);
  }

  async getByToken(token: string): Promise<Testimonial | null> {
    const normalizedToken = token.trim();

    if (!normalizedToken) {
      return null;
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_review_by_token", {
      p_token: normalizedToken,
    });

    const row = Array.isArray(data) ? data[0] : null;

    if (error || !row) {
      return null;
    }

    return this.mapReviewToEntity(row as ReviewRow);
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
      .select("id, message, client_name, client_location, stars, is_published, project_id, order_index, token, token_active, projects(name)")
      .single();

    if (error || !data) {
      throw new Error("No se pudo crear la reseña");
    }

    return this.mapReviewToEntity({
      ...data,
      message: data.message ?? input.text,
      client_name: data.client_name ?? input.authorName,
      client_location: data.client_location ?? input.authorLocation,
      stars: data.stars ?? input.rating,
      is_published: data.is_published ?? input.isPublished,
      project_id: data.project_id ?? input.projectId ?? null,
      order_index: data.order_index ?? nextOrderIndex,
    });
  }

  async createReviewLink(input: CreateReviewLinkInput): Promise<Testimonial> {
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
        project_id: input.projectId,
        token: input.token,
        token_active: true,
        message: "",
        client_name: "",
        client_location: "",
        stars: 5,
        is_published: false,
        order_index: nextOrderIndex,
      })
      .select("id, message, client_name, client_location, stars, is_published, project_id, order_index, token, token_active, projects(name)")
      .single();

    if (error || !data) {
      throw new Error("No se pudo generar el link de reseña");
    }

    return this.mapReviewToEntity(data as ReviewRow);
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
      .select("id, message, client_name, client_location, stars, is_published, project_id, order_index, token, token_active, projects(name)")
      .single();

    if (error || !data) {
      throw new Error("No se pudo actualizar la reseña");
    }

    return this.mapReviewToEntity({
      ...data,
      message: data.message ?? input.text,
      client_name: data.client_name ?? input.authorName,
      client_location: data.client_location ?? input.authorLocation,
      stars: data.stars ?? input.rating,
      is_published: data.is_published ?? input.isPublished,
      project_id: data.project_id ?? input.projectId ?? null,
    });
  }

  async submitByToken(token: string, input: SubmitReviewByTokenInput): Promise<Testimonial> {
    const normalizedToken = token.trim();

    if (!normalizedToken) {
      throw new Error("Token inválido");
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("submit_review_by_token", {
      p_token: normalizedToken,
      p_author_name: input.authorName,
      p_message: input.text,
      p_stars: input.rating,
    });

    const row = Array.isArray(data) ? data[0] : null;

    if (error || !row) {
      throw new Error("No se pudo enviar la reseña");
    }

    return this.mapReviewToEntity(row as ReviewRow);
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
