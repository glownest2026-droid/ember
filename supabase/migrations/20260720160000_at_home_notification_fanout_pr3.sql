-- PR3: Patch Finds + Pass-On notification fan-out (queue + eligibility in data).
-- Plan: web/docs/INVENTORY_MATCHING_PLAN.md

-- =============================================================================
-- A. Haversine helper (miles)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.haversine_miles(
  lat1 DOUBLE PRECISION,
  lon1 DOUBLE PRECISION,
  lat2 DOUBLE PRECISION,
  lon2 DOUBLE PRECISION
)
RETURNS DOUBLE PRECISION
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
AS $$
  SELECT CASE
    WHEN lat1 IS NULL OR lon1 IS NULL OR lat2 IS NULL OR lon2 IS NULL THEN NULL
    ELSE 3958.8 * 2 * asin(sqrt(
      power(sin(radians(lat2 - lat1) / 2), 2) +
      cos(radians(lat1)) * cos(radians(lat2)) *
      power(sin(radians(lon2 - lon1) / 2), 2)
    ))
  END;
$$;

-- =============================================================================
-- B. Notification event queue (deduped)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.inventory_notification_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_type TEXT NOT NULL
    CHECK (notification_type IN ('patch_find', 'pass_on_demand', 'pass_on_encourage')),
  recipient_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NULL REFERENCES public.children(id) ON DELETE SET NULL,
  listing_id UUID NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  garage_item_id UUID NULL REFERENCES public.garage_items(id) ON DELETE CASCADE,
  product_type_id UUID NULL REFERENCES public.product_types(id) ON DELETE SET NULL,
  category_type_id UUID NULL REFERENCES public.pl_category_types(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  deep_link TEXT NULL,
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'sent', 'skipped', 'failed')),
  skip_reason TEXT NULL,
  onesignal_notification_id TEXT NULL,
  dedupe_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ NULL,
  CONSTRAINT inventory_notification_events_dedupe_uq UNIQUE (dedupe_key)
);

CREATE INDEX IF NOT EXISTS inventory_notification_events_status_idx
  ON public.inventory_notification_events (status, created_at)
  WHERE status = 'queued';

CREATE INDEX IF NOT EXISTS inventory_notification_events_recipient_idx
  ON public.inventory_notification_events (recipient_user_id, created_at DESC);

COMMENT ON TABLE public.inventory_notification_events IS
  'Queued Patch Finds / Pass-On notifications. Processed by app worker; deduped per listing/item/recipient.';

ALTER TABLE public.inventory_notification_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "inventory_notification_events_select_own"
  ON public.inventory_notification_events;
CREATE POLICY "inventory_notification_events_select_own"
  ON public.inventory_notification_events
  FOR SELECT TO authenticated
  USING (recipient_user_id = auth.uid());

-- =============================================================================
-- C. Reminder topic: patch_finds
-- =============================================================================
ALTER TABLE public.user_reminder_topic_prefs
  DROP CONSTRAINT IF EXISTS user_reminder_topic_prefs_topic_key_check;

ALTER TABLE public.user_reminder_topic_prefs
  ADD CONSTRAINT user_reminder_topic_prefs_topic_key_check CHECK (
    topic_key IN ('monthly_stage_updates', 'move_it_on_prompts', 'patch_finds')
  );

