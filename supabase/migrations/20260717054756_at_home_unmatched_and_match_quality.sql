-- At home accepts an owned item before catalogue classification.
-- Marketplace listing still requires product confirmation in its own flow.

ALTER TABLE public.garage_items
  DROP CONSTRAINT IF EXISTS garage_items_identity_check;

ALTER TABLE public.garage_items
  ADD CONSTRAINT garage_items_identity_check
  CHECK (
    product_type_id IS NOT NULL
    OR category_type_id IS NOT NULL
    OR NULLIF(BTRIM(raw_query), '') IS NOT NULL
  );

COMMENT ON CONSTRAINT garage_items_identity_check ON public.garage_items IS
  'At home items may start from parent-entered text; catalogue classification can happen before Marketplace listing.';
