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

/** Explicit old offenders (kept for clear fail reasons). */
export const AI_HYPHEN_COMPOUND =
  /\b(?:try-again|try-first|rescue-vehicle|rebuild-vehicle|emergency-vehicle|get-on-go-return|step-pause-turn|help-and-rescue|help-on-wheels|letters-and-lacing|copying-patterns|open-choice|saying-no|guessing-what-next|predicting-plans|is-it-a-shark|stuck-cross|mine-fight|joining-in|talk-back|letter-finish|big-bead|pack-away|take-anywhere|getting-out-the-door|now-and-next|confidence-building|load-the-patient|forward-looking|adult-style|extra-kind|whole-day|ten-step|finish-line)\b/i;

/**
 * Ordinary English / Ember hyphens allowed in Pip parent copy.
 * Anything else hyphenated fails as invented AI compound.
 * Founder 2026-07-23: “rescue-vehicle” / “try-again play” → write spaced English.
 */
export const ALLOWED_HYPHEN_RE = [
  /^nearly-threes?$/i,
  /^(?:\d+|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)-piece$/i,
  /^living-room$/i,
  /^wipe-clean$/i,
  /^back-and-forth$/i,
  /^talking-to$/i,
  /^best-friend$/i,
  /^safety-release$/i,
  /^farm-animal$/i,
  /^early-years$/i,
  /^small-world$/i,
  /^step-up$/i,
  /^step-down$/i,
  /^hand-offs?$/i,
  /^call-and-response$/i,
  /^coming-home$/i,
  /^rope-linked$/i,
  /^mini-jigsaws?$/i,
  /^grown-up$/i,
];

const HYPHEN_TOKEN = /\b[a-z0-9]+(?:-[a-z0-9]+)+\b/gi;

/** Return invented hyphen tokens not on the ordinary-English allowlist. */
export function inventedHyphenHits(text) {
  const raw = String(text || '');
  const hits = [];
  for (const token of raw.match(HYPHEN_TOKEN) || []) {
    if (ALLOWED_HYPHEN_RE.some((re) => re.test(token))) continue;
    hits.push(token.toLowerCase());
  }
  return [...new Set(hits)];
}

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
 * Formulaic AI closer: “That is why X suits Y” / “That gentle recovery is why it suits…”
 * Founder 2026-07-23: robotic, repetitive card cadence across Top 5.
 */
export const FORMULAIC_WHY_CLOSER = [
  /\bthat is why\b/i,
  /\bwhich is why\b/i,
  /\bthat\s+\w+(?:\s+\w+){0,8}\s+is why\b/i,
  /\bis why (?:this|it|they|these|the)\b/i,
  /\bare why (?:this|it|they|these|the)\b/i,
];

/** Rationalisation verb overused in Why Pip templates — ban on ember_verdict only. */
export const SUIT_AS_RATIONALE = /\bsuits?\b/i;

/**
 * Return unique fail tokens for banned parent copy.
 * Empty array = clean.
 *
 * @param {string} text
 * @param {{ publicCopy?: boolean, field?: string }} [opts]
 *   publicCopy (default true): also enforce invented-hyphen allowlist + formulaic closers.
 *   field: when `ember_verdict`, also ban suit/suits as the rationalisation verb.
 *   Set publicCopy false for internal HOW fields (rank_rationale).
 */
export function bannedHits(text, { publicCopy = true, field = null } = {}) {
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
  if (PERSONIFY_OR_PECULIAR.test(raw)) hits.push('personify_or_peculiar');

  // Invented hyphen compounds + formulaic closers: public Pip fields only.
  if (publicCopy) {
    if (AI_HYPHEN_COMPOUND.test(raw)) hits.push('ai_hyphen_compound');
    const invented = inventedHyphenHits(raw);
    if (invented.length) hits.push(`invented_hyphen:${invented.join('|')}`);
    for (const re of FORMULAIC_WHY_CLOSER) {
      if (re.test(raw)) {
        hits.push('formulaic_why_closer');
        break;
      }
    }
    if ((field === 'ember_verdict' || field === 'why') && SUIT_AS_RATIONALE.test(raw)) {
      hits.push('suit_as_rationale');
    }
  }

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
      'invented_hyphen',
      'personify_or_peculiar',
      'formulaic_why_closer',
    ],
    allowed_hyphens_note:
      'Only ordinary English / Ember hyphens (nearly-three, twelve-piece, wipe-clean, …). Invented play-type compounds fail.',
    formulaic_closer_note:
      'Never end Why Pip with “That is why X suits Y” / “That [noun] is why it suits…”. Vary endings; land Best for without a template.',
    canonical_module: 'agent-tools/scripts/lib/stage3-banned-copy.mjs',
    human_doc: 'web/docs/brand/WRITING_GUIDELINES.md (Principle 5)',
  };
}
