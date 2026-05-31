"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MarketplaceBuyerInterestActions } from "@/components/marketplace/MarketplaceBuyerInterestActions";
import {
  MarketplaceDevelopmentSection,
  type ChildContextPayload,
} from "@/components/marketplace/MarketplaceDevelopmentSection";
import type { MarketplaceMapListing } from "@/components/marketplace/MarketplaceMap";
import { MarketplaceYourPostcode } from "@/components/marketplace/MarketplaceYourPostcode";
import { SellerListingInterests } from "@/components/marketplace/SellerListingInterests";
import {
  formatConditionLabel,
  formatPriceRange,
} from "@/lib/marketplace/beta-listing-display";
import type { PriceGuidance } from "@/lib/marketplace/beta-listing-types";
import type { DevelopmentWrapperOpportunity } from "@/lib/marketplace/development-opportunities";
import type { Stage1WrapperSlug } from "@/lib/marketplace/development-wrappers";
import { getDevelopmentWrapper } from "@/lib/marketplace/development-wrappers";
import { mapListingToMapProps } from "@/lib/marketplace/marketplace-map-payload";
import { formatListingLocalCue } from "@/lib/marketplace/opportunity-map-display";

const MarketplaceMap = dynamic(
  () => import("@/components/marketplace/MarketplaceMap").then((m) => m.MarketplaceMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-[min(52vh,420px)] items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-sm text-[#5C646D]"
        data-testid="marketplace-map-loading"
      >
        Loading map…
      </div>
    ),
  }
);

type BuyerMatchPayload = {
  development_wrapper_slugs: string[];
  primary_development_wrapper_slug: string | null;
  match_reason: string | null;
  age_stage_copy: string | null;
  caution_copy: string | null;
  coverage_copy: string | null;
  recommendation_eligibility: string;
};

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
  radius_miles?: number | null;
  map_marker_lat: number | null;
  map_marker_lng: number | null;
  status: string;
  interest_count?: number;
  buyer_interested?: boolean;
  conversation_id?: string | null;
  buyer_match?: BuyerMatchPayload;
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

