-- Inventory spine + ranked match API (exact + FTS + trigram), with owner-scoped owned items.
-- Source truth rule: bootstrap from existing marketplace_item_types only (no fabricated rows).

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE OR REPLACE FUNCTION public.normalize_inventory_alias(input_text TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    TRIM(
      regexp_replace(
        regexp_replace(lower(COALESCE(input_text, '')), '[^a-z0-9]+', ' ', 'g'),
        '\s+',
        ' ',
        'g'
      )
    );
$$;

-- Canonical product-type vocabulary for inventory matching.
CREATE TABLE IF NOT EXISTS public.product_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  subtitle TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  normalized_label TEXT GENERATED ALWAYS AS (public.normalize_inventory_alias(label)) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS product_types_active_idx ON public.product_types (is_active);
CREATE INDEX IF NOT EXISTS product_types_slug_idx ON public.product_types (slug);
CREATE INDEX IF NOT EXISTS product_types_label_trgm_idx
  ON public.product_types USING gin (normalized_label gin_trgm_ops);
CREATE INDEX IF NOT EXISTS product_types_fts_idx
  ON public.product_types USING gin (to_tsvector('simple', COALESCE(label, '')));

DROP TRIGGER IF EXISTS product_types_updated_at ON public.product_types;
CREATE TRIGGER product_types_updated_at
  BEFORE UPDATE ON public.product_types
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.product_type_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_type_id UUID NOT NULL REFERENCES public.product_types(id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  normalized_alias TEXT GENERATED ALWAYS AS (public.normalize_inventory_alias(alias)) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_type_id, normalized_alias)
);

CREATE UNIQUE INDEX IF NOT EXISTS product_type_aliases_normalized_alias_uq
  ON public.product_type_aliases (normalized_alias);
CREATE INDEX IF NOT EXISTS product_type_aliases_trgm_idx
  ON public.product_type_aliases USING gin (normalized_alias gin_trgm_ops);
CREATE INDEX IF NOT EXISTS product_type_aliases_fts_idx
  ON public.product_type_aliases USING gin (to_tsvector('simple', COALESCE(alias, '')));

-- Bootstrap from existing canonical-ish marketplace item types (if present).
INSERT INTO public.product_types (slug, label, subtitle)
SELECT m.slug, m.canonical_name, m.category_hint
FROM public.marketplace_item_types m
ON CONFLICT (slug) DO UPDATE
SET
  label = EXCLUDED.label,
  subtitle = EXCLUDED.subtitle,
  is_active = true;

INSERT INTO public.product_type_aliases (product_type_id, alias)
SELECT pt.id, src.alias
FROM (
  SELECT m.slug, m.canonical_name AS alias
  FROM public.marketplace_item_types m
  UNION ALL
  SELECT m.slug, unnest(m.synonyms) AS alias
  FROM public.marketplace_item_types m
) src
JOIN public.product_types pt ON pt.slug = src.slug
WHERE public.normalize_inventory_alias(src.alias) <> ''
ON CONFLICT (product_type_id, normalized_alias) DO NOTHING;

DO $$ BEGIN
  CREATE TYPE public.inventory_child_scope_type AS ENUM ('single_child', 'shared', 'unknown');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.inventory_item_source AS ENUM ('manual_match', 'manual_unmatched', 'photo_assisted', 'admin_import');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.inventory_item_status AS ENUM ('owned', 'ready_to_move_on', 'listed', 'sold', 'archived');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Durable owned-item table (Garage-equivalent source of truth).
CREATE TABLE IF NOT EXISTS public.garage_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  household_id UUID NULL,
  product_type_id UUID NOT NULL REFERENCES public.product_types(id) ON DELETE RESTRICT,
  product_id UUID NULL REFERENCES public.products(id) ON DELETE SET NULL,
  child_scope_type public.inventory_child_scope_type NOT NULL DEFAULT 'unknown',
  child_id UUID NULL REFERENCES public.children(id) ON DELETE SET NULL,
  condition TEXT,
  notes TEXT,
  raw_query TEXT,
  source public.inventory_item_source NOT NULL DEFAULT 'manual_match',
  status public.inventory_item_status NOT NULL DEFAULT 'owned',
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS garage_items_user_id_idx ON public.garage_items (user_id);
CREATE INDEX IF NOT EXISTS garage_items_product_type_id_idx ON public.garage_items (product_type_id);
CREATE INDEX IF NOT EXISTS garage_items_status_idx ON public.garage_items (status);
CREATE INDEX IF NOT EXISTS garage_items_child_id_idx ON public.garage_items (child_id);

DROP TRIGGER IF EXISTS garage_items_updated_at ON public.garage_items;
CREATE TRIGGER garage_items_updated_at
  BEFORE UPDATE ON public.garage_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.inventory_search_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  raw_query TEXT NOT NULL,
  selected_product_type_id UUID NULL REFERENCES public.product_types(id) ON DELETE SET NULL,
  confidence_bucket TEXT NULL CHECK (confidence_bucket IN ('high', 'medium', 'low')),
  was_confirmed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS inventory_search_events_user_id_idx ON public.inventory_search_events (user_id, created_at DESC);

