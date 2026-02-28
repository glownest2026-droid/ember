import { NextRequest, NextResponse } from 'next/server';
import {
  getAgeBandForAge,
  getGatewayTopPicksForAgeBandAndCategoryType,
  getGatewayTopPicksForAgeBandAndWrapperSlug,
} from '@/lib/pl/public';

export const dynamic = 'force-dynamic';

/** GET /api/discover/picks?ageBandId=...&categoryTypeId=... OR &wrapperSlug=... — returns example picks for My ideas Examples modal. */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryTypeId = searchParams.get('categoryTypeId');
    const wrapperSlug = searchParams.get('wrapperSlug');
    let ageBandId = searchParams.get('ageBandId');
    if (!ageBandId) {
      const defaultBand = await getAgeBandForAge(26);
      ageBandId = defaultBand?.id ?? null;
    }
    if (!ageBandId) {
      return NextResponse.json({ picks: [] });
    }
    if (wrapperSlug && typeof wrapperSlug === 'string') {
      const picks = await getGatewayTopPicksForAgeBandAndWrapperSlug(ageBandId, wrapperSlug, 12);
      return NextResponse.json({ picks });
    }
    if (categoryTypeId && typeof categoryTypeId === 'string') {
      const picks = await getGatewayTopPicksForAgeBandAndCategoryType(ageBandId, categoryTypeId, 12);
      return NextResponse.json({ picks });
    }
    return NextResponse.json({ error: 'categoryTypeId or wrapperSlug required' }, { status: 400 });
  } catch (err) {
    console.error('[api/discover/picks]', err);
    return NextResponse.json({ picks: [] });
  }
}
