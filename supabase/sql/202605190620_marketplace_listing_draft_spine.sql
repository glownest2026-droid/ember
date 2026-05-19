-- PR1: AI Marketplace Listing draft spine (private notepad only).
-- Adds owner-scoped draft storage, audit-event spine, and private raw-photo bucket.

CREATE TABLE IF NOT EXISTS public.marketplace_listing_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  household_item_id UUID NULL REFERENCES public.garage_items(id) ON DELETE SET NULL,
  product_type_id UUID NULL REFERENCES public.product_types(id) ON DELETE SET NULL,
  image_storage_path TEXT NULL,
  ai_detected_label TEXT NULL,
  ai_confidence NUMERIC NULL,
  ai_raw_response_json JSONB NULL,
  title_draft TEXT NULL,
  description_draft TEXT NULL,
  condition_suggestion TEXT NULL,
  condition_confirmed_by_user TEXT NULL,
  price_low NUMERIC NULL,
  price_high NUMERIC NULL,
  price_source TEXT NULL,
  local_match_count INTEGER NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'published', 'abandoned', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS marketplace_listing_drafts_user_id_idx
  ON public.marketplace_listing_drafts (user_id);
CREATE INDEX IF NOT EXISTS marketplace_listing_drafts_status_idx
  ON public.marketplace_listing_drafts (status);
CREATE INDEX IF NOT EXISTS marketplace_listing_drafts_product_type_id_idx
  ON public.marketplace_listing_drafts (product_type_id);

COMMENT ON TABLE public.marketplace_listing_drafts IS 'Owner-private draft listing spine before any publish flow.';

CREATE TABLE IF NOT EXISTS public.ai_listing_analysis_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  draft_id UUID NULL REFERENCES public.marketplace_listing_drafts(id) ON DELETE SET NULL,
  model_used TEXT NULL,
  input_image_path TEXT NULL,
  token_usage JSONB NULL,
  vision_features_used JSONB NULL,
  cost_estimate NUMERIC NULL,
  success BOOLEAN NULL,
  error_message TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ai_listing_analysis_events_user_id_created_at_idx
  ON public.ai_listing_analysis_events (user_id, created_at DESC);

COMMENT ON TABLE public.ai_listing_analysis_events IS 'Future audit spine for AI listing analysis usage and outcomes.';

DROP TRIGGER IF EXISTS marketplace_listing_drafts_updated_at ON public.marketplace_listing_drafts;
CREATE TRIGGER marketplace_listing_drafts_updated_at
  BEFORE UPDATE ON public.marketplace_listing_drafts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.marketplace_listing_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_listing_analysis_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "marketplace_listing_drafts_select_own" ON public.marketplace_listing_drafts;
CREATE POLICY "marketplace_listing_drafts_select_own" ON public.marketplace_listing_drafts
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_listing_drafts_insert_own" ON public.marketplace_listing_drafts;
CREATE POLICY "marketplace_listing_drafts_insert_own" ON public.marketplace_listing_drafts
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_listing_drafts_update_own" ON public.marketplace_listing_drafts;
CREATE POLICY "marketplace_listing_drafts_update_own" ON public.marketplace_listing_drafts
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_listing_drafts_delete_own" ON public.marketplace_listing_drafts;
CREATE POLICY "marketplace_listing_drafts_delete_own" ON public.marketplace_listing_drafts
  FOR DELETE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "ai_listing_analysis_events_select_own" ON public.ai_listing_analysis_events;
CREATE POLICY "ai_listing_analysis_events_select_own" ON public.ai_listing_analysis_events
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "ai_listing_analysis_events_insert_own" ON public.ai_listing_analysis_events;
CREATE POLICY "ai_listing_analysis_events_insert_own" ON public.ai_listing_analysis_events
  FOR INSERT WITH CHECK (user_id = auth.uid());

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'marketplace-raw-listing-photos',
  'marketplace-raw-listing-photos',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "marketplace_raw_listing_photos_insert_own_path" ON storage.objects;
CREATE POLICY "marketplace_raw_listing_photos_insert_own_path"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'marketplace-raw-listing-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "marketplace_raw_listing_photos_select_own_path" ON storage.objects;
CREATE POLICY "marketplace_raw_listing_photos_select_own_path"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'marketplace-raw-listing-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
