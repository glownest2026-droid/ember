# Feb 2026 Baseline Audit Snapshot (PR0)

**Status**: Permanent snapshot + audit notes (no functional changes)  
**Created**: 2026-01-31  
**Scope**: Frontend read-path for `/new` and `/new/[months]` + Phase A view readiness (counts + revalidation queries)

---

## What this document is

This is a **baseline audit snapshot** for the public gateway experience under:

- `/new`
- `/new/[months]`

It records:

- The **exact current frontend read-path** on `main` (files + function names + quoted code).
- Whether the frontend reads from **Phase A curated public views** (`v_gateway_*_public`) or **legacy base tables**.
- A **Phase A snapshot counts** excerpt (last verified) and **revalidation one-liners** to run later.
- Placeholders for screenshots (not included here).

---

## Phase A snapshot counts (last verified)

> **Quoted text** (source: `origin/feat/phase-a-ui-cutover:PR_DESCRIPTION_PHASE_A_UI_CUTOVER.md` — “Supabase Views (Confirmed)”)
>
> - `v_gateway_age_bands_public` = 2  
> - `v_gateway_wrappers_public` = 24 (12 per age band)  
> - `v_gateway_wrapper_detail_public` = 24  
> - `v_gateway_category_types_public` = 222  
> - `v_gateway_products_public` = 163

---

## Current frontend read-path (as shipped on `main`)

### 1) Routes implementing `/new` and `/new/[months]`

#### `/new` (redirect)

- **File**: `web/src/app/new/page.tsx`
- **Behavior**: Redirects to `/new/26`

Quoted ground truth:

```tsx
// web/src/app/new/page.tsx
// Default to 26 months (matching the mockup)
redirect('/new/26');
```

#### `/new/[months]` (server component: month preload + server fetch)

- **File**: `web/src/app/new/[months]/page.tsx`
- **Exports**: `dynamic = 'force-dynamic'`

### 2) Month → age band resolution logic (file + function)

- **Clamp logic**: `web/src/app/new/[months]/page.tsx` (parses `months`, clamps to 24–30, default 26)
- **Age band lookup**: `web/src/lib/pl/public.ts` → `getAgeBandForAge(ageMonths)`

Quoted ground truth:

```tsx
// web/src/app/new/[months]/page.tsx
// Parse and clamp months to 24-30 (matching the mockup range)
const monthsNum = parseInt(months, 10);
const clampedMonths = isNaN(monthsNum) || monthsNum < 24 || monthsNum > 30
  ? 26
  : monthsNum;

// Map months to age band
const ageBand = await getAgeBandForAge(clampedMonths);
```

```ts
// web/src/lib/pl/public.ts
export async function getAgeBandForAge(ageMonths: number) {
  const { data } = await supabase
    .from('pl_age_bands')
    .select('id, min_months, max_months, label')
    .eq('is_active', true)
    .lte('min_months', ageMonths)
    .gte('max_months', ageMonths)
    .order('min_months', { ascending: true })
    .limit(1)
    .maybeSingle();
  // ...
}
```

### 3) “Wrapper list fetch” (file + function)

**Important**: On `main`, the gateway is still in the **legacy “moment” model**, not Phase A “wrapper” model.

- **What the UI actually fetches today**: “moments that have published sets”
- **File + function**: `web/src/lib/pl/public.ts` → `getActiveMomentsForAgeBand(ageBandId)`
- **Where it’s called**: `web/src/app/new/[months]/page.tsx`

Quoted ground truth:

```ts
// web/src/lib/pl/public.ts
export async function getActiveMomentsForAgeBand(ageBandId: string) {
  const { data: sets } = await supabase
    .from('pl_age_moment_sets')
    .select('moment_id')
    .eq('age_band_id', ageBandId)
    .eq('status', 'published');
  // ...
  const { data: moments } = await supabase
    .from('pl_moments')
    .select('id, label, description')
    .eq('is_active', true)
    .in('id', momentIds);
  // ...
}
```

### 4) “Show my 3 picks” fetch (file + function)

- **Server fetch**: `web/src/lib/pl/public.ts` → `getPublishedSetForAgeBandAndMoment(ageBandId, momentId)`
- **Where it’s called**: `web/src/app/new/[months]/page.tsx` (based on query param `?moment=...`)
- **Client render**: `web/src/app/new/[months]/NewLandingPageClient.tsx` sorts `selectedSet.pl_reco_cards` by `rank`

Quoted ground truth:

```ts
// web/src/lib/pl/public.ts
export async function getPublishedSetForAgeBandAndMoment(ageBandId: string, momentId: string) {
  const { data } = await supabase
    .from('pl_age_moment_sets')
    .select(`
      id,
      age_band_id,
      moment_id,
      status,
      headline,
      published_at,
      created_at,
      updated_at,
      pl_reco_cards (
        id,
        set_id,
        lane,
        rank,
        category_type_id,
        product_id,
        because,
        why_tags,
        created_at,
        updated_at,
        pl_category_types:category_type_id ( id, name, label, slug ),
        products:product_id ( id, name )
      )
    `)
    .eq('age_band_id', ageBandId)
    .eq('moment_id', momentId)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  // ...
}
```

```tsx
// web/src/app/new/[months]/NewLandingPageClient.tsx
const cards = selectedSet?.pl_reco_cards
  ? [...selectedSet.pl_reco_cards].sort((a, b) => a.rank - b.rank)
  : [];
```

---

## Confirmed: views vs legacy tables (frontend reads)

### What `/new` reads today (on `main`)

- `/new` is a redirect only (no reads).
- `/new/[months]` reads from **legacy base tables**, via Supabase:
  - `pl_age_bands`
  - `pl_age_moment_sets`
  - `pl_moments`
  - `pl_reco_cards`
  - `pl_category_types` (via relation on cards)
  - `products` (via relation on cards)

### Are we reading from `v_gateway_*_public` views?

**No — not on `main`**. The Phase A `v_gateway_*_public` view read-path appears in the separate branch `origin/feat/phase-a-ui-cutover` (not part of this PR0).

---

## Revalidation one-liners (run later)

These are intentionally “one-liners” to paste into Supabase SQL Editor later.

### a) Products by `age_band_id` in `v_gateway_products_public`

```sql
SELECT age_band_id, COUNT(*) AS product_count
FROM public.v_gateway_products_public
GROUP BY age_band_id
ORDER BY age_band_id;
```

### b) Category types by `age_band_id` in `v_gateway_category_types_public`

```sql
SELECT age_band_id, COUNT(*) AS category_type_count
FROM public.v_gateway_category_types_public
GROUP BY age_band_id
ORDER BY age_band_id;
```

---

## Screenshot placeholders (do not fabricate)

- **Screenshot 1 (TODO)**: `/new/26` initial load (hero + age slider visible)
- **Screenshot 2 (TODO)**: `/new/26` moment selection state (selected moment highlighted)
- **Screenshot 3 (TODO)**: `/new/26?moment=bath` showing “Your 3 picks” cards
- **Screenshot 4 (TODO)**: Empty state when no published set exists for selected age+moment

