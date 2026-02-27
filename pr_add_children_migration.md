# feat(children): migrate /app/children to /add-children (Figma UI)

## What changed
- **/family**: Child profiles list is now on /family directly below “Manage My Family” (heading + list + “Add a child” → /add-children). Save/delete from add flow redirect to /family?saved=1 or /family?deleted=1.
- **/add-children**: Add-child form only (Figma UI: hero, DOB/gender, consent, personalisation/co-parent UI; no name field — privacy). Back → /family.
- **/add-children/new**: Removed; add flow lives on /add-children.
- **/add-children/[id]**: Edit child (same UI + delete). Back → /family.
- **Backwards compatibility**: /app/children, /app/children/new redirect to /add-children; /app/children/[id] → /add-children/[id].
- **Auth**: /add-children and sub-routes protected same as /app/*.
- **Data**: Same DB table `children`, same RLS; write path `@/lib/children/actions` (saveChild/deleteChild redirect to /family).

## Routes
| Route | Purpose |
|-------|---------|
| /family | Manage My Family + Child profiles list (saved/deleted toasts) |
| /add-children | Add a child form |
| /add-children/[id] | Edit (and delete) child |
| /app/children, /app/children/new | Redirect → /add-children |
| /app/children/[id] | Redirect → /add-children/[id] |

## Files touched (this PR)
- `web/middleware.ts` — protect /add-children
- `web/src/lib/children/actions.ts` — saveChild/deleteChild redirect to /family
- `web/src/app/add-children/page.tsx` — add form only (was list)
- `web/src/app/add-children/[id]/page.tsx` — edit; backHref /family
- `web/src/app/add-children/new/page.tsx` — **removed**
- `web/src/app/family/page.tsx` — pass saved/deleted from searchParams to FamilyDashboardClient
- `web/src/components/family/FamilyDashboardClient.tsx` — Child profiles section below header; saved/deleted toasts; + Add child → /add-children
- `web/src/app/(app)/app/children/new/page.tsx` — redirect to /add-children
- `web/src/app/(app)/app/recs/page.tsx` — Add profile → /add-children
- `PROGRESS.md` — routes updated

## DB write path (unchanged)
- Table: `children`. Server actions in `@/lib/children/actions`; insert/update/delete unchanged.

## Proof-of-Done
- [ ] Vercel preview URL: _______________
- [ ] /family shows “Manage My Family” then “Child profiles” list + “Add a child”; toasts when ?saved=1 or ?deleted=1
- [ ] “Add a child” → /add-children (form); save → redirect to /family?saved=1; new row in DB
- [ ] Edit from list → /add-children/[id]; save/delete → /family?deleted=1 or /family?saved=1
- [ ] /app/children and /app/children/new redirect to /add-children
- [ ] Desktop + mobile match Figma (form: hero, cards, sheets, sticky CTA)
