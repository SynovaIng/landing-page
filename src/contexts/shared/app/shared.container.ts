import type { ContainerBuilder } from "diod";

import { EmailService } from "@/contexts/shared/domain/email.service";
import { ResendEmailService } from "@/contexts/shared/infrastructure/resend-email.service";
import { SupabaseClientService } from "@/contexts/shared/infrastructure/supabase.client";

export const registerSharedContainer = (builder: ContainerBuilder): void => {
  // Infrastructure
  builder.register(EmailService).useClass(ResendEmailService).asSingleton();
  builder.registerAndUse(SupabaseClientService).asSingleton();
};
