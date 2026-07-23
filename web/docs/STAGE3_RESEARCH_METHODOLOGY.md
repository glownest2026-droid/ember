# Stage 3 research methodology (pilot)

**Status:** locked 2026-07-23 (Writing Guidelines at source)  
**Audience:** founder + research agents  
**Companion:** `web/docs/STAGE3_TRUST_GATES.md` · `web/docs/brand/WRITING_GUIDELINES.md`  
**Schema:** `ember_picks_research_v3`

## Five things that must be true (pilot success)

| # | Must be true | In practice |
|---|---|---|
| 1 | **FF pass first** | Automated Fastidious Founder gates pass before you spend second eyes. Fail → quarantine, not a soft HTML dump. |
| 2 | **Every product has a working, buyable link** | Primary `product_url` opens the real product (HTTP smoke + availability + researcher `url_verification`). |
| 3 | **Founder preview = proposed public content** | Age-band HTML shows links, titles, **Description (20–40 words)**, and **Why Pip picked this** (`ember_verdict`). One Description only — no separate “What this is”. |
| 4 | **Every row stands up to scrutiny** | “Why is this #1?” / “Why these top 5?” is answered from documented DB fields — never invented in chat. |
| 5 | **Public copy approved at research** | Parent-facing fields in `inbox/` already follow `web/docs/brand/WRITING_GUIDELINES.md`. FF catches banned tells; **ingestion does not rewrite voice**. |

**WHAT** = 2 + 3 + 5. **HOW** = 1 + 4.

## Operating model

| Step | What happens | Serves # |
|---|---|---|
| 0. Voice | Read Writing Guidelines before any parent sentence | 5 |
| 1. Bench | Build 15-equal longlist with live URLs | 2, 4 |
| 2. Age + safety | Capture `age_signals[]` from the listing | 1, 4 |
| 3. Rank | Write `buying_factor_memo` + per-rank `rank_rationale` | 4 |
| 4. Public copy | Title, Description (**20–40 words**), Why Pip — **shippable now** | 3, 5 |
| 5. WHAT proof | Brand/publisher primary; smoke + availability | 2 |
| 6. Status | `pending-ff-check` only | 1 |
| 7. FF | Deterministic gates + HOW + copy bans (second pass) | 1, 2, 4, 5 |
| 8. Founder HTML | Proposed public content + HOW trail | 3, 4, 5 |
| 9. Ingest | Map green JSON → DB/UI **without rewriting voice** | 5 |

## Review thresholds (canon)

- Top Picks: `rating_value >= 4.4` **and** `rating_count >= 15` when count is present
- Specialist exemption: written reason allowed when scrape is thin, but **cannot** excuse a SKU page that shows fewer than 15 reviews

## HOW fields (required documentation)

| Field | Where | Purpose |
|---|---|---|
| `buying_factor_memo` | Category root | 4–6 factors used to rank *this* category |
| `methodology` | Category root | Must name steps: bench → age → rank → URL verify |
| `rank_rationale` | Top Picks + longlist 1–10 | Why this rank vs the one below |
| `missed_top5_reason` | Longlist 6–10 (req); 11–15 (rec) | Why it did not make Top 5 |
| `age_signals[]` | Top Picks | Structured listing age (strictest wins) |
| `url_verification` | Top Picks | `{ checked_at, http_status_or_method, primary_opens_product }` |

## Scrutiny contract

If the founder asks in chat “why #1 jigsaw?” or “why these five books?”, the agent must **read and quote** `rank_rationale` / `buying_factor_memo` / the evidence ledger from **green** JSON.

- Empty fields = research defect, not a chat gap.
- Do not invent a post-hoc story.

## Banned execution patterns

- Compressed Task packets (“fix the 404s”, light repair of quarantine JSON)
- Self-marking `production-ready` from research
- Building founder HTML from `inbox/` or `quarantine/`
- Promoting pre-v3 / `untrusted_drafts/` through FF as the new standard
- **Rewriting parent voice at ingest** because research left weak copy
- Leaving “worth buying / calm / em dash / Stage X / crisis framing” for a later pass to clean up

## Allowed path only

Full Mode A `$ember-stage3-research` (Writing Guidelines at source) → `inbox/` → `$ember-stage3-ff-checker` (second pass) → `green/` → `$ember-stage3-founder-review` → founder second eyes → (separate GO) `$ember-stage3-card-ingestion` (**copy-faithful**).

## Pilot learnings (34–36m picture books → process upgrades)

### URL preflight (before locking Top 5)

1. Collect 2–3 candidate URLs per product (brand/publisher, major UK retailer, Amazon as last resort).
2. Run `node agent-tools/scripts/stage3-url-preflight.mjs url1 url2 …` (or smoke each with `stage3-url-smoke`).
3. Set **primary** to the first URL that returns HTTP 2xx/3xx **and** opens the correct product.
4. Keep other working links in `alternate_urls`.
5. Expect intermittent **403/429** on Walker, some Waterstones, and bot-sensitive shops — swap primary immediately; do not wait for FF to fail.

### Age-mark hygiene (especially bands with `min_months < 36`)

- Prefer publisher edition marks you can structure: e.g. Walker **“Ages 1–5”** → `age_signals` age_range 12–60.
- **Do not** put Waterstones-style **“Interest age: From 5 years”** or bare **“Ages 3+”** / **“From 5 years”** into `age_mark_on_listing` for 34–36m — FF parses those as min 36m/60m and **fails**.
- BookTrust “interest age 3–7” is OK only when stored as a structured **age_range** (36–84) that overlaps the band, or as soft `interest_age` plus a hard overlapping signal.
- Toys/gear: “Not suitable under 3 years” still **fails** 34–36m.

### Rating honesty

- Many retailer star widgets are JS-rendered and cannot be scraped live.
- Prefer a countable UK source when available; otherwise record aggregate with an honest `rating_source` and set `founder_qa_flag` (e.g. `check_price`) so the founder spot-checks before ingest.
- Never invent review counts to clear the ≥15 bar.

### Availability / deprecated products (small-world pilot → systemic gate)

1. After URL smoke, run `node agent-tools/scripts/stage3-availability-check.mjs` on every Top 5 **primary** (and manufacturer `alternate_urls`).
2. **Hard fail** Top Picks when the live page shows: `retired product`, `discontinued`, `notify me when in stock`, `sold out`, `currently unavailable`, or equivalent.
3. **Cross-check:** if a manufacturer alt shows **retired product**, reject the SKU even when a retailer primary still loads.
4. If a bot-sensitive retailer (Hamleys, ELC) blocks automated fetch, swap to a **buyable** primary (often Amazon UK) and document why in `evidence_notes` — do not ship a notify-when-in-stock or retired link as Open link.
5. FF Checker enforces this via `stage3-ff-check.mjs` before `green/` promotion.

### Execution

- One full Mode A packet per category (Skill + methodology + trust gates). No compressed “fix the 404s” Tasks.
- Prior quarantine/untrusted JSON = **name hints only**.
- After a category greens, rebuild founder HTML from `green/` (band-wide when multiple categories are ready).
