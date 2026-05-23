"use client";

import { useState } from "react";
import { LocalOpportunityMapCard } from "@/components/marketplace/LocalOpportunityMapCard";
import type { OpportunityPayload } from "@/lib/marketplace/beta-listing-types";
import { formatPriceRange, priceConfidenceLabel } from "@/lib/marketplace/beta-listing-display";

type Props = {
  draftId: string;
  defaultAreaLabel?: string | null;
  defaultPostcode?: string | null;
  onPublished: (listingId: string) => void;
  onOpportunityLoaded?: () => void;
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

export function ListingOpportunitySection({
  draftId,
  defaultAreaLabel,
  defaultPostcode,
  onPublished,
  onOpportunityLoaded,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [opportunity, setOpportunity] = useState<OpportunityPayload | null>(null);
  const [areaLabel, setAreaLabel] = useState(defaultAreaLabel ?? "");
  const [postcode, setPostcode] = useState(defaultPostcode ?? "");
  const [publishedId, setPublishedId] = useState<string | null>(null);

  const loadOpportunity = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/marketplace/listing-drafts/${draftId}/opportunity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approximate_area_label: areaLabel.trim() || undefined,
          postcode: postcode.trim() || undefined,
        }),
      });
      const payload = await parseJson<{ opportunity?: OpportunityPayload; error?: string }>(response);
      if (!response.ok) {
        throw new Error(payload?.error ?? "Could not load your local opportunity.");
      }
      if (!payload?.opportunity) throw new Error("Unexpected response.");
      setOpportunity(payload.opportunity);
      setAreaLabel(payload.opportunity.approximate_area_label);
      onOpportunityLoaded?.();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load opportunity.");
    } finally {
      setLoading(false);
    }
  };

  const publishListing = async () => {
    setPublishing(true);
    setError(null);
    try {
      const response = await fetch(`/api/marketplace/listing-drafts/${draftId}/publish-beta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approximate_area_label: areaLabel.trim() || opportunity?.approximate_area_label,
          postcode: postcode.trim() || undefined,
        }),
      });
      const payload = await parseJson<{ listing?: { id: string }; error?: string }>(response);
      if (!response.ok) {
        throw new Error(payload?.error ?? "Could not publish your listing.");
      }
      if (!payload?.listing?.id) throw new Error("Unexpected response.");
      setPublishedId(payload.listing.id);
      onPublished(payload.listing.id);
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : "Could not publish.");
    } finally {
      setPublishing(false);
    }
  };

  if (publishedId) {
    return (
      <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm font-medium text-emerald-900">Your listing is live to nearby Ember families.</p>
        <p className="text-sm text-emerald-800">
          Messaging is coming later. For now, we&apos;ll let you know when a parent is interested.
        </p>
        <a href="/app/marketplace" className="inline-flex text-sm text-primary underline">
          View marketplace
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#5C646D]">
        See what this might sell for and how many nearby Ember families may be interested.
      </p>

      {!opportunity && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-[#1A1E23]" htmlFor="approx-area">
              Approximate area
            </label>
            <input
              id="approx-area"
              value={areaLabel}
              onChange={(e) => setAreaLabel(e.target.value)}
              placeholder="e.g. Windsor"
              className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-[#1A1E23]" htmlFor="area-postcode">
              Outward postcode (optional)
            </label>
            <input
              id="area-postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              placeholder="e.g. SL4"
              className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm"
            />
            <p className="text-xs text-[#5C646D]">We only show an approximate area, not your full address.</p>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={loadOpportunity}
            className="inline-flex min-h-[44px] items-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Loading…" : "See local opportunity"}
          </button>
        </div>
      )}

      {opportunity && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 space-y-2">
            <p className="text-sm font-medium text-[#1A1E23]">Your local opportunity</p>
            <p className="text-lg font-medium text-[#1A1E23]">
              Likely range: {formatPriceRange(opportunity.price) ?? "Limited data"}
            </p>
            <p className="text-xs text-[#5C646D]">
              {priceConfidenceLabel(opportunity.price.source_type, opportunity.price.confidence)} · Final
              price is your choice.
            </p>
            <p className="text-sm text-[#1A1E23]">{opportunity.demand.display_copy}</p>
            <p className="text-xs text-[#5C646D]">{opportunity.demand.supporting_copy}</p>
          </div>

          <LocalOpportunityMapCard
            areaLabel={opportunity.map_summary.area_label}
            radiusMiles={opportunity.map_summary.radius_miles}
            hotspotCount={opportunity.map_summary.hotspot_count}
          />

          <p className="text-xs text-[#5C646D]">
            Your listing will be visible to signed-in Ember families nearby. Your exact address is not
            shown.
          </p>

          <button
            type="button"
            disabled={publishing}
            onClick={publishListing}
            className="inline-flex min-h-[44px] items-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {publishing ? "Publishing…" : "List to nearby families"}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
