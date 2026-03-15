import { NextResponse } from "next/server";

import {
  parseProjectMutationRequest,
  toProjectApiResponse,
} from "@/contexts/projects/app/project-api.schema";
import { SupabaseProjectRepository } from "@/contexts/projects/infrastructure/supabase-project.repository";
import { uploadProjectImages } from "@/contexts/projects/infrastructure/upload-project-image";
import { CreateProjectUseCase } from "@/contexts/projects/use-cases/create-project.use-case";

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

  const useCase = new CreateProjectUseCase(new SupabaseProjectRepository());
  const created = await useCase.execute({
    title: parsedInput.name,
    location: parsedInput.location,
    category: parsedInput.type,
    description: parsedInput.description,
    isPublished: parsedInput.isActive,
    serviceIds: parsedInput.serviceIds,
    imageUrls,
  });

  return NextResponse.json(toProjectApiResponse(created, parsedInput));
}
