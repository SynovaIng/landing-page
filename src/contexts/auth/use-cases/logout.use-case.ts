import { Service } from "diod";

import { AuthRepository } from "@/contexts/auth/domain/auth.repository";

@Service()
export class LogoutUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepository.signOut();
  }
}
