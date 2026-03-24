import { NextResponse } from "next/server";
import { z } from "zod";

import { container } from "@/config/container";
import { CreateReviewLinkUseCase } from "@/contexts/testimonials/use-cases/create-review-link.use-case";

const createReviewLinkSchema = z.object({
  projectId: z.string().trim().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createReviewLinkSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const useCase = container.get(CreateReviewLinkUseCase);
  const requestBaseUrl = new URL(request.url).origin;

  const link = await useCase.execute(parsed.data.projectId, requestBaseUrl);

  return NextResponse.json({ link });
}
