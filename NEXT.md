# NEXT (Follow-ups, not in PR3)

- If audit shows seed->products join is not via `product_id`, design a provenance-safe join strategy (e.g., by `ean_gtin`/`asin`/`canonical_url`) and update APPLY script accordingly.
- If `pl_seed_products.category_type_id` does not exist (only `category_type_slug`), decide whether slug join is acceptable (and document risks) or add a canonical mapping table (DB change — not in PR3).
- If 23–25m products exist but wrapper rankings/categories need adjustments, handle via Phase A mapping tables (separate PR).

