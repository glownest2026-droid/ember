export type BetaListingStatus =
  | "published_beta"
  | "paused"
  | "sold_or_moved_on"
  | "removed";

export type PriceConfidence = "low" | "medium" | "high";

export type PriceSourceType =
  | "first_party_history"
  | "manual_price_band"
  | "ai_general_estimate"
  | "insufficient_data";

export type PriceGuidance = {
  price_low: number | null;
  price_high: number | null;
  currency: string;
  confidence: PriceConfidence;
  source_type: PriceSourceType;
  explanation: string;
  caveats: string[];
};

export type DemandConfidence = "low" | "medium" | "high";

export type DemandSignal = {
  radius_miles: number;
  approximate_area_label: string | null;
  soft_stage_match_count: number;
  behavioural_interest_count: number;
  explicit_interest_count: number;
  total_may_be_interested_count: number;
  confidence: DemandConfidence;
  breakdown: Record<string, number>;
  display_copy: string;
  supporting_copy: string;
};

export type OpportunityPayload = {
  snapshot_id: string;
  price: PriceGuidance;
  demand: DemandSignal;
  map_summary: {
    area_label: string;
    radius_miles: number;
    hotspot_count: number;
    provider: "provider_light";
  };
  approximate_area_label: string;
};

export type SellerLocationInput = {
  approximate_area_label?: string;
  postcode?: string | null;
  lat?: number | null;
  lng?: number | null;
};
