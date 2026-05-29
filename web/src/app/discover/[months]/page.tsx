import { redirect } from 'next/navigation';
import {
  getAgeBandForAge,
  getGatewayAgeBandIdsWithPicks,
  getGatewayAgeBandsPublic,
  getGatewayCategoryTypesForAgeBandAndWrapper,
  getGatewayTopPicksForAgeBandAndCategoryType,
  getGatewayTopPicksForAgeBandAndWrapperSlug,
  getGatewayTopProductsForAgeBand,
  getGatewayWrappersForAgeBand,
  type GatewayAgeBandPublic,
} from '../../../lib/pl/public';
import { getDiscoverServerPersonalization } from '../../../lib/discover/serverDiscoverChild';
import {
  applyCategoryImageOverrides,
  fetchDiscoverV2ImageMappings,
} from '../../../lib/discover/categoryImageOverrides';
import DiscoveryPageClient from './DiscoveryPageClient';

interface DiscoverMonthsPageProps {
  params: Promise<{ months: string }>;
  searchParams: Promise<{ wrapper?: string; show?: string; category?: string; debug?: string; child?: string }>;
}

/** Must stay dynamic: searchParams, redirects, and optional ?child= personalization. */
export const dynamic = 'force-dynamic';

function parseAgeBandIdRange(id: string): { min: number; max: number } | null {
  const match = id.match(/^(\d+)-(\d+)m$/);
  if (!match) return null;
  const min = parseInt(match[1], 10);
  const max = parseInt(match[2], 10);
  if (isNaN(min) || isNaN(max)) return null;
  return { min, max };
}

/** Resolve age band for a month without redirecting to /discover (avoids /discover ↔ /discover/26 loop). */
async function resolveAgeBandForMonth(
  monthParam: number,
  ageBands: GatewayAgeBandPublic[]
): Promise<Awaited<ReturnType<typeof getAgeBandForAge>>> {
  const fromDb = await getAgeBandForAge(monthParam);
  if (fromDb) return fromDb;

  for (const band of ageBands) {
    const min = typeof band.min_months === 'number' ? band.min_months : NaN;
    const max = typeof band.max_months === 'number' ? band.max_months : NaN;
    if (!isNaN(min) && !isNaN(max) && monthParam >= min && monthParam <= max) {
      return band;
    }
    const parsed = parseAgeBandIdRange(band.id);
    if (parsed && monthParam >= parsed.min && monthParam <= parsed.max) {
      return band;
    }
  }

  return ageBands[0] ?? null;
}

export default async function DiscoverMonthsPage({ params, searchParams }: DiscoverMonthsPageProps) {
  const { months } = await params;
  const { wrapper: wrapperSlugParam, show: showParam, category: categoryParam, debug: debugParam, child: childParam } = await searchParams;
  const showDebug = debugParam === '1';

  const monthsNum = parseInt(months, 10);
  if (isNaN(monthsNum)) {
    redirect('/discover');
  }
  const monthParam = monthsNum;

  const ageBands = await getGatewayAgeBandsPublic();
  const bandsWithPicks = await getGatewayAgeBandIdsWithPicks();

  const ageBand = await resolveAgeBandForMonth(monthParam, ageBands);
  if (!ageBand) {
    redirect('/discover/26');
  }
  const wrappers = await getGatewayWrappersForAgeBand(ageBand.id);
  const selectedBandHasPicks = bandsWithPicks.has(ageBand.id);
  const selectedBandHasProducts = selectedBandHasPicks;
  let selectedBandHasStage12Data = false;
  for (const wrapper of wrappers) {
    const categories = await getGatewayCategoryTypesForAgeBandAndWrapper(ageBand.id, wrapper.ux_slug);
    if (categories.length > 0) {
      selectedBandHasStage12Data = true;
      break;
    }
  }

  const selectedWrapperSlug =
    wrapperSlugParam && wrappers.some(w => w.ux_slug === wrapperSlugParam)
      ? wrapperSlugParam
      : null;

  const is25to27 = monthParam >= 25 && monthParam <= 27;
  const defaultSlug25to27 =
    is25to27 && wrappers.some(w => w.ux_slug === 'let-me-help') ? 'let-me-help' : null;

  const shouldShowPicks = showParam === '1' && selectedBandHasStage12Data;
  let effectiveWrapperSlug =
    selectedWrapperSlug ?? defaultSlug25to27 ?? wrappers[0]?.ux_slug ?? null;
  let picks: Awaited<ReturnType<typeof getGatewayTopPicksForAgeBandAndWrapperSlug>> = [];
  const exampleProducts = selectedBandHasProducts
    ? await getGatewayTopProductsForAgeBand(ageBand.id, 12)
    : [];

  const categoryTypesRaw =
    selectedBandHasStage12Data && selectedWrapperSlug
      ? await getGatewayCategoryTypesForAgeBandAndWrapper(ageBand.id, selectedWrapperSlug)
      : [];
  const v2ImageMappings =
    categoryTypesRaw.length > 0 ? await fetchDiscoverV2ImageMappings(categoryTypesRaw) : [];
  const categoryTypes = applyCategoryImageOverrides(categoryTypesRaw, v2ImageMappings);

  if (shouldShowPicks) {
    const categoryTypeId = categoryParam && categoryTypes.some((c) => c.id === categoryParam) ? categoryParam : null;
    if (categoryTypeId) {
      picks = await getGatewayTopPicksForAgeBandAndCategoryType(ageBand.id, categoryTypeId, 12);
    } else if (selectedWrapperSlug) {
      picks = await getGatewayTopPicksForAgeBandAndWrapperSlug(ageBand.id, selectedWrapperSlug, 12);
    } else {
      if (effectiveWrapperSlug) {
        const childQ = childParam ? `&child=${encodeURIComponent(childParam)}` : '';
        redirect(`/discover/${monthParam}?wrapper=${encodeURIComponent(effectiveWrapperSlug)}&show=1${childQ}`);
      }
    }
  }

  const serverPersonalization = await getDiscoverServerPersonalization(childParam);

  return (
    <main className="min-h-screen">
      <DiscoveryPageClient
        key={`discover-${monthParam}-${childParam ?? 'none'}`}
        ageBands={ageBands}
        ageBand={ageBand}
        monthParam={monthParam}
        selectedBandHasPicks={selectedBandHasPicks}
        selectedBandHasStage12Data={selectedBandHasStage12Data}
        wrappers={wrappers}
        selectedWrapperSlug={selectedWrapperSlug}
        showPicks={shouldShowPicks}
        picks={picks}
        exampleProducts={exampleProducts}
        categoryTypes={categoryTypes}
        showDebug={showDebug}
        initialChildId={childParam ?? undefined}
        serverPersonalization={serverPersonalization}
      />
    </main>
  );
}
