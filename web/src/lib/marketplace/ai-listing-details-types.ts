import "server-only";

export const LISTING_TITLE_MAX = 90;
export const LISTING_DESCRIPTION_MAX = 700;
export const LISTING_DESCRIPTION_SAVE_MAX = 1000;
export const LISTING_ARRAY_MAX_ITEMS = 8;

export const LISTING_CONDITION_VALUES = [
  "new",
  "like_new",
  "good",
  "fair",
  "needs_repair",
  "not_sure",
] as const;

export type ListingConditionValue = (typeof LISTING_CONDITION_VALUES)[number];

export type ListingDraftDetailsJson = {
  suggested_title: string;
  suggested_description: string;
  category_label: string;
  condition_suggestion: string;
  condition_questions: string[];
  included_parts_checklist: string[];
  missing_parts_questions: string[];
  safety_resale_notes: string[];
  photo_improvement_suggestions: string[];
  restricted_or_blocked: boolean;
  identity_conflict?: boolean;
  parent_editing_note: string;
  canonical_review_note?: string;
  generation_model?: string;
  generated_at?: string;
};

export type Pr3StoredAnalysis = {
  user_facing_item_label?: string;
  detected_item_label?: string;
  visual_description?: string;
  canonical_search_terms?: string[];
  possible_brand?: string;
  visible_text?: string[];
  broad_category?: string;
  product_type_candidates?: { label?: string; why?: string }[];
  condition_observations?: string[];
  missing_parts_questions?: string[];
  safety_warnings?: string[];
};

export type Pr3AiRawResponse = {
  analysis?: Pr3StoredAnalysis;
  canonical_candidates?: { label?: string; subtitle?: string }[];
  parent_confirmed_display_label?: string;
};
