import { NextRequest } from 'next/server';
import { getAgeBandForAge, type GatewayPick } from '@/lib/pl/public';
import {
  getGatewayTopPicksForAgeBandAndCategoryTypeCached,
  getGatewayTopPicksForAgeBandAndWrapperSlugCached,
} from '@/lib/pl/gateway-cache';
import { createClient as createRouteClient } from '@/utils/supabase/route-handler';

export const dynamic = 'force-dynamic';

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
};

const PRIVATE_HEADERS = {
  'Cache-Control': 'private, no-store',
};

type SupabaseRouteClient = ReturnType<typeof createRouteClient>['supabase'];

type Stage3PickRow = {
  id: string;
  age_band_id: string;
  category_type_id: string;
  pick_rank: number;
  is_locked: boolean | null;
  best_for_tag: string | null;
  product_name: string;
  brand: string | null;
  retailer: string | null;
  product_url: string | null;
  image_url: string | null;
  price_text: string | null;
  product_description: string | null;
  ember_verdict: string | null;
  why_it_fits: string | null;
};

type CategoryRow = {
  id: string;
  slug: string | null;
  label: string | null;
  name: string | null;
};

// GET /api/discover/picks?ageBandId=...&categoryTypeId=... OR &wrapperSlug=...
export async function GET(req: NextRequest) {
  const { supabase, json } = createRouteClient(req);

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
      return json({ picks: [] }, { headers: CACHE_HEADERS });
    }

    if (categoryTypeId) {
      const stage3Picks = await getStage3PicksForCategory(supabase, ageBandId, categoryTypeId);
      if (stage3Picks.length > 0) {
        return json({ picks: withLockedPlaceholders(stage3Picks) }, { headers: PRIVATE_HEADERS });
      }

      const picks = await getGatewayTopPicksForAgeBandAndCategoryTypeCached(ageBandId, categoryTypeId, 12);
      return json({ picks }, { headers: CACHE_HEADERS });
    }

    if (wrapperSlug) {
      const picks = await getGatewayTopPicksForAgeBandAndWrapperSlugCached(ageBandId, wrapperSlug, 12);
      return json({ picks }, { headers: CACHE_HEADERS });
    }

    return json({ error: 'categoryTypeId or wrapperSlug required' }, { status: 400 });
  } catch (err) {
    console.error('[api/discover/picks]', err);
    return json({ picks: [] }, { headers: CACHE_HEADERS });
  }
}

async function getStage3PicksForCategory(
  supabase: SupabaseRouteClient,
  ageBandId: string,
  categoryTypeId: string
): Promise<GatewayPick[]> {
  const { data: categoryRow, error: categoryError } = await supabase
    .from('v_gateway_category_types_public')
    .select('id, slug, label, name')
    .eq('age_band_id', ageBandId)
    .eq('id', categoryTypeId)
    .limit(1)
    .maybeSingle();

  if (categoryError || !categoryRow) return [];
  const category = categoryRow as CategoryRow;

  const { data: rows, error } = await supabase
    .from('pl_stage3_picks')
    .select(
      'id, age_band_id, category_type_id, pick_rank, is_locked, best_for_tag, product_name, brand, retailer, product_url, image_url, price_text, product_description, ember_verdict, why_it_fits'
    )
    .eq('age_band_id', ageBandId)
    .eq('category_type_id', categoryTypeId)
    .eq('is_visible', true)
    .eq('status', 'visible')
    .order('pick_rank', { ascending: true })
    .limit(5);

  if (error || !rows || rows.length === 0) return [];

  return (rows as Stage3PickRow[]).map((row) => ({
    product: {
      id: row.id,
      age_band_id: row.age_band_id,
      category_type_id: row.category_type_id,
      rank: row.pick_rank,
      rationale: row.why_it_fits,
      name: row.product_name,
      brand: row.brand,
      image_url: row.image_url,
      canonical_url: row.product_url,
      amazon_uk_url: null,
      affiliate_url: null,
      affiliate_deeplink: null,
      best_for_tag: row.best_for_tag,
      title: row.best_for_tag,
      product_description_under_30_words: row.product_description,
      why_pip_picked_this: row.why_it_fits,
      ember_verdict: row.ember_verdict,
      personalization_hint: null,
      is_locked: row.is_locked,
      locked_for_non_members: row.is_locked,
      price_text: row.price_text,
      retailer: row.retailer,
    },
    categoryType: {
      id: category.id,
      slug: category.slug ?? '',
      label: category.label ?? '',
      name: category.name ?? '',
    },
  }));
}

function withLockedPlaceholders(picks: GatewayPick[]): GatewayPick[] {
  const out = [...picks];
  const first = picks[0];
  if (!first || out.length >= 5) return out.sort((a, b) => a.product.rank - b.product.rank);

  const existingRanks = new Set(out.map((pick) => pick.product.rank));
  for (let rank = 1; rank <= 5; rank += 1) {
    if (existingRanks.has(rank)) continue;
    out.push({
      product: {
        id: `${first.categoryType.id}-locked-${rank}`,
        age_band_id: first.product.age_band_id,
        category_type_id: first.categoryType.id,
        rank,
        rationale: null,
        name: `Pick ${rank}`,
        brand: null,
        image_url: null,
        canonical_url: null,
        amazon_uk_url: null,
        affiliate_url: null,
        affiliate_deeplink: null,
        best_for_tag: 'Ember Plus pick',
        title: `Pick ${rank}`,
        product_description_under_30_words: 'Another researched option is ready for Ember Plus.',
        why_pip_picked_this: 'Ember Plus shows the full shortlist and why each option fits.',
        ember_verdict: 'Ember Plus shows the full shortlist and why each option fits.',
        personalization_hint: null,
        is_locked: true,
        locked_for_non_members: true,
        price_text: null,
        retailer: null,
      },
      categoryType: first.categoryType,
    });
  }

  return out.sort((a, b) => a.product.rank - b.product.rank);
}
