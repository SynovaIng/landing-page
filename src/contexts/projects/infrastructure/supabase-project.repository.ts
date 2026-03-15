import { Service } from "diod";

import type { ProjectCategory } from "@/contexts/projects/domain/project.entity";
import {
  Project,
  PROJECT_IMAGE_PLACEHOLDER,
} from "@/contexts/projects/domain/project.entity";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "@/contexts/projects/domain/project.repository";
import { ProjectRepository } from "@/contexts/projects/domain/project.repository";
import {
  getProjectImagePathFromPublicUrl,
  PROJECT_IMAGE_BUCKET,
} from "@/contexts/projects/infrastructure/upload-project-image";
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
    const [{ data, error }, { data: projectServicesData }, { data: projectImagesData }] = await Promise.all([
      supabase
        .from("projects")
        .select("id, name, description, type")
        .order("created_at", { ascending: false }),
      supabase.from("project_services").select("project_id, service_id"),
      supabase
        .from("project_images")
        .select("project_id, url, is_cover, order_index, created_at")
        .order("is_cover", { ascending: false })
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: true }),
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

    const coverImageByProject = new Map<string, string>();
    const imageUrlsByProject = new Map<string, string[]>();
    (projectImagesData ?? []).forEach((item) => {
      const projectId = String(item.project_id);
      const imageUrl = String(item.url);

      const currentUrls = imageUrlsByProject.get(projectId) ?? [];
      currentUrls.push(imageUrl);
      imageUrlsByProject.set(projectId, currentUrls);

      if (!coverImageByProject.has(projectId)) {
        coverImageByProject.set(projectId, imageUrl);
      }
    });

    return data.map((row) => new Project({
      id: String(row.id),
      title: String(row.name ?? ""),
      location: String(row.description ?? "Sin ubicación"),
      category: parseProjectCategory(String(row.type ?? "Comercial")),
      imageUrl: coverImageByProject.get(String(row.id)) ?? PROJECT_IMAGE_PLACEHOLDER,
      imageUrls: imageUrlsByProject.get(String(row.id)) ?? [PROJECT_IMAGE_PLACEHOLDER],
      serviceIds: serviceIdsByProject.get(String(row.id)) ?? [],
    }));
  }

  async getById(id: string): Promise<Project | null> {
    const supabase = await createSupabaseServerClient();
    const [{ data, error }, { data: projectServicesData }, { data: projectImagesData }] = await Promise.all([
      supabase
        .from("projects")
        .select("id, name, description, type")
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("project_services")
        .select("service_id")
        .eq("project_id", id),
      supabase
        .from("project_images")
        .select("url, is_cover, order_index, created_at")
        .eq("project_id", id)
        .order("is_cover", { ascending: false })
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

    if (error || !data) {
      return null;
    }

    return new Project({
      id: String(data.id),
      title: String(data.name ?? ""),
      location: String(data.description ?? "Sin ubicación"),
      category: parseProjectCategory(String(data.type ?? "Comercial")),
      imageUrl: String(projectImagesData?.[0]?.url ?? PROJECT_IMAGE_PLACEHOLDER),
      imageUrls: (projectImagesData ?? []).map((item) => String(item.url)),
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

    const imageUrls = Array.from(new Set((input.imageUrls ?? []).map((value) => value.trim()).filter(Boolean)));

    if (imageUrls.length > 0) {
      const imagesPayload = imageUrls.map((imageUrl, index) => ({
        project_id: data.id,
        url: imageUrl,
        is_cover: index === 0,
        order_index: index,
      }));

      const { error: imageError } = await supabase
        .from("project_images")
        .insert(imagesPayload);

      if (imageError) {
        throw new Error("No se pudieron guardar las imágenes del proyecto");
      }
    }

    return new Project({
      id: String(data.id),
      title: String(data.name ?? input.title),
      location: input.location,
      category: parseProjectCategory(String(data.type ?? input.category)),
      imageUrl: imageUrls[0] ?? PROJECT_IMAGE_PLACEHOLDER,
      imageUrls: imageUrls.length > 0 ? imageUrls : [PROJECT_IMAGE_PLACEHOLDER],
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

    const imageUrls = Array.from(new Set((input.imageUrls ?? []).map((value) => value.trim()).filter(Boolean)));

    const { data: existingImagesData, error: existingImagesError } = await supabase
      .from("project_images")
      .select("url")
      .eq("project_id", input.id);

    if (existingImagesError) {
      throw new Error("No se pudieron consultar las imágenes actuales del proyecto");
    }

    const existingImageUrls = (existingImagesData ?? []).map((item) => String(item.url));
    const removedImageUrls = existingImageUrls.filter((url) => !imageUrls.includes(url));
    const removedStoragePaths = removedImageUrls
      .map((url) => getProjectImagePathFromPublicUrl(url))
      .filter((path): path is string => Boolean(path));

    const { error: deleteImagesError } = await supabase
      .from("project_images")
      .delete()
      .eq("project_id", input.id);

    if (deleteImagesError) {
      throw new Error("No se pudieron reemplazar las imágenes del proyecto");
    }

    if (imageUrls.length > 0) {
      const imagesPayload = imageUrls.map((imageUrl, index) => ({
        project_id: input.id,
        url: imageUrl,
        is_cover: index === 0,
        order_index: index,
      }));

      const { error: insertImagesError } = await supabase
        .from("project_images")
        .insert(imagesPayload);

      if (insertImagesError) {
        throw new Error("No se pudieron guardar las nuevas imágenes del proyecto");
      }
    }

    if (removedStoragePaths.length > 0) {
      const { error: removeStorageError } = await supabase
        .storage
        .from(PROJECT_IMAGE_BUCKET)
        .remove(removedStoragePaths);

      if (removeStorageError) {
        throw new Error(`Se actualizaron las imágenes en BD, pero falló su eliminación en Storage: ${removeStorageError.message}`);
      }
    }

    const { data: updatedCoverData } = await supabase
      .from("project_images")
      .select("url, is_cover, order_index, created_at")
      .eq("project_id", input.id)
      .order("is_cover", { ascending: false })
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: true });

    return new Project({
      id: String(data.id),
      title: String(data.name ?? input.title),
      location: input.location,
      category: parseProjectCategory(String(data.type ?? input.category)),
      imageUrl: String(updatedCoverData?.[0]?.url ?? PROJECT_IMAGE_PLACEHOLDER),
      imageUrls: (updatedCoverData ?? []).map((item) => String(item.url)),
      serviceIds: uniqueServiceIds,
    });
  }
}
