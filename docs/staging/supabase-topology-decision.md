# Supabase staging topology decision (backend isolation PR)

## Decision

**Preferred:** **Separate Supabase project** for staging (new project, e.g. “ember-staging”), with schema reproduced from repo migrations.

**Rejected for this PR:** Supabase **persistent branch**. Reason: repo has no Supabase GitHub integration or `config.toml`; production is applied manually. Supabase branching requires either GitHub-linked workflow or dashboard setup and may not be available on all plans. A separate project is universally possible, keeps production untouched, and matches the existing “migrations in repo, apply manually” workflow.

If you later enable Supabase branching (e.g. GitHub integration or dashboard persistent branch), you can switch staging to that and point Vercel Staging env at the branch URL/keys.

## What we get

| Item | Production | Staging |
|------|------------|---------|
| **Supabase** | Existing project (current prod) | New project or persistent branch |
| **Schema** | Current migrations (already applied) | Same migrations applied in order to staging DB |
| **App wiring** | `NEXT_PUBLIC_SUPABASE_*` etc. from Vercel **Production** | Same env **key names**, values from Vercel **Staging** (staging URL + keys) |
| **Vercel** | Branch `main` → Production env | Branch `staging` → Staging env |

Once Vercel **Staging** environment has staging Supabase URL and anon key (and service role keys if admin/cron are used on staging), the staging deployment **no longer talks to production Supabase**. Proof: `NEXT_PUBLIC_SUPABASE_URL` is read at build/runtime from env; Vercel injects env per environment; staging branch uses Staging env only.

## What we do not do in this PR

- No seed-data rollout (except minimal if required for backend setup; none planned).
- No feature flags.
- No production secret rotation.
- No new vendors.
