import { Service } from "diod";

import type { ProjectCategory } from "@/contexts/projects/domain/project.entity";
import { Project } from "@/contexts/projects/domain/project.entity";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "@/contexts/projects/domain/project.repository";
import { ProjectRepository } from "@/contexts/projects/domain/project.repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const parseProjectCategory = (value: string): ProjectCategory => {
  const normalized = value.toLowerCase();

  if (normalized === "residencial") {
    return "Residencial";
  }

  if (normalized === "industrial") {
    return "Industrial";
  }

  if (normalized === "comercial") {
    return "Comercial";
  }

  return "Comercial";
};

const toDbProjectCategory = (value: string): "residencial" | "industrial" | "comercial" => {
  const normalized = value.toLowerCase();

  if (normalized === "residencial") {
    return "residencial";
  }

  if (normalized === "industrial") {
    return "industrial";
  }

  return "comercial";
};

@Service()
export class SupabaseProjectRepository extends ProjectRepository {
  async getAll(): Promise<Project[]> {
    const supabase = await createSupabaseServerClient();
    const [{ data, error }, { data: projectServicesData }] = await Promise.all([
      supabase
        .from("projects")
        .select("id, name, description, type")
        .order("created_at", { ascending: false }),
      supabase.from("project_services").select("project_id, service_id"),
    ]);

    if (error || !data) {
      return [];
    }

    const serviceIdsByProject = new Map<string, string[]>();
    (projectServicesData ?? []).forEach((item) => {
      const projectId = String(item.project_id);
      const current = serviceIdsByProject.get(projectId) ?? [];
      current.push(String(item.service_id));
      serviceIdsByProject.set(projectId, current);
    });

    return data.map((row) => new Project({
      id: String(row.id),
      title: String(row.name ?? ""),
      location: String(row.description ?? "Sin ubicación"),
      category: parseProjectCategory(String(row.type ?? "Comercial")),
      imageUrl: "",
      serviceIds: serviceIdsByProject.get(String(row.id)) ?? [],
    }));
  }

  async getById(id: string): Promise<Project | null> {
    const supabase = await createSupabaseServerClient();
    const [{ data, error }, { data: projectServicesData }] = await Promise.all([
      supabase
        .from("projects")
        .select("id, name, description, type")
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("project_services")
        .select("service_id")
        .eq("project_id", id),
    ]);

    if (error || !data) {
      return null;
    }

    return new Project({
      id: String(data.id),
      title: String(data.name ?? ""),
      location: String(data.description ?? "Sin ubicación"),
      category: parseProjectCategory(String(data.type ?? "Comercial")),
      imageUrl: "",
      serviceIds: (projectServicesData ?? []).map((item) => String(item.service_id)),
    });
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("projects")
      .insert({
        name: input.title,
        description: input.description ?? input.location,
        type: toDbProjectCategory(input.category),
        is_published: input.isPublished,
      })
      .select("id, name, description, type")
      .single();

    if (error || !data) {
      throw new Error("No se pudo crear el proyecto");
    }

    const uniqueServiceIds = [...new Set(input.serviceIds.filter(Boolean))];
    if (uniqueServiceIds.length > 0) {
      const relationRows = uniqueServiceIds.map((serviceId) => ({
        project_id: data.id,
        service_id: serviceId,
      }));

      const { error: relationError } = await supabase.from("project_services").insert(relationRows);
      if (relationError) {
        throw new Error("No se pudieron asociar servicios al proyecto");
      }
    }

    return new Project({
      id: String(data.id),
      title: String(data.name ?? input.title),
      location: input.location,
      category: parseProjectCategory(String(data.type ?? input.category)),
      imageUrl: "",
      serviceIds: uniqueServiceIds,
    });
  }

  async update(input: UpdateProjectInput): Promise<Project> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("projects")
      .update({
        name: input.title,
        description: input.description ?? input.location,
        type: toDbProjectCategory(input.category),
        is_published: input.isPublished,
      })
      .eq("id", input.id)
      .select("id, name, description, type")
      .single();

    if (error || !data) {
      throw new Error("No se pudo actualizar el proyecto");
    }

    const { error: deleteError } = await supabase
      .from("project_services")
      .delete()
      .eq("project_id", input.id);

    if (deleteError) {
      throw new Error("No se pudieron limpiar los servicios del proyecto");
    }

    const uniqueServiceIds = [...new Set(input.serviceIds.filter(Boolean))];
    if (uniqueServiceIds.length > 0) {
      const relationRows = uniqueServiceIds.map((serviceId) => ({
        project_id: input.id,
        service_id: serviceId,
      }));

      const { error: relationError } = await supabase.from("project_services").insert(relationRows);
      if (relationError) {
        throw new Error("No se pudieron guardar los servicios del proyecto");
      }
    }

    return new Project({
      id: String(data.id),
      title: String(data.name ?? input.title),
      location: input.location,
      category: parseProjectCategory(String(data.type ?? input.category)),
      imageUrl: "",
      serviceIds: uniqueServiceIds,
    });
  }
}
