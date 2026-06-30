import { notFound, redirect } from 'next/navigation';
import type { GatewayAgeBandPublic } from '../../../lib/pl/public';
import {
  getGatewayAgeBandIdsWithPicksCached,
  getGatewayAgeBandsPublicCached,
  getGatewayCategoryTypesByWrapperForAgeBandCached,
  getGatewayHeroImageForAgeBandCached,
  getGatewayTopPicksForAgeBandAndCategoryTypeCached,
  getGatewayTopPicksForAgeBandAndWrapperSlugCached,
  getGatewayTopProductsForAgeBandCached,
  getGatewayWrappersForAgeBandCached,
} from '../../../lib/pl/gateway-cache';
import { getDiscoverServerPersonalization } from '../../../lib/discover/serverDiscoverChild';
import { applyDeterministicStorageCategoryImages } from '../../../lib/discover/categoryImageOverrides';
import { resolveAgeBandForMonthFromBands } from '../../../lib/discover/pilotAgeBandRange';
import { resolveWrapperSlugFromFocusParam } from '../../../lib/compliance/resolveWrapperFromFocusParam';
import DiscoveryPageClient from './DiscoveryPageClient';

interface DiscoverMonthsPageProps {
  params: Promise<{ months: string }>;
  searchParams: Promise<{
    wrapper?: string;
    focus?: string;
    show?: string;
    review?: string;
    category?: string;
    debug?: string;
    child?: string;
  }>;
}

/** Must stay dynamic: searchParams, redirects, and optional ?child= personalization. */
export const dynamic = 'force-dynamic';

/** Resolve age band for a month without redirecting to /discover (avoids /discover ↔ /discover/26 loop). */
async function resolveAgeBandForMonth(
  monthParam: number,
  ageBands: GatewayAgeBandPublic[]
): Promise<GatewayAgeBandPublic | null> {
  return resolveAgeBandForMonthFromBands(monthParam, ageBands);
}

