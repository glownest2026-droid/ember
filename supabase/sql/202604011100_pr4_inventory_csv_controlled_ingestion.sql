-- PR4: Controlled CSV ingestion for canonical inventory dictionary expansion.
-- Source file (draft input only): ember_inventory_seed_starter_top1000_terms.csv
-- Strategy:
--   1) Stage medium-confidence rows only.
--   2) Deterministically map each canonical slug to existing product_type when possible.
--   3) Create only minimal new product_types when no deterministic mapping exists.
--   4) Insert deduplicated aliases.
--   5) Resolve unmatched queue rows covered by new alias mappings.

CREATE TEMP TABLE tmp_pr4_baseline_counts AS
SELECT
  (SELECT COUNT(*) FROM public.product_types) AS product_types_before,
  (SELECT COUNT(*) FROM public.product_type_aliases) AS product_type_aliases_before,
  (SELECT COUNT(*) FROM public.inventory_unmatched_queue WHERE status IN ('new','reviewing')) AS queue_open_before;

CREATE TEMP TABLE tmp_pr4_seed_stage (
  likely_listing_term TEXT NOT NULL,
  normalized_term TEXT NOT NULL,
  proposed_canonical_slug TEXT NOT NULL,
  proposed_canonical_label TEXT NOT NULL,
  category TEXT NOT NULL,
  seed_confidence TEXT NOT NULL,
  review_status TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO tmp_pr4_seed_stage (
  likely_listing_term,
  normalized_term,
  proposed_canonical_slug,
  proposed_canonical_label,
  category,
  seed_confidence,
  review_status
)
VALUES
  ('pram','pram','pram','Pram','transport','medium','draft_needs_founder_review'),
  ('buggy','buggy','pram','Pram','transport','medium','draft_needs_founder_review'),
  ('pushchair','pushchair','pram','Pram','transport','medium','draft_needs_founder_review'),
  ('baby pram','baby pram','pram','Pram','transport','medium','draft_needs_founder_review'),
  ('pushchair','pushchair','pushchair','Pushchair','transport','medium','draft_needs_founder_review'),
  ('buggy','buggy','pushchair','Pushchair','transport','medium','draft_needs_founder_review'),
  ('stroller','stroller','pushchair','Pushchair','transport','medium','draft_needs_founder_review'),
  ('baby pushchair','baby pushchair','pushchair','Pushchair','transport','medium','draft_needs_founder_review'),
  ('stroller','stroller','stroller','Stroller','transport','medium','draft_needs_founder_review'),
  ('buggy','buggy','stroller','Stroller','transport','medium','draft_needs_founder_review'),
  ('pushchair','pushchair','stroller','Stroller','transport','medium','draft_needs_founder_review'),
  ('baby stroller','baby stroller','stroller','Stroller','transport','medium','draft_needs_founder_review'),
  ('travel system','travel system','travel-system','Travel System','transport','medium','draft_needs_founder_review'),
  ('3 in 1 pram','3 in 1 pram','travel-system','Travel System','transport','medium','draft_needs_founder_review'),
  ('travel system pram','travel system pram','travel-system','Travel System','transport','medium','draft_needs_founder_review'),
  ('travel bundle','travel bundle','travel-system','Travel System','transport','medium','draft_needs_founder_review'),
  ('carrycot','carrycot','carrycot','Carrycot','transport','medium','draft_needs_founder_review'),
  ('toddler carrycot','toddler carrycot','carrycot','Carrycot','transport','medium','draft_needs_founder_review'),
  ('portable carrycot','portable carrycot','carrycot','Carrycot','transport','medium','draft_needs_founder_review'),
  ('folding carrycot','folding carrycot','carrycot','Carrycot','transport','medium','draft_needs_founder_review'),
  ('double buggy','double buggy','double-buggy','Double Buggy','transport','medium','draft_needs_founder_review'),
  ('toddler double buggy','toddler double buggy','double-buggy','Double Buggy','transport','medium','draft_needs_founder_review'),
  ('portable double buggy','portable double buggy','double-buggy','Double Buggy','transport','medium','draft_needs_founder_review'),
  ('folding double buggy','folding double buggy','double-buggy','Double Buggy','transport','medium','draft_needs_founder_review'),
  ('umbrella stroller','umbrella stroller','umbrella-stroller','Umbrella Stroller','transport','medium','draft_needs_founder_review'),
  ('toddler umbrella stroller','toddler umbrella stroller','umbrella-stroller','Umbrella Stroller','transport','medium','draft_needs_founder_review'),
  ('portable umbrella stroller','portable umbrella stroller','umbrella-stroller','Umbrella Stroller','transport','medium','draft_needs_founder_review'),
  ('folding umbrella stroller','folding umbrella stroller','umbrella-stroller','Umbrella Stroller','transport','medium','draft_needs_founder_review'),
  ('buggy board','buggy board','buggy-board','Buggy Board','transport','medium','draft_needs_founder_review'),
  ('toddler buggy board','toddler buggy board','buggy-board','Buggy Board','transport','medium','draft_needs_founder_review'),
  ('portable buggy board','portable buggy board','buggy-board','Buggy Board','transport','medium','draft_needs_founder_review'),
  ('folding buggy board','folding buggy board','buggy-board','Buggy Board','transport','medium','draft_needs_founder_review'),
  ('baby carrier','baby carrier','baby-carrier','Baby Carrier','transport','medium','draft_needs_founder_review'),
  ('toddler baby carrier','toddler baby carrier','baby-carrier','Baby Carrier','transport','medium','draft_needs_founder_review'),
  ('portable baby carrier','portable baby carrier','baby-carrier','Baby Carrier','transport','medium','draft_needs_founder_review'),
  ('folding baby carrier','folding baby carrier','baby-carrier','Baby Carrier','transport','medium','draft_needs_founder_review'),
  ('baby sling','baby sling','baby-sling','Baby Sling','transport','medium','draft_needs_founder_review'),
  ('toddler baby sling','toddler baby sling','baby-sling','Baby Sling','transport','medium','draft_needs_founder_review'),
  ('portable baby sling','portable baby sling','baby-sling','Baby Sling','transport','medium','draft_needs_founder_review'),
  ('folding baby sling','folding baby sling','baby-sling','Baby Sling','transport','medium','draft_needs_founder_review'),
  ('back carrier','back carrier','back-carrier','Back Carrier','transport','medium','draft_needs_founder_review'),
  ('toddler back carrier','toddler back carrier','back-carrier','Back Carrier','transport','medium','draft_needs_founder_review'),
  ('portable back carrier','portable back carrier','back-carrier','Back Carrier','transport','medium','draft_needs_founder_review'),
  ('folding back carrier','folding back carrier','back-carrier','Back Carrier','transport','medium','draft_needs_founder_review'),
  ('nappy bag','nappy bag','nappy-bag','Nappy Bag','transport','medium','draft_needs_founder_review'),
  ('toddler nappy bag','toddler nappy bag','nappy-bag','Nappy Bag','transport','medium','draft_needs_founder_review'),
  ('portable nappy bag','portable nappy bag','nappy-bag','Nappy Bag','transport','medium','draft_needs_founder_review'),
  ('folding nappy bag','folding nappy bag','nappy-bag','Nappy Bag','transport','medium','draft_needs_founder_review'),
  ('changing bag','changing bag','changing-bag','Changing Bag','transport','medium','draft_needs_founder_review'),
  ('toddler changing bag','toddler changing bag','changing-bag','Changing Bag','transport','medium','draft_needs_founder_review'),
  ('portable changing bag','portable changing bag','changing-bag','Changing Bag','transport','medium','draft_needs_founder_review'),
  ('folding changing bag','folding changing bag','changing-bag','Changing Bag','transport','medium','draft_needs_founder_review'),
  ('pram organiser','pram organiser','pram-organiser','Pram Organiser','transport','medium','draft_needs_founder_review'),
  ('toddler pram organiser','toddler pram organiser','pram-organiser','Pram Organiser','transport','medium','draft_needs_founder_review'),
  ('portable pram organiser','portable pram organiser','pram-organiser','Pram Organiser','transport','medium','draft_needs_founder_review'),
  ('folding pram organiser','folding pram organiser','pram-organiser','Pram Organiser','transport','medium','draft_needs_founder_review'),
  ('car seat','car seat','car-seat','Car Seat','transport','medium','draft_needs_founder_review'),
  ('baby car seat','baby car seat','car-seat','Car Seat','transport','medium','draft_needs_founder_review'),
  ('infant car seat','infant car seat','car-seat','Car Seat','transport','medium','draft_needs_founder_review'),
  ('carseat','carseat','car-seat','Car Seat','transport','medium','draft_needs_founder_review'),
  ('moses basket','moses basket','moses-basket','Moses Basket','sleep','medium','draft_needs_founder_review'),
  ('baby moses basket','baby moses basket','moses-basket','Moses Basket','sleep','medium','draft_needs_founder_review'),
  ('portable moses basket','portable moses basket','moses-basket','Moses Basket','sleep','medium','draft_needs_founder_review'),
  ('folding moses basket','folding moses basket','moses-basket','Moses Basket','sleep','medium','draft_needs_founder_review'),
  ('crib','crib','crib','Crib','sleep','medium','draft_needs_founder_review'),
  ('baby crib','baby crib','crib','Crib','sleep','medium','draft_needs_founder_review'),
  ('portable crib','portable crib','crib','Crib','sleep','medium','draft_needs_founder_review'),
  ('folding crib','folding crib','crib','Crib','sleep','medium','draft_needs_founder_review'),
  ('bedside crib','bedside crib','bedside-crib','Bedside Crib','sleep','medium','draft_needs_founder_review'),
  ('baby bedside crib','baby bedside crib','bedside-crib','Bedside Crib','sleep','medium','draft_needs_founder_review'),
  ('portable bedside crib','portable bedside crib','bedside-crib','Bedside Crib','sleep','medium','draft_needs_founder_review'),
  ('folding bedside crib','folding bedside crib','bedside-crib','Bedside Crib','sleep','medium','draft_needs_founder_review'),
  ('cot','cot','cot','Cot','sleep','medium','draft_needs_founder_review'),
  ('toddler cot','toddler cot','cot','Cot','sleep','medium','draft_needs_founder_review'),
  ('portable cot','portable cot','cot','Cot','sleep','medium','draft_needs_founder_review'),
  ('folding cot','folding cot','cot','Cot','sleep','medium','draft_needs_founder_review'),
  ('cot bed','cot bed','cot-bed','Cot Bed','sleep','medium','draft_needs_founder_review'),
  ('toddler cot bed','toddler cot bed','cot-bed','Cot Bed','sleep','medium','draft_needs_founder_review'),
  ('portable cot bed','portable cot bed','cot-bed','Cot Bed','sleep','medium','draft_needs_founder_review'),
  ('folding cot bed','folding cot bed','cot-bed','Cot Bed','sleep','medium','draft_needs_founder_review'),
  ('toddler bed','toddler bed','toddler-bed','Toddler Bed','sleep','medium','draft_needs_founder_review'),
  ('toddler toddler bed','toddler toddler bed','toddler-bed','Toddler Bed','sleep','medium','draft_needs_founder_review'),
  ('portable toddler bed','portable toddler bed','toddler-bed','Toddler Bed','sleep','medium','draft_needs_founder_review'),
  ('folding toddler bed','folding toddler bed','toddler-bed','Toddler Bed','sleep','medium','draft_needs_founder_review'),
  ('travel cot','travel cot','travel-cot','Travel Cot','sleep','medium','draft_needs_founder_review'),
  ('toddler travel cot','toddler travel cot','travel-cot','Travel Cot','sleep','medium','draft_needs_founder_review'),
  ('portable travel cot','portable travel cot','travel-cot','Travel Cot','sleep','medium','draft_needs_founder_review'),
  ('folding travel cot','folding travel cot','travel-cot','Travel Cot','sleep','medium','draft_needs_founder_review'),
  ('playpen','playpen','playpen','Playpen','sleep','medium','draft_needs_founder_review'),
  ('toddler playpen','toddler playpen','playpen','Playpen','sleep','medium','draft_needs_founder_review'),
  ('portable playpen','portable playpen','playpen','Playpen','sleep','medium','draft_needs_founder_review'),
  ('folding playpen','folding playpen','playpen','Playpen','sleep','medium','draft_needs_founder_review'),
  ('baby monitor','baby monitor','baby-monitor','Baby Monitor','sleep','medium','draft_needs_founder_review'),
  ('toddler baby monitor','toddler baby monitor','baby-monitor','Baby Monitor','sleep','medium','draft_needs_founder_review'),
  ('portable baby monitor','portable baby monitor','baby-monitor','Baby Monitor','sleep','medium','draft_needs_founder_review'),
  ('folding baby monitor','folding baby monitor','baby-monitor','Baby Monitor','sleep','medium','draft_needs_founder_review'),
  ('video monitor','video monitor','video-monitor','Video Monitor','sleep','medium','draft_needs_founder_review'),
  ('toddler video monitor','toddler video monitor','video-monitor','Video Monitor','sleep','medium','draft_needs_founder_review'),
  ('portable video monitor','portable video monitor','video-monitor','Video Monitor','sleep','medium','draft_needs_founder_review'),
  ('folding video monitor','folding video monitor','video-monitor','Video Monitor','sleep','medium','draft_needs_founder_review'),
  ('white noise machine','white noise machine','white-noise-machine','White Noise Machine','sleep','medium','draft_needs_founder_review'),
  ('toddler white noise machine','toddler white noise machine','white-noise-machine','White Noise Machine','sleep','medium','draft_needs_founder_review'),
  ('portable white noise machine','portable white noise machine','white-noise-machine','White Noise Machine','sleep','medium','draft_needs_founder_review'),
  ('folding white noise machine','folding white noise machine','white-noise-machine','White Noise Machine','sleep','medium','draft_needs_founder_review'),
  ('night light','night light','night-light','Night Light','sleep','medium','draft_needs_founder_review'),
  ('toddler night light','toddler night light','night-light','Night Light','sleep','medium','draft_needs_founder_review'),
  ('portable night light','portable night light','night-light','Night Light','sleep','medium','draft_needs_founder_review'),
  ('folding night light','folding night light','night-light','Night Light','sleep','medium','draft_needs_founder_review'),
  ('swaddle','swaddle','swaddle','Swaddle','sleep','medium','draft_needs_founder_review'),
  ('baby swaddle','baby swaddle','swaddle','Swaddle','sleep','medium','draft_needs_founder_review'),
  ('portable swaddle','portable swaddle','swaddle','Swaddle','sleep','medium','draft_needs_founder_review'),
  ('folding swaddle','folding swaddle','swaddle','Swaddle','sleep','medium','draft_needs_founder_review'),
  ('sleeping bag','sleeping bag','sleeping-bag','Sleeping Bag','sleep','medium','draft_needs_founder_review'),
  ('toddler sleeping bag','toddler sleeping bag','sleeping-bag','Sleeping Bag','sleep','medium','draft_needs_founder_review'),
  ('portable sleeping bag','portable sleeping bag','sleeping-bag','Sleeping Bag','sleep','medium','draft_needs_founder_review'),
  ('folding sleeping bag','folding sleeping bag','sleeping-bag','Sleeping Bag','sleep','medium','draft_needs_founder_review'),
  ('blackout blind','blackout blind','blackout-blind','Blackout Blind','sleep','medium','draft_needs_founder_review'),
  ('toddler blackout blind','toddler blackout blind','blackout-blind','Blackout Blind','sleep','medium','draft_needs_founder_review'),
  ('portable blackout blind','portable blackout blind','blackout-blind','Blackout Blind','sleep','medium','draft_needs_founder_review'),
  ('folding blackout blind','folding blackout blind','blackout-blind','Blackout Blind','sleep','medium','draft_needs_founder_review'),
  ('cot mobile','cot mobile','cot-mobile','Cot Mobile','sleep','medium','draft_needs_founder_review'),
  ('baby cot mobile','baby cot mobile','cot-mobile','Cot Mobile','sleep','medium','draft_needs_founder_review'),
  ('portable cot mobile','portable cot mobile','cot-mobile','Cot Mobile','sleep','medium','draft_needs_founder_review'),
  ('folding cot mobile','folding cot mobile','cot-mobile','Cot Mobile','sleep','medium','draft_needs_founder_review'),
  ('room thermometer','room thermometer','room-thermometer','Room Thermometer','sleep','medium','draft_needs_founder_review'),
  ('toddler room thermometer','toddler room thermometer','room-thermometer','Room Thermometer','sleep','medium','draft_needs_founder_review'),
  ('portable room thermometer','portable room thermometer','room-thermometer','Room Thermometer','sleep','medium','draft_needs_founder_review'),
  ('folding room thermometer','folding room thermometer','room-thermometer','Room Thermometer','sleep','medium','draft_needs_founder_review'),
  ('cot mattress','cot mattress','cot-mattress','Cot Mattress','sleep','medium','draft_needs_founder_review'),
  ('cot bed mattress','cot bed mattress','cot-mattress','Cot Mattress','sleep','medium','draft_needs_founder_review'),
  ('crib mattress','crib mattress','cot-mattress','Cot Mattress','sleep','medium','draft_needs_founder_review'),
  ('cotbed mattress','cotbed mattress','cot-mattress','Cot Mattress','sleep','medium','draft_needs_founder_review'),
  ('blanket','blanket','blanket','Blanket','sleep','medium','draft_needs_founder_review'),
  ('toddler blanket','toddler blanket','blanket','Blanket','sleep','medium','draft_needs_founder_review'),
  ('portable blanket','portable blanket','blanket','Blanket','sleep','medium','draft_needs_founder_review'),
  ('folding blanket','folding blanket','blanket','Blanket','sleep','medium','draft_needs_founder_review'),
  ('sleep aid','sleep aid','sleep-aid','Sleep Aid','sleep','medium','draft_needs_founder_review'),
  ('baby sleep aid','baby sleep aid','sleep-aid','Sleep Aid','sleep','medium','draft_needs_founder_review'),
  ('portable sleep aid','portable sleep aid','sleep-aid','Sleep Aid','sleep','medium','draft_needs_founder_review'),
  ('folding sleep aid','folding sleep aid','sleep-aid','Sleep Aid','sleep','medium','draft_needs_founder_review'),
  ('high chair','high chair','high-chair','High Chair','feeding','medium','draft_needs_founder_review'),
  ('toddler high chair','toddler high chair','high-chair','High Chair','feeding','medium','draft_needs_founder_review'),
  ('portable high chair','portable high chair','high-chair','High Chair','feeding','medium','draft_needs_founder_review'),
  ('folding high chair','folding high chair','high-chair','High Chair','feeding','medium','draft_needs_founder_review'),
  ('booster seat','booster seat','booster-seat','Booster Seat','feeding','medium','draft_needs_founder_review'),
  ('toddler booster seat','toddler booster seat','booster-seat','Booster Seat','feeding','medium','draft_needs_founder_review'),
  ('portable booster seat','portable booster seat','booster-seat','Booster Seat','feeding','medium','draft_needs_founder_review'),
  ('folding booster seat','folding booster seat','booster-seat','Booster Seat','feeding','medium','draft_needs_founder_review'),
  ('weaning set','weaning set','weaning-set','Weaning Set','feeding','medium','draft_needs_founder_review'),
  ('baby weaning set','baby weaning set','weaning-set','Weaning Set','feeding','medium','draft_needs_founder_review'),
  ('portable weaning set','portable weaning set','weaning-set','Weaning Set','feeding','medium','draft_needs_founder_review'),
  ('folding weaning set','folding weaning set','weaning-set','Weaning Set','feeding','medium','draft_needs_founder_review'),
  ('baby bottle set','baby bottle set','baby-bottle-set','Baby Bottle Set','feeding','medium','draft_needs_founder_review'),
  ('baby baby bottle set','baby baby bottle set','baby-bottle-set','Baby Bottle Set','feeding','medium','draft_needs_founder_review'),
  ('portable baby bottle set','portable baby bottle set','baby-bottle-set','Baby Bottle Set','feeding','medium','draft_needs_founder_review'),
  ('folding baby bottle set','folding baby bottle set','baby-bottle-set','Baby Bottle Set','feeding','medium','draft_needs_founder_review'),
  ('bottle steriliser','bottle steriliser','bottle-steriliser','Bottle Steriliser','feeding','medium','draft_needs_founder_review'),
  ('baby bottle steriliser','baby bottle steriliser','bottle-steriliser','Bottle Steriliser','feeding','medium','draft_needs_founder_review'),
  ('portable bottle steriliser','portable bottle steriliser','bottle-steriliser','Bottle Steriliser','feeding','medium','draft_needs_founder_review'),
  ('folding bottle steriliser','folding bottle steriliser','bottle-steriliser','Bottle Steriliser','feeding','medium','draft_needs_founder_review'),
  ('bottle warmer','bottle warmer','bottle-warmer','Bottle Warmer','feeding','medium','draft_needs_founder_review'),
  ('baby bottle warmer','baby bottle warmer','bottle-warmer','Bottle Warmer','feeding','medium','draft_needs_founder_review'),
  ('portable bottle warmer','portable bottle warmer','bottle-warmer','Bottle Warmer','feeding','medium','draft_needs_founder_review'),
  ('folding bottle warmer','folding bottle warmer','bottle-warmer','Bottle Warmer','feeding','medium','draft_needs_founder_review'),
  ('breast pump','breast pump','breast-pump','Breast Pump','feeding','medium','draft_needs_founder_review'),
  ('baby breast pump','baby breast pump','breast-pump','Breast Pump','feeding','medium','draft_needs_founder_review'),
  ('portable breast pump','portable breast pump','breast-pump','Breast Pump','feeding','medium','draft_needs_founder_review'),
  ('folding breast pump','folding breast pump','breast-pump','Breast Pump','feeding','medium','draft_needs_founder_review'),
  ('nursing pillow','nursing pillow','nursing-pillow','Nursing Pillow','feeding','medium','draft_needs_founder_review'),
  ('baby nursing pillow','baby nursing pillow','nursing-pillow','Nursing Pillow','feeding','medium','draft_needs_founder_review'),
  ('portable nursing pillow','portable nursing pillow','nursing-pillow','Nursing Pillow','feeding','medium','draft_needs_founder_review'),
  ('folding nursing pillow','folding nursing pillow','nursing-pillow','Nursing Pillow','feeding','medium','draft_needs_founder_review'),
  ('formula prep machine','formula prep machine','formula-prep-machine','Formula Prep Machine','feeding','medium','draft_needs_founder_review'),
  ('baby formula prep machine','baby formula prep machine','formula-prep-machine','Formula Prep Machine','feeding','medium','draft_needs_founder_review'),
  ('portable formula prep machine','portable formula prep machine','formula-prep-machine','Formula Prep Machine','feeding','medium','draft_needs_founder_review'),
  ('folding formula prep machine','folding formula prep machine','formula-prep-machine','Formula Prep Machine','feeding','medium','draft_needs_founder_review'),
  ('bottle drying rack','bottle drying rack','bottle-drying-rack','Bottle Drying Rack','feeding','medium','draft_needs_founder_review'),
  ('baby bottle drying rack','baby bottle drying rack','bottle-drying-rack','Bottle Drying Rack','feeding','medium','draft_needs_founder_review'),
  ('portable bottle drying rack','portable bottle drying rack','bottle-drying-rack','Bottle Drying Rack','feeding','medium','draft_needs_founder_review'),
  ('folding bottle drying rack','folding bottle drying rack','bottle-drying-rack','Bottle Drying Rack','feeding','medium','draft_needs_founder_review'),
  ('snack catcher','snack catcher','snack-catcher','Snack Catcher','feeding','medium','draft_needs_founder_review'),
  ('baby snack catcher','baby snack catcher','snack-catcher','Snack Catcher','feeding','medium','draft_needs_founder_review'),
  ('portable snack catcher','portable snack catcher','snack-catcher','Snack Catcher','feeding','medium','draft_needs_founder_review'),
  ('folding snack catcher','folding snack catcher','snack-catcher','Snack Catcher','feeding','medium','draft_needs_founder_review'),
  ('baby bib set','baby bib set','baby-bib-set','Baby Bib Set','feeding','medium','draft_needs_founder_review'),
  ('baby baby bib set','baby baby bib set','baby-bib-set','Baby Bib Set','feeding','medium','draft_needs_founder_review'),
  ('portable baby bib set','portable baby bib set','baby-bib-set','Baby Bib Set','feeding','medium','draft_needs_founder_review'),
  ('folding baby bib set','folding baby bib set','baby-bib-set','Baby Bib Set','feeding','medium','draft_needs_founder_review'),
  ('sippy cup','sippy cup','sippy-cup','Sippy Cup','feeding','medium','draft_needs_founder_review'),
  ('baby sippy cup','baby sippy cup','sippy-cup','Sippy Cup','feeding','medium','draft_needs_founder_review'),
  ('portable sippy cup','portable sippy cup','sippy-cup','Sippy Cup','feeding','medium','draft_needs_founder_review'),
  ('folding sippy cup','folding sippy cup','sippy-cup','Sippy Cup','feeding','medium','draft_needs_founder_review'),
  ('baby food freezer tray','baby food freezer tray','baby-food-freezer-tray','Baby Food Freezer Tray','feeding','medium','draft_needs_founder_review'),
  ('baby baby food freezer tray','baby baby food freezer tray','baby-food-freezer-tray','Baby Food Freezer Tray','feeding','medium','draft_needs_founder_review'),
  ('portable baby food freezer tray','portable baby food freezer tray','baby-food-freezer-tray','Baby Food Freezer Tray','feeding','medium','draft_needs_founder_review'),
  ('folding baby food freezer tray','folding baby food freezer tray','baby-food-freezer-tray','Baby Food Freezer Tray','feeding','medium','draft_needs_founder_review'),
  ('learning tower','learning tower','learning-tower','Learning Tower','feeding','medium','draft_needs_founder_review'),
  ('kitchen helper','kitchen helper','learning-tower','Learning Tower','feeding','medium','draft_needs_founder_review'),
  ('helper tower','helper tower','learning-tower','Learning Tower','feeding','medium','draft_needs_founder_review'),
  ('kitchen tower','kitchen tower','learning-tower','Learning Tower','feeding','medium','draft_needs_founder_review'),
  ('changing mat','changing mat','changing-mat','Changing Mat','bathing_changing','medium','draft_needs_founder_review'),
  ('baby changing mat','baby changing mat','changing-mat','Changing Mat','bathing_changing','medium','draft_needs_founder_review'),
  ('portable changing mat','portable changing mat','changing-mat','Changing Mat','bathing_changing','medium','draft_needs_founder_review'),
  ('folding changing mat','folding changing mat','changing-mat','Changing Mat','bathing_changing','medium','draft_needs_founder_review'),
  ('changing table','changing table','changing-table','Changing Table','bathing_changing','medium','draft_needs_founder_review'),
  ('toddler changing table','toddler changing table','changing-table','Changing Table','bathing_changing','medium','draft_needs_founder_review'),
  ('portable changing table','portable changing table','changing-table','Changing Table','bathing_changing','medium','draft_needs_founder_review'),
  ('folding changing table','folding changing table','changing-table','Changing Table','bathing_changing','medium','draft_needs_founder_review'),
  ('nappy caddy','nappy caddy','nappy-caddy','Nappy Caddy','bathing_changing','medium','draft_needs_founder_review'),
  ('baby nappy caddy','baby nappy caddy','nappy-caddy','Nappy Caddy','bathing_changing','medium','draft_needs_founder_review'),
  ('portable nappy caddy','portable nappy caddy','nappy-caddy','Nappy Caddy','bathing_changing','medium','draft_needs_founder_review'),
  ('folding nappy caddy','folding nappy caddy','nappy-caddy','Nappy Caddy','bathing_changing','medium','draft_needs_founder_review'),
  ('nappy bin','nappy bin','nappy-bin','Nappy Bin','bathing_changing','medium','draft_needs_founder_review'),
  ('baby nappy bin','baby nappy bin','nappy-bin','Nappy Bin','bathing_changing','medium','draft_needs_founder_review'),
  ('portable nappy bin','portable nappy bin','nappy-bin','Nappy Bin','bathing_changing','medium','draft_needs_founder_review'),
  ('folding nappy bin','folding nappy bin','nappy-bin','Nappy Bin','bathing_changing','medium','draft_needs_founder_review'),
  ('baby bath','baby bath','baby-bath','Baby Bath','bathing_changing','medium','draft_needs_founder_review'),
  ('baby baby bath','baby baby bath','baby-bath','Baby Bath','bathing_changing','medium','draft_needs_founder_review'),
  ('portable baby bath','portable baby bath','baby-bath','Baby Bath','bathing_changing','medium','draft_needs_founder_review'),
  ('folding baby bath','folding baby bath','baby-bath','Baby Bath','bathing_changing','medium','draft_needs_founder_review'),
  ('bath support','bath support','bath-support','Bath Support','bathing_changing','medium','draft_needs_founder_review'),
  ('baby bath support','baby bath support','bath-support','Bath Support','bathing_changing','medium','draft_needs_founder_review'),
  ('portable bath support','portable bath support','bath-support','Bath Support','bathing_changing','medium','draft_needs_founder_review'),
  ('folding bath support','folding bath support','bath-support','Bath Support','bathing_changing','medium','draft_needs_founder_review'),
  ('bath seat','bath seat','bath-seat','Bath Seat','bathing_changing','medium','draft_needs_founder_review'),
  ('baby bath seat','baby bath seat','bath-seat','Bath Seat','bathing_changing','medium','draft_needs_founder_review'),
  ('portable bath seat','portable bath seat','bath-seat','Bath Seat','bathing_changing','medium','draft_needs_founder_review'),
  ('folding bath seat','folding bath seat','bath-seat','Bath Seat','bathing_changing','medium','draft_needs_founder_review'),
  ('potty','potty','potty','Potty','bathing_changing','medium','draft_needs_founder_review'),
  ('training potty','training potty','potty','Potty','bathing_changing','medium','draft_needs_founder_review'),
  ('toilet training potty','toilet training potty','potty','Potty','bathing_changing','medium','draft_needs_founder_review'),
  ('potty chair','potty chair','potty','Potty','bathing_changing','medium','draft_needs_founder_review'),
  ('toilet trainer seat','toilet trainer seat','toilet-trainer-seat','Toilet Trainer Seat','bathing_changing','medium','draft_needs_founder_review'),
  ('toddler toilet trainer seat','toddler toilet trainer seat','toilet-trainer-seat','Toilet Trainer Seat','bathing_changing','medium','draft_needs_founder_review'),
  ('portable toilet trainer seat','portable toilet trainer seat','toilet-trainer-seat','Toilet Trainer Seat','bathing_changing','medium','draft_needs_founder_review'),
  ('folding toilet trainer seat','folding toilet trainer seat','toilet-trainer-seat','Toilet Trainer Seat','bathing_changing','medium','draft_needs_founder_review'),
  ('step stool','step stool','step-stool','Step Stool','bathing_changing','medium','draft_needs_founder_review'),
  ('toddler step stool','toddler step stool','step-stool','Step Stool','bathing_changing','medium','draft_needs_founder_review'),
  ('portable step stool','portable step stool','step-stool','Step Stool','bathing_changing','medium','draft_needs_founder_review'),
  ('folding step stool','folding step stool','step-stool','Step Stool','bathing_changing','medium','draft_needs_founder_review'),
  ('hooded towel','hooded towel','hooded-towel','Hooded Towel','bathing_changing','medium','draft_needs_founder_review'),
  ('toddler hooded towel','toddler hooded towel','hooded-towel','Hooded Towel','bathing_changing','medium','draft_needs_founder_review'),
  ('portable hooded towel','portable hooded towel','hooded-towel','Hooded Towel','bathing_changing','medium','draft_needs_founder_review'),
  ('folding hooded towel','folding hooded towel','hooded-towel','Hooded Towel','bathing_changing','medium','draft_needs_founder_review'),
  ('bath toy organiser','bath toy organiser','bath-toy-organiser','Bath Toy Organiser','bathing_changing','medium','draft_needs_founder_review'),
  ('toddler bath toy organiser','toddler bath toy organiser','bath-toy-organiser','Bath Toy Organiser','bathing_changing','medium','draft_needs_founder_review'),
  ('portable bath toy organiser','portable bath toy organiser','bath-toy-organiser','Bath Toy Organiser','bathing_changing','medium','draft_needs_founder_review'),
  ('folding bath toy organiser','folding bath toy organiser','bath-toy-organiser','Bath Toy Organiser','bathing_changing','medium','draft_needs_founder_review'),
  ('stair gate','stair gate','stair-gate','Stair Gate','safety','medium','draft_needs_founder_review'),
  ('toddler stair gate','toddler stair gate','stair-gate','Stair Gate','safety','medium','draft_needs_founder_review'),
  ('portable stair gate','portable stair gate','stair-gate','Stair Gate','safety','medium','draft_needs_founder_review'),
  ('stair gate set','stair gate set','stair-gate','Stair Gate','safety','medium','draft_needs_founder_review'),
  ('playpen','playpen','playpen','Playpen','safety','medium','draft_needs_founder_review'),
  ('toddler playpen','toddler playpen','playpen','Playpen','safety','medium','draft_needs_founder_review'),
  ('portable playpen','portable playpen','playpen','Playpen','safety','medium','draft_needs_founder_review'),
  ('playpen set','playpen set','playpen','Playpen','safety','medium','draft_needs_founder_review'),
  ('bed rail','bed rail','bed-rail','Bed Rail','safety','medium','draft_needs_founder_review'),
  ('toddler bed rail','toddler bed rail','bed-rail','Bed Rail','safety','medium','draft_needs_founder_review'),
  ('portable bed rail','portable bed rail','bed-rail','Bed Rail','safety','medium','draft_needs_founder_review'),
  ('bed rail set','bed rail set','bed-rail','Bed Rail','safety','medium','draft_needs_founder_review'),
  ('socket covers','socket covers','socket-covers','Socket Covers','safety','medium','draft_needs_founder_review'),
  ('toddler socket covers','toddler socket covers','socket-covers','Socket Covers','safety','medium','draft_needs_founder_review'),
  ('portable socket covers','portable socket covers','socket-covers','Socket Covers','safety','medium','draft_needs_founder_review'),
  ('socket covers set','socket covers set','socket-covers','Socket Covers','safety','medium','draft_needs_founder_review'),
  ('cupboard locks','cupboard locks','cupboard-locks','Cupboard Locks','safety','medium','draft_needs_founder_review'),
  ('toddler cupboard locks','toddler cupboard locks','cupboard-locks','Cupboard Locks','safety','medium','draft_needs_founder_review'),
  ('portable cupboard locks','portable cupboard locks','cupboard-locks','Cupboard Locks','safety','medium','draft_needs_founder_review'),
  ('cupboard locks set','cupboard locks set','cupboard-locks','Cupboard Locks','safety','medium','draft_needs_founder_review'),
  ('corner guards','corner guards','corner-guards','Corner Guards','safety','medium','draft_needs_founder_review'),
  ('toddler corner guards','toddler corner guards','corner-guards','Corner Guards','safety','medium','draft_needs_founder_review'),
  ('portable corner guards','portable corner guards','corner-guards','Corner Guards','safety','medium','draft_needs_founder_review'),
  ('corner guards set','corner guards set','corner-guards','Corner Guards','safety','medium','draft_needs_founder_review'),
  ('fire guard','fire guard','fire-guard','Fire Guard','safety','medium','draft_needs_founder_review'),
  ('toddler fire guard','toddler fire guard','fire-guard','Fire Guard','safety','medium','draft_needs_founder_review'),
  ('portable fire guard','portable fire guard','fire-guard','Fire Guard','safety','medium','draft_needs_founder_review'),
  ('fire guard set','fire guard set','fire-guard','Fire Guard','safety','medium','draft_needs_founder_review'),
  ('baby proofing kit','baby proofing kit','baby-proofing-kit','Baby Proofing Kit','safety','medium','draft_needs_founder_review'),
  ('toddler baby proofing kit','toddler baby proofing kit','baby-proofing-kit','Baby Proofing Kit','safety','medium','draft_needs_founder_review'),
  ('portable baby proofing kit','portable baby proofing kit','baby-proofing-kit','Baby Proofing Kit','safety','medium','draft_needs_founder_review'),
  ('baby proofing kit set','baby proofing kit set','baby-proofing-kit','Baby Proofing Kit','safety','medium','draft_needs_founder_review'),
  ('baby monitor camera','baby monitor camera','baby-monitor-camera','Baby Monitor Camera','safety','medium','draft_needs_founder_review'),
  ('toddler baby monitor camera','toddler baby monitor camera','baby-monitor-camera','Baby Monitor Camera','safety','medium','draft_needs_founder_review'),
  ('portable baby monitor camera','portable baby monitor camera','baby-monitor-camera','Baby Monitor Camera','safety','medium','draft_needs_founder_review'),
  ('baby monitor camera set','baby monitor camera set','baby-monitor-camera','Baby Monitor Camera','safety','medium','draft_needs_founder_review'),
  ('door stopper','door stopper','door-stopper','Door Stopper','safety','medium','draft_needs_founder_review'),
  ('toddler door stopper','toddler door stopper','door-stopper','Door Stopper','safety','medium','draft_needs_founder_review'),
  ('portable door stopper','portable door stopper','door-stopper','Door Stopper','safety','medium','draft_needs_founder_review'),
  ('door stopper set','door stopper set','door-stopper','Door Stopper','safety','medium','draft_needs_founder_review'),
  ('baby bouncer','baby bouncer','baby-bouncer','Baby Bouncer','activity_gear','medium','draft_needs_founder_review'),
  ('baby baby bouncer','baby baby bouncer','baby-bouncer','Baby Bouncer','activity_gear','medium','draft_needs_founder_review'),
  ('portable baby bouncer','portable baby bouncer','baby-bouncer','Baby Bouncer','activity_gear','medium','draft_needs_founder_review'),
  ('baby bouncer set','baby bouncer set','baby-bouncer','Baby Bouncer','activity_gear','medium','draft_needs_founder_review'),
  ('baby rocker','baby rocker','baby-rocker','Baby Rocker','activity_gear','medium','draft_needs_founder_review'),
  ('baby baby rocker','baby baby rocker','baby-rocker','Baby Rocker','activity_gear','medium','draft_needs_founder_review'),
  ('portable baby rocker','portable baby rocker','baby-rocker','Baby Rocker','activity_gear','medium','draft_needs_founder_review'),
  ('baby rocker set','baby rocker set','baby-rocker','Baby Rocker','activity_gear','medium','draft_needs_founder_review'),
  ('sit me up seat','sit me up seat','sit-me-up-seat','Sit Me Up Seat','activity_gear','medium','draft_needs_founder_review'),
  ('baby sit me up seat','baby sit me up seat','sit-me-up-seat','Sit Me Up Seat','activity_gear','medium','draft_needs_founder_review'),
  ('portable sit me up seat','portable sit me up seat','sit-me-up-seat','Sit Me Up Seat','activity_gear','medium','draft_needs_founder_review'),
  ('sit me up seat set','sit me up seat set','sit-me-up-seat','Sit Me Up Seat','activity_gear','medium','draft_needs_founder_review'),
  ('activity centre','activity centre','activity-centre','Activity Centre','activity_gear','medium','draft_needs_founder_review'),
  ('baby activity centre','baby activity centre','activity-centre','Activity Centre','activity_gear','medium','draft_needs_founder_review'),
  ('portable activity centre','portable activity centre','activity-centre','Activity Centre','activity_gear','medium','draft_needs_founder_review'),
  ('activity centre set','activity centre set','activity-centre','Activity Centre','activity_gear','medium','draft_needs_founder_review'),
  ('jumperoo','jumperoo','jumperoo','Jumperoo','activity_gear','medium','draft_needs_founder_review'),
  ('baby jumperoo','baby jumperoo','jumperoo','Jumperoo','activity_gear','medium','draft_needs_founder_review'),
  ('portable jumperoo','portable jumperoo','jumperoo','Jumperoo','activity_gear','medium','draft_needs_founder_review'),
  ('jumperoo set','jumperoo set','jumperoo','Jumperoo','activity_gear','medium','draft_needs_founder_review'),
  ('baby walker','baby walker','baby-walker','Baby Walker','activity_gear','medium','draft_needs_founder_review'),
  ('baby baby walker','baby baby walker','baby-walker','Baby Walker','activity_gear','medium','draft_needs_founder_review'),
  ('portable baby walker','portable baby walker','baby-walker','Baby Walker','activity_gear','medium','draft_needs_founder_review'),
  ('baby walker set','baby walker set','baby-walker','Baby Walker','activity_gear','medium','draft_needs_founder_review'),
  ('play gym','play gym','play-gym','Play Gym','activity_gear','medium','draft_needs_founder_review'),
  ('baby play gym','baby play gym','play-gym','Play Gym','activity_gear','medium','draft_needs_founder_review'),
  ('portable play gym','portable play gym','play-gym','Play Gym','activity_gear','medium','draft_needs_founder_review'),
  ('play gym set','play gym set','play-gym','Play Gym','activity_gear','medium','draft_needs_founder_review'),
  ('play mat','play mat','play-mat','Play Mat','activity_gear','medium','draft_needs_founder_review'),
  ('baby play mat','baby play mat','play-mat','Play Mat','activity_gear','medium','draft_needs_founder_review'),
  ('portable play mat','portable play mat','play-mat','Play Mat','activity_gear','medium','draft_needs_founder_review'),
  ('play mat set','play mat set','play-mat','Play Mat','activity_gear','medium','draft_needs_founder_review'),
  ('tummy time mat','tummy time mat','tummy-time-mat','Tummy Time Mat','activity_gear','medium','draft_needs_founder_review'),
  ('baby tummy time mat','baby tummy time mat','tummy-time-mat','Tummy Time Mat','activity_gear','medium','draft_needs_founder_review'),
  ('portable tummy time mat','portable tummy time mat','tummy-time-mat','Tummy Time Mat','activity_gear','medium','draft_needs_founder_review'),
  ('tummy time mat set','tummy time mat set','tummy-time-mat','Tummy Time Mat','activity_gear','medium','draft_needs_founder_review'),
  ('tummy time pillow','tummy time pillow','tummy-time-pillow','Tummy Time Pillow','activity_gear','medium','draft_needs_founder_review'),
  ('baby tummy time pillow','baby tummy time pillow','tummy-time-pillow','Tummy Time Pillow','activity_gear','medium','draft_needs_founder_review'),
  ('portable tummy time pillow','portable tummy time pillow','tummy-time-pillow','Tummy Time Pillow','activity_gear','medium','draft_needs_founder_review'),
  ('tummy time pillow set','tummy time pillow set','tummy-time-pillow','Tummy Time Pillow','activity_gear','medium','draft_needs_founder_review'),
  ('door bouncer','door bouncer','door-bouncer','Door Bouncer','activity_gear','medium','draft_needs_founder_review'),
  ('baby door bouncer','baby door bouncer','door-bouncer','Door Bouncer','activity_gear','medium','draft_needs_founder_review'),
  ('portable door bouncer','portable door bouncer','door-bouncer','Door Bouncer','activity_gear','medium','draft_needs_founder_review'),
  ('door bouncer set','door bouncer set','door-bouncer','Door Bouncer','activity_gear','medium','draft_needs_founder_review'),
  ('toy storage','toy storage','toy-storage','Toy Storage','activity_gear','medium','draft_needs_founder_review'),
  ('toddler toy storage','toddler toy storage','toy-storage','Toy Storage','activity_gear','medium','draft_needs_founder_review'),
  ('portable toy storage','portable toy storage','toy-storage','Toy Storage','activity_gear','medium','draft_needs_founder_review'),
  ('toy storage set','toy storage set','toy-storage','Toy Storage','activity_gear','medium','draft_needs_founder_review'),
  ('changing unit','changing unit','changing-unit','Changing Unit','nursery_furniture','medium','draft_needs_founder_review'),
  ('toddler changing unit','toddler changing unit','changing-unit','Changing Unit','nursery_furniture','medium','draft_needs_founder_review'),
  ('wooden changing unit','wooden changing unit','changing-unit','Changing Unit','nursery_furniture','medium','draft_needs_founder_review'),
  ('changing unit set','changing unit set','changing-unit','Changing Unit','nursery_furniture','medium','draft_needs_founder_review'),
  ('dresser','dresser','dresser','Dresser','nursery_furniture','medium','draft_needs_founder_review'),
  ('toddler dresser','toddler dresser','dresser','Dresser','nursery_furniture','medium','draft_needs_founder_review'),
  ('wooden dresser','wooden dresser','dresser','Dresser','nursery_furniture','medium','draft_needs_founder_review'),
  ('dresser set','dresser set','dresser','Dresser','nursery_furniture','medium','draft_needs_founder_review'),
  ('nursery wardrobe','nursery wardrobe','nursery-wardrobe','Nursery Wardrobe','nursery_furniture','medium','draft_needs_founder_review'),
  ('toddler nursery wardrobe','toddler nursery wardrobe','nursery-wardrobe','Nursery Wardrobe','nursery_furniture','medium','draft_needs_founder_review'),
  ('wooden nursery wardrobe','wooden nursery wardrobe','nursery-wardrobe','Nursery Wardrobe','nursery_furniture','medium','draft_needs_founder_review'),
  ('nursery wardrobe set','nursery wardrobe set','nursery-wardrobe','Nursery Wardrobe','nursery_furniture','medium','draft_needs_founder_review'),
  ('bookcase','bookcase','bookcase','Bookcase','nursery_furniture','medium','draft_needs_founder_review'),
  ('toddler bookcase','toddler bookcase','bookcase','Bookcase','nursery_furniture','medium','draft_needs_founder_review'),
  ('wooden bookcase','wooden bookcase','bookcase','Bookcase','nursery_furniture','medium','draft_needs_founder_review'),
  ('bookcase set','bookcase set','bookcase','Bookcase','nursery_furniture','medium','draft_needs_founder_review'),
  ('toy box','toy box','toy-box','Toy Box','nursery_furniture','medium','draft_needs_founder_review'),
  ('toddler toy box','toddler toy box','toy-box','Toy Box','nursery_furniture','medium','draft_needs_founder_review'),
  ('wooden toy box','wooden toy box','toy-box','Toy Box','nursery_furniture','medium','draft_needs_founder_review'),
  ('toy box set','toy box set','toy-box','Toy Box','nursery_furniture','medium','draft_needs_founder_review'),
  ('shelving unit','shelving unit','shelving-unit','Shelving Unit','nursery_furniture','medium','draft_needs_founder_review'),
  ('toddler shelving unit','toddler shelving unit','shelving-unit','Shelving Unit','nursery_furniture','medium','draft_needs_founder_review'),
  ('wooden shelving unit','wooden shelving unit','shelving-unit','Shelving Unit','nursery_furniture','medium','draft_needs_founder_review'),
  ('shelving unit set','shelving unit set','shelving-unit','Shelving Unit','nursery_furniture','medium','draft_needs_founder_review'),
  ('rocking chair','rocking chair','rocking-chair','Rocking Chair','nursery_furniture','medium','draft_needs_founder_review'),
  ('toddler rocking chair','toddler rocking chair','rocking-chair','Rocking Chair','nursery_furniture','medium','draft_needs_founder_review'),
  ('wooden rocking chair','wooden rocking chair','rocking-chair','Rocking Chair','nursery_furniture','medium','draft_needs_founder_review'),
  ('rocking chair set','rocking chair set','rocking-chair','Rocking Chair','nursery_furniture','medium','draft_needs_founder_review'),
  ('nursing chair','nursing chair','nursing-chair','Nursing Chair','nursery_furniture','medium','draft_needs_founder_review'),
  ('toddler nursing chair','toddler nursing chair','nursing-chair','Nursing Chair','nursery_furniture','medium','draft_needs_founder_review'),
  ('wooden nursing chair','wooden nursing chair','nursing-chair','Nursing Chair','nursery_furniture','medium','draft_needs_founder_review'),
  ('nursing chair set','nursing chair set','nursing-chair','Nursing Chair','nursery_furniture','medium','draft_needs_founder_review'),
  ('glider chair','glider chair','glider-chair','Glider Chair','nursery_furniture','medium','draft_needs_founder_review'),
  ('toddler glider chair','toddler glider chair','glider-chair','Glider Chair','nursery_furniture','medium','draft_needs_founder_review'),
  ('wooden glider chair','wooden glider chair','glider-chair','Glider Chair','nursery_furniture','medium','draft_needs_founder_review'),
  ('glider chair set','glider chair set','glider-chair','Glider Chair','nursery_furniture','medium','draft_needs_founder_review'),
  ('kids table and chairs','kids table and chairs','kids-table-and-chairs','Kids Table And Chairs','nursery_furniture','medium','draft_needs_founder_review'),
  ('toddler kids table and chairs','toddler kids table and chairs','kids-table-and-chairs','Kids Table And Chairs','nursery_furniture','medium','draft_needs_founder_review'),
  ('wooden kids table and chairs','wooden kids table and chairs','kids-table-and-chairs','Kids Table And Chairs','nursery_furniture','medium','draft_needs_founder_review'),
  ('kids table and chairs set','kids table and chairs set','kids-table-and-chairs','Kids Table And Chairs','nursery_furniture','medium','draft_needs_founder_review'),
  ('rattle','rattle','rattle','Rattle','toys','medium','draft_needs_founder_review'),
  ('baby rattle','baby rattle','rattle','Rattle','toys','medium','draft_needs_founder_review'),
  ('wooden rattle','wooden rattle','rattle','Rattle','toys','medium','draft_needs_founder_review'),
  ('rattle set','rattle set','rattle','Rattle','toys','medium','draft_needs_founder_review'),
  ('teether','teether','teether','Teether','toys','medium','draft_needs_founder_review'),
  ('baby teether','baby teether','teether','Teether','toys','medium','draft_needs_founder_review'),
  ('wooden teether','wooden teether','teether','Teether','toys','medium','draft_needs_founder_review'),
  ('teether set','teether set','teether','Teether','toys','medium','draft_needs_founder_review'),
  ('sensory toy','sensory toy','sensory-toy','Sensory Toy','toys','medium','draft_needs_founder_review'),
  ('baby sensory toy','baby sensory toy','sensory-toy','Sensory Toy','toys','medium','draft_needs_founder_review'),
  ('wooden sensory toy','wooden sensory toy','sensory-toy','Sensory Toy','toys','medium','draft_needs_founder_review'),
  ('sensory toy set','sensory toy set','sensory-toy','Sensory Toy','toys','medium','draft_needs_founder_review'),
  ('soft book','soft book','soft-book','Soft Book','toys','medium','draft_needs_founder_review'),
  ('baby soft book','baby soft book','soft-book','Soft Book','toys','medium','draft_needs_founder_review'),
  ('wooden soft book','wooden soft book','soft-book','Soft Book','toys','medium','draft_needs_founder_review'),
  ('soft book set','soft book set','soft-book','Soft Book','toys','medium','draft_needs_founder_review'),
  ('board book','board book','board-book','Board Book','toys','medium','draft_needs_founder_review'),
  ('baby board book','baby board book','board-book','Board Book','toys','medium','draft_needs_founder_review'),
  ('wooden board book','wooden board book','board-book','Board Book','toys','medium','draft_needs_founder_review'),
  ('board book set','board book set','board-book','Board Book','toys','medium','draft_needs_founder_review'),
  ('musical toy','musical toy','musical-toy','Musical Toy','toys','medium','draft_needs_founder_review'),
  ('baby musical toy','baby musical toy','musical-toy','Musical Toy','toys','medium','draft_needs_founder_review'),
  ('wooden musical toy','wooden musical toy','musical-toy','Musical Toy','toys','medium','draft_needs_founder_review'),
  ('musical toy set','musical toy set','musical-toy','Musical Toy','toys','medium','draft_needs_founder_review'),
  ('stacking rings','stacking rings','stacking-rings','Stacking Rings','toys','medium','draft_needs_founder_review'),
  ('baby stacking rings','baby stacking rings','stacking-rings','Stacking Rings','toys','medium','draft_needs_founder_review'),
  ('wooden stacking rings','wooden stacking rings','stacking-rings','Stacking Rings','toys','medium','draft_needs_founder_review'),
  ('stacking rings set','stacking rings set','stacking-rings','Stacking Rings','toys','medium','draft_needs_founder_review'),
  ('shape sorter','shape sorter','shape-sorter','Shape Sorter','toys','medium','draft_needs_founder_review'),
  ('baby shape sorter','baby shape sorter','shape-sorter','Shape Sorter','toys','medium','draft_needs_founder_review'),
  ('wooden shape sorter','wooden shape sorter','shape-sorter','Shape Sorter','toys','medium','draft_needs_founder_review'),
  ('shape sorter set','shape sorter set','shape-sorter','Shape Sorter','toys','medium','draft_needs_founder_review'),
  ('activity cube','activity cube','activity-cube','Activity Cube','toys','medium','draft_needs_founder_review'),
  ('baby activity cube','baby activity cube','activity-cube','Activity Cube','toys','medium','draft_needs_founder_review'),
  ('wooden activity cube','wooden activity cube','activity-cube','Activity Cube','toys','medium','draft_needs_founder_review'),
  ('activity cube set','activity cube set','activity-cube','Activity Cube','toys','medium','draft_needs_founder_review'),
  ('ball drop toy','ball drop toy','ball-drop-toy','Ball Drop Toy','toys','medium','draft_needs_founder_review'),
  ('baby ball drop toy','baby ball drop toy','ball-drop-toy','Ball Drop Toy','toys','medium','draft_needs_founder_review'),
  ('wooden ball drop toy','wooden ball drop toy','ball-drop-toy','Ball Drop Toy','toys','medium','draft_needs_founder_review'),
  ('ball drop toy set','ball drop toy set','ball-drop-toy','Ball Drop Toy','toys','medium','draft_needs_founder_review'),
  ('xylophone','xylophone','xylophone','Xylophone','toys','medium','draft_needs_founder_review'),
  ('baby xylophone','baby xylophone','xylophone','Xylophone','toys','medium','draft_needs_founder_review'),
  ('wooden xylophone','wooden xylophone','xylophone','Xylophone','toys','medium','draft_needs_founder_review'),
  ('xylophone set','xylophone set','xylophone','Xylophone','toys','medium','draft_needs_founder_review'),
  ('toy drum','toy drum','toy-drum','Toy Drum','toys','medium','draft_needs_founder_review'),
  ('baby toy drum','baby toy drum','toy-drum','Toy Drum','toys','medium','draft_needs_founder_review'),
  ('wooden toy drum','wooden toy drum','toy-drum','Toy Drum','toys','medium','draft_needs_founder_review'),
  ('toy drum set','toy drum set','toy-drum','Toy Drum','toys','medium','draft_needs_founder_review'),
  ('rainmaker','rainmaker','rainmaker','Rainmaker','toys','medium','draft_needs_founder_review'),
  ('baby rainmaker','baby rainmaker','rainmaker','Rainmaker','toys','medium','draft_needs_founder_review'),
  ('wooden rainmaker','wooden rainmaker','rainmaker','Rainmaker','toys','medium','draft_needs_founder_review'),
  ('rainmaker set','rainmaker set','rainmaker','Rainmaker','toys','medium','draft_needs_founder_review'),
  ('nesting cups','nesting cups','nesting-cups','Nesting Cups','toys','medium','draft_needs_founder_review'),
  ('baby nesting cups','baby nesting cups','nesting-cups','Nesting Cups','toys','medium','draft_needs_founder_review'),
  ('wooden nesting cups','wooden nesting cups','nesting-cups','Nesting Cups','toys','medium','draft_needs_founder_review'),
  ('nesting cups set','nesting cups set','nesting-cups','Nesting Cups','toys','medium','draft_needs_founder_review'),
  ('peg puzzle','peg puzzle','peg-puzzle','Peg Puzzle','toys','medium','draft_needs_founder_review'),
  ('baby peg puzzle','baby peg puzzle','peg-puzzle','Peg Puzzle','toys','medium','draft_needs_founder_review'),
  ('wooden peg puzzle','wooden peg puzzle','peg-puzzle','Peg Puzzle','toys','medium','draft_needs_founder_review'),
  ('peg puzzle set','peg puzzle set','peg-puzzle','Peg Puzzle','toys','medium','draft_needs_founder_review'),
  ('wooden blocks','wooden blocks','wooden-blocks','Wooden Blocks','toys','medium','draft_needs_founder_review'),
  ('toddler wooden blocks','toddler wooden blocks','wooden-blocks','Wooden Blocks','toys','medium','draft_needs_founder_review'),
  ('wooden wooden blocks','wooden wooden blocks','wooden-blocks','Wooden Blocks','toys','medium','draft_needs_founder_review'),
  ('wooden blocks set','wooden blocks set','wooden-blocks','Wooden Blocks','toys','medium','draft_needs_founder_review'),
  ('magnetic tiles','magnetic tiles','magnetic-tiles','Magnetic Tiles','toys','medium','draft_needs_founder_review'),
  ('toddler magnetic tiles','toddler magnetic tiles','magnetic-tiles','Magnetic Tiles','toys','medium','draft_needs_founder_review'),
  ('wooden magnetic tiles','wooden magnetic tiles','magnetic-tiles','Magnetic Tiles','toys','medium','draft_needs_founder_review'),
  ('magnetic tiles set','magnetic tiles set','magnetic-tiles','Magnetic Tiles','toys','medium','draft_needs_founder_review'),
  ('duplo','duplo','duplo','Duplo','toys','medium','draft_needs_founder_review'),
  ('toddler duplo','toddler duplo','duplo','Duplo','toys','medium','draft_needs_founder_review'),
  ('wooden duplo','wooden duplo','duplo','Duplo','toys','medium','draft_needs_founder_review'),
  ('duplo set','duplo set','duplo','Duplo','toys','medium','draft_needs_founder_review'),
  ('wooden train set','wooden train set','wooden-train-set','Wooden Train Set','toys','medium','draft_needs_founder_review'),
  ('train set','train set','wooden-train-set','Wooden Train Set','toys','medium','draft_needs_founder_review'),
  ('brio train set','brio train set','wooden-train-set','Wooden Train Set','toys','medium','draft_needs_founder_review'),
  ('train tracks','train tracks','wooden-train-set','Wooden Train Set','toys','medium','draft_needs_founder_review'),
  ('train table','train table','train-table','Train Table','toys','medium','draft_needs_founder_review'),
  ('toddler train table','toddler train table','train-table','Train Table','toys','medium','draft_needs_founder_review'),
  ('wooden train table','wooden train table','train-table','Train Table','toys','medium','draft_needs_founder_review'),
  ('train table set','train table set','train-table','Train Table','toys','medium','draft_needs_founder_review'),
  ('baby doll','baby doll','baby-doll','Baby Doll','toys','medium','draft_needs_founder_review'),
  ('toddler baby doll','toddler baby doll','baby-doll','Baby Doll','toys','medium','draft_needs_founder_review'),
  ('wooden baby doll','wooden baby doll','baby-doll','Baby Doll','toys','medium','draft_needs_founder_review'),
  ('baby doll set','baby doll set','baby-doll','Baby Doll','toys','medium','draft_needs_founder_review'),
  ('teddy bear','teddy bear','teddy-bear','Teddy Bear','toys','medium','draft_needs_founder_review'),
  ('toddler teddy bear','toddler teddy bear','teddy-bear','Teddy Bear','toys','medium','draft_needs_founder_review'),
  ('wooden teddy bear','wooden teddy bear','teddy-bear','Teddy Bear','toys','medium','draft_needs_founder_review'),
  ('teddy bear set','teddy bear set','teddy-bear','Teddy Bear','toys','medium','draft_needs_founder_review'),
  ('puzzle board','puzzle board','puzzle-board','Puzzle Board','toys','medium','draft_needs_founder_review'),
  ('toddler puzzle board','toddler puzzle board','puzzle-board','Puzzle Board','toys','medium','draft_needs_founder_review'),
  ('wooden puzzle board','wooden puzzle board','puzzle-board','Puzzle Board','toys','medium','draft_needs_founder_review'),
  ('puzzle board set','puzzle board set','puzzle-board','Puzzle Board','toys','medium','draft_needs_founder_review'),
  ('busy board','busy board','busy-board','Busy Board','toys','medium','draft_needs_founder_review'),
  ('toddler busy board','toddler busy board','busy-board','Busy Board','toys','medium','draft_needs_founder_review'),
  ('wooden busy board','wooden busy board','busy-board','Busy Board','toys','medium','draft_needs_founder_review'),
  ('busy board set','busy board set','busy-board','Busy Board','toys','medium','draft_needs_founder_review'),
  ('easel','easel','easel','Easel','toys','medium','draft_needs_founder_review'),
  ('toddler easel','toddler easel','easel','Easel','toys','medium','draft_needs_founder_review'),
  ('wooden easel','wooden easel','easel','Easel','toys','medium','draft_needs_founder_review'),
  ('easel set','easel set','easel','Easel','toys','medium','draft_needs_founder_review'),
  ('play kitchen','play kitchen','play-kitchen','Play Kitchen','pretend_play','medium','draft_needs_founder_review'),
  ('toy kitchen','toy kitchen','play-kitchen','Play Kitchen','pretend_play','medium','draft_needs_founder_review'),
  ('wooden play kitchen','wooden play kitchen','play-kitchen','Play Kitchen','pretend_play','medium','draft_needs_founder_review'),
  ('pretend kitchen','pretend kitchen','play-kitchen','Play Kitchen','pretend_play','medium','draft_needs_founder_review'),
  ('toy till','toy till','toy-till','Toy Till','pretend_play','medium','draft_needs_founder_review'),
  ('cash register','cash register','toy-till','Toy Till','pretend_play','medium','draft_needs_founder_review'),
  ('shopping till','shopping till','toy-till','Toy Till','pretend_play','medium','draft_needs_founder_review'),
  ('shop till','shop till','toy-till','Toy Till','pretend_play','medium','draft_needs_founder_review'),
  ('shopping trolley','shopping trolley','shopping-trolley','Shopping Trolley','pretend_play','medium','draft_needs_founder_review'),
  ('toddler shopping trolley','toddler shopping trolley','shopping-trolley','Shopping Trolley','pretend_play','medium','draft_needs_founder_review'),
  ('wooden shopping trolley','wooden shopping trolley','shopping-trolley','Shopping Trolley','pretend_play','medium','draft_needs_founder_review'),
  ('shopping trolley set','shopping trolley set','shopping-trolley','Shopping Trolley','pretend_play','medium','draft_needs_founder_review'),
  ('shopping basket toy','shopping basket toy','shopping-basket-toy','Shopping Basket Toy','pretend_play','medium','draft_needs_founder_review'),
  ('toddler shopping basket toy','toddler shopping basket toy','shopping-basket-toy','Shopping Basket Toy','pretend_play','medium','draft_needs_founder_review'),
  ('wooden shopping basket toy','wooden shopping basket toy','shopping-basket-toy','Shopping Basket Toy','pretend_play','medium','draft_needs_founder_review'),
  ('shopping basket toy set','shopping basket toy set','shopping-basket-toy','Shopping Basket Toy','pretend_play','medium','draft_needs_founder_review'),
  ('tool bench','tool bench','tool-bench','Tool Bench','pretend_play','medium','draft_needs_founder_review'),
  ('toddler tool bench','toddler tool bench','tool-bench','Tool Bench','pretend_play','medium','draft_needs_founder_review'),
  ('wooden tool bench','wooden tool bench','tool-bench','Tool Bench','pretend_play','medium','draft_needs_founder_review'),
  ('tool bench set','tool bench set','tool-bench','Tool Bench','pretend_play','medium','draft_needs_founder_review'),
  ('doctor set','doctor set','doctor-set','Doctor Set','pretend_play','medium','draft_needs_founder_review'),
  ('toddler doctor set','toddler doctor set','doctor-set','Doctor Set','pretend_play','medium','draft_needs_founder_review'),
  ('wooden doctor set','wooden doctor set','doctor-set','Doctor Set','pretend_play','medium','draft_needs_founder_review'),
  ('doctor set set','doctor set set','doctor-set','Doctor Set','pretend_play','medium','draft_needs_founder_review');

CREATE TEMP TABLE tmp_pr4_seed_filtered AS
WITH slug_overrides AS (
  -- Deterministic overlap collapse from CSV analysis:
  -- buggy / pushchair / stroller all point to one concept.
  SELECT 'pram'::TEXT AS from_slug, 'stroller'::TEXT AS to_slug, 'Stroller'::TEXT AS to_label
  UNION ALL SELECT 'pushchair', 'stroller', 'Stroller'
  UNION ALL SELECT 'stroller', 'stroller', 'Stroller'
)
SELECT DISTINCT
  public.normalize_inventory_alias(likely_listing_term) AS normalized_alias,
  likely_listing_term AS alias,
  COALESCE(o.to_slug, lower(trim(proposed_canonical_slug))) AS canonical_slug,
  COALESCE(o.to_label, trim(proposed_canonical_label)) AS canonical_label,
  lower(trim(category)) AS category
FROM tmp_pr4_seed_stage
LEFT JOIN slug_overrides o
  ON lower(trim(proposed_canonical_slug)) = o.from_slug
WHERE seed_confidence = 'medium'
  AND review_status = 'draft_needs_founder_review'
  AND public.normalize_inventory_alias(likely_listing_term) <> '';

CREATE TEMP TABLE tmp_pr4_canonical_candidates AS
SELECT DISTINCT
  canonical_slug,
  canonical_label,
  category,
  public.normalize_inventory_alias(canonical_label) AS normalized_label
FROM tmp_pr4_seed_filtered;

-- Deterministic existing match candidates: slug -> normalized label -> alias
CREATE TEMP TABLE tmp_pr4_existing_candidates AS
SELECT
  c.canonical_slug,
  c.canonical_label,
  c.normalized_label,
  pt.id AS product_type_id,
  'slug'::TEXT AS match_rule,
  1 AS precedence
FROM tmp_pr4_canonical_candidates c
JOIN public.product_types pt ON pt.slug = c.canonical_slug
UNION ALL
SELECT
  c.canonical_slug,
  c.canonical_label,
  c.normalized_label,
  pt.id AS product_type_id,
  'normalized_label'::TEXT AS match_rule,
  2 AS precedence
FROM tmp_pr4_canonical_candidates c
JOIN public.product_types pt ON pt.normalized_label = c.normalized_label
UNION ALL
SELECT
  c.canonical_slug,
  c.canonical_label,
  c.normalized_label,
  pa.product_type_id,
  'existing_alias'::TEXT AS match_rule,
  3 AS precedence
FROM tmp_pr4_canonical_candidates c
JOIN public.product_type_aliases pa ON pa.normalized_alias = c.normalized_label;

CREATE TEMP TABLE tmp_pr4_resolved_map AS
WITH ranked AS (
  SELECT
    e.*,
    row_number() OVER (PARTITION BY e.canonical_slug ORDER BY e.precedence, e.product_type_id) AS rn,
    count(DISTINCT e.product_type_id) OVER (PARTITION BY e.canonical_slug) AS candidate_count
  FROM tmp_pr4_existing_candidates e
)
SELECT
  c.canonical_slug,
  c.canonical_label,
  c.category,
  c.normalized_label,
  r.product_type_id,
  COALESCE(r.match_rule, 'new') AS resolution_rule,
  COALESCE(r.candidate_count, 0) AS candidate_count
FROM tmp_pr4_canonical_candidates c
LEFT JOIN ranked r
  ON r.canonical_slug = c.canonical_slug
 AND r.rn = 1;

-- Ambiguous existing matches are deferred to avoid overwriting canonical truth.
CREATE TEMP TABLE tmp_pr4_ambiguous AS
SELECT *
FROM tmp_pr4_resolved_map
WHERE candidate_count > 1;

-- Create new product_types only where no deterministic existing mapping exists.
INSERT INTO public.product_types (slug, label, subtitle, is_active)
SELECT
  m.canonical_slug,
  m.canonical_label,
  initcap(replace(m.category, '_', ' ')),
  true
FROM tmp_pr4_resolved_map m
WHERE m.product_type_id IS NULL
  AND m.candidate_count = 0
ON CONFLICT (slug) DO NOTHING;

-- Final canonical slug -> product_type mapping after insert.
CREATE TEMP TABLE tmp_pr4_final_map AS
SELECT DISTINCT
  m.canonical_slug,
  m.canonical_label,
  m.category,
  m.normalized_label,
  pt.id AS product_type_id,
  CASE
    WHEN m.product_type_id IS NOT NULL THEN m.resolution_rule
    ELSE 'created_new'
  END AS resolution_rule,
  m.candidate_count
FROM tmp_pr4_resolved_map m
JOIN public.product_types pt
  ON pt.slug = m.canonical_slug
  OR pt.id = m.product_type_id;

-- Alias candidates from CSV terms + canonical label + canonical slug text form.
CREATE TEMP TABLE tmp_pr4_alias_candidates AS
SELECT DISTINCT
  fm.product_type_id,
  s.alias
FROM tmp_pr4_seed_filtered s
JOIN tmp_pr4_final_map fm ON fm.canonical_slug = s.canonical_slug
WHERE fm.candidate_count <= 1
  AND cardinality(regexp_split_to_array(public.normalize_inventory_alias(s.alias), '\s+')) <= 3
  AND public.normalize_inventory_alias(s.alias) !~ '^(used|second hand|preloved)\s'
  AND public.normalize_inventory_alias(s.alias) !~ '\s(bundle|set)$'
UNION
SELECT DISTINCT fm.product_type_id, fm.canonical_label AS alias
FROM tmp_pr4_final_map fm
WHERE fm.candidate_count <= 1
UNION
SELECT DISTINCT fm.product_type_id, replace(fm.canonical_slug, '-', ' ') AS alias
FROM tmp_pr4_final_map fm
WHERE fm.candidate_count <= 1;

CREATE TEMP TABLE tmp_pr4_alias_existing AS
SELECT DISTINCT
  ac.product_type_id,
  public.normalize_inventory_alias(ac.alias) AS normalized_alias
FROM tmp_pr4_alias_candidates ac
JOIN public.product_type_aliases pa
  ON pa.product_type_id = ac.product_type_id
 AND pa.normalized_alias = public.normalize_inventory_alias(ac.alias);

INSERT INTO public.product_type_aliases (product_type_id, alias)
SELECT DISTINCT
  a.product_type_id,
  a.alias
FROM tmp_pr4_alias_candidates a
WHERE public.normalize_inventory_alias(a.alias) <> ''
ON CONFLICT (product_type_id, normalized_alias) DO NOTHING;

-- Resolve unmatched queue terms now covered by canonical alias map.
UPDATE public.inventory_unmatched_queue uq
SET
  status = 'resolved',
  proposed_product_type_id = pa.product_type_id,
  resolution_note = 'resolved via PR4 CSV seed',
  resolved_at = COALESCE(uq.resolved_at, now()),
  updated_at = now()
FROM public.product_type_aliases pa
JOIN tmp_pr4_final_map fm ON fm.product_type_id = pa.product_type_id
WHERE uq.status IN ('new', 'reviewing')
  AND uq.normalized_query = pa.normalized_alias
  AND fm.candidate_count <= 1;

-- Verification bundle (copy outputs from SQL editor after running migration).
DO 
DECLARE
  v_types_before INT;
  v_types_after INT;
  v_alias_before INT;
  v_alias_after INT;
  v_created_new INT;
  v_alias_added INT;
  v_resolved_count INT;
BEGIN
  SELECT product_types_before, product_type_aliases_before
  INTO v_types_before, v_alias_before
  FROM tmp_pr4_baseline_counts;

  SELECT COUNT(*) INTO v_types_after FROM public.product_types;
  SELECT COUNT(*) INTO v_alias_after FROM public.product_type_aliases;
  SELECT COUNT(*) INTO v_created_new FROM tmp_pr4_final_map WHERE resolution_rule = 'created_new';
  SELECT COUNT(*) INTO v_alias_added FROM tmp_pr4_alias_candidates ac
  WHERE NOT EXISTS (
    SELECT 1 FROM tmp_pr4_alias_existing e
    WHERE e.product_type_id = ac.product_type_id
      AND e.normalized_alias = public.normalize_inventory_alias(ac.alias)
  );
  SELECT COUNT(*) INTO v_resolved_count
  FROM public.inventory_unmatched_queue
  WHERE resolution_note = 'resolved via PR4 CSV seed';

  RAISE NOTICE 'PR4 counts | product_types before=% after=% (+%)', v_types_before, v_types_after, (v_types_after - v_types_before);
  RAISE NOTICE 'PR4 counts | product_type_aliases before=% after=% (+%)', v_alias_before, v_alias_after, (v_alias_after - v_alias_before);
  RAISE NOTICE 'PR4 delta | new canonical=% aliases_added=% queue_resolved_total=%', v_created_new, v_alias_added, v_resolved_count;
END ;

-- Required spot-check matcher outputs.
SELECT 'pram' AS query, * FROM public.inventory_match_product_types('pram', 5);
SELECT 'cash register' AS query, * FROM public.inventory_match_product_types('cash register', 5);
SELECT 'potty' AS query, * FROM public.inventory_match_product_types('potty', 5);
SELECT 'foot gauge' AS query, * FROM public.inventory_match_product_types('foot gauge', 5);

-- New canonical product_types created by this migration.
SELECT
  pt.id,
  pt.slug,
  pt.label,
  pt.created_at
FROM public.product_types pt
JOIN tmp_pr4_final_map fm ON fm.product_type_id = pt.id
WHERE fm.resolution_rule = 'created_new'
ORDER BY pt.slug;

-- Ambiguous CSV canonical candidates intentionally deferred.
SELECT canonical_slug, canonical_label, candidate_count
FROM tmp_pr4_ambiguous
ORDER BY canonical_slug;
