"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { type ColorTheme, DEFAULT_THEME_ID, themes } from "./themes";

// ─── Tipos ───────────────────────────────────────────────────
interface ThemeContextValue {
  activeTheme: ColorTheme;
  setTheme: (id: string) => void;
  themes: ColorTheme[];
}

// ─── Contexto ─────────────────────────────────────────────────
const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Helper: aplica las CSS vars al :root via <style> inyectado ──
function applyTheme(theme: ColorTheme) {
  const STYLE_ID = "synova-theme-override";
  let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
  }
  const vars = Object.entries(theme.vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  styleEl.textContent = `:root {\n${vars}\n}`;
}

// ─── Provider ─────────────────────────────────────────────────
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<ColorTheme>(
    () => themes.find((t) => t.id === DEFAULT_THEME_ID) ?? themes[0]
  );

  useEffect(() => {
    applyTheme(activeTheme);
  }, [activeTheme]);

  const setTheme = useCallback((id: string) => {
    const found = themes.find((t) => t.id === id);
    if (!found) return;
    if (found.id === DEFAULT_THEME_ID) {
      setActiveTheme(found);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ activeTheme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
