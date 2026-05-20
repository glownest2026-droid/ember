import "server-only";

const BROAD_CANONICAL_LABELS = [
  "musical toy",
  "toy",
  "pretend play",
  "general",
  "toy box",
  "storage box",
  "nursery furniture",
  "furniture",
  "box",
  "container",
];

const GENERIC_LABEL_PATTERN =
  /\b(item|toy item|product|confirmed item|second-hand item|unknown|general)\b/i;

export function cleanLabel(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function isBroadCanonicalLabel(label: string): boolean {
  const lower = cleanLabel(label).toLowerCase();
  if (!lower) return true;
  return BROAD_CANONICAL_LABELS.some((token) => lower.includes(token));
}

export function isSpecificVisualLabel(label: string): boolean {
  const trimmed = cleanLabel(label);
  if (!trimmed || GENERIC_LABEL_PATTERN.test(trimmed)) return false;
  if (isBroadCanonicalLabel(trimmed)) return false;
  return trimmed.length >= 4;
}

export function canonicalLabelMatchesVisual(args: {
  canonicalLabel: string;
  visualLabel: string;
  reason?: string;
}): boolean {
  const canonical = cleanLabel(args.canonicalLabel).toLowerCase();
  const visual = cleanLabel(args.visualLabel).toLowerCase();
  const reason = cleanLabel(args.reason ?? "").toLowerCase();
  if (!canonical || !visual) return true;
  if (isBroadCanonicalLabel(canonical)) return false;

  const canonicalTokens = canonical.split(/\s+/).filter((token) => token.length > 3);
  if (canonicalTokens.length === 0) return true;

  return canonicalTokens.some(
    (token) => visual.includes(token) || reason.includes(token) || visual.includes(canonical)
  );
}

export function pickUserFacingDisplayLabel(args: {
  visualLabel: string;
  aiCandidateLabel?: string;
  canonicalCatalogLabel?: string;
  categoryLabel?: string;
  reason?: string;
}): string {
  const visual = cleanLabel(args.visualLabel || args.aiCandidateLabel || "");
  const aiLabel = cleanLabel(args.aiCandidateLabel || args.visualLabel || "");
  const canonical = cleanLabel(args.canonicalCatalogLabel || "");
  const category = cleanLabel(args.categoryLabel || "");

  if (isSpecificVisualLabel(visual)) {
    if (!canonical || canonicalLabelMatchesVisual({ canonicalLabel: canonical, visualLabel: visual, reason: args.reason })) {
      return visual;
    }
    return visual;
  }

  if (isSpecificVisualLabel(aiLabel) && !isBroadCanonicalLabel(aiLabel)) {
    if (!canonical || !canonicalLabelMatchesVisual({ canonicalLabel: canonical, visualLabel: aiLabel, reason: args.reason })) {
      return aiLabel;
    }
    return aiLabel;
  }

  if (/binocular/i.test(visual) || /binocular/i.test(aiLabel) || /binocular/i.test(args.reason ?? "")) {
    return "Toy binoculars";
  }

  if (/music|musical/i.test(category)) return "Musical toy";
  if (isSpecificVisualLabel(canonical) && canonicalLabelMatchesVisual({ canonicalLabel: canonical, visualLabel: visual || aiLabel, reason: args.reason })) {
    return canonical;
  }

  return category || "Toy item";
}

export function pickTitleFromContext(args: {
  suggestedTitle: string;
  visualLabel: string;
  canonicalLabel: string;
  categoryLabel: string;
  visualSupportText: string;
}): string {
  const visual = cleanLabel(args.visualLabel);
  const canonical = cleanLabel(args.canonicalLabel);
  const category = cleanLabel(args.categoryLabel);
  const support = `${args.visualSupportText} ${visual} ${canonical}`.toLowerCase();

  let title = cleanLabel(args.suggestedTitle);
  const visualFirst = pickUserFacingDisplayLabel({
    visualLabel: visual,
    canonicalCatalogLabel: canonical,
    categoryLabel: category,
  });

  if (!title || isBroadCanonicalLabel(title) || !canonicalLabelMatchesVisual({ canonicalLabel: title, visualLabel: visual, reason: support })) {
    title = visualFirst;
  }

  if (/xylophone/i.test(title) && /binocular/i.test(support)) {
    return "Toy binoculars";
  }
  if (/xylophone/i.test(title) && !/xylophone/i.test(support)) {
    title = visualFirst;
  }
  if (/binocular/i.test(support) && !/binocular/i.test(title.toLowerCase())) {
    return "Toy binoculars";
  }
  if (/\btoy box\b/i.test(title) && /binocular/i.test(support)) {
    return "Toy binoculars";
  }

  if (isBroadCanonicalLabel(title) || !isSpecificVisualLabel(title)) {
    title = visualFirst;
  }

  return title || visualFirst || "Toy item";
}
