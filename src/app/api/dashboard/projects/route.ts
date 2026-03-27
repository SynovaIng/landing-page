import { NextResponse } from "next/server";

import { container } from "@/config/container";
import {
  parseProjectMutationRequest,
  toProjectApiResponse,
} from "@/contexts/projects/app/project-api.schema";
import { uploadProjectImages } from "@/contexts/projects/infrastructure/upload-project-image";
import { CreateProjectUseCase } from "@/contexts/projects/use-cases/create-project.use-case";
import { DeleteProjectsUseCase } from "@/contexts/projects/use-cases/delete-projects.use-case";

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

export async function POST(request: Request) {
  let parsedInput;
  let imageFiles: File[] = [];
  let uploadedImageUrls: string[] = [];

  try {
    const parsedRequest = await parseProjectMutationRequest(request);
    parsedInput = parsedRequest.payload;
    imageFiles = parsedRequest.imageFiles;
    uploadedImageUrls = parsedRequest.uploadedImageUrls;
  } catch {
    return toErrorResponse(400, "Payload inválido", "INVALID_PROJECT_MUTATION_PAYLOAD");
  }

  try {
    const uploadedFromRequest = await uploadProjectImages(imageFiles);
    const imageUrls = Array.from(new Set([
      ...uploadedImageUrls,
      ...uploadedFromRequest,
    ].map((url) => String(url).trim()).filter((url) => url.length > 0)));

    const useCase = container.get(CreateProjectUseCase);
    const created = await useCase.execute({
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

    return NextResponse.json(toProjectApiResponse(created));
  } catch (error) {
    return toErrorResponse(
      500,
      "No se pudo crear el proyecto",
      "PROJECT_CREATE_FAILED",
      getErrorMessage(error, "Error desconocido al crear el proyecto."),
    );
  }
}

export async function DELETE(request: Request) {
  const body = await request.json().catch(() => null);
  const ids = Array.isArray(body?.ids)
    ? body.ids.map((value: unknown) => String(value).trim()).filter((value: string) => value.length > 0)
    : [];

  if (ids.length === 0) {
    return toErrorResponse(400, "Debes indicar al menos un ID para eliminar.", "MISSING_PROJECT_IDS");
  }

  try {
    const useCase = container.get(DeleteProjectsUseCase);
    await useCase.execute(ids);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return toErrorResponse(
      500,
      "No se pudieron eliminar los proyectos",
      "PROJECT_DELETE_FAILED",
      getErrorMessage(error, "Error desconocido al eliminar proyectos."),
    );
  }
}
