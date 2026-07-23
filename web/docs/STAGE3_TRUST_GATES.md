# Stage 3 trust gates (pilot)

**Status:** locked for pilot (founder GO 2026-07-22; methodology rebuild 2026-07-22)  
**Applies to:** all Stage 3 research → FF Checker → founder HTML → ingest  
**Persona bars:** Conscientious Conor + Fastidious Founder  
**Methodology:** `web/docs/STAGE3_RESEARCH_METHODOLOGY.md`  
**Schema:** `ember_picks_research_v3` (FF rejects older drafts)

## Founder pilot success (four must-be-true)

1. **FF pass first** — automated Fastidious Founder gates pass before human second eyes.
2. **Every product has a working link** — primary `product_url` opens the real product.
3. **Founder preview = proposed public content** — links, titles, short descriptions, Why Pip picked this.
4. **Scrutiny-ready database** — ranking answers come from documented fields (`buying_factor_memo`, `rank_rationale`, ledger), never invented in chat.

## Principles

1. **Never guess a URL is working.** Unverified ≠ live. Fail closed.
2. **Retailer age marks are safety/trust signals**, not flavour text. Strictest signal wins.
3. **Research may not self-approve.** Max status after research: `pending-ff-check`. Only `$ember-stage3-ff-checker` may promote to `green/`.
4. **Brand/specialist primary URLs** preferred; Amazon/Argos are alternates until smoke + age attributes pass. **Preflight** candidate URLs before locking Top 5 (`stage3-url-preflight.mjs`); swap primary on 403/429.
5. **No compressed / light-repair path to green.** Link-only fixes, “fix the 404s” Task packets, and patching quarantine JSON without a full Mode A `$ember-stage3-research` run are **banned**. Prior JSON may be used only as *name hints*; every URL, age signal, rating, and rank must be re-earned under schema v3.
6. **Age-mark hygiene:** do not store Waterstones-style “Interest age: From 5 years” or bare “Ages 3+” in `age_mark_on_listing` for bands with `min_months < 36` — use structured overlapping `age_signals` (see methodology).
7. **Root cause upstream:** parent-copy quality (Description, Why Pip, Best for, Top 5 shape, voice bans) is **owned by research + Writing Guidelines**. FF **re-validates** those rules; it does not invent or rewrite voice. See methodology “Root-cause rule”.

## Hard gates (Top Picks)

| Gate | Pass rule | Fail | Owned by |
|---|---|---|---|
| Schema | `schema_version` = `ember_picks_research_v3` | Older schema → reject | FF |
| HOW (category) | Non-empty `buying_factor_memo`; `methodology` names bench → age → rank → URL verify | Missing / vague | Research writes; FF validates |
| HOW (picks) | Every Top Pick has non-empty `rank_rationale`, structured `age_signals[]`, `url_verification` | Missing → fail | Research writes; FF validates |
| HOW (longlist 6–10) | Each has non-empty `missed_top5_reason` | Missing → fail | Research writes; FF validates |
| URL | Primary `product_url` returns HTTP 2xx/3xx on smoke check | Dead, timeout, or unverified → cannot be Top Pick | FF |
| Availability | Primary page is **buyable today** — not retired, discontinued, or notify-when-in-stock | `deprecated` / `unbuyable` / fetch failed → cannot be Top Pick | FF |
| Alternate cross-check | Manufacturer alt showing **retired product** fails even if retailer primary loads | Retired on brand alt → fail | FF |
| Reviews | `rating_value >= 4.4` **and** `rating_count >= 15` | Below either threshold | Research selects; FF validates |
| Specialist exemption | Explicit `evidence_exemption: specialist` + written reason; **SKU `rating_count` still must be ≥15 when present** | Brand fame alone / single 5★ with &lt;15 reviews on this SKU | Research declares; FF validates |
| Age overlap | Listing age signals overlap the Ember band (see below) | No overlap or safety exclusion conflicts | Research captures; FF validates |
| Age absent | Top Pick must have at least one structured age signal | Missing age → fail (unless founder-waived specialist) | Research captures; FF validates |
| Schema counts | 5 Top Picks, 15 longlist, ≥5 skips (product categories) | Count mismatch | Research; FF validates |
| Best-for | Unique tags; `Best for` + ≤6 words after prefix; tag must land in Description/Why Pip | Duplicate / feature-list / orphan tag | **Research (root)**; FF re-checks |
| Public copy | Description **20–40 words**; Why Pip **40–60 words**; no “tag” meta-talk; Why Pip ≠ Description echo; max **two** same brand; prefer Shopping-findable primaries; Writing Guidelines bans; unique Top 5 names. Written cleanly in `inbox/` | Empty / outside bands / tag talk / echo / brand monoculture / banned / duplicate | **Research (root)**; FF re-checks |

## Age signals (all product types)

Capture into `age_signals[]` (strictest wins for `age_gate`):

| Type | Examples | Gate strength |
|---|---|---|
| Safety exclusion | “Not suitable for children under 3 years / 36 months” | **Hard fail** if `band.min_months < forbidden_under_months` |
| Min age mark | “Ages 3+”, “3 years+” | Hard: listing min must not sit above band for default picks; if min is 36m and band includes &lt;36m → **fail** |
| Age range | “Ages 2–5”, “Reading age 4–8” | Hard: ranges must overlap band |
| Interest age | BookTrust / publisher interest | Soft unless retailer contradicts |
| Absent | No age on listing | Fail Top Pick |

### Band overlap (default)

For band `min_months`–`max_months`:

- If `forbidden_under_months` is set and `band.min_months < forbidden_under_months` → **fail**  
  (e.g. 34–36m + “not suitable under 3 years” → fail, because 34–35m children are under the warning.)
- If listing has `min_months`/`max_months` range → fail when no overlap with band.
- Stricter policy for safety-led categories: prefer `listing_min <= band.min`.

## Folder contract

```
agent-tools/exports/stage3/{AGE_BAND}/research/
  inbox/              ← new schema-v3 research only (Cursor/Manus/human)
  quarantine/         ← failed FF check + reports
  green/              ← passed only (founder HTML + ingest)
  ledgers/            ← evidence ledger CSVs
  untrusted_drafts/   ← frozen pre-v3 / light-repair archaeology (never FF as the standard)
```

## Evidence ledger

Auto-generated per category: `stage3_evidence_ledger_{band}_{category}.csv`  
Documents Top Picks, longlist, and skips with URL status, ratings, age gate, pass/fail, `rank_rationale`, `missed_top5_reason`, include/exclude rationale.

## Scripts

- `agent-tools/scripts/stage3-url-smoke.mjs` — batch HTTP status
- `agent-tools/scripts/stage3-availability-check.mjs` — retired / out-of-stock / notify-me detection on live HTML
- `agent-tools/scripts/stage3-ff-check.mjs` — deterministic gates + ledger + folder moves
- `agent-tools/scripts/generate-stage3-founder-rows.mjs` — rows from `green/` only
- `agent-tools/scripts/build_founder_preview.mjs` — HTML (public content + HOW panel)

## Skills

- `$ember-stage3-research` — writes `inbox/`; `pending-ff-check` only; schema v3 + HOW fields required
- `$ember-stage3-ff-checker` — smoke + gates; founder approval before re-research
- `$ember-stage3-founder-review` — HTML from `green/` only
- `$ember-stage3-card-ingestion` — inputs from `green/` only
