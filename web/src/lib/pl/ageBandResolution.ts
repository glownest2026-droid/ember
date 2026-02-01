export type AgeBandResolutionResult = {
  ageBandId: string | null;
  reason:
    | 'no-candidates'
    | 'single-candidate'
    | 'overlap-prefer-newer-band'
    | 'invalid-age-bands';
  candidates: string[];
};

type NormalizedAgeBand = {
  ageBandId: string;
  min: number;
  max: number;
  label?: string;
};

function coerceNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const n = parseInt(value, 10);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function parseRangeFromAgeBandId(ageBandId: string): { min: number; max: number } | null {
  // Supported formats:
  // - "23-25m"
  // - "25-27m"
  const match = ageBandId.match(/^(\d+)-(\d+)m$/);
  if (!match) return null;
  const min = parseInt(match[1], 10);
  const max = parseInt(match[2], 10);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  if (min > max) return null;
  return { min, max };
}

function normalizeAgeBandRow(row: unknown): NormalizedAgeBand | null {
  if (!row || typeof row !== 'object') return null;
  const r = row as Record<string, unknown>;

  const ageBandId =
    (typeof r.id === 'string' && r.id) ||
    (typeof r.age_band_id === 'string' && r.age_band_id) ||
    null;
  if (!ageBandId) return null;

  const min =
    coerceNumber(r.min_months) ??
    coerceNumber(r.min_month) ??
    parseRangeFromAgeBandId(ageBandId)?.min ??
    null;
  const max =
    coerceNumber(r.max_months) ??
    coerceNumber(r.max_month) ??
    parseRangeFromAgeBandId(ageBandId)?.max ??
    null;

  if (min === null || max === null) return null;

  const label = typeof r.label === 'string' ? r.label : undefined;
  return { ageBandId, min, max, label };
}

/**
 * Deterministic month -> age band mapping that tolerates schema drift.
 *
 * Rule:
 * - candidate if min <= selectedMonth <= max
 * - if multiple candidates: prefer the one with higher min (newer band at overlap)
 */
export function resolveAgeBandForMonth(selectedMonth: number, ageBands: unknown[]): AgeBandResolutionResult {
  const normalized = ageBands.map(normalizeAgeBandRow).filter(Boolean) as NormalizedAgeBand[];

  if (ageBands.length > 0 && normalized.length === 0) {
    return { ageBandId: null, reason: 'invalid-age-bands', candidates: [] };
  }

  const candidates = normalized.filter((b) => b.min <= selectedMonth && selectedMonth <= b.max);
  const candidateIds = candidates.map((c) => c.ageBandId);

  if (candidates.length === 0) {
    return { ageBandId: null, reason: 'no-candidates', candidates: candidateIds };
  }

  if (candidates.length === 1) {
    return { ageBandId: candidates[0].ageBandId, reason: 'single-candidate', candidates: candidateIds };
  }

  const chosen = [...candidates].sort((a, b) => {
    if (a.min !== b.min) return b.min - a.min; // prefer newer band
    return a.ageBandId.localeCompare(b.ageBandId);
  })[0];

  return { ageBandId: chosen.ageBandId, reason: 'overlap-prefer-newer-band', candidates: candidateIds };
}

export function formatMonthToBandDebugBadge(args: {
  selectedMonth: number;
  ageBandsLoaded: number;
  resolution: AgeBandResolutionResult;
  ageBandsError?: string | null;
}): string {
  const { selectedMonth, ageBandsLoaded, resolution, ageBandsError } = args;

  if (ageBandsError) {
    return `ageBands loaded: ${ageBandsLoaded}; Age bands failed to load: ${ageBandsError}`;
  }

  const candidates = resolution.candidates.join(',');
  if (!resolution.ageBandId) {
    return `ageBands loaded: ${ageBandsLoaded}; Month ${selectedMonth} → no band (candidates: ${candidates || '∅'}; reason: ${resolution.reason})`;
  }

  if (resolution.reason === 'single-candidate') {
    return `ageBands loaded: ${ageBandsLoaded}; Month ${selectedMonth} → ${resolution.ageBandId} (candidates: ${candidates}; rule: single match)`;
  }

  return `ageBands loaded: ${ageBandsLoaded}; Month ${selectedMonth} → ${resolution.ageBandId} (candidates: ${candidates}; tie-break: overlap → prefer higher min_month)`;
}

