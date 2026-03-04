import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Gift, ImageOff } from 'lucide-react';

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
  const items = Array.isArray(rows) ? rows : [];
  if (items.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1E23] mb-1">
            Gift list
          </h1>
          <p className="text-sm text-[#5C646D]">
            Items shared from their list. Read-only.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {items.map((row: { id: string; kind: string; display_name: string | null; image_url: string | null; created_at: string }) => (
            <div
              key={row.id}
              className="rounded-xl border overflow-hidden bg-white"
              style={{ borderColor: 'var(--ember-border-subtle, #E5E7EB)' }}
            >
              {row.image_url ? (
                <div className="aspect-square bg-[#f5f5f5] relative">
                  <img
                    src={row.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 rounded-full p-1.5 shadow-sm bg-white">
                    <Gift className="w-3.5 h-3.5 text-[#E65100]" aria-hidden />
                  </div>
                </div>
              ) : (
                <div className="aspect-square bg-[#f5f5f5] flex items-center justify-center text-[#5C646D]">
                  <ImageOff className="w-10 h-10" aria-hidden />
                </div>
              )}
              <div className="p-3">
                <h2 className="font-medium text-sm line-clamp-2 text-[#1A1E23]">
                  {row.display_name ?? '—'}
                </h2>
                <p className="text-xs text-[#5C646D] mt-1">
                  {formatSavedTime(row.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-[#5C646D]">
          <Link href="/" className="underline hover:text-[#1A1E23]">
            Back to Ember
          </Link>
        </p>
      </main>
    </div>
  );
}

function formatSavedTime(createdAt: string): string {
  const d = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return 'Saved today';
  if (diffDays === 1) return 'Saved yesterday';
  if (diffDays < 7) return `Saved ${diffDays} days ago`;
  if (diffDays < 30) return `Saved ${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) === 1 ? '' : 's'} ago`;
  return `Saved ${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) === 1 ? '' : 's'} ago`;
}
