import { Service } from "diod";

import { AuthRepository } from "@/contexts/auth/domain/auth.repository";
import type { AuthUser } from "@/contexts/auth/domain/auth-user.entity";

@Service()
export class GetAuthenticatedUserUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<AuthUser | null> {
    return this.authRepository.getAuthenticatedUser();
  }
}
