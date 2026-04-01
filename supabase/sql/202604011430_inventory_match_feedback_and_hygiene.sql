-- PR5: Match-quality feedback capture + targeted dictionary hygiene audit.
-- Scope:
--   A) Capture "bad candidates" + "wrong saved match" feedback with full auditability.
--   B) Founder review view over feedback queue.
--   C) Targeted hygiene decisions for obvious duplicate clusters (merge/keep/defer recorded deterministically).

DO $$ BEGIN
  CREATE TYPE public.inventory_match_feedback_type AS ENUM ('bad_candidates', 'wrong_match', 'other');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.inventory_match_feedback_status AS ENUM ('new', 'reviewing', 'resolved', 'ignored');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.inventory_hygiene_decision AS ENUM ('merge', 'keep_separate', 'defer');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.inventory_match_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_event_id UUID NULL REFERENCES public.inventory_search_events(id) ON DELETE SET NULL,
  garage_item_id UUID NULL REFERENCES public.garage_items(id) ON DELETE SET NULL,
  user_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  raw_query TEXT NULL,
  selected_product_type_id UUID NULL REFERENCES public.product_types(id) ON DELETE SET NULL,
  feedback_type public.inventory_match_feedback_type NOT NULL,
  comment TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ NULL,
  resolution_note TEXT NULL,
  status public.inventory_match_feedback_status NOT NULL DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS inventory_match_feedback_created_at_idx
  ON public.inventory_match_feedback (created_at DESC);
CREATE INDEX IF NOT EXISTS inventory_match_feedback_status_idx
  ON public.inventory_match_feedback (status, created_at DESC);
CREATE INDEX IF NOT EXISTS inventory_match_feedback_type_idx
  ON public.inventory_match_feedback (feedback_type, created_at DESC);

ALTER TABLE public.inventory_match_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "inventory_match_feedback_insert_own" ON public.inventory_match_feedback;
CREATE POLICY "inventory_match_feedback_insert_own" ON public.inventory_match_feedback
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "inventory_match_feedback_select_own" ON public.inventory_match_feedback;
CREATE POLICY "inventory_match_feedback_select_own" ON public.inventory_match_feedback
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.inventory_capture_match_feedback(
  p_feedback_type public.inventory_match_feedback_type,
  p_search_event_id UUID DEFAULT NULL,
  p_garage_item_id UUID DEFAULT NULL,
  p_raw_query TEXT DEFAULT NULL,
  p_selected_product_type_id UUID DEFAULT NULL,
  p_comment TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_row_id UUID;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  INSERT INTO public.inventory_match_feedback (
    search_event_id,
    garage_item_id,
    user_id,
    raw_query,
    selected_product_type_id,
    feedback_type,
    comment
  )
  VALUES (
    p_search_event_id,
    p_garage_item_id,
    v_uid,
    NULLIF(TRIM(COALESCE(p_raw_query, '')), ''),
    p_selected_product_type_id,
    p_feedback_type,
    NULLIF(TRIM(COALESCE(p_comment, '')), '')
  )
  RETURNING id INTO v_row_id;

  RETURN v_row_id;
END;
$$;

REVOKE ALL ON FUNCTION public.inventory_capture_match_feedback(
  public.inventory_match_feedback_type,
  UUID,
  UUID,
  TEXT,
  UUID,
  TEXT
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.inventory_capture_match_feedback(
  public.inventory_match_feedback_type,
  UUID,
  UUID,
  TEXT,
  UUID,
  TEXT
) TO authenticated;

CREATE OR REPLACE VIEW public.v_inventory_match_feedback_review AS
SELECT
  f.id,
  f.feedback_type,
  f.status,
  f.created_at,
  f.resolved_at,
  f.resolution_note,
  f.user_id,
  f.search_event_id,
  f.garage_item_id,
  COALESCE(f.raw_query, se.raw_query) AS raw_query,
  f.selected_product_type_id,
  pt.slug AS selected_product_type_slug,
  pt.label AS selected_product_type_label,
  f.comment
FROM public.inventory_match_feedback f
LEFT JOIN public.inventory_search_events se ON se.id = f.search_event_id
LEFT JOIN public.product_types pt ON pt.id = f.selected_product_type_id;

-- Targeted hygiene audit table for deterministic decisions.
CREATE TABLE IF NOT EXISTS public.inventory_dictionary_hygiene_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_key TEXT NOT NULL UNIQUE,
  member_slugs TEXT[] NOT NULL,
  decision public.inventory_hygiene_decision NOT NULL,
  rationale TEXT NOT NULL,
  applied_by_pr TEXT NOT NULL,
  decided_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS inventory_dictionary_hygiene_decisions_decided_at_idx
  ON public.inventory_dictionary_hygiene_decisions (decided_at DESC);

INSERT INTO public.inventory_dictionary_hygiene_decisions (
  cluster_key,
  member_slugs,
  decision,
  rationale,
  applied_by_pr
) VALUES
  (
    'baby-monitor_cluster',
    ARRAY['baby-monitor', 'video-monitor', 'baby-monitor-camera'],
    'keep_separate',
    'Keep separate: audio monitor, video monitor, and camera-led monitor are distinct hardware categories for parents.',
    'PR5'
  ),
  (
    'changing-table_cluster',
    ARRAY['changing-table', 'changing-unit'],
    'keep_separate',
    'Keep separate: changing unit implies integrated storage furniture, while changing table can be simpler stand-alone form.',
    'PR5'
  ),
  (
    'cot-crib_cluster',
    ARRAY['cot', 'crib', 'bedside-crib'],
    'keep_separate',
    'Keep separate: bedside crib is a specific co-sleeping-adjacent format and should remain distinct from general cot/crib.',
    'PR5'
  )
ON CONFLICT (cluster_key) DO UPDATE
SET
  member_slugs = EXCLUDED.member_slugs,
  decision = EXCLUDED.decision,
  rationale = EXCLUDED.rationale,
  applied_by_pr = EXCLUDED.applied_by_pr,
  decided_at = now();

CREATE OR REPLACE VIEW public.v_inventory_dictionary_hygiene_review AS
SELECT
  d.id,
  d.cluster_key,
  d.member_slugs,
  d.decision,
  d.rationale,
  d.applied_by_pr,
  d.decided_at
FROM public.inventory_dictionary_hygiene_decisions d
ORDER BY d.decided_at DESC;
