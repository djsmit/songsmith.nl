"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Plus, PenLine, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserMenu } from "@/components/auth/user-menu";
import { useSidebar } from "@/contexts/sidebar-context";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";

interface MobileNavProps {
  profile: Profile | null;
}

export function MobileNav({ profile }: MobileNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    mobileNavOpen: open,
    setMobileNavOpen: setOpen,
    sessions,
  } = useSidebar();

  const handleNewSession = () => {
    setOpen(false);
    router.push("/app/sessions/new");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[calc(100vw-4rem)] max-w-72 sm:w-72 p-0"
        externalCloseButton
      >
        <div className="flex h-dvh flex-col">
          {/* Header */}
          <SheetHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle asChild>
                <Logo
                  size="md"
                  href="/app"
                  onClick={() => setOpen(false)}
                />
              </SheetTitle>
            </div>
          </SheetHeader>

          {/* Sessions list */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <PenLine className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">Your sessions will appear here</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {sessions.map((session) => {
                    const isActive = pathname === `/app/sessions/${session.id}`;
                    return (
                      <Link
                        key={session.id}
                        href={`/app/sessions/${session.id}`}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-start gap-3 p-2.5 rounded-lg transition-colors hover:bg-muted/50",
                          isActive && "bg-muted"
                        )}
                      >
                        <Sparkles className="h-4 w-4 mt-0.5 text-teal shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">
                            {session.title || "Untitled"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {session.spark}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t">
            <Button size="sm" onClick={handleNewSession}>
              <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
              New Session
            </Button>
            <UserMenu profile={profile} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
