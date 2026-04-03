import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createServerAuthUseCases } from "@/contexts/auth/app/server-auth.factory";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const nextUrlHeader = requestHeaders.get("next-url") ?? requestHeaders.get("x-pathname") ?? "/dashboard";
  const nextPath =
    nextUrlHeader.startsWith("/") && !nextUrlHeader.startsWith("//")
      ? nextUrlHeader
      : "/dashboard";
  const { getAuthenticatedUserUseCase } = createServerAuthUseCases();
  const user = await getAuthenticatedUserUseCase.execute();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return children;
}
