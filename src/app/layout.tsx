import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/shared/presentation/Navbar";
import Footer from "@/shared/presentation/Footer";

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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className={`${montserrat.variable} ${inter.variable} antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
