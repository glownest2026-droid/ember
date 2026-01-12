-- PL-2: Public Read Policies for Discovery Page
-- Date: 2026-01-05
-- Purpose: Enable public read access to active age bands, moments, and category types for published content

-- Add public SELECT for active age bands (needed to map age in months to age band)
DROP POLICY IF EXISTS "pl_age_bands_public_read_active" ON public.pl_age_bands;
CREATE POLICY "pl_age_bands_public_read_active" ON public.pl_age_bands
  FOR SELECT
  USING (is_active = true);

-- Add public SELECT for active moments (needed to show moment selector tabs)
DROP POLICY IF EXISTS "pl_moments_public_read_active" ON public.pl_moments;
CREATE POLICY "pl_moments_public_read_active" ON public.pl_moments
  FOR SELECT
  USING (is_active = true);

-- Add public SELECT for category types referenced by published cards
-- (needed to display category type names/labels on public discovery page)
DROP POLICY IF EXISTS "pl_category_types_public_read_published" ON public.pl_category_types;
CREATE POLICY "pl_category_types_public_read_published" ON public.pl_category_types
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pl_reco_cards
      INNER JOIN public.pl_age_moment_sets ON pl_reco_cards.set_id = pl_age_moment_sets.id
      WHERE pl_reco_cards.category_type_id = pl_category_types.id
      AND pl_age_moment_sets.status = 'published'
    )
  );

