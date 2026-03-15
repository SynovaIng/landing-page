import "./globals.css";

import type { Metadata } from "next";
import { Inter,Montserrat } from "next/font/google";

import { AuthProvider } from "@/contexts/auth/presentation/AuthContext";
import Footer from "@/contexts/shared/presentation/Footer";
import Navbar from "@/contexts/shared/presentation/Navbar";
import { ThemeProvider } from "@/contexts/shared/presentation/ThemeContext";

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
  title: {
    default: "SYNOVA — Soluciones Eléctricas Profesionales en Santiago",
    template: "%s | SYNOVA",
  },
  description:
    "Expertos en instalaciones eléctricas, certificaciones SEC, emergencias 24/7 y mantención preventiva en Santiago de Chile. Certificados SEC Clase A.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className={`${montserrat.variable} ${inter.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
