import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "SYNOVA | Sitio en mantencion",
    template: "%s | SYNOVA",
  },
  description: "Estamos realizando mejoras. Volveremos pronto.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
