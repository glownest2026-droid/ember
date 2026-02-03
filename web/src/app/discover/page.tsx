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

function getRepresentativeMonthForBand(band: { id: string; min_months: number | null; max_months: number | null }): number | null {
  const min = typeof band.min_months === 'number' ? band.min_months : NaN;
  const max = typeof band.max_months === 'number' ? band.max_months : NaN;
  if (!isNaN(min) && !isNaN(max)) {
    return Math.round((min + max) / 2);
  }
  const parsed = parseAgeBandIdRange(band.id);
  if (!parsed) return null;
  return Math.round((parsed.min + parsed.max) / 2);
}

/** /discover redirects to first band with picks (same logic as /new). */
export default async function DiscoverPage() {
  const ageBands = await getGatewayAgeBandsPublic();
  const bandsWithPicks = await getGatewayAgeBandIdsWithPicks();

  if (!ageBands || ageBands.length === 0) {
    redirect('/discover/26');
  }

  const preferred =
    ageBands.find(b => bandsWithPicks.has(b.id)) ??
    ageBands[ageBands.length - 1];

  const representativeMonth = getRepresentativeMonthForBand(preferred) ?? 26;
  redirect(`/discover/${representativeMonth}`);
}
