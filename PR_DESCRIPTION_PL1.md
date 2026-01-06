# feat(pl-1): manual draft review publish workflow

## What Changed

### Admin Route: `/app/admin/pl/[ageBandId]`
- **File**: `web/src/app/(app)/app/admin/pl/[ageBandId]/page.tsx`
- Lists active moments for the age band
- For each moment: create/edit draft sets
- Edit exactly 3 cards per moment set (lane + because + category type OR product)
- Add/edit/delete evidence per card (URL + short snippet + confidence 1-5)
- Publish/unpublish per moment set with validation

### Server Actions
- **File**: `web/src/app/(app)/app/admin/pl/_actions.ts`
- `createDraftSet()` - Creates draft set with 3 placeholder cards (ranks 1,2,3 with default lanes)
- `updateCard()` - Updates card fields (lane, because, category_type_id OR product_id)
- `addEvidence()` - Adds evidence to a card
- `updateEvidence()` - Updates evidence fields
- `deleteEvidence()` - Deletes evidence
- `publishSet()` - Publishes set with validation:
  - Set must have exactly 3 cards
  - Each card must have at least 1 evidence
  - Each card must have a target (category_type_id OR product_id)
  - Each card must have non-empty "because"
- `unpublishSet()` - Unpublishes set back to draft

### Client Component
- **File**: `web/src/app/(app)/app/admin/pl/[ageBandId]/_components/MomentSetEditor.tsx`
- Interactive UI for editing sets, cards, and evidence
- Form-based editing with server actions
- Real-time validation feedback

### Public Helper
- **File**: `web/src/lib/pl/public.ts`
- `getPublishedSetsForAgeBand()` - Server-side function that returns ONLY published sets/cards/evidence for an age band
- Explicitly filters by `status='published'` in addition to RLS
- Composable for PL-2

### Updated Main PL Page
- **File**: `web/src/app/(app)/app/admin/pl/page.tsx`
- Added links to age band detail pages
- Updated title to "PL-1"

## How to Verify

### Proof Routes (must still pass)
1. `/signin` — sign in page loads
2. `/auth/callback` — auth callback works
3. `/app` — redirects to `/signin?next=/app` when logged out
4. `/app/children` — children page works
5. `/app/recs` — recommendations page works
6. `/ping` — health check works
7. `/cms/lego-kit-demo` — CMS page works

### New Admin Route
1. `/app/admin/pl` — shows age bands with links
2. `/app/admin/pl/[ageBandId]` — shows "Not authorized" for non-admin users
3. `/app/admin/pl/[ageBandId]` — shows moments list for admin users
4. Create draft set: Click "Create draft set" → creates set with 3 placeholder cards
5. Edit cards: Update lane, because, category type OR product → saves successfully
6. Add evidence: Click "Add Evidence" → fill form → evidence added
7. Publish validation:
   - Try to publish with 0 evidence on any card → blocked with clear error
   - Try to publish with missing "because" → blocked with clear error
   - Try to publish with no category/product → blocked with clear error
   - Add all required data → publish succeeds
8. Unpublish: Click "Unpublish" → set returns to draft status

### Public Helper
1. Import `getPublishedSetsForAgeBand()` from `web/src/lib/pl/public.ts`
2. Call with age band ID → returns only published sets with cards and evidence
3. Verify no draft sets are returned

## Constraints Met
- ✅ Small diff only (no rewrites/refactors)
- ✅ Proof routes pass (verified via build)
- ✅ Theming untouched (no changes to ThemeProvider, /app/admin/theme, or site_settings)
- ✅ Admin authority via `user_roles.role='admin'` only
- ✅ Privacy promise: No child name collection
- ✅ Drafts never leak to public (RLS + explicit status='published' filter in helper)
- ✅ Publish blocked if ANY card has 0 evidence (hard rule enforced)

## Rollback
- Revert PR via GitHub UI (maintains commit history)
- No database changes required (uses existing PL-0 tables)

