-- PR6: Beta marketplace publish, opportunity snapshots, and buyer interest.

ALTER TABLE public.marketplace_listings
  DROP CONSTRAINT IF EXISTS marketplace_listings_status_check;

ALTER TABLE public.marketplace_listings
  ADD COLUMN IF NOT EXISTS source_draft_id UUID NULL REFERENCES public.marketplace_listing_drafts(id) ON DELETE RESTRICT,
  ADD COLUMN IF NOT EXISTS title TEXT NULL,
  ADD COLUMN IF NOT EXISTS description TEXT NULL,
  ADD COLUMN IF NOT EXISTS item_label TEXT NULL,
  ADD COLUMN IF NOT EXISTS category_label TEXT NULL,
  ADD COLUMN IF NOT EXISTS price_low NUMERIC NULL,
  ADD COLUMN IF NOT EXISTS price_high NUMERIC NULL,
  ADD COLUMN IF NOT EXISTS price_currency TEXT NOT NULL DEFAULT 'GBP',
  ADD COLUMN IF NOT EXISTS price_confidence TEXT NULL,
  ADD COLUMN IF NOT EXISTS price_source_type TEXT NULL,
  ADD COLUMN IF NOT EXISTS price_guidance_json JSONB NULL,
  ADD COLUMN IF NOT EXISTS approximate_area_label TEXT NULL,
  ADD COLUMN IF NOT EXISTS approximate_lat NUMERIC NULL,
  ADD COLUMN IF NOT EXISTS approximate_lng NUMERIC NULL,
  ADD COLUMN IF NOT EXISTS image_storage_path TEXT NULL,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS paused_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS removed_at TIMESTAMPTZ NULL;

ALTER TABLE public.marketplace_listings
  ADD CONSTRAINT marketplace_listings_status_check
  CHECK (
    status IN (
      'draft',
      'submitted',
      'archived',
      'published_beta',
      'paused',
      'sold_or_moved_on',
      'removed'
    )
  );

CREATE UNIQUE INDEX IF NOT EXISTS marketplace_listings_source_draft_published_beta_idx
  ON public.marketplace_listings (source_draft_id)
  WHERE source_draft_id IS NOT NULL AND status = 'published_beta';

CREATE INDEX IF NOT EXISTS marketplace_listings_published_beta_idx
  ON public.marketplace_listings (status, published_at DESC)
  WHERE status = 'published_beta';

COMMENT ON COLUMN public.marketplace_listings.source_draft_id IS 'PR6: private AI draft this beta listing was published from.';
COMMENT ON COLUMN public.marketplace_listings.image_storage_path IS 'PR6: private raw draft photo path; never public bucket.';

CREATE TABLE IF NOT EXISTS public.marketplace_listing_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  buyer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'interested'
    CHECK (status IN ('interested', 'withdrawn', 'seller_acknowledged')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (listing_id, buyer_user_id)
);

CREATE INDEX IF NOT EXISTS marketplace_listing_interests_listing_id_idx
  ON public.marketplace_listing_interests (listing_id);
CREATE INDEX IF NOT EXISTS marketplace_listing_interests_seller_user_id_idx
  ON public.marketplace_listing_interests (seller_user_id);

CREATE TABLE IF NOT EXISTS public.marketplace_opportunity_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID NULL REFERENCES public.marketplace_listing_drafts(id) ON DELETE CASCADE,
  listing_id UUID NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_label TEXT NULL,
  category_label TEXT NULL,
  price_low NUMERIC NULL,
  price_high NUMERIC NULL,
  price_currency TEXT NOT NULL DEFAULT 'GBP',
  price_confidence TEXT NULL,
  price_source_type TEXT NULL,
  price_guidance_json JSONB NULL,
  local_radius_miles INTEGER NOT NULL DEFAULT 5,
  approximate_area_label TEXT NULL,
  soft_stage_match_count INTEGER NOT NULL DEFAULT 0,
  behavioural_interest_count INTEGER NOT NULL DEFAULT 0,
  explicit_interest_count INTEGER NOT NULL DEFAULT 0,
  total_may_be_interested_count INTEGER NOT NULL DEFAULT 0,
  demand_confidence TEXT NULL,
  demand_breakdown_json JSONB NULL,
  map_summary_json JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS marketplace_opportunity_snapshots_draft_id_idx
  ON public.marketplace_opportunity_snapshots (draft_id, created_at DESC);
CREATE INDEX IF NOT EXISTS marketplace_opportunity_snapshots_user_id_idx
  ON public.marketplace_opportunity_snapshots (user_id, created_at DESC);

DROP TRIGGER IF EXISTS marketplace_listing_interests_updated_at ON public.marketplace_listing_interests;
CREATE TRIGGER marketplace_listing_interests_updated_at
  BEFORE UPDATE ON public.marketplace_listing_interests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.marketplace_listing_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_opportunity_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "marketplace_listings_select_published_beta" ON public.marketplace_listings;
CREATE POLICY "marketplace_listings_select_published_beta" ON public.marketplace_listings
  FOR SELECT TO authenticated
  USING (
    status = 'published_beta'
    AND removed_at IS NULL
    AND paused_at IS NULL
  );

DROP POLICY IF EXISTS "marketplace_listing_interests_select_participant" ON public.marketplace_listing_interests;
CREATE POLICY "marketplace_listing_interests_select_participant" ON public.marketplace_listing_interests
  FOR SELECT TO authenticated
  USING (buyer_user_id = auth.uid() OR seller_user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_listing_interests_insert_buyer" ON public.marketplace_listing_interests;
CREATE POLICY "marketplace_listing_interests_insert_buyer" ON public.marketplace_listing_interests
  FOR INSERT TO authenticated
  WITH CHECK (buyer_user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_listing_interests_update_buyer" ON public.marketplace_listing_interests;
CREATE POLICY "marketplace_listing_interests_update_buyer" ON public.marketplace_listing_interests
  FOR UPDATE TO authenticated
  USING (buyer_user_id = auth.uid())
  WITH CHECK (buyer_user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_opportunity_snapshots_select_own" ON public.marketplace_opportunity_snapshots;
CREATE POLICY "marketplace_opportunity_snapshots_select_own" ON public.marketplace_opportunity_snapshots
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_opportunity_snapshots_insert_own" ON public.marketplace_opportunity_snapshots;
CREATE POLICY "marketplace_opportunity_snapshots_insert_own" ON public.marketplace_opportunity_snapshots
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_opportunity_snapshots_update_own" ON public.marketplace_opportunity_snapshots;
CREATE POLICY "marketplace_opportunity_snapshots_update_own" ON public.marketplace_opportunity_snapshots
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
