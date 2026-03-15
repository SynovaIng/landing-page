import { Service } from "diod";

import { AuthRepository } from "@/contexts/auth/domain/auth.repository";

@Service()
export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(email: string, password: string): Promise<void> {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    await this.authRepository.signInWithPassword(email, password);

    const user = await this.authRepository.getAuthenticatedUser();
    if (!user) {
      await this.authRepository.signOut();
      throw new Error("Unable to validate session");
    }
  }
}
