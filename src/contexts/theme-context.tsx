"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export type DarkMode = "system" | "light" | "dark";

interface ThemeContextType {
  darkMode: DarkMode;
  setDarkMode: (mode: DarkMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DARK_MODE_KEY = "songsmith-dark-mode";

function applyDarkMode(mode: DarkMode) {
  if (typeof window === "undefined") return false;

  let isDark = false;

  if (mode === "system") {
    isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  } else {
    isDark = mode === "dark";
  }

  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  return isDark;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [darkMode, setDarkModeState] = useState<DarkMode>("system");
  const [isDark, setIsDark] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedDarkMode = localStorage.getItem(DARK_MODE_KEY) as DarkMode | null;

    if (storedDarkMode && ["system", "light", "dark"].includes(storedDarkMode)) {
      setDarkModeState(storedDarkMode);
      setIsDark(applyDarkMode(storedDarkMode));
    } else {
      setIsDark(applyDarkMode("system"));
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (darkMode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      applyDarkMode("system");
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [darkMode]);

  const setDarkMode = useCallback((mode: DarkMode) => {
    setDarkModeState(mode);
    setIsDark(applyDarkMode(mode));
    localStorage.setItem(DARK_MODE_KEY, mode);
  }, []);

  return (
    <ThemeContext.Provider
      value={{ darkMode, setDarkMode, isDark }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
