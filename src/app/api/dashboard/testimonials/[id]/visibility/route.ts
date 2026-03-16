import { NextResponse } from "next/server";
import { z } from "zod";

import { container } from "@/config/container";
import { SetTestimonialVisibilityUseCase } from "@/contexts/testimonials/use-cases/set-testimonial-visibility.use-case";

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

  const useCase = container.get(SetTestimonialVisibilityUseCase);
  const updated = await useCase.execute(id, parsed.data.isActive);

  return NextResponse.json({
    id: updated.id,
    isActive: updated.isPublished,
  });
}
