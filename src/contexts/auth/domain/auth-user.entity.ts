import { z } from "zod";

export interface AuthUser {
  id: string;
  email: string | null;
  fullName: string | null;
}

export const authUserSchema: z.ZodType<AuthUser> = z.object({
  id: z.string().min(1),
  email: z.email().nullable(),
  fullName: z.string().trim().min(1).nullable(),
});

export class User {
  public readonly id: string;
  public readonly email: string | null;
  public readonly fullName: string | null;

  constructor(props: AuthUser) {
    this.id = props.id;
    this.email = props.email;
    this.fullName = props.fullName;
  }

  getInitials(maxWords = 3): string {
    if (!this.fullName) {
      return "US";
    }

    const words = this.fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, maxWords);

    if (words.length === 0) {
      return "US";
    }

    return words
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }
}
