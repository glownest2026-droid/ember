-- Ingest Stage 3 Pip's Picks for 34-36m pilot cards.
-- Source artifacts:
-- - agent-tools/exports/ember_picks_34-36m_cat_picture_story_books.json
-- - agent-tools/exports/ember_picks_34-36m_cat_small_world_figures.json

BEGIN;

CREATE TABLE IF NOT EXISTS public.pl_stage3_picks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_band_id TEXT NOT NULL REFERENCES public.pl_age_bands(id) ON DELETE RESTRICT,
  category_type_id UUID NOT NULL REFERENCES public.pl_category_types(id) ON DELETE CASCADE,
  source_category_entity_id TEXT NOT NULL,
  pick_rank INTEGER NOT NULL CHECK (pick_rank > 0),
  longlist_rank INTEGER NOT NULL CHECK (longlist_rank > 0),
  status TEXT NOT NULL CHECK (status IN ('visible', 'backup', 'skip')),
  is_visible BOOLEAN NOT NULL DEFAULT true,
  is_locked BOOLEAN NOT NULL DEFAULT true,
  best_for_tag TEXT,
  product_name TEXT NOT NULL,
  brand TEXT,
  retailer TEXT,
  product_url TEXT,
  image_url TEXT,
  price_text TEXT,
  stock_status TEXT,
  age_mark_on_listing TEXT,
  product_description TEXT,
  ember_verdict TEXT,
  why_it_fits TEXT,
  caveats TEXT,
  buy_borrow_hold_off TEXT,
  gift_suitable BOOLEAN,
  gift_note TEXT,
  ownership_note TEXT,
  safety_notes TEXT,
  evidence_tier TEXT,
  evidence_sources TEXT[],
  founder_qa_flag TEXT,
  research_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pl_stage3_picks_unique UNIQUE (age_band_id, category_type_id, pick_rank, status)
);

ALTER TABLE public.pl_stage3_picks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pl_stage3_picks_public_read" ON public.pl_stage3_picks;
CREATE POLICY "pl_stage3_picks_public_read" ON public.pl_stage3_picks
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'visible'
    AND is_visible = true
    AND (
      is_locked = false
      OR lower(coalesce(auth.jwt() ->> 'email', '')) = 'timwd23@gmail.com'
    )
  );

DROP POLICY IF EXISTS "pl_stage3_picks_admin_all" ON public.pl_stage3_picks;
CREATE POLICY "pl_stage3_picks_admin_all" ON public.pl_stage3_picks
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT SELECT ON public.pl_stage3_picks TO anon, authenticated;

CREATE INDEX IF NOT EXISTS pl_stage3_picks_age_category_rank_idx
  ON public.pl_stage3_picks(age_band_id, category_type_id, status, pick_rank);

DROP TRIGGER IF EXISTS trg_pl_stage3_picks_updated_at ON public.pl_stage3_picks;
CREATE TRIGGER trg_pl_stage3_picks_updated_at
  BEFORE UPDATE ON public.pl_stage3_picks
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP VIEW IF EXISTS public.v_gateway_stage3_picks_public;
CREATE VIEW public.v_gateway_stage3_picks_public
WITH (security_invoker = true) AS
SELECT
  s.id,
  s.age_band_id,
  s.category_type_id,
  ct.slug AS category_type_slug,
  s.source_category_entity_id,
  s.pick_rank,
  s.longlist_rank,
  s.status,
  s.is_visible,
  s.is_locked,
  s.best_for_tag,
  s.product_name,
  s.brand,
  s.retailer,
  s.product_url,
  s.image_url,
  s.price_text,
  s.stock_status,
  s.age_mark_on_listing,
  s.product_description,
  s.ember_verdict,
  s.why_it_fits,
  s.caveats,
  s.buy_borrow_hold_off,
  s.gift_suitable,
  s.gift_note,
  s.ownership_note,
  s.safety_notes,
  s.evidence_tier,
  s.evidence_sources,
  s.founder_qa_flag,
  s.research_payload
FROM public.pl_stage3_picks s
JOIN public.pl_category_types ct ON ct.id = s.category_type_id
WHERE s.status = 'visible'
  AND s.is_visible = true
  AND s.is_locked = false;

GRANT SELECT ON public.v_gateway_stage3_picks_public TO anon, authenticated;

DELETE FROM public.pl_stage3_picks
WHERE age_band_id = '34-36m'
  AND source_category_entity_id IN ('cat_picture_story_books', 'cat_small_world_figures');

