"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";

export function Footer() {
  return (
    <footer className="border-t dark:border-white/10 py-8 relative dark:bg-gradient-to-t dark:from-black/20 dark:to-transparent">
      <div className="container mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center justify-between gap-4">
        <Logo size="md" href="/" />
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 text-sm text-muted-foreground dark:text-white/60">
          <p>
            &copy; {new Date().getFullYear()} Songsmith · Built with ♫ by{" "}
            <a
              href="https://www.dearjohnmusic.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground dark:hover:text-white transition-colors"
            >
              Dear John
            </a>
          </p>
          <div className="flex items-center gap-2">
            <Link
              href="/privacy"
              className="hover:text-foreground dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="inline">·</span>
            <Link
              href="/terms"
              className="hover:text-foreground dark:hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <span className="inline">·</span>
            <Link
              href="/changelog"
              className="hover:text-foreground dark:hover:text-white transition-colors"
            >
              Changelog
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span>Theme</span>
            <ThemeModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
