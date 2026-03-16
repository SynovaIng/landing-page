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

    const { data, error } = await supabase
      .from("reviews")
      .select("id, message, client_name, client_location, stars, client_id, project_id, clients(name), projects(name)")
      .order("created_at", { ascending: false });

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
    }));
  }

  async getById(id: string): Promise<Testimonial | null> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("reviews")
      .select("id, message, client_name, client_location, stars, client_id, project_id, clients(name), projects(name)")
      .eq("id", id)
      .maybeSingle();

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
    });
  }

  async create(input: CreateTestimonialInput): Promise<Testimonial> {
    const supabase = await createSupabaseServerClient();

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
      })
      .select("id, message, client_name, client_location, stars, client_id, project_id, clients(name), projects(name)")
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
      .select("id, message, client_name, client_location, stars, client_id, project_id, clients(name), projects(name)")
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
    });
  }
}
