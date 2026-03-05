-- Marketplace: RLS on new tables. Least-privilege, auth only (B).

-- marketplace_item_types: read-only for authenticated (lookup for suggestions)
ALTER TABLE public.marketplace_item_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "marketplace_item_types_select_authenticated" ON public.marketplace_item_types;
CREATE POLICY "marketplace_item_types_select_authenticated" ON public.marketplace_item_types
  FOR SELECT TO authenticated USING (is_active = true);

-- marketplace_listings: user can select/insert/update/delete only their rows
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "marketplace_listings_select_own" ON public.marketplace_listings;
CREATE POLICY "marketplace_listings_select_own" ON public.marketplace_listings
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_listings_insert_own" ON public.marketplace_listings;
CREATE POLICY "marketplace_listings_insert_own" ON public.marketplace_listings
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_listings_update_own" ON public.marketplace_listings;
CREATE POLICY "marketplace_listings_update_own" ON public.marketplace_listings
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_listings_delete_own" ON public.marketplace_listings;
CREATE POLICY "marketplace_listings_delete_own" ON public.marketplace_listings
  FOR DELETE USING (user_id = auth.uid());

-- marketplace_listing_photos: select/insert/delete only if user owns parent listing (no update needed)
ALTER TABLE public.marketplace_listing_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "marketplace_listing_photos_select_own_listing" ON public.marketplace_listing_photos;
CREATE POLICY "marketplace_listing_photos_select_own_listing" ON public.marketplace_listing_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.marketplace_listings ml
      WHERE ml.id = marketplace_listing_photos.listing_id AND ml.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "marketplace_listing_photos_insert_own_listing" ON public.marketplace_listing_photos;
CREATE POLICY "marketplace_listing_photos_insert_own_listing" ON public.marketplace_listing_photos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.marketplace_listings ml
      WHERE ml.id = marketplace_listing_photos.listing_id AND ml.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "marketplace_listing_photos_delete_own_listing" ON public.marketplace_listing_photos;
CREATE POLICY "marketplace_listing_photos_delete_own_listing" ON public.marketplace_listing_photos
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.marketplace_listings ml
      WHERE ml.id = marketplace_listing_photos.listing_id AND ml.user_id = auth.uid()
    )
  );

-- marketplace_preferences: user can select/insert/update only their row (no delete required)
ALTER TABLE public.marketplace_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "marketplace_preferences_select_own" ON public.marketplace_preferences;
CREATE POLICY "marketplace_preferences_select_own" ON public.marketplace_preferences
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_preferences_insert_own" ON public.marketplace_preferences;
CREATE POLICY "marketplace_preferences_insert_own" ON public.marketplace_preferences
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_preferences_update_own" ON public.marketplace_preferences;
CREATE POLICY "marketplace_preferences_update_own" ON public.marketplace_preferences
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
