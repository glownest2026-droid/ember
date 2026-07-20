import { createClient } from '@/utils/supabase/client';

const CATEGORY_IMG =
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images';

/** Catalogue art for the At home add hero. */
export const AT_HOME_HERO_IMAGE =
  `${CATEGORY_IMG}/ember_cat_low_shelf_tidy_category.png`;

/** Sync Discover Stage 2 Have into At home (garage_items). Best-effort — never blocks Have UX. */
export async function syncAtHomeFromDiscoverHave(args: {
  categoryTypeId: string;
  childId: string;
  have: boolean;
}): Promise<void> {
  try {
    const supabase = createClient();
    const { error } = await supabase.rpc('sync_at_home_from_discover_have', {
      p_category_type_id: args.categoryTypeId,
      p_child_id: args.childId,
      p_have: args.have,
    });
    if (error) {
      console.warn('[at-home] sync_at_home_from_discover_have failed', error.message);
    }
  } catch (err) {
    console.warn('[at-home] sync_at_home_from_discover_have threw', err);
  }
}

export type AtHomeItemStatus = 'owned' | 'ready_to_move_on' | 'listed' | 'sold' | 'archived';

export type AtHomeItem = {
  id: string;
  status: AtHomeItemStatus;
  childId: string | null;
  productTypeId: string | null;
  categoryTypeId: string | null;
  label: string;
  imageUrl: string | null;
  addedAt: string;
};

export type Stage2MatchCandidate = {
  category_type_id: string;
  slug: string;
  label: string;
  age_band_id: string | null;
  image_url: string | null;
  confidence_bucket: 'high' | 'medium' | 'low';
  score?: number | null;
};

export type AtHomeItemTypeMatch = {
  product_type_id: string;
  slug: string;
  label: string;
  subtitle: string | null;
  family_slug: string | null;
  family_label: string | null;
  family_hint: string | null;
  specific_label: string | null;
  confidence_bucket: 'high' | 'medium' | 'low';
  score?: number | null;
  match_source?: 'catalogue' | 'ai';
  ai_hint?: string | null;
};

type GarageRow = {
  id: string;
  status: AtHomeItemStatus;
  child_id: string | null;
  product_type_id: string | null;
  category_type_id: string | null;
  raw_query: string | null;
  added_at: string;
  product_types: { label: string | null; subtitle: string | null } | null;
  pl_category_types: { label: string | null; image_url: string | null } | null;
};

function mapRow(row: GarageRow): AtHomeItem {
  const categoryLabel = row.pl_category_types?.label?.trim() || null;
  const productLabel = row.product_types?.label?.trim() || null;
  const fallback = row.raw_query?.trim() || 'Item at home';
  return {
    id: row.id,
    status: row.status,
    childId: row.child_id,
    productTypeId: row.product_type_id,
    categoryTypeId: row.category_type_id,
    label: categoryLabel || productLabel || fallback,
    imageUrl: row.pl_category_types?.image_url ?? null,
    addedAt: row.added_at,
  };
}

/** Load active At home items for the signed-in parent (optional child filter). */
export async function fetchAtHomeItems(args?: {
  childId?: string | null;
}): Promise<{ items: AtHomeItem[]; error: string | null }> {
  const supabase = createClient();
  let query = supabase
    .from('garage_items')
    .select(
      `
      id,
      status,
      child_id,
      product_type_id,
      category_type_id,
      raw_query,
      added_at,
      product_types ( label, subtitle ),
      pl_category_types ( label, image_url )
    `
    )
    .in('status', ['owned', 'ready_to_move_on', 'listed'])
    .order('added_at', { ascending: false });

  if (args?.childId) {
    query = query.eq('child_id', args.childId);
  }

  const { data, error } = await query;
  if (error) {
    return { items: [], error: error.message };
  }

  const rows = (data ?? []) as unknown as GarageRow[];
  return { items: rows.map(mapRow), error: null };
}

export function atHomeListItHref(itemId: string): string {
  return `/app/listings?new=1&household_item=${encodeURIComponent(itemId)}`;
}

/** Dedicated At home add flow (text-first, optional photo, item-type confirm). */
export function atHomeAddHref(
  childId?: string | null,
  from: 'family' | 'at-home' = 'at-home'
): string {
  const params = new URLSearchParams({ from });
  if (childId) params.set('child', childId);
  return `/family/at-home/add?${params.toString()}`;
}

