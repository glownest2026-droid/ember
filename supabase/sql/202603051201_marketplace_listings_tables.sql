-- Marketplace: listings, listing photos, and user preferences tables.
-- Pre-launch backend (A.3, A.4). Idempotent.

-- Listings (pre-launch): user_id, optional child_id, raw text, selected/normalized item type, condition, status, location
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NULL REFERENCES public.children(id) ON DELETE SET NULL,
  raw_item_text TEXT,
  selected_item_type_id UUID NULL REFERENCES public.marketplace_item_types(id) ON DELETE SET NULL,
  normalized_item_type_id UUID NULL REFERENCES public.marketplace_item_types(id) ON DELETE SET NULL,
  normalization_confidence NUMERIC(3,2),
  condition TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'archived')),
  postcode TEXT,
  radius_miles NUMERIC(4,1) NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS marketplace_listings_user_id_idx ON public.marketplace_listings(user_id);
CREATE INDEX IF NOT EXISTS marketplace_listings_status_idx ON public.marketplace_listings(status);

COMMENT ON TABLE public.marketplace_listings IS 'Pre-launch marketplace listings; RLS restricts to owner.';

-- Listing photos: storage path and sort order
CREATE TABLE IF NOT EXISTS public.marketplace_listing_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS marketplace_listing_photos_listing_id_idx ON public.marketplace_listing_photos(listing_id);

COMMENT ON TABLE public.marketplace_listing_photos IS 'Photos for a listing; paths under storage bucket marketplace-listing-photos.';

-- User preferences: postcode, radius (lat/lng optional for later)
CREATE TABLE IF NOT EXISTS public.marketplace_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  postcode TEXT,
  lat NUMERIC(9,6),
  lng NUMERIC(9,6),
  radius_miles NUMERIC(4,1) NOT NULL DEFAULT 5,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.marketplace_preferences IS 'Per-user marketplace prefs; one row per user, RLS owner-only.';

-- updated_at triggers
DROP TRIGGER IF EXISTS marketplace_listings_updated_at ON public.marketplace_listings;
CREATE TRIGGER marketplace_listings_updated_at
  BEFORE UPDATE ON public.marketplace_listings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS marketplace_preferences_updated_at ON public.marketplace_preferences;
CREATE TRIGGER marketplace_preferences_updated_at
  BEFORE UPDATE ON public.marketplace_preferences
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
