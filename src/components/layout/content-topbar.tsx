"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PanelLeftClose, PanelLeft, Pencil } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { useSidebar } from "@/contexts/sidebar-context";

interface ContentTopbarProps {
  editHref?: string;
  children?: React.ReactNode;
}

export function ContentTopbar({
  editHref,
  children,
}: ContentTopbarProps) {
  const {
    isCollapsed,
    toggleSidebar,
    setHasContentTopbar,
    profile,
  } = useSidebar();

  // Track scroll position for header transparency
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Register that this page has a content topbar
  useEffect(() => {
    setHasContentTopbar(true);
    return () => setHasContentTopbar(false);
  }, [setHasContentTopbar]);

  return (
    <div
      className={`flex items-center justify-between px-4 h-16 flex-none no-print fixed top-0 left-0 right-0 z-10 border-b transition-all duration-300 backdrop-blur-sm lg:relative ${
        isAtTop ? "bg-transparent" : "bg-background/60"
      }`}
    >
      {/* Left side */}
      <div className="flex items-center gap-2">
        {/* Mobile: hamburger menu */}
        <div className="lg:hidden">
          <MobileNav profile={profile} />
        </div>

        {/* Desktop: collapse toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden lg:flex"
        >
          {isCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>

        {/* Logo - show on mobile always, on desktop only when collapsed */}
        <div className={isCollapsed ? "" : "lg:hidden"}>
          <Logo size="sm" href="/app" />
        </div>
      </div>

      {/* Right side - Action icons or custom children */}
      <div className="flex gap-2 items-center">
        {children ?? (
          <>
            {editHref && (
              <Button asChild variant="ghost" size="icon">
                <Link href={editHref}>
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
