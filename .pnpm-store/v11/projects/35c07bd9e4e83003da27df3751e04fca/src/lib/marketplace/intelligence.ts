/**
 * Marketplace listing intelligence contract + validation (PR9).
 *
 * Gemini SUGGESTS; Ember VALIDATES; the parent CONFIRMS.
 * Gemini must never create live taxonomy truth. This module:
 *   - describes the structured JSON contract we ask Gemini for,
 *   - builds the classification prompt (with allowed slugs injected),
 *   - validates Gemini output against the controlled taxonomy,
 *   - routes unknown suggestions to the review queue (never to live mappings).
 *
 * Pure module (no server-only imports) so validation can be unit-tested offline.
 */

import {
  isAllowedStage1Slug,
  STAGE1_WRAPPER_LABELS,
  STAGE1_WRAPPER_SLUGS,
  type Stage1WrapperSlug,
} from "./marketplace-taxonomy";

export const AI_AGE_MIN_MONTHS = 0;
export const AI_AGE_MAX_MONTHS = 216; // 18 years; sanity ceiling.
const MAX_SAFETY_FLAGS = 8;

export type GeminiItemTypeCandidate = {
  slug?: string;
  label?: string;
  confidence?: number;
};

export type GeminiDevelopmentAreaCandidate = {
  stage1_wrapper_ux_slug?: string;
  reason?: string;
};

export type GeminiIntelligenceResponse = {
  observed_item_label?: string;
  visual_description?: string;
  marketplace_item_type_candidates?: GeminiItemTypeCandidate[];
  development_area_candidates?: GeminiDevelopmentAreaCandidate[];
  estimated_min_age_months?: number;
  estimated_max_age_months?: number;
  safety_flags?: string[];
  unmatched_taxonomy_suggestions?: string[];
};

export type ReviewQueueItem = {
  observed_item_label: string | null;
  suggested_item_type_slug: string | null;
  suggested_stage1_wrapper_ux_slugs: string[];
  reason: string;
  confidence: "low" | "medium" | "high";
};

export type ValidatedIntelligence = {
  observed_item_label: string | null;
  visual_description: string | null;
  accepted_item_type_slugs: string[];
  accepted_item_type_candidates: GeminiItemTypeCandidate[];
  rejected_item_type_slugs: string[];
  development_area_slugs: Stage1WrapperSlug[];
  rejected_stage1_slugs: string[];
  ai_estimated_min_age_months: number | null;
  ai_estimated_max_age_months: number | null;
  safety_flags: string[];
  confidence: "low" | "medium" | "high";
  review_queue_items: ReviewQueueItem[];
};

export function buildIntelligenceClassificationPrompt(args: {
  allowedItemTypeSlugs: string[];
  confirmedItemLabel?: string | null;
  confirmedVisualDescription?: string | null;
}): string {
  const allowed = args.allowedItemTypeSlugs.filter(Boolean);
  return [
    "You are helping Ember classify a second-hand child item for a UK parent.",
    "You are an assistant that SUGGESTS only. Ember validates your output and the parent confirms it.",
    "You must not create authoritative safety guidance and must not claim an item is safe or suitable.",
    "Be cautious with age suitability. Distinguish three different things:",
    "- manufacturer age, only if it is clearly visible in the photo (otherwise omit it),",
    "- an AI estimated play stage (your best cautious guess),",
    "- safety caveats the parent should check.",
    "If you are uncertain, return low confidence rather than guessing.",
    "",
    "Allowed marketplace item type slugs (choose from these; anything else is a SUGGESTION only):",
    allowed.length > 0 ? allowed.join(", ") : "(none provided)",
    "",
    "Allowed Stage 1 development wrapper slugs (only these seven are valid):",
    STAGE1_WRAPPER_SLUGS.join(", "),
    "Any slug not in these lists is a suggestion for human review only — do not present it as truth.",
    "",
    args.confirmedItemLabel ? `Parent-confirmed item label: ${args.confirmedItemLabel}` : "",
    args.confirmedVisualDescription
      ? `Parent-confirmed visual description: ${args.confirmedVisualDescription}`
      : "",
    "",
    "Return JSON only. No markdown. Shape:",
    "{",
    '  "observed_item_label": "plastic costume helmet",',
    '  "visual_description": "A grey plastic costume helmet styled after medieval armour.",',
    '  "marketplace_item_type_candidates": [{ "slug": "dress_up_costume_helmet", "label": "Dress-up costume helmet", "confidence": 0.86 }],',
    '  "development_area_candidates": [{ "stage1_wrapper_ux_slug": "social_emotional", "reason": "Supports role play and pretending." }],',
    '  "estimated_min_age_months": 36,',
    '  "estimated_max_age_months": 72,',
    '  "safety_flags": ["Check manufacturer age guidance", "Costume item; check fit and visibility"],',
    '  "unmatched_taxonomy_suggestions": ["dress_up_costume_props"]',
    "}",
  ]
    .filter((line) => line.length > 0)
    .join("\n");
}

