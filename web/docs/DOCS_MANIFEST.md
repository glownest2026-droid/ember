# Ember Docs Manifest

**Status:** Canonical docs guardrail
**Purpose:** Lists documentation that should not disappear when branches change or agents work in the repo.

These files are required by `web/scripts/check-required-docs.js` and should exist on every active product branch.

| File | Purpose | Required |
|---|---|---|
| `AGENTS.md` | Cross-agent front door: the 10 non-negotiables + the map of canonical sources. Read first. | Yes |
| `web/docs/DEVELOPER_OPERATING_MODEL.md` | Engineering doctrine and worked examples (branch/migration/data/auth/verify discipline). | Yes |
| `web/docs/EMBER_BRAND_BOOK.md` | Visual identity, tone, typography, and UI brand rules. | Yes |
| `web/docs/CONSCIENTIOUS_CONOR.md` | Core parent persona and copy quality bar. | Yes |
| `web/docs/PRODUCT_MARKETING_LIBRARY.md` | Product marketing names, pricing copy, and banned phrases. | Yes |
| `.cursor/rules/conscientious-conor.mdc` | Always-on Cursor rule pointing agents to the Conor bar. | Yes |

## Rule

Do not delete, rename, or move required docs without replacing every reference and updating this manifest in the same PR.

If a branch is missing one of these files, restore it before doing parent-facing copy or Stage 2/3 work.
