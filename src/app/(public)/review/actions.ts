"use server";

import { redirect } from "next/navigation";

import { container } from "@/config/container";
import { SubmitReviewByTokenUseCase } from "@/contexts/testimonials/use-cases/submit-review-by-token.use-case";

const redirectWithError = (token: string, message: string): never => {
  redirect(`/review?token=${encodeURIComponent(token)}&error=${encodeURIComponent(message)}`);
};

export const submitReviewByTokenAction = async (formData: FormData): Promise<void> => {
  const token = String(formData.get("token") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const comment = String(formData.get("comment") ?? "").trim();
  const rating = Number(formData.get("rating") ?? 0);

  if (!token) {
    redirect("/review?error=Token%20inv%C3%A1lido");
  }

  if (!name) {
    redirectWithError(token, "Debes ingresar tu nombre");
  }

  if (!comment) {
    redirectWithError(token, "Debes ingresar un comentario");
  }

  const isHalfStep = Number.isInteger(rating * 2);

  if (!Number.isFinite(rating) || rating < 0.5 || rating > 5 || !isHalfStep) {
    redirectWithError(token, "Debes seleccionar una calificación válida");
  }

  try {
    await container.get(SubmitReviewByTokenUseCase).execute(token, {
      authorName: name,
      text: comment,
      rating,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo enviar la reseña";
    redirectWithError(token, message);
  }

  redirect(`/review?token=${encodeURIComponent(token)}&sent=1`);
};
