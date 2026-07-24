# Ember Writing Guidelines

**Status:** Canonical (founder signed off 2026-07-23)  
**Path:** `web/docs/brand/WRITING_GUIDELINES.md`  
**Who this is for:** a copywriter or agent writing for Ember for the first time, with no prior brand context.  
**Sister docs:** [PERSONAS](./PERSONAS.md) · [BRAND_BOOK](./BRAND_BOOK.md) · [PRODUCT_MARKETING](./PRODUCT_MARKETING.md)

**North star:** Ember is a supportive partner. Show the good outcome. Help parents get there in warm, playful, British school-gate English.

**Scope:** By default the whole app is parent-facing. These rules also cover blogs, emails, push, empty states, and future content forms unless a surface is explicitly internal (admin, research ledgers, FF reports).

If two docs disagree on *wording*, this file wins for voice. Personas still win on *whether the idea earns its place*.

---

## Before you write anything

Imagine you are texting a kind, sharp UK parent friend. Their home already has toys and books. You are not selling hard, not diagnosing chaos, and not sounding like a content engine.

**Lines that already sound like Ember:**

- to help your child get better at sharing
- to keep threading interesting as their concentration grows
- A gentle story about friendship and joining in.
- Keep them company while they lace, as the cords love to tangle.

**Pattern to aim for:** simple, specific, authentic, lightly playful. A true inconvenience can appear when it is fun to say (tangle-y cords). The parent is never cast as failing.

**Read every line aloud.** If it sounds like a brochure, a US podcast, or generated filler, rewrite.

---

## Part A — Principles (Do first, then watch-outs)

### Principle 1 — Lead with the positive vision

Ember helps families grow into good things: kinder sharing, steadier routines, longer concentration, proud “I did it” moments. Name that destination. Stand beside the parent as a partner on the way there.

This is Marketing 101 for Ember: **always frame the positive vision**. Do not open on fear, shame, crisis, or the trap. Tired and thoughtful is fine. Extremes are not.

**Do**

- Name the skill or joy they are growing into.
- Use partner language: help, practise, build, get better at, keep… interesting.
- Keep the mood hopeful and light.

**What good looks like**

- to help your child get better at sharing
- to help you build steady bedtime routines together
- to keep threading interesting as their concentration grows
- A gentle story about friendship and joining in.

| Pass | Fail |
|---|---|
| to help your child get better at sharing | nobody wants to take turns |
| to help you build steady bedtime routines together | mornings and bedtimes that keep falling apart |
| to keep threading interesting as their concentration grows | once random threading gets boring |

---

### Principle 2 — Write in British school-gate English

Write the way thoughtful British parents actually talk: full sentences, everyday words, a bit of humour when it fits. Warmth means complete thoughts, not clipped orders. Playfulness means “the cords love to tangle”, not forced puns or brochure adjectives.

**Do**

- Prefer full, friendly sentences.
- Use British school-gate English (nursery, playdate, bedtime, sharing, best friend, scuttles away, sorts it out).
- Let a harmless inconvenience be funny when it is true.

**What good looks like**

- Keep them company while they lace, as the cords love to tangle.
- Helps your child learn about situations where their best friend scuttles away to play with someone else.
- A short, sunny bedtime story about kindness and friends.

| Pass | Fail |
|---|---|
| Keep them company while they lace, as the cords love to tangle. | Sit with them; laces tangle fast. |
| Helps your child learn about situations where their best friend scuttles away to play with someone else. | Useful when your child watches a best friend run off to play with another child. |
| A gentle story about friendship and joining in. | Language for real playgroup wobbles. |

**Watch-out:** Words like “cheerful”, “delightful”, and “magical” often sound like packaging, not the school gate. Prefer sunny, warm, lovely, gentle, or simply describe the thing.

---

### Principle 3 — Be concrete and recognisable

Parents recognise broad, true moments and clear objects. Start from what is in the hand, on the page, or in the routine, then connect it to the positive skill. Keep situations universal enough that many families can see themselves there.

**Do**

- Say what the thing is in plain words.
- Tie it to a familiar skill or routine.
- Prefer moments any parent might nod at.

**What good looks like**

