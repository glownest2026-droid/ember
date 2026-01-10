import { createClient } from '../../utils/supabase/server';

/**
 * Map age in months to the best matching active age band.
 * Returns the age band ID if found, or null if no match.
 * 
 * @param ageMonths - Age in months
 * @returns Age band object or null
 */
export async function getAgeBandForAge(ageMonths: number) {
  const supabase = createClient();

  // Find age bands where min_months <= ageMonths <= max_months
  const { data, error } = await supabase
    .from('pl_age_bands')
    .select('id, min_months, max_months, label')
    .eq('is_active', true)
    .lte('min_months', ageMonths)
    .gte('max_months', ageMonths)
    .order('min_months', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Fetch active moments that have at least one published set for a given age band.
 * Server-side only. Returns only active moments with published content.
 * 
 * @param ageBandId - The age band ID
 * @returns Array of moments with published sets, or empty array
 */
export async function getActiveMomentsForAgeBand(ageBandId: string) {
  const supabase = createClient();

  // First get all published sets for this age band
  const { data: sets, error: setsError } = await supabase
    .from('pl_age_moment_sets')
    .select('moment_id')
    .eq('age_band_id', ageBandId)
    .eq('status', 'published');

  if (setsError || !sets || sets.length === 0) {
    return [];
  }

  // Get unique moment IDs that have published sets
  const momentIds = [...new Set(sets.map(s => s.moment_id))];

  // Fetch the moments
  const { data: moments, error: momentsError } = await supabase
    .from('pl_moments')
    .select('id, label, description')
    .eq('is_active', true)
    .in('id', momentIds)
    .order('label', { ascending: true });

  if (momentsError) {
    return [];
  }

  return moments || [];
}

/**
 * Fetch published sets, cards, and evidence for an age band.
 * Server-side only. Returns only status='published' sets (in addition to RLS).
 * Includes category type and product display text.
 * 
 * @param ageBandId - The age band ID to fetch sets for
 * @returns Published sets with their cards, evidence, and display text, or null if error
 */
export async function getPublishedSetsForAgeBand(ageBandId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('pl_age_moment_sets')
    .select(`
      id,
      age_band_id,
      moment_id,
      status,
      headline,
      published_at,
      created_at,
      updated_at,
      pl_reco_cards (
        id,
        set_id,
        lane,
        rank,
        category_type_id,
        product_id,
        because,
        why_tags,
        created_at,
        updated_at,
        pl_category_types:category_type_id (
          id,
          name,
          label,
          slug
        ),
        products:product_id (
          id,
          name
        ),
        pl_evidence (
          id,
          card_id,
          source_type,
          url,
          quote_snippet,
          captured_at,
          confidence,
          created_at,
          updated_at
        )
      )
    `)
    .eq('age_band_id', ageBandId)
    .eq('status', 'published') // Explicit filter for published only
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching published sets:', error);
    return null;
  }

  return data || [];
}

/**
 * Parse age band slug like "24-30-months" to {min: 24, max: 30}.
 * Returns null if parsing fails.
 */
export function parseAgeBandSlug(slug: string): { min: number; max: number } | null {
  const match = slug.match(/^(\d+)-(\d+)-months$/);
  if (!match) {
    return null;
  }
  const min = parseInt(match[1], 10);
  const max = parseInt(match[2], 10);
  if (isNaN(min) || isNaN(max) || min >= max) {
    return null;
  }
  return { min, max };
}

/**
 * Find age band by min_months and max_months.
 * Returns the age band if found, or null.
 */
export async function getAgeBandByRange(minMonths: number, maxMonths: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('pl_age_bands')
    .select('id, min_months, max_months, label')
    .eq('is_active', true)
    .eq('min_months', minMonths)
    .eq('max_months', maxMonths)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Fetch a single published set for a specific age band and moment.
 * Returns the set with cards, or null if not found or error.
 * Used for the /new landing page to show top 3 picks.
 * 
 * @param ageBandId - The age band ID
 * @param momentId - The moment ID
 * @returns Published set with cards, or null
 */
export async function getPublishedSetForAgeBandAndMoment(
  ageBandId: string,
  momentId: string
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('pl_age_moment_sets')
    .select(`
      id,
      age_band_id,
      moment_id,
      status,
      headline,
      published_at,
      created_at,
      updated_at,
      pl_reco_cards (
        id,
        set_id,
        lane,
        rank,
        category_type_id,
        product_id,
        because,
        why_tags,
        created_at,
        updated_at,
        pl_category_types:category_type_id (
          id,
          name,
          label,
          slug
        ),
        products:product_id (
          id,
          name
        )
      )
    `)
    .eq('age_band_id', ageBandId)
    .eq('moment_id', momentId)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  // Sort cards by rank (obvious, nearby, surprise)
  if (data.pl_reco_cards) {
    data.pl_reco_cards.sort((a, b) => a.rank - b.rank);
  }

  return data;
}

