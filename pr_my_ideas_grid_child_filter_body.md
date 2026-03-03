# fix: wire My List grid on /my-ideas to selected child

## Problem
On `/my-ideas`, when a child is selected in the subnav (e.g. Geraldine - "1 idea"), the **My List** grid showed all saved items (9 ideas, 3 products, 3 gifts) instead of only that child’s items (1 idea). Subnav stats were correct; the grid was not filtered by the selected child.

## Root cause
1. **Grid filter**  
   `childFilteredItems` used `r.child_id === selectedChildId || r.child_id == null`, so when a child was selected the grid showed that child’s items **plus** all unassigned items (inheritance). It should show **only** items where `child_id === selectedChildId`.

2. **“All children” vs first child**  
   When the URL had no `?child=` (All children), `fetchChildren` set `selectedChildId` to `list[0].id`, so the grid showed the first child’s items + unassigned instead of the full list. With no child in the URL, `selectedChildId` should stay `null` so the grid shows all items.

3. **URL sync**  
   When switching from a child to “All children”, `initialChildId` became undefined but `selectedChildId` was not cleared, so the grid could stay on the previous child’s filter.

## Changes
- **`web/src/components/family/MyIdeasClient.tsx`**
  - **childFilteredItems**  
    When `selectedChildId` is set: filter to `r.child_id === selectedChildId` only (removed `|| r.child_id == null`).  
    When no child selected: use full `items` (all children).
  - **fetchChildren**  
    When `initialChildId` is null/empty (no `?child=` in URL), set `selectedChildId` to `null` so “All children” shows the full list instead of defaulting to the first child.
  - **useEffect(initialChildId, children)**  
    When `initialChildId` is null/empty, set `selectedChildId` to `null`; when it’s a valid child id in the list, set `selectedChildId` to that id. Keeps grid in sync with subnav/URL when switching between a child and “All children”.

## Expected behaviour
- **Child selected in subnav** (e.g. Geraldine):  
  Subnav shows that child’s counts (e.g. 1 idea).  
  My List grid shows only items saved to that child (e.g. 1 idea). Tab counts (Ideas / Products / Gifts) match the grid and subnav.
- **“All children” in subnav** (no `?child=`):  
  Grid shows all saved items. Tab counts are the full totals.

## Verification
1. Log in, go to `/my-ideas`.
2. Select “Geraldine” in the subnav (or any child with known saves).  
   - Subnav: e.g. “1 idea”.  
   - My List: Ideas tab count and grid show only that child’s ideas (e.g. 1).
3. Select “All children” in the subnav.  
   - Grid and tab counts show all items (e.g. 9 ideas, 3 products, 3 gifts).
4. Select a child with no saves (e.g. Sophie).  
   - Grid and tab counts show 0; no items listed.
5. No console errors; build green.
