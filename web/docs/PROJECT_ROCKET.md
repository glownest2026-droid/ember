# Project Rocket

**Status:** Active — formal kickoff 2026-07-15  
**Objective:** Get Ember business-ready for public membership launch — earn trust and retention through Ember Plus (paid), with Free remaining genuinely useful.

**Product marketing source of truth:** [`PRODUCT_MARKETING_LIBRARY.md`](./PRODUCT_MARKETING_LIBRARY.md)  
**Persona bar:** Conscientious Conor (`.cursor/rules/conscientious-conor.mdc`)  
**Agent rule:** `.cursor/rules/project-rocket.mdc`  
**Founder roadmap (HTML, open in browser):** dual-track plan — Google Drive `Project Leaf / Project Rocket / Ember_Project_Rocket_Roadmap.html` (mirror: `Project Leaf - Knowledge / Project Rocket /` · repo: `agent-tools/exports/Ember_Project_Rocket_Roadmap.html`)

---

## One-line definition

Ship the **Pip feature set** to an agreed `$MVP_Threshold`, collect demand via waitlist + founding price, then turn on paid checkout when core value is real — not when the pricing page looks ready.

---

## Current honesty (baseline)

| Surface | Reality (Jul 2026) |
|--------|---------------------|
| Free Discover + gift mode | Live (gold bar: 13–15m / `/discover/14`) |
| Smart Marketplace | Partial (list, browse, age/radius; alerts mostly UI) |
| Ember Plus checkout / entitlements | Not live — pricing CTAs should stay waitlist until threshold |
| Pip’s Pathway | Prefs + Discover content exist; **no automated T−3M journeys** |
| Pip’s Picks | UI plumbing exists; **Stage 3 shortlists thin/empty on many bands**; not Plus-gated |
| Pip’s Patch Finds | Marketplace pull; **no “comes to you” push** on developmental match |
| Pip’s Seasons / Chapters | Marketing vision; content not productised |
| Pip’s Pass-On | Garage / list path partial; **no outgrown nudge** |
| Inventory | Closely related to Marketplace; **Discover “Have it” is session-scoped**, not full household inventory |
| OneSignal | Opt-in + prefs + dashboard test; **not automated Pip programs** |

---

## Locked naming (do not rename in Rocket work)

| Feature | Name |
|---------|------|
| Pathway | Pip’s Pathway |
| Picks | Pip’s Picks |
| Local finds | Pip’s Patch Finds |
| Seasonal guides | Pip’s Seasons |
| Life moments | Pip’s Chapters |
| Declutter / list | Pip’s Pass-On |

Loop language: **Know it. Find it. Move it on.**  
Always say **Ember Plus** (not bare “Plus”). Pip = pocket play coach — not “Pip the robin” in customer copy.

---

## `$MVP_Threshold` BRD (acceptance)

Ship public paid membership only when these are true (or explicitly waived in writing by founder).

### Pip’s Pathway

1. Parent receives notification(s) (push / email / channels they’ve selected) **T−3 months** early. Example: when child enters **10–12m**, start feeding **13–15m** content — Ember on the front foot.
2. Occasional helpful nudges for **overlooked** stage recommendations (ideas not opened / not marked Have).
3. Excellent inventory management: easy to (a) mark Discover recommendations as **Have**, and (b) manage household inventory.

### Pip’s Picks

1. For the parent’s age band, Ember Plus Picks are viewable for all **high-priority Stage 2 cards**.

**How “high priority” is defined (Spine 3.0 — answered):**  
Use Ember Bible attributes, **not** `01 Source Captures`.

| Signal | Where | Use |
|--------|--------|-----|
| **`show_ember_picks = TRUE`** | `discover_projection` + `commerce_marketplace_rules` | **Primary definition** of Picks-eligible Stage 2 |
| `ui_lane = things_that_can_help` + `content_type = product_category` | `discover_projection` | On gold 13–15m, these align ~1:1 with `show_ember_picks` |
| `marketplace_value_level` (e.g. medium+) | `commerce_marketplace_rules` | Secondary sort / commerce depth |
| `gifting_relevance` / `gift_friendly` | Bible + projection | Gift lane + buyer mode; not identical to Picks set |
| `category_rank` / `cluster_rank` / `lane_rank` | `discover_projection` | Ordering within band |
| `stage_fit_strength` | `lifecycle_timing` | Editorial “why now” strength — not a Picks gate alone |
| `inspection_priority` | Source Builder `source_page_inventory` | Research workload only — **not** product priority |

