import type { MetadataRoute } from "next";

import { SITE_URL } from "@/contexts/shared/app/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/nosotros", "/servicios", "/proyectos", "/contacto"];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