WITH stage3_rows AS (
  SELECT *
  FROM (VALUES
    ('cat_picture_story_books', 1, 1, 'visible', true, false, 'Best conversation starter', 'You Choose', 'Pippa Goodhart and Nick Sharratt', 'Penguin / UK book retailers', 'https://www.penguin.co.uk/books/357910/you-choose-by-goodhart-pippa/9780552547086', NULL, 'Price not verified', 'unknown', 'not verified', 'Choice-led picture book full of scenes where children pick people, places, clothes, food and adventures.', 'This is the cleanest fit for a nearly-three who wants to answer, explain and lead the page. Borrow first if the family already owns it.', 'Choice-led pages make it easy to ask what, why and what next without turning reading into a quiz.', 'Medium ownership risk: many families already know this one.', 'buy_or_borrow', true, 'Strong gift if the family does not already own it.', 'Borrow first if books are already everywhere.', 'No special safety note beyond normal book use.', 'good', ARRAY['https://www.penguin.co.uk/books/357910/you-choose-by-goodhart-pippa/9780552547086'], 'check_url'),
    ('cat_picture_story_books', 2, 2, 'visible', true, true, 'Best feelings talk', 'The Colour Monster', 'Anna Llenas', 'Waterstones / UK book retailers', 'https://www.waterstones.com/book/the-colour-monster/anna-llenas/9781783704231', NULL, 'Price not verified', 'unknown', 'not verified', 'A picture book using colours and a character to name and sort different feelings.', 'Good when the goal is richer talk, not just story recall. It gives a nearly-three simple feelings words without becoming a lesson.', 'It gives adults an easy route into how someone feels, why, and what might help.', 'Less useful if the family already has several feelings books.', 'buy_or_borrow', true, 'Good gift if feelings talk is becoming a bigger part of family life.', 'Medium ownership risk.', 'No special safety note beyond normal book use.', 'good', ARRAY['https://www.waterstones.com/book/the-colour-monster/anna-llenas/9781783704231'], 'check_url'),
    ('cat_picture_story_books', 3, 3, 'visible', true, true, 'Best talk-back read', 'Don''t Let the Pigeon Drive the Bus!', 'Mo Willems', 'Walker / UK book retailers', 'https://www.walker.co.uk/Dont-Let-the-Pigeon-Drive-the-Bus-9781844285136.aspx', NULL, 'Price not verified', 'unknown', 'not verified', 'Comic picture book where the child is invited to answer the pleading pigeon.', 'A strong nearly-three format because the child gets a job on every page: answer, explain and say no with confidence.', 'The call-and-response setup makes shared reading feel like a conversation.', 'Check the edition and price before buying; library borrow is sensible.', 'buy_or_borrow', true, 'A good gift for a child who likes being part of the joke.', 'Medium ownership risk.', 'No special safety note beyond normal book use.', 'good', ARRAY['https://www.walker.co.uk/Dont-Let-the-Pigeon-Drive-the-Bus-9781844285136.aspx'], 'check_price'),
    ('cat_picture_story_books', 4, 4, 'visible', true, true, 'Best rhythm and prediction', 'Oi Frog!', 'Kes Gray and Jim Field', 'Hachette Children''s / UK retailers', 'https://www.hachettechildrens.co.uk/titles/kes-gray/oi-frog/9781444910865/', NULL, 'GBP 7.99', 'unknown', 'Interest age: from c 3 years', 'Rhyming picture book where animals sit on increasingly silly matching objects.', 'Less question-led than You Choose, but excellent for prediction: what rhymes, what comes next, and why Frog is cross.', 'Rhythm, repeated structure and silly pictures give the child lots to predict out loud.', 'Very silly; skip if the family wants calmer bedtime books.', 'buy_or_borrow', true, 'Good gift if they like funny read-alouds.', 'Medium ownership risk.', 'No special safety note beyond normal book use.', 'strong', ARRAY['https://www.hachettechildrens.co.uk/titles/kes-gray/oi-frog/9781444910865/'], 'none'),
    ('cat_picture_story_books', 5, 5, 'visible', true, true, 'Best gentle prediction', 'A Bit Lost', 'Chris Haughton', 'Walker / UK book retailers', 'https://www.walker.co.uk/A-Bit-Lost-9781406333831.aspx', NULL, 'Price not verified', 'unknown', 'not verified', 'Bold picture book about a little owl helped by a squirrel to find its mummy.', 'A softer pick for a child who likes explaining pictures. The repeated guessing gives adults easy what-next and who-is-that prompts.', 'The visual clues invite prediction without needing a complicated plot.', 'Less explicitly interactive than the top three.', 'buy_or_borrow', true, 'Good quieter gift if they do not need novelty flaps or buttons.', 'Medium ownership risk.', 'No special safety note beyond normal book use.', 'good', ARRAY['https://www.walker.co.uk/A-Bit-Lost-9781406333831.aspx'], 'check_url'),
    ('cat_small_world_figures', 1, 1, 'visible', true, false, 'Best travel story starter', 'LEGO DUPLO First Time at the Airport', 'LEGO DUPLO', 'LEGO Official Shop GB', 'https://www.lego.com/en-gb/product/first-time-at-the-airport-10443', NULL, 'GBP 24.99', 'in_stock', '2+', 'DUPLO airport set with plane, luggage scanner, tower, child, pilot and teddy figures.', 'A tight small-world set for nearly three: enough people, props and sequence for a whole trip story, without a huge footprint.', 'It gives a clear scenario: pack, scan, board, fly and arrive.', 'Plastic bricks and licensed-style play may not suit every family.', 'buy', true, 'Good gift if they like vehicles or new-place stories.', 'Adds a travel theme rather than duplicating generic figures.', 'Age 2+; supervise normally and keep away from younger siblings if pieces are mouthed.', 'strong', ARRAY['https://www.lego.com/en-gb/product/first-time-at-the-airport-10443'], 'none'),
    ('cat_small_world_figures', 2, 2, 'visible', true, true, 'Best big open-ended scene', 'LEGO DUPLO 3in1 Tree House', 'LEGO DUPLO', 'LEGO Official Shop GB', 'https://www.lego.com/en-gb/product/3in1-tree-house-10993', NULL, 'GBP 79.99', 'low_stock', '3+', 'Large DUPLO tree-house set with people, animals, slide, garden and rebuildable scenes.', 'The richest story world here: several people, animals and places. Best where the family wants one bigger shared pretend-play set.', 'It supports whole scenes and can be rebuilt when the story changes.', 'Big footprint and higher price; borrow or buy pre-loved if unsure.', 'buy_or_borrow', true, 'A bigger family gift rather than a casual extra.', 'High duplicate risk if they already have DUPLO worlds.', 'Age 3+; check all pieces are present if bought pre-loved.', 'strong', ARRAY['https://www.lego.com/en-gb/product/3in1-tree-house-10993'], 'check_stock'),
    ('cat_small_world_figures', 3, 3, 'visible', true, true, 'Best animal story add-on', 'Schleich Farm World Starter Set', 'Schleich', 'Schleich / UK toy retailers', 'https://www.schleich-s.com/en/GB/farm-world/products/farm-world-starter-set-42385.html', NULL, 'Price not verified', 'unknown', 'not verified', 'Small set of realistic farm animal figures for open-ended animal stories.', 'Best when the family already has blocks, vehicles or a play mat and needs characters to make stories happen.', 'Animals can be added to existing play without buying a whole new world.', 'Check current UK availability and age guidance before buying.', 'buy_or_borrow', true, 'Good if it adds animals rather than more vehicles.', 'Medium duplicate risk.', 'Check age mark and small-part warnings on the current listing.', 'good', ARRAY['https://www.schleich-s.com/en/GB/farm-world/products/farm-world-starter-set-42385.html'], 'check_url'),
    ('cat_small_world_figures', 4, 4, 'visible', true, true, 'Best simple vehicle role play', 'PLAYMOBIL 1.2.3 Recycling Truck', 'PLAYMOBIL 1.2.3', 'PLAYMOBIL / UK toy retailers', 'https://www.playmobil.com/en-gb/recycling-truck/71328.html', NULL, 'Price not verified', 'unknown', 'not verified', 'Toddler vehicle playset with recycling truck, figure and simple accessories.', 'A low-frustration vehicle scene: one person, one job, one truck. Good for children who build stories from everyday routines.', 'The job is easy to understand, so the story can come from the child.', 'Verify current UK stock and price before founder approval.', 'buy_or_borrow', true, 'Good gift for a child who likes real-life vehicles.', 'Medium duplicate risk if they already have service vehicles.', 'Check age mark and included pieces on the current listing.', 'good', ARRAY['https://www.playmobil.com/en-gb/recycling-truck/71328.html'], 'check_url'),
    ('cat_small_world_figures', 5, 5, 'visible', true, true, 'Best cosy town setup', 'ELC Happyland Village Set', 'Early Learning Centre Happyland', 'ELC / The Entertainer', 'https://www.elc.co.uk/happyland/happyland-village-set/p/557599', NULL, 'Price not verified', 'unknown', 'not verified', 'Small-world village playset with people, buildings and everyday story props.', 'A classic if you want whole little-world play without building. Best for children who like moving people through everyday places.', 'It gives people and places immediately, which helps children act out small social stories.', 'Verify current UK listing before publishing beyond founder review.', 'buy_or_borrow', true, 'Good bigger gift if it fills a missing town-play gap.', 'High duplicate risk if they already have Happyland or similar.', 'Check current age mark and piece condition if pre-loved.', 'good', ARRAY['https://www.elc.co.uk/happyland/happyland-village-set/p/557599'], 'check_url')
  ) AS v(source_category_entity_id, pick_rank, longlist_rank, status, is_visible, is_locked, best_for_tag, product_name, brand, retailer, product_url, image_url, price_text, stock_status, age_mark_on_listing, product_description, ember_verdict, why_it_fits, caveats, buy_borrow_hold_off, gift_suitable, gift_note, ownership_note, safety_notes, evidence_tier, evidence_sources, founder_qa_flag)
)
INSERT INTO public.pl_stage3_picks (
  age_band_id,
  category_type_id,
  source_category_entity_id,
  pick_rank,
  longlist_rank,
  status,
  is_visible,
  is_locked,
  best_for_tag,
  product_name,
  brand,
  retailer,
  product_url,
  image_url,
  price_text,
  stock_status,
  age_mark_on_listing,
  product_description,
  ember_verdict,
  why_it_fits,
  caveats,
  buy_borrow_hold_off,
  gift_suitable,
  gift_note,
  ownership_note,
  safety_notes,
  evidence_tier,
  evidence_sources,
  founder_qa_flag,
  research_payload
)
SELECT
  '34-36m',
  ct.id,
  r.source_category_entity_id,
  r.pick_rank,
  r.longlist_rank,
  r.status,
  r.is_visible,
  r.is_locked,
  r.best_for_tag,
  r.product_name,
  r.brand,
  r.retailer,
  r.product_url,
  r.image_url,
  r.price_text,
  r.stock_status,
  r.age_mark_on_listing,
  r.product_description,
  r.ember_verdict,
  r.why_it_fits,
  r.caveats,
  r.buy_borrow_hold_off,
  r.gift_suitable,
  r.gift_note,
  r.ownership_note,
  r.safety_notes,
  r.evidence_tier,
  r.evidence_sources,
  r.founder_qa_flag,
  jsonb_build_object(
    'research_date', '2026-07-16',
    'schema_version', 'ember_picks_research_v2',
    'status', 'founder-review-ready',
    'source_category_entity_id', r.source_category_entity_id
  )
