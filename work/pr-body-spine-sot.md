## Summary

- Codifies the founder rule (2026-07-19): the offline source of truth for Discover content and Stage 1→Stage 2 mapping is **always** the Spine 3.0 Bible workbook — `Spine 3.0 → Spine 3.0_02 Ember Bibles → 02_Ember_Bible_<band>_*.xlsx → discover_projection tab`.
- New §0 in `.cursor/rules/conor-grade-catalogue-upload.mdc` (always-applied rule): path pattern, what the tab contains, and the rule that when the live DB and the workbook disagree, the workbook wins and the DB is the bug (fixed in a migration, never fuzzy lookups in app code).
- Cross-referenced from `AGENTS.md` topic map and `web/docs/DEVELOPER_OPERATING_MODEL.md` §3 so every agent (Cursor, Codex, human) hits it.

Docs-only; no app or DB changes.

## Test plan

- [ ] `AGENTS.md` map row points to the catalogue rule §0
- [ ] Operating model §3 references the workbook rule
- [ ] Vercel checks green (docs-only change)
