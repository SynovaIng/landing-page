"use server";

import { redirect } from "next/navigation";

import { createServerAuthUseCases } from "@/contexts/auth/app/server-auth.factory";

const toLoginWithError = (message: string, next?: string) => {
  const params = new URLSearchParams({
    error: message,
  });

  if (next) {
    params.set("next", next);
  }

  redirect(`/login?${params.toString()}`);
};

const sanitizeNextPath = (value: string): string | null => {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value;
};

export const loginAction = async (formData: FormData): Promise<void> => {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const rawNext = String(formData.get("next") ?? "").trim();
  const next = sanitizeNextPath(rawNext);

  const { loginUseCase } = createServerAuthUseCases();

  try {
    await loginUseCase.execute(email, password);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid credentials";
    toLoginWithError(message, next ?? undefined);
  }

  redirect(next ?? "/dashboard");
};
