import { redirect } from 'next/navigation';
import { loadAgeBandsForResolution } from '../../lib/pl/public';
import { resolveAgeBandForMonth } from '../../lib/pl/ageBandResolution';

function findNearestMonthWithBand(args: {
  preferredMonth: number;
  minMonth: number;
  maxMonth: number;
  ageBands: unknown[];
}): number | null {
  const { preferredMonth, minMonth, maxMonth, ageBands } = args;
  for (let d = 0; d <= (maxMonth - minMonth); d += 1) {
    const down = preferredMonth - d;
    const up = preferredMonth + d;
    if (down >= minMonth) {
      const r = resolveAgeBandForMonth(down, ageBands);
      if (r.ageBandId) return down;
    }
    if (up <= maxMonth) {
      const r = resolveAgeBandForMonth(up, ageBands);
      if (r.ageBandId) return up;
    }
  }
  return null;
}

export default async function NewPage() {
  // Default to 26 months (matching the mockup).
  const preferredMonth = 26;

  try {
    const { ageBands, error } = await loadAgeBandsForResolution();
    if (!error) {
      const resolved = resolveAgeBandForMonth(preferredMonth, ageBands);
      if (resolved.ageBandId) {
        redirect(`/new/${preferredMonth}`);
      }

      const nearest = findNearestMonthWithBand({
        preferredMonth,
        minMonth: 24,
        maxMonth: 30,
        ageBands,
      });
      if (nearest !== null) {
        redirect(`/new/${nearest}`);
      }
    }
  } catch {
    // Fall through to default redirect.
  }

  redirect(`/new/${preferredMonth}`);
}

