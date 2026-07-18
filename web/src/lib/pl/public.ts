import { createPublicCatalogueClient } from '../../utils/supabase/public-catalogue';

const CATEGORY_TYPE_SELECT =
  'age_band_id, development_need_id, rank, rationale, audience_lens, content_type, ui_lane, ui_section_title, lane_rank, show_ember_picks, show_gift_action, gift_friendly, buyer_mode_label, gift_note, ownership_note, product_family_label, primary_persona, card_cta_label, render_rule, id, slug, label, name, description, image_url, safety_notes';

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
  const supabase = createPublicCatalogueClient();

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
  const supabase = createPublicCatalogueClient();

  const { data: productRows, error: productError } = await supabase
    .from('v_gateway_products_public')
    .select('age_band_id');

  if (!productError && productRows) {
    const ids = new Set<string>();
    for (const row of productRows as Array<{ age_band_id?: string | null }>) {
      if (row.age_band_id) ids.add(row.age_band_id);
    }
    return ids;
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
  const supabase = createPublicCatalogueClient();

  // Preferred source: curated view (Phase A contract)
  const { data: viewData, error: viewError } = await supabase
    .from('v_gateway_age_bands_public')
    .select('id, min_months, max_months, label')
    .lte('min_months', ageMonths)
    .gte('max_months', ageMonths)
    // Tie-break for overlaps (e.g. month 25 in both 23–25 and 25–27):
    // prefer the band with the HIGHER min_months (newer band).
    .order('min_months', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!viewError && viewData) {
    return viewData;
  }
  return null;
}

export type GatewayWrapperPublic = {
  ux_wrapper_id: string;
  ux_label: string;
  ux_slug: string;
  ux_description: string | null;
  audience_lens: string | null;
  age_band_id: string;
  rank: number;
};

export type GatewayCategoryTypePublic = {
  age_band_id: string;
  development_need_id: string;
  rank: number;
  rationale: string | null;
  audience_lens: string | null;
  content_type: string | null;
  ui_lane: string | null;
  ui_section_title: string | null;
  lane_rank: number | null;
  show_ember_picks: boolean | null;
  show_gift_action: boolean | null;
  gift_friendly: boolean | null;
  buyer_mode_label: string | null;
  gift_note: string | null;
  ownership_note: string | null;
  product_family_label: string | null;
  primary_persona: string | null;
  card_cta_label: string | null;
  render_rule: string | null;
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
  best_for_tag?: string | null;
  title?: string | null;
  product_description_under_30_words?: string | null;
  why_pip_picked_this?: string | null;
  ember_verdict?: string | null;
  personalization_hint?: string | null;
  is_locked?: boolean | null;
  locked_for_non_members?: boolean | null;
  price_text?: string | null;
  retailer?: string | null;
};

export type GatewayPick = {
  product: GatewayProductPublic;
  categoryType: Pick<GatewayCategoryTypePublic, 'id' | 'slug' | 'label' | 'name'>;
};

/**
 * Fetch gateway UX wrappers for a given age band (public view).
 */
export async function getGatewayWrappersForAgeBand(ageBandId: string): Promise<GatewayWrapperPublic[]> {
  const supabase = createPublicCatalogueClient();

  const { data, error } = await supabase
    .from('v_gateway_wrappers_public')
    .select('ux_wrapper_id, ux_label, ux_slug, ux_description, audience_lens, age_band_id, rank')
    .eq('age_band_id', ageBandId)
    .order('rank', { ascending: true });

  if (error || !data) return [];
  return data as GatewayWrapperPublic[];
}

/** Image mapping from v_gateway_category_type_images (founder-managed URLs) */
export type GatewayCategoryTypeImage = {
  category_type_id: string;
  age_band_id: string | null;
  image_url: string;
  alt: string | null;
};

type CategoryImageRow = GatewayCategoryTypeImage;

function pickBestCategoryImages(
  rows: CategoryImageRow[],
  ageBandId?: string | null
): Map<string, GatewayCategoryTypeImage> {
  const grouped = new Map<string, CategoryImageRow[]>();
  for (const row of rows) {
    const list = grouped.get(row.category_type_id) ?? [];
    list.push(row);
    grouped.set(row.category_type_id, list);
  }

  const map = new Map<string, GatewayCategoryTypeImage>();
  for (const [categoryTypeId, list] of grouped) {
    const bandSpecific = ageBandId ? list.find((r) => r.age_band_id === ageBandId) : null;
    const globalFallback = list.find((r) => r.age_band_id == null);
    const chosen = bandSpecific ?? globalFallback ?? list[0];
    if (chosen) {
      map.set(categoryTypeId, {
        category_type_id: categoryTypeId,
        age_band_id: chosen.age_band_id,
        image_url: chosen.image_url,
        alt: chosen.alt,
      });
    }
  }
  return map;
}

