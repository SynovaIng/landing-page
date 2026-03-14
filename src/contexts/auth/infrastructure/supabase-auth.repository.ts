import { Service } from "diod";

import { AuthRepository } from "@/contexts/auth/domain/auth.repository";
import type { AuthUser } from "@/contexts/auth/domain/auth-user.entity";
import { createSupabaseServerClient } from "@/lib/supabase/server";

@Service()
export class SupabaseAuthRepository extends AuthRepository {
  async signInWithPassword(email: string, password: string): Promise<void> {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error("Invalid credentials");
    }
  }

  async getAuthenticatedUser(): Promise<AuthUser | null> {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email ?? null,
    };
  }

  async isAuthenticated(): Promise<boolean> {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    return !error && Boolean(user);
  }

  async signOut(): Promise<void> {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
}
