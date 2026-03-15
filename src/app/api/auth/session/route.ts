import { NextResponse } from "next/server";

import { createServerAuthUseCases } from "@/contexts/auth/app/server-auth.factory";

export async function GET() {
  const { checkUserAuthenticatedUseCase, getAuthenticatedUserUseCase } =
    createServerAuthUseCases();
  const authenticated = await checkUserAuthenticatedUseCase.execute();
  const user = authenticated ? await getAuthenticatedUserUseCase.execute() : null;

  return NextResponse.json({ authenticated, user });
}
