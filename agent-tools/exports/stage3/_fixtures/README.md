# Stage 3 methodology fixtures

Self-check artifacts for the Skills-first rebuild (not live research).

| File | Purpose |
|---|---|
| `ember_picks_34-36m_cat_fixture_good.json` | Schema v3 + HOW fields; must **PASS** FF (including URL smoke) |
| `ember_picks_34-36m_cat_fixture_bad.json` | Thin / v2-shaped; must **FAIL** FF |
| `founder-preview/stage3_founder_review__fixtures.html` | Dress rehearsal of public content + HOW panel |
| `research/green/` | Temporary green copy used only to exercise HTML generators |

Regenerate:

```bash
node agent-tools/scripts/write-stage3-method-fixtures.mjs
node agent-tools/scripts/stage3-ff-check.mjs agent-tools/exports/stage3/_fixtures/ember_picks_34-36m_cat_fixture_bad.json --skip-smoke --no-move
node agent-tools/scripts/stage3-ff-check.mjs agent-tools/exports/stage3/_fixtures/ember_picks_34-36m_cat_fixture_good.json --no-move
```

Do **not** ingest these fixtures. Do **not** treat them as 34–36m pilot picks.