- Chunky wooden shapes on a soft lace for little hands.
- Picture cards that turn threading into a matching game.
- Rearrangeable pictures so your child can see what comes next.

| Pass | Fail |
|---|---|
| a wipe-clean board for morning and bedtime routines | days when you want a simple strip on the wall |
| a short story about learning to share | tug-of-war over the good toy or the front of the queue |
| chunky wooden beads on a soft lace | the calm UK specialist option |

---

### Principle 4 — Explain fit; do not bark shopping orders

Help people see why something suits this moment. Do not make buy, borrow, or hold-off commands the emotional centre of the line. Soft ownership notes are welcome when they are specific and kind.

**Do**

- Explain fit through skill, play, routine, or everyday life.
- Mention familiar series or nursery shelves only when it helps.
- Keep commerce language out of the heart of the sentence.

**What good looks like**

- A short bedtime read about sharing and friends.
- Lots of nurseries already know this one.
- A nice next step when they already enjoy posting beads on a lace.

| Pass | Fail |
|---|---|
| A short bedtime read about sharing and friends. | Worth buying if the library queue is long. |
| Lots of nurseries already know this one. | Borrow first. |
| A nice next step when they already enjoy posting beads on a lace. | Hold off until they’re firmly three. |

**Watch-out:** “Worth buying”, “worth it”, and “worth considering” are banned. They sound like affiliate copy, not a friend.

---

### Principle 5 — Sound human, not generated

Trust breaks when copy sounds machine-made. Prefer plain rhythm, ordinary verbs, and concrete nouns.

**Parity rule (non-negotiable):** Writing Guidelines and the Fastidious Founder checker must ban the **same** things. The machine list is canonical:

`agent-tools/scripts/lib/stage3-banned-copy.mjs`

- Research writes against this Principle **and** that module.
- FF validates by importing that module — it must not maintain a second private ban list.
- When you add or remove a ban, update **the module and this Principle in the same change**. Never leave one side stricter than the other.

**Scope:** these bans apply to parent-facing Pip’s Picks fields (Description, Why Pip, Best for) and other shipped parent copy. This doc may mention banned words only as fail examples.

**Do**

- Use full stops, commas, and “and”.
- Prefer plain verbs: help, practise, build, enjoy, keep.
- Describe the thing itself instead of praising Ember’s curation.

**Avoid** (must match `stage3-banned-copy.mjs`)

- The em dash character in shipped copy
- calm / calming as product praise
- worth buying / worth it / worth considering
- Fresh 20XX and dated “new this year” sales talk
- “that lands” / “really lands” / “hits home”
- fake intimacy (“real wobbles”, “real jobs” as hype) and broader “A real X” / “real nearly-three shift” filler
- carefully curated / thoughtfully designed / carefully chosen
- game-changer, unlock, essential, must-have, magic
- US slang (went sideways, peel off, crush it)
- Internal product words in parent copy (Stage 1/2/3, cluster, lane, specialist exemption, review thresholds)
- **AI metaphor / process speak:** loop, journey, hook, script, “story shape”, “shape of the day”, on-ramp
- **Fake child judgements:** “feel fair”, “feels busy”, “when X feels easy/familiar/covered”
- **Nursery benchmarking** (“already familiar from nursery”, “nursery wall”, “nursery bag”)
- **Importance filler:** matter / matters (“Warm-up sessions matter”, “Cord ends matter”)
- **Vague time filler:** moment / moments in Pip’s Picks (“jealous moments”, “now-and-next moments”) — name the real situation (wobbles, evenings, hand-offs)
- **Fabricated metaphors:** muscle (“choosing muscle”, “talk-stories muscle”); peculiar phrases (“storage honesty”, “travel honesty”)
- **Therapy/process filler:** reset / resets (“offers a reset”, “a kind reset”, “reset the evening”) — say what actually happens (start again, soft way back, shared joke)
- **Odd hyphen compounds:** inventing play-type jargon with hyphens (“rescue-vehicle”, “try-again play”, “get-on-go-return”, “step-pause-turn”, “letters-and-lacing”) — write ordinary spaced English (“good for rescue vehicle play”, “made for get on, go and return”). Allowed hyphens are ordinary English / Ember / product English only (twelve-piece, living-room, wipe-clean, nearly-three, back-and-forth, non-slip, non-toxic, high-contrast, tummy-time, rear-facing, …) — see `stage3-banned-copy.mjs` allowlist.
- **Personification of objects:** “Wood earns its place”, “cords love to tangle”
- **Adult discipline vocabulary:** lecture, sermon, lesson plan — never for UK parent/toddler dynamics
- Money-shame and sales tells already listed above (tight budgets, low-stakes, quick wins, worth buying, …)
- **Formulaic Why Pip closers:** “That is why X suits Y”, “That gentle recovery is why it suits…”, “which is why this suits…”, **“That is the practical shift parents notice in daily play”** — never end cards on the same template. **Never reuse the same closing sentence across a Top N.** Vary openings and endings. Do not lean on “suit/suits” as the rationalisation verb.
- **Stamp endings (also banned as exact strings):** “Shared play on the living-room floor keeps it kind for tired parents.” / “That is enough for one short shared sit before the evening runs on.” / “Keep it nearby so they can choose it themselves.” / “Share it together for a few minutes, then let them lead.” / “Share it at a quiet time on the sofa.”

