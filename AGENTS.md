# AGENTS.md — Ember front door for AI & human developers

**Read this first.** It applies to every AI agent (Cursor, Codex, Claude, Manus, etc.) and every human working in this repo. It is intentionally short. The detail lives in the linked docs — follow them, do not restate them.

Ember is a subscription product for **Conscientious Conor**, a tired, thoughtful first-time UK dad. Everything parent-facing must earn his £3.99/month. If you touch copy, Discover content, or UX, you are on the hook for his quality bar.

---

## The 10 non-negotiables

1. **Branch from `origin/main`.** `git fetch origin && git checkout -b <type>/<name> origin/main`. Never branch from whatever happens to be checked out.
2. **PR base must be `main`** unless you are *deliberately* stacking — and if you stack, re-target the child to `main` after the parent merges (`gh pr edit <n> --base main`). Verify before merging: `gh pr view <n> --json baseRefName`.
3. **A migration is not done until it has executed** against a real database (a Supabase branch or the target DB in-session). SQL that was only read is untested code.
4. **The migration file is the unit of DB change** — apply all of it or none. No partial, hand-carved, category-by-category writes to a live database.
5. **Repair migration history; never route around it.** `supabase migration repair` then `db push`. Leave history cleaner than you found it.
6. **Data bugs live in data.** If a mapping is missing, fix it in a migration. No fuzzy lookup recovery, keyword scoring, or hardcoded data maps in application code.
7. **Entitlement comes from auth/RLS**, never inferred from the shape of returned data. Check whether the API already returns the signal before inventing one.
8. **Verify like the founder will.** Reproduce every reported symptom on the deployed preview, on the platform where it was reported (mobile bugs on a mobile viewport). "Build passed" is not verification.
9. **When replacing a component, preserve its responsibilities** — compliance notices, analytics, accessibility, save/have actions, empty/loading/error states — or call out each drop in the PR body.
10. **Stop and ask** when tooling access is blocked, migration history is dirty, or a workaround is tempting. Do not invent a bypass. The founder is non-technical but wants to be asked; he prefers granting an efficient route over watching agents hack around one.

Full reasoning and worked examples: **`web/docs/DEVELOPER_OPERATING_MODEL.md`**.

---

## Ember product doctrine (locked)

- **Pip feature names are locked** — Pathway / Picks / Patch Finds / Seasons / Chapters / Pass-On. Always say **Ember Plus**. Never rename for "clarity."
- **Do not imply paid checkout is live** until the MVP threshold is met — prefer **Join the waitlist**. See `.cursor/rules/project-rocket.mdc`.
- **Conor five tests** (Respect, Well Duh, Stage shift, Buying judgement, Human parent) must pass on any parent-facing copy. See `.cursor/rules/conscientious-conor.mdc` + `web/docs/CONSCIENTIOUS_CONOR.md`.
- **Always open a PR** for app/product builds and hand off a **green Vercel preview** — never ask whether to open one.

---

## Handoff contract (every task)

- Green Vercel preview URL (the `*.vercel.app` link, not the dashboard) in the closing message.
- `MERGEABLE` / `CLEAN` merge state, PR base confirmed as `main`.
- `PROGRESS.md` updated with what shipped, files, migrations, and verify steps.
- A plain-English **"How to verify it worked"** for the founder.

---

## The map (single source of truth per topic — do not duplicate)

