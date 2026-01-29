"use client";

import Link from "next/link";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg" | "xl";
type LogoBadge = "pro" | null;
type LogoVariant = "default" | "dark";

interface LogoProps {
  size?: LogoSize;
  badge?: LogoBadge;
  href?: string;
  className?: string;
  showText?: boolean;
  onClick?: () => void;
  variant?: LogoVariant;
}

const sizeConfig: Record<LogoSize, { icon: string; text: string }> = {
  sm: {
    icon: "size-5",
    text: "text-lg",
  },
  md: {
    icon: "size-5 md:size-6",
    text: "text-lg md:text-xl",
  },
  lg: {
    icon: "size-6 md:size-7",
    text: "text-xl md:text-2xl",
  },
  xl: {
    icon: "size-10",
    text: "text-3xl",
  },
};

const badgeLabels: Record<NonNullable<LogoBadge>, string> = {
  pro: "Pro",
};

// Songsmith icon - a pen/quill writing musical notes
function SongsmithIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("text-teal", className)}
    >
      {/* Pen/quill */}
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      {/* Musical note accent */}
      <circle cx="6" cy="18" r="2" fill="currentColor" />
      <path d="M8 18V12" />
    </svg>
  );
}

export function Logo({
  size = "md",
  badge = null,
  href,
  className,
  showText = true,
  onClick,
  variant = "default",
}: LogoProps) {
  const config = sizeConfig[size];
  const textColorClass = variant === "dark" ? "text-white" : "text-foreground";

  const content = (
    <div className={cn("flex items-center gap-2", className)}>
      <SongsmithIcon className={cn(config.icon)} />
      {showText && (
        <span className={cn("font-serif font-semibold tracking-tight", config.text, textColorClass)}>
          Songsmith
        </span>
      )}
      {badge && (
        <Badge className="bg-teal text-teal-foreground text-[10px] px-1.5 py-0 -mt-3">
          {badgeLabels[badge]}
        </Badge>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick}>
        {content}
      </button>
    );
  }

  return content;
}
