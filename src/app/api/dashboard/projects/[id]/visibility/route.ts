import { NextResponse } from "next/server";
import { z } from "zod";

import { container } from "@/config/container";
import { SetProjectVisibilityUseCase } from "@/contexts/projects/use-cases/set-project-visibility.use-case";

const updateVisibilitySchema = z.object({
  isActive: z.boolean(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();
  const parsed = updateVisibilitySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const useCase = container.get(SetProjectVisibilityUseCase);
  const updated = await useCase.execute(id, parsed.data.isActive);

  return NextResponse.json({
    id: updated.id,
    isActive: updated.isPublished,
  });
}