FROM stage3_rows r
JOIN public.pl_category_types ct ON ct.slug = r.source_category_entity_id;

WITH backup_rows AS (
  SELECT *
  FROM (VALUES
    ('cat_picture_story_books', 6, 'What Should Danny Do?', 'Adir Levy', 'Best explicit choices', 'https://www.waterstones.com/'),
    ('cat_picture_story_books', 7, 'Ruby Finds a Worry', 'Tom Percival', 'Best worry conversation', 'https://www.waterstones.com/'),
    ('cat_picture_story_books', 8, 'The Book With No Pictures', 'B. J. Novak', 'Best silly read-aloud', 'https://www.waterstones.com/'),
    ('cat_picture_story_books', 9, 'Shh! We Have a Plan', 'Chris Haughton', 'Best quiet suspense', 'https://www.waterstones.com/'),
    ('cat_picture_story_books', 10, 'The Gruffalo', 'Julia Donaldson', 'Best classic if not owned', 'https://www.waterstones.com/'),
    ('cat_picture_story_books', 11, 'Each Peach Pear Plum', 'Janet and Allan Ahlberg', 'Best spotting classic', 'https://www.waterstones.com/'),
    ('cat_picture_story_books', 12, 'Press Here', 'Herve Tullet', 'Best action prompt', 'https://www.waterstones.com/'),
    ('cat_picture_story_books', 13, 'We Found a Hat', 'Jon Klassen', 'Best quiet inference', 'https://www.waterstones.com/'),
    ('cat_picture_story_books', 14, 'Where''s Spot?', 'Eric Hill', 'Best if younger sibling too', 'https://www.waterstones.com/'),
    ('cat_picture_story_books', 15, 'The Tiger Who Came to Tea', 'Judith Kerr', 'Best familiar chat', 'https://www.waterstones.com/'),
    ('cat_small_world_figures', 6, 'Lanka Kade wooden emergency vehicle playset', 'Lanka Kade', 'Best wooden vehicle add-on', 'https://www.thetoyshop.com/'),
    ('cat_small_world_figures', 7, 'Bigjigs Rail Roadway Figure of Eight Train Set', 'Bigjigs Rail', 'Best train-and-road loop', 'https://www.thetoyshop.com/'),
    ('cat_small_world_figures', 8, 'Tender Leaf Toys General Stores', 'Tender Leaf Toys', 'Best shop story setup', 'https://www.thetoyshop.com/'),
    ('cat_small_world_figures', 9, 'Le Toy Van Honeybake market or vehicle set', 'Le Toy Van', 'Best wooden pretend add-on', 'https://www.thetoyshop.com/'),
    ('cat_small_world_figures', 10, 'BRIO World Travel Train', 'BRIO', 'Best rail story add-on', 'https://www.thetoyshop.com/'),
    ('cat_small_world_figures', 11, 'Little Dutch wooden vehicles', 'Little Dutch', 'Best simple vehicle set', 'https://www.thetoyshop.com/'),
    ('cat_small_world_figures', 12, 'Orchard Toys Bus Stop game', 'Orchard Toys', 'Best hold-off game', 'https://www.thetoyshop.com/'),
    ('cat_small_world_figures', 13, 'Goki wooden bendy dolls family', 'Goki', 'Best people-only add-on', 'https://www.thetoyshop.com/'),
    ('cat_small_world_figures', 14, 'Melissa and Doug Wooden Town Vehicles', 'Melissa and Doug', 'Best sturdy town vehicles', 'https://www.thetoyshop.com/'),
    ('cat_small_world_figures', 15, 'Peppa Pig family house/car set', 'Hasbro / Character', 'Best character-led backup', 'https://www.thetoyshop.com/')
  ) AS v(source_category_entity_id, longlist_rank, product_name, brand, best_for_tag, product_url)
)
INSERT INTO public.pl_stage3_picks (
  age_band_id,
  category_type_id,
  source_category_entity_id,
  pick_rank,
  longlist_rank,
  status,
  is_visible,
  is_locked,
  best_for_tag,
  product_name,
  brand,
  product_url,
  founder_qa_flag,
  research_payload
)
SELECT
  '34-36m',
  ct.id,
  r.source_category_entity_id,
  r.longlist_rank,
  r.longlist_rank,
  'backup',
  false,
  true,
  r.best_for_tag,
  r.product_name,
  r.brand,
  r.product_url,
  'backup_not_card_ready',
  jsonb_build_object(
    'research_date', '2026-07-16',
    'schema_version', 'ember_picks_research_v2',
    'status', 'dormant_backup',
    'source_category_entity_id', r.source_category_entity_id
  )