-- =============================================================================
-- D. Ownership / Have exclusion helper
-- =============================================================================
CREATE OR REPLACE FUNCTION public.buyer_already_has_item_type(
  p_buyer_user_id UUID,
  p_product_type_id UUID,
  p_child_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH pt AS (
    SELECT id, family_slug FROM public.product_types WHERE id = p_product_type_id
  ),
  relevance_categories AS (
    SELECT r.category_type_id
    FROM public.item_type_stage2_relevance r
    WHERE r.product_type_id = p_product_type_id
      AND r.is_active = true
  )
  SELECT EXISTS (
    SELECT 1
    FROM public.garage_items gi
    JOIN public.product_types gpt ON gpt.id = gi.product_type_id
    CROSS JOIN pt
    WHERE gi.user_id = p_buyer_user_id
      AND gi.status IN ('owned', 'ready_to_move_on', 'listed')
      AND (
        gi.product_type_id = p_product_type_id
        OR (
          pt.family_slug IS NOT NULL
          AND gpt.family_slug = pt.family_slug
        )
        OR gi.category_type_id IN (SELECT category_type_id FROM relevance_categories)
      )
      AND (
        p_child_id IS NULL
        OR gi.child_id IS NULL
        OR gi.child_id = p_child_id
      )
  )
  OR EXISTS (
    SELECT 1
    FROM public.user_saved_ideas usi
    WHERE usi.user_id = p_buyer_user_id
      AND usi.idea_id IN (SELECT category_type_id FROM relevance_categories)
  );
$$;

REVOKE ALL ON FUNCTION public.buyer_already_has_item_type(UUID, UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.buyer_already_has_item_type(UUID, UUID, UUID) TO authenticated, service_role;

-- =============================================================================
-- E. Queue Patch Finds when a listing publishes
-- =============================================================================
CREATE OR REPLACE FUNCTION public.queue_patch_finds_for_listing(p_listing_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_listing RECORD;
  v_product_type_id UUID;
  v_family_slug TEXT;
  v_item_label TEXT;
  v_queued INTEGER := 0;
  v_row_count INTEGER;
  v_row RECORD;
  v_child_months INTEGER;
  v_category_id UUID;
  v_dedupe TEXT;
BEGIN
  SELECT
    ml.id,
    ml.user_id AS seller_user_id,
    ml.item_label,
    ml.title,
    ml.approximate_lat,
    ml.approximate_lng,
    ml.radius_miles,
    mld.product_type_id
  INTO v_listing
  FROM public.marketplace_listings ml
  LEFT JOIN public.marketplace_listing_drafts mld ON mld.id = ml.source_draft_id
  WHERE ml.id = p_listing_id
    AND ml.status = 'published_beta';

  IF v_listing.id IS NULL THEN
    RETURN 0;
  END IF;

  v_product_type_id := v_listing.product_type_id;
  IF v_product_type_id IS NULL THEN
    RETURN 0;
  END IF;

  SELECT pt.family_slug INTO v_family_slug
  FROM public.product_types pt
  WHERE pt.id = v_product_type_id;

  v_item_label := COALESCE(NULLIF(trim(v_listing.item_label), ''), NULLIF(trim(v_listing.title), ''), 'A toy');

  FOR v_row IN
    SELECT DISTINCT
      mp.user_id AS buyer_user_id,
      c.id AS child_id,
      c.birthdate
    FROM public.marketplace_preferences mp
    JOIN public.children c
      ON c.user_id = mp.user_id
     AND (c.is_suppressed = false OR c.is_suppressed IS NULL)
    WHERE mp.user_id <> v_listing.seller_user_id
      AND mp.lat IS NOT NULL
      AND mp.lng IS NOT NULL
      AND v_listing.approximate_lat IS NOT NULL
      AND v_listing.approximate_lng IS NOT NULL
      AND public.haversine_miles(
        v_listing.approximate_lat::double precision,
        v_listing.approximate_lng::double precision,
        mp.lat::double precision,
        mp.lng::double precision
      ) <= COALESCE(v_listing.radius_miles, mp.radius_miles, 5)
  LOOP
    IF public.buyer_already_has_item_type(v_row.buyer_user_id, v_product_type_id, v_row.child_id) THEN
      CONTINUE;
    END IF;

    v_child_months := public.child_age_months(v_row.child_id);
    IF v_child_months IS NULL THEN
      CONTINUE;
    END IF;

    SELECT r.category_type_id
    INTO v_category_id
    FROM public.resolve_at_home_stage2_category(
      v_product_type_id,
      v_row.child_id,
      NULL,
      NULL
    ) r
    LIMIT 1;

    IF v_category_id IS NULL THEN
      CONTINUE;
    END IF;

    v_dedupe := 'patch_find:' || p_listing_id::text || ':' || v_row.buyer_user_id::text || ':' || v_row.child_id::text;

    INSERT INTO public.inventory_notification_events (
      notification_type,
      recipient_user_id,
      child_id,
      listing_id,
      product_type_id,
      category_type_id,
      title,
      body,
      deep_link,
      dedupe_key
    )
    VALUES (
      'patch_find',
      v_row.buyer_user_id,
      v_row.child_id,
      p_listing_id,
      v_product_type_id,
      v_category_id,
      'Pip''s Patch Finds',
      'A ' || v_item_label || ' listed nearby may suit your child now.',
      '/marketplace',
      v_dedupe
    )
    ON CONFLICT (dedupe_key) DO NOTHING;

    GET DIAGNOSTICS v_row_count = ROW_COUNT;
    IF v_row_count > 0 THEN
      v_queued := v_queued + 1;
    END IF;
  END LOOP;

  RETURN v_queued;
END;
$$;

REVOKE ALL ON FUNCTION public.queue_patch_finds_for_listing(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.queue_patch_finds_for_listing(UUID) TO authenticated, service_role;

-- =============================================================================
-- F. Queue Pass-On prompts (ready_to_move_on items)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.queue_pass_on_prompts(p_limit INTEGER DEFAULT 40)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_queued INTEGER := 0;
  v_row_count INTEGER;
  v_item RECORD;
  v_demand_count INTEGER;
  v_label TEXT;
  v_dedupe TEXT;
  v_type TEXT;
  v_body TEXT;
BEGIN
  FOR v_item IN
    SELECT
      gi.id,
      gi.user_id,
      gi.product_type_id,
      gi.raw_query,
      pt.label AS type_label,
      mp.lat,
      mp.lng,
      mp.radius_miles
    FROM public.garage_items gi
    JOIN public.product_types pt ON pt.id = gi.product_type_id
    LEFT JOIN public.marketplace_preferences mp ON mp.user_id = gi.user_id
    WHERE gi.status = 'ready_to_move_on'
      AND gi.product_type_id IS NOT NULL
    ORDER BY gi.updated_at DESC
    LIMIT GREATEST(COALESCE(p_limit, 40), 1)
  LOOP
    IF EXISTS (
      SELECT 1 FROM public.marketplace_listings ml
      JOIN public.marketplace_listing_drafts mld ON mld.id = ml.source_draft_id
      WHERE ml.user_id = v_item.user_id
        AND ml.status = 'published_beta'
        AND mld.product_type_id = v_item.product_type_id
    ) THEN
      CONTINUE;
    END IF;

    v_demand_count := 0;
    IF v_item.lat IS NOT NULL AND v_item.lng IS NOT NULL THEN
      SELECT COUNT(DISTINCT c.user_id)::INTEGER
      INTO v_demand_count
      FROM public.children c
      JOIN public.marketplace_preferences mp ON mp.user_id = c.user_id
      WHERE c.user_id <> v_item.user_id
        AND (c.is_suppressed = false OR c.is_suppressed IS NULL)
        AND mp.lat IS NOT NULL
        AND mp.lng IS NOT NULL
        AND public.haversine_miles(
          v_item.lat::double precision,
          v_item.lng::double precision,
          mp.lat::double precision,
          mp.lng::double precision
        ) <= COALESCE(v_item.radius_miles, 5)
        AND NOT public.buyer_already_has_item_type(c.user_id, v_item.product_type_id, c.id)
        AND EXISTS (
          SELECT 1
          FROM public.resolve_at_home_stage2_category(
            v_item.product_type_id,
            c.id,
            NULL,
            NULL
          ) r
        );
    END IF;

    v_label := COALESCE(NULLIF(trim(v_item.raw_query), ''), v_item.type_label, 'this item');

    IF v_demand_count > 0 THEN
      v_type := 'pass_on_demand';
      v_body := v_demand_count::text || ' nearby fam'
        || CASE WHEN v_demand_count = 1 THEN 'y' ELSE 'ilies' END
        || ' may want ' || v_label || '. Ready to list it?';
      v_dedupe := 'pass_on_demand:' || v_item.id::text;
    ELSE
      v_type := 'pass_on_encourage';
      v_body := v_label || ' may be ready to pass on. A quick photo list helps another family nearby.';
      v_dedupe := 'pass_on_encourage:' || v_item.id::text || ':' || to_char(CURRENT_DATE, 'IYYY-IW');
    END IF;

    INSERT INTO public.inventory_notification_events (
      notification_type,
      recipient_user_id,
      garage_item_id,
      product_type_id,
      title,
      body,
      deep_link,
      dedupe_key
    )
    VALUES (
      v_type,
      v_item.user_id,
      v_item.id,
      v_item.product_type_id,
      'Pip''s Pass-On',
      v_body,
      '/app/listings?new=1&household_item=' || v_item.id::text,
      v_dedupe
    )
    ON CONFLICT (dedupe_key) DO NOTHING;

    GET DIAGNOSTICS v_row_count = ROW_COUNT;
    IF v_row_count > 0 THEN
      v_queued := v_queued + 1;
    END IF;
  END LOOP;

  RETURN v_queued;
END;
$$;

REVOKE ALL ON FUNCTION public.queue_pass_on_prompts(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.queue_pass_on_prompts(INTEGER) TO service_role;

-- =============================================================================
-- G. Audience count for seller demand signal (replaces placeholder soft match)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.count_patch_find_audience_nearby(
  p_seller_user_id UUID,
  p_product_type_id UUID,
  p_lat DOUBLE PRECISION,
  p_lng DOUBLE PRECISION,
  p_radius_miles DOUBLE PRECISION DEFAULT 5
)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(DISTINCT c.id)::INTEGER
  FROM public.marketplace_preferences mp
  JOIN public.children c
    ON c.user_id = mp.user_id
   AND (c.is_suppressed = false OR c.is_suppressed IS NULL)
  WHERE mp.user_id <> p_seller_user_id
    AND p_product_type_id IS NOT NULL
    AND mp.lat IS NOT NULL
    AND mp.lng IS NOT NULL
    AND p_lat IS NOT NULL
    AND p_lng IS NOT NULL
    AND public.haversine_miles(p_lat, p_lng, mp.lat::double precision, mp.lng::double precision)
      <= COALESCE(p_radius_miles, mp.radius_miles, 5)
    AND NOT public.buyer_already_has_item_type(mp.user_id, p_product_type_id, c.id)
    AND EXISTS (
      SELECT 1
      FROM public.resolve_at_home_stage2_category(p_product_type_id, c.id, NULL, NULL) r
    );
$$;

REVOKE ALL ON FUNCTION public.count_patch_find_audience_nearby(UUID, UUID, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.count_patch_find_audience_nearby(UUID, UUID, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION) TO authenticated, service_role;
