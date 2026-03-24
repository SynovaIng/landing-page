import { NextResponse } from "next/server";
import { z } from "zod";

import { container } from "@/config/container";
import { UpdateTestimonialUseCase } from "@/contexts/testimonials/use-cases/update-testimonial.use-case";

const updateTestimonialSchema = z.object({
  projectId: z.string().trim().optional().nullable(),
  clientName: z.string().trim().min(1),
  clientInitials: z.string().trim().min(1),
  stars: z.number().min(0).max(5),
  message: z.string().trim().min(1),
  isActive: z.boolean().default(true),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();
  const parsed = updateTestimonialSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const useCase = container.get(UpdateTestimonialUseCase);
  const updated = await useCase.execute(id, {
    text: parsed.data.message,
    authorName: parsed.data.clientName,
    authorInitials: parsed.data.clientInitials,
    rating: parsed.data.stars,
    isPublished: parsed.data.isActive,
    projectId: parsed.data.projectId ?? null,
  });

  return NextResponse.json({
    id: updated.id,
    projectId: updated.projectId,
    clientName: updated.authorName,
    clientInitials: updated.authorInitials,
    stars: updated.rating,
    message: updated.text,
    orderIndex: updated.orderIndex,
    isActive: updated.isPublished,
  });
}
