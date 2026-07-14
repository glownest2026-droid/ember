/**
 * Pricing / Pip journey Stage 2 imagery from Supabase category_images.
 * Prefer distinct scenes (same curation rule as homepage).
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') ?? '';
const CATEGORY_IMAGES = `${SUPABASE_URL}/storage/v1/object/public/category_images`;

function categoryImage(filename: string): string {
  return `${CATEGORY_IMAGES}/${encodeURIComponent(filename)}`;
}

export const PIP_LOGO_URL =
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/brand-assets/logos/Ember_Logo_Robin1.png';

export const PRICING_JOURNEY_IMAGES = {
  catalogue: categoryImage('ember_cat_low_shelf_tidy_category.png'),
  pathway: categoryImage('ember_cat_stacking_nesting_cups_category.png'),
  picks: categoryImage('ember_cat_first_puzzles_category.png'),
  proximity: categoryImage('ember_cat_balance_paths_and_stepping_stones_category.png'),
  seasons: categoryImage('ember_cat_out_and_about_kit_category.png'),
  moments: categoryImage('ember_cat_transition_basket_category.png'),
  moveOn: categoryImage('ember_cat_tip_out_baskets_category.png'),
} as const;
