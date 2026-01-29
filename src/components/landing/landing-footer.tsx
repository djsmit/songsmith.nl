import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Container } from "./container";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 py-8 relative">
      <Container className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <Logo size="md" href="/" variant="dark" />
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 text-sm text-white/60">
          <p>
            &copy; {new Date().getFullYear()} Songsmith · Built with ♫ by{" "}
            <a
              href="https://www.dearjohnmusic.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Dear John
            </a>
          </p>
          <div className="flex items-center gap-2">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="inline">·</span>
            <Link
              href="/terms"
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <span className="inline">·</span>
            <Link
              href="/changelog"
              className="hover:text-white transition-colors"
            >
              Changelog
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
