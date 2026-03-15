import { NextResponse } from "next/server";

import {
  parseProjectMutationRequest,
  toProjectApiResponse,
} from "@/contexts/projects/app/project-api.schema";
import { SupabaseProjectRepository } from "@/contexts/projects/infrastructure/supabase-project.repository";
import { uploadProjectImages } from "@/contexts/projects/infrastructure/upload-project-image";
import { UpdateProjectUseCase } from "@/contexts/projects/use-cases/update-project.use-case";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  let parsedInput;
  let imageFiles: File[] = [];

  try {
    const parsedRequest = await parseProjectMutationRequest(request);
    parsedInput = parsedRequest.payload;
    imageFiles = parsedRequest.imageFiles;
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const imageUrls = await uploadProjectImages(imageFiles, id);

  const useCase = new UpdateProjectUseCase(new SupabaseProjectRepository());
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

  return NextResponse.json(toProjectApiResponse(updated, parsedInput));
}