export function sanitizeAgeRange(
  min: number | null | undefined,
  max: number | null | undefined
): { min: number | null; max: number | null } {
  let lo = typeof min === "number" && Number.isFinite(min) ? Math.round(min) : null;
  let hi = typeof max === "number" && Number.isFinite(max) ? Math.round(max) : null;

  if (lo !== null && lo < AI_AGE_MIN_MONTHS) lo = null;
  if (hi !== null && hi < AI_AGE_MIN_MONTHS) hi = null;
  if (lo !== null && lo > AI_AGE_MAX_MONTHS) lo = null;
  if (hi !== null && hi > AI_AGE_MAX_MONTHS) hi = null;
  // max must be >= min; if not, drop the inconsistent max.
  if (lo !== null && hi !== null && hi < lo) hi = null;
  return { min: lo, max: hi };
}

function deriveConfidence(candidates: GeminiItemTypeCandidate[]): "low" | "medium" | "high" {
  const top = candidates.reduce((acc, c) => {
    const v = typeof c.confidence === "number" ? c.confidence : 0;
    return v > acc ? v : acc;
  }, 0);
  if (top >= 0.8) return "high";
  if (top >= 0.5) return "medium";
  return "low";
}

/**
 * Validates raw Gemini intelligence against the controlled taxonomy.
 * knownItemTypeSlugs should be the set of active slugs from the DB
 * (the seed mirror is a safe fallback for offline tests).
 */
export function validateGeminiIntelligence(
  raw: GeminiIntelligenceResponse | null | undefined,
  opts: { knownItemTypeSlugs: Iterable<string> }
): ValidatedIntelligence {
  const known = new Set(Array.from(opts.knownItemTypeSlugs).map((s) => s.trim()).filter(Boolean));
  const r = raw ?? {};

  const candidates = Array.isArray(r.marketplace_item_type_candidates)
    ? r.marketplace_item_type_candidates
    : [];

  const accepted: GeminiItemTypeCandidate[] = [];
  const acceptedSlugs: string[] = [];
  const rejectedSlugs: string[] = [];
  for (const c of candidates) {
    const slug = typeof c?.slug === "string" ? c.slug.trim() : "";
    if (!slug) continue;
    if (known.has(slug)) {
      if (!acceptedSlugs.includes(slug)) {
        accepted.push(c);
        acceptedSlugs.push(slug);
      }
    } else if (!rejectedSlugs.includes(slug)) {
      rejectedSlugs.push(slug);
    }
  }

  const devCandidates = Array.isArray(r.development_area_candidates)
    ? r.development_area_candidates
    : [];
  const devSlugs: Stage1WrapperSlug[] = [];
  const rejectedStage1: string[] = [];
  for (const d of devCandidates) {
    const slug = typeof d?.stage1_wrapper_ux_slug === "string" ? d.stage1_wrapper_ux_slug.trim() : "";
    if (!slug) continue;
    if (isAllowedStage1Slug(slug)) {
      if (!devSlugs.includes(slug)) devSlugs.push(slug);
    } else if (!rejectedStage1.includes(slug)) {
      rejectedStage1.push(slug);
    }
  }

  const { min, max } = sanitizeAgeRange(r.estimated_min_age_months, r.estimated_max_age_months);

  const safetyFlags = (Array.isArray(r.safety_flags) ? r.safety_flags : [])
    .map((f) => String(f ?? "").trim())
    .filter(Boolean)
    .slice(0, MAX_SAFETY_FLAGS);

  const observedItemLabel =
    typeof r.observed_item_label === "string" && r.observed_item_label.trim()
      ? r.observed_item_label.trim()
      : null;

  const confidence = deriveConfidence(accepted.length > 0 ? accepted : candidates);

  // Build review-queue rows for anything that did not map cleanly.
  const reviewItems: ReviewQueueItem[] = [];
  const unmatchedSuggestions = (Array.isArray(r.unmatched_taxonomy_suggestions)
    ? r.unmatched_taxonomy_suggestions
    : [])
    .map((s) => String(s ?? "").trim())
    .filter(Boolean);

  for (const slug of rejectedSlugs) {
    reviewItems.push({
      observed_item_label: observedItemLabel,
      suggested_item_type_slug: slug,
      suggested_stage1_wrapper_ux_slugs: [],
      reason: "Gemini suggested an item type slug not in the controlled taxonomy.",
      confidence,
    });
  }
  for (const slug of unmatchedSuggestions) {
    reviewItems.push({
      observed_item_label: observedItemLabel,
      suggested_item_type_slug: slug,
      suggested_stage1_wrapper_ux_slugs: [],
      reason: "Gemini proposed a new taxonomy category.",
      confidence,
    });
  }
  if (rejectedStage1.length > 0) {
    reviewItems.push({
      observed_item_label: observedItemLabel,
      suggested_item_type_slug: null,
      suggested_stage1_wrapper_ux_slugs: rejectedStage1,
      reason: "Gemini suggested development wrapper slugs outside the allowed seven.",
      confidence,
    });
  }

  return {
    observed_item_label: observedItemLabel,
    visual_description:
      typeof r.visual_description === "string" && r.visual_description.trim()
        ? r.visual_description.trim()
        : null,
    accepted_item_type_slugs: acceptedSlugs,
    accepted_item_type_candidates: accepted,
    rejected_item_type_slugs: rejectedSlugs,
    development_area_slugs: devSlugs,
    rejected_stage1_slugs: rejectedStage1,
    ai_estimated_min_age_months: min,
    ai_estimated_max_age_months: max,
    safety_flags: safetyFlags,
    confidence,
    review_queue_items: reviewItems,
  };
}

export { STAGE1_WRAPPER_LABELS };