/** Match parent text to consolidated item-type families (At home add). */
export async function matchAtHomeItemTypes(args: {
  query: string;
  limit?: number;
  allowAi?: boolean;
}): Promise<{
  match: AtHomeItemTypeMatch | null;
  candidates: AtHomeItemTypeMatch[];
  error: string | null;
  aiLimitMessage?: string | null;
}> {
  const q = args.query.trim();
  if (!q) return { match: null, candidates: [], error: null };

  const params = new URLSearchParams({ q, limit: String(args.limit ?? 1) });
  if (args.allowAi) params.set('allowAi', '1');

  try {
    const res = await fetch(`/api/inventory/match-at-home?${params.toString()}`);
    const payload = (await res.json()) as {
      match?: AtHomeItemTypeMatch | null;
      candidates?: AtHomeItemTypeMatch[];
      error?: string;
      ai_limit_message?: string;
    };
    if (!res.ok) {
      return { match: null, candidates: [], error: payload.error ?? 'Could not find a match.' };
    }
    const candidates = payload.candidates ?? (payload.match ? [payload.match] : []);
    return {
      match: payload.match ?? candidates[0] ?? null,
      candidates,
      error: null,
      aiLimitMessage: payload.ai_limit_message ?? null,
    };
  } catch {
    return { match: null, candidates: [], error: 'Could not reach match service.' };
  }
}

/** Teach catalogue when parent confirms an AI-suggested match. */
export async function learnAtHomeAlias(args: {
  query: string;
  productTypeId: string;
}): Promise<void> {
  try {
    await fetch('/api/inventory/learn-at-home-alias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: args.query.trim(),
        productTypeId: args.productTypeId,
      }),
    });
  } catch {
    // Best-effort — never block save.
  }
}

export async function matchStage2Categories(args: {
  query: string;
  childId?: string | null;
  ageBandId?: string | null;
  limit?: number;
}): Promise<{ candidates: Stage2MatchCandidate[]; error: string | null }> {
  const q = args.query.trim();
  if (!q) return { candidates: [], error: null };

  const params = new URLSearchParams({ q, limit: String(args.limit ?? 3) });
  if (args.childId) params.set('childId', args.childId);
  if (args.ageBandId) params.set('ageBandId', args.ageBandId);

  try {
    const res = await fetch(`/api/inventory/match-stage2?${params.toString()}`);
    const payload = (await res.json()) as {
      candidates?: Stage2MatchCandidate[];
      error?: string;
    };
    if (!res.ok) {
      return { candidates: [], error: payload.error ?? 'Could not find matches.' };
    }
    return { candidates: payload.candidates ?? [], error: null };
  } catch {
    return { candidates: [], error: 'Could not reach match service.' };
  }
}

async function resolveProductTypeId(
  supabase: ReturnType<typeof createClient>,
  categoryTypeId: string,
  rawQuery: string | null
): Promise<string | null> {
  const { data: ct } = await supabase
    .from('pl_category_types')
    .select('slug, label')
    .eq('id', categoryTypeId)
    .maybeSingle();

  const slug = (ct as { slug?: string } | null)?.slug;
  const label = (ct as { label?: string } | null)?.label;

  if (slug) {
    const stripped = slug.replace(/^cat_/, '');
    const { data: bySlug } = await supabase
      .from('product_types')
      .select('id')
      .eq('is_active', true)
      .eq('slug', slug)
      .maybeSingle();
    if (bySlug?.id) return bySlug.id as string;
    if (stripped !== slug) {
      const { data: byStripped } = await supabase
        .from('product_types')
        .select('id')
        .eq('is_active', true)
        .eq('slug', stripped)
        .maybeSingle();
      if (byStripped?.id) return byStripped.id as string;
    }
  }

  const matchQuery = rawQuery?.trim() || label?.trim();
  if (matchQuery) {
    const { data: matched } = await supabase.rpc('inventory_match_product_types', {
      query_text: matchQuery,
      p_limit: 1,
    });
    const first = (matched as { id?: string }[] | null)?.[0];
    if (first?.id) return first.id;
  }

  return null;
}

