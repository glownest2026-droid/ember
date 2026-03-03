# fix: child toggle – dropdown labels, family/discover/my-ideas context, list filter

## Snags addressed

1. **Dropdown labels:** Subnav child selector showed "Child 1", "Child 2", "Child 3". Now shows real name when set (e.g. "Alex – Aged 6+") or "Gender – Aged X" when no name, else "Child N". Query tries full columns first, then display_name-only, then core columns with gender so list always loads.
2. **Family page:** Subnav toggle had no effect on /family. Family now passes `params.child` to FamilyDashboardClient; selected child card is highlighted and scrolled into view.
3. **Discover:** Subnav toggle had no effect on /discover. Discover now reads `?child=` from URL; redirect from /discover preserves child; DiscoveryPageClient receives `initialChildId`, fetches child profile, and shows "Ideas for {name}" / "Chosen for {name}" in copy when a child is selected.
4. **My-ideas list:** Toggle only changed header/chip labels; list content was the same. My list now filters by selected child: when a child is selected, show items where `child_id` = that child or null; when "All children", show all. Counts and tabs reflect the filtered list.

## Root cause summary

- **Labels:** Primary query used columns that might not exist (child_name); on error fallback dropped gender and always showed "Child N". No "Name – Aged X" formatting.
- **Family:** Page did not pass `params.child` to FamilyDashboardClient.
- **Discover:** Discover route did not accept or pass `child` in searchParams; client never received a child id.
- **My-ideas list:** fetchList did not select or filter by `child_id`; list was always full set.

## What changed (file paths)

- `web/src/components/subnav/SubnavBar.tsx` — SubnavChild type extended with gender; childOptionLabel() for "Name – Aged X" | "Gender – Aged X" | "Child N"; primary query child_name/display_name, then display_name-only, then fallback with gender; option labels use childOptionLabel.
- `web/src/app/family/page.tsx` — Pass `initialChildId={params.child}` to FamilyDashboardClient.
- `web/src/components/family/FamilyDashboardClient.tsx` — Accept initialChildId; scroll to and highlight child card when initialChildId matches a profile (id + scroll-mt-4, border/shadow when selected).
- `web/src/app/discover/page.tsx` — Accept searchParams; preserve `?child=` when redirecting to /discover/{months}.
- `web/src/app/discover/[months]/page.tsx` — Add child to searchParams; pass initialChildId to DiscoveryPageClient; preserve child in redirect URL when redirecting with wrapper.
- `web/src/app/discover/[months]/DiscoveryPageClient.tsx` — Accept initialChildId; fetch child profile when set; selectedChildLabel state; show "Ideas for {label}" / "Chosen for {label}" when child selected.
- `web/src/components/family/MyIdeasClient.tsx` — ListItemRow gains child_id; fetchList selects child_id; childFilteredItems when selectedChildId set (child_id = selected or null); counts from filtered lists; legacy rows get child_id: null.
- `PROGRESS.md` — Logged this fix.

## Before / after behaviour

| Snag | Before | After |
|------|--------|--------|
| 1. Labels | "Child 1", "Child 2", "Child 3" | "Alex – Aged 6+", "Girl – Aged 2-3y", or "Child N" when no name/gender |
| 2. Family | Toggle changed URL only; dashboard unchanged | Selected child card highlighted and scrolled into view |
| 3. Discover | Toggle had no effect | "Ideas for Alex", "Chosen for Alex" in copy when child selected; redirect keeps ?child= |
| 4. My-ideas list | Same list for every child | List filtered by selected child (and unassigned); counts match filtered list |

## Vercel preview URL

After opening the PR, use the Vercel bot comment or the "Deployments" tab for the preview URL (e.g. `https://ember-git-fix-child-toggle-labels-and-context-…vercel.app`).

## Follow-up: new child in toggle + stats refresh (same PR)

- **Issue:** After adding a new child (e.g. "Geraldine"), the child did not appear in the subnav toggle, and stat counters did not refresh to 0 for that child.
- **Fix 1 – Toggle:** SubnavBar now refetches the children list when `pathname` changes. After redirect from add-children → /discover, the new child appears in the dropdown.
- **Fix 2 – Stats:** New migration `supabase/sql/202603031000_subnav_stats_per_child.sql` adds optional `p_child_id` to `get_my_subnav_stats()`. When provided, counts are filtered to that child (items where `child_id = p_child_id OR child_id IS NULL`). SubnavStatsContext `refetch(childId?)` passes the selected child; SubnavBar calls `refetch(selectedChildId)` when pathname or selected child changes, so selecting the new child shows 0 ideas / 0 toys / 0 gifts.
- **Apply migration:** Run the new SQL migration in Supabase so per-child stats work. Without it, stats remain all-children when a child is selected.

## Follow-up 2: dropdown names + save against child (same PR)

- **Dropdown names:** First children query now selects `id, child_name, display_name, age_band, gender`; `toSubnavChild()` normalizes the row so "Geraldine" / "Alex" show when `child_name` or `display_name` is set. Fallbacks: then `display_name, age_band, gender`; then `gender, age_band`.
- **Save against child:** When a user saves an idea or product from /discover with a child selected in the subnav, the save is stored against that child. New migration `202603031100_upsert_user_list_item_child.sql` adds `p_child_id` to `upsert_user_list_item`; all discover save/have flows pass `p_child_id` when `?child=` is set. Replay-after-sign-in payload includes `childId` so the replayed save also uses the correct child. Return URL preserves `?child=` so after sign-in the user returns with the same child selected.
- **Apply migrations:** Run both `202603031000_subnav_stats_per_child.sql` and `202603031100_upsert_user_list_item_child.sql` in Supabase.

## Build

- `pnpm build` (from `web`) passes.
