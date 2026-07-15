import { createClient } from '@/utils/supabase/client';

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

/** Photo → confirm flow that saves to At home (does not list on Marketplace). */
export function atHomeAddHref(childId?: string | null): string {
  const params = new URLSearchParams({ new: '1', intent: 'at-home' });
  if (childId) params.set('child', childId);
  return `/app/listings?${params.toString()}`;
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
