import "server-only";

import type { GeminiListingAnalysisOutput } from "./ai-listing-analysis";
import {
  assessCanonicalMatch,
  resolveUserFacingLabelFromAnalysis,
  pickInternalCategoryLabel,
  buildVisualSupportText,
  isBroadCategoryTitle,
  inferObjectLabelFromSupport,
} from "./ai-listing-display-label";
import { formatProductTitleCase } from "./listing-title-format";

type ConfidenceBucket = "high" | "medium" | "low";

export type CanonicalCandidateCard = {
  id: string | null;
  label: string;
  user_facing_item_label: string;
  suggested_ai_label: string;
  /** Never shown to parents — internal taxonomy only. */
  catalog_match_label: null;
  internal_nearest_canonical: string | null;
  catalog_match_weak: boolean;
  internal_category_label: string | null;
  canonical_review_note: string | null;
  subtitle: string | null;
  reason: string;
  confidence_bucket: ConfidenceBucket;
  confidence_label: "Looks likely" | "Possible match" | "Not sure yet";
  source: "canonical_match" | "ai_suggestion";
};

function confidenceLabel(bucket: ConfidenceBucket): CanonicalCandidateCard["confidence_label"] {
  if (bucket === "high") return "Looks likely";
  if (bucket === "medium") return "Possible match";
  return "Not sure yet";
}

function confidenceFromNumber(value: number): ConfidenceBucket {
  if (value >= 0.8) return "high";
  if (value >= 0.45) return "medium";
  return "low";
}

function pickLowerConfidenceBucket(a: ConfidenceBucket, b: ConfidenceBucket): ConfidenceBucket {
  const rank: Record<ConfidenceBucket, number> = { low: 1, medium: 2, high: 3 };
  return rank[a] <= rank[b] ? a : b;
}