**13–15m gold counts (Bible):** 74 Stage 2 rows · **37 `show_ember_picks`** · 30 `gift_friendly`.  
Across Conor-depth Bibles, Picks flags typically land ~20–40 categories per band — that is the Stage 3 sourcing backlog for MVP, not “every carousel card.”

**Source Captures (`01`) are evidence, not prioritisation.** Useful columns for later matching: `developmental_themes`, `item_or_category_mentions`, `provisional_concept_tag`, `parent_practical_lane` — they help explain *why* a knight’s helmet or doctor’s kit might map to pretend / care play, not which cards need Amazon shortlists first.

### Pip’s Patch Finds

1. Instant notification when there is a **local match** for a toy that suits the child’s **current Stage 1 needs**, and the parent has **not** marked it Have / does **not** already have a matching inventory item.

### Pip’s Seasons

1. Launch guides: **Summer 2026** cut into **babies vs toddlers**; birthdays covered by existing Discover Stage 3 / gift paths where available.

### Pip’s Chapters

1. Content for major milestones (nursery, new sibling, family travel — list to be finalised with founder).

### Pip’s Pass-On

1. Notification when inventory is likely outgrown: (i) marketplace demand / matches exist, or (ii) if no live matches, encourage listing.

---

## Commercial / GTM decisions (locked unless founder changes)

1. **Checkout deferred** until `$MVP_Threshold` (or founder waiver).
2. **Public CTAs:** “Join the waitlist” until threshold — **interest only** (no founding £2.99 offer).
3. **Waitlist storage:** native **Supabase** table (email + optional `user_id` for signed-in users; source; created_at). Covers net-new and already signed-in. No third-party ESP required for collection; export from dashboard.
4. Free remains real; Plus must feel like unlock of Pip layer, not paywall of Discover.

## Dual-track operating model

Founder HTML roadmap (v2) is the single project-plan view: **Founder Jobs** ‖ **Cursor Builds**, with yellow **blockers**.

| Cursor can advance with minimal founder input | Needs founder (hard blocker for valued outcome) |
|-----------------------------------------------|--------------------------------------------------|
| Waitlist (Supabase + CTAs) | F1–F3 Picks scope + rules + shortlist rows |
| Inventory UI sister to Marketplace + durable Have | F4 Summer Seasons content |
| Picks rails / empty states on `show_ember_picks` | F6 before live push/email |
| In-app Pathway “what’s next” | F7 before public Patch alerts |
| Match/confirm listing UX (iterate via preview) | F5 Chapters editorial |
| Pass-On heuristics (after Inventory) | |

---

## Effort reframe (honest)

| Founder draft bucket | Agent view |
|----------------------|------------|
| OneSignal / Pathway T−3M = “low effort” | **Medium** — segments exist in product brain; still needs child DOB → band scheduling, content templates, send pipeline, quiet hours, prefs honour |
| Patch Finds push | **High** — depends on durable Inventory + developmental match quality + geo |
| Inventory UI sister to Marketplace | **High** — correct product model; shared listing workflow is the right architecture |
| AI Marketplace age + need match | **High** — guess + confirm UX; taxonomy mapping from photo/title |
| Stage 3 / Pip’s Picks catalogue | **High content ops** — engineering can map + import; founder/curation owns quality bar |
| Waitlist + founding price on `/pricing` | **Low** — do early |
| In-app Pathway “next band” without push | **Lower** than OneSignal — good interim trust earn |

---

## Architecture principles (Rocket)

1. **Inventory ↔ Marketplace are sisters** — shared AI listing (photo → propose age + Stage 1 need + category), shared inventory record; path **Add to inventory → List on marketplace** in minimal clicks.
2. **Have on Discover must persist** (account + child scoped) and feed Inventory / Patch / Pass-On — session-only Have is not MVP-complete.
3. **Match pipeline (listing):** photo/title → candidate Ember category + age bands + Stage 1 needs → **parent confirms** (never silent magic). Hard cases (knight’s helmet, doctor’s kit) = pretend play / care play tags with confidence + edit.
4. **Stage 3 sourcing:** map Ember `show_ember_picks` categories → retailer taxonomy; curate shortlists (stars, UK availability, safety). Pure scrape is a **research aid**, not auto-publish without Conor five tests + safety.
5. **Notifications:** Pathway baseline from Discover taxonomy T−3M; Patch and Pass-On only after Inventory + match are trustworthy.
6. **Privacy:** optional child call-name may personalise; never required (see privacy-promise rule).

