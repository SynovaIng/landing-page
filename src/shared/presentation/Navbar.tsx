"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/nosotros", label: "Nosotros" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="relative block h-20 w-60">
              <Image
                src="/synova-al-lado.svg"
                alt="SYNOVA"
                fill
                className="object-contain object-left"
                priority
              />
            </Link>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors tracking-wide ${
                  pathname === link.href
                    ? "font-bold text-[#00C8E0]"
                    : "text-[#0F1A2E] hover:text-[#00C8E0]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contacto"
              className="px-6 py-2.5 rounded-sm bg-cyan-gradient text-white font-semibold text-sm hover:brightness-110 transition-all duration-300 shadow-lg flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">call</span>
              Contacto
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-[#0F1A2E] hover:text-[#00C8E0]"
              aria-label="Abrir menú"
            >
              <span className="material-symbols-outlined">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-[#00C8E0] font-bold"
                  : "text-[#0F1A2E] hover:text-[#00C8E0]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contacto"
            onClick={() => setMobileOpen(false)}
            className="block mt-2 px-6 py-2.5 rounded-sm bg-cyan-gradient text-white font-semibold text-sm text-center"
          >
            Contacto
          </Link>
        </div>
      )}
    </nav>
  );
}
