'use client';

import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';
import DiscoverStickyHeader from './discover/DiscoverStickyHeader';
import { UnifiedSignedInNav } from './subnav/UnifiedSignedInNav';

/**
 * Global navbar: when signed-in shows unified nav (Figma Subnav Bar V3); when signed-out shows discover-style header.
 */
export default function ConditionalHeader() {
  const { user } = useSubnavStats();
  if (user) {
    return <UnifiedSignedInNav />;
  }
  return <DiscoverStickyHeader />;
}
