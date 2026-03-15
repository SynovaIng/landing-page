import { NextResponse } from "next/server";

import { createServerAuthUseCases } from "@/contexts/auth/app/server-auth.factory";

export async function POST() {
  const { logoutUseCase } = createServerAuthUseCases();
  await logoutUseCase.execute();

  return NextResponse.json({ success: true });
}
