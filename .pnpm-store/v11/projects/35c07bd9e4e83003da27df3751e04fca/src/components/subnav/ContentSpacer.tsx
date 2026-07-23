'use client';

import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';

/**
 * Invisible spacer so page content starts below the fixed header.
 * When signed-in we use the unified nav (one bar); when signed-out, header only.
 */
export function ContentSpacer() {
  const { user } = useSubnavStats();
  const height = user
    ? 'calc(var(--unified-nav-height) + env(safe-area-inset-top, 0px))'
    : 'calc(var(--header-height) + env(safe-area-inset-top, 0px))';
  return <div aria-hidden style={{ minHeight: height }} />;
}