| Pass | Fail |
|---|---|
| A short bedtime story about friendship and sharing. | A story that really lands after a tricky day. |
| Chunky wooden shapes on a soft lace for little hands. | Filacolor is the calm, carefully curated pick. |
| Handmade in the UK, easy to wipe clean. | Specialist exemption with thin on-page reviews. |
| Short rescue puzzles before a fuller twelve-piece set. | Before twelve-piece trays feel fair. That hook is why… |
| Load, drive and tip out passengers again. | Get-on go-return journey / bus loop / travel script |
| Keep the routine visible in the kitchen. | Already familiar from nursery / not only on a nursery wall |
| Good for rescue vehicle play at this age. | That is why this suits rescue-vehicle play |
| Gentler starts before a twelve-piece tray. | Warm-up sessions matter / warm-up sessions |
| Packs into one stack with a carry bag. | Storage honesty / travel honesty / pack-away design |
| Choosing practice on the sofa. | Choosing muscle / talk-stories muscle / open-choice reading |
| Without turning bedtime into a talking-to. | Without turning bedtime into a lecture |
| Distance judgement grows fast around this age. | A real nearly-three shift |
| Step, pause and turn paths you invent together. | That is why they suit step-pause-turn paths so well |
| Keep jealous wobbles light at bedtime. | That gentle recovery is why it suits jealous wobbles |

---

### Principle 6 — Match the form; keep every line earning its place

Ember copy appears in many shapes: short UI labels, Discover cards, Pip’s Picks fields, blogs, emails, push notifications, empty states, and future formats we have not built yet. The voice stays the same. The structure flexes with the form.

**Do**

- Ask what this surface needs (scan, decide, feel supported, learn more).
- Give each sentence one clear job.
- Vary your nouns and openers in the same card or paragraph so it does not echo itself.
- For longer pieces (blogs, guides), use a clear spine: what it is, why it helps now, how a parent might use it, any kind practical note.

**How this shows up by form**

- **UI / buttons / labels:** shortest true phrase.
- **Discover cards:** concrete idea + positive stage shift.
- **Pip’s Picks:** see **Pip’s Picks card fields** below (single Description + Why Pip).
- **Blogs / editorial:** fuller scenes, still school-gate English, still positive vision first.
- **Notifications:** one helpful nudge, never panic.

| Pass | Fail |
|---|---|
| A bright picture book to help your child get better at sharing. | A bright picture book. A short picture book about sharing. |
| Rearrangeable pictures so your child can see what comes next. | Rearrangeable pictures that are carefully designed to unlock independence in a stage-based way. |

**Watch-out:** Repetition in the same setting feels careless. Say it once, well.

---

### Pip’s Picks card fields (match the live card)

The compact Pip’s Picks card shows, in order: Best for · Title · Brand · **Description** · **Why Pip picked this** (drawer) · Browse offers.

There is **one** Description on the card. Do **not** write a separate “What this is” line for research or HTML. Schema field name is still `product_description_under_30_words` (legacy); the writing rule is **20–40 words**.

