# Staging setup and promotion runbook (founder-safe)

Use these steps in order. All steps are clerical (no engineering judgment). If a step is already done, skip it.

---

## 1. Create or verify the `staging` branch (GitHub)

1. Open the repo on GitHub.
2. Go to **Branches**.
3. If **staging** appears in the list, the branch exists; skip to section 2.
4. If **staging** does not exist:
   - Use the branch dropdown (where it says “main” or current branch).
   - Type `staging` and choose **Create branch: staging from 'main'** (or use the “New branch” flow and set default to `main`, name `staging`).
   - Leave the new branch empty or push the same commit as `main` so it exists.  
   _(Alternatively, if the PR that adds this runbook has already created and pushed `staging`, it will appear after that PR is merged or after someone pushes it.)_

---

## 2. Configure Vercel for the staging branch

1. Log in to [Vercel](https://vercel.com) and open the **Ember** project (or the project linked to this repo).
2. Go to **Settings** → **General**.
3. Confirm **Root Directory** is set to **`web`**. If not, set it to `web` and save.
4. Go to **Settings** → **Environments**.
5. Ensure there is an environment named **Staging** (or **Preview** if your plan uses that for staging):
   - If **Staging** does not exist: click **Add** and add an environment named **Staging**.
   - Ensure the **staging** branch is assigned to this environment (e.g. only **Staging** is checked for the `staging` branch).
6. Go to **Settings** → **Domains** (or **Git** → branch settings, depending on your Vercel plan):
   - For the **staging** branch, note the branch URL (e.g. `ember-git-staging-<team>.vercel.app`). This is your **stable staging URL**.
   - Optionally add a custom domain (e.g. `staging.ember.example.com`) and assign it to the **staging** branch / Staging environment.

---

## 3. Set environment variables for Staging (Vercel)

1. In Vercel, go to **Settings** → **Environment Variables**.
2. For each variable that must differ on staging (e.g. Supabase URL and keys for a future staging DB), add or edit the variable and select **Staging** only (do not select Production or Preview unless intended).
3. Use the same **variable names** as in production (see `docs/staging/environment-matrix.md`). Example: for a future staging Supabase project, set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for **Staging** only.
4. Save. **Redeploy the staging branch** (Deployments → find latest staging deployment → **Redeploy**) so new env vars take effect.

---

## 4. Promote to staging (when you want staging to match main)

1. On GitHub, open a **Pull Request**: base branch = **staging**, compare branch = **main**.
2. Merge the PR (e.g. “Merge pull request”). This updates `staging` with the latest from `main`.
3. Vercel will automatically deploy the `staging` branch. Open the staging URL from section 2 to confirm.

---

## 5. Confirm the staging lane

- Open the **stable staging URL** (from section 2) in a browser.
- Sign in (if the app uses auth) and click through the main areas (e.g. home, discover, family).  
- Staging uses the same app as production; only env vars (and later, optionally, a separate Supabase project) differ. No separate “staging backend” or seed data is required for this foundation.

---

## Notes

- **Env changes:** After changing environment variables in Vercel, redeploy the affected branch (e.g. staging) for changes to take effect.
- **Root Directory:** The app must be built from the `web` directory. If builds fail, confirm Root Directory is `web`.
