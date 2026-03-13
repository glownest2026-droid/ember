# Founder runbook — PR2: Staging backend isolation

Exact clerical steps. No engineering decisions. Do in order.

---

## 1. Create the staging Supabase project

1. Log in to [Supabase](https://supabase.com/dashboard).
2. Click **New project**.
3. **Organization:** Choose the same org as production (or the one you use for Ember).
4. **Name:** e.g. `ember-staging` (or any name you will recognise).
5. **Database password:** Set a strong password and store it safely (needed for DB access; not needed for env vars below).
6. **Region:** Same as production (or your preference).
7. Click **Create new project** and wait until the project is ready.

---

## 2. Get staging API keys and URL

1. In the new project, go to **Settings** (gear) → **API**.
2. Note:
   - **Project URL** (e.g. `https://xxxxx.supabase.co`) → this is `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_URL` for staging.
   - **anon public** key → this is `NEXT_PUBLIC_SUPABASE_ANON_KEY` for staging.
   - **service_role** key → this is `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_SERVICE_ROLE` for staging (use the same value for both; the app uses both names in different places).

---

## 3. Apply migrations to the staging database

Schema comes only from the repo. Apply migrations in this order in the **Supabase SQL Editor** for the **staging** project (SQL Editor → New query, paste, Run):

1. `supabase/sql/2025-11-04_core_schema.sql`
2. `supabase/sql/2025-12-20_module_10A_remove_child_name.sql`
3. `supabase/sql/2025-12-30_fix_theme_anonymous_access.sql`
4. `supabase/sql/202601041654_pl0_product_library.sql`
5. `supabase/sql/202601041700_pl1_pool_items.sql`
6. `supabase/sql/202601050000_pl_category_types_and_products.sql`
7. `supabase/sql/202601050001_remove_rating_min_constraint.sql`
8. `supabase/sql/202601050002_pl2_public_read_policies.sql`
9. `supabase/sql/202601060000_manus_ready_scoring_and_evidence.sql`
10. `supabase/sql/202601060001_pl_autopilot_locks.sql`
11. `supabase/sql/202601142252_pl_need_ux_labels.sql`
12. `supabase/sql/202601150000_phase_a_db_foundation.sql`
13. `supabase/sql/202601150000_phase2a_canonise_layer_a_development_needs.sql`
14. `supabase/sql/202602080000_pl_category_type_images.sql`
15. `supabase/sql/202602190000_subnav_saves_and_consent.sql`
16. `supabase/sql/202602250000_family_user_list_items.sql`
17. `supabase/sql/202602261000_subnav_gifts_count.sql`
18. `supabase/sql/202602280000_children_display_name.sql`
19. `supabase/sql/202602281000_children_child_name.sql`
20. `supabase/sql/202603031000_subnav_stats_per_child.sql`
21. `supabase/sql/202603031100_upsert_user_list_item_child.sql`
22. `supabase/sql/202603031200_upsert_drop_old_overload.sql`
23. `supabase/sql/202603031300_subnav_stats_child_only.sql`
24. `supabase/sql/202603041000_children_is_suppressed.sql`
25. `supabase/sql/202603041100_gift_shares.sql`
26. `supabase/sql/202603041200_gift_list_child_id.sql`
27. `supabase/sql/202603041300_get_gift_share_list_title.sql`
28. `supabase/sql/202603041400_gift_list_image_from_gateway.sql`
29. Either `supabase/sql/202603051000_PART1_rls_only.sql` then `202603051000_PART2_stats_only.sql`, or `supabase/sql/202603051000_suppress_saves_for_suppressed_children.sql`
30. `supabase/sql/202603051100_gift_list_hide_legacy.sql`
31. `supabase/sql/202603051200_marketplace_pg_trgm_item_types.sql`
32. `supabase/sql/202603051201_marketplace_listings_tables.sql`
33. `supabase/sql/202603051202_marketplace_rls.sql`
34. `supabase/sql/202603051203_marketplace_storage.sql`
35. `supabase/sql/202603051204_marketplace_suggest_rpc.sql`

Open each file from the repo (on `main` or this branch), copy full contents, paste into SQL Editor, Run. If a migration fails (e.g. object exists), note it; you may need to fix or skip only that step with help. Do not run `verify_*.sql` as part of schema — those are checks.

---

## 4. Configure Supabase Auth redirect for staging

1. In the **staging** Supabase project, go to **Authentication** → **URL Configuration** (or **Settings** → **Auth**).
2. Under **Redirect URLs**, add the exact staging URL(s) where the app will run, for example:
   - `https://ember-git-staging-<your-team>.vercel.app/auth/callback`
   - If you use a custom staging domain: `https://staging.yourdomain.com/auth/callback`
3. Save.

---

## 5. Set Vercel environment variables for Staging only

1. Log in to [Vercel](https://vercel.com) and open the **Ember** project.
2. Go to **Settings** → **Environment Variables**.
3. For each row below, add or edit the variable and select **Staging** only (do not check Production or Preview):

| Name | Value | Notes |
|------|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Staging project URL from step 2 | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Staging anon key from step 2 | |
| `SUPABASE_SERVICE_ROLE_KEY` | Staging service_role key from step 2 | |
| `SUPABASE_URL` | Same as staging project URL | |
| `SUPABASE_SERVICE_ROLE` | Same as staging service_role key | |

4. Optionally set `EMBER_ADMIN_EMAILS` for Staging to a small list for testing.
5. Leave **Production** and **Preview** unchanged (they keep production Supabase values).
6. Save. **Env var changes require a redeploy to take effect.**

---

## 6. Redeploy the staging branch

1. In Vercel, go to **Deployments**.
2. Find the latest deployment for the **staging** branch.
3. Open the three-dots menu → **Redeploy**.
4. Confirm. Wait until the deployment is ready.

---

## 7. Verify staging uses staging backend

1. Open the **staging** deployment URL (e.g. from Deployments or the branch URL).
2. Confirm the site loads (e.g. home, discover).
3. **Sign-in check:** Sign in (or sign up) on the staging URL. In the **staging** Supabase project, go to **Authentication** → **Users**. You should see the test user there (and not in production). That proves the app is using the staging Supabase project.
4. Optional: Create a test child or list item on staging; confirm it appears in the staging project in Supabase (Table Editor), not in production.

If any step fails, stop and use the docs (e.g. `docs/staging/current-truth-backend.md`, `environment-matrix.md`) or get engineering support; do not guess values or skip steps.
