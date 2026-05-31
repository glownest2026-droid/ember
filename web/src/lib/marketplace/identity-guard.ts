/**
 * Marketplace identity guard (PR9).
 *
 * Principle: Step 3 (draft generation) may ENRICH the parent-confirmed item
 * from Step 2, but it may NOT CONTRADICT it.
 *
 * This module is intentionally pragmatic. It does not attempt perfect semantic
 * safety. It catches *obvious* identity drift (e.g. a confirmed "plastic costume
 * helmet" being drafted as a "Baby sleep aid") and prevents the bad draft from
 * being saved. The rule is generic — it works on any pair of distinct item
 * identities, not just the helmet regression.
 *
 * Pure module (no server-only imports) so it can be unit-tested offline.
 */

export type LockedConfirmedItem = {
  confirmed_item_label: string;
  confirmed_visual_description: string;
  confirmed_category_label: string;
  confirmed_item_source: string;
  parent_confirmed_at: string | null;
  ai_analysis_event_id: string | null;
};

export type IdentityConflict = {
  conflict: boolean;
  reason: string;
  confirmed_terms: string[];
  draft_terms: string[];
};

export type DraftIdentityValidation = {
  ok: boolean;
  status: "consistent" | "review_required" | "conflict";
  reason: string;
  confirmed_terms: string[];
  draft_terms: string[];
};

/**
 * Distinct, mutually-exclusive item nouns. If a draft asserts one of these and
 * the confirmed item asserts a *different* one (with no overlap), that is an
 * obvious contradiction. Multi-word entries are matched as phrases.
 */
const EXCLUSIVE_ITEM_NOUNS: string[] = [
  // music
  "saxophone", "xylophone", "trumpet", "drum kit", "drum", "piano", "keyboard",
  "guitar", "recorder", "tambourine", "maracas",
  // optics / exploration
  "binoculars", "telescope", "magnifying glass", "microscope",
  // sleep / nursery (the helmet regression target group)
  "sleep aid", "white noise machine", "night light", "cot soother", "soother",
  "cot", "crib", "swaddle", "sleeping bag", "dummy", "moses basket",
  // dress-up / costume
  "helmet", "costume", "cape", "mask", "tutu", "fancy dress", "tiara",
  // pretend play
  "doctor kit", "vet kit", "tea set", "toy kitchen", "cash register", "tool set",
  // ride-on
  "balance bike", "scooter", "tricycle", "ride on",
  // construction / puzzles
  "building blocks", "shape sorter", "stacking rings", "jigsaw", "puzzle",
  // books
  "picture book", "board book", "story book", "book",
  // soft / dolls
  "teddy", "soft toy", "doll", "dolls house",
  // tactile cause-and-effect
  "pounding bench", "hammer and peg", "peg toy",
];

/** Generic, low-information titles that should not replace a specific identity. */
const GENERIC_TITLE_TERMS = new Set([
  "toy",
  "kids toy",
  "childrens toy",
  "baby toy",
  "item",
  "second hand item",
  "preloved item",
  "baby item",
  "product",
  "thing",
  "stuff",
]);

export function normalizeItemIdentityTerms(value: string | null | undefined): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findExclusiveNouns(text: string | null | undefined): string[] {
  const norm = ` ${normalizeItemIdentityTerms(text)} `;
  const found: string[] = [];
  for (const noun of EXCLUSIVE_ITEM_NOUNS) {
    const n = normalizeItemIdentityTerms(noun);
    if (norm.includes(` ${n} `)) {
      found.push(noun);
    }
  }
  return found;
}

function isGenericTitle(title: string | null | undefined): boolean {
  const norm = normalizeItemIdentityTerms(title);
  if (!norm) return true;
  // Title is generic if every token is a generic word, or the whole string is a generic phrase.
  if (GENERIC_TITLE_TERMS.has(norm)) return true;
  const tokens = norm.split(" ").filter(Boolean);
  const genericWords = new Set(["toy", "toys", "item", "items", "product", "thing", "baby", "kids", "childrens", "preloved", "second", "hand", "used"]);
  return tokens.length > 0 && tokens.every((t) => genericWords.has(t));
}

