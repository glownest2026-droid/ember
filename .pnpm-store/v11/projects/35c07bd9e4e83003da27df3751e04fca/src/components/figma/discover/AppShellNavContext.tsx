'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type AppShellNavContextValue = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
};

const AppShellNavContext = createContext<AppShellNavContextValue | null>(null);

export function AppShellNavProvider({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen((o) => !o), []);
  const value = useMemo(
    () => ({ mobileMenuOpen, setMobileMenuOpen, toggleMobileMenu }),
    [mobileMenuOpen, toggleMobileMenu]
  );
  return <AppShellNavContext.Provider value={value}>{children}</AppShellNavContext.Provider>;
}

export function useAppShellNav() {
  return useContext(AppShellNavContext);
}
