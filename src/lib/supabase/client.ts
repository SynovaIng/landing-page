import { createBrowserClient } from "@supabase/ssr";

import { publicEnvs } from "@/config/envs.public";

export const createSupabaseBrowserClient = () => {
  return createBrowserClient(
    publicEnvs.NEXT_PUBLIC_SUPABASE_URL,
    publicEnvs.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  );
};
