import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getAgeBandForAge } from '../../lib/pl/public';
import { getGatewayAgeBandsPublicCached } from '../../lib/pl/gateway-cache';
import { DISCOVER_RESUME_COOKIE } from '../../lib/discover/discoverSession';

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

function resumeCookieName(childId: string | null | undefined): string {
  const id = childId?.trim() || 'none';
  return `${DISCOVER_RESUME_COOKIE}:${id}`;
}

/** /discover resumes saved section when possible; else age band from child or 25–27m default. */
export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const params = await searchParams;
  const q = params.child ? `?child=${encodeURIComponent(params.child)}` : '';
  const cookieStore = await cookies();
  const resumePath = cookieStore.get(resumeCookieName(params.child ?? null))?.value;
  if (resumePath?.startsWith('/discover')) {
    redirect(resumePath);
  }

  const ageBands = await getGatewayAgeBandsPublicCached();

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
        } else {
          const expectingBand = await getAgeBandForAge(0);
          representativeMonth = expectingBand
            ? getRepresentativeMonthForBand(expectingBand) ?? 0
            : 0;
        }
      }
    }
  }

  redirect(`/discover/${ageBands && ageBands.length > 0 ? representativeMonth : 26}${q}`);
}
