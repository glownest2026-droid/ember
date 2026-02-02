import { createClient } from '../../utils/supabase/server';

export type GatewayAgeBandPublic = {
  id: string;
  label: string | null;
  min_months: number | null;
  max_months: number | null;
};

/**
 * Fetch age bands for the public /new UI.
 *
 * Preferred source: curated view `v_gateway_age_bands_public` (Phase A contract).
 * Fallback: legacy table `pl_age_bands` (PR0-era).
 */
export async function getGatewayAgeBandsPublic(): Promise<GatewayAgeBandPublic[]> {
  const supabase = createClient();

  const { data: viewData, error: viewError } = await supabase
    .from('v_gateway_age_bands_public')
    .select('id, label, min_months, max_months')
    .order('min_months', { ascending: true });

  if (!viewError && viewData) {
    return viewData as GatewayAgeBandPublic[];
  }
  return [];
}

/**
 * Identify which age bands have any "picks" available, using the Phase A gateway
 * views where possible.
 *
 * Preferred source: `v_gateway_products_public` (expects `age_band_id` column).
 * Fallback: legacy published sets in `pl_age_moment_sets`.
 */
export async function getGatewayAgeBandIdsWithPicks(): Promise<Set<string>> {
  const supabase = createClient();

  const { data: productRows, error: productError } = await supabase
    .from('v_gateway_products_public')
    .select('age_band_id');

  if (!productError && productRows) {
    const ids = (productRows as Array<{ age_band_id?: string | null }>).map(r => r.age_band_id).filter(Boolean) as string[];
    return new Set(ids);
  }
  return new Set();
}

/**
 * Map age in months to the best matching active age band.
 * Returns the age band ID if found, or null if no match.
 * 
 * @param ageMonths - Age in months
 * @returns Age band object or null
 */
export async function getAgeBandForAge(ageMonths: number) {
  const supabase = createClient();

  // Preferred source: curated view (gateway public contract).
  // In a healthy mutually-exclusive scheme, exactly ONE band should match any month.
  const { data: rows, error } = await supabase
    .from('v_gateway_age_bands_public')
    .select('id, min_months, max_months, label')
    .lte('min_months', ageMonths)
    .gte('max_months', ageMonths)
    .order('min_months', { ascending: true })
    .limit(10);

  if (error || !rows) return null;
  if (rows.length === 0) return null;
  if (rows.length === 1) return rows[0];

  // This should not happen once bands are mutually exclusive. Treat as an error.
  const isProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
  const candidateIds = rows.map(r => r.id).join(', ');
  if (!isProd) {
    console.error(`ERROR: multiple age bands matched month=${ageMonths}: ${candidateIds}`);
  }

  // Deterministic fallback: choose the highest min_months (newest), but this is a safety net only.
  return [...rows].sort((a, b) => (a.min_months ?? 0) - (b.min_months ?? 0)).at(-1) ?? rows[0];
}

export type GatewayWrapperPublic = {
  ux_wrapper_id: string;
  ux_label: string;
  ux_slug: string;
  ux_description: string | null;
  age_band_id: string;
  rank: number;
};

export type GatewayCategoryTypePublic = {
  age_band_id: string;
  development_need_id: string;
  rank: number;
  rationale: string | null;
  id: string;
  slug: string;
  label: string | null;
  name: string | null;
  description: string | null;
  image_url: string | null;
  safety_notes: string | null;
};

export type GatewayProductPublic = {
  age_band_id: string;
  category_type_id: string;
  rank: number;
  rationale: string | null;
  id: string;
  name: string;
  brand: string | null;
  image_url: string | null;
  canonical_url: string | null;
  amazon_uk_url: string | null;
  affiliate_url: string | null;
  affiliate_deeplink: string | null;
};

export type GatewayPick = {
  product: GatewayProductPublic;
  categoryType: Pick<GatewayCategoryTypePublic, 'id' | 'slug' | 'label' | 'name'>;
};

/**
 * Fetch gateway UX wrappers for a given age band (public view).
 */
export async function getGatewayWrappersForAgeBand(ageBandId: string): Promise<GatewayWrapperPublic[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('v_gateway_wrappers_public')
    .select('ux_wrapper_id, ux_label, ux_slug, ux_description, age_band_id, rank')
    .eq('age_band_id', ageBandId)
    .order('rank', { ascending: true });

  if (error || !data) return [];
  return data as GatewayWrapperPublic[];
}

/**
 * Generate top picks for an age band + wrapper (public views only).
 *
 * Deterministic rule:
 * - Wrapper → development_need_id (via v_gateway_wrapper_detail_public)
 * - Need → ranked category types (via v_gateway_category_types_public)
 * - Category type → ranked products (via v_gateway_products_public)
 * - Output: first unique product per category in rank order, then fill remaining by next-ranked products.
 */
