# feat(header): bigger sticky header logo

## What changed
Increased sticky header logo size on /discover (mobile + desktop). No copy, modal, or carousel changes.

- **Logo**: ~2× size — `h-10` mobile (~40px), `h-12` sm/md desktop (~48px), `w-auto`.
- **Layout**: Single left-aligned cluster unchanged; `whitespace-nowrap` on “What is Ember?” and “Join free” to avoid wrap; responsive gap `gap-3 sm:gap-6` on small screens.

## QA (browser-only, Vercel preview)

1. Open Vercel preview `/discover/26`.
2. Confirm logo size is materially larger (Duolingo-level prominence at 1440px).
3. At mobile width ~390px, confirm header does not wrap.
4. Confirm sticky header still works (scroll page, header stays fixed).

## Rollback
Revert PR (no schema changes).

## Preview URL
_(Set after Vercel deploy; link from PR checks or Vercel dashboard.)_
