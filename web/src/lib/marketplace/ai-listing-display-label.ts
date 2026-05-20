import "server-only";

import type { GeminiListingAnalysisOutput } from "./ai-listing-analysis";

const BROAD_CANONICAL_LABELS = [
  "musical toy",
  "toy",
  "pretend play",
  "general",
  "toys",
  "toy box",
  "storage box",
  "nursery furniture",
  "furniture",
  "box",
  "container",
];

const BROAD_CATEGORY_TITLE_BLOCKLIST = [
  "pretend play",
  "toys",
  "toy",
  "toy item",
  "general",
  "unknown",
  "musical toy",
  "pretend",
  "item",
];

const GENERIC_LABEL_PATTERN =
  /\b(item|toy item|product|confirmed item|second-hand item|unknown|general)\b/i;

export type CandidateTitlePick = {
  title: string;
  suggestedAiLabel: string;
};

export type CanonicalMatchAssessment = {
  isWeak: boolean;
  suggestedAiLabel: string;
  nearestCanonicalMatch: string | null;
  internalCategoryLabel: string | null;
  canonicalReviewNote: string | null;
};

export function cleanLabel(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function isBroadCanonicalLabel(label: string): boolean {
  const lower = cleanLabel(label).toLowerCase();
  if (!lower) return true;
  return BROAD_CANONICAL_LABELS.some((token) => lower === token || lower.includes(token));
}

export function isBroadCategoryTitle(label: string): boolean {
  const lower = cleanLabel(label).toLowerCase();
  return BROAD_CATEGORY_TITLE_BLOCKLIST.some((token) => lower === token);
}

export function isGenericObjectLabel(label: string): boolean {
  const trimmed = cleanLabel(label);
  if (!trimmed) return true;
  if (GENERIC_LABEL_PATTERN.test(trimmed)) return true;
  if (isBroadCategoryTitle(trimmed)) return true;
  if (trimmed.toLowerCase() === "toy item") return true;
  return false;
}

export function isSpecificVisualLabel(label: string): boolean {
  const trimmed = cleanLabel(label);
  if (!trimmed || isGenericObjectLabel(trimmed)) return false;
  if (isBroadCanonicalLabel(trimmed)) return false;
  return trimmed.length >= 4;
}

export function buildVisualSupportText(args: {
  userFacingItemLabel?: string;
  detectedItemLabel?: string;
  aiCandidateLabel?: string;
  visualDescription?: string;
  reason?: string;
  broadCategory?: string;
}): string {
  return [
    args.userFacingItemLabel,
    args.visualDescription,
    args.detectedItemLabel,
    args.aiCandidateLabel,
    args.reason,
    args.broadCategory,
  ]
    .filter(Boolean)
    .join(" ");
}

export function inferObjectLabelFromSupport(supportText: string): string | null {
  const support = cleanLabel(supportText).toLowerCase();
  if (!support) return null;

  if (/ice cream/i.test(support)) {
    if (/shop|stand|parlour|parlor|playset/i.test(support)) return "Ice cream shop playset";
    if (/cart|trolley|stand|shelf/i.test(support)) return "Ice cream cart toy";
    return "Ice cream toy";
  }
  if (/microphone|karaoke|sing[- ]?along|singing toy|voice toy/i.test(support)) {
    if (/microphone/i.test(support)) return "Toy microphone";
    return "Musical toy microphone";
  }
  if (/saxophone/i.test(support)) return "Saxophone-style musical toy";
  if (/trumpet/i.test(support) && !/xylophone/i.test(support)) return "Toy trumpet";
  if (/binocular/i.test(support)) return "Toy binoculars";
  if (/doctor kit|toy doctor|medical kit|stethoscope|syringe/i.test(support)) {
    return "Toy doctor kit";
  }
  if (/shopping trolley|shopping cart|toy trolley/i.test(support)) return "Toy shopping trolley";
  if (/\bkitchen\b/i.test(support) && /toy|play/i.test(support)) return "Toy kitchen";
  if (/xylophone/i.test(support) && !/saxophone|microphone/i.test(support)) {
    return "Toy xylophone";
  }
  if (/keyboard|piano/i.test(support) && /toy|musical|music/i.test(support)) {
    return "Toy keyboard";
  }
  if (/drum/i.test(support) && /toy|musical|music/i.test(support)) {
    return "Toy drum";
  }

  return null;
}

export function pickInternalCategoryLabel(args: {
  broadCategory: string;
  supportText: string;
  canonicalSubtitle?: string | null;
}): string | null {
  const support = cleanLabel(args.supportText).toLowerCase();
  if (/ice cream/i.test(support)) return "Pretend play";
  if (/music|musical|microphone|instrument|xylophone|saxophone|piano|drum|keyboard/i.test(support)) {
    return "Musical toy";
  }
  if (/doctor|medical|stethoscope/i.test(support)) {
    return "Pretend play";
  }
  const broad = cleanLabel(args.broadCategory);
  if (broad && !isBroadCategoryTitle(broad)) {
    return broad.charAt(0).toUpperCase() + broad.slice(1);
  }
  const subtitle = cleanLabel(args.canonicalSubtitle ?? "");
  if (subtitle && !isBroadCanonicalLabel(subtitle)) return subtitle;
  return null;
}

function canonicalContradictsVisual(args: {
  canonicalLabel: string;
  supportText: string;
}): boolean {
  const canon = cleanLabel(args.canonicalLabel).toLowerCase();
  const support = cleanLabel(args.supportText).toLowerCase();
  if (!canon || !support) return false;

  if (/microphone|karaoke|sing[- ]?along|singing toy/i.test(support) && /xylophone/i.test(canon)) {
    return true;
  }
  if (/saxophone/i.test(support) && /xylophone/i.test(canon)) return true;
  if (/binocular/i.test(support) && (/xylophone|toy box/i.test(canon))) return true;
  if (/ice cream/i.test(support) && /xylophone|doctor|stethoscope/i.test(canon) && !/ice cream/i.test(canon)) {
    return true;
  }

  return false;
}

export function canonicalLabelMatchesVisual(args: {
  canonicalLabel: string;
  visualLabel: string;
  reason?: string;
  visualDescription?: string;
}): boolean {
  const canonical = cleanLabel(args.canonicalLabel).toLowerCase();
  const support = buildVisualSupportText({
    detectedItemLabel: args.visualLabel,
    reason: args.reason,
    visualDescription: args.visualDescription,
  }).toLowerCase();
  if (!canonical || !support.trim()) return true;
  if (isBroadCanonicalLabel(canonical)) return false;
  if (canonicalContradictsVisual({ canonicalLabel: canonical, supportText: support })) return false;

  const canonicalTokens = canonical.split(/\s+/).filter((token) => token.length > 3);
  if (canonicalTokens.length === 0) return true;

  return canonicalTokens.some((token) => support.includes(token));
}

export function isWeakCanonicalMatch(args: {
  canonicalLabel: string;
  userFacingLabel: string;
  reason: string;
  visualDescription?: string;
  broadCategory: string;
}): boolean {
  const canonical = cleanLabel(args.canonicalLabel);
  if (!canonical) return true;

  const support = buildVisualSupportText({
    userFacingItemLabel: args.userFacingLabel,
    visualDescription: args.visualDescription,
    reason: args.reason,
    broadCategory: args.broadCategory,
  });

  if (isBroadCanonicalLabel(canonical)) return true;
  if (canonicalContradictsVisual({ canonicalLabel: canonical, supportText: support })) return true;
  if (
    !canonicalLabelMatchesVisual({
      canonicalLabel: canonical,
      visualLabel: args.userFacingLabel,
      reason: args.reason,
      visualDescription: args.visualDescription,
    })
  ) {
    return true;
  }
  return false;
}

export function buildCanonicalReviewNote(args: {
  suggestedAiLabel: string;
  nearestCanonicalMatch: string | null;
  matchConfidence?: string | null;
  reason?: string;
  visualDescription?: string;
  broadCategory?: string;
}): string | null {
  const visual = cleanLabel(args.suggestedAiLabel);
  const canonical = cleanLabel(args.nearestCanonicalMatch ?? "");
  if (!visual) return null;

  if (!canonical) {
    const slugHint = visual.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    return `Gemini suggested '${visual}'. No exact canonical match found. Consider adding canonical marketplace item type: ${slugHint}.`;
  }

  if (
    !isWeakCanonicalMatch({
      canonicalLabel: canonical,
      userFacingLabel: visual,
      reason: args.reason ?? visual,
      visualDescription: args.visualDescription,
      broadCategory: args.broadCategory ?? "",
    })
  ) {
    return null;
  }

  const slugHint = visual.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  const confidence = args.matchConfidence ? ` (${args.matchConfidence})` : "";
  return `Gemini suggested '${visual}'. Nearest canonical match was '${canonical}'${confidence}, but this appears inconsistent. Consider adding canonical marketplace item type: ${slugHint}.`;
}

/** Primary parent-facing label — derived before canonical matching. */
export function resolveUserFacingItemLabel(args: {
  userFacingItemLabel?: string;
  detectedItemLabel?: string;
  aiCandidateLabel?: string;
  visualDescription?: string;
  reason?: string;
  broadCategory?: string;
}): CandidateTitlePick {
  const fromGemini = cleanLabel(args.userFacingItemLabel ?? "");
  if (isSpecificVisualLabel(fromGemini)) {
    return { title: fromGemini, suggestedAiLabel: fromGemini };
  }

  const ai = cleanLabel(args.aiCandidateLabel ?? "");
  const detected = cleanLabel(args.detectedItemLabel ?? "");
  const visualDescription = cleanLabel(args.visualDescription ?? "");
  const reason = cleanLabel(args.reason ?? "");
  const support = buildVisualSupportText({
    detectedItemLabel: detected,
    aiCandidateLabel: ai,
    visualDescription,
    reason,
    broadCategory: args.broadCategory,
  });

  if (isSpecificVisualLabel(ai)) {
    return { title: ai, suggestedAiLabel: ai };
  }
  if (isSpecificVisualLabel(detected)) {
    return { title: detected, suggestedAiLabel: detected };
  }

  const inferred = inferObjectLabelFromSupport(support);
  if (inferred) {
    return { title: inferred, suggestedAiLabel: inferred };
  }

  if (/ice cream/i.test(support)) {
    return { title: "Ice cream cart toy", suggestedAiLabel: "Ice cream cart toy" };
  }
  if (/music|musical|microphone|instrument|singing|karaoke/i.test(support)) {
    return { title: "Musical toy", suggestedAiLabel: detected || ai || "Musical toy" };
  }
  if (/doctor|medical|stethoscope/i.test(support)) {
    return { title: "Toy doctor kit", suggestedAiLabel: detected || ai || "Toy doctor kit" };
  }

  const broad = cleanLabel(args.broadCategory ?? "");
  if (broad && !isBroadCategoryTitle(broad)) {
    const titled = broad.charAt(0).toUpperCase() + broad.slice(1);
    return { title: titled, suggestedAiLabel: detected || ai || titled };
  }

  return { title: "Toy item", suggestedAiLabel: detected || ai || "Toy item" };
}

export function resolveUserFacingLabelFromAnalysis(
  analysis: GeminiListingAnalysisOutput,
  aiCandidate?: { label: string; why: string }
): CandidateTitlePick {
  return resolveUserFacingItemLabel({
    userFacingItemLabel: analysis.user_facing_item_label,
    detectedItemLabel: analysis.detected_item_label,
    aiCandidateLabel: aiCandidate?.label,
    visualDescription: analysis.visual_description,
    reason: aiCandidate?.why ?? analysis.visual_description,
    broadCategory: analysis.broad_category,
  });
}

export function assessCanonicalMatch(args: {
  canonicalLabel: string | null;
  analysis: GeminiListingAnalysisOutput;
  aiCandidateLabel: string;
  reason: string;
  confidenceBucket?: string | null;
}): CanonicalMatchAssessment {
  const userFacing = resolveUserFacingLabelFromAnalysis(args.analysis, {
    label: args.aiCandidateLabel,
    why: args.reason,
  });
  const canonical = cleanLabel(args.canonicalLabel ?? "");
  const isWeak =
    !canonical ||
    isWeakCanonicalMatch({
      canonicalLabel: canonical,
      userFacingLabel: userFacing.title,
      reason: args.reason,
      visualDescription: args.analysis.visual_description,
      broadCategory: args.analysis.broad_category,
    });

  const internalCategoryLabel = pickInternalCategoryLabel({
    broadCategory: args.analysis.broad_category,
    supportText: buildVisualSupportText({
      userFacingItemLabel: userFacing.title,
      visualDescription: args.analysis.visual_description,
      reason: args.reason,
    }),
    canonicalSubtitle: null,
  });

  return {
    isWeak,
    suggestedAiLabel: userFacing.suggestedAiLabel,
    nearestCanonicalMatch: canonical || null,
    internalCategoryLabel,
    canonicalReviewNote: buildCanonicalReviewNote({
      suggestedAiLabel: userFacing.suggestedAiLabel,
      nearestCanonicalMatch: canonical,
      matchConfidence: args.confidenceBucket ?? null,
      reason: args.reason,
      visualDescription: args.analysis.visual_description,
      broadCategory: args.analysis.broad_category,
    }),
  };
}

/** @deprecated Use resolveUserFacingItemLabel */
export function pickCandidateCardTitle(args: {
  detectedItemLabel: string;
  aiCandidateLabel: string;
  reason: string;
  broadCategory: string;
  userFacingItemLabel?: string;
  visualDescription?: string;
}): CandidateTitlePick {
  return resolveUserFacingItemLabel({
    userFacingItemLabel: args.userFacingItemLabel,
    detectedItemLabel: args.detectedItemLabel,
    aiCandidateLabel: args.aiCandidateLabel,
    visualDescription: args.visualDescription,
    reason: args.reason,
    broadCategory: args.broadCategory,
  });
}

export function pickUserFacingDisplayLabel(args: {
  visualLabel: string;
  aiCandidateLabel?: string;
  canonicalCatalogLabel?: string;
  categoryLabel?: string;
  reason?: string;
  visualDescription?: string;
  userFacingItemLabel?: string;
}): string {
  return resolveUserFacingItemLabel({
    userFacingItemLabel: args.userFacingItemLabel ?? args.visualLabel,
    detectedItemLabel: args.visualLabel,
    aiCandidateLabel: args.aiCandidateLabel,
    visualDescription: args.visualDescription,
    reason: args.reason,
    broadCategory: args.categoryLabel,
  }).title;
}

export function pickTitleFromContext(args: {
  suggestedTitle: string;
  visualLabel: string;
  canonicalLabel: string;
  categoryLabel: string;
  visualSupportText: string;
}): string {
  const pick = resolveUserFacingItemLabel({
    userFacingItemLabel: args.visualLabel,
    detectedItemLabel: args.visualLabel,
    visualDescription: args.visualSupportText,
    reason: args.visualSupportText,
    broadCategory: args.categoryLabel,
  });

  let title = cleanLabel(args.suggestedTitle);
  const titleLower = title.toLowerCase();
  const support = args.visualSupportText.toLowerCase();

  if (!title || isBroadCanonicalLabel(title) || isBroadCategoryTitle(title) || isGenericObjectLabel(title)) {
    title = pick.title;
  }
  if (canonicalContradictsVisual({ canonicalLabel: title, supportText: support })) {
    title = pick.title;
  }
  if (/xylophone/i.test(titleLower) && /microphone|saxophone|binocular|ice cream/i.test(support)) {
    title = pick.title;
  }
  if (/xylophone/i.test(titleLower) && !/xylophone/i.test(support)) {
    title = pick.title;
  }
  if (/\btoy item\b/i.test(titleLower) && inferObjectLabelFromSupport(args.visualSupportText)) {
    title = pick.title;
  }

  return cleanLabel(title) || pick.title;
}
