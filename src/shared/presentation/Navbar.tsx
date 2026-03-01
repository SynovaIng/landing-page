"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useTheme } from "./ThemeContext";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/nosotros", label: "Nosotros" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const { activeTheme, setTheme, themes } = useTheme();

  /* Cierra el dropdown al hacer clic fuera */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const insideDesktop = desktopDropdownRef.current?.contains(target);
      const insideMobile = mobileDropdownRef.current?.contains(target);
      if (!insideDesktop && !insideMobile) {
        setThemeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed w-full z-50 bg-[var(--color-header-bg)]/95 backdrop-blur-md border-b border-border shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="relative block h-20 w-60">
              <Image
                src={activeTheme.logoNavbar}
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
                    ? "font-bold text-primary"
                    : "text-[var(--color-header-text)] hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* ── Theme picker ── */}
            <div ref={desktopDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setThemeOpen((o) => !o)}
                title="Cambiar tema de color"
                className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-border bg-[var(--color-header-bg)] hover:border-primary hover:shadow-sm transition-all duration-200 text-[var(--color-header-text)] text-sm font-medium"
              >
                <span
                  className="inline-block w-3.5 h-3.5 rounded-full border border-surface shadow-sm shrink-0"
                  style={{ background: activeTheme.vars["--color-primary"] }}
                />
                <span className="hidden lg:inline">{activeTheme.label}</span>
                <span
                  className="material-symbols-outlined text-base leading-none text-muted transition-transform duration-200"
                  style={{
                    transform: themeOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  expand_more
                </span>
              </button>

              {/* Dropdown panel */}
              {themeOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-surface rounded-xl shadow-lg border border-border-light overflow-hidden z-50"
                  style={{
                    animation: "themeDropdownIn 0.15s ease-out forwards",
                  }}
                >
                  <div className="px-3 py-2 border-b border-border-light">
                    <p className="text-xs font-semibold text-muted uppercase tracking-widest">
                      Tema de color
                    </p>
                  </div>
                  <ul className="py-1">
                    {themes.map((theme) => {
                      const isActive = theme.id === activeTheme.id;
                      return (
                        <li key={theme.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setTheme(theme.id);
                              setThemeOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors duration-150 ${
                              isActive
                                ? "bg-surface-alt font-semibold text-navy"
                                : "text-on-surface-muted hover:bg-surface-alt"
                            }`}
                          >
                            {/* Swatch doble: secondary + primary */}
                            <span className="flex gap-0.5 shrink-0">
                              <span
                                className="w-3 h-5 rounded-l-full"
                                style={{
                                  background: theme.vars["--color-secondary"],
                                }}
                              />
                              <span
                                className="w-3 h-5 rounded-r-full"
                                style={{
                                  background: theme.vars["--color-primary"],
                                }}
                              />
                            </span>
                            <span className="flex-1 text-left leading-tight">
                              {theme.emoji} {theme.label}
                            </span>
                            {isActive && (
                              <span className="material-symbols-outlined text-base text-primary">
                                check
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            <Link
              href="/contacto"
              className="px-6 py-2.5 rounded-sm bg-[image:var(--gradient-brand)] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-md flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">call</span>
              Contacto
            </Link>
          </div>

          {/* Mobile: theme pill + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mini theme button (mobile) */}
            <button
              type="button"
              onClick={() => {
                setThemeOpen((o) => !o);
                setMobileOpen(false);
              }}
              title="Cambiar tema"
              className="flex items-center gap-1 p-2 rounded-md border border-border bg-[var(--color-header-bg)]"
            >
              <span
                className="inline-block w-3.5 h-3.5 rounded-full border border-surface shadow-sm"
                style={{ background: activeTheme.vars["--color-primary"] }}
              />
              <span className="material-symbols-outlined text-base text-muted">
                palette
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileOpen(!mobileOpen);
                setThemeOpen(false);
              }}
              className="text-[var(--color-header-text)] hover:text-primary"
              aria-label="Abrir menú"
            >
              <span className="material-symbols-outlined">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile theme picker */}
      {themeOpen && (
        <div
          ref={mobileDropdownRef}
          className="md:hidden bg-[var(--color-header-bg)] border-t border-border-light px-4 py-3"
        >
          <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">
            Tema de color
          </p>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme) => {
              const isActive = theme.id === activeTheme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    setTheme(theme.id);
                    setThemeOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all duration-150 ${
                    isActive
                      ? "border-primary bg-primary/5 font-semibold text-navy"
                      : "border-border text-on-surface-muted hover:border-primary"
                  }`}
                >
                  <span className="flex gap-0.5 shrink-0">
                    <span
                      className="w-2.5 h-4 rounded-l-full"
                      style={{ background: theme.vars["--color-secondary"] }}
                    />
                    <span
                      className="w-2.5 h-4 rounded-r-full"
                      style={{ background: theme.vars["--color-primary"] }}
                    />
                  </span>
                  <span className="truncate">{theme.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile nav menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--color-header-bg)] border-t border-border-light px-4 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-primary font-bold"
                  : "text-[var(--color-header-text)] hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contacto"
            onClick={() => setMobileOpen(false)}
            className="block mt-2 px-6 py-2.5 rounded-sm bg-[image:var(--gradient-brand)] text-white font-semibold text-sm text-center hover:opacity-90 transition-opacity shadow-md"
          >
            Contacto
          </Link>
        </div>
      )}

      {/* Keyframe para la animación del dropdown */}
      <style>{`
        @keyframes themeDropdownIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>
    </nav>
  );
}
