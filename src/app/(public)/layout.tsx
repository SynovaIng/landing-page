import { redirect } from "next/navigation";

import { isAdminEmail } from "@/lib/auth/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && isAdminEmail(user.email)) {
    redirect("/dashboard");
  }

  if (user && !isAdminEmail(user.email)) {
    await supabase.auth.signOut();
  }

  return children;
}
