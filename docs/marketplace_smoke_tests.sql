-- Marketplace RPC smoke tests. Run in Supabase SQL Editor after applying marketplace migrations.
-- Requires: 202603051200–202603051204 (pg_trgm, item types, suggest_marketplace_item_types).

-- 1) Short query "chair" – expect high chair, bath chair, booster seat, car seat, etc.
SELECT * FROM public.suggest_marketplace_item_types('chair', 5);

-- 2) "hi chair" – expect high chair as strong candidate
SELECT * FROM public.suggest_marketplace_item_types('hi chair', 5);

-- 3) "bath" – expect bath chair / bath seat as candidate
SELECT * FROM public.suggest_marketplace_item_types('bath', 5);
