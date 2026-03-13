import { createBrowserClient } from "@supabase/ssr";

import { envs } from "@/config/envs";

export const createSupabaseBrowserClient = () => {
  return createBrowserClient(
    envs.NEXT_PUBLIC_SUPABASE_URL,
    envs.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  );
};