/**
 * Fetch image mapping for category types (Layer B tiles).
 * Prefers age-band-specific rows, then global fallback (age_band_id IS NULL).
 */
export async function getGatewayCategoryTypeImages(
  categoryTypeIds: string[],
  ageBandId?: string | null
): Promise<Map<string, GatewayCategoryTypeImage>> {
  if (categoryTypeIds.length === 0) return new Map();
  const supabase = createPublicCatalogueClient();

  const { data, error } = await supabase
    .from('v_gateway_category_type_images')
    .select('category_type_id, age_band_id, image_url, alt')
    .in('category_type_id', categoryTypeIds);

  if (error || !data) return new Map();
  return pickBestCategoryImages(data as CategoryImageRow[], ageBandId);
}

/**
 * Pick a single representative category image for an age band, for the /discover hero.
 *
 * Cost-effective: one query for the band's category types (a small set, ordered by rank)
 * plus one batched lookup of founder-managed images. Returns the first available image so
 * the hero reflects the age band's development cards without fetching every wrapper.
 */
export async function getGatewayHeroImageForAgeBand(ageBandId: string): Promise<string | null> {
  const supabase = createPublicCatalogueClient();

  const { data: categoryRows, error: categoryError } = await supabase
    .from('v_gateway_category_types_public')
    .select('id, image_url, rank')
    .eq('age_band_id', ageBandId)
    .order('rank', { ascending: true });

  if (categoryError || !categoryRows || categoryRows.length === 0) return null;

  const rows = categoryRows as { id: string; image_url: string | null; rank: number }[];
  const imageMap = await getGatewayCategoryTypeImages(
    rows.map((r) => r.id),
    ageBandId
  );

  for (const row of rows) {
    const managed = imageMap.get(row.id)?.image_url;
    if (managed) return managed;
    if (row.image_url) return row.image_url;
  }
  return null;
}

/**
 * Resolve development_need_id(s) for an age band + wrapper.
 * Spine v2 bands use age-band-specific mappings; older bands fall back to the global wrapper→need link.
 */