export default async function DiscoverMonthsPage({ params, searchParams }: DiscoverMonthsPageProps) {
  const { months } = await params;
  const {
    wrapper: wrapperSlugParam,
    focus: focusParam,
    show: showParam,
    review: reviewParam,
    category: categoryParam,
    debug: debugParam,
    child: childParam,
  } = await searchParams;
  const showDebug = debugParam === '1';
  const reviewMode = reviewParam === '1';

  const monthsNum = parseInt(months, 10);
  if (isNaN(monthsNum)) {
    redirect('/discover');
  }
  const monthParam = monthsNum;

  const [ageBands, bandsWithPicks, serverPersonalization] = await Promise.all([
    getGatewayAgeBandsPublicCached(),
    getGatewayAgeBandIdsWithPicksCached(),
    getDiscoverServerPersonalization(childParam),
  ]);

  const ageBand = await resolveAgeBandForMonth(monthParam, ageBands);
  if (!ageBand) {
    if (monthParam !== 26) redirect('/discover/26');
    notFound();
  }

  const wrappers = await getGatewayWrappersForAgeBandCached(ageBand.id);
  const wrapperSlugs = wrappers.map((w) => w.ux_slug);
  const categoriesByWrapper = await getGatewayCategoryTypesByWrapperForAgeBandCached(
    ageBand.id,
    wrapperSlugs
  );

  const giftFriendlyCountByWrapper: Record<string, number> = {};
  for (const slug of wrapperSlugs) {
    const categories = categoriesByWrapper[slug] ?? [];
    giftFriendlyCountByWrapper[slug] = categories.filter(
      (c) => c.content_type === 'product_category' && c.gift_friendly === true
    ).length;
  }
  const bandHasGiftIdeas = Object.values(giftFriendlyCountByWrapper).some((count) => count > 0);

  if (reviewMode && !showParam) {
    const focusWrapper = resolveWrapperSlugFromFocusParam(focusParam, wrappers);
    const reviewWrapper =
      (wrapperSlugParam && wrappers.some((w) => w.ux_slug === wrapperSlugParam) ? wrapperSlugParam : null) ??
      focusWrapper ??
      (monthParam >= 25 && monthParam <= 27 && wrappers.some((w) => w.ux_slug === 'let-me-help')
        ? 'let-me-help'
        : wrappers[0]?.ux_slug ?? null);
    if (reviewWrapper) {
      const childQ = childParam ? `&child=${encodeURIComponent(childParam)}` : '';
      const focusQ = focusParam ? `&focus=${encodeURIComponent(focusParam)}` : '';
      redirect(
        `/discover/${monthParam}?wrapper=${encodeURIComponent(reviewWrapper)}&show=1&review=1${focusQ}${childQ}`
      );
    }
  }

  const focusResolvedSlug = resolveWrapperSlugFromFocusParam(focusParam, wrappers);
  const wrapperFromQuery =
    (wrapperSlugParam && wrappers.some((w) => w.ux_slug === wrapperSlugParam) ? wrapperSlugParam : null) ??
    focusResolvedSlug;

  const selectedBandHasPicks = bandsWithPicks.has(ageBand.id);
  const selectedBandHasProducts = selectedBandHasPicks;
  const selectedBandHasStage12Data = wrapperSlugs.some(
    (slug) => (categoriesByWrapper[slug] ?? []).length > 0
  );

  const is25to27 = monthParam >= 25 && monthParam <= 27;
  const defaultSlug25to27 =
    is25to27 && wrappers.some((w) => w.ux_slug === 'let-me-help') ? 'let-me-help' : null;

  const selectedWrapperSlug =
    wrapperFromQuery ??
    (!wrapperSlugParam && !focusParam && is25to27 ? defaultSlug25to27 : null);

  const shouldShowPicks = (showParam === '1' || reviewMode) && selectedBandHasStage12Data;
  const effectiveWrapperSlug =
    selectedWrapperSlug ?? defaultSlug25to27 ?? wrappers[0]?.ux_slug ?? null;

  const categoryTypesRaw =
    selectedBandHasStage12Data && selectedWrapperSlug
      ? (categoriesByWrapper[selectedWrapperSlug] ?? [])
      : [];
  const categoryTypes = applyDeterministicStorageCategoryImages(categoryTypesRaw);

  let picks: Awaited<ReturnType<typeof getGatewayTopPicksForAgeBandAndWrapperSlugCached>> = [];
  if (shouldShowPicks) {
    const categoryTypeId =
      categoryParam && categoryTypes.some((c) => c.id === categoryParam) ? categoryParam : null;
    if (categoryTypeId) {
      picks = await getGatewayTopPicksForAgeBandAndCategoryTypeCached(ageBand.id, categoryTypeId, 12);
    } else if (selectedWrapperSlug) {
      picks = await getGatewayTopPicksForAgeBandAndWrapperSlugCached(ageBand.id, selectedWrapperSlug, 12);
    } else if (effectiveWrapperSlug) {
      const childQ = childParam ? `&child=${encodeURIComponent(childParam)}` : '';
      redirect(`/discover/${monthParam}?wrapper=${encodeURIComponent(effectiveWrapperSlug)}&show=1${childQ}`);
    }
  }

  const [exampleProducts, bandHeroImageUrl] = await Promise.all([
    selectedBandHasProducts
      ? getGatewayTopProductsForAgeBandCached(ageBand.id, 12)
      : Promise.resolve([]),
    categoryTypes.length === 0
      ? getGatewayHeroImageForAgeBandCached(ageBand.id)
      : Promise.resolve(null),
  ]);

  return (
    <main className="min-h-screen">
      <DiscoveryPageClient
        bandHeroImageUrl={bandHeroImageUrl}
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
        categoriesByWrapper={Object.fromEntries(
          wrapperSlugs.map((slug) => [
            slug,
            applyDeterministicStorageCategoryImages(categoriesByWrapper[slug] ?? []),
          ])
        )}
        giftFriendlyCountByWrapper={giftFriendlyCountByWrapper}
        bandHasGiftIdeas={bandHasGiftIdeas}
        showDebug={showDebug}
        initialChildId={childParam ?? undefined}
        serverPersonalization={serverPersonalization}
      />
    </main>
  );
}
