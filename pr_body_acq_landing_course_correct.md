# feat(acq): hero v2 + doorways mapping + icons + have-it-already

## What changed

- **Hero (brand director v2)**  
  - H1: "Your next-step toy guide — from bump to big steps."  
  - Subheader: "See what your little one is learning next — and what to buy for it."  
  - Reassurance: "Use what you've got. Add what you need. You're in charge."  
  - No extra trust line near hero. "We only use age to tailor ideas." remains by the age control.

- **Doorways (12 → 6 + See all)**  
  - Section title: "What they're practising right now"  
  - Guide copy: "At this age, these are especially common. Pick one to start."  
  - 6 tiles by default; "See all" reveals the other 6.  
  - 1:1 mapping to existing development needs (no new needs).  
  - Suggested pills for 25–27m on: Do it myself, Big feelings, Little hands.  
  - Default selected doorway for 25–27m: Do it myself.  
  - Stronger selected-state glow; label/helper line-clamp-2; no text overflow.

- **Product cards**  
  - Every product renders with a Lucide icon (never excluded for missing images).  
  - `getProductIcon(product, categoryType?, developmentNeed?)` with Sparkles fallback; icon colour #B8432B.  
  - Buttons: **Save to my list** | **Have it already** | **View**.

- **Have it already**  
  - POST `/api/click` with `source: discover_owned` (best-effort; 401 when signed out still shows confirmation).  
  - Inline toast: "Marked as have it already."  
  - Follow-up: persistence (saved/owned) documented in PROGRESS.md; no DB/RLS changes in this PR.

- **Copy**  
  - "ideas" and "my list" language; no "picks" or "shortlist" in UI.  
  - No forbidden words on /discover: AI, magic, algorithm, unlock, smart.

- **/new**  
  - Redirect to /discover (and /discover/[months]) with query params preserved (unchanged).

---

## How to verify

1. **Hero**  
   - Open `/discover` (or `/discover/26`).  
   - Confirm exactly 3 lines: H1, subheader, reassurance. No extra trust line. Helper "We only use age to tailor ideas." only by the age slider.

2. **Doorways**  
   - Same page: section "What they're practising right now" and guide copy above tiles.  
   - See 6 tiles + "See all". Click "See all" → other 6 tiles appear.  
   - For age 25–27 months: Suggested pills on Do it myself, Big feelings, Little hands; default selected = Do it myself.  
   - No label/helper cut-off; selected tile has stronger glow.

3. **Product cards**  
   - Select a doorway and click "Show my 3 ideas".  
   - Each card shows: Lucide icon (even if no image), "Save to my list", "Have it already", "View".  
   - Click "Have it already" → confirmation message appears; no error.

4. **Copy**  
   - Search /discover UI and copy: no "picks", "shortlist", "AI", "magic", "algorithm", "unlock", "smart".

5. **/new redirect**  
   - Visit `/new` → 308 to `/discover`.  
   - Visit `/new/26?wrapper=burn-energy` → 308 to `/discover/26?wrapper=burn-energy`.

6. **Build**  
   - From repo root or `/web`: `pnpm install` then `pnpm run build` (passes).

---

## Proof and automation

- **No headless screenshot automation.** No msedge --headless, puppeteer, or playwright. No GitHub API polling, no Start-Sleep loops, no temp Edge profiles or process cleanup scripts.  
- **Proof:** build/test output + founder manual screenshots in the browser.

---

## Manual screenshot checklist (founder)

1. Desktop `/discover` top fold (hero + age + first doorways).  
2. Desktop `/discover` after selecting a doorway (ideas + icons + Save to my list + Have it already + View).  
3. Mobile `/discover` top fold.

---

## Definition of done

- [x] Hero copy matches the 3 lines.  
- [x] Doorways: 6 + See all; 1:1 mapping; Suggested pills for 25–27m on the 3 specified.  
- [x] No tile text overflow.  
- [x] Products never excluded for missing images; Lucide icon always shown.  
- [x] Each card: "Save to my list", "Have it already", "View".  
- [x] Forbidden words absent.  
- [x] /new redirects to /discover with params preserved.  
- [x] `pnpm run build` passes.
