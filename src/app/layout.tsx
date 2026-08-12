import "./globals.css";

import type { Metadata } from "next";
import { Inter,Montserrat } from "next/font/google";
import Script from "next/script";

import { createServerAuthUseCases } from "@/contexts/auth/app/server-auth.factory";
import { AuthProvider } from "@/contexts/auth/presentation/AuthContext";
import { CONTACT_INFO } from "@/contexts/shared/app/contact-info";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME, SITE_URL } from "@/contexts/shared/app/seo";
import Footer from "@/contexts/shared/presentation/Footer";
import { LoadingOverlayProvider } from "@/contexts/shared/presentation/LoadingOverlayContext";
import Navbar from "@/contexts/shared/presentation/Navbar";
import { ThemeProvider } from "@/contexts/shared/presentation/ThemeContext";
import {
  DEFAULT_THEME_ID,
  themes,
} from "@/contexts/shared/presentation/themes";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "Electrician",
  name: SITE_NAME,
  image: `${SITE_URL}/logo.svg`,
  url: SITE_URL,
  telephone: CONTACT_INFO.phoneNumbers[0],
  email: CONTACT_INFO.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Santiago",
    addressCountry: "CL",
  },
  areaServed: "Santiago, Chile",
  sameAs: [CONTACT_INFO.socials.instagram, CONTACT_INFO.socials.tiktok],
  description: DEFAULT_DESCRIPTION,
};

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "electricista Santiago",
    "instalaciones eléctricas",
    "certificación SEC",
    "electricista certificado SEC Clase A",
    "emergencias eléctricas 24/7",
    "mantención eléctrica preventiva",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

const defaultTheme = themes.find((theme) => theme.id === DEFAULT_THEME_ID) ?? themes[0];
const defaultThemeVars = Object.entries(defaultTheme.vars)
  .map(([key, value]) => `  ${key}: ${value};`)
  .join("\n");
const defaultThemeCss = `:root {\n${defaultThemeVars}\n}`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { checkUserAuthenticatedUseCase, getAuthenticatedUserUseCase } =
    createServerAuthUseCases();
  const authenticated = await checkUserAuthenticatedUseCase.execute();
  const user = authenticated ? await getAuthenticatedUserUseCase.execute() : null;
  const initialSession = {
    authenticated,
    user: user
      ? {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        }
      : null,
  };

  return (
    <html lang="es">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <style id="synova-theme-override">{defaultThemeCss}</style>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className={`${montserrat.variable} ${inter.variable} antialiased`}>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
        />
        <LoadingOverlayProvider>
          <ThemeProvider>
            <AuthProvider initialSession={initialSession}>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer currentYear={new Date().getFullYear()} />
            </AuthProvider>
          </ThemeProvider>
        </LoadingOverlayProvider>
      </body>
    </html>
  );
}
