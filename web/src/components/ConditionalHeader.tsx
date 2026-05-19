'use client';

import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';
import { useFigmaAppShellTypography } from '@/lib/discover/useFigmaAppShellTypography';
import DiscoverStickyHeader from './discover/DiscoverStickyHeader';
import { UnifiedSignedInNav } from './subnav/UnifiedSignedInNav';
import { AppShellNavProvider } from './figma/discover/AppShellNavContext';
import { EmberFigmaMobileNav } from './figma/discover/EmberFigmaMobileNav';
import { AppShellMobileMenuSheet } from './figma/discover/AppShellMobileMenuSheet';

/**
 * Global navbar: Figma May 2026 discover styling (Manrope, warm surface, orange accents) for all routes.
 */
export default function ConditionalHeader() {
  useFigmaAppShellTypography();
  const { user } = useSubnavStats();

  return (
    <AppShellNavProvider>
      {user ? (
        <>
          <UnifiedSignedInNav hideLegacyMobileTabs hideHeaderMobileMenu />
          <EmberFigmaMobileNav />
          <AppShellMobileMenuSheet />
        </>
      ) : (
        <DiscoverStickyHeader />
      )}
    </AppShellNavProvider>
  );
}
