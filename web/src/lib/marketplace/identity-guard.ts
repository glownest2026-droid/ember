/**
 * Marketplace identity guard (PR9).
 *
 * Step 3 may ENRICH Step 2 but must NOT CONTRADICT it.
 * Validates title and description; provides deterministic fallback titles.
 */

import { isBroadCategoryLabel } from "./confirmed-item-identity";
import { formatProductTitleCase } from "./listing-title-format";

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

const EXCLUSIVE_ITEM_NOUNS: string[] = [
  "saxophone", "xylophone", "trumpet", "drum kit", "drum", "piano", "keyboard",
  "guitar", "recorder", "tambourine", "maracas",
  "binoculars", "telescope", "magnifying glass", "microscope",
  "sleep aid", "white noise machine", "night light", "cot soother", "soother",
  "cot", "crib", "swaddle", "sleeping bag", "dummy", "moses basket",
  "helmet", "costume", "cape", "mask", "tutu", "fancy dress", "tiara",
  "doctor kit", "vet kit", "tea set", "toy kitchen", "cash register", "tool set",
  "balance bike", "scooter", "tricycle", "ride on",
  "building blocks", "shape sorter", "stacking rings", "jigsaw", "puzzle",
  "picture book", "board book", "story book", "book",
  "teddy", "soft toy", "doll", "dolls house",
  "pounding bench", "hammer and peg", "peg toy",
];

/** Standalone or phrase sleep-domain signals in titles. */
const SLEEP_DOMAIN_TERMS = [
  "sleep",
  "sleep aid",
  "baby sleep",
  "white noise",
  "night light",
  "cot soother",
  "soother",
  "sound machine",
];

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
  "toy item",
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

function significantTokens(text: string | null | undefined): string[] {
  return normalizeItemIdentityTerms(text)
    .split(" ")
    .filter((t) => t.length >= 3);
}

function titleImpliesSleepDomain(title: string | null | undefined): boolean {
  const norm = normalizeItemIdentityTerms(title);
  if (!norm) return false;
  return SLEEP_DOMAIN_TERMS.some((term) => {
    const t = normalizeItemIdentityTerms(term);
    return norm === t || norm.startsWith(`${t} `) || norm.endsWith(` ${t}`) || norm.includes(` ${t} `);
  });
}

function confirmedHasConcretePlayIdentity(confirmed: LockedConfirmedItem): boolean {
  const text = [
    confirmed.confirmed_item_label,
    confirmed.confirmed_visual_description,
    confirmed.confirmed_category_label,
  ].join(" ");
  const nouns = findExclusiveNouns(text);
  const playNouns = nouns.filter(
    (n) => !SLEEP_DOMAIN_TERMS.some((s) => normalizeItemIdentityTerms(n).includes(normalizeItemIdentityTerms(s)))
  );
  if (playNouns.length > 0) return true;
  return /\bhelmet\b|\bvisor\b|\bknight\b|\bbinocular|\bsaxophone\b|\bxylophone\b|\bpeg\b/i.test(text);
}

function tokensOverlap(a: string[], b: string[]): boolean {
  const setB = new Set(b);
  return a.some((t) => setB.has(t) && t.length >= 4);
}

function isGenericTitle(title: string | null | undefined): boolean {
  const norm = normalizeItemIdentityTerms(title);
  if (!norm) return true;
  if (GENERIC_TITLE_TERMS.has(norm)) return true;
  const tokens = norm.split(" ").filter(Boolean);
  const genericWords = new Set([
    "toy", "toys", "item", "items", "product", "thing", "baby", "kids", "childrens",
    "preloved", "second", "hand", "used",
  ]);
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

export function deriveDeterministicFallbackTitle(confirmed: LockedConfirmedItem): string {
  const label = confirmed.confirmed_item_label.trim();
  if (label && !isBroadCategoryLabel(label)) {
    const formatted = formatProductTitleCase(label);
    return formatted.length > 90 ? `${formatted.slice(0, 89)}…` : formatted;
  }
  const visual = confirmed.confirmed_visual_description.trim();
  if (/\bhelmet\b|\bvisor\b|\bknight\b/i.test(visual)) {
    return formatProductTitleCase("Toy knight helmet");
  }
  if (/\bbinocular/i.test(visual)) {
    return "Child binoculars";
  }
  if (/\bsaxophone\b/i.test(visual)) {
    return "Saxophone-style musical toy";
  }
  if (/\bxylophone\b/i.test(visual)) {
    return "Toy xylophone";
  }
  if (visual.length > 12) {
    const short = visual.split(/[.!?]/)[0]?.trim() ?? visual;
    if (short.length <= 90) return short;
    return `${short.slice(0, 87)}…`;
  }
  if (label) return label;
  return "Confirmed item";
}

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
    return { conflict: false, reason: "no_confirmed_identity_terms", confirmed_terms: confirmedNouns, draft_terms: draftNouns };
  }

  const confirmedSet = new Set(confirmedNouns.map(normalizeItemIdentityTerms));
  const overlap = draftNouns.some((n) => confirmedSet.has(normalizeItemIdentityTerms(n)));
  if (overlap) {
    return { conflict: false, reason: "draft_shares_confirmed_identity", confirmed_terms: confirmedNouns, draft_terms: draftNouns };
  }

  if (draftNouns.length > 0) {
    return {
      conflict: true,
      reason: `Draft asserts "${draftNouns.join(", ")}" but the confirmed item is "${confirmedNouns.join(", ")}".`,
      confirmed_terms: confirmedNouns,
      draft_terms: draftNouns,
    };
  }

  return { conflict: false, reason: "draft_has_no_competing_identity", confirmed_terms: confirmedNouns, draft_terms: draftNouns };
}

