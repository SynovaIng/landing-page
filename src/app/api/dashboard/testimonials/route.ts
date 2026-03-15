import { NextResponse } from "next/server";
import { z } from "zod";

import { SupabaseTestimonialRepository } from "@/contexts/testimonials/infrastructure/supabase-testimonial.repository";
import { CreateTestimonialUseCase } from "@/contexts/testimonials/use-cases/create-testimonial.use-case";

const createTestimonialSchema = z.object({
  clientName: z.string().trim().min(1),
  clientInitials: z.string().trim().min(1),
  clientLocation: z.string().trim().min(1),
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

  const useCase = new CreateTestimonialUseCase(new SupabaseTestimonialRepository());
  const created = await useCase.execute({
    text: parsed.data.message,
    authorName: parsed.data.clientName,
    authorInitials: parsed.data.clientInitials,
    authorLocation: parsed.data.clientLocation,
    rating: parsed.data.stars,
    isPublished: parsed.data.isActive,
  });

  return NextResponse.json({
    id: created.id,
    clientName: created.authorName,
    clientInitials: created.authorInitials,
    clientLocation: created.authorLocation,
    stars: created.rating,
    message: created.text,
    isActive: parsed.data.isActive,
  });
}
