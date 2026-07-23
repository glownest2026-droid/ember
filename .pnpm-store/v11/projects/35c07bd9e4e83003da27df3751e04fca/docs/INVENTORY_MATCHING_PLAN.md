# Inventory matching architecture plan

**Status:** Active — PR2 in flight (2026-07-20); PR1 merged (#276)  
**Owner:** Project Rocket / At home + Marketplace sisters  
**Persona bar:** Conscientious Conor — parents name things; Ember owns the map.

---

## Problem

`/family/at-home/add` matched free text against **Discover Stage 2 cards** (developmental categories per age band). Parents type real objects (`Paddington bear`, `kitchen broom`, `guitar`) and either get no match or a misleading age-band label (`Pretend phone · 13–15m`).

Ownership vocabulary is broader than Discover editorial. Marketplace, Patch Finds, and Pass-On need a **stable item spine** that spans age bands.

---

## Target architecture (four layers)

```text
Parent types          →  Item type (inventory / listing DNA)
"Paddington bear"        character_soft_toy

Ember shows           →  Family (consolidated group)
                         Soft toys

Ember stores (hidden) →  Stage 2 relevance map (many rows, multi-band)
                         comfort @ 19–21m, care play @ 34–36m, …

Instance pin (PR2+)   →  Age-fit variant on this specific object
                         e.g. peg puzzle vs 24-piece jigsaw
```

| Layer | Table / concept | Parent sees? | Example |
|-------|-----------------|--------------|---------|
| **Family** | `item_type_families` | Yes (primary label) | Soft toys |
| **Item type** | `product_types` + aliases | Sometimes (subtitle) | Character soft toy |
| **Relevance map** | `item_type_stage2_relevance` (PR2) | No | Comfort object · 19–21m |
| **Instance pin** | `garage_items.age_fit_*` (PR2) | Only if ambiguous | `jigsaw_24_plus` |

**Principles**

1. Parents see **one consolidated match**, not a list of Stage 2 cards per age band.
2. Never show Discover age band as “when your child will like this”.
3. Data bugs live in data (migrations + alias seeds), not fuzzy app-code recovery.
4. `product_type_id` is the inventory ↔ marketplace shared key.
5. **Prefer no match over a wrong match** — At home never surfaces trigram-only guesses.

---

## At home match confidence policy (PR1.1)

`inventory_match_at_home` is **stricter** than `inventory_match_product_types` (used elsewhere).

| Tier | Rule | Score | Shown? |
|------|------|-------|--------|
| **1 — Catalogue** | Exact label / alias / substring / all tokens | 68–100 | Yes |
| **2 — AI classify** | Gemini picks `family_slug` + `product_type_slug` from controlled catalogue when Tier 1 misses | confidence ≥ 0.72 | Yes |
| **3 — Gate** | Below thresholds | — | **No match** + Add anyway |

**Tier 2:** `GET /api/inventory/match-at-home?allowAi=1` — only after ~1.2s typing pause (catalogue runs at 300ms). Same phrase cached 24h without a second Gemini call.

**Env:** `AT_HOME_AI_DAILY_LIMIT` (default 30) — **not** `AI_LISTING_DAILY_LIMIT` (photo checks).

**Toy context gate (Tier 1):** if query contains `toy`, matched type must be toy-class.

**Never:** trigram-only guesses.

## PR breakdown (minimum 3)

### PR1 — Add that works (this branch)

**Goal:** `/family/at-home/add` matches item types + families; one best match; founder examples seeded.

| Area | Deliverable |
|------|-------------|
| DB | `item_type_families`; `product_types.family_slug`; seed families + types + aliases |
| DB | `inventory_match_at_home` RPC (match → dedupe by family → return top 1) |
| API | `GET /api/inventory/match-at-home?q=…` |
| UI | `AtHomeAddClient` — single “Best match” card; family label + hint; no age band |
| Save | `saveAtHomeFromProductTypeMatch` → `garage_items.product_type_id` |
| Docs | This file + `PROGRESS.md` |

**Acceptance (founder test list)**

| Query | Expected family / type |
|-------|------------------------|
| kitchen broom | Pretend household → Toy broom |
| peppa pig phone | Pretend phones → Pretend phone |
| paddington bear | Soft toys → Character soft toy |
| freddie the firefly | Soft toys → Character soft toy |
| ice cream truck | Toy vehicles → Toy vehicle |
| guitar | Musical toys → Toy guitar |

**Out of scope:** Stage 2 relevance map, age-fit pinning, Patch/Pass-On notifications.

---

### PR2 — Ember’s hidden map + age-fit pinning

**Goal:** Item types fan out to Stage 2 categories across age bands; jigsaw subtypes gate relevance.

| Area | Deliverable |
|------|-------------|
| DB | `item_type_stage2_relevance` (extend `marketplace_item_type_development_mappings` pattern with real `category_type_id` + `age_band_id`) |
| DB | `garage_items.age_fit_variant`, `age_fit_min_months`, `age_fit_max_months`, `age_fit_source` |
| Seed | Soft toys, pretend household, puzzles — multi-band maps |
| UI | Single ambiguity tap when family is `puzzles` and query is ambiguous |
| RPC | Save stores relevance snapshot or resolves best Stage 2 link for child month |

**Acceptance:** Paddington saved item has multiple relevance rows in DB; 24-piece jigsaw does not pin to 14m.

---

### PR3 — Patch Finds + Pass-On fan-out

**Goal:** Local listing notifies eligible parents using family + relevance + Stage 1 intersection.

| Area | Deliverable |
|------|-------------|
| Engine | On listing publish → resolve item type → relevance rows → buyer child month ∩ Stage 1 needs |
| Gate | Exclude buyers who already own family/type; dedupe notifications |
| Pass-On | “Demand near you” when `ready_to_move_on` + local interest |
| OneSignal | Wired per `$MVP_Threshold` acceptance criteria |

**Depends on:** PR2 age-fit gating for puzzle-like families.

---

## Data model (PR1)

### `item_type_families`

```sql
slug TEXT PRIMARY KEY   -- e.g. soft_toys
label TEXT NOT NULL     -- e.g. Soft toys
hint TEXT NULL          -- e.g. Often comfort first, then care play later
is_active BOOLEAN
```

### `product_types.family_slug`

FK → `item_type_families.slug`. Nullable for legacy rows; new seeds always set family.

### `product_type_aliases`

Parent language → `product_type_id`. Global unique `normalized_alias` (existing).

### `inventory_match_at_home(query, limit)`

1. Rank via `inventory_match_product_types` (exact, alias, FTS, trigram).
2. Join family metadata.
3. Dedupe by `family_slug` (keep highest score per family).
4. Return `limit` rows (default **1** for At home UI).

---

## UI contract (At home add)

| Element | Rule |
|---------|------|
| Section title | **Best match** (singular) when `limit=1` |
| Primary label | `family_label` or `label` fallback |
| Subtitle | `family_hint` or product `subtitle` — never raw age band |
| CTA | **This one** → saves `product_type_id` |
| Fallback | **Add “…” anyway** → `raw_query` only (unchanged) |

---

## Marketplace coupling

| Flow | PR1 behaviour |
|------|----------------|
| At home add | Saves `product_type_id` directly |
| List it | Draft inherits `product_type_id` from `garage_items` |
| Discover Have | Unchanged — still `category_type_id` via `sync_at_home_from_discover_have` |
| Demand signal | Already keyed on `product_type_id` (`demand.ts`) |

---

## Alias growth (ongoing)

1. **Seed packs** in migrations (founder examples, high-volume unmatched).
2. **`inventory_unmatched_queue`** — parents who used “Add anyway” feed weekly alias review (PR2 admin tooling optional).
3. **Photo / listing copy** — suggest label → same matcher (existing analyse-image path).

No embeddings in PR1–PR3 unless alias + controlled taxonomy still fails at scale.

---

## Key files

| Topic | Path |
|-------|------|
| Plan (this doc) | `web/docs/INVENTORY_MATCHING_PLAN.md` |
| At home lib | `web/src/lib/inventory/atHome.ts` |
| Add UI | `web/src/components/family/AtHomeAddClient.tsx` |
| Match API | `web/src/app/api/inventory/match-at-home/route.ts` |
| Legacy Stage 2 match | `web/src/app/api/inventory/match-stage2/route.ts` (kept for reference; not used by add UI) |
| Product match RPC | `inventory_match_product_types` in `supabase/sql/202603311200_inventory_spine_and_match.sql` |
| PR1 migration | `supabase/migrations/20260720120000_at_home_item_type_families_pr1.sql` |
| Rocket context | `web/docs/PROJECT_ROCKET.md` |

---

## Verification checklist

### PR1 (preview)

1. Sign in → `/family/at-home/add`
2. Type each founder example → one sensible **Best match** (not “no match”, not Stage 2 age band)
3. Tap **This one** → item appears on `/family/at-home` with family/type label
4. **Add anyway** still works for nonsense strings
5. `pnpm -C web build` passes; Vercel preview green

### PR2

- DB: `SELECT * FROM item_type_stage2_relevance WHERE product_type_id = …` returns multi-band rows for Paddington type
- Ambiguous “jigsaw” prompts one clarifying tap

### PR3

- List soft toy locally → eligible parents notified; ineligible (wrong month / already own) excluded

---

## Decision log

| Date | Decision |
|------|----------|
| 2026-07-20 | Three-PR minimum; PR1 = item type + family + consolidated UI |
| 2026-07-20 | Stage 2 matching removed from At home add UI; Stage 2 links deferred to PR2 |
| 2026-07-20 | `item_type_families` promoted from informal `parent_category_slug` string |
