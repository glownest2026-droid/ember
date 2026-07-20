/**
 * Resolves parent-confirmed item identity (concrete object vs broad category).
 * Used by select-candidate, generate-details, details save, and the listing UI.
 */

import type { Pr3AiRawResponse } from "./ai-listing-details-types";
import { normalizeItemIdentityTerms } from "./identity-guard";
import { formatProductTitleCase } from "./listing-title-format";

export type ResolvedConfirmedIdentity = {
  confirmed_item_label: string;
  confirmed_visual_description: string;
  confirmed_category_label: string;
};

const BROAD_CATEGORY_PATTERN =
  /\b(dress up|pretend play|musical toys?|general|toy category|play category)\b/i;

/** Short labels that are categories, not concrete objects. */
function isBroadCategoryLabel(label: string | null | undefined): boolean {
  const norm = normalizeItemIdentityTerms(label);
  if (!norm) return true;
  if (BROAD_CATEGORY_PATTERN.test(norm)) return true;
  // Very short generic phrases without object nouns.
  const objectNouns = [
    "bike",
    "trike",
    "scooter",
    "ride on",
    "ride-on",
    "bed",
    "cot",
    "pram",
    "helmet",
    "binocular",
    "saxophone",
    "xylophone",
    "book",
    "kit",
    "toy",
    "bench",
    "peg",
    "machine",
    "soother",
  ];
  if (norm.split(" ").length <= 4 && !objectNouns.some((n) => norm.includes(n))) {
    return true;
  }
  return false;
}

function deriveLabelFromVisual(visual: string): string | null {
  const norm = normalizeItemIdentityTerms(visual);
  if (!norm) return null;
  if (/\bhelmet\b|\bvisor\b|\bknight\b|\barmou?r\b/.test(norm)) {
    return "Toy knight helmet";
  }
  if (/\bbinocular/.test(norm)) {
    return "Child binoculars";
  }
  if (/\bsaxophone\b/.test(norm)) {
    return "Saxophone-style musical toy";
  }
  if (/\bxylophone\b/.test(norm)) {
    return "Toy xylophone";
  }
  if (/\bhammer\b.*\bpeg\b|\bpeg\b.*\bhammer\b|\bpounding bench\b/.test(norm)) {
    return "Hammer and peg toy";
  }
  if (/\bdoctor kit\b|\bvet kit\b|\bmedical kit\b/.test(norm)) {
    return "Toy doctor kit";
  }
  if (/\bpicture book\b|\bboard book\b|\bstory book\b/.test(norm)) {
    return "Picture book";
  }
  if (/\bsleep aid\b|\bwhite noise\b|\bnight light\b|\bcot soother\b/.test(norm)) {
    return "Baby sleep aid";
  }
  return null;
}

function pickConcreteLabel(candidates: (string | null | undefined)[]): string {
  for (const c of candidates) {
    const trimmed = (c ?? "").trim();
    if (!trimmed) continue;
    if (!isBroadCategoryLabel(trimmed)) return trimmed;
  }
  return "";
}

export function resolveConfirmedIdentity(args: {
  pr3Raw: Pr3AiRawResponse | null;
  parentDisplayLabel?: string | null;
  productTypeLabel?: string | null;
  productTypeSubtitle?: string | null;
}): ResolvedConfirmedIdentity {
  const analysis = args.pr3Raw?.analysis;
  const stored = args.pr3Raw as Pr3AiRawResponse & {
    parent_confirmed_item_label?: string;
    parent_confirmed_category_label?: string;
    parent_confirmed_visual_description?: string;
  };

  const visual =
    stored?.parent_confirmed_visual_description?.trim() ||
    analysis?.visual_description?.trim() ||
    "";

  const category =
    stored?.parent_confirmed_category_label?.trim() ||
    args.productTypeSubtitle?.trim() ||
    analysis?.broad_category?.trim() ||
    args.productTypeLabel?.trim() ||
    "";

  const fromVisual = deriveLabelFromVisual(visual);

  const concrete = pickConcreteLabel([
    stored?.parent_confirmed_item_label,
    args.parentDisplayLabel,
    analysis?.user_facing_item_label,
    analysis?.detected_item_label,
    fromVisual,
    args.pr3Raw?.parent_confirmed_display_label,
  ]);

  const confirmed_item_label =
    concrete ||
    fromVisual ||
    (args.parentDisplayLabel?.trim() && !isBroadCategoryLabel(args.parentDisplayLabel)
      ? args.parentDisplayLabel.trim()
      : "") ||
    deriveLabelFromVisual(visual) ||
    args.productTypeLabel?.trim() ||
    "Confirmed item";

  return {
    confirmed_item_label: formatProductTitleCase(confirmed_item_label),
    confirmed_visual_description: visual,
    confirmed_category_label: category,
  };
}

export { isBroadCategoryLabel };
