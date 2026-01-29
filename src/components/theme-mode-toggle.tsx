"use client";

import { useTheme, type DarkMode } from "@/contexts/theme-context";
import { Monitor, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const modes: { value: DarkMode; icon: typeof Monitor; label: string }[] = [
  { value: "system", icon: Monitor, label: "System" },
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
];

interface ThemeModeToggleProps {
  className?: string;
}

export function ThemeModeToggle({ className }: ThemeModeToggleProps) {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-muted p-1 gap-0.5",
        className
      )}
    >
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = darkMode === mode.value;
        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => setDarkMode(mode.value)}
            className={cn(
              "p-1.5 rounded-full transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            title={mode.label}
            aria-label={`${mode.label} theme`}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
