"use client";

import { useEffect } from "react";

export function ForceDarkMode() {
  useEffect(() => {
    // Ensure dark class is set (should already be set by inline script in layout)
    document.body.classList.add("dark");
    document.documentElement.classList.add("dark");

    return () => {
      // Restore user's theme preference when navigating away from landing pages
      const darkMode = localStorage.getItem("songsmith-dark-mode");
      const shouldBeDark =
        darkMode === "dark" ||
        (darkMode !== "light" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      if (!shouldBeDark) {
        document.body.classList.remove("dark");
        document.documentElement.classList.remove("dark");
      }
    };
  }, []);

  return null;
}
