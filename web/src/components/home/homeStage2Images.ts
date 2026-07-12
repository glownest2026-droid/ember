/**
 * Homepage marketing imagery: Stage 2 category art from Supabase Storage.
 * Bucket: category_images (same source as Discover Stage 2 cards).
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') ?? '';
const CATEGORY_IMAGES = `${SUPABASE_URL}/storage/v1/object/public/category_images`;

function categoryImage(filename: string): string {
  return `${CATEGORY_IMAGES}/${encodeURIComponent(filename)}`;
}

/** Curated Stage 2 PNGs for homepage sections (HEAD-verified). */
export const HOME_STAGE2_IMAGES = {
  /** Hero: copy-me / playful turn-taking energy */
  hero: categoryImage('ember_cat_copy_me_games_category.png'),
  /** Stages block: graspable play across early months */
  stages: categoryImage('ember_cat_soft_graspable_balls_category.png'),
  /** How children grow: hide-and-find */
  grow: categoryImage('ember_cat_hide_find_cups_category.png'),
  /** Practising matters: stacking / fine motor */
  practising: categoryImage('ember_cat_stacking_nesting_cups_category.png'),
  /** Final CTA: shared books */
  finalCta: categoryImage('ember_cat_animal_books_category.png'),
} as const;
