import { Service } from "diod";

import type { ProjectCategory } from "@/contexts/projects/domain/project.entity";
import { Project } from "@/contexts/projects/domain/project.entity";
import type { CreateProjectInput } from "@/contexts/projects/domain/project.repository";
import { ProjectRepository } from "@/contexts/projects/domain/project.repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const parseProjectCategory = (value: string): ProjectCategory => {
  if (value === "Residencial" || value === "Comercial" || value === "Industrial") {
    return value;
  }

  return "Comercial";
};

@Service()
export class SupabaseProjectRepository extends ProjectRepository {
  async getAll(): Promise<Project[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, description, type")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((row) => new Project({
      id: String(row.id),
      title: String(row.name ?? ""),
      location: String(row.description ?? "Sin ubicación"),
      category: parseProjectCategory(String(row.type ?? "Comercial")),
      imageUrl: "",
    }));
  }

  async getById(id: string): Promise<Project | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, description, type")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return new Project({
      id: String(data.id),
      title: String(data.name ?? ""),
      location: String(data.description ?? "Sin ubicación"),
      category: parseProjectCategory(String(data.type ?? "Comercial")),
      imageUrl: "",
    });
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("projects")
      .insert({
        name: input.title,
        description: input.description ?? input.location,
        type: input.category,
        is_published: input.isPublished,
      })
      .select("id, name, description, type")
      .single();

    if (error || !data) {
      throw new Error("No se pudo crear el proyecto");
    }

    return new Project({
      id: String(data.id),
      title: String(data.name ?? input.title),
      location: input.location,
      category: parseProjectCategory(String(data.type ?? input.category)),
      imageUrl: "",
    });
  }
}
