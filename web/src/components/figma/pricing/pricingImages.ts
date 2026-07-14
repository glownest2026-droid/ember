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
  catalogue: categoryImage('ember_pricing_journey_free_discover_category.png'),
  pathway: categoryImage('ember_cat_stacking_nesting_cups_category.png'),
  picks: categoryImage('ember_cat_first_puzzles_category.png'),
  proximity: categoryImage('ember_pricing_journey_patch_walkers_category.png'),
  seasons: categoryImage('ember_pricing_journey_seasons_christmas_category.png'),
  moments: categoryImage('ember_pricing_journey_chapters_nursery_category.png'),
  moveOn: categoryImage('ember_pricing_journey_pass_on_white_noise_category.png'),
} as const;