export async function getGatewayTopPicksForAgeBandAndWrapperSlug(
  ageBandId: string,
  wrapperSlug: string,
  limit: number = 3
): Promise<GatewayPick[]> {
  const supabase = createClient();

  const { data: wrapperDetail, error: wrapperError } = await supabase
    .from('v_gateway_wrapper_detail_public')
    .select('development_need_id, ux_slug')
    .eq('age_band_id', ageBandId)
    .eq('ux_slug', wrapperSlug)
    .limit(1)
    .maybeSingle();

  if (wrapperError || !wrapperDetail?.development_need_id) return [];

  const developmentNeedId = wrapperDetail.development_need_id as string;

  const { data: categoryRows, error: categoryError } = await supabase
    .from('v_gateway_category_types_public')
    .select('age_band_id, development_need_id, rank, rationale, id, slug, label, name, description, image_url, safety_notes')
    .eq('age_band_id', ageBandId)
    .eq('development_need_id', developmentNeedId)
    .order('rank', { ascending: true });

  if (categoryError || !categoryRows || categoryRows.length === 0) return [];

  const categories = categoryRows as GatewayCategoryTypePublic[];
  const categoryIds = categories.map(c => c.id);

  const { data: productRows, error: productError } = await supabase
    .from('v_gateway_products_public')
    .select('age_band_id, category_type_id, rank, rationale, id, name, brand, image_url, canonical_url, amazon_uk_url, affiliate_url, affiliate_deeplink')
    .eq('age_band_id', ageBandId)
    .in('category_type_id', categoryIds)
    .order('rank', { ascending: true });

  if (productError || !productRows || productRows.length === 0) return [];

  const products = productRows as GatewayProductPublic[];
  const productsByCategory = new Map<string, GatewayProductPublic[]>();
  for (const p of products) {
    const arr = productsByCategory.get(p.category_type_id) ?? [];
    arr.push(p);
    productsByCategory.set(p.category_type_id, arr);
  }

  const picks: GatewayPick[] = [];
  const usedProductIds = new Set<string>();

  // Pass 1: first product per category, in category rank order
  for (const cat of categories) {
    const list = productsByCategory.get(cat.id) ?? [];
    const first = list.find(p => !usedProductIds.has(p.id));
    if (!first) continue;
    picks.push({
      product: first,
      categoryType: { id: cat.id, slug: cat.slug, label: cat.label, name: cat.name },
    });
    usedProductIds.add(first.id);
    if (picks.length >= limit) return picks;
  }

  // Pass 2: fill remaining from next-ranked products, keeping category rank order
  for (const cat of categories) {
    const list = productsByCategory.get(cat.id) ?? [];
    for (const p of list) {
      if (usedProductIds.has(p.id)) continue;
      picks.push({
        product: p,
        categoryType: { id: cat.id, slug: cat.slug, label: cat.label, name: cat.name },
      });
      usedProductIds.add(p.id);
      if (picks.length >= limit) return picks;
    }
  }

  return picks;
}

/**
 * Fetch active moments that have at least one published set for a given age band.
 * Server-side only. Returns only active moments with published content.
 * 
 * @param ageBandId - The age band ID
 * @returns Array of moments with published sets, or empty array
 */
export async function getActiveMomentsForAgeBand(ageBandId: string) {
  const supabase = createClient();

  // First get all published sets for this age band
  const { data: sets, error: setsError } = await supabase
    .from('pl_age_moment_sets')
    .select('moment_id')
    .eq('age_band_id', ageBandId)
    .eq('status', 'published');

  if (setsError || !sets || sets.length === 0) {
    return [];
  }

  // Get unique moment IDs that have published sets
  const momentIds = [...new Set(sets.map(s => s.moment_id))];

  // Fetch the moments
  const { data: moments, error: momentsError } = await supabase
    .from('pl_moments')
    .select('id, label, description')
    .eq('is_active', true)
    .in('id', momentIds)
    .order('label', { ascending: true });

  if (momentsError) {
    return [];
  }

  return moments || [];
}

/**
 * Fetch published sets, cards, and evidence for an age band.
 * Server-side only. Returns only status='published' sets (in addition to RLS).
 * Includes category type and product display text.
 * 
 * @param ageBandId - The age band ID to fetch sets for
 * @returns Published sets with their cards, evidence, and display text, or null if error
 */
export async function getPublishedSetsForAgeBand(ageBandId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('pl_age_moment_sets')
    .select(`
      id,
      age_band_id,
      moment_id,
      status,
      headline,
      published_at,
      created_at,
      updated_at,
      pl_reco_cards (
        id,
        set_id,
        lane,
        rank,
        category_type_id,
        product_id,
        because,
        why_tags,
        created_at,
        updated_at,
        pl_category_types:category_type_id (
          id,
          name,
          label,
          slug
        ),
        products:product_id (
          id,
          name
        ),
        pl_evidence (
          id,
          card_id,
          source_type,
          url,
          quote_snippet,
          captured_at,
          confidence,
          created_at,
          updated_at
        )
      )
    `)
    .eq('age_band_id', ageBandId)
    .eq('status', 'published') // Explicit filter for published only
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching published sets:', error);
    return null;
  }

  return data || [];
}

