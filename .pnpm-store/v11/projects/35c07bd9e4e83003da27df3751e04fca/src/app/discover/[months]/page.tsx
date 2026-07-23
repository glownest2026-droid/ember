import { notFound, redirect } from 'next/navigation';
import type { GatewayAgeBandPublic } from '../../../lib/pl/public';
import {
  getGatewayAgeBandIdsWithPicksCached,
  getGatewayAgeBandsPublicCached,
  getGatewayCategoryTypesByWrapperForAgeBandCached,
  getGatewayHeroImageForAgeBandCached,
  getGatewayTopProductsForAgeBandCached,
  getGatewayWrappersForAgeBandCached,
} from '../../../lib/pl/gateway-cache';
import { applyDeterministicStorageCategoryImages } from '../../../lib/discover/categoryImageOverrides';
import { resolveAgeBandForMonthFromBands } from '../../../lib/discover/pilotAgeBandRange';
import DiscoveryPageClient from './DiscoveryPageClient';

interface DiscoverMonthsPageProps {
  params: Promise<{ months: string }>;
}

/** Catalogue shell is ISR-safe; query params are handled client-side. */
export const revalidate = 1800;

/** Resolve age band for a month without redirecting to /discover (avoids /discover ↔ /discover/26 loop). */
async function resolveAgeBandForMonth(
  monthParam: number,
  ageBands: GatewayAgeBandPublic[]
): Promise<GatewayAgeBandPublic | null> {
  return resolveAgeBandForMonthFromBands(monthParam, ageBands);
}

export default async function DiscoverMonthsPage({ params }: DiscoverMonthsPageProps) {
  const { months } = await params;

  const monthsNum = parseInt(months, 10);
  if (isNaN(monthsNum)) {
    redirect('/discover');
  }
  const monthParam = monthsNum;

  const [ageBands, bandsWithPicks] = await Promise.all([
    getGatewayAgeBandsPublicCached(),
    getGatewayAgeBandIdsWithPicksCached(),
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

  const selectedBandHasPicks = bandsWithPicks.has(ageBand.id);
  const selectedBandHasProducts = selectedBandHasPicks;
  const selectedBandHasStage12Data = wrapperSlugs.some(
    (slug) => (categoriesByWrapper[slug] ?? []).length > 0
  );

  const [exampleProducts, bandHeroImageUrl] = await Promise.all([
    selectedBandHasProducts
      ? getGatewayTopProductsForAgeBandCached(ageBand.id, 12)
      : Promise.resolve([]),
    getGatewayHeroImageForAgeBandCached(ageBand.id),
  ]);

  return (
    <main className="min-h-screen">
      <DiscoveryPageClient
        bandHeroImageUrl={bandHeroImageUrl}
        key={`discover-${monthParam}`}
        ageBands={ageBands}
        ageBand={ageBand}
        monthParam={monthParam}
        selectedBandHasPicks={selectedBandHasPicks}
        selectedBandHasStage12Data={selectedBandHasStage12Data}
        wrappers={wrappers}
        exampleProducts={exampleProducts}
        categoriesByWrapper={Object.fromEntries(
          wrapperSlugs.map((slug) => [
            slug,
            applyDeterministicStorageCategoryImages(categoriesByWrapper[slug] ?? []),
          ])
        )}
        giftFriendlyCountByWrapper={giftFriendlyCountByWrapper}
        bandHasGiftIdeas={bandHasGiftIdeas}
      />
    </main>
  );
}