export function buildLockedConfirmedItemPayload(args: {
  confirmedItemLabel?: string | null;
  confirmedVisualDescription?: string | null;
  confirmedCategoryLabel?: string | null;
  source?: string | null;
  parentConfirmedAt?: string | null;
  aiAnalysisEventId?: string | null;
}): LockedConfirmedItem {
  return {
    confirmed_item_label: (args.confirmedItemLabel ?? "").trim(),
    confirmed_visual_description: (args.confirmedVisualDescription ?? "").trim(),
    confirmed_category_label: (args.confirmedCategoryLabel ?? "").trim(),
    confirmed_item_source: (args.source ?? "parent_confirmation").trim() || "parent_confirmation",
    parent_confirmed_at: args.parentConfirmedAt ?? null,
    ai_analysis_event_id: args.aiAnalysisEventId ?? null,
  };
}

/**
 * Detects an obvious identity contradiction between the confirmed item and a
 * proposed draft. Returns conflict=true only when the draft clearly asserts a
 * *different* concrete item than the one the parent confirmed.
 */
export function detectObviousIdentityConflict(
  confirmed: LockedConfirmedItem,
  draft: { title?: string | null; description?: string | null }
): IdentityConflict {
  const confirmedText = [
    confirmed.confirmed_item_label,
    confirmed.confirmed_visual_description,
    confirmed.confirmed_category_label,
  ].join(" ");
  const draftText = [draft.title ?? "", draft.description ?? ""].join(" ");

  const confirmedNouns = findExclusiveNouns(confirmedText);
  const draftNouns = findExclusiveNouns(draftText);

  if (confirmedNouns.length === 0) {
    // No strong identity to protect; nothing obvious to contradict.
    return { conflict: false, reason: "no_confirmed_identity_terms", confirmed_terms: confirmedNouns, draft_terms: draftNouns };
  }

  const confirmedSet = new Set(confirmedNouns.map(normalizeItemIdentityTerms));
  const overlap = draftNouns.some((n) => confirmedSet.has(normalizeItemIdentityTerms(n)));
  if (overlap) {
    return { conflict: false, reason: "draft_shares_confirmed_identity", confirmed_terms: confirmedNouns, draft_terms: draftNouns };
  }

  if (draftNouns.length > 0) {
    // Draft asserts a concrete item the parent never confirmed.
    return {
      conflict: true,
      reason: `Draft asserts "${draftNouns.join(", ")}" but the confirmed item is "${confirmedNouns.join(", ")}".`,
      confirmed_terms: confirmedNouns,
      draft_terms: draftNouns,
    };
  }

  return { conflict: false, reason: "draft_has_no_competing_identity", confirmed_terms: confirmedNouns, draft_terms: draftNouns };
}

/**
 * Validates a generated draft against the confirmed item. The Step 3 server
 * route should refuse to save when this returns ok=false.
 *
 * - "conflict": the draft contradicts the confirmed item -> do not save.
 * - "review_required": the draft is too generic to represent a specific
 *   confirmed item -> do not save; ask for a better draft.
 * - "consistent": safe to save.
 */
export function validateDraftAgainstConfirmedItem(
  confirmed: LockedConfirmedItem,
  draft: { title?: string | null; description?: string | null }
): DraftIdentityValidation {
  const conflict = detectObviousIdentityConflict(confirmed, draft);
  if (conflict.conflict) {
    return {
      ok: false,
      status: "conflict",
      reason: conflict.reason,
      confirmed_terms: conflict.confirmed_terms,
      draft_terms: conflict.draft_terms,
    };
  }

  // If the confirmed item has a specific identity but the draft title is generic,
  // flag for review rather than saving a vague listing.
  if (conflict.confirmed_terms.length > 0 && isGenericTitle(draft.title)) {
    return {
      ok: false,
      status: "review_required",
      reason: `Draft title is too generic for the confirmed item "${conflict.confirmed_terms.join(", ")}".`,
      confirmed_terms: conflict.confirmed_terms,
      draft_terms: conflict.draft_terms,
    };
  }

  return {
    ok: true,
    status: "consistent",
    reason: "draft_consistent_with_confirmed_item",
    confirmed_terms: conflict.confirmed_terms,
    draft_terms: conflict.draft_terms,
  };
}
