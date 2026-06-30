import { NextResponse } from 'next/server';
import { getAgeBandForAge } from '@/lib/pl/public';
import { getGatewayAgeBandsPublicCached } from '@/lib/pl/gateway-cache';

// Cached in-process via unstable_cache; CDN caching via headers below.
export const revalidate = 1800;

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
};

/** GET /api/discover/age-bands — public age-band taxonomy, the same source /discover uses. */
export async function GET() {
  try {
    const bands = await getGatewayAgeBandsPublicCached();
    return NextResponse.json({ bands }, { headers: CACHE_HEADERS });
  } catch (err) {
    console.error('[api/discover/age-bands]', err);
    return NextResponse.json({ bands: [] }, { headers: CACHE_HEADERS });
  }
}
