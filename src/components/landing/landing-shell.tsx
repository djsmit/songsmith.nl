import { ReactNode } from "react";
import { ForceDarkMode } from "./force-dark-mode";

interface LandingShellProps {
  children: ReactNode;
}

export function LandingShell({ children }: LandingShellProps) {
  return (
    <div className="min-h-svh relative overflow-hidden flex flex-col">
      <ForceDarkMode />
      {children}
    </div>
  );
}
