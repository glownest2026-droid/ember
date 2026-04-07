Gateway age-band bulk import (Phase A / Discover)
================================================

ABI V2 stage naming
-------------------
- Stage 1 = focus wrapper + note: `stage1_why_it_matters_ux_description`
- Stage 2 = play ideas/category layer: `stage2_*`
- Stage 3 = product examples layer: `stage3_*`
- Deprecated aliases (temporary importer compatibility): `stage2_why_it_matters_ux_description`, `stage3_*` (old Stage 2), `stage4_*` (old Stage 3)

Files
-----
- gateway_age_band_bulk_import_template.csv
    Full denormalised export for age band 25–27m (one row per product mapping in
    v_gateway_products_public). Regenerated from production-shaped Supabase data.

- gateway_age_band_25-27m_sample_10rows.csv
    Same columns; first product from each of 10 distinct category_type_id values
    (quick review / docs).

- gateway_age_band_bulk_import_column_dictionary.csv
    Column header → underlying table/view column.

- scripts/export_gateway_age_band_csv.mjs
    Node script that joins v_gateway_age_bands_public, v_gateway_products_public,
    v_gateway_category_types_public, and v_gateway_wrapper_detail_public to build
    the CSVs.

Regenerate (requires web/.env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY)
-------------------------------------------------------------------------------------------------
  node supabase/import_templates/scripts/export_gateway_age_band_csv.mjs

Optional env:
  GATEWAY_EXPORT_BAND=25-27m   (default)
  GATEWAY_SAMPLE_ROWS=10       (default; set to 0 to skip the small sample file)

New age band (e.g. 34–36m)
--------------------------
1. Ensure pl_age_bands row exists for the new id and month range.
2. Copy the CSV and replace age_band_id, age_band_label, min_months, max_months.
3. Insert new rows in pl_age_band_ux_wrappers, pl_age_band_development_need_category_types,
   and pl_age_band_category_type_products (or run your ETL from this sheet).
4. Reuse ref_category_type_uuid and ref_product_uuid when the same global category/product
   applies; wrapper and need UUIDs stay tied to existing pl_ux_wrappers / pl_development_needs.

Note: stage1_wrapper_ux_slug may match pl_development_needs.slug in the database even when
the Discover doorway primary slug differs (e.g. burn-energy); doorways.ts lists alternateSlugs
for resolution.
