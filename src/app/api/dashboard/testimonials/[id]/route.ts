import { NextResponse } from "next/server";
import { z } from "zod";

import { container } from "@/config/container";
import { UpdateTestimonialUseCase } from "@/contexts/testimonials/use-cases/update-testimonial.use-case";

const updateTestimonialSchema = z.object({
  clientId: z.uuid().trim().optional().nullable(),
  clientName: z.string().trim().min(1),
  clientInitials: z.string().trim().min(1),
  clientLocation: z.string().trim().min(1),
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
    authorLocation: parsed.data.clientLocation,
    rating: parsed.data.stars,
    isPublished: parsed.data.isActive,
    clientId: parsed.data.clientId ?? null,
  });

  return NextResponse.json({
    id: updated.id,
    clientId: updated.companyId,
    companyName: updated.companyName,
    clientName: updated.authorName,
    clientInitials: updated.authorInitials,
    clientLocation: updated.authorLocation,
    stars: updated.rating,
    message: updated.text,
    isActive: parsed.data.isActive,
  });
}
