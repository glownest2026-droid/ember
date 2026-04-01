-- PR3: Founder visibility for canonical dictionary + unmatched queue.
-- Keeps public/anon access unchanged and logs no-match terms without creating garage_items rows.

CREATE TABLE IF NOT EXISTS public.inventory_unmatched_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_query TEXT NOT NULL,
  normalized_query TEXT NOT NULL UNIQUE,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  times_seen INTEGER NOT NULL DEFAULT 1 CHECK (times_seen >= 1),
  latest_search_event_id UUID NULL REFERENCES public.inventory_search_events(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'resolved', 'ignored', 'duplicate')),
  proposed_product_type_id UUID NULL REFERENCES public.product_types(id) ON DELETE SET NULL,
  resolution_note TEXT NULL,
  resolved_at TIMESTAMPTZ NULL,
  child_scope_type public.inventory_child_scope_type NULL,
  child_id UUID NULL REFERENCES public.children(id) ON DELETE SET NULL,
  user_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS inventory_unmatched_queue_last_seen_idx
  ON public.inventory_unmatched_queue (last_seen_at DESC);
CREATE INDEX IF NOT EXISTS inventory_unmatched_queue_times_seen_idx
  ON public.inventory_unmatched_queue (times_seen DESC);
CREATE INDEX IF NOT EXISTS inventory_unmatched_queue_status_idx
  ON public.inventory_unmatched_queue (status, last_seen_at DESC);

DROP TRIGGER IF EXISTS inventory_unmatched_queue_updated_at ON public.inventory_unmatched_queue;
CREATE TRIGGER inventory_unmatched_queue_updated_at
  BEFORE UPDATE ON public.inventory_unmatched_queue
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.inventory_unmatched_queue ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.inventory_log_unmatched_query(
  p_raw_query TEXT,
  p_latest_search_event_id UUID DEFAULT NULL,
  p_child_scope_type public.inventory_child_scope_type DEFAULT NULL,
  p_child_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now TIMESTAMPTZ := now();
  v_uid UUID := auth.uid();
  v_normalized TEXT;
  v_row_id UUID;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  v_normalized := public.normalize_inventory_alias(p_raw_query);
  IF v_normalized = '' THEN
    RAISE EXCEPTION 'Query is empty after normalization';
  END IF;

  INSERT INTO public.inventory_unmatched_queue (
    raw_query,
    normalized_query,
    first_seen_at,
    last_seen_at,
    times_seen,
    latest_search_event_id,
    child_scope_type,
    child_id,
    user_id
  ) VALUES (
    p_raw_query,
    v_normalized,
    v_now,
    v_now,
    1,
    p_latest_search_event_id,
    p_child_scope_type,
    p_child_id,
    v_uid
  )
  ON CONFLICT (normalized_query) DO UPDATE
  SET
    raw_query = EXCLUDED.raw_query,
    last_seen_at = v_now,
    times_seen = inventory_unmatched_queue.times_seen + 1,
    latest_search_event_id = COALESCE(EXCLUDED.latest_search_event_id, inventory_unmatched_queue.latest_search_event_id),
    child_scope_type = COALESCE(EXCLUDED.child_scope_type, inventory_unmatched_queue.child_scope_type),
    child_id = COALESCE(EXCLUDED.child_id, inventory_unmatched_queue.child_id),
    user_id = COALESCE(EXCLUDED.user_id, inventory_unmatched_queue.user_id),
    updated_at = v_now
  RETURNING id INTO v_row_id;

  RETURN v_row_id;
END;
$$;

REVOKE ALL ON FUNCTION public.inventory_log_unmatched_query(TEXT, UUID, public.inventory_child_scope_type, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.inventory_log_unmatched_query(TEXT, UUID, public.inventory_child_scope_type, UUID) TO authenticated;

CREATE OR REPLACE VIEW public.v_inventory_dictionary_review AS
SELECT
  pt.id AS product_type_id,
  pt.slug,
  pt.label,
  pa.alias,
  pa.normalized_alias,
  CASE
    WHEN pa.normalized_alias = pt.normalized_label THEN 100
    ELSE 80
  END AS weight,
  CASE
    WHEN pt.is_active THEN 'active'
    ELSE 'inactive'
  END AS alias_status,
  pt.created_at,
  pt.updated_at
FROM public.product_types pt
LEFT JOIN public.product_type_aliases pa ON pa.product_type_id = pt.id;

CREATE OR REPLACE VIEW public.v_inventory_unmatched_review AS
SELECT
  uq.id,
  uq.raw_query,
  uq.normalized_query,
  uq.times_seen,
  uq.first_seen_at,
  uq.last_seen_at,
  uq.status,
  uq.child_scope_type,
  uq.child_id,
  uq.user_id,
  uq.latest_search_event_id,
  uq.proposed_product_type_id,
  pt.label AS proposed_product_type_label,
  uq.resolution_note,
  uq.resolved_at,
  uq.created_at,
  uq.updated_at
FROM public.inventory_unmatched_queue uq
LEFT JOIN public.product_types pt ON pt.id = uq.proposed_product_type_id;
