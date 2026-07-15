'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, ArrowRight } from 'lucide-react';
import {
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

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href={familyHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#66717D] hover:text-[#253044] mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Family
      </Link>

      <div className="flex items-start gap-3 mb-2">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#FF5C34]/10 shrink-0">
          <Home className="w-5 h-5 text-[#FF5C34]" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#253044] m-0">At home</h1>
          <p className="text-sm text-[#66717D] mt-1 mb-0">
            Things you already own — marked Have on Discover, or logged here. List one on Marketplace when
            you are ready to pass it on.
          </p>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-[#66717D] mt-8">Loading what you have…</p>
      )}

      {!loading && error && (
        <p className="text-sm text-[#B42318] mt-8" role="alert">
          Could not load At home. {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="mt-8 rounded-2xl border border-[#E7E2DC] bg-white p-6">
          <p className="text-base font-medium text-[#253044] m-0">Nothing logged yet</p>
          <p className="text-sm text-[#66717D] mt-2 mb-4">
            On Discover, tap Have on ideas you already own. They will show up here, ready to list when the
            time is right.
          </p>
          <Link
            href={discoverHref}
            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#FF5C34] hover:opacity-95"
          >
            Browse Discover
            <ArrowRight className="w-4 h-4" />
          </Link>
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
