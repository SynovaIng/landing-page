import { PROJECT_IMAGE_BUCKET } from "@/contexts/projects/domain/project-image.constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export { PROJECT_IMAGE_BUCKET };

export const getProjectImagePathFromPublicUrl = (publicUrl: string): string | null => {
  const url = publicUrl.trim();

  if (!url) {
    return null;
  }

  const marker = `/storage/v1/object/public/${PROJECT_IMAGE_BUCKET}/`;
  const markerIndex = url.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  const encodedPath = url.slice(markerIndex + marker.length).split("?")[0];

  if (!encodedPath) {
    return null;
  }

  return decodeURIComponent(encodedPath);
};

const getFileExtension = (filename: string): string => {
  const extension = filename.split(".").pop()?.trim().toLowerCase();

  if (!extension) {
    return "jpg";
  }

  return extension.replace(/[^a-z0-9]/g, "") || "jpg";
};

const createProjectImagePath = (fileName: string, projectId?: string): string => {
  const extension = getFileExtension(fileName);
  const folder = projectId ? `projects/${projectId}` : "projects/pending";

  return `${folder}/${crypto.randomUUID()}.${extension}`;
};

export interface SignedProjectImageUpload {
  path: string;
  token: string;
  publicUrl: string;
}

export const createSignedProjectImageUpload = async (
  fileName: string,
  projectId?: string,
): Promise<SignedProjectImageUpload> => {
  const supabase = await createSupabaseServerClient();
  const path = createProjectImagePath(fileName, projectId);
  const { data, error } = await supabase
    .storage
    .from(PROJECT_IMAGE_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data?.token) {
    throw new Error(`No se pudo preparar la carga de imagen: ${error?.message ?? "token inválido"}`);
  }

  const { data: publicData } = supabase.storage.from(PROJECT_IMAGE_BUCKET).getPublicUrl(path);

  return {
    path,
    token: data.token,
    publicUrl: publicData.publicUrl,
  };
};

export const uploadProjectImage = async (file: File, projectId?: string): Promise<string> => {
  const [uploadedUrl] = await uploadProjectImages([file], projectId);

  if (!uploadedUrl) {
    throw new Error("No se pudo subir la imagen del proyecto");
  }

  return uploadedUrl;
};

export const uploadProjectImages = async (files: File[], projectId?: string): Promise<string[]> => {
  const validFiles = files.filter((file) => file instanceof File && file.size > 0);

  if (validFiles.length === 0) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const uploadedUrls: string[] = [];

  for (const file of validFiles) {
    const filePath = createProjectImagePath(file.name, projectId);

    const { error: uploadError } = await supabase.storage
      .from(PROJECT_IMAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      });

    if (uploadError) {
      throw new Error(`No se pudo subir la imagen: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from(PROJECT_IMAGE_BUCKET).getPublicUrl(filePath);
    uploadedUrls.push(data.publicUrl);
  }

  return uploadedUrls;
};
