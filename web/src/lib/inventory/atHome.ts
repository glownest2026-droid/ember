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
