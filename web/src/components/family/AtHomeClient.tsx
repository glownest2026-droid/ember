'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Home, ArrowRight, Plus, Camera } from 'lucide-react';
import {
  atHomeAddHref,
  atHomeListItHref,
  fetchAtHomeItems,
  statusLabel,
  type AtHomeItem,
} from '@/lib/inventory/atHome';

export function AtHomeClient({
  initialChildId,
}: {
  initialChildId?: string;
}) {
  const searchParams = useSearchParams();
  const justAdded = searchParams.get('added') === '1';
  const [items, setItems] = useState<AtHomeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { items: next, error: loadError } = await fetchAtHomeItems({
      childId: initialChildId ?? null,
    });
    setItems(next);
    setError(loadError);
    setLoading(false);
  }, [initialChildId]);

  useEffect(() => {
    void load();
  }, [load]);

  const familyHref = initialChildId
    ? `/family?child=${encodeURIComponent(initialChildId)}`
    : '/family';
  const discoverHref = initialChildId
    ? `/discover?child=${encodeURIComponent(initialChildId)}`
    : '/discover';
  const addHref = atHomeAddHref(initialChildId ?? null, 'at-home');

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href={familyHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#66717D] hover:text-[#253044] mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Family
      </Link>

      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#FF5C34]/10 shrink-0">
            <Home className="w-5 h-5 text-[#FF5C34]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#253044] m-0">At home</h1>
            <p className="text-sm text-[#66717D] mt-1 mb-0">
              Toys and kit you already own, all in one place.
            </p>
          </div>
        </div>
        <Link
          href={addHref}
          className="shrink-0 inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-xl text-sm font-medium text-white bg-[#FF5C34] hover:opacity-95"
        >
          <Plus className="w-4 h-4" />
          Add item
        </Link>
      </div>

      {justAdded && (
        <p className="mt-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5">
          Saved At home. List it later whenever you are ready.
        </p>
      )}

      {loading && (
        <p className="text-sm text-[#66717D] mt-8">Loading what you have…</p>
      )}

      {!loading && error && (
        <p className="text-sm text-[#B42318] mt-8" role="alert">
          Could not load At home. {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="mt-8 rounded-2xl border border-[#E7E2DC] bg-white p-6 space-y-4">
          <div>
            <p className="text-base font-medium text-[#253044] m-0">Nothing logged yet</p>
            <p className="text-sm text-[#66717D] mt-2 mb-0">
              Type a product or add a photo to log what you own.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={addHref}
              className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#FF5C34] hover:opacity-95"
            >
              <Camera className="w-4 h-4" />
              Add something
            </Link>
            <Link
              href={discoverHref}
              className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium text-[#253044] border border-[#E7E2DC] hover:border-[#FF5C34]/50"
            >
              Browse Discover
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <ul className="mt-6 space-y-3 list-none p-0 m-0">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-[#E7E2DC] bg-white p-4 flex gap-3 items-center"
            >
              <div className="w-14 h-14 rounded-xl bg-[#FBFAF7] border border-[#E7E2DC] overflow-hidden shrink-0 flex items-center justify-center">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Home className="w-5 h-5 text-[#66717D]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[0.9375rem] font-medium text-[#253044] m-0 truncate">{item.label}</p>
                <p className="text-xs text-[#66717D] mt-0.5 mb-0">{statusLabel(item.status)}</p>
              </div>
              {item.status !== 'listed' ? (
                <Link
                  href={atHomeListItHref(item.id)}
                  className="shrink-0 inline-flex items-center justify-center min-h-[40px] px-3.5 rounded-xl text-sm font-medium text-white bg-[#FF5C34] hover:opacity-95"
                >
                  List it
                </Link>
              ) : (
                <Link
                  href="/marketplace"
                  className="shrink-0 text-sm font-medium text-[#FF5C34] hover:underline"
                >
                  View listing
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
