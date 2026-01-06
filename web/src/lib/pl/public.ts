import { createClient } from '../../utils/supabase/server';

/**
 * Fetch published sets, cards, and evidence for an age band.
 * Server-side only. Returns only status='published' sets (in addition to RLS).
 * 
 * @param ageBandId - The age band ID to fetch sets for
 * @returns Published sets with their cards and evidence, or null if error
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

