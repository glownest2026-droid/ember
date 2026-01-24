/**
 * Autopilot v0: Deterministic scoring algorithm for product recommendations
 * 
 * Scores products based on:
 * - confidence_score_0_to_10 (0-10)
 * - quality_score_0_to_10 (0-10)
 * - anchor_closeness (calculated from age band midpoint)
 * - evidence_count and evidence_domain_count (bonus for publish-ready)
 */

export type AutopilotWeights = {
  confidence: number;
  quality: number;
  anchor: number;
};

export const DEFAULT_WEIGHTS: AutopilotWeights = {
  confidence: 0.45,
  quality: 0.45,
  anchor: 0.10,
};

export type ProductCandidate = {
  id: string;
  name: string;
  brand?: string;
  category_type_id?: string | null;
  category_type_slug?: string;
  confidence_score_0_to_10?: number | null;
  quality_score_0_to_10?: number | null;
  stage_anchor_month?: number | null; // Optional: from pl_product_fits
  evidence_count?: number;
  evidence_domain_count?: number;
  is_ready_for_publish?: boolean;
  why_it_matters?: string | null;
};

export type ScoredProduct = ProductCandidate & {
  score: number;
  scoreBreakdown: {
    confidence: number;
    quality: number;
    anchor: number;
    evidence: number;
  };
};

/**
 * Calculate anchor closeness score based on age band midpoint
 * Uses stage_anchor_month if available, otherwise returns neutral score
 */
function calculateAnchorScore(
  product: ProductCandidate,
  ageBandMidpoint: number
): number {
  // If stage_anchor_month exists, calculate distance-based score
  if (product.stage_anchor_month !== null && product.stage_anchor_month !== undefined) {
    const distance = Math.abs(product.stage_anchor_month - ageBandMidpoint);
    // Normalize: closer = higher score
    // Max distance we care about: 12 months (1 year)
    // Score = 1.0 when distance = 0, decreases linearly to 0.5 at 12 months
    const maxDistance = 12;
    const normalizedDistance = Math.min(distance, maxDistance) / maxDistance;
    return 1.0 - (normalizedDistance * 0.5); // Range: 1.0 (perfect match) to 0.5 (far away)
  }
  
  // Fallback: neutral score if no anchor month
  return 0.5;
}

/**
 * Calculate evidence bonus (small boost for publish-ready products)
 */
function calculateEvidenceBonus(product: ProductCandidate): number {
  if (product.is_ready_for_publish) {
    return 0.1; // Small bonus for publish-ready
  }
  if ((product.evidence_count || 0) >= 1) {
    return 0.05; // Smaller bonus for having evidence
  }
  return 0;
}

/**
 * Normalize a score from 0-10 to 0-1
 */
function normalizeScore(score: number | null | undefined, max: number = 10): number {
  if (score === null || score === undefined) return 0;
  return Math.max(0, Math.min(1, score / max));
}

/**
 * Score a single product candidate
 */
export function scoreProduct(
  product: ProductCandidate,
  weights: AutopilotWeights,
  ageBandMidpoint: number
): ScoredProduct {
  // Normalize scores to 0-1 range
  const confidenceNorm = normalizeScore(product.confidence_score_0_to_10, 10);
  const qualityNorm = normalizeScore(product.quality_score_0_to_10, 10);
  const anchorNorm = calculateAnchorScore(product, ageBandMidpoint);
  const evidenceBonus = calculateEvidenceBonus(product);

  // Calculate weighted components
  const confidenceComponent = confidenceNorm * weights.confidence;
  const qualityComponent = qualityNorm * weights.quality;
  const anchorComponent = anchorNorm * weights.anchor;

  // Total score (evidence bonus is additive, not weighted)
  const totalScore = confidenceComponent + qualityComponent + anchorComponent + evidenceBonus;

  return {
    ...product,
    score: totalScore,
    scoreBreakdown: {
      confidence: confidenceComponent,
      quality: qualityComponent,
      anchor: anchorComponent,
      evidence: evidenceBonus,
    },
  };
}

/**
 * Select 3 products for slots with category diversity
 */
export function selectProductsForSlots(
  candidates: ProductCandidate[],
  weights: AutopilotWeights,
  ageBandMidpoint: number,
  poolCategoryIds?: string[] // If pool exists, restrict to these categories
): {
  slot1: ScoredProduct | null;
  slot2: ScoredProduct | null;
  slot3: ScoredProduct | null;
  alternatives: ScoredProduct[];
} {
  // Filter candidates by pool if provided
  let eligibleCandidates = candidates;
  if (poolCategoryIds && poolCategoryIds.length > 0) {
    eligibleCandidates = candidates.filter(
      (p) => p.category_type_id && poolCategoryIds.includes(p.category_type_id)
    );
  }

  // Score all candidates
  const scored = eligibleCandidates.map((p) => scoreProduct(p, weights, ageBandMidpoint));

  // Sort by total score descending
  scored.sort((a, b) => b.score - a.score);

  // Select slot 1: prefer publish-ready, highest score
  const slot1Candidates = scored.filter((p) => p.is_ready_for_publish === true);
  const slot1 = slot1Candidates.length > 0 ? slot1Candidates[0] : scored[0] || null;

  // Select slot 2: different category from slot 1, prefer publish-ready
  const slot1CategoryId = slot1?.category_type_id;
  const slot2Candidates = scored.filter(
    (p) => p.id !== slot1?.id && p.category_type_id !== slot1CategoryId
  );
  const slot2PublishReady = slot2Candidates.filter((p) => p.is_ready_for_publish === true);
  const slot2 = slot2PublishReady.length > 0 ? slot2PublishReady[0] : slot2Candidates[0] || null;

  // Select slot 3: different category from slot 1 and 2
  const slot2CategoryId = slot2?.category_type_id;
  const slot3Candidates = scored.filter(
    (p) =>
      p.id !== slot1?.id &&
      p.id !== slot2?.id &&
      p.category_type_id !== slot1CategoryId &&
      p.category_type_id !== slot2CategoryId
  );
  const slot3 = slot3Candidates[0] || null;

  // Get top 3 alternatives (excluding selected ones)
  const selectedIds = new Set([slot1?.id, slot2?.id, slot3?.id].filter(Boolean));
  const alternatives = scored.filter((p) => !selectedIds.has(p.id)).slice(0, 3);

  return {
    slot1,
    slot2,
    slot3,
    alternatives,
  };
}

/**
 * Calculate age band midpoint for anchor scoring
 */
export function calculateAgeBandMidpoint(minMonths: number, maxMonths: number): number {
  return (minMonths + maxMonths) / 2;
}

