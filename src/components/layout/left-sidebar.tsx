"use client";

import { useRouter } from "next/navigation";
import { Plus, PenLine } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/auth/user-menu";
import type { Profile } from "@/types";

interface LeftSidebarProps {
  profile: Profile | null;
}

export function LeftSidebar({ profile }: LeftSidebarProps) {
  const router = useRouter();

  const handleNewSession = () => {
    router.push("/app/sessions/new");
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b shrink-0">
        <Logo size="sm" href="/app" />
      </div>

      {/* Sessions list placeholder */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4">
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
          <PenLine className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-sm">Your sessions will appear here</p>
        </div>
      </div>

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
