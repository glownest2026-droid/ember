import { unstable_cache } from 'next/cache';
import type { GatewayCategoryTypePublic, GatewayPick, GatewayWrapperPublic } from './public';
import {
  getGatewayAgeBandIdsWithPicks,
  getGatewayAgeBandsPublic,
  getGatewayCategoryTypesForAgeBandAndWrapper,
  getGatewayTopPicksForAgeBandAndCategoryType,
  getGatewayTopPicksForAgeBandAndWrapperSlug,
  getGatewayTopProductsForAgeBand,
  getGatewayWrappersForAgeBand,
} from './public';

/** Public gateway catalogue TTL (30 minutes). User-specific data is never cached here. */
export const GATEWAY_PUBLIC_REVALIDATE_SECONDS = 30 * 60;

const gatewayTag = 'gateway-public';

export function getGatewayAgeBandsPublicCached() {
  return unstable_cache(() => getGatewayAgeBandsPublic(), ['gateway-age-bands-public'], {
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
    ['gateway-category-types', ageBandId, wrapperSlug],
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
