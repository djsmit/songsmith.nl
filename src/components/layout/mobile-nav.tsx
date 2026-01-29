"use client";

import { useRouter } from "next/navigation";
import { Menu, Plus, PenLine } from "lucide-react";
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
import type { Profile } from "@/types";

interface MobileNavProps {
  profile: Profile | null;
}

export function MobileNav({ profile }: MobileNavProps) {
  const router = useRouter();
  const {
    mobileNavOpen: open,
    setMobileNavOpen: setOpen,
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

          {/* Sessions list placeholder */}
          <ScrollArea className="flex-1">
            <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground p-4">
              <PenLine className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">Your sessions will appear here</p>
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
