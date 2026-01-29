'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Profile } from '@/types';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
  hasContentTopbar: boolean;
  setHasContentTopbar: (value: boolean) => void;
  profile: Profile | null;
  // Mobile nav state
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const STORAGE_KEY = 'songsmith-sidebar-collapsed';

interface SidebarProviderProps {
  children: ReactNode;
  profile?: Profile | null;
}

export function SidebarProvider({ children, profile = null }: SidebarProviderProps) {
  // Start with false to match server, then sync from localStorage after hydration
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasContentTopbar, setHasContentTopbar] = useState(false);

  // Mobile nav state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Sync from localStorage after hydration (only on mount)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  // Persist state changes (skip initial render to avoid overwriting stored value)
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem(STORAGE_KEY, String(isCollapsed));
    } else {
      setHasMounted(true);
    }
  }, [isCollapsed, hasMounted]);

  const toggleSidebar = useCallback(() => setIsCollapsed((prev) => !prev), []);
  const collapseSidebar = useCallback(() => setIsCollapsed(true), []);
  const expandSidebar = useCallback(() => setIsCollapsed(false), []);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed, toggleSidebar, collapseSidebar, expandSidebar,
        hasContentTopbar, setHasContentTopbar,
        profile,
        mobileNavOpen, setMobileNavOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
