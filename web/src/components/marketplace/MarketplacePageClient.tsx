"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import {
  filterListingsByDevelopment,
  parseDevelopmentSlugFromUrl,
} from "@/lib/marketplace/marketplace-listing-client-filter";
import { mapListingToMapProps } from "@/lib/marketplace/marketplace-map-payload";
import { formatListingLocalCue } from "@/lib/marketplace/opportunity-map-display";

const MarketplaceMap = dynamic(
  () => import("@/components/marketplace/MarketplaceMap").then((m) => m.MarketplaceMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-[min(32vh,280px)] items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-sm text-[#5C646D]"
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
    return <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB]" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover border border-[#E5E7EB]"
    />
  );
}

function syncDevelopmentInUrl(childId: string | null, slug: Stage1WrapperSlug | null) {
  const params = new URLSearchParams(window.location.search);
  if (childId) params.set("child", childId);
  else params.delete("child");
  if (slug) params.set("development", slug);
  else params.delete("development");
  const qs = params.toString();
  const path = `/app/marketplace${qs ? `?${qs}` : ""}`;
  window.history.replaceState(null, "", path);
}

export function MarketplacePageClient() {
  const searchParams = useSearchParams();
  const childId = searchParams.get("child");

  const [initialLoading, setInitialLoading] = useState(true);
  const [allNearby, setAllNearby] = useState<ListingCard[]>([]);
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
  const [selectedDevelopment, setSelectedDevelopment] = useState<Stage1WrapperSlug | null>(
    () => parseDevelopmentSlugFromUrl(searchParams.get("development"))
  );
  const childIdRef = useRef(childId);
  childIdRef.current = childId;

  useEffect(() => {
    setSelectedDevelopment(parseDevelopmentSlugFromUrl(searchParams.get("development")));
  }, [searchParams]);

  const baseListingsQuery = useMemo(() => {
    const params = new URLSearchParams({ view: "nearby" });
    if (childId) params.set("childId", childId);
    return params.toString();
  }, [childId]);

  const devOpportunitiesQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (childId) params.set("childId", childId);
    return params.toString();
  }, [childId]);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [nearbyRes, mineRes, devRes] = await Promise.all([
        fetch(`/api/marketplace/beta-listings?${baseListingsQuery}`),
        fetch("/api/marketplace/beta-listings?view=mine"),
        fetch(
          `/api/marketplace/development-opportunities${devOpportunitiesQuery ? `?${devOpportunitiesQuery}` : ""}`
        ),
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
      const devPayload = await parseJson<{
        wrappers?: DevelopmentWrapperOpportunity[];
        child?: ChildContextPayload;
        error?: string;
      }>(devRes);

      if (!nearbyRes.ok) throw new Error(nearbyPayload?.error ?? "Could not load nearby listings.");
      if (!mineRes.ok) throw new Error(minePayload?.error ?? "Could not load your listings.");

      setAllNearby(nearbyPayload?.listings ?? []);
      setChildContext(nearbyPayload?.child_context ?? devPayload?.child ?? null);
      setBuyerHasPostcode(nearbyPayload?.buyer_has_postcode !== false);
      setBuyerAreaLabel(nearbyPayload?.buyer_area_label?.trim() || "Approximate area");
      setBuyerRadiusMiles(nearbyPayload?.buyer_radius_miles ?? 5);
      setBuyerLat(nearbyPayload?.buyer_lat ?? null);
      setBuyerLng(nearbyPayload?.buyer_lng ?? null);
      setMine(minePayload?.listings ?? []);
      if (devRes.ok) setWrappers(devPayload?.wrappers ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load marketplace.");
    } finally {
      setInitialLoading(false);
    }
  }, [baseListingsQuery, devOpportunitiesQuery]);

  useEffect(() => {
    setInitialLoading(true);
    void load();
  }, [load]);

  const handleSelectWrapper = (slug: Stage1WrapperSlug | null) => {
    setSelectedDevelopment(slug);
    setSelectedListingId(null);
    syncDevelopmentInUrl(childIdRef.current, slug);
  };

  const nearby = useMemo(
    () =>
      filterListingsByDevelopment(allNearby, selectedDevelopment, childContext?.mode),
    [allNearby, selectedDevelopment, childContext?.mode]
  );

  const mapListings: MarketplaceMapListing[] = useMemo(
    () =>
      nearby
        .map((listing) => mapListingToMapProps(listing))
        .filter((item): item is MarketplaceMapListing => item != null),
    [nearby]
  );

  const selectedWrapper = selectedDevelopment
    ? getDevelopmentWrapper(selectedDevelopment)
    : null;
  const selectedCard = wrappers.find((w) => w.stage1_wrapper_ux_slug === selectedDevelopment);
  const listingsTitle = selectedWrapper
    ? selectedWrapper.stage1_wrapper_ux_label
    : "Nearby listings";

  if (initialLoading) {
    return <div className="p-4 text-sm text-[#5C646D]">Loading marketplace…</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-3 p-3 pb-10 sm:p-4 sm:space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <div className="min-w-0">
          <h1 className="text-xl font-normal text-[#1A1E23] sm:text-2xl">Marketplace</h1>
          <p className="text-xs text-[#5C646D] hidden sm:block">
            Nearby families · addresses never shown
          </p>
        </div>
        <div className="flex shrink-0 gap-3 text-sm">
          <Link href="/app/listings?new=1" className="text-primary underline">
            Create listing
          </Link>
          <Link href="/app/messages" className="text-primary underline">
            Messages
          </Link>
        </div>
      </header>

      <div className="relative flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#E5E7EB] bg-[#FAFAFA] px-3 py-2 text-sm">
        <p className="text-[#1A1E23] min-w-0">
          <span className="font-medium">{buyerAreaLabel}</span>
          <span className="text-[#5C646D]"> · within {buyerRadiusMiles} miles</span>
        </p>
        <div className="relative shrink-0">
          <MarketplaceYourPostcode
            variant="inline"
            onPreferencesSaved={() => void load()}
          />
        </div>
      </div>

      <MarketplaceDevelopmentSection
        childContext={childContext}
        wrappers={wrappers}
        selectedSlug={selectedDevelopment}
        onSelectWrapper={handleSelectWrapper}
      />

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5 lg:items-start">
        <section className="space-y-2 min-w-0" data-testid="marketplace-local-map-module">
          <h2 className="text-sm font-medium text-[#1A1E23]">Map</h2>
          <MarketplaceMap
            viewerAreaLabel={buyerAreaLabel}
            viewerLat={buyerLat}
            viewerLng={buyerLng}
            radiusMiles={buyerRadiusMiles}
            listings={mapListings}
            nearbyListingCount={nearby.length}
            selectedListingId={selectedListingId}
            onSelectListing={setSelectedListingId}
            mapContainerClassName="h-[min(34vh,300px)] lg:h-[min(36vh,340px)] w-full overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F8FAFC]"
          />
        </section>

        <section className="space-y-2 min-w-0">
          <div>
            <h2 className="text-sm font-medium text-[#1A1E23]">{listingsTitle}</h2>
            {selectedDevelopment && (
              <p className="text-xs text-[#5C646D]">Filtered — tap another area or clear filter</p>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {selectedCard?.watch_mode && childContext?.mode === "personalised" ? (
            <p className="text-xs text-[#5C646D] rounded-lg border border-[#E5E7EB] bg-[#FAFAFA] p-3">
              Nothing nearby for this stage yet. We&apos;ll watch for local items that fit.
            </p>
          ) : null}

          {nearby.length === 0 ? (
            <p className="text-sm text-[#5C646D]">
              {!buyerHasPostcode
                ? "Add your postcode to see listings within 5 miles."
                : selectedDevelopment
                  ? "Nothing nearby for this stage yet. We'll watch for local items that fit."
                  : "No nearby beta listings yet."}
            </p>
          ) : (
            <ul className="space-y-2 max-h-[min(52vh,520px)] overflow-y-auto pr-0.5">
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
                    className={`rounded-lg border bg-white p-3 transition-shadow ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/30 shadow-sm"
                        : "border-[#E5E7EB]"
                    }`}
                  >
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => setSelectedListingId(listing.id)}
                    >
                      <div className="flex gap-2.5">
                        <ListingPhoto listingId={listing.id} />
                        <div className="min-w-0 space-y-0.5">
                          <p className="text-sm font-medium text-[#1A1E23] leading-snug">
                            {listing.title ?? listing.item_label}
                          </p>
                          <p className="text-xs text-[#5C646D]">
                            {formatPriceRange(price) ?? "Price on request"}
                            {conditionLabel ? ` · ${conditionLabel}` : ""}
                          </p>
                          <p className="text-xs text-[#5C646D]" data-testid="listing-local-cue">
                            {localCue}
                          </p>
                          {match?.match_reason ? (
                            <p
                              className="text-xs text-[#1A1E23] line-clamp-2"
                              data-testid="listing-match-reason"
                            >
                              {match.match_reason}
                            </p>
                          ) : null}
                          {match?.caution_copy ? (
                            <p className="text-xs text-amber-800 line-clamp-2">
                              {match.caution_copy}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </button>
                    <div className="mt-2">
                      <MarketplaceBuyerInterestActions
                        listingId={listing.id}
                        buyerInterested={Boolean(listing.buyer_interested)}
                        initialConversationId={listing.conversation_id}
                        onInterestSent={() => void load()}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <details className="rounded-lg border border-[#E5E7EB] bg-[#FAFAFA] group">
        <summary className="cursor-pointer list-none px-3 py-2.5 text-sm font-medium text-[#1A1E23] [&::-webkit-details-marker]:hidden">
          Your listings
          {mine.length > 0 ? (
            <span className="ml-2 font-normal text-[#5C646D]">({mine.length})</span>
          ) : null}
        </summary>
        <div className="border-t border-[#E5E7EB] px-3 py-3 space-y-2">
          {mine.length === 0 ? (
            <p className="text-sm text-[#5C646D]">You have no live beta listings yet.</p>
          ) : (
            <ul className="space-y-2">
              {mine.map((listing) => (
                <li
                  key={listing.id}
                  className="rounded-lg border border-[#E5E7EB] bg-white p-3 space-y-2"
                >
                  <div className="flex gap-2.5">
                    <ListingPhoto listingId={listing.id} />
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm font-medium text-[#1A1E23]">
                        {listing.title ?? listing.item_label}
                      </p>
                      <p className="text-xs text-[#5C646D]">
                        {(listing.interest_count ?? 0) === 0
                          ? "No interest yet"
                          : `${listing.interest_count} interested`}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/app/listings?edit=${listing.id}`}
                    className="inline-flex text-xs font-medium text-primary underline"
                  >
                    Edit listing
                  </Link>
                  <SellerListingInterests
                    listingId={listing.id}
                    interestCount={listing.interest_count ?? 0}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </details>
    </div>
  );
}
