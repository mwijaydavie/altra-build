"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ThemePreference = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

const STORAGE_KEY = "altra-theme";

interface ThemeApi {
  theme: ThemePreference;
  resolved: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeApi | null>(null);

const prefersLight = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches;

const resolve = (theme: ThemePreference): ResolvedTheme =>
  theme === "system" ? (prefersLight() ? "light" : "dark") : theme;

const apply = (resolved: ResolvedTheme) => {
  const root = document.documentElement;
  root.dataset.opsTheme = resolved;
  root.style.colorScheme = resolved;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>("dark");
  const [resolved, setResolved] = useState<ResolvedTheme>("dark");

  useEffect(() => {
    let stored: ThemePreference = "dark";
    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      if (value === "dark" || value === "light" || value === "system") stored = value;
    } catch {
      /* storage may be unavailable */
    }
    setThemeState(stored);
    const next = resolve(stored);
    setResolved(next);
    apply(next);
  }, []);

  useEffect(() => {
    if (theme !== "system") return;
    const query = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      const next = resolve("system");
      setResolved(next);
      apply(next);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage may be unavailable */
    }
    const value = resolve(next);
    setResolved(value);
    apply(value);
  }, []);

  const api = useMemo(() => ({ theme, resolved, setTheme }), [theme, resolved, setTheme]);

  return <ThemeContext.Provider value={api}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeApi {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
