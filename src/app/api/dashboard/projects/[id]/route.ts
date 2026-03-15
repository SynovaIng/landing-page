import { NextResponse } from "next/server";
import { z } from "zod";

import { SupabaseProjectRepository } from "@/contexts/projects/infrastructure/supabase-project.repository";
import { UpdateProjectUseCase } from "@/contexts/projects/use-cases/update-project.use-case";

const updateProjectSchema = z.object({
  name: z.string().trim().min(1),
  type: z.string().trim().min(1),
  location: z.string().trim().min(1),
  description: z.string().trim().optional().default(""),
  serviceIds: z.array(z.string().trim().min(1)).default([]),
  isActive: z.boolean().default(true),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();
  const parsed = updateProjectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const useCase = new UpdateProjectUseCase(new SupabaseProjectRepository());
  const updated = await useCase.execute({
    id,
    title: parsed.data.name,
    location: parsed.data.location,
    category: parsed.data.type,
    description: parsed.data.description,
    isPublished: parsed.data.isActive,
    serviceIds: parsed.data.serviceIds,
  });

  return NextResponse.json({
    id: updated.id,
    name: updated.title,
    description: parsed.data.description,
    type: updated.category,
    location: updated.location,
    projectServiceIds: updated.serviceIds,
    isActive: parsed.data.isActive,
  });
}
