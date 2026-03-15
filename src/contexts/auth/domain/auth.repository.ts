import type { AuthUser } from "@/contexts/auth/domain/auth-user.entity";

export abstract class AuthRepository {
  abstract signInWithPassword(email: string, password: string): Promise<void>;
  abstract getAuthenticatedUser(): Promise<AuthUser | null>;
  abstract isAuthenticated(): Promise<boolean>;
  abstract signOut(): Promise<void>;
}
