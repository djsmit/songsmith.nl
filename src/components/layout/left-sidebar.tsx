"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus, PenLine, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserMenu } from "@/components/auth/user-menu";
import { useSidebar } from "@/contexts/sidebar-context";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";

interface LeftSidebarProps {
  profile: Profile | null;
}

export function LeftSidebar({ profile }: LeftSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { sessions } = useSidebar();

  const handleNewSession = () => {
    router.push("/app/sessions/new");
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b shrink-0">
        <Logo size="sm" href="/app" />
      </div>

      {/* Sessions list */}
      <ScrollArea className="flex-1 min-h-0">
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
      <div className="flex items-center justify-between p-4 h-16 border-t shrink-0">
        <Button size="sm" onClick={handleNewSession}>
          <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
          New Session
        </Button>
        <UserMenu profile={profile} />
      </div>
    </div>
  );
}
