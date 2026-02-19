'use client';

import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';
import { SubnavBar } from './SubnavBar';

/** Renders SubnavBar only when user is authenticated. Use inside SubnavStatsProvider. */
export function SubnavGate() {
  const { user } = useSubnavStats();
  if (!user) return null;
  return <SubnavBar />;
}
