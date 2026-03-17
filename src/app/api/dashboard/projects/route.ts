import { NextResponse } from "next/server";

import { container } from "@/config/container";
import {
  parseProjectMutationRequest,
  toProjectApiResponse,
} from "@/contexts/projects/app/project-api.schema";
import { uploadProjectImages } from "@/contexts/projects/infrastructure/upload-project-image";
import { CreateProjectUseCase } from "@/contexts/projects/use-cases/create-project.use-case";
import { DeleteProjectsUseCase } from "@/contexts/projects/use-cases/delete-projects.use-case";

export async function POST(request: Request) {
  let parsedInput;
  let imageFiles: File[] = [];

  try {
    const parsedRequest = await parseProjectMutationRequest(request);
    parsedInput = parsedRequest.payload;
    imageFiles = parsedRequest.imageFiles;
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const imageUrls = await uploadProjectImages(imageFiles);

  const useCase = container.get(CreateProjectUseCase);
  const created = await useCase.execute({
    title: parsedInput.name,
    location: parsedInput.location,
    category: parsedInput.type,
    description: parsedInput.description,
    isPublished: parsedInput.isActive,
    serviceIds: parsedInput.serviceIds,
    imageUrls,
  });

  return NextResponse.json(toProjectApiResponse(created));
}

export async function DELETE(request: Request) {
  const body = await request.json().catch(() => null);
  const ids = Array.isArray(body?.ids)
    ? body.ids.map((value: unknown) => String(value).trim()).filter((value: string) => value.length > 0)
    : [];

  if (ids.length === 0) {
    return NextResponse.json({ error: "Debes indicar al menos un ID para eliminar." }, { status: 400 });
  }

  const useCase = container.get(DeleteProjectsUseCase);
  await useCase.execute(ids);

  return NextResponse.json({ ok: true });
}
