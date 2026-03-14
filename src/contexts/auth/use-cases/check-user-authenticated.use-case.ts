import { Service } from "diod";

import { AuthRepository } from "@/contexts/auth/domain/auth.repository";

@Service()
export class CheckUserAuthenticatedUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<boolean> {
    return this.authRepository.isAuthenticated();
  }
}
