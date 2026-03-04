'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Gift, ImageOff, Users } from 'lucide-react';

export type PublicGiftItem = {
  id: string;
  kind: string;
  display_name: string | null;
  image_url: string | null;
  created_at: string;
  child_id: string | null;
};

const UNASSIGNED_VALUE = '__unassigned__';

export function GiftListClient({
  items,
  listTitle = 'Their',
  childrenOptions = [],
}: {
  items: PublicGiftItem[];
  listTitle?: string;
  childrenOptions?: { id: string; label: string }[];
}) {
  const { childOptions, hasUnassigned } = useMemo(() => {
    const unassigned = items.some((row) => !row.child_id);
    return { childOptions: childrenOptions, hasUnassigned: unassigned };
  }, [items, childrenOptions]);

  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    if (!selectedChildId) return items;
    if (selectedChildId === UNASSIGNED_VALUE) return items.filter((r) => !r.child_id);
    return items.filter((r) => r.child_id === selectedChildId);
  }, [items, selectedChildId]);

  const showChildToggle = items.length > 0 || childOptions.length > 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1E23] mb-1">
            Gift list for {listTitle}&apos;s family
          </h1>
          <p className="text-sm text-[#5C646D] mb-4">
            Here&apos;s what they&apos;re hoping for.
          </p>

          {showChildToggle && (
            <div className="flex flex-wrap items-center gap-2">
              <Users className="w-4 h-4 text-[#5C646D]" aria-hidden />
              <select
                value={selectedChildId ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  setSelectedChildId(v || null);
                }}
                className="h-9 pl-3 pr-8 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#1A1E23] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:ring-offset-0 min-w-[10rem]"
                aria-label="Filter by child"
              >
                <option value="">All children</option>
                {hasUnassigned && <option value={UNASSIGNED_VALUE}>Unassigned</option>}
                {childOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredItems.map((row) => (
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

        {filteredItems.length === 0 && (
          <p className="text-sm text-[#5C646D] py-8 text-center">
            No gift items to show for this selection.
          </p>
        )}

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
