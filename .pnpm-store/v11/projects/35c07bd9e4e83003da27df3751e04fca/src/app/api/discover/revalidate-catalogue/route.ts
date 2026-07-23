import { NextRequest, NextResponse } from 'next/server';
import { requireCronSecret } from '@/lib/runtime-guards';
import { revalidateDiscoverCatalogue } from '@/lib/pl/gateway-cache';

/** POST /api/discover/revalidate-catalogue?ageBandId=1-3m — bust Discover ISR after DB catalogue import. */
export async function POST(req: NextRequest) {
  const denied = requireCronSecret(req);
  if (denied) return denied;

  const ageBandId = new URL(req.url).searchParams.get('ageBandId') ?? undefined;
  await revalidateDiscoverCatalogue(ageBandId);
  return NextResponse.json({ ok: true, ageBandId: ageBandId ?? null });
}
