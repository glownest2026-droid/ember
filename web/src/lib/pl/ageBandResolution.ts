export type AgeBandForMonthResolution = {
  id: string;
  label: string;
  min_months: number;
  max_months: number;
  // Optional future-proofing: only used if present in provided objects.
  anchor_month?: number | null;
};

export type ResolveAgeBandResult = {
  band: AgeBandForMonthResolution | null;
  candidates: AgeBandForMonthResolution[];
  reason:
    | 'no-candidates'
    | 'single-candidate'
    | 'overlap-closest-anchor'
    | 'overlap-prefer-newer-band';
};

function hasNumericAnchorMonth(band: AgeBandForMonthResolution): boolean {
  return typeof band.anchor_month === 'number' && Number.isFinite(band.anchor_month);
}

/**
 * Deterministic month -> age band mapping.
 *
 * Rule:
 * 1) candidates = ageBands where min_months <= selectedMonth <= max_months
 * 2) if candidates.length === 1 -> choose it
 * 3) if candidates.length > 1:
 *    - If anchor_month exists on age bands, choose smallest abs(anchor_month - selectedMonth)
 *    - Else choose smallest (selectedMonth - min_months) (prefer newer band at overlap)
 *    - If still tied, choose higher min_months
 * 4) if candidates.length === 0 -> null
 */
export function resolveAgeBandForMonth(
  selectedMonth: number,
  ageBands: AgeBandForMonthResolution[]
): ResolveAgeBandResult {
  const candidates = ageBands.filter(
    (b) => b.min_months <= selectedMonth && selectedMonth <= b.max_months
  );

  if (candidates.length === 0) {
    return { band: null, candidates: [], reason: 'no-candidates' };
  }

  if (candidates.length === 1) {
    return { band: candidates[0], candidates, reason: 'single-candidate' };
  }

  const allHaveAnchor = candidates.every(hasNumericAnchorMonth);
  if (allHaveAnchor) {
    const sorted = [...candidates].sort((a, b) => {
      const aDist = Math.abs((a.anchor_month as number) - selectedMonth);
      const bDist = Math.abs((b.anchor_month as number) - selectedMonth);
      if (aDist !== bDist) return aDist - bDist;
      if (a.min_months !== b.min_months) return b.min_months - a.min_months;
      return a.id.localeCompare(b.id);
    });

    return { band: sorted[0], candidates, reason: 'overlap-closest-anchor' };
  }

  const sorted = [...candidates].sort((a, b) => {
    const aScore = selectedMonth - a.min_months;
    const bScore = selectedMonth - b.min_months;
    if (aScore !== bScore) return aScore - bScore; // smaller => newer band at overlap
    if (a.min_months !== b.min_months) return b.min_months - a.min_months;
    return a.id.localeCompare(b.id);
  });

  return { band: sorted[0], candidates, reason: 'overlap-prefer-newer-band' };
}

export function getNearestSupportedMonth(
  selectedMonth: number,
  ageBands: AgeBandForMonthResolution[]
): number | null {
  if (ageBands.length === 0) return null;

  const minMin = Math.min(...ageBands.map((b) => b.min_months));
  const maxMax = Math.max(...ageBands.map((b) => b.max_months));

  const coversMonth = (m: number) =>
    ageBands.some((b) => b.min_months <= m && m <= b.max_months);

  let best: number | null = null;
  let bestDist = Infinity;

  for (let m = minMin; m <= maxMax; m += 1) {
    if (!coversMonth(m)) continue;
    const dist = Math.abs(m - selectedMonth);
    if (dist < bestDist) {
      bestDist = dist;
      best = m;
      continue;
    }
    if (dist === bestDist && best !== null) {
      // deterministic tie-break: prefer higher month
      if (m > best) best = m;
    }
  }

  return best;
}

export function formatMonthToBandDebugBadge(args: {
  selectedMonth: number;
  result: ResolveAgeBandResult;
}): string {
  const { selectedMonth, result } = args;
  const candidates = result.candidates.map((c) => c.id).join(',');

  if (!result.band) {
    return `Month ${selectedMonth} → no band (catalogue coming soon)`;
  }

  if (result.reason === 'single-candidate') {
    return `Month ${selectedMonth} → ${result.band.id} (candidates: ${candidates}; rule: single match)`;
  }

  if (result.reason === 'overlap-closest-anchor') {
    return `Month ${selectedMonth} → ${result.band.id} (candidates: ${candidates}; tie-break: overlap → closest anchor_month)`;
  }

  return `Month ${selectedMonth} → ${result.band.id} (candidates: ${candidates}; tie-break: overlap → prefer higher min_month)`;
}

