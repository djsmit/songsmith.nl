"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/sidebar-context";
import type { Profile } from "@/types";

interface AppLayoutClientProps {
  profile: Profile | null;
  children: React.ReactNode;
}

export function AppLayoutClient({
  profile,
  children,
}: AppLayoutClientProps) {
  const pathname = usePathname();

  const {
    isCollapsed,
    hasContentTopbar,
    expandSidebar,
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

  // Auto-expand sidebar on dashboard
  useEffect(() => {
    const isDashboard = pathname === "/app";
    if (isDashboard && isCollapsed) {
      expandSidebar();
    }
  }, [pathname, isCollapsed, expandSidebar]);

  // Hide sidebar when manually collapsed (user can toggle via topbar)
  const shouldHideSidebar = isCollapsed;

  return (
    <div className="flex min-h-svh relative">
      {/* Subtle gradient orbs for dark mode */}
      <div className="hidden dark:block fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-teal/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] rounded-full bg-pink/15 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-purple/15 blur-[110px]" />
      </div>

      {/* Left Sidebar - hidden on mobile or when collapsed */}
      <aside
        className={cn(
          "hidden lg:flex w-72 min-h-svh flex-col border-r bg-card dark:bg-card/70 shrink-0 no-print relative z-10",
          shouldHideSidebar && "lg:hidden",
        )}
      >
        <LeftSidebar profile={profile} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 relative z-10">
        {/* Mobile Header - hidden when content topbar is present */}
        {!hasContentTopbar && (
          <header
            className={`flex items-center gap-2 px-4 h-16 flex-none no-print lg:hidden fixed top-0 left-0 right-0 z-10 border-b transition-all duration-300 backdrop-blur-sm ${
              isAtTop ? "bg-transparent" : "bg-background/60"
            }`}
          >
            <MobileNav profile={profile} />
            <Logo size="sm" href="/app" />
          </header>
        )}

        <main className="relative h-full">{children}</main>
      </div>

      {/* Print Footer */}
      <div className="print-footer">Built with Songsmith.nl</div>
    </div>
  );
}
