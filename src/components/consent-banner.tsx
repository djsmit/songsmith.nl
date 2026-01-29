"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConsentChoice = "granted" | "denied" | null;

// Routes that use forced dark mode (landing pages)
const DARK_MODE_ROUTES = ["/", "/privacy", "/terms", "/changelog"];

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Check if current route is a landing page (forced dark mode)
  const isLandingPage = DARK_MODE_ROUTES.includes(pathname);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent") as ConsentChoice;
    if (!consent) {
      setVisible(true);
    } else {
      // Apply stored consent for returning visitors
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("consent", "update", {
          ad_storage: consent,
          ad_user_data: consent,
          ad_personalization: consent,
          analytics_storage: consent,
        });
      }
    }
  }, []);

  const updateConsent = (choice: ConsentChoice) => {
    if (!choice) return;

    // Update GTM Consent Mode
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: choice,
        ad_user_data: choice,
        ad_personalization: choice,
        analytics_storage: choice,
      });
    }

    // Store preference
    localStorage.setItem("cookie_consent", choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 p-4 border-t shadow-lg",
        isLandingPage
          ? "bg-zinc-900 border-white/10 text-white"
          : "bg-background border-border"
      )}
    >
      <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p
          className={cn(
            "text-sm text-center sm:text-left",
            isLandingPage ? "text-white/70" : "text-muted-foreground"
          )}
        >
          I use cookies to analyze site usage and improve your experience.{" "}
          <a
            href="/privacy"
            className={cn(
              "underline",
              isLandingPage
                ? "hover:text-white"
                : "hover:text-foreground"
            )}
          >
            Privacy Policy
          </a>
        </p>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateConsent("denied")}
            className={cn(
              isLandingPage &&
                "bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
            )}
          >
            Decline
          </Button>
          <Button
            size="sm"
            onClick={() => updateConsent("granted")}
            className={cn(
              isLandingPage && "bg-teal hover:bg-teal/90 text-teal-foreground"
            )}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
