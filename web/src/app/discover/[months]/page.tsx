import { redirect } from 'next/navigation';
import { getAgeBandForAge, getGatewayAgeBandIdsWithPicks, getGatewayAgeBandsPublic, getGatewayTopPicksForAgeBandAndWrapperSlug, getGatewayWrappersForAgeBand } from '../../../lib/pl/public';
import NewLandingPageClient from '../../new/[months]/NewLandingPageClient';

interface DiscoverMonthsPageProps {
  params: Promise<{ months: string }>;
  searchParams: Promise<{ wrapper?: string; show?: string }>;
}

export const dynamic = 'force-dynamic';

/** /discover/[months] — same experience as /new/[months], shared component, basePath /discover. */
export default async function DiscoverMonthsPage({ params, searchParams }: DiscoverMonthsPageProps) {
  const { months } = await params;
  const { wrapper: wrapperSlugParam, show: showParam } = await searchParams;

  const monthsNum = parseInt(months, 10);
  if (isNaN(monthsNum)) {
    redirect('/discover');
  }
  const monthParam = monthsNum;

  const ageBands = await getGatewayAgeBandsPublic();
  const bandsWithPicks = await getGatewayAgeBandIdsWithPicks();

  const ageBand = await getAgeBandForAge(monthParam);
  if (!ageBand) {
    redirect('/discover');
  }
  const selectedBandHasPicks = bandsWithPicks.has(ageBand.id);

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
      for (const w of wrappers) {
        const candidate = await getGatewayTopPicksForAgeBandAndWrapperSlug(ageBand.id, w.ux_slug, 3);
        if (candidate.length > 0) {
          effectiveWrapperSlug = w.ux_slug;
          picks = candidate;
          break;
        }
      }
      if (effectiveWrapperSlug) {
        redirect(`/discover/${monthParam}?wrapper=${encodeURIComponent(effectiveWrapperSlug)}&show=1`);
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
        wrappers={wrappers}
        selectedWrapperSlug={effectiveWrapperSlug}
        showPicks={shouldShowPicks}
        picks={picks}
        basePath="/discover"
      />
    </main>
  );
}
