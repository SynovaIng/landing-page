import { Service } from "diod";
import { z } from "zod";

import { AuthRepository } from "@/contexts/auth/domain/auth.repository";
import type { AuthUser } from "@/contexts/auth/domain/auth-user.entity";
import { User } from "@/contexts/auth/domain/auth-user.entity";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const supabaseUserSchema = z.object({
  id: z.string().min(1),
  email: z.email().nullable().optional(),
  user_metadata: z.looseObject({}).optional(),
});

const supabaseUserMetadataSchema = z.looseObject({
  full_name: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  first_name: z.string().trim().min(1).optional(),
  last_name: z.string().trim().min(1).optional(),
});

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

    const parsedUser = supabaseUserSchema.safeParse(user);
    if (!parsedUser.success) {
      return null;
    }

    const parsedMetadata = supabaseUserMetadataSchema.safeParse(
      parsedUser.data.user_metadata ?? {},
    );
    const metadata = parsedMetadata.success ? parsedMetadata.data : {};

    const fullNameFromMetadata = metadata.full_name ?? metadata.name ?? null;
    const firstName = metadata.first_name ?? "";
    const lastName = metadata.last_name ?? "";
    const composedName = [firstName, lastName].filter(Boolean).join(" ");
    const fullName = fullNameFromMetadata ?? (composedName || null);

    return new User({
      id: parsedUser.data.id,
      email: parsedUser.data.email ?? null,
      fullName,
    });
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
