import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/route-handler';
import { getAgeBandForAge, getGatewayStage3PicksForAgeBandAndCategoryType } from '@/lib/pl/public';
import {
  getGatewayTopPicksForAgeBandAndCategoryTypeCached,
  getGatewayTopPicksForAgeBandAndWrapperSlugCached,
} from '@/lib/pl/gateway-cache';

export const revalidate = 1800;
export const dynamic = 'force-dynamic';

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
};

const PRIVATE_HEADERS = {
  'Cache-Control': 'private, no-store',
};

/** GET /api/discover/picks?ageBandId=...&categoryTypeId=... OR &wrapperSlug=... — public catalogue picks (cached). */
export async function GET(req: NextRequest) {
  try {
    const { supabase, json } = createClient(req);
    const { searchParams } = new URL(req.url);
    const categoryTypeId = searchParams.get('categoryTypeId');
    const wrapperSlug = searchParams.get('wrapperSlug');
    let ageBandId = searchParams.get('ageBandId');
    if (!ageBandId) {
      const defaultBand = await getAgeBandForAge(26);
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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const canSeeLocked = user?.email?.toLowerCase() === 'timwd23@gmail.com';
      const stage3Picks = await getGatewayStage3PicksForAgeBandAndCategoryType(ageBandId, categoryTypeId, 5, {
        supabase,
        canSeeLocked,
      });
      if (stage3Picks.length > 0) {
        return json(
          {
            picks: stage3Picks,
            access: {
              canSeeLocked,
              lockedFromRank: canSeeLocked ? null : 2,
            },
          },
          { headers: PRIVATE_HEADERS }
        );
      }
      const picks = await getGatewayTopPicksForAgeBandAndCategoryTypeCached(ageBandId, categoryTypeId, 12);
      return NextResponse.json({ picks }, { headers: CACHE_HEADERS });
    }
    return NextResponse.json({ error: 'categoryTypeId or wrapperSlug required' }, { status: 400 });
  } catch (err) {
    console.error('[api/discover/picks]', err);
    return NextResponse.json({ picks: [] }, { headers: CACHE_HEADERS });
  }
}
