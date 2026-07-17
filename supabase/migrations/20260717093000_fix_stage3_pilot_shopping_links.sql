-- Replace stale direct retailer URLs in the 34-36m Stage 3 pilot with
-- resilient shopping comparison searches.

BEGIN;

UPDATE public.pl_stage3_picks
SET
  retailer = 'Google Shopping',
  product_url = CASE pick_rank
    WHEN 2 THEN 'https://www.google.com/search?q=LEGO+DUPLO+3in1+Tree+House+10993&udm=28'
    WHEN 3 THEN 'https://www.google.com/search?q=Schleich+Farm+World+Starter+Set&udm=28'
    WHEN 4 THEN 'https://www.google.com/search?q=PLAYMOBIL+1.2.3+Recycling+Truck&udm=28'
    WHEN 5 THEN 'https://www.google.com/search?q=ELC+Happyland+Village+Set&udm=28'
    ELSE product_url
  END,
  price_text = CASE pick_rank
    WHEN 2 THEN 'Compare current prices'
    ELSE price_text
  END,
  stock_status = 'unknown',
  founder_qa_flag = 'shopping_search_link',
  updated_at = now()
WHERE age_band_id = '34-36m'
  AND source_category_entity_id = 'cat_small_world_figures'
  AND status = 'visible'
  AND pick_rank IN (2, 3, 4, 5);

COMMIT;
