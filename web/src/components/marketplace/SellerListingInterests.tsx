"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type InterestRow = {
  interest_id: string;
  conversation_id: string | null;
  buyer_label: string;
};

async function parseJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function SellerListingInterests({
  listingId,
  interestCount,
}: {
  listingId: string;
  interestCount: number;
}) {
  const [loading, setLoading] = useState(false);
  const [interests, setInterests] = useState<InterestRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (interestCount <= 0) return;
    let active = true;
    setLoading(true);
    void (async () => {
      const response = await fetch(`/api/marketplace/listings/${listingId}/interests`);
      const payload = await parseJson<{ interests?: InterestRow[]; error?: string }>(response);
      if (!active) return;
      if (!response.ok) {
        setError(payload?.error ?? "Could not load interest.");
        setLoading(false);
        return;
      }
      setInterests(payload?.interests ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [listingId, interestCount]);

  if (interestCount <= 0) return null;

  return (
    <div className="mt-3 space-y-2 border-t border-[#E5E7EB] pt-3">
      <p className="text-sm font-medium text-[#1A1E23]">Interested parents</p>
      {loading && <p className="text-xs text-[#5C646D]">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <ul className="space-y-2">
        {interests.map((row) => (
          <li
            key={row.interest_id}
            className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 border border-[#E5E7EB]"
          >
            <span className="text-sm text-[#1A1E23]">{row.buyer_label}</span>
            {row.conversation_id ? (
              <Link
                href={`/app/messages/${row.conversation_id}`}
                className="text-sm font-medium text-primary underline shrink-0"
              >
                Open chat
              </Link>
            ) : (
              <span className="text-xs text-[#5C646D]">Awaiting message</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
