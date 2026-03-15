import type { ContainerBuilder } from "diod";

import { SupabaseClientService } from "@/contexts/shared/infrastructure/supabase.client";

export const registerSharedContainer = (builder: ContainerBuilder): void => {
  // Infrastructure
  builder.registerAndUse(SupabaseClientService).asSingleton();
};
