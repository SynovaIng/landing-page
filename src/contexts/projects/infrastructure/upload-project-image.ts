import { createSupabaseServerClient } from "@/lib/supabase/server";

const PROJECT_IMAGE_BUCKET = "project-images";

const getFileExtension = (filename: string): string => {
  const extension = filename.split(".").pop()?.trim().toLowerCase();

  if (!extension) {
    return "jpg";
  }

  return extension.replace(/[^a-z0-9]/g, "") || "jpg";
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
  const folder = projectId ? `projects/${projectId}` : "projects/pending";

  const uploadedUrls: string[] = [];

  for (const file of validFiles) {
    const extension = getFileExtension(file.name);
    const filePath = `${folder}/${crypto.randomUUID()}.${extension}`;

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
