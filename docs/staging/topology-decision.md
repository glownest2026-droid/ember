# Staging topology decision

**Decision (locked for PR1):** Use a **branch-based** staging lane with the simplest Vercel-compatible model. No new providers, no staging Supabase or seed data in this PR.

## Target model

| Lane | Branch | Vercel behavior | Purpose |
|------|--------|-----------------|---------|
| **Production** | `main` | Production deployment; production domain | Live app. |
| **Staging** | `staging` | Long-lived branch → assign a **stable staging URL** (custom domain or Vercel branch URL) | Pre-production; same app build, can point at staging Supabase later. |
| **Preview** | Any other branch / PR | Vercel preview deployments (ephemeral URLs per branch/PR) | Feature and PR testing. |

## Implementation (no code changes to app)

1. **Git:** A long-lived `staging` branch is created from `main`. It is updated by merging `main` (or selected branches) into `staging` when promoting to staging.
2. **Vercel:**  
   - **Option A (recommended):** In Vercel, create an **Environment** named **Staging** and assign it to the `staging` branch. Then assign a **custom domain** or use the default branch URL (e.g. `ember-git-staging-<team>.vercel.app`) as the stable staging URL.  
   - **Option B:** If no custom environment is needed, the branch `staging` still gets a preview URL; you can use the Vercel “Branch” URL for `staging` as the stable staging link (may change if project/team name changes).
3. **Env vars:** Staging-specific env vars (e.g. a different Supabase project for staging) are set in Vercel under **Staging** environment only. No production secrets are changed in code.

## Explicit exclusions (this PR)

- No staging Supabase project or branching.
- No seed/test data.
- No feature flags in app code.
- No CI/CD redesign.
- No changes to production-only secrets in code.

## Follow-on work (separate PRs)

- Staging Supabase project and connection (env vars in Vercel Staging only).
- Seed or test data for staging.
- Feature flags or environment badge in the app (if desired).
