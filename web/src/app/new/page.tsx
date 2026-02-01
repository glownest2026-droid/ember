import { redirect } from 'next/navigation';
import { getGatewayAgeBandIdsWithPicks, getGatewayAgeBandsPublic } from '../../lib/pl/public';

function parseAgeBandIdRange(id: string): { min: number; max: number } | null {
  const match = id.match(/^(\d+)-(\d+)m$/);
  if (!match) return null;
  const min = parseInt(match[1], 10);
  const max = parseInt(match[2], 10);
  if (isNaN(min) || isNaN(max)) return null;
  return { min, max };
}

function getAnchorMonthForBand(band: { id: string; min_months: number | null; max_months: number | null }): number | null {
  if (typeof band.min_months === 'number' && !isNaN(band.min_months)) return band.min_months;
  const parsed = parseAgeBandIdRange(band.id);
  return parsed?.min ?? null;
}

export default async function NewPage() {
  const ageBands = await getGatewayAgeBandsPublic();
  const bandsWithPicks = await getGatewayAgeBandIdsWithPicks();

  if (!ageBands || ageBands.length === 0) {
    // Safe fallback (legacy behavior)
    redirect('/new/26');
  }

  // Default: first band (lowest min_months) with picks, otherwise newest band (highest min_months)
  const preferred =
    ageBands.find(b => bandsWithPicks.has(b.id)) ??
    ageBands[ageBands.length - 1];

  const anchorMonth = getAnchorMonthForBand(preferred) ?? 26;
  redirect(`/new/${anchorMonth}`);
}

