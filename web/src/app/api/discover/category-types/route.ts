import { NextRequest, NextResponse } from 'next/server';
import { getGatewayCategoryTypesForAgeBandAndWrapperCached } from '@/lib/pl/gateway-cache';
import {
  applyDeterministicStorageCategoryImages,
} from '@/lib/discover/categoryImageOverrides';

export const revalidate = 1800;
export const dynamic = 'force-dynamic';

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
};

/** GET /api/discover/category-types?ageBandId=...&wrapperSlug=... — Stage 2 cards (cached). */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ageBandId = searchParams.get('ageBandId');
    const wrapperSlug = searchParams.get('wrapperSlug');
    if (!ageBandId || !wrapperSlug) {
      return NextResponse.json({ error: 'ageBandId and wrapperSlug required' }, { status: 400 });
    }
    const categoriesRaw = await getGatewayCategoryTypesForAgeBandAndWrapperCached(
      ageBandId,
      wrapperSlug
    );
    const categories = applyDeterministicStorageCategoryImages(categoriesRaw);
    return NextResponse.json({ categories }, { headers: CACHE_HEADERS });
  } catch (err) {
    console.error('[api/discover/category-types]', err);
    return NextResponse.json({ categories: [] }, { headers: CACHE_HEADERS });
  }
}
