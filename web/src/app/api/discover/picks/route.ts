import { NextRequest, NextResponse } from 'next/server';
import { getAgeBandForAge, getGatewayTopPicksForAgeBandAndCategoryType } from '@/lib/pl/public';

export const dynamic = 'force-dynamic';

/** GET /api/discover/picks?ageBandId=...&categoryTypeId=... — returns example picks for /family Examples modal. */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryTypeId = searchParams.get('categoryTypeId');
    if (!categoryTypeId || typeof categoryTypeId !== 'string') {
      return NextResponse.json({ error: 'categoryTypeId required' }, { status: 400 });
    }
    let ageBandId = searchParams.get('ageBandId');
    if (!ageBandId) {
      const defaultBand = await getAgeBandForAge(26);
      ageBandId = defaultBand?.id ?? null;
    }
    if (!ageBandId) {
      return NextResponse.json({ picks: [] });
    }
    const picks = await getGatewayTopPicksForAgeBandAndCategoryType(ageBandId, categoryTypeId, 12);
    return NextResponse.json({ picks });
  } catch (err) {
    console.error('[api/discover/picks]', err);
    return NextResponse.json({ picks: [] });
  }
}