| Topic | Canonical source |
|---|---|
| Engineering doctrine + examples | `web/docs/DEVELOPER_OPERATING_MODEL.md` |
| PR handoff / green preview | `.cursor/rules/pr-handoff.mdc` |
| Progress logging | `.cursor/rules/progress-log.mdc` |
| Deploy / merge / rollback checklist | `web/docs/DEPLOY-CHECKLIST.md` |
| Rocket scope, pricing, waitlist | `.cursor/rules/project-rocket.mdc` + `web/docs/PROJECT_ROCKET.md` |
| Parent persona + copy bar | `.cursor/rules/conscientious-conor.mdc` + `web/docs/CONSCIENTIOUS_CONOR.md` |
| Catalogue / Discover ingestion | `.cursor/rules/conor-grade-catalogue-upload.mdc` |
| Offline source of truth (Discover content) | Spine 3.0 Bible workbook `discover_projection` tab — see `.cursor/rules/conor-grade-catalogue-upload.mdc` §0 |
| Category image mapping | `.cursor/rules/ember-image-mapping.mdc` |
| Marketing names / banned phrases | `web/docs/PRODUCT_MARKETING_LIBRARY.md` |
| Brand / visual identity | `web/docs/EMBER_BRAND_BOOK.md` |
| Required docs (do not delete) | `web/docs/DOCS_MANIFEST.md` |
| Decision history | `web/docs/FEB_2026_DECISION_LOG.md` |

If two documents disagree, the more specific one wins for its topic; raise the conflict in your PR so we fix the source.

---

## Cursor Cloud specific instructions

Ember is a single Next.js 16 (App Router, React 19) web app living in `web/`. `web/` is
the pnpm workspace root; run all app commands from there. Scripts are defined in
`web/package.json` (`dev`, `build`, `start`, smoke tests). Package manager is
`pnpm@10.13.1` (pinned via `packageManager`; the startup update script activates it).

The backend is a **hosted Supabase project** (Postgres + Auth + Storage). There is no
committed `supabase/config.toml`; the intended dev setup points `web/.env.local` at the
shared hosted project.

### Run / build / lint

- Dev server: `pnpm -C web dev` (Next dev on http://localhost:3000).
- Build: `pnpm -C web build` — this **succeeds without any env vars** (Supabase clients
  are created lazily), so it's a good compile check on its own.
- Lint: **`pnpm lint` is broken.** `next lint` was removed in Next 16, so the script just
  errors with `Invalid project directory ... /lint`. Run ESLint directly instead:
  `pnpm -C web exec eslint .` (the repo currently has pre-existing lint findings).

### Supabase env is required to render core pages

- `web/.env.local` must define `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` (plus `SUPABASE_SERVICE_ROLE_KEY` for admin /
  marketplace-write / cron routes). These are not in the repo — get them from the hosted
  Supabase project (see `web/docs/FEB_2026_AUTH_SETUP.md`).
- Without them, `/`, `/discover`, and other catalogue pages return HTTP 500 with
  `supabaseUrl is required` (thrown in `web/src/utils/supabase/public-catalogue.ts`).
  Purely client-auth pages like `/signin`, `/verify`, and `/account` still render.

### The repo SQL history does NOT fully rebuild the schema

`supabase/sql/` and `supabase/migrations/` cannot recreate a working catalogue DB from
scratch: several base objects were created out-of-band on the hosted project and are
never defined in-repo (e.g. `user_roles`, `pl_development_needs`, `products.is_archived`),
and some files include guard checks that abort against a partial schema. For Discover /
catalogue work, use the hosted Supabase project rather than a from-scratch local DB.

### Optional: local Supabase for auth-only flows

You can exercise the **auth** flow fully offline with the Supabase CLI + Docker
(`supabase start`) — GoTrue + Mailpit work without the catalogue tables. Point
`.env.local` at the local API/anon key, then sign in via email OTP: request a code on
`/signin`, read it from Mailpit (http://127.0.0.1:54324), and verify on `/verify`.
For the 6-digit code to appear in the email, the magic-link template must include
`{{ .Token }}` (same requirement as production, per `docs/FEB_2026_AUTH_SETUP.md` §4);
locally set `[auth.email.template.magic_link]` in `supabase/config.toml`.

### next/image logo gotcha (local Supabase only)

The Ember logo is served from the hosted Supabase storage host, and `web/next.config.js`
only allowlists the host derived from `NEXT_PUBLIC_SUPABASE_URL`. If you point at a
**local** Supabase URL, any page that renders the logo throws
`Invalid src prop ... is not configured under images`. Using the hosted
`NEXT_PUBLIC_SUPABASE_URL` avoids this.
