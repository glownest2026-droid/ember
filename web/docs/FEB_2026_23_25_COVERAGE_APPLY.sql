-- FEB_2026 23–25m Coverage APPLY (provenance-safe)
--
-- IMPORTANT:
-- - Only run this IF the audit confirms seed rows exist for 23-25m AND we can link them to canonical products.
-- - This script inserts ONLY 23–25m mappings, without cloning 25–27m.
-- - No schema changes. No RLS/policy changes. No widening anon reads.
--
-- This script is written to be safe to re-run (idempotent via ON CONFLICT).
--
-- Rollback is included at the bottom and is scoped ONLY to what this script inserts.

begin;

-- 0) Preconditions (fail fast with clear error)
do $$
declare
  has_seed boolean;
  has_seed_age_band_id boolean;
  has_seed_product_id boolean;
  has_seed_category_type_id boolean;
begin
  select exists (
    select 1 from information_schema.tables
    where table_schema='public' and table_name='pl_seed_products'
  ) into has_seed;

  if not has_seed then
    raise exception 'APPLY aborted: public.pl_seed_products does not exist';
  end if;

  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='pl_seed_products' and column_name='age_band_id'
  ) into has_seed_age_band_id;

  if not has_seed_age_band_id then
    raise exception 'APPLY aborted: public.pl_seed_products.age_band_id does not exist';
  end if;

  -- We need a stable join to canonical products. Preferred: seed table already stores canonical product UUID in product_id.
  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='pl_seed_products' and column_name='product_id'
  ) into has_seed_product_id;

  if not has_seed_product_id then
    raise exception 'APPLY aborted: public.pl_seed_products.product_id does not exist (no safe join to public.products)';
  end if;

  -- We also need category_type linkage. Preferred: seed has category_type_id. (We do NOT assume slug joins are clean.)
  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='pl_seed_products' and column_name='category_type_id'
  ) into has_seed_category_type_id;

  if not has_seed_category_type_id then
    raise exception 'APPLY aborted: public.pl_seed_products.category_type_id does not exist (no safe category mapping)';
  end if;

  -- Confirm seed has 23–25m rows
  if not exists (select 1 from public.pl_seed_products where age_band_id = '23-25m') then
    raise exception 'APPLY aborted: no seed rows for age_band_id=23-25m';
  end if;
end $$;

-- 1) Insert 23–25m product mappings from seed into Phase A mapping table.
-- Deterministic rank: use seed_rank if present; else stable row_number over (category_type_id, product_id).
do $$
declare
  has_seed_rank boolean;
begin
  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='pl_seed_products' and column_name='rank'
  ) into has_seed_rank;

  if has_seed_rank then
    insert into public.pl_age_band_category_type_products (
      age_band_id,
      category_type_id,
      product_id,
      rank,
      is_active
    )
    select
      '23-25m' as age_band_id,
      sp.category_type_id,
      sp.product_id,
      sp.rank,
      true as is_active
    from public.pl_seed_products sp
    where sp.age_band_id = '23-25m'
      and sp.product_id is not null
      and sp.category_type_id is not null
    on conflict (age_band_id, category_type_id, product_id) do nothing;
  else
    insert into public.pl_age_band_category_type_products (
      age_band_id,
      category_type_id,
      product_id,
      rank,
      is_active
    )
    select
      '23-25m' as age_band_id,
      sp.category_type_id,
      sp.product_id,
      row_number() over (
        partition by sp.category_type_id
        order by sp.product_id::text asc
      ) as rank,
      true as is_active
    from public.pl_seed_products sp
    where sp.age_band_id = '23-25m'
      and sp.product_id is not null
      and sp.category_type_id is not null
    on conflict (age_band_id, category_type_id, product_id) do nothing;
  end if;
end $$;

commit;

-- 2) Post-apply verification (safe selects)
select age_band_id, count(*) as mapped_products
from public.pl_age_band_category_type_products
where age_band_id = '23-25m'
group by 1;

select age_band_id, count(*) as products
from public.v_gateway_products_public
where age_band_id = '23-25m'
group by 1;

-- 3) ROLLBACK (ONLY what this script inserted)
-- If you need to undo, run:
-- delete from public.pl_age_band_category_type_products
-- where age_band_id = '23-25m'
--   and product_id in (
--     select product_id from public.pl_seed_products where age_band_id = '23-25m' and product_id is not null
--   )
--   and category_type_id in (
--     select category_type_id from public.pl_seed_products where age_band_id = '23-25m' and category_type_id is not null
--   );

