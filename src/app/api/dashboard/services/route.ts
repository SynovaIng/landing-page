import { NextResponse } from "next/server";
import { z } from "zod";

import { container } from "@/config/container";
import { CreateServiceUseCase } from "@/contexts/services/use-cases/create-service.use-case";

const createServiceSchema = z.object({
  icon: z.string().trim().min(1).default("engineering"),
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  description: z.string().trim().optional().default(""),
  ctaLabel: z.string().trim().min(1),
  features: z.string().trim().optional().default(""),
  isActive: z.boolean().default(true),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createServiceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const featuresList = parsed.data.features
    .split(/\n|·/)
    .map((item) => item.trim())
    .filter(Boolean);

  const useCase = container.get(CreateServiceUseCase);
  const created = await useCase.execute({
    title: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description,
    ctaLabel: parsed.data.ctaLabel,
    features: featuresList,
    icon: parsed.data.icon,
    isPublished: parsed.data.isActive,
  });

  return NextResponse.json({
    id: created.id,
    icon: created.icon,
    name: created.title,
    slug: parsed.data.slug,
    description: created.description,
    ctaLabel: created.ctaLabel,
    features: created.features.join(" · "),
    isActive: parsed.data.isActive,
  });
}
