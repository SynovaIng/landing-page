import { NextResponse } from "next/server";
import { z } from "zod";

import { container } from "@/config/container";
import { CreateTestimonialUseCase } from "@/contexts/testimonials/use-cases/create-testimonial.use-case";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { resolveReviewCompany } from "./company-resolver";

const createTestimonialSchema = z.object({
  clientId: z.uuid().trim().optional().nullable(),
  projectId: z.uuid().trim().optional().nullable(),
  companyName: z.string().trim().optional().default(""),
  createCompany: z.boolean().optional().default(false),
  companyLocation: z.string().trim().optional().default(""),
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

  const supabase = await createSupabaseServerClient();

  let resolvedCompany: { clientId: string | null; companyName: string };

  try {
    resolvedCompany = await resolveReviewCompany({
      supabase,
      clientId: parsed.data.clientId ?? null,
      companyName: parsed.data.companyName,
      createCompany: parsed.data.createCompany,
      companyLocation: parsed.data.companyLocation,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo resolver la empresa.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const useCase = container.get(CreateTestimonialUseCase);
  const created = await useCase.execute({
    text: parsed.data.message,
    authorName: parsed.data.clientName,
    authorInitials: parsed.data.clientInitials,
    authorLocation: parsed.data.clientLocation,
    rating: parsed.data.stars,
    isPublished: parsed.data.isActive,
    clientId: resolvedCompany.clientId,
    projectId: parsed.data.projectId ?? null,
  });

  return NextResponse.json({
    id: created.id,
    clientId: created.companyId,
    projectId: created.projectId,
    companyName: created.companyName || resolvedCompany.companyName,
    clientName: created.authorName,
    clientInitials: created.authorInitials,
    clientLocation: created.authorLocation,
    stars: created.rating,
    message: created.text,
    orderIndex: created.orderIndex,
    isActive: created.isPublished,
  });
}
