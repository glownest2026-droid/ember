import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { GiftListClient } from './GiftListClient';

export const dynamic = 'force-dynamic';

/** Public read-only gift list. No auth; only items marked Gift for the slug's user. */
export default async function GiftListPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createClient();

  const [listRes, titleRes, childrenRes] = await Promise.all([
    supabase.rpc('get_public_gift_list', { p_slug: slug }),
    supabase.rpc('get_gift_share_list_title', { p_slug: slug }),
    supabase.rpc('get_public_gift_children', { p_slug: slug }),
  ]);

  if (listRes.error) {
    notFound();
  }
  const raw = Array.isArray(listRes.data) ? listRes.data : [];
  if (raw.length === 0) {
    notFound();
  }

  const items = raw.map((row: Record<string, unknown>) => ({
    id: String(row.id),
    kind: String(row.kind ?? ''),
    display_name: row.display_name != null ? String(row.display_name) : null,
    image_url: row.image_url != null ? String(row.image_url) : null,
    created_at: String(row.created_at),
    child_id: row.child_id != null ? String(row.child_id) : null,
  }));

  const listTitle =
    !titleRes.error && titleRes.data != null && String(titleRes.data).trim()
      ? String(titleRes.data).trim()
      : 'Their';

  const childrenOptions: { id: string; label: string }[] = Array.isArray(childrenRes.data)
    ? (childrenRes.data as { child_id: string; label?: string | null }[]).map((r, i) => ({
        id: String(r.child_id),
        label: r.label && String(r.label).trim() ? String(r.label).trim() : `Child ${i + 1}`,
      }))
    : [];

  return (
    <GiftListClient
      items={items}
      listTitle={listTitle}
      childrenOptions={childrenOptions}
      giftShareSlug={slug}
    />
  );
}
