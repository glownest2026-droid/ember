import "server-only";

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
  "xylophone",
];

const BROAD_CATEGORY_TITLE_BLOCKLIST = [
  "pretend play",
  "toys",
  "toy",
  "general",
  "unknown",
  "musical toy",
  "pretend",
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

export function isSpecificVisualLabel(label: string): boolean {
  const trimmed = cleanLabel(label);
  if (!trimmed || GENERIC_LABEL_PATTERN.test(trimmed)) return false;
  if (isBroadCanonicalLabel(trimmed)) return false;
  if (isBroadCategoryTitle(trimmed)) return false;
  return trimmed.length >= 4;
}

export function buildVisualSupportText(args: {
  detectedItemLabel?: string;
  aiCandidateLabel?: string;
  reason?: string;
  broadCategory?: string;
}): string {
  return [
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

  if (/microphone|karaoke|sing[- ]?along|singing toy|voice toy/i.test(support)) {
    if (/microphone/i.test(support)) return "Toy microphone";
    return "Musical toy microphone";
  }
  if (/saxophone/i.test(support)) return "Saxophone-style musical toy";
  if (/trumpet/i.test(support) && !/xylophone/i.test(support)) return "Toy trumpet";
  if (/binocular/i.test(support)) return "Toy binoculars";
  if (/doctor kit|toy doctor|medical kit|stethoscope|syringe toy/i.test(support)) {
    return "Toy doctor kit";
  }
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
  const support = buildVisualSupportText({ broadCategory: args.broadCategory, reason: args.supportText });
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
  if (/microphone/i.test(support) && /xylophone/i.test(canon)) return true;
  if (/doctor|stethoscope|medical kit/i.test(support) && /xylophone|musical toy/i.test(canon) && !/doctor/i.test(canon)) {
    return false;
  }

  return false;
}

export function canonicalLabelMatchesVisual(args: {
  canonicalLabel: string;
  visualLabel: string;
  reason?: string;
}): boolean {
  const canonical = cleanLabel(args.canonicalLabel).toLowerCase();
  const visual = cleanLabel(args.visualLabel).toLowerCase();
  const reason = cleanLabel(args.reason ?? "").toLowerCase();
  const support = `${visual} ${reason}`;
  if (!canonical || !support.trim()) return true;
  if (isBroadCanonicalLabel(canonical)) return false;
  if (canonicalContradictsVisual({ canonicalLabel: canonical, supportText: support })) return false;

  const canonicalTokens = canonical.split(/\s+/).filter((token) => token.length > 3);
  if (canonicalTokens.length === 0) return true;

  return canonicalTokens.some(
    (token) => visual.includes(token) || reason.includes(token) || visual.includes(canonical)
  );
}

export function isWeakCanonicalMatch(args: {
  canonicalLabel: string;
  suggestedAiLabel: string;
  reason: string;
  broadCategory: string;
}): boolean {
  const canonical = cleanLabel(args.canonicalLabel);
  if (!canonical) return true;

  const support = buildVisualSupportText({
    detectedItemLabel: args.suggestedAiLabel,
    reason: args.reason,
    broadCategory: args.broadCategory,
  });

  if (isBroadCanonicalLabel(canonical)) return true;
  if (canonicalContradictsVisual({ canonicalLabel: canonical, supportText: support })) return true;
  if (
    !canonicalLabelMatchesVisual({
      canonicalLabel: canonical,
      visualLabel: args.suggestedAiLabel,
      reason: args.reason,
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
  broadCategory?: string;
}): string | null {
  const visual = cleanLabel(args.suggestedAiLabel);
  const canonical = cleanLabel(args.nearestCanonicalMatch ?? "");
  if (!visual || !canonical) return null;
  if (
    !isWeakCanonicalMatch({
      canonicalLabel: canonical,
      suggestedAiLabel: visual,
      reason: args.reason ?? visual,
      broadCategory: args.broadCategory ?? "",
    })
  ) {
    return null;
  }
  const slugHint = visual.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  const confidence = args.matchConfidence ? ` (${args.matchConfidence})` : "";
  return `Gemini suggested ${visual}. Nearest canonical match was ${canonical}${confidence}, but this appears inconsistent. Consider adding canonical marketplace item type: ${slugHint}.`;
}

export function assessCanonicalMatch(args: {
  canonicalLabel: string | null;
  detectedItemLabel: string;
  aiCandidateLabel: string;
  reason: string;
  broadCategory: string;
  confidenceBucket?: string | null;
}): CanonicalMatchAssessment {
  const titlePick = pickCandidateCardTitle({
    detectedItemLabel: args.detectedItemLabel,
    aiCandidateLabel: args.aiCandidateLabel,
    reason: args.reason,
    broadCategory: args.broadCategory,
  });
  const canonical = cleanLabel(args.canonicalLabel ?? "");
  const isWeak =
    !canonical ||
    isWeakCanonicalMatch({
      canonicalLabel: canonical,
      suggestedAiLabel: titlePick.suggestedAiLabel,
      reason: args.reason,
      broadCategory: args.broadCategory,
    });

  const internalCategoryLabel = pickInternalCategoryLabel({
    broadCategory: args.broadCategory,
    supportText: buildVisualSupportText({
      detectedItemLabel: args.detectedItemLabel,
      aiCandidateLabel: args.aiCandidateLabel,
      reason: args.reason,
    }),
  });

  return {
    isWeak,
    suggestedAiLabel: titlePick.suggestedAiLabel,
    nearestCanonicalMatch: canonical || null,
    internalCategoryLabel,
    canonicalReviewNote: isWeak
      ? buildCanonicalReviewNote({
          suggestedAiLabel: titlePick.suggestedAiLabel,
          nearestCanonicalMatch: canonical,
          matchConfidence: args.confidenceBucket ?? null,
        })
      : null,
  };
}

/** User-facing candidate card title — never broad_category or weak canonical alone. */
export function pickCandidateCardTitle(args: {
  detectedItemLabel: string;
  aiCandidateLabel: string;
  reason: string;
  broadCategory: string;
}): CandidateTitlePick {
  const detected = cleanLabel(args.detectedItemLabel);
  const ai = cleanLabel(args.aiCandidateLabel);
  const reason = cleanLabel(args.reason);
  const support = buildVisualSupportText({
    detectedItemLabel: detected,
    aiCandidateLabel: ai,
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

  if (/music|musical|microphone|instrument|singing|karaoke/i.test(support)) {
    return { title: "Musical toy", suggestedAiLabel: detected || ai || "Musical toy" };
  }
  if (/doctor|medical|stethoscope/i.test(support)) {
    return { title: "Toy doctor kit", suggestedAiLabel: detected || ai || "Toy doctor kit" };
  }

  return { title: "Toy item", suggestedAiLabel: detected || ai || "Toy item" };
}

export function pickUserFacingDisplayLabel(args: {
  visualLabel: string;
  aiCandidateLabel?: string;
  canonicalCatalogLabel?: string;
  categoryLabel?: string;
  reason?: string;
}): string {
  const pick = pickCandidateCardTitle({
    detectedItemLabel: args.visualLabel,
    aiCandidateLabel: args.aiCandidateLabel ?? "",
    reason: args.reason ?? "",
    broadCategory: args.categoryLabel ?? "",
  });

  const canonical = cleanLabel(args.canonicalCatalogLabel ?? "");
  if (
    canonical &&
    !isWeakCanonicalMatch({
      canonicalLabel: canonical,
      suggestedAiLabel: pick.suggestedAiLabel,
      reason: args.reason ?? "",
      broadCategory: args.categoryLabel ?? "",
    }) &&
    isSpecificVisualLabel(canonical) &&
    canonicalLabelMatchesVisual({
      canonicalLabel: canonical,
      visualLabel: pick.suggestedAiLabel,
      reason: args.reason,
    })
  ) {
    return pick.title;
  }

  return pick.title;
}

export function pickTitleFromContext(args: {
  suggestedTitle: string;
  visualLabel: string;
  canonicalLabel: string;
  categoryLabel: string;
  visualSupportText: string;
}): string {
  const support = args.visualSupportText;
  const pick = pickCandidateCardTitle({
    detectedItemLabel: args.visualLabel,
    aiCandidateLabel: args.visualLabel,
    reason: support,
    broadCategory: args.categoryLabel,
  });

  let title = cleanLabel(args.suggestedTitle);
  const titleLower = title.toLowerCase();

  if (!title || isBroadCanonicalLabel(title) || isBroadCategoryTitle(title)) {
    title = pick.title;
  }

  if (canonicalContradictsVisual({ canonicalLabel: title, supportText: support })) {
    title = pick.title;
  }
  if (/xylophone/i.test(titleLower) && /microphone|saxophone|binocular/i.test(support.toLowerCase())) {
    title = pick.title;
  }
  if (/xylophone/i.test(titleLower) && !/xylophone/i.test(support.toLowerCase())) {
    title = pick.title;
  }
  if (isBroadCategoryTitle(title)) {
    title = pick.title;
  }

  const visualFirst = pickUserFacingDisplayLabel({
    visualLabel: args.visualLabel,
    canonicalCatalogLabel: args.canonicalLabel,
    categoryLabel: args.categoryLabel,
    reason: support,
  });

  if (!canonicalLabelMatchesVisual({ canonicalLabel: title, visualLabel: args.visualLabel, reason: support })) {
    title = visualFirst;
  }

  return cleanLabel(title) || visualFirst || pick.title || "Toy item";
}
