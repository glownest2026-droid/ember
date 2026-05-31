/**
 * Discover-aligned Stage 1 development wrapper cards (single source for Marketplace 2.0).
 * Labels and slugs mirror marketplace-taxonomy.ts / Discover.
 */

import {
  STAGE1_WRAPPER_LABELS,
  STAGE1_WRAPPER_SLUGS,
  type Stage1WrapperSlug,
} from "@/lib/marketplace/marketplace-taxonomy";

export { STAGE1_WRAPPER_SLUGS, STAGE1_WRAPPER_LABELS, type Stage1WrapperSlug };

export type DevelopmentWrapperCard = {
  stage1_wrapper_ux_slug: Stage1WrapperSlug;
  stage1_wrapper_ux_label: string;
  rank: number;
};

/** Fixed Discover order (1–7). */
export const DEVELOPMENT_WRAPPER_CARDS: DevelopmentWrapperCard[] = STAGE1_WRAPPER_SLUGS.map(
  (slug, index) => ({
    stage1_wrapper_ux_slug: slug,
    stage1_wrapper_ux_label: STAGE1_WRAPPER_LABELS[slug],
    rank: index + 1,
  })
);

export function getDevelopmentWrapper(slug: string | null | undefined): DevelopmentWrapperCard | null {
  if (!slug) return null;
  return DEVELOPMENT_WRAPPER_CARDS.find((c) => c.stage1_wrapper_ux_slug === slug) ?? null;
}
