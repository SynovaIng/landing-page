import { NextResponse } from "next/server";

import { createServerAuthUseCases } from "@/contexts/auth/app/server-auth.factory";

export async function GET() {
  const { checkUserAuthenticatedUseCase } = createServerAuthUseCases();
  const authenticated = await checkUserAuthenticatedUseCase.execute();

  return NextResponse.json({ authenticated });
}
