'use client';

import { usePathname } from 'next/navigation';
import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';
import DiscoverStickyHeader from './discover/DiscoverStickyHeader';
import { UnifiedSignedInNav } from './subnav/UnifiedSignedInNav';
import { EmberFigmaAppNav } from './figma/discover/EmberFigmaAppNav';

const FIGMA_APP_SHELL_PREFIXES = ['/discover', '/my-ideas', '/marketplace', '/family'] as const;

function isFigmaAppShellPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return FIGMA_APP_SHELL_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Global navbar: Figma May app shell on core app routes; legacy headers elsewhere.
 */
export default function ConditionalHeader() {
  const pathname = usePathname();
  const { user } = useSubnavStats();

  if (isFigmaAppShellPath(pathname)) {
    return <EmberFigmaAppNav />;
  }

  if (user) {
    return <UnifiedSignedInNav />;
  }
  return <DiscoverStickyHeader />;
}
