import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeContext } from "./theme-context";
import type { ThemeMode } from "../types/theme";

const STORAGE_KEY = "zkr-theme";

function getInitialTheme(): ThemeMode {
  const savedTheme = localStorage.getItem(STORAGE_KEY);

  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialTheme);

  // Keep the DOM attribute in sync with state (the inline script in
  // index.html already applies the saved theme before first paint to
  // avoid a flash; this effect keeps things consistent afterward).
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const toggleTheme = useCallback(() => {
    setMode((currentMode) => {
      const nextMode: ThemeMode = currentMode === "light" ? "dark" : "light";
      localStorage.setItem(STORAGE_KEY, nextMode);
      return nextMode;
    });
  }, []);

  const value = useMemo(
    () => ({
      mode,
      toggleTheme,
    }),
    [mode, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
