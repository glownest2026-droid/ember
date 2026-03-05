/**
 * Form + backend shape for pre-list flow. Maps to marketplace_listings + preferences.
 */
export interface ListingData {
  itemName: string;
  category: string;
  isBundle: boolean;
  condition: string;
  quantity: string;
  brand: string;
  notes: string;
  includesAccessories: boolean;
  missingParts: boolean;
  smokeFree: boolean;
  petFree: boolean;
  postcode: string;
  radius: string;
  pickupOnly: boolean;
  canPost: boolean;
  availableFrom: string;
  wantReminders: boolean;
  pricingIntent: string;
  priceAmount: string;
  /** Set when user picks a suggestion from suggest_marketplace_item_types */
  selectedItemTypeId?: string | null;
  /** From RPC similarity_score when picking a type */
  normalizationConfidence?: number | null;
}

/** Suggestion row from suggest_marketplace_item_types RPC */
export interface ItemTypeSuggestion {
  item_type_id: string;
  canonical_name: string;
  slug: string;
  similarity_score: number;
}
