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

  const { data: rows, error } = await supabase.rpc('get_public_gift_list', {
    p_slug: slug,
  });

  if (error) {
    notFound();
  }
  const raw = Array.isArray(rows) ? rows : [];
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

  return <GiftListClient items={items} />;
}
