/**
 * Homepage marketing imagery: Stage 2 category art from Supabase Storage.
 * Bucket: category_images (same source as Discover Stage 2 cards).
 *
 * Curation rule: no repeat of the same adult model on one scroll — the orange-sweater
 * parent appears in several catalogue slugs; we pick distinct families/scenes instead.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') ?? '';
const CATEGORY_IMAGES = `${SUPABASE_URL}/storage/v1/object/public/category_images`;

function categoryImage(filename: string): string {
  return `${CATEGORY_IMAGES}/${encodeURIComponent(filename)}`;
}

/** Curated Stage 2 PNGs for homepage sections (HEAD-verified). */
export const HOME_STAGE2_IMAGES = {
  /** Hero: father + dough play (distinct from catalogue orange-sweater set) */
  hero: categoryImage('ember_cat_soft_dough_and_simple_tools_category.png'),
  /** Stages block: father + low-shelf tidy */
  stages: categoryImage('ember_cat_low_shelf_tidy_category.png'),
  /** How children grow: hide-and-squeak */
  grow: categoryImage('ember_cat_hide_squeak_toys_category.png'),
  /** Practising matters: stacking cups (different family) */
  practising: categoryImage('ember_cat_stacking_nesting_cups_category.png'),
  /** Final CTA: mealtime setup (different adult + context) */
  finalCta: categoryImage('ember_cat_choking_aware_meal_setup_category.png'),
} as const;
