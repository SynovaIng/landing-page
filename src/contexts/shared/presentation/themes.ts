/**
 * ──────────────────────────────────────────────────────────────
 *  SYNOVA — Catálogo de temas de color
 * ──────────────────────────────────────────────────────────────
 *  Para AGREGAR un tema nuevo:
 *    1. Añade un objeto nuevo al array `themes` siguiendo la
 *       misma forma que los existentes.
 *  Para QUITAR un tema:
 *    1. Elimina o comenta su objeto del array.
 *  Cada propiedad CSS aquí reemplaza la variable CSS global
 *  correspondiente en globals.css cuando el tema está activo.
 * ──────────────────────────────────────────────────────────────
 */

export interface ColorTheme {
  /** Identificador único (usado como key en localStorage) */
  id: string;
  /** Nombre visible en el dropdown */
  label: string;
  /** Emoji o icono decorativo opcional */
  emoji: string;
  /** Ruta del logo para la Navbar (fondo claro) */
  logoNavbar: string;
  /** Ruta del logo para el Footer (fondo oscuro) */
  logoFooter: string;
  /** Variables CSS que se inyectan en :root al activar el tema */
  vars: {
    "--color-primary": string;
    "--color-primary-dark": string;
    "--color-secondary": string;
    "--color-secondary-dark": string;
    "--color-navy": string;
    "--color-muted": string;
    "--color-background-light": string;
    "--color-background-alt": string;
    /** Gradiente del botón CTA y acentos */
    "--gradient-brand": string;
    /** ── Superficie & bordes ── */
    "--color-surface": string;
    "--color-surface-alt": string;
    "--color-border": string;
    "--color-border-light": string;
    "--color-on-surface": string;
    "--color-on-surface-muted": string;
    /** ── Header (Navbar) ── */
    "--color-header-bg": string;
    "--color-header-text": string;
    /** ── Footer ── */
    "--color-footer-bg": string;
    "--color-footer-text": string;
    "--color-footer-text-muted": string;

  };
}

/** Helper: valores surface claros comunes */
const lightSurface = {
  "--color-surface": "#ffffff",
  "--color-surface-alt": "#f8fafc",
  "--color-border": "#e2e8f0",
  "--color-border-light": "#f1f5f9",
  "--color-on-surface": "#0f172a",
  "--color-on-surface-muted": "#64748b",
  "--color-header-bg": "#ffffff",
  "--color-header-text": "#0f172a",
  "--color-footer-bg": "#0f172a",
  "--color-footer-text": "#f8fafc",
  "--color-footer-text-muted": "#94a3b8",
} as const;

export const themes: ColorTheme[] = [
  // ── 1. Cian + Azul marino (original) ─────────────────────
  {
    id: "cyan-navy",
    label: "Cian · Marino",
    emoji: "💎",
    logoNavbar: "/synova-al-lado.svg",
    logoFooter: "/synova-al-lado-blanco.svg",
    vars: {
      "--color-primary": "#00c8e0",
      "--color-primary-dark": "#00a0b3",
      "--color-secondary": "#1a3a8f",
      "--color-secondary-dark": "#142d70",
      "--color-navy": "#0f1a2e",
      "--color-muted": "#6b7280",
      "--color-background-light": "#f5f7fa",
      "--color-background-alt": "#eff6ff",
      "--gradient-brand": "linear-gradient(135deg, #1a3a8f 0%, #00c8e0 100%)",
      ...lightSurface,
    },
  },
  // ── 2. Claro con Header Oscuro (High Contrast) ──────────
  {
    id: "light-yellow-dark-header",
    label: "Claro · Header Oscuro",
    emoji: "🌤️",
    logoNavbar: "/synova-al-lado-amarillo-blanco.svg",
    logoFooter: "/synova-al-lado-amarillo-blanco.svg",
    vars: {
      "--color-primary": "#eab308",
      "--color-primary-dark": "#ca8a04",
      "--color-secondary": "#e7b201",      // Mostaza dorado suave
      "--color-secondary-dark": "#a88b1f",  // Mostaza oscuro
      "--color-navy": "#252526",
      "--color-muted": "#64748b",
      "--color-background-light": "#ffffff",
      "--color-background-alt": "#f8fafc",
      "--gradient-brand": "linear-gradient(135deg, #eab308 0%, #c9a227 100%)",
      "--color-surface": "#ffffff",
      "--color-surface-alt": "#f8fafc",
      "--color-border": "#e2e8f0",
      "--color-border-light": "#f1f5f9",
      "--color-on-surface": "#0f172a",
      "--color-on-surface-muted": "#64748b",
      "--color-header-bg": "#1f2937",
      "--color-header-text": "#f8fafc",
      "--color-footer-bg": "#1f2937",
      "--color-footer-text": "white",
      "--color-footer-text-muted": "#9ca3af",
    },
  },

];

/** Tema por defecto si no hay ninguno guardado */
export const DEFAULT_THEME_ID = "light-yellow-dark-header";
