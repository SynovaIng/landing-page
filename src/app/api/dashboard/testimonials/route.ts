import { NextResponse } from "next/server";
import { z } from "zod";

import { container } from "@/config/container";
import { CreateTestimonialUseCase } from "@/contexts/testimonials/use-cases/create-testimonial.use-case";
import { DeleteTestimonialsUseCase } from "@/contexts/testimonials/use-cases/delete-testimonials.use-case";

const createTestimonialSchema = z.object({
  projectId: z.string().trim().optional().nullable(),
  clientName: z.string().trim().min(1),
  clientInitials: z.string().trim().min(1),
  stars: z.number().min(0).max(5),
  message: z.string().trim().min(1),
  isActive: z.boolean().default(true),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createTestimonialSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const useCase = container.get(CreateTestimonialUseCase);
  const created = await useCase.execute({
    text: parsed.data.message,
    authorName: parsed.data.clientName,
    authorInitials: parsed.data.clientInitials,
    rating: parsed.data.stars,
    isPublished: parsed.data.isActive,
    projectId: parsed.data.projectId ?? null,
  });

  return NextResponse.json({
    id: created.id,
    projectId: created.projectId,
    clientName: created.authorName,
    clientInitials: created.authorInitials,
    stars: created.rating,
    message: created.text,
    orderIndex: created.orderIndex,
    isActive: created.isPublished,
  });
}

export async function DELETE(request: Request) {
  const body = await request.json().catch(() => null);
  const ids = Array.isArray(body?.ids)
    ? body.ids.map((value: unknown) => String(value).trim()).filter((value: string) => value.length > 0)
    : [];

  if (ids.length === 0) {
    return NextResponse.json({ error: "Debes indicar al menos un ID para eliminar." }, { status: 400 });
  }

  const useCase = container.get(DeleteTestimonialsUseCase);
  await useCase.execute(ids);

  return NextResponse.json({ ok: true });
}