/**
 * Parse age band slug like "24-30-months" to {min: 24, max: 30}.
 * Returns null if parsing fails.
 */
export function parseAgeBandSlug(slug: string): { min: number; max: number } | null {
  const match = slug.match(/^(\d+)-(\d+)-months$/);
  if (!match) {
    return null;
  }
  const min = parseInt(match[1], 10);
  const max = parseInt(match[2], 10);
  if (isNaN(min) || isNaN(max) || min >= max) {
    return null;
  }
  return { min, max };
}

/**
 * Find age band by min_months and max_months.
 * Returns the age band if found, or null.
 */
export async function getAgeBandByRange(minMonths: number, maxMonths: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('pl_age_bands')
    .select('id, min_months, max_months, label')
    .eq('is_active', true)
    .eq('min_months', minMonths)
    .eq('max_months', maxMonths)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Type for a transformed reco card with normalized foreign key relations
 */
export type TransformedRecoCard = {
  id: string;
  set_id: string;
  lane: 'obvious' | 'nearby' | 'surprise';
  rank: number;
  category_type_id: string | null;
  product_id: string | null;
  because: string;
  why_tags: string[] | null;
  created_at: string;
  updated_at: string;
  pl_category_types: {
    id: string;
    name?: string;
    label?: string;
    slug?: string;
  } | null;
  products: {
    id: string;
    name: string;
  } | null;
};

/**
 * Type for a transformed age moment set
 */
export type TransformedAgeMomentSet = {
  id: string;
  age_band_id: string;
  moment_id: string;
  status: string;
  headline: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  pl_reco_cards: TransformedRecoCard[] | null;
};

/**
 * Fetch a single published set for a specific age band and moment.
 * Returns the set with cards, or null if not found or error.
 * Used for the /new landing page to show top 3 picks.
 * 
 * @param ageBandId - The age band ID
 * @param momentId - The moment ID
 * @returns Published set with cards, or null
 */
export async function getPublishedSetForAgeBandAndMoment(
  ageBandId: string,
  momentId: string
): Promise<TransformedAgeMomentSet | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('pl_age_moment_sets')
    .select(`
      id,
      age_band_id,
      moment_id,
      status,
      headline,
      published_at,
      created_at,
      updated_at,
      pl_reco_cards (
        id,
        set_id,
        lane,
        rank,
        category_type_id,
        product_id,
        because,
        why_tags,
        created_at,
        updated_at,
        pl_category_types:category_type_id (
          id,
          name,
          label,
          slug
        ),
        products:product_id (
          id,
          name
        )
      )
    `)
    .eq('age_band_id', ageBandId)
    .eq('moment_id', momentId)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  // Transform data to match expected types
  // Supabase returns arrays for foreign key relations, but we expect single objects
  const transformedData: TransformedAgeMomentSet = {
    id: data.id,
    age_band_id: data.age_band_id,
    moment_id: data.moment_id,
    status: data.status,
    headline: data.headline ?? null,
    published_at: data.published_at ?? null,
    created_at: data.created_at,
    updated_at: data.updated_at,
    pl_reco_cards: data.pl_reco_cards
      ? (data.pl_reco_cards as any[]).map((card: any): TransformedRecoCard => ({
          id: card.id,
          set_id: card.set_id,
          lane: card.lane,
          rank: card.rank,
          category_type_id: card.category_type_id ?? null,
          product_id: card.product_id ?? null,
          because: card.because,
          why_tags: card.why_tags ?? null,
          created_at: card.created_at,
          updated_at: card.updated_at,
          // Transform pl_category_types from array to single object
          pl_category_types: Array.isArray(card.pl_category_types) && card.pl_category_types.length > 0
            ? {
                id: card.pl_category_types[0].id,
                name: card.pl_category_types[0].name,
                label: card.pl_category_types[0].label,
                slug: card.pl_category_types[0].slug,
              }
            : (card.pl_category_types && !Array.isArray(card.pl_category_types))
            ? {
                id: card.pl_category_types.id,
                name: card.pl_category_types.name,
                label: card.pl_category_types.label,
                slug: card.pl_category_types.slug,
              }
            : null,
          // Transform products from array to single object
          products: Array.isArray(card.products) && card.products.length > 0
            ? {
                id: card.products[0].id,
                name: card.products[0].name,
              }
            : (card.products && !Array.isArray(card.products))
            ? {
                id: card.products.id,
                name: card.products.name,
              }
            : null,
        }))
      : null,
  };

  // Sort cards by rank (obvious, nearby, surprise)
  if (transformedData.pl_reco_cards) {
    transformedData.pl_reco_cards.sort((a, b) => a.rank - b.rank);
  }

  return transformedData;
}
