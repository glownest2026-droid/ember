import { redirect } from 'next/navigation';
import { getGatewayAgeBandIdsWithPicks, getGatewayAgeBandsPublic, getGatewayTopPicksForAgeBandAndWrapperSlug, getGatewayWrappersForAgeBand } from '../../../lib/pl/public';
import NewLandingPageClient from './NewLandingPageClient';

interface NewMonthsPageProps {
  params: Promise<{ months: string }>;
  searchParams: Promise<{ wrapper?: string; show?: string }>;
}

export const dynamic = 'force-dynamic';

function resolveAgeBandForMonth(
  ageBands: Array<{ id: string; min_months: number | null; max_months: number | null; label?: string | null }>,
  month: number
): { band: (typeof ageBands)[number] | null; debug: { candidates: string[]; error: string | null } } {
  const candidates = ageBands.filter(b => {
    if (typeof b.min_months !== 'number' || typeof b.max_months !== 'number') return false;
    return b.min_months <= month && b.max_months >= month;
  });

  if (candidates.length === 0) {
    return { band: null, debug: { candidates: [], error: `No age band matched month=${month}` } };
  }

  if (candidates.length === 1) {
    return { band: candidates[0]!, debug: { candidates: [candidates[0]!.id], error: null } };
  }

  // Mutually-exclusive bands should NEVER produce multiple matches.
  const candidateIds = candidates.map(c => c.id);
  const error = `ERROR: multiple age bands matched month=${month}: ${candidateIds.join(', ')}`;

  // Keep the page functional with a deterministic fallback, but surface the error in non-prod debug.
  const fallback = [...candidates].sort((a, b) => (a.min_months ?? 0) - (b.min_months ?? 0)).at(-1) ?? candidates[0]!;
  return { band: fallback, debug: { candidates: candidateIds, error } };
}

export default async function NewMonthsPage({ params, searchParams }: NewMonthsPageProps) {
  const { months } = await params;
  const { wrapper: wrapperSlugParam, show: showParam } = await searchParams;
  
  // Parse month param (keep /new/[months] deep links)
  const monthsNum = parseInt(months, 10);
  if (isNaN(monthsNum)) {
    redirect('/new');
  }
  const monthParam = monthsNum;

  // Load available age bands (for age-band slider)
  const ageBands = await getGatewayAgeBandsPublic();
  const bandsWithPicks = await getGatewayAgeBandIdsWithPicks();

  // Map months to age band
  const resolution = resolveAgeBandForMonth(ageBands, monthParam);
  const ageBand = resolution.band;
  if (!ageBand) {
    redirect('/new');
  }

  const isProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
  const resolutionDebug =
    !isProd && resolution.debug.error
      ? `${resolution.debug.error} (chosen fallback: ${ageBand.id})`
      : null;

  const selectedBandHasPicks = bandsWithPicks.has(ageBand.id);
  
  // Fetch wrappers for this age band (gateway views)
  const wrappers = await getGatewayWrappersForAgeBand(ageBand.id);

  const selectedWrapperSlug =
    wrapperSlugParam && wrappers.some(w => w.ux_slug === wrapperSlugParam)
      ? wrapperSlugParam
      : null;

  const shouldShowPicks = showParam === '1' && selectedBandHasPicks;
  let effectiveWrapperSlug = selectedWrapperSlug ?? wrappers[0]?.ux_slug ?? null;
  let picks: Awaited<ReturnType<typeof getGatewayTopPicksForAgeBandAndWrapperSlug>> = [];

  if (shouldShowPicks) {
    if (selectedWrapperSlug) {
      effectiveWrapperSlug = selectedWrapperSlug;
      picks = await getGatewayTopPicksForAgeBandAndWrapperSlug(ageBand.id, selectedWrapperSlug, 3);
    } else {
      // Choose the first wrapper that actually yields picks (for deterministic screenshots/debug).
      for (const w of wrappers) {
        const candidate = await getGatewayTopPicksForAgeBandAndWrapperSlug(ageBand.id, w.ux_slug, 3);
        if (candidate.length > 0) {
          effectiveWrapperSlug = w.ux_slug;
          picks = candidate;
          break;
        }
      }
      if (effectiveWrapperSlug) {
        redirect(`/new/${monthParam}?wrapper=${encodeURIComponent(effectiveWrapperSlug)}&show=1`);
      }
    }
  }

  return (
    <main className="min-h-screen" style={{ paddingTop: 'calc(var(--header-height) + env(safe-area-inset-top, 0px))' }}>
      <NewLandingPageClient
        ageBands={ageBands}
        ageBand={ageBand}
        monthParam={monthParam}
        selectedBandHasPicks={selectedBandHasPicks}
        resolutionDebug={resolutionDebug}
        wrappers={wrappers}
        selectedWrapperSlug={effectiveWrapperSlug}
        showPicks={shouldShowPicks}
        picks={picks}
      />
    </main>
  );
}

