import { NextResponse } from "next/server";
import { z } from "zod";

import { container } from "@/config/container";
import { UpdateTestimonialUseCase } from "@/contexts/testimonials/use-cases/update-testimonial.use-case";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { resolveReviewCompany } from "../company-resolver";

const updateTestimonialSchema = z.object({
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

  const useCase = container.get(UpdateTestimonialUseCase);
  const updated = await useCase.execute(id, {
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
    id: updated.id,
    clientId: updated.companyId,
    projectId: updated.projectId,
    companyName: updated.companyName || resolvedCompany.companyName,
    clientName: updated.authorName,
    clientInitials: updated.authorInitials,
    clientLocation: updated.authorLocation,
    stars: updated.rating,
    message: updated.text,
    orderIndex: updated.orderIndex,
    isActive: parsed.data.isActive,
  });
}