function tokeniseForNeedMatch(value: string | null | undefined): Set<string> {
  const stop = new Set([
    'and', 'are', 'for', 'from', 'into', 'little', 'with', 'your', 'you',
    'the', 'this', 'that', 'them', 'they', 'their', 'now', 'cluster',
    'need', 'ent', 'cat', 'card', 'cards', 'games', 'play', 'ideas',
  ]);
  const normalized = (value ?? '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
  return new Set(
    normalized
      .split(/\s+/)
      .map((token) => token.trim())
      .filter((token) => token.length >= 3 && !stop.has(token))
  );
}

function scoreNeedMatch(wrapperTokens: Set<string>, categoryTokens: Set<string>): number {
  let score = 0;
  for (const token of wrapperTokens) {
    if (categoryTokens.has(token)) score += 4;
  }
  const wrapperList = [...wrapperTokens];
  for (const token of categoryTokens) {
    if (wrapperList.some((w) => token.includes(w) || w.includes(token))) score += 1;
  }
  return score;
}

async function hasCategoriesForNeedIds(ageBandId: string, needIds: string[]): Promise<boolean> {
  if (needIds.length === 0) return false;
  const supabase = createPublicCatalogueClient();
  const { data, error } = await supabase
    .from('v_gateway_category_types_public')
    .select('development_need_id')
    .eq('age_band_id', ageBandId)
    .in('development_need_id', needIds)
    .limit(1);
  return !error && !!data && data.length > 0;
}

async function recoverDevelopmentNeedIdsForWrapper(ageBandId: string, wrapperSlug: string): Promise<string[]> {
  const supabase = createPublicCatalogueClient();
  const { data: wrapperRow, error: wrapperError } = await supabase
    .from('v_gateway_wrappers_public')
    .select('ux_slug, ux_label, ux_description')
    .eq('age_band_id', ageBandId)
    .eq('ux_slug', wrapperSlug)
    .limit(1)
    .maybeSingle();

  if (wrapperError || !wrapperRow) return [];

  const { data: categories, error: categoryError } = await supabase
    .from('v_gateway_category_types_public')
    .select('development_need_id, slug, label, name, rationale, ui_lane')
    .eq('age_band_id', ageBandId);

  if (categoryError || !categories || categories.length === 0) return [];

  const wrapperTokens = tokeniseForNeedMatch(
    `${wrapperRow.ux_slug ?? ''} ${wrapperRow.ux_label ?? ''} ${wrapperRow.ux_description ?? ''}`
  );
  const grouped = new Map<string, Set<string>>();

  for (const category of categories as Array<{
    development_need_id: string;
    slug: string | null;
    label: string | null;
    name: string | null;
    rationale: string | null;
    ui_lane: string | null;
  }>) {
    const tokens = grouped.get(category.development_need_id) ?? new Set<string>();
    for (const token of tokeniseForNeedMatch(
      `${category.slug ?? ''} ${category.label ?? ''} ${category.name ?? ''} ${category.rationale ?? ''} ${category.ui_lane ?? ''}`
    )) {
      tokens.add(token);
    }
    grouped.set(category.development_need_id, tokens);
  }

  const ranked = [...grouped.entries()]
    .map(([needId, tokens]) => ({ needId, score: scoreNeedMatch(wrapperTokens, tokens) }))
    .filter((row) => row.score >= 8)
    .sort((a, b) => b.score - a.score);

  return ranked[0] ? [ranked[0].needId] : [];
}

async function getDevelopmentNeedIdsForAgeBandAndWrapper(
  ageBandId: string,
  wrapperSlug: string
): Promise<string[]> {
  const supabase = createPublicCatalogueClient();

  const { data: bandNeedRows, error: bandNeedError } = await supabase
    .from('v_gateway_age_band_wrapper_needs_public')
    .select('development_need_id, need_rank')
    .eq('age_band_id', ageBandId)
    .eq('wrapper_slug', wrapperSlug)
    .order('need_rank', { ascending: true });

  if (!bandNeedError && bandNeedRows && bandNeedRows.length > 0) {
    return bandNeedRows.map((row) => row.development_need_id as string);
  }

  const { data: wrapperDetail, error: wrapperError } = await supabase
    .from('v_gateway_wrapper_detail_public')
    .select('development_need_id')
    .eq('age_band_id', ageBandId)
    .eq('ux_slug', wrapperSlug)
    .limit(1)
    .maybeSingle();

  if (!wrapperError && wrapperDetail?.development_need_id) {
    const legacyNeedIds = [wrapperDetail.development_need_id as string];
    if (await hasCategoriesForNeedIds(ageBandId, legacyNeedIds)) return legacyNeedIds;
  }

  return recoverDevelopmentNeedIdsForWrapper(ageBandId, wrapperSlug);
}

function sortCategoriesByNeedOrder(
  categories: GatewayCategoryTypePublic[],
  needIds: string[]
): GatewayCategoryTypePublic[] {
  const needIndex = new Map(needIds.map((id, index) => [id, index]));
  return [...categories].sort((a, b) => {
    const needA = needIndex.get(a.development_need_id) ?? 0;
    const needB = needIndex.get(b.development_need_id) ?? 0;
    if (needA !== needB) return needA - needB;
    return a.rank - b.rank;
  });
}

/**
 * Fetch category types for an age band + wrapper (Layer B).
 * Uses v_gateway_category_types_public via wrapper → development_need resolution.
 * Joins image_url from v_gateway_category_type_images when available.
 */
export async function getGatewayCategoryTypesForAgeBandAndWrapper(
  ageBandId: string,
  wrapperSlug: string
): Promise<GatewayCategoryTypePublic[]> {
  const supabase = createPublicCatalogueClient();

  const developmentNeedIds = await getDevelopmentNeedIdsForAgeBandAndWrapper(ageBandId, wrapperSlug);
  if (developmentNeedIds.length === 0) return [];

  const { data: categoryRows, error: categoryError } = await supabase
    .from('v_gateway_category_types_public')
    .select(CATEGORY_TYPE_SELECT)
    .eq('age_band_id', ageBandId)
    .in('development_need_id', developmentNeedIds);

  if (categoryError || !categoryRows) return [];
  const categories = sortCategoriesByNeedOrder(
    categoryRows as GatewayCategoryTypePublic[],
    developmentNeedIds
  );

  const imageMap = await getGatewayCategoryTypeImages(
    categories.map((c) => c.id),
    ageBandId
  );
  return categories.map((c) => {
    const img = imageMap.get(c.id);
    return img ? { ...c, image_url: img.image_url } : c;
  });
}

export type GatewayCategoryTypesByWrapper = Record<string, GatewayCategoryTypePublic[]>;

function canonicalWrapperSlug(wrapperSlugs: string[], dbSlug: string): string {
  return wrapperSlugs.find((s) => s.toLowerCase() === dbSlug.toLowerCase()) ?? dbSlug;
}

/**
 * Batch-fetch Stage 2 category cards for every wrapper on an age band.
 * One wrapper→need mapping query, one category query, one image query (not N×wrapper).
 */
export async function getGatewayCategoryTypesByWrapperForAgeBand(
  ageBandId: string,
  wrapperSlugs: string[]
): Promise<GatewayCategoryTypesByWrapper> {
  const empty = Object.fromEntries(wrapperSlugs.map((slug) => [slug, []])) as GatewayCategoryTypesByWrapper;
  if (wrapperSlugs.length === 0) return empty;

  const supabase = createPublicCatalogueClient();
  const slugLookup = new Set(wrapperSlugs.map((s) => s.toLowerCase()));
  const needIdsByWrapper = new Map<string, string[]>();

  const { data: bandNeedRows, error: bandNeedError } = await supabase
    .from('v_gateway_age_band_wrapper_needs_public')
    .select('wrapper_slug, development_need_id, need_rank')
    .eq('age_band_id', ageBandId)
    .order('need_rank', { ascending: true });

  if (!bandNeedError && bandNeedRows) {
    for (const row of bandNeedRows) {
      const dbSlug = row.wrapper_slug as string;
      if (!slugLookup.has(dbSlug.toLowerCase())) continue;
      const slug = canonicalWrapperSlug(wrapperSlugs, dbSlug);
      const needId = row.development_need_id as string;
      const list = needIdsByWrapper.get(slug) ?? [];
      if (!list.includes(needId)) list.push(needId);
      needIdsByWrapper.set(slug, list);
    }
  }

  const missingSlugs = wrapperSlugs.filter((slug) => (needIdsByWrapper.get(slug) ?? []).length === 0);
  if (missingSlugs.length > 0) {
    const { data: wrapperDetails, error: wrapperError } = await supabase
      .from('v_gateway_wrapper_detail_public')
      .select('ux_slug, development_need_id')
      .eq('age_band_id', ageBandId)
      .in('ux_slug', missingSlugs);

    if (!wrapperError && wrapperDetails) {
      for (const row of wrapperDetails) {
        const dbSlug = row.ux_slug as string;
        const needId = row.development_need_id as string | null;
        if (!needId) continue;
        const slug = canonicalWrapperSlug(wrapperSlugs, dbSlug);
        if (await hasCategoriesForNeedIds(ageBandId, [needId])) {
          needIdsByWrapper.set(slug, [needId]);
        }
      }
    }
  }

  const stillMissingSlugs = wrapperSlugs.filter((slug) => (needIdsByWrapper.get(slug) ?? []).length === 0);
  for (const slug of stillMissingSlugs) {
    const recoveredNeedIds = await recoverDevelopmentNeedIdsForWrapper(ageBandId, slug);
    if (recoveredNeedIds.length > 0) needIdsByWrapper.set(slug, recoveredNeedIds);
  }

  const allNeedIds = [...new Set([...needIdsByWrapper.values()].flat())];
  if (allNeedIds.length === 0) return empty;

  const { data: categoryRows, error: categoryError } = await supabase
    .from('v_gateway_category_types_public')
    .select(CATEGORY_TYPE_SELECT)
    .eq('age_band_id', ageBandId)
    .in('development_need_id', allNeedIds);

  if (categoryError || !categoryRows) return empty;

  const imageMap = await getGatewayCategoryTypeImages(
    (categoryRows as GatewayCategoryTypePublic[]).map((c) => c.id),
    ageBandId
  );
  const withImages = (categoryRows as GatewayCategoryTypePublic[]).map((c) => {
    const img = imageMap.get(c.id);
    return img ? { ...c, image_url: img.image_url } : c;
  });

  const result = { ...empty };
  for (const slug of wrapperSlugs) {
    const needIds = needIdsByWrapper.get(slug) ?? [];
    if (needIds.length === 0) continue;
    const needSet = new Set(needIds);
    const filtered = withImages.filter((c) => needSet.has(c.development_need_id));
    result[slug] = sortCategoriesByNeedOrder(filtered, needIds);
  }
  return result;
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
  const supabase = createPublicCatalogueClient();

  const developmentNeedIds = await getDevelopmentNeedIdsForAgeBandAndWrapper(ageBandId, wrapperSlug);
  if (developmentNeedIds.length === 0) return [];

  const { data: categoryRows, error: categoryError } = await supabase
    .from('v_gateway_category_types_public')
    .select('age_band_id, development_need_id, rank, rationale, audience_lens, content_type, ui_lane, ui_section_title, lane_rank, show_ember_picks, show_gift_action, gift_friendly, buyer_mode_label, gift_note, ownership_note, product_family_label, primary_persona, card_cta_label, render_rule, id, slug, label, name, description, image_url, safety_notes')
    .eq('age_band_id', ageBandId)
    .in('development_need_id', developmentNeedIds);

  if (categoryError || !categoryRows || categoryRows.length === 0) return [];

  const categories = sortCategoriesByNeedOrder(
    categoryRows as GatewayCategoryTypePublic[],
    developmentNeedIds
  );
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
 * Fetch top picks for an age band + category type only (Layer B → Layer C linkage).
 * Products filtered by category_type_id so Layer C matches the selected Layer B category.
 */
export async function getGatewayTopPicksForAgeBandAndCategoryType(
  ageBandId: string,
  categoryTypeId: string,
  limit: number = 12
): Promise<GatewayPick[]> {
  const supabase = createPublicCatalogueClient();

  const { data: categoryRow, error: categoryError } = await supabase
    .from('v_gateway_category_types_public')
    .select('id, slug, label, name')
    .eq('age_band_id', ageBandId)
    .eq('id', categoryTypeId)
    .limit(1)
    .maybeSingle();

  if (categoryError || !categoryRow) return [];

  const category = categoryRow as Pick<GatewayCategoryTypePublic, 'id' | 'slug' | 'label' | 'name'>;

  const { data: productRows, error: productError } = await supabase
    .from('v_gateway_products_public')
    .select('age_band_id, category_type_id, rank, rationale, id, name, brand, image_url, canonical_url, amazon_uk_url, affiliate_url, affiliate_deeplink')
    .eq('age_band_id', ageBandId)
    .eq('category_type_id', categoryTypeId)
    .order('rank', { ascending: true })
    .limit(limit);

  if (productError || !productRows || productRows.length === 0) return [];

  const products = productRows as GatewayProductPublic[];
  return products.map((p) => ({
    product: p,
    categoryType: { id: category.id, slug: category.slug, label: category.label, name: category.name },
  }));
}

/**
 * Fetch top 3 products for an age band (across all categories).
 * Used for pre-interaction "A quick example" in Discovery.
 * Deterministic: rank asc, id asc.
 */
export async function getGatewayTopProductsForAgeBand(
  ageBandId: string,
  limit: number = 3
): Promise<GatewayPick[]> {
  const supabase = createPublicCatalogueClient();

  const { data: productRows, error: productError } = await supabase
    .from('v_gateway_products_public')
    .select('age_band_id, category_type_id, rank, rationale, id, name, brand, image_url, canonical_url, amazon_uk_url, affiliate_url, affiliate_deeplink')
    .eq('age_band_id', ageBandId)
    .order('rank', { ascending: true })
    .order('id', { ascending: true })
    .limit(limit);

  if (productError || !productRows || productRows.length === 0) return [];

  const products = productRows as GatewayProductPublic[];
  const categoryIds = [...new Set(products.map((p) => p.category_type_id).filter(Boolean))];

  if (categoryIds.length === 0) return [];

  const { data: categoryRows, error: categoryError } = await supabase
    .from('v_gateway_category_types_public')
    .select('id, slug, label, name')
    .eq('age_band_id', ageBandId)
    .in('id', categoryIds);

  if (categoryError || !categoryRows) return [];

  const categoryMap = new Map(
    (categoryRows as { id: string; slug: string | null; label: string | null; name: string | null }[]).map(
      (c) => [c.id, { id: c.id, slug: c.slug, label: c.label, name: c.name }]
    )
  );

  const picks: GatewayPick[] = [];
  for (const p of products) {
    const cat = p.category_type_id ? categoryMap.get(p.category_type_id) : null;
    picks.push({
      product: p,
      categoryType: cat
        ? { id: cat.id, slug: cat.slug ?? '', label: cat.label ?? '', name: cat.name ?? '' }
        : { id: p.category_type_id!, slug: '', label: '', name: '' },
    });
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
  const supabase = createPublicCatalogueClient();

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
  const supabase = createPublicCatalogueClient();

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
  const supabase = createPublicCatalogueClient();

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
  const supabase = createPublicCatalogueClient();

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
