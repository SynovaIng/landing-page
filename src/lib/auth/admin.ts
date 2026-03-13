import { envs } from "@/config/envs";

const normalizeEmail = (value: string): string => value.trim().toLowerCase();

const adminEmails = envs.SUPABASE_ADMIN_EMAILS
  .split(",")
  .map(normalizeEmail)
  .filter((value) => value.length > 0);

export const isAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) {
    return false;
  }

  return adminEmails.includes(normalizeEmail(email));
};