---

## Phased roadmap

### Phase 0 — Rocket kickoff (this week)

- [x] Formal log + Cursor rule (`web/docs/PROJECT_ROCKET.md`, `.cursor/rules/project-rocket.mdc`)
- [x] Founder HTML dual-track roadmap (Drive + exports)
- [x] Supabase waitlist table + “Join the waitlist” CTAs (signed-in + net-new; no founding offer) — `ember_plus_waitlist` + `/api/waitlist/ember-plus` + `/pricing` modal (2026-07-15)
- [ ] Founder confirms Launch Band Set for MVP (recommendation: **1–3m through 13–15m** first) — **F1**

### Phase 1 — Trust base (content + ownership)

**Goal:** Free still excellent; Plus promise becomes partially true in-app.

1. Persist **Have** + household **Inventory** (sister to Marketplace UI/data).
2. Stage 3 shortlists for **`show_ember_picks = TRUE`** on Launch Band Set (import via Spine / ABI, not ad-hoc UI hacks).
3. Surface Pip’s Picks on those cards (Plus badge ok; hard gate can wait until checkout).
4. First **Seasons** pack: Summer 2026 babies vs toddlers (editorial).

**Founder deps:** approve Picks bar (3–5 products/category? min rating? UK retailers only?); Summer Seasons brief; export/confirm canonical Bible files for Launch Band Set.

### Phase 2 — Pathway (know it)

1. In-app “what’s next” using child age → current + **next** band Discover content.
2. OneSignal (and/or email) **T−3M** program templates from `/discover` taxonomy.
3. “Overlooked ideas” nudge (opened vs Have).

**Founder deps:** tone samples for push/email; quiet-hour preferences; confirm when call-name may appear in notifications.

### Phase 3 — Find it (Patch + matching)

1. Listing AI: age + developmental need suggest + confirm.
2. Patch Finds: notify on local match ∩ Stage 1 need ∩ not Have/inventory.
3. Marketplace ↔ Inventory one-flow list.

**Founder deps:** geo/radius policy; safety/recalls stance for used toys messaging.

### Phase 4 — Move it on (Pass-On)

1. Outgrown heuristics (age-band expiry + category lifecycle from Bible `move_on_trigger` where present).
2. Notify: matches exist OR encourage list.

### Phase 5 — Chapters + deepen Seasons

1. Chapters v1 list (nursery, new sibling, travel + …).
2. Christmas / birthday seasoning after Summer pack proven.

### Phase 6 — Monetise

1. Stripe (or chosen) checkout + entitlements.
2. Founding price → standard flip rules.
3. Convert waitlist; gate Plus surfaces properly.

**Exit criteria:** `$MVP_Threshold` checklist above green.

---

## Stage 3 sourcing recommendation (vs Amazon scrape)

**Do for MVP**

1. Export all `show_ember_picks` categories for Launch Band Set from Ember Bibles.
2. Map Ember slug → Amazon (or John Lewis / Argos) browse node **manually first** for top ~50 categories by parent traffic / gift rank.
3. Human-curate **3 picks** per category (not 5) with why / avoid / borrow note — Conor bar.
4. Use scrapers/assistants only as **draft shortlists**, then founder/editor pass before ingest.

**Avoid for MVP**

- Auto-ingesting top-5 ≥4.5★ into live Stage 3 without judgement copy.
- Treating Source Capture commercial notes as a buy list.

Spine path (founder machine):

