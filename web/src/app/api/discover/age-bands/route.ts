import { NextResponse } from 'next/server';
import { getGatewayAgeBandsPublicCached } from '@/lib/pl/gateway-cache';

export const revalidate = 1800;

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
};

/** GET /api/discover/age-bands — public age-band taxonomy (cached), shared by the home slider and /discover. */
export async function GET() {
  try {
    const bands = await getGatewayAgeBandsPublicCached();
    return NextResponse.json({ bands }, { headers: CACHE_HEADERS });
  } catch (err) {
    console.error('[api/discover/age-bands]', err);
    return NextResponse.json({ bands: [] }, { headers: CACHE_HEADERS });
  }
}
