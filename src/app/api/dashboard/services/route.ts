import { NextResponse } from "next/server";
import { z } from "zod";

import { container } from "@/config/container";
import { buildUniqueServiceSlug, normalizeServiceSlug } from "@/contexts/services/app/service-slug";
import { CreateServiceUseCase } from "@/contexts/services/use-cases/create-service.use-case";
import { DeleteServicesUseCase } from "@/contexts/services/use-cases/delete-services.use-case";
import { GetAllServicesUseCase } from "@/contexts/services/use-cases/get-all-services.use-case";

const createServiceSchema = z.object({
  icon: z.string().trim().min(1).default("engineering"),
  name: z.string().trim().min(1),
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

  const getAllServicesUseCase = container.get(GetAllServicesUseCase);
  const existingServices = await getAllServicesUseCase.execute({ includeUnpublished: true });
  const baseSlug = normalizeServiceSlug(parsed.data.name);
  const slug = buildUniqueServiceSlug(
    baseSlug,
    existingServices.map((service) => service.slug),
  );

  const useCase = container.get(CreateServiceUseCase);
  const created = await useCase.execute({
    title: parsed.data.name,
    slug,
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
    slug: created.slug,
    description: created.description,
    ctaLabel: created.ctaLabel,
    features: created.features.join(" · "),
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

  const useCase = container.get(DeleteServicesUseCase);
  await useCase.execute(ids);

  return NextResponse.json({ ok: true });
}
