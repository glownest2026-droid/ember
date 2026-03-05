-- Marketplace: private storage bucket for listing photos (C).
-- Path pattern: {user_id}/{listing_id}/{filename}. RLS: auth only; owner access by path.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'marketplace-listing-photos',
  'marketplace-listing-photos',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS: INSERT only into paths where first folder = auth.uid()
DROP POLICY IF EXISTS "marketplace_listing_photos_insert_own_path" ON storage.objects;
CREATE POLICY "marketplace_listing_photos_insert_own_path"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'marketplace-listing-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- SELECT: only when first folder (user_id) matches auth.uid()
DROP POLICY IF EXISTS "marketplace_listing_photos_select_own_path" ON storage.objects;
CREATE POLICY "marketplace_listing_photos_select_own_path"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'marketplace-listing-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE: only owner (path user_id = auth.uid())
DROP POLICY IF EXISTS "marketplace_listing_photos_delete_own_path" ON storage.objects;
CREATE POLICY "marketplace_listing_photos_delete_own_path"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'marketplace-listing-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
