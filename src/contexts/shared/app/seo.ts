import type { Metadata } from "next";

import { publicEnvs } from "@/config/envs.public";

export const SITE_URL = publicEnvs.NEXT_PUBLIC_SITE_URL ?? "https://synovaingenieria.cl";
export const SITE_NAME = "SYNOVA";
export const DEFAULT_TITLE = "SYNOVA — Soluciones Eléctricas Profesionales en Santiago";
export const DEFAULT_DESCRIPTION =
  "Expertos en instalaciones eléctricas, certificaciones SEC, emergencias 24/7 y mantención preventiva en Santiago de Chile. Certificados SEC Clase A.";

interface BuildPageMetadataOptions {
  title?: string;
  description: string;
  path?: string;
}

export function buildPageMetadata({
  title,
  description,
  path = "",
}: BuildPageMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "es_CL",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  };
}
