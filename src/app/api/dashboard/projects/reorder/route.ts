import { NextResponse } from "next/server";
import { z } from "zod";

import { container } from "@/config/container";
import { ReorderProjectsUseCase } from "@/contexts/projects/use-cases/reorder-projects.use-case";

const reorderProjectsSchema = z.object({
  ids: z.array(z.string().trim().min(1)).min(1),
});

export async function PATCH(request: Request) {
  const body = await request.json();
  const parsed = reorderProjectsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const useCase = container.get(ReorderProjectsUseCase);
  await useCase.execute(parsed.data.ids);

  return NextResponse.json({ success: true });
}
