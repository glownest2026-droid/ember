# DEPLOY-CHECKLIST.md — Ember

Use this before merging **any** PR to `main`.

## 1) Local Preflight

- [ ] From repo root: `cd web && npm ci && npm run build` completes without errors.
- [ ] Tailwind/PostCSS aligned to version:
  - v4 → `@import "tailwindcss";` in `src/app/globals.css` and `@tailwindcss/postcss` in `postcss.config.js`
  - v3 → `@tailwind base; @tailwind components; @tailwind utilities;` and `tailwindcss` + `autoprefixer` in PostCSS config
- [ ] `web/package.json` has `"build": "next build"`

## 2) Supabase RLS Spot-check

- [ ] `waitlist`: **INSERT allowed**, **SELECT blocked** for anon
- [ ] `play_idea`: **SELECT allowed** for anon
- [ ] RLS is **enabled** on both tables

## 3) Vercel Settings (Project → Settings)

- [ ] **General** → **Production Branch** = `main`
- [ ] **General** → **Root Directory** = `web`
- [ ] **Environment Variables**:
  - **Preview**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **Production**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 4) Merge Strategy

- [ ] PR base = `main`, compare = feature branch
- [ ] Rebase-only history (no merge commits)
- [ ] All checks green; preview deploy loads

## 5) Rollback Steps

- **Revert PR**: GitHub → PR → **Revert** → new PR → merge
- **Redeploy previous build**: Vercel → Project → **Deployments** → pick last good → **Redeploy**
- **Env rollback** (if keys mis-set): Restore previous values in Vercel Env Vars, save, and redeploy.

