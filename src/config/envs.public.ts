import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url().or(z.literal("")).default(""),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: z.string().default(""),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().default(""),
  NEXT_PUBLIC_SITE_URL: z.url().optional(),
});

const publicEnvValues = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
};

const parsed = publicEnvSchema.safeParse(publicEnvValues);

if (!parsed.success) {
  console.error("Invalid public environment variables:", z.treeifyError(parsed.error));
  throw new Error("Invalid public environment variables. Check .env.example");
}

export const publicEnvs = parsed.data;

export type PublicEnvs = z.infer<typeof publicEnvSchema>;
