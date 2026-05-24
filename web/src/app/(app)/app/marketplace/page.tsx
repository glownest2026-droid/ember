"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MarketplaceBuyerInterestActions } from "@/components/marketplace/MarketplaceBuyerInterestActions";
import { MarketplaceYourPostcode } from "@/components/marketplace/MarketplaceYourPostcode";
import { SellerListingInterests } from "@/components/marketplace/SellerListingInterests";
import { formatPriceRange } from "@/lib/marketplace/beta-listing-display";
import type { PriceGuidance } from "@/lib/marketplace/beta-listing-types";
type ListingCard = {
  id: string;
  user_id: string;
  title: string | null;
  item_label: string | null;
  condition: string | null;
  price_low: number | null;
  price_high: number | null;
  price_currency: string | null;
  approximate_area_label: string | null;
  status: string;
  interest_count?: number;
  buyer_interested?: boolean;
  conversation_id?: string | null;
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

function ListingPhoto({ listingId }: { listingId: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      const response = await fetch(`/api/marketplace/beta-listings/${listingId}/photo`);
      const payload = await parseJson<{ signed_url?: string }>(response);
      if (active && payload?.signed_url) setUrl(payload.signed_url);
    })();
    return () => {
      active = false;
    };
  }, [listingId]);

  if (!url) {
    return <div className="h-24 w-24 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB]" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" className="h-24 w-24 rounded-lg object-cover border border-[#E5E7EB]" />
  );
}

export default function AppMarketplacePage() {
  const [loading, setLoading] = useState(true);
  const [nearby, setNearby] = useState<ListingCard[]>([]);
  const [mine, setMine] = useState<ListingCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [buyerHasPostcode, setBuyerHasPostcode] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [nearbyRes, mineRes] = await Promise.all([
        fetch("/api/marketplace/beta-listings?view=nearby"),
        fetch("/api/marketplace/beta-listings?view=mine"),
      ]);
      const nearbyPayload = await parseJson<{
        listings?: ListingCard[];
        buyer_has_postcode?: boolean;
        error?: string;
      }>(nearbyRes);
      const minePayload = await parseJson<{ listings?: ListingCard[]; error?: string }>(mineRes);
      if (!nearbyRes.ok) throw new Error(nearbyPayload?.error ?? "Could not load nearby listings.");
      if (!mineRes.ok) throw new Error(minePayload?.error ?? "Could not load your listings.");
      setNearby(nearbyPayload?.listings ?? []);
      setBuyerHasPostcode(nearbyPayload?.buyer_has_postcode !== false);
      setMine(minePayload?.listings ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load marketplace.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <div className="p-6 text-[#5C646D]">Loading marketplace…</div>;
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 p-4 pb-10 sm:p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-normal text-[#1A1E23]">Marketplace</h1>
        <p className="text-sm text-[#5C646D]">
          Nearby listings from signed-in Ember families. Exact addresses are not shown.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/app/listings?new=1" className="text-primary underline">
            Create a listing
          </Link>
          <Link href="/app/messages" className="text-primary underline">
            Messages
          </Link>
        </div>
      </header>

      <MarketplaceYourPostcode onPreferencesSaved={() => void load()} />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <section className="space-y-3">
        <h2 className="text-lg font-medium text-[#1A1E23]">Nearby listings</h2>
        {nearby.length === 0 ? (
          <p className="text-sm text-[#5C646D]">
            {!buyerHasPostcode
              ? "Add your postcode above to see listings within 5 miles."
              : "No nearby beta listings yet."}
          </p>
        ) : (
          <ul className="space-y-3">
            {nearby.map((listing) => {
              const price: PriceGuidance = {
                price_low: listing.price_low,
                price_high: listing.price_high,
                currency: listing.price_currency ?? "GBP",
                confidence: "medium",
                source_type: "manual_price_band",
                explanation: "",
                caveats: [],
              };
              return (
                <li key={listing.id} className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                  <div className="flex gap-3">
                    <ListingPhoto listingId={listing.id} />
                    <div className="min-w-0 space-y-1">
                      <p className="font-medium text-[#1A1E23]">{listing.title ?? listing.item_label}</p>
                      <p className="text-sm text-[#5C646D]">
                        {formatPriceRange(price) ?? "Price on request"} · {listing.approximate_area_label}
                      </p>
                      <p className="text-xs text-[#5C646D]">Condition: {listing.condition}</p>
                    </div>
                  </div>
                  <MarketplaceBuyerInterestActions
                    listingId={listing.id}
                    buyerInterested={Boolean(listing.buyer_interested)}
                    initialConversationId={listing.conversation_id}
                    onInterestSent={() => void load()}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium text-[#1A1E23]">Your listings</h2>
        {mine.length === 0 ? (
          <p className="text-sm text-[#5C646D]">You have no live beta listings yet.</p>
        ) : (
          <ul className="space-y-3">
            {mine.map((listing) => (
              <li key={listing.id} className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 space-y-2">
                <div className="flex gap-3">
                  <ListingPhoto listingId={listing.id} />
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium text-[#1A1E23]">{listing.title ?? listing.item_label}</p>
                    <p className="text-sm text-[#5C646D]">Live to nearby families</p>
                    <p className="text-sm text-[#1A1E23]">
                      {(listing.interest_count ?? 0) === 0
                        ? "No interest yet"
                        : listing.interest_count === 1
                          ? "1 parent is interested"
                          : `${listing.interest_count} parents are interested`}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/app/listings?edit=${listing.id}`}
                    className="inline-flex text-sm font-medium text-primary underline"
                  >
                    Edit listing
                  </Link>
                </div>
                <SellerListingInterests
                  listingId={listing.id}
                  interestCount={listing.interest_count ?? 0}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
