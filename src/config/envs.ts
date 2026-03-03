import { z } from "zod";

const envSchema = z.object({
  // Supabase — public (available on client and server)
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

  // Supabase — server only (never expose to the client)
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", z.treeifyError(parsed.error));
  throw new Error("Invalid environment variables. Check .env.local.example");
}

export const envs = parsed.data;

export type Envs = z.infer<typeof envSchema>;