/** Stricter title-only checks (catches standalone "Sleep" vs helmet). */
export function validateTitleAgainstConfirmedItem(
  confirmed: LockedConfirmedItem,
  title: string | null | undefined
): DraftIdentityValidation {
  const titleNorm = normalizeItemIdentityTerms(title);
  if (!titleNorm) {
    return {
      ok: false,
      status: "review_required",
      reason: "Draft title is empty.",
      confirmed_terms: significantTokens(confirmed.confirmed_item_label),
      draft_terms: [],
    };
  }

  if (titleImpliesSleepDomain(title) && confirmedHasConcretePlayIdentity(confirmed)) {
    return {
      ok: false,
      status: "conflict",
      reason: "Draft title suggests sleep/nursery but the confirmed item is play equipment.",
      confirmed_terms: significantTokens(confirmed.confirmed_item_label),
      draft_terms: [titleNorm],
    };
  }

  const nounConflict = detectObviousIdentityConflict(confirmed, { title, description: "" });
  if (nounConflict.conflict) {
    return {
      ok: false,
      status: "conflict",
      reason: nounConflict.reason,
      confirmed_terms: nounConflict.confirmed_terms,
      draft_terms: nounConflict.draft_terms,
    };
  }

  const confirmedTokens = significantTokens(
    `${confirmed.confirmed_item_label} ${confirmed.confirmed_visual_description}`
  );
  const titleTokens = significantTokens(title);

  if (confirmedHasConcretePlayIdentity(confirmed) && confirmedTokens.length > 0) {
    if (!tokensOverlap(confirmedTokens, titleTokens) && isGenericTitle(title)) {
      return {
        ok: false,
        status: "review_required",
        reason: "Draft title is too generic for the confirmed item.",
        confirmed_terms: confirmedTokens,
        draft_terms: titleTokens,
      };
    }
    if (!tokensOverlap(confirmedTokens, titleTokens) && titleTokens.length > 0) {
      const conflict = detectObviousIdentityConflict(confirmed, { title, description: "" });
      if (!conflict.conflict && titleTokens.every((t) => !confirmedTokens.includes(t))) {
        return {
          ok: false,
          status: "conflict",
          reason: "Draft title does not match the confirmed item identity.",
          confirmed_terms: confirmedTokens,
          draft_terms: titleTokens,
        };
      }
    }
  }

  return {
    ok: true,
    status: "consistent",
    reason: "title_consistent",
    confirmed_terms: confirmedTokens,
    draft_terms: titleTokens,
  };
}

export function validateDraftAgainstConfirmedItem(
  confirmed: LockedConfirmedItem,
  draft: { title?: string | null; description?: string | null }
): DraftIdentityValidation {
  const titleCheck = validateTitleAgainstConfirmedItem(confirmed, draft.title);
  if (!titleCheck.ok) return titleCheck;

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

/**
 * Applies identity rules to a generated draft. Returns a safe title (fallback if needed).
 */
export function reconcileDraftTitleWithConfirmedIdentity(
  confirmed: LockedConfirmedItem,
  draft: { title?: string | null; description?: string | null; identity_conflict?: boolean }
): { title: string; corrected: boolean; validation: DraftIdentityValidation } {
  const validation = validateDraftAgainstConfirmedItem(confirmed, draft);
  const modelConflict = draft.identity_conflict === true;

  if (validation.ok && !modelConflict) {
    const title = (draft.title ?? "").trim();
    if (title) {
      return { title, corrected: false, validation };
    }
  }

  const fallback = deriveDeterministicFallbackTitle(confirmed);
  return {
    title: fallback,
    corrected: true,
    validation: validation.ok && !modelConflict
      ? { ...validation, ok: false, status: "review_required", reason: "empty_title_replaced_with_fallback" }
      : validation,
  };
}
