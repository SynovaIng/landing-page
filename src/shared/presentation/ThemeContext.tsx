"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ColorTheme, DEFAULT_THEME_ID, themes } from "./themes";

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

  /** Al montar, restaura el tema guardado en localStorage */
  useEffect(() => {
    const saved = localStorage.getItem("synova-theme");
    const found = themes.find((t) => t.id === saved);
    if (found) {
      setActiveTheme(found);
      applyTheme(found);
    } else {
      applyTheme(activeTheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = useCallback((id: string) => {
    const found = themes.find((t) => t.id === id);
    if (!found) return;
    setActiveTheme(found);
    applyTheme(found);
    localStorage.setItem("synova-theme", id);
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
