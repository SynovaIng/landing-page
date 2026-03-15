import { z } from "zod";

import { type Project, PROJECT_CATEGORIES } from "@/contexts/projects/domain/project.entity";

export const projectMutationSchema = z.object({
  name: z.string().trim().min(1),
  type: z.enum(PROJECT_CATEGORIES),
  location: z.string().trim().min(1),
  description: z.string().trim().optional().default(""),
  serviceIds: z.array(z.string().trim().min(1)).default([]),
  isActive: z.boolean().default(true),
});

export type ProjectMutationInput = z.infer<typeof projectMutationSchema>;

export const projectApiResponseSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  description: z.string(),
  type: z.enum(PROJECT_CATEGORIES),
  location: z.string().trim().min(1),
  imageUrl: z.string().trim().min(1),
  imageUrls: z.array(z.string().trim().min(1)).min(1),
  projectServiceIds: z.array(z.string().trim().min(1)),
  isActive: z.boolean(),
});

export type ProjectApiResponse = z.infer<typeof projectApiResponseSchema>;

const parseBoolean = (value: FormDataEntryValue | null, defaultValue: boolean): boolean => {
  if (!value) {
    return defaultValue;
  }

  const normalized = String(value).trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "on";
};

const parseServiceIds = (value: FormDataEntryValue | null): string[] => {
  if (!value) {
    return [];
  }

  const raw = String(value).trim();
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => String(item).trim())
        .filter((item) => item.length > 0);
    }
  } catch {
  }

  return raw
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

export const parseProjectMutationRequest = async (request: Request): Promise<{
  payload: ProjectMutationInput;
  imageFiles: File[];
}> => {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const multiImageFiles = formData
      .getAll("images")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);
    const legacyImageEntry = formData.get("image");
    const legacyImageFiles = legacyImageEntry instanceof File && legacyImageEntry.size > 0
      ? [legacyImageEntry]
      : [];
    const imageFiles = multiImageFiles.length > 0 ? multiImageFiles : legacyImageFiles;

    const parsed = projectMutationSchema.safeParse({
      name: String(formData.get("name") ?? ""),
      type: String(formData.get("type") ?? ""),
      location: String(formData.get("location") ?? ""),
      description: String(formData.get("description") ?? ""),
      serviceIds: parseServiceIds(formData.get("serviceIds")),
      isActive: parseBoolean(formData.get("isActive"), true),
    });

    if (!parsed.success) {
      throw new Error("INVALID_PROJECT_MUTATION_PAYLOAD");
    }

    return {
      payload: parsed.data,
      imageFiles,
    };
  }

  const jsonBody = await request.json();
  const parsed = projectMutationSchema.safeParse(jsonBody);

  if (!parsed.success) {
    throw new Error("INVALID_PROJECT_MUTATION_PAYLOAD");
  }

  return {
    payload: parsed.data,
    imageFiles: [],
  };
};

export const toProjectApiResponse = (
  project: Project,
  input: Pick<ProjectMutationInput, "description" | "isActive">,
): ProjectApiResponse => {
  return projectApiResponseSchema.parse({
    id: project.id,
    name: project.title,
    description: input.description,
    type: project.category,
    location: project.location,
    imageUrl: project.imageUrl,
    imageUrls: project.imageUrls,
    projectServiceIds: project.serviceIds,
    isActive: input.isActive,
  });
};