`G:\My Drive\Project Leaf\Project Leaf - Database Builds\Spine Build 3.0\`

- `Spine 3.0_01 Source Captures` — evidence  
- `Spine 3.0_00 Source Builders` — source register / inspection priority  
- `Spine 3.0_02 Ember Bibles` — **product truth** (`discover_projection`, `commerce_marketplace_rules`)  
- `Spine Build PACK 3.0 (Conor-Grade Content)` — master library + SOP prompts  

---

## Pip’s Chapters — starter milestone list (draft for founder cut)

Prioritise with UK Conor calendar + emotion (not encyclopaedia):

1. Starting nursery / childcare  
2. New sibling  
3. Family travel / holidays  
4. First birthday (bridge to Seasons + Discover gift)  
5. Moving house / new room  
6. Returning to work  
7. Illness / slow weeks at home  
8. Grandparent week / other carers  

Ask founder to pick **3 for Chapters v1**.

---

## Baseline notifications (beyond Pathway / Patch / Pass-On)

Worth wiring once prefs + Inventory exist:

| Program | Trigger sketch |
|---------|----------------|
| Pathway T−3M | Child age crosses into band N → serve band N+1 content |
| Overlooked ideas | Stage 2 cards not opened / not Have after N days in band |
| Patch Finds | New local listing matches Stage 1 + not owned |
| Pass-On | Inventory item past lifecycle / demand spike |
| Season opener | Editorial calendar (Summer / Christmas) |
| Quiet win | Optional: “3 ideas you marked Have — want to list one?” |

Avoid spam: prefer **few high-signal** sends; honour channel prefs.

---

## Founder deliverables (no riddles)

**UI source of truth for briefs:** Drive HTML v3 (`Ember_Project_Rocket_Roadmap.html`) — each ID has a copy-paste template, example, and “done when”.

IDs are **F1–F9 in order** (no gaps). Waitlist is a Cursor build with optional copy polish — not a numbered founder brief.

| ID | What you actually send | Format | Blocks |
|----|------------------------|--------|--------|
| **F1** | YES/NO tick list of age bands for Picks wave 1 (+ wave 2 plan) | Chat paste / Doc | Shortlist scope |
| **F2** | Answers to 8 Picks rules (count, retailers, stars, affiliate, stock, workflow, fields, avoid-note) | Chat paste / 1-pager | Accepting any product row |
| **F3** | Spreadsheet rows: 3 products per Picks-flagged card (name, retailer, url, why, avoid, status) | Sheet Cursor provides | Credible live Picks |
| **F4** | Summer 2026: Babies pack + Toddlers pack (promise, sections, include/exclude, CTA) | 1–2 page brief | Seasons publish |
| **F5** | Exactly 3 Chapters milestones + one-line promise (+ include/exclude) each | Chat paste | Chapters v1 |
| **F6** | Notification policy + ≥6 sample lines (Pathway / overlooked / Patch / Pass-On) | Voice pack Doc/chat | Live push/email |
| **F7** | Default/max radius miles + 3–5 approved used-toy safety lines | Chat paste | Public Patch alerts |
| **F8** | A / B / C on scrape-assisted research | One choice | Assisted shortlist drafting |
| **F9** | Written waiver only if charging before finish line | Chat | Phase 6 early |
| Optional | Waitlist button / success microcopy | Chat | Polish only |

**Cursor does not wait on you for:** Supabase waitlist, Inventory sister UI + durable Have, Picks empty rails, in-app Pathway, listing match→confirm UI (preview feedback only).

---

## Progress log

### 2026-07-15 — Kickoff

- Formalised Project Rocket doc + always-on Cursor rule.
- Studied Spine Build 3.0: **high-priority Stage 2 for Picks = `show_ember_picks`**, concentrated on `things_that_can_help` / product categories; Source Captures do not define Picks priority.
- Aligned roadmap with `$MVP_Threshold` BRD; waitlist-first commercial path.

### 2026-07-15 — Founder HTML roadmap

- Branded roadmap for non-technical founder: phases, live outcomes, parent examples, F1–F9 deps.
- Drive: `G:\My Drive\Project Leaf\Project Rocket\Ember_Project_Rocket_Roadmap.html`

### 2026-07-15 — Dual-track v2 + waitlist pivot

- HTML rebuilt: Founder Jobs ‖ Cursor Builds swimlanes; yellow blockers; Inventory = Cursor-owned.
- Waitlist: Supabase-native, interest only; **no founding offer**.

### 2026-07-15 — Founder briefs v3 (no riddles)

- HTML v3: each dependency is a fill-in brief (template, example, done-when). Picks = F1 bands · F2 rules · F3 rows.

### 2026-07-15 — Renumber founder IDs F1–F9 (no gap)

- Removed confusing “F1 dropped” hole. Waitlist is Cursor-owned, not a founder F-number.

### 2026-07-15 — Phase 0 waitlist shipped (code + db)

- Table `public.ember_plus_waitlist` (email, optional user_id, source, created_at); RLS; unique on lower(email)
- `POST /api/waitlist/ember-plus` (service role insert)
- `/pricing` Ember Plus CTA → Join the waitlist modal (signed-in prefills account email)

---

## How agents should update this file

After any Rocket milestone: append a dated bullet under **Progress log**, tick roadmap checkboxes, and note founder decisions that change the BRD.