| Field | Job | Depth |
|---|---|---|
| **Description** (`product_description_under_30_words`) | Explain **exactly what the product is** in plain parent English — object, format, and how you use it. A parent must understand the thing without opening Why Pip or tapping Browse offers. | **20–40 words** (hard rule) |
| **Why Pip picked this** (`ember_verdict`) | The **rationalisation box** — the glue members pay for: need at this age → why this product → why it suits the Best for label (without saying “tag”). | **40–60 words** (hard rule) |

**Hard rules (Pip’s Picks)**

1. **Best for must come to life** — explain the idea in Description and/or Why Pip (e.g. open choices, portable routines). Never meta-talk about “the tag”, “earns that tag”, or “what the tag promises” — that breaks the fourth wall.
2. **No lazy echo** — Description and Why Pip must do different jobs. If Why Pip mostly restates the Description, rewrite Why Pip.
3. **Ambiguous product names** — if the title is a brand SKU (e.g. Step-A-Stumps), the Description must decode it into ordinary words (nestable plastic platforms you step on, with a carry bag).
4. **One distinct product per Top 5 slot** — no duplicate titles; avoid two near-identical lines from the same range that only differ by a truncated SKU name.
5. **Respect on money labels** — never “tight budgets”. Prefer “smaller budgets”, “trying path play first”, or similar kinder UK parent language.
6. **Brand concentration** — at most **two** Top Picks from the same brand. Prefer products parents can find on major UK retail / Google Shopping when quality is equal (Browse offers must not strand them in a sea of lookalikes).
7. **Why Pip depth** — **40–60 words**. Shorter rarely knits need + product + Best for idea together.

**Description Do**

- Name the object and what happens with it (or in the story).
- Decode catalogue jargon into school-gate English.
- Keep it concrete and recognisable.
- Land between 20 and 40 words inclusive.

**Description Don’t**

- One short teaser under 20 words.
- A second “What this is” field.
- Repeating the Why Pip line almost word for word.
- Leaving the parent unsure what is in the box.
- Em dashes, banned AI tells, crisis framing.

**Why Pip Do**

- Knit together: need at this age → this product → why the Best for idea is fair (in parent language, not “tag” talk).
- Add fit, a concrete play situation, or a kind practical note the Description did not already say.
- **Optional Top 5 progression:** where picks naturally form a ladder (e.g. bus → holiday trip → care roles), Why Pip may lightly join the dots so the shortlist reads as a set. Never invent a progression; never force link language when picks serve distinct parent situations.
- **Vary the cadence** — change how sentences open and close across a Top 5. End on a scene, a practical note, or what the parent notices — not the same rationalisation template every time.
- Land between **40 and 60 words** inclusive.

**Why Pip Don’t**

- Paraphrase the Description.
- Lead with shopping orders.
- Mention tags (“earns that tag”, “the tag promises”).
- Use AI tells (loop, journey, hook, script, feel fair, feels like, nursery benchmarking, low-stakes, quick wins, worth buying, calm as praise, etc.).
- **Formulaic closers:** “That is why…”, “That [noun] is why…”, “which is why…”, “That is the practical shift…”, or ending every card with the same stock sentence (“Shared play on the living-room floor…”, “Keep it nearby so they can choose it themselves.”, …).
- Lean on “suit/suits” as the rationalisation verb.
- Stay under 40 words when the insight needs room.

**Pass example (20 words):**  
A sensitive picture book about a little girl whose worry grows bigger and bigger until she learns to share it.

**Pass example (threading, ~28 words):**  
A set of large colourful wooden beads and shapes to thread onto a soft fabric lace, sized for little hands that are ready for a proper threading job.

---

### Principle 7 — Keep research maths off the page

Age borders, review counts, and stockist depth decide what Ember recommends. Parents using the product need the human reason, not the audit trail.

**Do**

- Talk about skills and play in parent language.
- Keep safety practical when needed.
- Leave selection edge-cases in research notes and trust gates.

| Pass | Fail |
|---|---|
| A matching game that builds on simple threading. | Marked 3–7, so stay close if they’re only just 34 months. |
| Handmade in the UK, with wipe-clean tokens for everyday use. | Only one five-star review on this SKU. |

---

### Principle 8 — Respect the home they already have

