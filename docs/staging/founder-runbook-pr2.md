# Founder runbook — PR2: Staging backend isolation

**START HERE — do in this order:** (1) Create staging Supabase project → (2) Get URL + anon + service_role keys → (3) Run **staging_baseline.sql** once in SQL Editor, then **verify_staging_baseline.sql** → (4) Add Auth redirect URL for staging → (5) In Vercel, add the 5 Supabase env vars to **Preview** and scope them to branch `staging` → (6) Redeploy staging branch → (7) Open staging URL, sign in; confirm user appears in staging Supabase Auth only.

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
   - **Project URL** (e.g. `https://xxxxx.supabase.co`) → use for `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_URL`.
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - **service_role** key → use for both `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_SERVICE_ROLE` (same value for both).

---

## 3. Apply the baseline and verify

1. In the **staging** Supabase project, open **SQL Editor** → **New query**.
2. Open [staging_baseline.sql](https://github.com/glownest2026-droid/ember/blob/feat/staging-backend-isolation/supabase/sql/staging_baseline.sql) in the repo, copy the full file, paste into the SQL Editor, click **Run**. Wait for it to finish.
3. New query again: open [verify_staging_baseline.sql](https://github.com/glownest2026-droid/ember/blob/feat/staging-backend-isolation/supabase/sql/verify_staging_baseline.sql), copy, paste, Run. You should see one row per object with `ok = true`. If any `ok = false`, stop and ask for help.

---

## 4. Configure Supabase Auth redirect for staging

1. In the **staging** Supabase project, go to **Authentication** → **URL Configuration** (or **Settings** → **Auth**).
2. Under **Redirect URLs**, add the exact staging URL where the app will run, e.g. `https://ember-git-staging-<your-team>.vercel.app/auth/callback`.
3. Save.

---

## 5. Set Vercel environment variables (Preview, branch `staging`)

On Vercel Hobby you do not have a custom “Staging” environment. Use **Preview** and restrict the variables to the **staging** branch so only the staging deployment gets them.

1. Log in to [Vercel](https://vercel.com) and open the **Ember** project.
2. Go to **Settings** → **Environment Variables**.
3. Add each variable below. For **Environment**, select **Preview** only. When adding/editing, use **Branch** (or “Apply to”) and choose **staging** so these values apply only when the `staging` branch is deployed:

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Staging project URL from step 2 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Staging anon key from step 2 |
| `SUPABASE_SERVICE_ROLE_KEY` | Staging service_role key from step 2 |
| `SUPABASE_URL` | Same as staging project URL |
| `SUPABASE_SERVICE_ROLE` | Same as staging service_role key |

4. Do not set these for Production. Other Preview branches can keep production values or stay unset; only the `staging` branch should use staging Supabase.
5. Save. **Redeploy the staging branch** after changing env vars so the new values are used.

---

## 6. Redeploy the staging branch

1. In Vercel, go to **Deployments**.
2. Find the latest deployment for the **staging** branch.
3. Open the three-dots menu → **Redeploy**.
4. Confirm. Wait until the deployment is ready.

---

## 7. Verify staging uses staging backend

1. Open the **staging** deployment URL (from Deployments or the branch URL).
2. Confirm the site loads.
3. Sign in (or sign up) on the staging URL. In the **staging** Supabase project, go to **Authentication** → **Users**. The test user should appear there and not in production.

If a step fails, stop and ask for help; don’t guess values or skip steps.
