"use client";

import { useId } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import type { Profile } from "@/types";
import Image from "next/image";

interface UserMenuProps {
  profile: Profile | null;
  onNavigate?: () => void;
}

export function UserMenu({ profile, onNavigate }: UserMenuProps) {
  const menuId = useId();
  const router = useRouter();
  const supabase = createClient();

  const preferredName =
    profile?.use_stage_name && profile?.stage_name
      ? profile.stage_name
      : profile?.display_name;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild id={menuId}>
        <Button variant="ghost" size="icon" className="rounded-full">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.display_name || "User"}
              className="h-8 w-8 rounded-full object-cover"
              height={32}
              width={32}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{preferredName || "User"}</p>
        </div>
        <DropdownMenuSeparator />
        <div className="px-2 py-2 flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ThemeModeToggle />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            onNavigate?.();
            router.push("/app/settings");
          }}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
