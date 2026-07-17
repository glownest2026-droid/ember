-- At home bridge (part 1): schema only. Enum value cannot be used until next migration commits.

ALTER TABLE public.garage_items
  ALTER COLUMN product_type_id DROP NOT NULL;

ALTER TABLE public.garage_items
  ADD COLUMN IF NOT EXISTS category_type_id UUID NULL REFERENCES public.pl_category_types(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS garage_items_category_type_id_idx
  ON public.garage_items (category_type_id)
  WHERE category_type_id IS NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'garage_items_identity_check'
      AND conrelid = 'public.garage_items'::regclass
  ) THEN
    ALTER TABLE public.garage_items
      ADD CONSTRAINT garage_items_identity_check
      CHECK (product_type_id IS NOT NULL OR category_type_id IS NOT NULL);
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS garage_items_user_child_category_active_uq
  ON public.garage_items (
    user_id,
    category_type_id,
    COALESCE(child_id, '00000000-0000-0000-0000-000000000000'::uuid)
  )
  WHERE category_type_id IS NOT NULL
    AND status IN ('owned', 'ready_to_move_on', 'listed');

DO $$
BEGIN
  ALTER TYPE public.inventory_item_source ADD VALUE IF NOT EXISTS 'discover_have';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
