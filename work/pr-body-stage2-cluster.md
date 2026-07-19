## Summary

Bug bash item 1 — Stage 1 cards leading to duplicate Stage 2 lists. Validated against the offline source of truth (Spine 3.0 Bible → 1–3m workbook → `discover_projection` tab): **it was a real bug, not content reality.**

- **Root cause:** the Bible maps each Stage 1 cluster to its own curated Stage 2 list (55 rows for 1–3m, only 2 intentional overlaps), but ingestion dropped the cluster column and keyed rows by shared development needs. Clusters sharing a need rendered the union of each other's cards ("I'm starting to wriggle" showed 20 cards instead of 7; "I'm finding your face" was missing its high-contrast card entirely) and per-cluster copy variants collapsed to one arbitrary winner.
- **Schema:** `20260719110000_add_wrapper_context_stage2_junction.sql` adds `ux_wrapper_id` to the Stage 2 junction, widens the unique key, and exposes `wrapper_slug` on `v_gateway_category_types_public`.
- **Generator:** `scripts/generate-discover-projection-sql.mjs` now carries `cluster_entity_id` through to the junction, so every future Bible reimport gets exact per-cluster fidelity.
- **Data:** `20260719112000_reimport_discover_1_3m_cluster_context.sql` regenerates 1–3m from the Bible (55 rows / 10 clusters; validation notices pass). Both migrations already applied via `supabase db push`. Also commits 16 previously-applied image-mapping migrations to sync history.
- **App:** `web/src/lib/pl/public.ts` resolves Stage 2 cards by cluster directly when rows are cluster-tagged; legacy need-based path kept only for bands not yet re-ingested. Cache version bumped.

Note: 9–12m has the same latent duplication and will be fixed automatically when re-ingested from its Bible.

Also includes bug bash item 4 — **picks-first Stage 2 ranking**: within each lane, cards with Ember Picks now lead (e.g. under "Help me settle and reconnect", "Baby carrier or sling" now ranks ahead of white noise, which has no picks yet).

## How to verify (preview)

1. Open the preview → `/discover/2`.
2. "I'm finding your face" → 5 cards: Face-to-face play, Copying faces, Baby-safe mirror, High-contrast face cards, Face books to look at together.
3. "I'm listening to your voice" → 7 cards, none of the faces cluster's cards (except Board books, intentionally shared with different copy: "Board books and face books").
4. "I'm starting to wriggle" → 7 cards (was 20).
5. Gift toggle still renders; Stage 3 "See Our Picks" still shows on categories with picks (e.g. Baby-safe mirror, Board books).

## Test plan

- [x] `supabase db push` — both migrations applied, validation notices pass
- [x] Live SQL diff vs Bible: all 10 clusters exactly match `discover_projection`
- [x] `tsc --noEmit` clean
- [ ] `pnpm build` clean
- [ ] Vercel preview green
