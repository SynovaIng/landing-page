import { NextResponse } from "next/server";
import { z } from "zod";

import { container } from "@/config/container";
import { UpdateServiceUseCase } from "@/contexts/services/use-cases/update-service.use-case";

const updateServiceSchema = z.object({
  icon: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  slug: z.string().trim().min(1).optional(),
  description: z.string().trim().optional(),
  ctaLabel: z.string().trim().min(1).optional(),
  features: z.string().trim().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Falta el ID del servicio" }, { status: 400 });
  }

  const body = await request.json();
  const parsed = updateServiceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const featuresList = parsed.data.features !== undefined
    ? parsed.data.features.split(/\n|·/).map((item) => item.trim()).filter(Boolean)
    : undefined;

  const useCase = container.get(UpdateServiceUseCase);
  
  try {
    const updated = await useCase.execute(id, {
      title: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      ctaLabel: parsed.data.ctaLabel,
      features: featuresList,
      icon: parsed.data.icon,
      isPublished: parsed.data.isActive,
    });

    return NextResponse.json({
      id: updated.id,
      icon: updated.icon,
      name: updated.title,
      slug: updated.slug,
      description: updated.description,
      ctaLabel: updated.ctaLabel,
      features: updated.features.join(" · "),
      orderIndex: updated.orderIndex,
      isActive: updated.isPublished,
    });
  } catch (_error) {
    return NextResponse.json({ error: "Error al actualizar el servicio" }, { status: 500 });
  }
}
