import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { envs } from "@/config/envs";

export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    envs.NEXT_PUBLIC_SUPABASE_URL,
    envs.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, options, value }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
          }
        },
      },
    },
  );
};
