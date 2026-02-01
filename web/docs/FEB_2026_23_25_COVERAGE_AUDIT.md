# Feb 2026 — 23–25m Coverage Audit (Gateway Picks)

**Status**: Audit-only + apply gate (no UI changes in PR3)  
**Created**: 2026-02-01  
**Purpose**: Prove whether we can generate **real** 23–25m picks from existing Manus-derived DB fields, without inventing or cloning 25–27m.

---

## 1) Public contract (what the `/new` picker relies on)

The public `/new` experience is locked to curated **gateway public views**:

- `public.v_gateway_age_bands_public`
- `public.v_gateway_wrappers_public`
- `public.v_gateway_wrapper_detail_public`
- `public.v_gateway_category_types_public`
- `public.v_gateway_products_public`

**Important constraints**
- We do **not** widen anon/public SELECT on base tables.
- If 23–25m has no mapped products, the UI empty state is **intentional**.

---

## 2) Founder-safe Audit SQL block (single copy/paste)

**Supabase click-path**: Dashboard → SQL Editor → New query → paste → Run

This block is designed to:
- **Not assume column names** (it introspects `information_schema.columns` first).
- Return clear row counts by age band.
- Show whether we have the minimum prerequisites for a provenance-safe 23–25m mapping script.

```sql
-- FEB_2026 23–25m Coverage Audit (copy/paste whole block)

-- 1) Column introspection (ground truth)
select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name in (
    'products',
    'pl_age_band_category_type_products',
    'pl_age_band_development_need_category_types',
    'pl_age_band_ux_wrappers',
    'pl_age_band_development_need_meta',
    'pl_development_needs',
    'pl_category_types',
    'pl_seed_products',
    'pl_seed_category_types'
  )
order by table_name, ordinal_position;

select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name in (
    'v_gateway_age_bands_public',
    'v_gateway_wrappers_public',
    'v_gateway_wrapper_detail_public',
    'v_gateway_category_types_public',
    'v_gateway_products_public'
  )
order by table_name, ordinal_position;

-- 2) Gateway view row counts (what public /new can see today)
select 'v_gateway_age_bands_public' as v, count(*) as rows from public.v_gateway_age_bands_public
union all select 'v_gateway_wrappers_public', count(*) from public.v_gateway_wrappers_public
union all select 'v_gateway_wrapper_detail_public', count(*) from public.v_gateway_wrapper_detail_public
union all select 'v_gateway_category_types_public', count(*) from public.v_gateway_category_types_public
union all select 'v_gateway_products_public', count(*) from public.v_gateway_products_public;

select age_band_id, count(*) as products
from public.v_gateway_products_public
group by 1
order by 1;

-- 3) Do we already have 23–25m category types wired? (view-level)
select age_band_id, count(*) as category_types
from public.v_gateway_category_types_public
group by 1
order by 1;

-- 4) Mapping tables by age band (base tables, for admin audit only)
select age_band_id, count(*) as rows
from public.pl_age_band_category_type_products
group by 1
order by 1;

select age_band_id, count(*) as rows
from public.pl_age_band_development_need_category_types
group by 1
order by 1;

select age_band_id, count(*) as rows
from public.pl_age_band_ux_wrappers
group by 1
order by 1;

-- 5) Do products already carry a category link we can use? (base table reality)
-- If products.category_type_id exists, this should return a non-zero count.
-- If the column doesn't exist, this statement will fail (that’s okay; the column list above tells us reality).
select
  count(*) as products_total,
  sum((category_type_id is not null)::int) as products_with_category_type_id
from public.products;

-- 6) Do we have any Manus-like “23–25 signal” in the DB?
-- We avoid assuming exact column names here; use the column lists above to decide what exists.
-- If pl_seed_products.age_band_id exists, this should show if seed data already includes 23–25m.
select
  age_band_id,
  count(*) as seed_products
from public.pl_seed_products
group by 1
order by 1;
```

---

## 3) Expected outputs (to interpret quickly)

- **If `v_gateway_products_public` shows 0 products for `23-25m`**: the UI empty state is correct today.
- If **seed products exist for `23-25m`** (e.g., `pl_seed_products.age_band_id='23-25m'`), and we have a safe join into canonical `products` (by `id` or stable identifiers), we can create provenance-safe mappings.
- If the audit shows **no 23–25 signal anywhere** (no seed rows, no product metadata), then we should **not** run APPLY; coverage genuinely doesn’t exist yet.

---

## 4) Gate: when it’s safe to run APPLY

Only run the apply script if the audit confirms **all** of:

1) `public.pl_seed_products` exists and has **rows for `age_band_id='23-25m'`**  
2) We can link those seed rows to canonical `public.products` (by `id`, or by stable identifiers present in both)  
3) We have `public.pl_age_band_category_type_products` table available (it should exist from Phase A migration)

If any of these are false, **do not apply** — the empty state is intentional until we have real provenance.

