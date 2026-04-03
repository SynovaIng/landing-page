"use server";

import { redirect } from "next/navigation";

import { createServerAuthUseCases } from "@/contexts/auth/app/server-auth.factory";

export const logoutAction = async (): Promise<void> => {
  const { logoutUseCase } = createServerAuthUseCases();
  await logoutUseCase.execute();
  redirect("/login");
};
