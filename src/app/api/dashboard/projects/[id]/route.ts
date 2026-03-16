import { NextResponse } from "next/server";

import { container } from "@/config/container";
import {
  parseProjectMutationRequest,
  toProjectApiResponse,
} from "@/contexts/projects/app/project-api.schema";
import { uploadProjectImages } from "@/contexts/projects/infrastructure/upload-project-image";
import { UpdateProjectUseCase } from "@/contexts/projects/use-cases/update-project.use-case";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  let parsedInput;
  let imageFiles: File[] = [];
  let imageKeys: string[] = [];
  let existingImageUrls: string[] = [];
  let imageOrderRefs: string[] = [];

  try {
    const parsedRequest = await parseProjectMutationRequest(request);
    parsedInput = parsedRequest.payload;
    imageFiles = parsedRequest.imageFiles;
    imageKeys = parsedRequest.imageKeys;
    existingImageUrls = parsedRequest.existingImageUrls;
    imageOrderRefs = parsedRequest.imageOrderRefs;
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const uploadedImageUrls = await uploadProjectImages(imageFiles, id);

  const uploadedByKey = new Map<string, string>();
  imageKeys.forEach((key, index) => {
    const uploadedUrl = uploadedImageUrls[index];

    if (uploadedUrl) {
      uploadedByKey.set(key, uploadedUrl);
    }
  });

  const orderedUrls = imageOrderRefs
    .map((ref) => {
      if (ref.startsWith("existing:")) {
        const url = ref.slice("existing:".length);
        return existingImageUrls.includes(url) ? url : "";
      }

      if (ref.startsWith("new:")) {
        const key = ref.slice("new:".length);
        return uploadedByKey.get(key) ?? "";
      }

      return "";
    })
    .filter((url) => url.length > 0);

  const imageUrls = orderedUrls.length > 0
    ? orderedUrls
    : [...existingImageUrls, ...uploadedImageUrls];

  const useCase = container.get(UpdateProjectUseCase);
  const updated = await useCase.execute({
    id,
    title: parsedInput.name,
    location: parsedInput.location,
    category: parsedInput.type,
    description: parsedInput.description,
    isPublished: parsedInput.isActive,
    serviceIds: parsedInput.serviceIds,
    imageUrls,
  });

  return NextResponse.json(toProjectApiResponse(updated));
}
