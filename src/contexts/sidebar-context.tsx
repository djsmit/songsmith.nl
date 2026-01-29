'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import type { Profile } from '@/types';
import type { Session } from '@/types/songsmith';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
  hasContentTopbar: boolean;
  setHasContentTopbar: (value: boolean) => void;
  profile: Profile | null;
  // Sessions
  sessions: Session[];
  addOptimisticSession: (session: Session) => void;
  updateOptimisticSession: (sessionId: string, updates: Partial<Session>) => void;
  removeSession: (sessionId: string) => void;
  // Mobile nav state
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const STORAGE_KEY = 'songsmith-sidebar-collapsed';

interface SidebarProviderProps {
  children: ReactNode;
  profile?: Profile | null;
  sessions?: Session[];
}

export function SidebarProvider({
  children,
  profile = null,
  sessions: serverSessions = [],
}: SidebarProviderProps) {
  // Start with false to match server, then sync from localStorage after hydration
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasContentTopbar, setHasContentTopbar] = useState(false);

  // Mobile nav state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Optimistic sessions state
  const [optimisticSessions, setOptimisticSessions] = useState<Session[]>([]);
  const [deletedSessionIds, setDeletedSessionIds] = useState<string[]>([]);
  const [sessionUpdates, setSessionUpdates] = useState<Map<string, Partial<Session>>>(new Map());

  // Merge server sessions with optimistic sessions
  const sessions = useMemo(() => {
    const serverSessionIds = new Set(serverSessions.map((s) => s.id));
    const deletedSet = new Set(deletedSessionIds);

    // Filter out optimistic sessions that are now in server data
    const pendingOptimistic = optimisticSessions.filter((s) => !serverSessionIds.has(s.id));
    if (pendingOptimistic.length !== optimisticSessions.length) {
      setTimeout(() => setOptimisticSessions(pendingOptimistic), 0);
    }

    // Clean up deleted IDs that are no longer in server data
    const staleDeletedIds = deletedSessionIds.filter((id) => !serverSessionIds.has(id));
    if (staleDeletedIds.length > 0 && staleDeletedIds.length < deletedSessionIds.length) {
      setTimeout(() => setDeletedSessionIds((prev) => prev.filter((id) => serverSessionIds.has(id))), 0);
    }

    // Apply updates to server sessions
    const updatedServerSessions = serverSessions.map((s) => {
      const updates = sessionUpdates.get(s.id);
      return updates ? { ...s, ...updates } : s;
    });

    // Combine and filter out deleted sessions
    return [...updatedServerSessions, ...pendingOptimistic].filter((s) => !deletedSet.has(s.id));
  }, [serverSessions, optimisticSessions, deletedSessionIds, sessionUpdates]);

  // Session optimistic update functions
  const addOptimisticSession = useCallback((session: Session) => {
    setOptimisticSessions((prev) => {
      if (prev.some((s) => s.id === session.id)) return prev;
      return [session, ...prev];
    });
  }, []);

  const updateOptimisticSession = useCallback((sessionId: string, updates: Partial<Session>) => {
    setOptimisticSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, ...updates } : s))
    );
    setSessionUpdates((prev) => {
      const next = new Map(prev);
      const existing = next.get(sessionId) || {};
      next.set(sessionId, { ...existing, ...updates });
      return next;
    });
  }, []);

  const removeSession = useCallback((sessionId: string) => {
    setDeletedSessionIds((prev) => (prev.includes(sessionId) ? prev : [...prev, sessionId]));
  }, []);

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
        isCollapsed,
        toggleSidebar,
        collapseSidebar,
        expandSidebar,
        hasContentTopbar,
        setHasContentTopbar,
        profile,
        sessions,
        addOptimisticSession,
        updateOptimisticSession,
        removeSession,
        mobileNavOpen,
        setMobileNavOpen,
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
