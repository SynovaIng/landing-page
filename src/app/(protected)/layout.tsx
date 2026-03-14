import { redirect } from "next/navigation";

import { createServerAuthUseCases } from "@/contexts/auth/app/server-auth.factory";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getAuthenticatedUserUseCase } = await createServerAuthUseCases();
  const user = await getAuthenticatedUserUseCase.execute();

  if (!user) {
    redirect("/login");
  }

  return children;
}
