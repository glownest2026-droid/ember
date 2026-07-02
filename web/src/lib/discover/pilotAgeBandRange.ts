/** Age band month ranges — always from gateway / slider (pl_age_bands min_months, max_months). */
export function getEffectiveAgeBandRange(band: {
  id: string;
  min_months?: number | null;
  max_months?: number | null;
} | null): { min: number; max: number } | null {
  if (!band) return null;

  const min = typeof band.min_months === 'number' ? band.min_months : NaN;
  const max = typeof band.max_months === 'number' ? band.max_months : NaN;
  if (!Number.isNaN(min) && !Number.isNaN(max)) return { min, max };

  const match = band.id.match(/^(\d+)-(\d+)m$/);
  if (!match) return null;
  return { min: parseInt(match[1], 10), max: parseInt(match[2], 10) };
}

export function resolveAgeBandForMonthFromBands<T extends { id: string; min_months?: number | null; max_months?: number | null }>(
  monthParam: number,
  ageBands: T[]
): T | null {
  let best: T | null = null;
  let bestMin = -1;

  for (const band of ageBands) {
    const range = getEffectiveAgeBandRange(band);
    if (!range || monthParam < range.min || monthParam > range.max) continue;
    if (range.min > bestMin) {
      best = band;
      bestMin = range.min;
    }
  }

  return best ?? ageBands[0] ?? null;
}
