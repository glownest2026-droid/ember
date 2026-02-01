import { redirect } from 'next/navigation';
import { getAgeBandForAge, getGatewayAgeBandIdsWithPicks, getGatewayAgeBandsPublic, getGatewayTopPicksForAgeBandAndWrapperSlug, getGatewayWrappersForAgeBand } from '../../../lib/pl/public';
import NewLandingPageClient from './NewLandingPageClient';

interface NewMonthsPageProps {
  params: Promise<{ months: string }>;
  searchParams: Promise<{ wrapper?: string; show?: string }>;
}

export const dynamic = 'force-dynamic';

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
  const ageBand = await getAgeBandForAge(monthParam);
  if (!ageBand) {
    redirect('/new');
  }
  const selectedBandHasPicks = bandsWithPicks.has(ageBand.id);
  
  // Fetch wrappers for this age band (gateway views)
  const wrappers = await getGatewayWrappersForAgeBand(ageBand.id);

  const selectedWrapperSlug =
    wrapperSlugParam && wrappers.some(w => w.ux_slug === wrapperSlugParam)
      ? wrapperSlugParam
      : null;

  const shouldShowPicks = showParam === '1' && selectedBandHasPicks;
  const effectiveWrapperSlug = selectedWrapperSlug ?? wrappers[0]?.ux_slug ?? null;

  if (shouldShowPicks && effectiveWrapperSlug && !selectedWrapperSlug) {
    // Make the URL deterministic for debugging/screenshots.
    redirect(`/new/${monthParam}?wrapper=${encodeURIComponent(effectiveWrapperSlug)}&show=1`);
  }

  const picks =
    shouldShowPicks && effectiveWrapperSlug
      ? await getGatewayTopPicksForAgeBandAndWrapperSlug(ageBand.id, effectiveWrapperSlug, 3)
      : [];

  return (
    <main className="min-h-screen" style={{ paddingTop: 'calc(var(--header-height) + env(safe-area-inset-top, 0px))' }}>
      <NewLandingPageClient
        ageBands={ageBands}
        ageBand={ageBand}
        monthParam={monthParam}
        selectedBandHasPicks={selectedBandHasPicks}
        wrappers={wrappers}
        selectedWrapperSlug={effectiveWrapperSlug}
        showPicks={shouldShowPicks}
        picks={picks}
      />
    </main>
  );
}