export function MarketplacePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get("child");
  const developmentParam = searchParams.get("development");
  const selectedSlug = (developmentParam as Stage1WrapperSlug | null) || null;

  const [loading, setLoading] = useState(true);
  const [devLoading, setDevLoading] = useState(true);
  const [nearby, setNearby] = useState<ListingCard[]>([]);
  const [mine, setMine] = useState<ListingCard[]>([]);
  const [wrappers, setWrappers] = useState<DevelopmentWrapperOpportunity[]>([]);
  const [childContext, setChildContext] = useState<ChildContextPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [buyerHasPostcode, setBuyerHasPostcode] = useState(true);
  const [buyerAreaLabel, setBuyerAreaLabel] = useState<string>("Approximate area");
  const [buyerRadiusMiles, setBuyerRadiusMiles] = useState(5);
  const [buyerLat, setBuyerLat] = useState<number | null>(null);
  const [buyerLng, setBuyerLng] = useState<number | null>(null);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  const listingsQuery = useMemo(() => {
    const params = new URLSearchParams({ view: "nearby" });
    if (childId) params.set("childId", childId);
    if (selectedSlug) params.set("development", selectedSlug);
    return params.toString();
  }, [childId, selectedSlug]);

  const devQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (childId) params.set("childId", childId);
    if (selectedSlug) params.set("development", selectedSlug);
    return params.toString();
  }, [childId, selectedSlug]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [nearbyRes, mineRes] = await Promise.all([
        fetch(`/api/marketplace/beta-listings?${listingsQuery}`),
        fetch("/api/marketplace/beta-listings?view=mine"),
      ]);
      const nearbyPayload = await parseJson<{
        listings?: ListingCard[];
        buyer_has_postcode?: boolean;
        buyer_area_label?: string | null;
        buyer_radius_miles?: number;
        buyer_lat?: number | null;
        buyer_lng?: number | null;
        child_context?: ChildContextPayload;
        error?: string;
      }>(nearbyRes);
      const minePayload = await parseJson<{ listings?: ListingCard[]; error?: string }>(mineRes);
      if (!nearbyRes.ok) throw new Error(nearbyPayload?.error ?? "Could not load nearby listings.");
      if (!mineRes.ok) throw new Error(minePayload?.error ?? "Could not load your listings.");
      setNearby(nearbyPayload?.listings ?? []);
      setChildContext(nearbyPayload?.child_context ?? null);
      setBuyerHasPostcode(nearbyPayload?.buyer_has_postcode !== false);
      setBuyerAreaLabel(nearbyPayload?.buyer_area_label?.trim() || "Approximate area");
      setBuyerRadiusMiles(nearbyPayload?.buyer_radius_miles ?? 5);
      setBuyerLat(nearbyPayload?.buyer_lat ?? null);
      setBuyerLng(nearbyPayload?.buyer_lng ?? null);
      setMine(minePayload?.listings ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load marketplace.");
    } finally {
      setLoading(false);
    }
  }, [listingsQuery]);

  const loadDevelopment = useCallback(async () => {
    setDevLoading(true);
    try {
      const res = await fetch(
        `/api/marketplace/development-opportunities${devQuery ? `?${devQuery}` : ""}`
      );
      const payload = await parseJson<{
        wrappers?: DevelopmentWrapperOpportunity[];
        child?: ChildContextPayload;
        error?: string;
      }>(res);
      if (!res.ok) throw new Error(payload?.error ?? "Could not load development areas.");
      setWrappers(payload?.wrappers ?? []);
      if (payload?.child) setChildContext(payload.child);
    } catch {
      setWrappers([]);
    } finally {
      setDevLoading(false);
    }
  }, [devQuery]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    void loadDevelopment();
  }, [loadDevelopment]);

  const handleSelectWrapper = (slug: Stage1WrapperSlug | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("development", slug);
    else params.delete("development");
    const qs = params.toString();
    router.push(qs ? `/app/marketplace?${qs}` : "/app/marketplace");
  };

  const mapListings: MarketplaceMapListing[] = useMemo(
    () =>
      nearby
        .map((listing) => mapListingToMapProps(listing))
        .filter((item): item is MarketplaceMapListing => item != null),
    [nearby]
  );

  const selectedWrapper = selectedSlug ? getDevelopmentWrapper(selectedSlug) : null;
  const selectedCard = wrappers.find((w) => w.stage1_wrapper_ux_slug === selectedSlug);
  const listingsTitle = selectedWrapper
    ? selectedWrapper.stage1_wrapper_ux_label
    : "Nearby listings";
  const listingsSubtitle = selectedWrapper
    ? "Nearby items for this stage"
    : null;

  if (loading && devLoading) {
    return <div className="p-6 text-[#5C646D]">Loading marketplace…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 pb-10 sm:p-6">
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

      <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3 text-sm">
        <p className="font-medium text-[#1A1E23]">Showing around {buyerAreaLabel}</p>
        <p className="text-xs text-[#5C646D]">Within {buyerRadiusMiles} miles</p>
      </div>

      <MarketplaceYourPostcode onPreferencesSaved={() => void load()} />

      <MarketplaceDevelopmentSection
        childContext={childContext}
        wrappers={wrappers}
        selectedSlug={selectedSlug}
        loading={devLoading}
        onSelectWrapper={handleSelectWrapper}
      />

      <section className="space-y-3" data-testid="marketplace-local-map-module">
        <h2 className="text-lg font-medium text-[#1A1E23]">Your local marketplace</h2>
        <MarketplaceMap
          viewerAreaLabel={buyerAreaLabel}
          viewerLat={buyerLat}
          viewerLng={buyerLng}
          radiusMiles={buyerRadiusMiles}
          listings={mapListings}
          nearbyListingCount={nearby.length}
          selectedListingId={selectedListingId}
          onSelectListing={setSelectedListingId}
        />
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <section className="space-y-3">
        <div className="space-y-0.5">
          <h2 className="text-lg font-medium text-[#1A1E23]">{listingsTitle}</h2>
          {listingsSubtitle && (
            <p className="text-sm text-[#5C646D]">{listingsSubtitle}</p>
          )}
        </div>

        {selectedCard?.watch_mode && childContext?.mode === "personalised" ? (
          <p className="text-sm text-[#5C646D] rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
            Nothing nearby for this stage yet. We&apos;ll watch for local items that fit this
            development area.
          </p>
        ) : null}

        {nearby.length === 0 ? (
          <p className="text-sm text-[#5C646D]">
            {!buyerHasPostcode
              ? "Add your postcode above to see listings within 5 miles."
              : selectedSlug
                ? "Nothing nearby for this stage yet. We'll watch for local items that fit this development area."
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
              const conditionLabel = formatConditionLabel(listing.condition);
              const localCue = formatListingLocalCue(
                listing.approximate_area_label,
                listing.radius_miles
              );
              const isSelected = selectedListingId === listing.id;
              const match = listing.buyer_match;
              return (
                <li
                  key={listing.id}
                  className={`rounded-xl border bg-white p-4 transition-shadow ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/30 shadow-md"
                      : "border-[#E5E7EB]"
                  }`}
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => setSelectedListingId(listing.id)}
                  >
                    <div className="flex gap-3">
                      <ListingPhoto listingId={listing.id} />
                      <div className="min-w-0 space-y-1">
                        <p className="font-medium text-[#1A1E23]">
                          {listing.title ?? listing.item_label}
                        </p>
                        <p className="text-sm text-[#5C646D]">
                          {formatPriceRange(price) ?? "Price on request"}
                        </p>
                        <p className="text-xs text-[#5C646D]" data-testid="listing-local-cue">
                          {localCue}
                        </p>
                        {conditionLabel ? (
                          <p className="text-xs text-[#5C646D]">Condition: {conditionLabel}</p>
                        ) : null}
                        {match?.match_reason ? (
                          <p className="text-xs text-[#1A1E23]" data-testid="listing-match-reason">
                            {match.match_reason}
                          </p>
                        ) : null}
                        {match?.age_stage_copy ? (
                          <p className="text-xs text-[#5C646D]">{match.age_stage_copy}</p>
                        ) : null}
                        {match?.caution_copy ? (
                          <p className="text-xs text-amber-800">{match.caution_copy}</p>
                        ) : null}
                        {match?.coverage_copy ? (
                          <p className="text-xs text-[#5C646D]">{match.coverage_copy}</p>
                        ) : null}
                      </div>
                    </div>
                  </button>
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
              <li
                key={listing.id}
                className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 space-y-2"
              >
                <div className="flex gap-3">
                  <ListingPhoto listingId={listing.id} />
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium text-[#1A1E23]">
                      {listing.title ?? listing.item_label}
                    </p>
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
