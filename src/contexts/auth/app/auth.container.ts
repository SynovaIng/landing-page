import type { ContainerBuilder } from "diod";

import { AuthRepository } from "@/contexts/auth/domain/auth.repository";
import { SupabaseAuthRepository } from "@/contexts/auth/infrastructure/supabase-auth.repository";
import { GetAuthenticatedUserUseCase } from "@/contexts/auth/use-cases/get-authenticated-user.use-case";
import { LoginUseCase } from "@/contexts/auth/use-cases/login.use-case";
import { LogoutUseCase } from "@/contexts/auth/use-cases/logout.use-case";

export const registerAuthContainer = (builder: ContainerBuilder): void => {
  builder.register(AuthRepository).useClass(SupabaseAuthRepository).asSingleton();

  builder.registerAndUse(LoginUseCase);
  builder.registerAndUse(GetAuthenticatedUserUseCase);
  builder.registerAndUse(LogoutUseCase);
};
