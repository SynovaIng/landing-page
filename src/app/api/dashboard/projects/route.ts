import { NextResponse } from "next/server";
import { z } from "zod";

import { SupabaseProjectRepository } from "@/contexts/projects/infrastructure/supabase-project.repository";
import { CreateProjectUseCase } from "@/contexts/projects/use-cases/create-project.use-case";

const createProjectSchema = z.object({
  name: z.string().trim().min(1),
  type: z.string().trim().min(1),
  location: z.string().trim().min(1),
  description: z.string().trim().optional().default(""),
  isActive: z.boolean().default(true),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createProjectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const useCase = new CreateProjectUseCase(new SupabaseProjectRepository());
  const created = await useCase.execute({
    title: parsed.data.name,
    location: parsed.data.location,
    category: parsed.data.type,
    description: parsed.data.description,
    isPublished: parsed.data.isActive,
  });

  return NextResponse.json({
    id: created.id,
    name: created.title,
    description: parsed.data.description,
    type: created.category,
    location: created.location,
    isActive: parsed.data.isActive,
  });
}
