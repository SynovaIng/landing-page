import { headers } from "next/headers";

import { envs } from "@/config/envs";

export const verifyTurnstileToken = async (token: string): Promise<boolean> => {
  const normalizedToken = token.trim();

  if (!normalizedToken) {
    return false;
  }

  const requestHeaders = await headers();
  const clientIp = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();

  const body = new URLSearchParams({
    secret: envs.TURNSTILE_SECRET_KEY,
    response: normalizedToken,
  });

  if (clientIp) {
    body.set("remoteip", clientIp);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as { success?: boolean };
  return Boolean(data.success);
};
