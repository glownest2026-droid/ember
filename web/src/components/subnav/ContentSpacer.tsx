'use client';

import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';

/**
 * Invisible spacer so page content starts below the fixed header (and subnav when signed-in).
 * Place once in root layout after the nav bars.
 */
export function ContentSpacer() {
  const { user } = useSubnavStats();
  const height = user
    ? 'calc(var(--subnav-height) + var(--header-height) + env(safe-area-inset-top, 0px))'
    : 'calc(var(--header-height) + env(safe-area-inset-top, 0px))';
  return <div aria-hidden style={{ minHeight: height }} />;
}
