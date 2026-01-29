"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Container } from "./container";

interface LandingHeaderProps {
  showBackLink?: boolean;
  showAuthButtons?: boolean;
}

export function LandingHeader({
  showBackLink = false,
  showAuthButtons = true,
}: LandingHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 10;

      // Track if at top for background transparency
      setIsAtTop(currentScrollY < 10);

      // Always show header at the top of the page
      if (currentScrollY < 50) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Only trigger if scrolled more than threshold
      if (Math.abs(currentScrollY - lastScrollY) < scrollThreshold) {
        return;
      }

      // Scrolling up = show, scrolling down = hide
      setIsVisible(currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/10  backdrop-blur-sm ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${isAtTop ? "bg-transparent" : "bg-background/60"}`}
    >
      <Container className="h-16 md:h-20 flex items-center justify-between">
        <Logo size="lg" href="/" variant="dark" />
        {showBackLink && (
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        )}
        {showAuthButtons && (
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              asChild
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              asChild
              className="bg-teal hover:bg-teal/90 text-teal-foreground"
            >
              <Link href="/login">Create Account</Link>
            </Button>
          </div>
        )}
      </Container>
    </header>
  );
}