ALTER TABLE public.product_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_type_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garage_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_search_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "product_types_select_authenticated" ON public.product_types;
CREATE POLICY "product_types_select_authenticated" ON public.product_types
  FOR SELECT TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "product_type_aliases_select_authenticated" ON public.product_type_aliases;
CREATE POLICY "product_type_aliases_select_authenticated" ON public.product_type_aliases
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.product_types pt
      WHERE pt.id = product_type_aliases.product_type_id
        AND pt.is_active = true
    )
  );

DROP POLICY IF EXISTS "garage_items_select_own" ON public.garage_items;
CREATE POLICY "garage_items_select_own" ON public.garage_items
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "garage_items_insert_own" ON public.garage_items;
CREATE POLICY "garage_items_insert_own" ON public.garage_items
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND (
      child_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.children c
        WHERE c.id = child_id AND c.user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "garage_items_update_own" ON public.garage_items;
CREATE POLICY "garage_items_update_own" ON public.garage_items
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND (
      child_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.children c
        WHERE c.id = child_id AND c.user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "garage_items_delete_own" ON public.garage_items;
CREATE POLICY "garage_items_delete_own" ON public.garage_items
  FOR DELETE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "inventory_search_events_insert_own" ON public.inventory_search_events;
CREATE POLICY "inventory_search_events_insert_own" ON public.inventory_search_events
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "inventory_search_events_select_own" ON public.inventory_search_events;
CREATE POLICY "inventory_search_events_select_own" ON public.inventory_search_events
  FOR SELECT USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.inventory_match_product_types(
  query_text TEXT,
  p_limit INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  label TEXT,
  subtitle TEXT,
  confidence_bucket TEXT,
  score NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  WITH q AS (
    SELECT public.normalize_inventory_alias(TRIM(COALESCE(query_text, ''))) AS normalized_query
  ),
  ranked AS (
    SELECT
      pt.id,
      pt.slug,
      pt.label,
      pt.subtitle,
      (
        CASE
          WHEN pt.normalized_label = q.normalized_query THEN 100
          WHEN EXISTS (
            SELECT 1
            FROM public.product_type_aliases pa
            WHERE pa.product_type_id = pt.id
              AND pa.normalized_alias = q.normalized_query
          ) THEN 95
          ELSE 0
        END
      )
      + (
        20 * GREATEST(
          ts_rank_cd(
            to_tsvector('simple', pt.label),
            plainto_tsquery('simple', q.normalized_query)
          ),
          COALESCE((
            SELECT MAX(ts_rank_cd(
              to_tsvector('simple', pa.alias),
              plainto_tsquery('simple', q.normalized_query)
            ))
            FROM public.product_type_aliases pa
            WHERE pa.product_type_id = pt.id
          ), 0)
        )
      )
      + (
        10 * GREATEST(
          similarity(pt.normalized_label, q.normalized_query),
          COALESCE((
            SELECT MAX(similarity(pa.normalized_alias, q.normalized_query))
            FROM public.product_type_aliases pa
            WHERE pa.product_type_id = pt.id
          ), 0)
        )
      ) AS score
    FROM public.product_types pt
    CROSS JOIN q
    WHERE pt.is_active = true
      AND q.normalized_query <> ''
      AND (
        pt.normalized_label = q.normalized_query
        OR EXISTS (
          SELECT 1 FROM public.product_type_aliases pa
          WHERE pa.product_type_id = pt.id
            AND pa.normalized_alias = q.normalized_query
        )
        OR to_tsvector('simple', pt.label) @@ plainto_tsquery('simple', q.normalized_query)
        OR EXISTS (
          SELECT 1 FROM public.product_type_aliases pa
          WHERE pa.product_type_id = pt.id
            AND to_tsvector('simple', pa.alias) @@ plainto_tsquery('simple', q.normalized_query)
        )
        OR similarity(pt.normalized_label, q.normalized_query) > 0.15
        OR EXISTS (
          SELECT 1 FROM public.product_type_aliases pa
          WHERE pa.product_type_id = pt.id
            AND similarity(pa.normalized_alias, q.normalized_query) > 0.15
        )
      )
  )
  SELECT
    r.id,
    r.slug,
    r.label,
    r.subtitle,
    CASE
      WHEN r.score >= 95 THEN 'high'
      WHEN r.score >= 45 THEN 'medium'
      ELSE 'low'
    END AS confidence_bucket,
    ROUND(r.score::numeric, 4) AS score
  FROM ranked r
  ORDER BY r.score DESC, r.label ASC
  LIMIT GREATEST(1, LEAST(COALESCE(NULLIF(p_limit, 0), 5), 20));
$$;

GRANT EXECUTE ON FUNCTION public.inventory_match_product_types(TEXT, INT) TO authenticated;
