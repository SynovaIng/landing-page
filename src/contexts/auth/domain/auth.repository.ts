import type { AuthUser } from "@/contexts/auth/domain/auth-user.entity";

export abstract class AuthRepository {
  abstract signInWithPassword(email: string, password: string): Promise<void>;
  abstract getAuthenticatedUser(): Promise<AuthUser | null>;
  abstract signOut(): Promise<void>;
}
