'use client';

import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';

/**
 * Legacy subnav bar is now merged into UnifiedSignedInNav (ConditionalHeader when signed-in).
 * This component renders nothing; kept for layout compatibility.
 */
export function SubnavGate() {
  useSubnavStats();
  return null;
}