export async function buildCanonicalCandidates(
  supabase: Pick<import("@supabase/supabase-js").SupabaseClient, "rpc">,
  analysis: GeminiListingAnalysisOutput
): Promise<CanonicalCandidateCard[]> {
  const cards: CanonicalCandidateCard[] = [];
  const seenCanonicalIds = new Set<string>();
  const seenLabels = new Set<string>();

  const broadCategory = analysis.broad_category.trim();
  const aiCandidates = analysis.product_type_candidates.slice(0, 4);

  for (const aiCandidate of aiCandidates) {
    const userFacing = resolveUserFacingLabelFromAnalysis(analysis, aiCandidate);
    let productTitle = userFacing.title;
    if (isBroadCategoryTitle(productTitle)) {
      const support = buildVisualSupportText({
        userFacingItemLabel: analysis.user_facing_item_label,
        detectedItemLabel: analysis.detected_item_label,
        aiCandidateLabel: aiCandidate.label,
        visualDescription: analysis.visual_description,
        reason: aiCandidate.why,
        broadCategory: analysis.broad_category,
      });
      const inferred = inferObjectLabelFromSupport(support);
      if (inferred) productTitle = inferred;
    }
    productTitle = formatProductTitleCase(productTitle);
    const normalizedLabel = productTitle.trim().toLowerCase();
    if (!normalizedLabel || seenLabels.has(normalizedLabel)) continue;
    seenLabels.add(normalizedLabel);

    const searchTerms = Array.from(
      new Set(
        [
          ...analysis.canonical_search_terms,
          userFacing.suggestedAiLabel,
          aiCandidate.label,
          aiCandidate.slug_hint.replace(/_/g, " ").trim(),
        ]
          .map((entry) => entry.trim())
          .filter((entry) => entry.length > 0)
      )
    );

    let bestCanonical:
      | {
          id: string;
          label: string;
          subtitle: string | null;
          confidence_bucket: ConfidenceBucket;
        }
      | null = null;

    for (const searchTerm of searchTerms) {
      const { data } = await supabase.rpc("inventory_match_product_types", {
        query_text: searchTerm,
        p_limit: 1,
      });
      const topRow = Array.isArray(data) ? data[0] : null;
      if (!topRow?.id) continue;

      bestCanonical = {
        id: topRow.id as string,
        label: String(topRow.label ?? searchTerm),
        subtitle: topRow.subtitle ? String(topRow.subtitle) : null,
        confidence_bucket: (topRow.confidence_bucket as ConfidenceBucket) ?? "low",
      };
      break;
    }

    const reason =
      aiCandidate.why ||
      analysis.visual_description ||
      "Matched from photo analysis.";

    if (bestCanonical && !seenCanonicalIds.has(bestCanonical.id)) {
      seenCanonicalIds.add(bestCanonical.id);
      const aiBucket = confidenceFromNumber(aiCandidate.confidence);
      const mergedBucket = pickLowerConfidenceBucket(bestCanonical.confidence_bucket, aiBucket);
      const match = assessCanonicalMatch({
        canonicalLabel: bestCanonical.label,
        analysis,
        aiCandidateLabel: aiCandidate.label,
        reason,
        confidenceBucket: mergedBucket,
      });

      cards.push({
        id: bestCanonical.id,
        label: productTitle,
        user_facing_item_label: productTitle,
        suggested_ai_label: match.suggestedAiLabel,
        catalog_match_label: null,
        internal_nearest_canonical: match.isWeak ? bestCanonical.label : null,
        catalog_match_weak: match.isWeak,
        internal_category_label:
          match.internalCategoryLabel ??
          pickInternalCategoryLabel({
            broadCategory,
            supportText: buildVisualSupportText({
              userFacingItemLabel: userFacing.title,
              visualDescription: analysis.visual_description,
              reason,
            }),
            canonicalSubtitle: bestCanonical.subtitle,
          }),
        canonical_review_note: match.canonicalReviewNote,
        subtitle: match.internalCategoryLabel ?? bestCanonical.subtitle,
        reason,
        confidence_bucket: mergedBucket,
        confidence_label: confidenceLabel(mergedBucket),
        source: "canonical_match",
      });
      continue;
    }

    const internalCategory = pickInternalCategoryLabel({
      broadCategory,
      supportText: buildVisualSupportText({
        userFacingItemLabel: userFacing.title,
        visualDescription: analysis.visual_description,
        reason,
      }),
    });

    const noMatchNote = `Gemini suggested '${userFacing.suggestedAiLabel}'. No exact canonical match found. Consider adding canonical marketplace item type: ${userFacing.suggestedAiLabel.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.`;

    cards.push({
      id: null,
      label: productTitle,
      user_facing_item_label: productTitle,
      suggested_ai_label: userFacing.suggestedAiLabel,
      catalog_match_label: null,
      internal_nearest_canonical: null,
      catalog_match_weak: true,
      internal_category_label: internalCategory,
      canonical_review_note: noMatchNote,
      subtitle: internalCategory,
      reason,
      confidence_bucket: confidenceFromNumber(aiCandidate.confidence),
      confidence_label: confidenceLabel(confidenceFromNumber(aiCandidate.confidence)),
      source: "ai_suggestion",
    });
  }

  if (cards.length === 0) {
    const userFacing = resolveUserFacingLabelFromAnalysis(analysis);
    const fallbackTitle = formatProductTitleCase(userFacing.title);
    cards.push({
      id: null,
      label: fallbackTitle,
      user_facing_item_label: fallbackTitle,
      suggested_ai_label: userFacing.suggestedAiLabel,
      catalog_match_label: null,
      internal_nearest_canonical: null,
      catalog_match_weak: true,
      internal_category_label: pickInternalCategoryLabel({
        broadCategory,
        supportText: analysis.visual_description || analysis.detected_item_label,
      }),
      canonical_review_note: null,
      subtitle: broadCategory || null,
      reason: analysis.visual_description || "We are not yet confident about the exact catalog match.",
      confidence_bucket: analysis.confidence_bucket,
      confidence_label: confidenceLabel(analysis.confidence_bucket),
      source: "ai_suggestion",
    });
  }

  return cards.slice(0, 4);
}
