import type { PriceGuidance, PriceSourceType } from "./beta-listing-types";

export function formatPriceRange(price: PriceGuidance): string | null {
  if (price.price_low == null || price.price_high == null) return null;
  return `£${price.price_low}–${price.price_high}`;
}

export function priceConfidenceLabel(source: PriceSourceType, confidence: string): string {
  if (source === "insufficient_data") return "Limited data";
  if (source === "ai_general_estimate") return "Early estimate";
  if (confidence === "high") return "Medium confidence";
  return "Early estimate";
}
