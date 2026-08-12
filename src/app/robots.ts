import type { MetadataRoute } from "next";

import { SITE_URL } from "@/contexts/shared/app/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/login", "/review", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
