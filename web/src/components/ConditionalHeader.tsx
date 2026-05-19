'use client';

import { usePathname } from 'next/navigation';
import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';
import { useFigmaAppShellTypography } from '@/lib/discover/useFigmaAppShellTypography';
import DiscoverStickyHeader from './discover/DiscoverStickyHeader';
import { UnifiedSignedInNav } from './subnav/UnifiedSignedInNav';
import { AppShellNavProvider } from './figma/discover/AppShellNavContext';
import { EmberFigmaMobileNav } from './figma/discover/EmberFigmaMobileNav';
import { AppShellMobileMenuSheet } from './figma/discover/AppShellMobileMenuSheet';

const FIGMA_APP_SHELL_PREFIXES = ['/discover', '/my-ideas', '/marketplace', '/family'] as const;

function isFigmaAppShellPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return FIGMA_APP_SHELL_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function FigmaAppShellHeader({ signedIn }: { signedIn: boolean }) {
  useFigmaAppShellTypography();
  return (
    <AppShellNavProvider>
      {signedIn ? (
        <UnifiedSignedInNav figmaShell hideLegacyMobileTabs hideHeaderMobileMenu />
      ) : (
        <DiscoverStickyHeader />
      )}
      {signedIn ? (
        <>
          <EmberFigmaMobileNav />
          <AppShellMobileMenuSheet />
        </>
      ) : null}
    </AppShellNavProvider>
  );
}

/**
 * Global navbar: unified signed-in nav + Figma styling on core app routes; legacy headers elsewhere.
 */
export default function ConditionalHeader() {
  const pathname = usePathname();
  const { user } = useSubnavStats();

  if (isFigmaAppShellPath(pathname)) {
    return <FigmaAppShellHeader signedIn={!!user} />;
  }

  if (user) {
    return <UnifiedSignedInNav hideLegacyMobileTabs />;
  }
  return <DiscoverStickyHeader />;
}