Assume books, beads, cups, and hand-me-downs already exist. Treat that as normal and good.

**Do**

- Use “already enjoy”, “beside the books you love”, “next step”.
- Celebrate reuse without guilt.
- Never imply they have been getting it wrong.

| Pass | Fail |
|---|---|
| A nice next step if they already enjoy posting toys. | Stop buying the wrong toys. |
| Lovely beside the books and beads you already love. | You probably don’t have anything like this yet. |

---

### Principle 9 — Keep safety plain and kind

When safety matters, say it the way a careful friend would: clear, calm, practical.

**Do**

- Name the helpful action (sit with them, pack away, wipe clean).
- Keep it short.
- Pair it with the play, not with fear.

| Pass | Fail |
|---|---|
| Sit with them while they thread, and pack the laces away after play. | WARNING: cord strangulation risk in this age band. |

---

### Principle 10 — Stay on the side of play and partnership

Parents guide, play, and practise with babies and toddlers. Ember’s voice stays adult-to-adult respectful, and child-facing ideas stay playful. Avoid talking-down energy and adult discipline vocabulary that does not belong with this age.

**Do**

- Prefer play, practise, see what comes next, feel proud.
- Keep partnership language with the parent (“help you build… together”).

| Pass | Fail |
|---|---|
| so your child can see what comes next and feel proud of each step | without turning bedtime into a lecture |
| A supportive way to build morning and bedtime routines together | A non-preachy toolkit for independence |

---

### Ship checklist

1. Positive vision first?
2. British school-gate English?
3. Concrete and recognisable?
4. Fit explained without shopping orders?
5. Sounds human (no generated tells)?
6. Right shape for this content form, with no lazy repetition?
6b. Pip’s Picks Description between **20 and 40 words** (one field only)?
6c. Description alone makes the product clear (no CTA needed to understand it)?
6d. Why Pip between **40 and 60 words**, earns the Best for *idea* without saying “tag”, and does not echo Description?
6e. No money-shame labels (“tight budgets”) or AI tells (loop, journey, hook, feel fair, nursery, lecture, matter/moment/muscle, odd hyphen compounds, “A real X”, personification, …)?
6g. If a natural Top 5 progression exists, Why Pip may join dots — but never force one?
6f. At most two Top Picks from the same brand; findable on major UK retail / Shopping when quality is equal?
7. No research maths on the page?
8. Respects the existing home?
9. Safety plain and kind if needed?
10. Play and partnership, not talking down?
11. Read aloud: would you send this to a parent friend?

---

## Part B — Principles in practice (5 full Pip’s Picks cards)

These cards match the live compact card: Best for · Title · Brand · **Description (20–40 words)** · **Why Pip picked this**. No separate “What this is” field.

---

### Card 1 — Djeco Filacolor

**Title:** Filacolor Lacing Beads  

**Brand:** Djeco  

**Best for:** Best for chunky first beads  

**Description:** A set of large colourful wooden beads and shapes to thread onto a soft fabric lace, sized for little hands that are ready for a proper threading job at the table.  

**Why Pip picked this:** Chunky wooden shapes on a soft lace, sized for little hands that enjoy a proper threading job. A lovely way to keep threading interesting as their concentration grows. Keep them company while they lace, as the cords love to tangle.

**Why this works:**  
The Description tells you what is in the box in enough depth to picture it. Why Pip adds the skill journey and the playful cord tip. The two fields do different jobs and do not echo each other.

---

### Card 2 — Can You Share, Little Whale?

**Title:** Can You Share, Little Whale?  

**Brand:** Jonny Lambert  

**Best for:** Best for sharing rows  

**Description:** A short sunny picture book where Little Whale learns to share snacks, toys and attention with a friend, told in warm words that suit bedtime and playdates.  

**Why Pip picked this:** Little Whale learns to share snacks, toys and attention with a friend. A sunny bedtime read to help your child get better at sharing.

**Why this works:**  
Description carries the plot and format. Why Pip names the positive skill without repeating the whole blurb.

---

### Card 3 — Pip and Posy: The New Friend

**Title:** Pip and Posy: The New Friend  

**Brand:** Camilla Reid & Axel Scheffler  

