import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getAgeBandForAge, getGatewayAgeBandIdsWithPicks, getGatewayAgeBandsPublic } from '../../lib/pl/public';

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

/** Age in months from birthdate (integer); negative if in future. */
function ageInMonthsFromBirthdate(birthdate: string): number {
  const birth = new Date(birthdate);
  const now = new Date();
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
}

/** /discover redirects to age band from child when ?child= and age known; else 25-27 months default. Preserves ?child=. */
export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const params = await searchParams;
  const q = params.child ? `?child=${encodeURIComponent(params.child)}` : '';

  const ageBands = await getGatewayAgeBandsPublic();
  const bandsWithPicks = await getGatewayAgeBandIdsWithPicks();

  if (!ageBands || ageBands.length === 0) {
    redirect(`/discover/26${q}`);
  }

  let representativeMonth = 26;

  if (params.child?.trim()) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: childRow } = await supabase
        .from('children')
        .select('birthdate, age_band')
        .eq('id', params.child.trim())
        .maybeSingle();
      if (childRow?.birthdate) {
        const months = ageInMonthsFromBirthdate(childRow.birthdate);
        if (months >= 0) {
          const band = await getAgeBandForAge(months);
          if (band) {
            const rep = getRepresentativeMonthForBand(band);
            if (rep != null) representativeMonth = rep;
          }
        }
      }
    }
  }

  redirect(`/discover/${representativeMonth}${q}`);
}
