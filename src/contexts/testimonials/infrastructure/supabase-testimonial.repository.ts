import { Service } from "diod";

import { Testimonial } from "@/contexts/testimonials/domain/testimonial.entity";
import type {
  CreateTestimonialInput,
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
  private getClientNameFromRelation(clientRelation: unknown): string {
    if (Array.isArray(clientRelation)) {
      const first = clientRelation[0] as { name?: unknown } | undefined;
      return String(first?.name ?? "");
    }

    if (clientRelation && typeof clientRelation === "object") {
      return String((clientRelation as { name?: unknown }).name ?? "");
    }

    return "";
  }

  private getProjectNameFromRelation(projectRelation: unknown): string {
    if (Array.isArray(projectRelation)) {
      const first = projectRelation[0] as { name?: unknown } | undefined;
      return String(first?.name ?? "");
    }

    if (projectRelation && typeof projectRelation === "object") {
      return String((projectRelation as { name?: unknown }).name ?? "");
    }

    return "";
  }

  async getAll(): Promise<Testimonial[]> {
    const supabase = await createSupabaseServerClient();

    const queryWithOrder = await supabase
      .from("reviews")
      .select("id, message, client_name, client_location, stars, client_id, project_id, order_index, clients(name), projects(name)")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });

    const query = isMissingOrderIndexError(queryWithOrder.error)
      ? await supabase
          .from("reviews")
          .select("id, message, client_name, client_location, stars, client_id, project_id, clients(name), projects(name)")
          .order("created_at", { ascending: false })
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
      companyId: review.client_id ? String(review.client_id) : null,
      projectId: review.project_id ? String(review.project_id) : null,
      companyName: this.getClientNameFromRelation((review as { clients?: unknown }).clients),
      projectName: this.getProjectNameFromRelation((review as { projects?: unknown }).projects),
      orderIndex: Number((review as { order_index?: number }).order_index ?? 0),
    }));
  }

  async getById(id: string): Promise<Testimonial | null> {
    const supabase = await createSupabaseServerClient();

    const queryWithOrder = await supabase
      .from("reviews")
      .select("id, message, client_name, client_location, stars, client_id, project_id, order_index, clients(name), projects(name)")
      .eq("id", id)
      .maybeSingle();

    const query = isMissingOrderIndexError(queryWithOrder.error)
      ? await supabase
          .from("reviews")
          .select("id, message, client_name, client_location, stars, client_id, project_id, clients(name), projects(name)")
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
      companyId: data.client_id ? String(data.client_id) : null,
      projectId: data.project_id ? String(data.project_id) : null,
      companyName: this.getClientNameFromRelation((data as { clients?: unknown }).clients),
      projectName: this.getProjectNameFromRelation((data as { projects?: unknown }).projects),
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
        client_id: input.clientId ?? null,
        project_id: input.projectId ?? null,
        order_index: nextOrderIndex,
      })
      .select("id, message, client_name, client_location, stars, client_id, project_id, order_index, clients(name), projects(name)")
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
      companyId: data.client_id ? String(data.client_id) : (input.clientId ?? null),
      projectId: data.project_id ? String(data.project_id) : (input.projectId ?? null),
      companyName: this.getClientNameFromRelation((data as { clients?: unknown }).clients),
      projectName: this.getProjectNameFromRelation((data as { projects?: unknown }).projects),
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
        client_id: input.clientId ?? null,
        project_id: input.projectId ?? null,
      })
      .eq("id", id)
      .select("id, message, client_name, client_location, stars, client_id, project_id, order_index, clients(name), projects(name)")
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
      companyId: data.client_id ? String(data.client_id) : (input.clientId ?? null),
      projectId: data.project_id ? String(data.project_id) : (input.projectId ?? null),
      companyName: this.getClientNameFromRelation((data as { clients?: unknown }).clients),
      projectName: this.getProjectNameFromRelation((data as { projects?: unknown }).projects),
      orderIndex: Number(data.order_index ?? 0),
    });
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
