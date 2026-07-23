import { unstable_cache } from 'next/cache';
import type {
  GatewayCategoryTypePublic,
  GatewayCategoryTypesByWrapper,
  GatewayPick,
  GatewayWrapperPublic,
} from './public';
import {
  getGatewayAgeBandIdsWithPicks,
  getGatewayAgeBandsPublic,
  getGatewayCategoryTypeImages,
  getGatewayCategoryTypesByWrapperForAgeBand,
  getGatewayCategoryTypesForAgeBandAndWrapper,
  getGatewayHeroImageForAgeBand,
  getGatewayTopPicksForAgeBandAndCategoryType,
  getGatewayTopPicksForAgeBandAndWrapperSlug,
  getGatewayTopProductsForAgeBand,
  getGatewayWrappersForAgeBand,
} from './public';

/** Public gateway catalogue TTL (30 minutes). User-specific data is never cached here. */
export const GATEWAY_PUBLIC_REVALIDATE_SECONDS = 30 * 60;

/** Bump after catalogue imports so Discover picks up new Stage 2 rows without waiting for TTL. */
export const GATEWAY_CATALOGUE_CACHE_VERSION = '20260723-uk-market-eradication';

const gatewayTag = 'gateway-public';

/** Invalidate cached gateway reads + Discover shell after a catalogue DB import. */
export async function revalidateDiscoverCatalogue(ageBandId?: string) {
  const { revalidatePath, revalidateTag } = await import('next/cache');
  revalidateTag(gatewayTag, { expire: 0 });
  if (ageBandId) revalidateTag(`gateway-band-${ageBandId}`, { expire: 0 });
  revalidatePath('/discover', 'layout');
}

export function getGatewayAgeBandsPublicCached() {
  return unstable_cache(() => getGatewayAgeBandsPublic(), ['gateway-age-bands-public', GATEWAY_CATALOGUE_CACHE_VERSION], {
    revalidate: GATEWAY_PUBLIC_REVALIDATE_SECONDS,
    tags: [gatewayTag],
  })();
}

export async function getGatewayAgeBandIdsWithPicksCached(): Promise<Set<string>> {
  const ids = await unstable_cache(
    async () => [...(await getGatewayAgeBandIdsWithPicks())],
    ['gateway-age-band-ids-with-picks'],
    { revalidate: GATEWAY_PUBLIC_REVALIDATE_SECONDS, tags: [gatewayTag] }
  )();
  return new Set(ids);
}

/** Age-band lookup is not cached: null must not be stored (redirect routing) and must stay fresh. */

export function getGatewayWrappersForAgeBandCached(ageBandId: string) {
  return unstable_cache(
    () => getGatewayWrappersForAgeBand(ageBandId),
    ['gateway-wrappers', ageBandId],
    { revalidate: GATEWAY_PUBLIC_REVALIDATE_SECONDS, tags: [gatewayTag, `gateway-band-${ageBandId}`] }
  )();
}

export function getGatewayCategoryTypesForAgeBandAndWrapperCached(
  ageBandId: string,
  wrapperSlug: string
): Promise<GatewayCategoryTypePublic[]> {
  return unstable_cache(
    () => getGatewayCategoryTypesForAgeBandAndWrapper(ageBandId, wrapperSlug),
    ['gateway-category-types', GATEWAY_CATALOGUE_CACHE_VERSION, ageBandId, wrapperSlug],
    { revalidate: GATEWAY_PUBLIC_REVALIDATE_SECONDS, tags: [gatewayTag, `gateway-band-${ageBandId}`] }
  )();
}

export function getGatewayCategoryTypesByWrapperForAgeBandCached(
  ageBandId: string,
  wrapperSlugs: string[]
): Promise<GatewayCategoryTypesByWrapper> {
  const slugsKey = [...wrapperSlugs].sort().join(',');
  return unstable_cache(
    () => getGatewayCategoryTypesByWrapperForAgeBand(ageBandId, wrapperSlugs),
    ['gateway-category-types-by-wrapper', GATEWAY_CATALOGUE_CACHE_VERSION, ageBandId, slugsKey],
    { revalidate: GATEWAY_PUBLIC_REVALIDATE_SECONDS, tags: [gatewayTag, `gateway-band-${ageBandId}`] }
  )();
}