**Best for:** Best for jealous wobbles  

**Description:** A warm Pip and Posy picture book where Posy finds Pip playing with someone new, then finds her feet again in a story about friendship and joining in.  

**Why Pip picked this:** Helps your child learn about situations where their best friend scuttles away to play with someone else. Posy finds her feet again, and the story stays warm and light the whole way through.

**Why this works:**  
Description sets the scene. Why Pip brings the school-gate sting and the warm tone of the ending.

---

### Card 4 — Learning Resources Beads and Pattern Cards

**Title:** Beads and Pattern Card Set  

**Brand:** Learning Resources  

**Best for:** Best for copying patterns  

**Description:** Chunky beads plus picture cards that invite children to copy a pattern on the lace, turning simple threading into a matching game as their focus grows.  

**Why Pip picked this:** Picture cards turn threading into a matching game, to keep practice interesting as their concentration grows. A nice next step when they already like posting beads on a lace.

**Why this works:**  
Description explains the kit. Why Pip explains the fit and respects toys already in the home.

---

### Card 5 — Create Visual Aids Home Visual Timetable

**Title:** Home Visual Timetable  

**Brand:** Create Visual Aids  

**Best for:** Best for whole-day routines  

**Description:** A set of rearrangeable routine pictures for the day at home, so your child can see morning and bedtime steps in order and move the pieces as each job is done.  

**Why Pip picked this:** Rearrangeable pictures for the day, so your child can see what comes next and feel proud of each step. A supportive way to help you build steady morning and bedtime routines together.

**Why this works:**  
Description is the product in use. Why Pip is partnership and pride — not a second product summary.

---

## How this fits the brand system

| Doc | Job |
|---|---|
| [PERSONAS](./PERSONAS.md) | Who we write for (Conor, Thea) |
| [BRAND_BOOK](./BRAND_BOOK.md) | How Ember looks |
| [PRODUCT_MARKETING](./PRODUCT_MARKETING.md) | What we call things, and commercial bans |
| Writing Guidelines (this file) | How every parent-facing sentence must sound |

## Stage 3 pipeline (approved at source)

| Step | Role for this bible |
|---|---|
| `$ember-stage3-research` | **Writes** parent fields to this bar into `inbox/` |
| `$ember-stage3-ff-checker` | **Second pass** — fails banned tells + evidence gates; does not invent voice |
| `$ember-stage3-founder-review` | Shows proposed public content as researched |
| `$ember-stage3-card-ingestion` | **Copy-faithful** map to DB/UI — no voice rewrite |

See `web/docs/STAGE3_RESEARCH_METHODOLOGY.md` must-be-true #5.

---

## Changelog

| Date | Change |
|---|---|
| 2026-07-23 | v1 canonical — founder signed off after virtual copywriting school + Pip’s Picks feedback |
| 2026-07-23 | Wired into Stage 3 research → FF → ingest (copy at source; ingest copy-faithful) |
| 2026-07-23 | Pip’s Picks: single Description **20–40 words**; removed dual Description / What this is |
| 2026-07-23 | Pip’s Picks: Best for must land; Description vs Why Pip jobs; decode SKUs; ban tight budgets / low-stakes / quick wins |
| 2026-07-23 | Why Pip **40–60 words**; never say “tag”; max two same brand; prefer Shopping-findable stockists |
| 2026-07-23 | Ban AI process speak (loop / journey / hook / script / feel fair / nursery benchmarking) in Pip parent copy |
| 2026-07-23 | Ban matter/moment/muscle, lecture, odd hyphen compounds, “A real X”, personification, peculiar “honesty” phrases; optional relational Why Pip |
| 2026-07-23 | **Ban-list parity:** Principle 5 + FF share `agent-tools/scripts/lib/stage3-banned-copy.mjs` — never diverge |
| 2026-07-23 | Invented hyphen compounds banned in Pip parent copy (allowlist ordinary English / Ember only) |
| 2026-07-24 | Ban stamp Why Pip closers (“practical shift parents notice…”, repeated living-room / sofa endings); FF fails identical closers within a Top N |
| 2026-07-23 | Ban formulaic Why Pip closers (“That is why X suits Y”); vary cadence; no “suit/suits” rationalisation verb |
