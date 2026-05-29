import { NextRequest, NextResponse } from 'next/server';
import {
  getAgeBandForAgeCached,
  getGatewayTopPicksForAgeBandAndCategoryTypeCached,
  getGatewayTopPicksForAgeBandAndWrapperSlugCached,
} from '@/lib/pl/gateway-cache';

export const revalidate = 1800;

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
};

/** GET /api/discover/picks?ageBandId=...&categoryTypeId=... OR &wrapperSlug=... — public catalogue picks (cached). */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryTypeId = searchParams.get('categoryTypeId');
    const wrapperSlug = searchParams.get('wrapperSlug');
    let ageBandId = searchParams.get('ageBandId');
    if (!ageBandId) {
      const defaultBand = await getAgeBandForAgeCached(26);
      ageBandId = defaultBand?.id ?? null;
    }
    if (!ageBandId) {
      return NextResponse.json({ picks: [] }, { headers: CACHE_HEADERS });
    }
    if (wrapperSlug && typeof wrapperSlug === 'string') {
      const picks = await getGatewayTopPicksForAgeBandAndWrapperSlugCached(ageBandId, wrapperSlug, 12);
      return NextResponse.json({ picks }, { headers: CACHE_HEADERS });
    }
    if (categoryTypeId && typeof categoryTypeId === 'string') {
      const picks = await getGatewayTopPicksForAgeBandAndCategoryTypeCached(ageBandId, categoryTypeId, 12);
      return NextResponse.json({ picks }, { headers: CACHE_HEADERS });
    }
    return NextResponse.json({ error: 'categoryTypeId or wrapperSlug required' }, { status: 400 });
  } catch (err) {
    console.error('[api/discover/picks]', err);
    return NextResponse.json({ picks: [] }, { headers: CACHE_HEADERS });
  }
}