/** Stage 2 copy is ISR-cached; founder-managed images are merged on every request. */
export async function getGatewayCategoryTypesByWrapperForAgeBandWithFreshImages(
  ageBandId: string,
  wrapperSlugs: string[]
): Promise<GatewayCategoryTypesByWrapper> {
  const cached = await getGatewayCategoryTypesByWrapperForAgeBandCached(ageBandId, wrapperSlugs);
  const allIds = [...new Set(Object.values(cached).flat().map((c) => c.id))];
  if (allIds.length === 0) return cached;

  const imageMap = await getGatewayCategoryTypeImages(allIds, ageBandId);
  const out: GatewayCategoryTypesByWrapper = {};
  for (const slug of wrapperSlugs) {
    out[slug] = (cached[slug] ?? []).map((c) => {
      const img = imageMap.get(c.id);
      return img ? { ...c, image_url: img.image_url } : { ...c, image_url: null };
    });
  }
  return out;
}

/** Single-wrapper Stage 2 fetch with fresh founder-managed images. */
export async function getGatewayCategoryTypesForAgeBandAndWrapperWithFreshImages(
  ageBandId: string,
  wrapperSlug: string
): Promise<GatewayCategoryTypePublic[]> {
  const cached = await getGatewayCategoryTypesForAgeBandAndWrapperCached(ageBandId, wrapperSlug);
  if (cached.length === 0) return cached;

  const imageMap = await getGatewayCategoryTypeImages(
    cached.map((c) => c.id),
    ageBandId
  );
  return cached.map((c) => {
    const img = imageMap.get(c.id);
    return img ? { ...c, image_url: img.image_url } : { ...c, image_url: null };
  });
}

export function getGatewayHeroImageForAgeBandCached(ageBandId: string) {
  return unstable_cache(
    () => getGatewayHeroImageForAgeBand(ageBandId),
    ['gateway-hero-image', ageBandId],
    { revalidate: GATEWAY_PUBLIC_REVALIDATE_SECONDS, tags: [gatewayTag, `gateway-band-${ageBandId}`] }
  )();
}

export function getGatewayTopProductsForAgeBandCached(ageBandId: string, limit: number) {
  return unstable_cache(
    () => getGatewayTopProductsForAgeBand(ageBandId, limit),
    ['gateway-top-products', ageBandId, String(limit)],
    { revalidate: GATEWAY_PUBLIC_REVALIDATE_SECONDS, tags: [gatewayTag, `gateway-band-${ageBandId}`] }
  )();
}

export function getGatewayTopPicksForAgeBandAndWrapperSlugCached(
  ageBandId: string,
  wrapperSlug: string,
  limit: number
): Promise<GatewayPick[]> {
  return unstable_cache(
    () => getGatewayTopPicksForAgeBandAndWrapperSlug(ageBandId, wrapperSlug, limit),
    ['gateway-picks-wrapper', ageBandId, wrapperSlug, String(limit)],
    { revalidate: GATEWAY_PUBLIC_REVALIDATE_SECONDS, tags: [gatewayTag, `gateway-band-${ageBandId}`] }
  )();
}

export function getGatewayTopPicksForAgeBandAndCategoryTypeCached(
  ageBandId: string,
  categoryTypeId: string,
  limit: number
): Promise<GatewayPick[]> {
  return unstable_cache(
    () => getGatewayTopPicksForAgeBandAndCategoryType(ageBandId, categoryTypeId, limit),
    ['gateway-picks-category', ageBandId, categoryTypeId, String(limit)],
    { revalidate: GATEWAY_PUBLIC_REVALIDATE_SECONDS, tags: [gatewayTag, `gateway-band-${ageBandId}`] }
  )();
}

export type { GatewayWrapperPublic };
