/**
 * Stage 3 / Pip’s Picks banned-copy — SINGLE SOURCE OF TRUTH
 *
 * Parity rule (non-negotiable):
 * - Research writes against Writing Guidelines Principle 5
 * - FF validates with THIS module
 * - Both must describe the same bans. Never add a ban in prose without
 *   adding it here, and never add a ban here without updating
 *   `web/docs/brand/WRITING_GUIDELINES.md` Principle 5 in the same change.
 *
 * Scope: parent-facing Pip’s Picks fields (Description, Why Pip, Best for,
 * and other shipped parent copy). Meta instructions may cite banned words
 * only as fail examples.
 *
 * Used by: `stage3-ff-check.mjs`, research ship checklist, future ingest guards.
 */

/** Substring bans (case-insensitive). */
export const BANNED_PHRASES = [
  'magic',
  'unlock',
  'optimise',
  'essential',
  'must-have',
  'research-backed',
  'developmental domain',
  'worth buying',
  'worth it',
  'worth considering',
  'carefully curated',
  'thoughtfully designed',
  'carefully chosen',
  'that lands',
  'really lands',
  'hits home',
  'game-changer',
  'went sideways',
  'peel off',
  'stage 1',
  'stage 2',
  'stage 3',
  'stage-based',
  'low-stakes',
  'low stakes',
  'quick wins',
  'quick win',
  'tight budget',
  'tight budgets',
  'feeling like a win',
  'travel script',
  'story shape',
  'shape of the',
  'on-ramp',
  'feel fair',
  'feels fair',
  'feels busy',
  'feel busy',
  'feel like',
  'feels like',
  'from nursery',
  'nursery wall',
  'nursery bag',
  'nursery shelves',
  'storage honesty',
  'travel honesty',
  'warm-up session',
  'warm-up sessions',
  'try-again play',
  'try-first approach',
  'rescue-vehicle',
  'rebuild-vehicle',
  'lesson plan',
  'choosing muscle',
  'talk-stories muscle',
];

/**
 * Whole-word bans (case-insensitive).
 * Keep labels stable — they appear in FF fail reasons.
 */
export const BANNED_WORDS = [
  { label: 'calm', re: /\bcalm\b/i },
  { label: 'calming', re: /\bcalming\b/i },
  { label: 'cheerful', re: /\bcheerful\b/i },
  { label: 'delightful', re: /\bdelightful\b/i },
  { label: 'loop', re: /\bloop\b/i },
  { label: 'loops', re: /\bloops\b/i },
  { label: 'journey', re: /\bjourney\b/i },
  { label: 'journeys', re: /\bjourneys\b/i },
  { label: 'hook', re: /\bhook\b/i },
  { label: 'hooks', re: /\bhooks\b/i },
  { label: 'script', re: /\bscript\b/i },
  { label: 'scripts', re: /\bscripts\b/i },
  { label: 'lecture', re: /\blecture\b/i },
  { label: 'lectures', re: /\blectures\b/i },
  { label: 'sermon', re: /\bsermon\b/i },
  { label: 'moment', re: /\bmoment\b/i },
  { label: 'moments', re: /\bmoments\b/i },
  { label: 'muscle', re: /\bmuscle\b/i },
  { label: 'muscles', re: /\bmuscles\b/i },
  { label: 'matter', re: /\bmatter\b/i },
  { label: 'matters', re: /\bmatters\b/i },
];

/** Fake child/product “feel” judgements. */
export const FAKE_FEEL =
  /\b(feel|feels|feeling)\s+(fair|busy|familiar|covered|easy|hard|ready|tight|a stretch)\b/i;

/** Fresh 20xx sales talk */
export const FRESH_YEAR = /\bfresh 20\d{2}\b/i;

/** Invented hyphen compounds that smell of AI (not ordinary English like “warm-up” alone). */
export const AI_HYPHEN_COMPOUND =
  /\b(?:try-again|try-first|rescue-vehicle|rebuild-vehicle)\b/i;

/** Personification of objects / fabricated “honesty” metaphors. */
export const PERSONIFY_OR_PECULIAR =
  /\b(?:earns? (?:its|their|a) place|cords? love|wood earns|\w+ honesty)\b/i;

/**
 * “A real X” / “real nearly-three shift” filler.
 * Broader than the old playgroup|wobbles|jobs|moments-only list.
 */
export const REAL_X_FILLER =
  /\ba real [\w-]+|\breal (nearly[\w-]*|play|jobs?|moments?|wobbles?|shift|skill)\b/i;

export const NURSERY = /\bnursery\b/i;

/**
 * Return unique fail tokens for banned parent copy.
 * Empty array = clean.
 */
export function bannedHits(text) {
  const raw = String(text || '');
  const lower = raw.toLowerCase();
  const hits = [];

  for (const phrase of BANNED_PHRASES) {
    if (lower.includes(phrase)) hits.push(phrase);
  }
  if (raw.includes('—') || raw.includes('–')) hits.push('em_dash');
  for (const { label, re } of BANNED_WORDS) {
    if (re.test(raw)) hits.push(label);
  }
  if (FRESH_YEAR.test(raw)) hits.push('fresh_year');
  if (REAL_X_FILLER.test(raw)) hits.push('real_x_filler');
  if (FAKE_FEEL.test(raw)) hits.push('fake_feel_judgement');
  if (NURSERY.test(raw)) hits.push('nursery_benchmarking');
  if (AI_HYPHEN_COMPOUND.test(raw)) hits.push('ai_hyphen_compound');
  if (PERSONIFY_OR_PECULIAR.test(raw)) hits.push('personify_or_peculiar');

  return [...new Set(hits)];
}

/** Human-readable inventory for docs / founder review. */
export function bannedCopyInventory() {
  return {
    phrases: [...BANNED_PHRASES],
    words: BANNED_WORDS.map((w) => w.label),
    patterns: [
      'em_dash',
      'fresh_year',
      'real_x_filler',
      'fake_feel_judgement',
      'nursery_benchmarking',
      'ai_hyphen_compound',
      'personify_or_peculiar',
    ],
    canonical_module: 'agent-tools/scripts/lib/stage3-banned-copy.mjs',
    human_doc: 'web/docs/brand/WRITING_GUIDELINES.md (Principle 5)',
  };
}