FROM backup_rows r
JOIN public.pl_category_types ct ON ct.slug = r.source_category_entity_id;

DO $$
DECLARE
  v_visible_count INTEGER;
  v_backup_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_visible_count
  FROM public.pl_stage3_picks s
  JOIN public.pl_category_types ct ON ct.id = s.category_type_id
  WHERE s.age_band_id = '34-36m'
    AND ct.slug IN ('cat_picture_story_books', 'cat_small_world_figures')
    AND s.status = 'visible'
    AND s.is_visible = true;

  IF v_visible_count <> 10 THEN
    RAISE EXCEPTION 'Expected 10 visible Stage 3 picks for 34-36m pilot cards, got %', v_visible_count;
  END IF;

  SELECT COUNT(*) INTO v_backup_count
  FROM public.pl_stage3_picks s
  JOIN public.pl_category_types ct ON ct.id = s.category_type_id
  WHERE s.age_band_id = '34-36m'
    AND ct.slug IN ('cat_picture_story_books', 'cat_small_world_figures')
    AND s.status = 'backup'
    AND s.is_visible = false;

  IF v_backup_count <> 20 THEN
    RAISE EXCEPTION 'Expected 20 backup Stage 3 picks for 34-36m pilot cards, got %', v_backup_count;
  END IF;
END $$;

COMMIT;