/** Save At home from item-type confirm (text and/or photo path). */
export async function saveAtHomeFromProductTypeMatch(args: {
  userId: string;
  productTypeId?: string | null;
  childId?: string | null;
  rawQuery?: string | null;
  hasPhoto?: boolean;
  draftId?: string | null;
}): Promise<{ itemId: string | null; error: string | null }> {
  const supabase = createClient();
  const childId = args.childId?.trim() || null;
  const label = args.rawQuery?.trim() || null;
  const productTypeId = args.productTypeId?.trim() || null;

  const { data, error } = await supabase
    .from('garage_items')
    .insert({
      user_id: args.userId,
      product_type_id: productTypeId,
      child_scope_type: childId ? 'single_child' : 'unknown',
      child_id: childId,
      raw_query: label,
      source: args.hasPhoto ? 'photo_assisted' : 'manual_match',
      status: 'owned',
    })
    .select('id')
    .single();

  if (error || !data?.id) {
    return { itemId: null, error: error?.message ?? 'Could not save to At home.' };
  }

  if (args.draftId) {
    await supabase
      .from('marketplace_listing_drafts')
      .update({
        household_item_id: data.id,
        ...(productTypeId ? { product_type_id: productTypeId } : {}),
      })
      .eq('id', args.draftId)
      .eq('user_id', args.userId);
  }

  return { itemId: data.id, error: null };
}

/** Save At home from Stage 2 parent confirm (Discover Have bridge — legacy path). */
export async function saveAtHomeFromStage2Match(args: {
  userId: string;
  categoryTypeId?: string | null;
  childId?: string | null;
  rawQuery?: string | null;
  hasPhoto?: boolean;
  draftId?: string | null;
}): Promise<{ itemId: string | null; error: string | null }> {
  const supabase = createClient();
  const childId = args.childId?.trim() || null;
  const label = args.rawQuery?.trim() || null;
  const productTypeId = args.categoryTypeId
    ? await resolveProductTypeId(supabase, args.categoryTypeId, label)
    : null;

  const { data, error } = await supabase
    .from('garage_items')
    .insert({
      user_id: args.userId,
      product_type_id: productTypeId,
      category_type_id: args.categoryTypeId ?? null,
      child_scope_type: childId ? 'single_child' : 'unknown',
      child_id: childId,
      raw_query: label,
      source: args.hasPhoto ? 'photo_assisted' : 'manual_match',
      status: 'owned',
    })
    .select('id')
    .single();

  if (error || !data?.id) {
    return { itemId: null, error: error?.message ?? 'Could not save to At home.' };
  }

  if (args.draftId) {
    await supabase
      .from('marketplace_listing_drafts')
      .update({
        household_item_id: data.id,
        ...(productTypeId ? { product_type_id: productTypeId } : {}),
      })
      .eq('id', args.draftId)
      .eq('user_id', args.userId);
  }

  return { itemId: data.id, error: null };
}

/** After Marketplace photo+confirm, persist an owned At home row and link the draft. */
export async function saveAtHomeFromPhotoDraft(args: {
  userId: string;
  draftId: string;
  productTypeId: string;
  childId?: string | null;
  displayLabel?: string | null;
}): Promise<{ itemId: string | null; error: string | null }> {
  const supabase = createClient();
  const childId = args.childId?.trim() || null;
  const label = args.displayLabel?.trim() || null;

  const { data, error } = await supabase
    .from('garage_items')
    .insert({
      user_id: args.userId,
      product_type_id: args.productTypeId,
      child_scope_type: childId ? 'single_child' : 'unknown',
      child_id: childId,
      raw_query: label,
      source: 'photo_assisted',
      status: 'owned',
    })
    .select('id')
    .single();

  if (error || !data?.id) {
    return { itemId: null, error: error?.message ?? 'Could not save to At home.' };
  }

  await supabase
    .from('marketplace_listing_drafts')
    .update({ household_item_id: data.id, product_type_id: args.productTypeId })
    .eq('id', args.draftId)
    .eq('user_id', args.userId);

  return { itemId: data.id, error: null };
}

export function statusLabel(status: AtHomeItemStatus): string {
  switch (status) {
    case 'ready_to_move_on':
      return 'Ready to pass on';
    case 'listed':
      return 'Listed';
    case 'sold':
      return 'Moved on';
    case 'archived':
      return 'Removed';
    default:
      return 'At home';
  }
}
