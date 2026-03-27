import { NextResponse } from "next/server";

import { container } from "@/config/container";
import {
  parseProjectMutationRequest,
  toProjectApiResponse,
} from "@/contexts/projects/app/project-api.schema";
import { uploadProjectImages } from "@/contexts/projects/infrastructure/upload-project-image";
import { UpdateProjectUseCase } from "@/contexts/projects/use-cases/update-project.use-case";

const toErrorResponse = (
  status: number,
  error: string,
  code: string,
  detail?: string,
) => {
  return NextResponse.json(
    {
      error,
      code,
      detail,
    },
    { status },
  );
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
};

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
    return toErrorResponse(400, "Payload inválido", "INVALID_PROJECT_MUTATION_PAYLOAD");
  }

  try {
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
      clientId: parsedInput.clientId ?? null,
      companyName: parsedInput.companyName,
      createCompany: parsedInput.createCompany,
    });

    return NextResponse.json(toProjectApiResponse(updated));
  } catch (error) {
    return toErrorResponse(
      500,
      "No se pudo actualizar el proyecto",
      "PROJECT_UPDATE_FAILED",
      getErrorMessage(error, "Error desconocido al actualizar el proyecto."),
    );
  }
}
