# feat(children): migrate /app/children to /add-children (Figma UI)

## What changed
- **New route** `/add-children`: list, add, and edit child profiles with Figma-exact UI (gradient background, cards, bottom sheets, sticky CTA).
- **New route** `/add-children/new`: Add a child form (DOB, gender, consent, personalisation and co-parent UI; no name field — privacy).
- **New route** `/add-children/[id]`: Edit child form (same UI + delete).
- **Backwards compatibility**: `/app/children`, `/app/children/new`, `/app/children/[id]` now redirect (302) to `/add-children`, `/add-children/new`, `/add-children/[id]`.
- **Auth**: `/add-children` and sub-routes are protected by the same middleware as `/app/*` (redirect to signin when not authenticated).
- **References**: All in-app links to Child Profiles or add-child now point to `/add-children` (Header, SubnavBar, FamilyDashboardClient, recs empty state).
- **Data**: Same DB table `children`, same Supabase RLS; write path is shared `@/lib/children/actions` (saveChild, deleteChild). No schema or RLS changes.

## Routes
| Route | Purpose |
|-------|---------|
| `/add-children` | List of child profiles (Figma-style) |
| `/add-children/new` | Add a child form |
| `/add-children/[id]` | Edit (and delete) child |
| `/app/children` | Redirect → `/add-children` |
| `/app/children/new` | Redirect → `/add-children/new` |
| `/app/children/[id]` | Redirect → `/add-children/[id]` |

## Files touched
- `web/middleware.ts` — protect `/add-children`
- `web/src/lib/children/actions.ts` — **new** shared saveChild/deleteChild (redirect to /add-children)
- `web/src/app/add-children/page.tsx` — **new** list page (server)
- `web/src/app/add-children/AddChildrenListClient.tsx` — **new** list UI (client)
- `web/src/app/add-children/new/page.tsx` — **new** add form page
- `web/src/app/add-children/[id]/page.tsx` — **new** edit page
- `web/src/components/add-children/AddChildForm.tsx` — **new** form + sheets
- `web/src/components/add-children/ChildDetailsCard.tsx` — **new** (DOB + gender only)
- `web/src/components/add-children/PersonalisationCard.tsx` — **new** (UI only)
- `web/src/components/add-children/CoParentCard.tsx` — **new** (UI only)
- `web/src/components/add-children/PrivacySheet.tsx` — **new**
- `web/src/components/add-children/ValidationErrorSheet.tsx` — **new**
- `web/src/components/add-children/OlderChildSheet.tsx` — **new**
- `web/src/app/(app)/app/children/page.tsx` — redirect only
- `web/src/app/(app)/app/children/new/page.tsx` — redirect only
- `web/src/app/(app)/app/children/[id]/page.tsx` — redirect only
- `web/src/app/(app)/app/children/_actions.ts` — re-exports from `@/lib/children/actions`
- `web/src/components/Header.tsx` — Child Profiles link → `/add-children`
- `web/src/components/subnav/SubnavBar.tsx` — link → `/add-children`
- `web/src/components/family/FamilyDashboardClient.tsx` — Add child → `/add-children/new`
- `web/src/app/(app)/app/recs/page.tsx` — empty state Add profile → `/add-children/new`
- `PROGRESS.md` — proof-of-done routes updated

## DB write path (unchanged)
- **Table**: `children` (Supabase, RLS unchanged).
- **Fields**: `user_id`, `birthdate`, `gender`, `age_band`, `preferences` (no name).
- **Mechanism**: Server actions in `@/lib/children/actions` using `createClient()` from `@/utils/supabase/server`; insert/update/delete semantics and validation identical to previous implementation.

## Proof-of-Done
- [ ] Vercel preview URL: _______________
- [ ] Signed in → `/add-children` loads; list shows existing children
- [ ] Add child → DOB + consent → save → redirect to `/add-children?saved=1`; new row in DB
- [ ] Edit child → change DOB/gender → save → redirect; DB updated
- [ ] Delete child (edit page) → confirm → redirect to `/add-children?deleted=1`
- [ ] `/app/children` redirects to `/add-children`
- [ ] Nav “Child Profiles” and “Add a child” go to `/add-children` and `/add-children/new`
- [ ] Desktop + mobile layout match Figma (hero, cards, sheets, sticky CTA)
