"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";

/**
 * Dark-only theme shell. Older builds stored "light" in localStorage; we clear
 * that key on mount so the document never flips back after hydration.
 * The root `app/layout.tsx` also sets `className="dark"` on `<html>` for first paint.
 */
type ThemeProviderProps = {
  children: ReactNode;
  /** Ignored — kept so call sites do not need churn. */
  defaultTheme?: "dark" | "light" | "system";
  storageKey?: string;
};

type ThemeProviderState = {
  theme: "dark";
  /** No-op — there is no alternate theme to switch to. */
  setTheme: (_theme: "dark" | "light" | "system") => void;
};

const darkOnlyValue: ThemeProviderState = {
  theme: "dark",
  setTheme: () => {},
};

const ThemeProviderContext = createContext<ThemeProviderState | null>(null);

export function ThemeProvider({
  children,
  storageKey = "apex-theme",
}: ThemeProviderProps) {
  useEffect(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Private mode / blocked storage — still force class on <html>.
    }
    const root = document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
  }, [storageKey]);

  return (
    <ThemeProviderContext.Provider value={darkOnlyValue}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
