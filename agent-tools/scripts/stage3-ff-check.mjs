#!/usr/bin/env node
/**
 * Fastidious Founder Stage 3 checker (deterministic gates).
 * See web/docs/STAGE3_TRUST_GATES.md
 *
 * Usage:
 *   node agent-tools/scripts/stage3-ff-check.mjs --age-band=34-36m
 *   node agent-tools/scripts/stage3-ff-check.mjs --age-band=34-36m --no-move
 *   node agent-tools/scripts/stage3-ff-check.mjs path/to/ember_picks_….json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { smokeDocument } from './stage3-url-smoke.mjs';
import {
  availabilityGateFromPick,
  checkDocumentAvailability,
} from './stage3-availability-check.mjs';
import { bannedHits } from './lib/stage3-banned-copy.mjs';
import { ukMarketFailReasons } from './lib/stage3-uk-market.mjs';

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const MIN_RATING = 4.4;
const MIN_REVIEW_COUNT = 15;
const REQUIRED_SCHEMA = 'ember_picks_research_v3';

/**
 * Banned parent copy — imported from lib/stage3-banned-copy.mjs (single source of truth).
 * Parity with Writing Guidelines Principle 5 is mandatory; do not redefine bans here.
 */

const STOP_WORDS = new Set([
  'best',
  'for',
  'the',
  'a',
  'an',
  'and',
  'or',
  'of',
  'to',
  'in',
  'on',
  'with',
  'your',
  'child',
  'this',
  'that',
  'from',
  'into',
  'as',
  'at',
  'by',
  'is',
  'are',
  'be',
  'when',
  'they',
  'them',
  'their',
  'you',
]);

function contentTokens(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter((w) => w.length >= 4 && !STOP_WORDS.has(w));
}

function tokenOverlapRatio(a, b) {
  const A = new Set(contentTokens(a));
  const B = contentTokens(b);
  if (!A.size || !B.length) return 0;
  let hit = 0;
  for (const w of B) if (A.has(w)) hit += 1;
  return hit / B.length;
}

/** Best-for tag must surface in Description and/or Why Pip. */
function bestForLivesGate(pick) {
  const reasons = [];
  const tag = String(pick.best_for_tag || '');
  const after = tag.replace(/^best for\s+/i, '').trim();
  const tagTokens = contentTokens(after);
  if (!tagTokens.length) return reasons;
  const blob = `${pick.product_description_under_30_words || ''} ${pick.ember_verdict || ''}`;
  const blobTokens = new Set(contentTokens(blob));
  const hits = tagTokens.filter((t) => blobTokens.has(t));
  // Also allow multi-word phrase match (e.g. "now and next")
  const phraseOk = after.length >= 4 && blob.toLowerCase().includes(after.toLowerCase());
  if (!phraseOk && hits.length < Math.min(1, tagTokens.length)) {
    reasons.push('best_for_not_reflected_in_description_or_why_pip');
  }
  return reasons;
}

/** Description and Why Pip must not be near-paraphrases. */
function descriptionVerdictDistinctGate(pick) {
  const reasons = [];
  const desc = pick.product_description_under_30_words;
  const why = pick.ember_verdict;
  if (!nonEmpty(desc) || !nonEmpty(why)) return reasons;
  const overlap = Math.max(tokenOverlapRatio(desc, why), tokenOverlapRatio(why, desc));
  if (overlap >= 0.55) reasons.push(`description_why_pip_overlap_${overlap.toFixed(2)}`);
  return reasons;
}

/** Top 5 product names must be unique (case-insensitive). */
function uniqueTopPickNamesGate(topPicks) {
  const reasons = [];
  const seen = new Map();
  for (const pick of topPicks) {
    const key = String(pick.product_name || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    if (!key) continue;
    if (seen.has(key)) reasons.push(`duplicate_top_pick_name:${key}`);
    else seen.set(key, pick.rank);
  }
  return reasons;
}

/**
 * Near-duplicate catalogue lines that collapse into the same visible title
 * (e.g. two "Edx … Step-A-…" SKUs). Allow at most one Step-A / Step A line in Top 5.
 */
function nearDuplicateProductLineGate(topPicks) {
  const reasons = [];
  const stepA = [];
  for (const pick of topPicks) {
    const name = String(pick.product_name || '');
    if (/\bstep[\s-]?a[\s-]/i.test(name)) {
      stepA.push({ rank: pick.rank, name });
    }
  }
  if (stepA.length > 1) {
    reasons.push(
      `near_duplicate_product_line:step-a(${stepA.map((x) => `#${x.rank}`).join(',')})`,
    );
  }
  return reasons;
}

function nonEmpty(v) {
  return String(v ?? '').trim().length > 0;
}

function wordCount(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Writing Guidelines: single Description is 20–40 words (field name is legacy). */
function descriptionWordGate(pick) {
  const reasons = [];
  const desc = pick.product_description_under_30_words;
  if (!nonEmpty(desc)) {
    reasons.push('description_missing');
    return reasons;
  }
  const n = wordCount(desc);
  if (n < 20 || n > 40) reasons.push(`description_word_count_${n}_not_20_to_40`);
  return reasons;
}

/** Writing Guidelines: Why Pip is 40–60 words (research-owned; FF re-validates). */
function whyPipWordGate(pick) {
  const reasons = [];
  const why = pick.ember_verdict;
  if (!nonEmpty(why)) {
    reasons.push('ember_verdict_missing');
    return reasons;
  }
  const n = wordCount(why);
  if (n < 40 || n > 60) reasons.push(`why_pip_word_count_${n}_not_40_to_60`);
  return reasons;
}

/** Fourth-wall ban: never talk about “the tag” in parent copy. */
function tagMetaTalkGate(pick) {
  const reasons = [];
  const blob = `${pick.product_description_under_30_words || ''} ${pick.ember_verdict || ''}`;
  if (/\b(the tag|that tag|this tag|tag promises|earns that tag|earns the .+ tag)\b/i.test(blob)) {
    reasons.push('tag_meta_talk_in_parent_copy');
  }
  return reasons;
}

/** At most two Top Picks from the same brand. */
function brandConcentrationGate(topPicks) {
  const reasons = [];
  const counts = new Map();
  for (const pick of topPicks) {
    const brand = String(pick.brand || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    if (!brand) continue;
    counts.set(brand, (counts.get(brand) || 0) + 1);
  }
  for (const [brand, n] of counts) {
    if (n > 2) reasons.push(`brand_concentration_${n}_${brand.replace(/\s+/g, '_')}`);
  }
  return reasons;
}

function parseArgs(argv) {
  const args = { ageBand: '', files: [], move: true, skipSmoke: false, skipAvailability: false };
  for (const a of argv) {
    if (a.startsWith('--age-band=')) args.ageBand = a.slice('--age-band='.length);
    else if (a === '--no-move') args.move = false;
    else if (a === '--skip-smoke') args.skipSmoke = true;
    else if (a === '--skip-availability') args.skipAvailability = true;
    else if (!a.startsWith('-')) args.files.push(a);
  }
  return args;
}

function bandMonths(ageBandId, doc) {
  if (doc?.min_months != null && doc?.max_months != null) {
    return { min: Number(doc.min_months), max: Number(doc.max_months) };
  }
  const m = String(ageBandId || '').match(/^(\d+)-(\d+)m$/);
  if (m) return { min: Number(m[1]), max: Number(m[2]) };
  return { min: null, max: null };
}

function researchDirs(ageBand) {
  const base = path.join(repoRoot, 'agent-tools', 'exports', 'stage3', ageBand, 'research');
  return {
    base,
    inbox: path.join(base, 'inbox'),
    quarantine: path.join(base, 'quarantine'),
    green: path.join(base, 'green'),
    ledgers: path.join(base, 'ledgers'),
  };
}

function ensureDirs(dirs) {
  for (const d of Object.values(dirs)) {
    if (typeof d === 'string' && (d.endsWith('inbox') || d.endsWith('quarantine') || d.endsWith('green') || d.endsWith('ledgers') || d.endsWith('research'))) {
      fs.mkdirSync(d, { recursive: true });
    }
  }
}

/** Parse free-text age marks into structured signals. */
export function parseAgeText(raw) {
  const text = String(raw || '').trim();
  if (!text) return null;
  const lower = text.toLowerCase();
  const signals = [];

  const under =
    lower.match(/not suitable(?: for children)? under\s+(\d+)\s*(years?|months?)/i) ||
    lower.match(/under\s+(\d+)\s*(years?|months?).{0,20}(not suitable|choking)/i);
  if (under) {
    const n = Number(under[1]);
    const unit = under[2].toLowerCase();
    const months = unit.startsWith('year') ? n * 12 : n;
    signals.push({
      signal_type: 'safety_exclusion',
      raw_text: text,
      forbidden_under_months: months,
      min_months: months,
      max_months: null,
    });
  }

  const reading = lower.match(/reading age\s*:?\s*(\d+)\s*[-–]\s*(\d+)/i);
  if (reading) {
    signals.push({
      signal_type: 'age_range',
      raw_text: text,
      min_months: Number(reading[1]) * 12,
      max_months: Number(reading[2]) * 12,
      forbidden_under_months: null,
    });
  }

  const range = lower.match(/(?:ages?|age range)\s*:?\s*(\d+)\s*[-–]\s*(\d+)/i);
  if (range && !reading) {
    const a = Number(range[1]);
    const b = Number(range[2]);
    // Heuristic: values <= 18 are years; larger may be months
    const minM = a <= 18 ? a * 12 : a;
    const maxM = b <= 18 ? b * 12 : b;
    signals.push({
      signal_type: 'age_range',
      raw_text: text,
      min_months: minM,
      max_months: maxM,
      forbidden_under_months: null,
    });
  }

  const plus =
    lower.match(/(?:ages?|age)\s*:?\s*(\d+)\s*\+/i) ||
    lower.match(/\b(\d+)\s*\+\s*(?:years?|yrs?)?\b/i) ||
    lower.match(/\b(\d+)\s*years?\s*\+/i) ||
    lower.match(/\bfrom\s+(\d+)\s*years?\b/i);
  if (plus && !range && !reading) {
    const n = Number(plus[1]);
    const months = n <= 18 ? n * 12 : n;
    signals.push({
      signal_type: 'min_age',
      raw_text: text,
      min_months: months,
      max_months: null,
      forbidden_under_months: months >= 36 ? months : null,
    });
  }

  const interest = lower.match(/interest(?: age)?\s*:?\s*(\d+)\s*[-–]\s*(\d+)/i);
  if (interest) {
    signals.push({
      signal_type: 'interest_age',
      raw_text: text,
      min_months: Number(interest[1]) * 12,
      max_months: Number(interest[2]) * 12,
      forbidden_under_months: null,
    });
  }

  if (!signals.length) {
    signals.push({
      signal_type: 'unknown',
      raw_text: text,
      min_months: null,
      max_months: null,
      forbidden_under_months: null,
    });
  }
  return signals;
}

export function evaluateAgeGate(pick, band) {
  const collected = [];
  if (Array.isArray(pick.age_signals) && pick.age_signals.length) {
    for (const s of pick.age_signals) collected.push(s);
  }
  if (pick.age_mark_on_listing) {
    const parsed = parseAgeText(pick.age_mark_on_listing);
    if (parsed) collected.push(...parsed);
  }

  if (!collected.length) {
    return {
      result: 'unknown',
      fail_reasons: ['age_signal_absent'],
      signals: [],
    };
  }

  const fail_reasons = [];
  const { min: bMin, max: bMax } = band;

  for (const s of collected) {
    if (s.signal_type === 'interest_age') continue; // soft
    if (s.forbidden_under_months != null && bMin != null && bMin < s.forbidden_under_months) {
      fail_reasons.push(
        `safety_exclusion_under_${s.forbidden_under_months}_overlaps_band_min_${bMin}`,
      );
    }
    if (s.signal_type === 'min_age' && s.min_months != null && bMin != null && s.min_months > bMin) {
      // listing starts above youngest child in band (e.g. 36m+ on 34-36m)
      if (s.min_months >= 36 && bMin < 36) {
        fail_reasons.push(`min_age_${s.min_months}_excludes_band_months_under_36`);
      } else if (s.min_months > bMax) {
        fail_reasons.push(`min_age_${s.min_months}_above_band_max_${bMax}`);
      }
    }
    if (s.min_months != null && s.max_months != null && bMin != null && bMax != null) {
      const overlaps = s.min_months <= bMax && s.max_months >= bMin;
      if (!overlaps) {
        fail_reasons.push(`age_range_${s.min_months}_${s.max_months}_no_overlap_with_${bMin}_${bMax}`);
      }
    }
  }

  // unknown-only marks without parseable months
  const hasNumeric = collected.some(
    (s) => s.min_months != null || s.max_months != null || s.forbidden_under_months != null,
  );
  if (!hasNumeric) {
    return {
      result: 'unknown',
      fail_reasons: ['age_signal_unparsed', ...fail_reasons],
      signals: collected,
    };
  }

  return {
    result: fail_reasons.length ? 'fail' : 'pass',
    fail_reasons,
    signals: collected,
  };
}

function bestForOk(tag, seen) {
  const t = String(tag || '').trim();
  const reasons = [];
  if (!t) reasons.push('best_for_missing');
  if (t && !/^best for /i.test(t)) reasons.push('best_for_missing_prefix');
  const rest = t.replace(/^best for\s+/i, '');
  const words = rest.split(/\s+/).filter(Boolean);
  if (words.length > 6) reasons.push('best_for_too_long');
  const key = t.toLowerCase();
  if (seen.has(key)) reasons.push('best_for_duplicate');
  seen.add(key);
  return reasons;
}

function ratingGate(pick) {
  const reasons = [];
  const exemption = pick.evidence_exemption === 'specialist' || pick.evidence_tier === 'specialist';
  const rv = pick.rating_value;
  const rc = pick.rating_count;
  // Thin SKU review counts always fail — specialist may not use brand-store aggregates to excuse <15 on this product.
  if (rc != null && Number(rc) < MIN_REVIEW_COUNT) {
    reasons.push(`review_count_below_${MIN_REVIEW_COUNT}`);
    return reasons;
  }
  if (exemption) {
    if (rc == null && (!pick.evidence_notes || String(pick.evidence_notes).length < 40)) {
      reasons.push('specialist_exemption_needs_written_reason');
    }
    return reasons;
  }
  if (rv == null || rc == null) {
    reasons.push('rating_missing');
    return reasons;
  }
  if (Number(rv) < MIN_RATING) reasons.push(`rating_below_${MIN_RATING}`);
  return reasons;
}

function csvEscape(v) {
  const s = String(v ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function writeLedger(ledgerPath, rows) {
  const header = [
    'age_band_id',
    'category_entity_id',
    'role',
    'rank',
    'product_name',
    'brand',
    'primary_url',
    'http_status',
    'url_ok',
    'url_verification_ok',
    'product_status',
    'buyable',
    'availability_signals',
    'rating_value',
    'rating_count',
    'rating_source',
    'age_raw',
    'age_gate',
    'age_fail_reasons',
    'evidence_tier',
    'ff_pass',
    'ff_fail_reasons',
    'rank_rationale',
    'missed_top5_reason',
    'include_rationale',
    'exclude_rationale',
    'checked_at',
  ];
  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push(header.map((h) => csvEscape(r[h])).join(','));
  }
  fs.mkdirSync(path.dirname(ledgerPath), { recursive: true });
  fs.writeFileSync(ledgerPath, lines.join('\n') + '\n', 'utf8');
}

function howCategoryFails(doc) {
  const fails = [];
  if (doc.schema_version !== REQUIRED_SCHEMA) {
    fails.push(`schema_version_not_${REQUIRED_SCHEMA}`);
  }
  if (!nonEmpty(doc.buying_factor_memo)) fails.push('buying_factor_memo_missing');
  if (!nonEmpty(doc.methodology)) fails.push('methodology_missing');
  else {
    const m = String(doc.methodology).toLowerCase();
    const needs = ['bench', 'age', 'rank', 'url'];
    const missing = needs.filter((k) => !m.includes(k));
    if (missing.length) fails.push(`methodology_missing_steps:${missing.join('|')}`);
  }
  return fails;
}

function howPickFails(pick) {
  const fails = [];
  if (!nonEmpty(pick.rank_rationale)) fails.push('rank_rationale_missing');
  if (!Array.isArray(pick.age_signals) || pick.age_signals.length === 0) {
    fails.push('age_signals_missing');
  }
  const uv = pick.url_verification;
  if (!uv || typeof uv !== 'object') {
    fails.push('url_verification_missing');
  } else {
    if (!nonEmpty(uv.checked_at)) fails.push('url_verification_checked_at_missing');
    if (uv.primary_opens_product !== true) fails.push('url_verification_primary_opens_product_false');
  }
  fails.push(...descriptionWordGate(pick));
  fails.push(...whyPipWordGate(pick));
  fails.push(...tagMetaTalkGate(pick));
  fails.push(...bestForLivesGate(pick));
  fails.push(...descriptionVerdictDistinctGate(pick));
  if (!nonEmpty(pick.ember_verdict)) fails.push('ember_verdict_missing');
  if (!nonEmpty(pick.product_name)) fails.push('product_name_missing');
  return fails;
}

async function checkDocument(filePath, { skipSmoke, skipAvailability, band }) {
  const doc = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const ageBand = doc.age_band_id || band.min && `${band.min}-${band.max}m` || '';
  const months = bandMonths(ageBand, doc);
  const smoke = skipSmoke
    ? { results: {}, checked_at: new Date().toISOString().slice(0, 10) }
    : await smokeDocument(doc);
  const availability = skipAvailability
    ? { results: {}, checked_at: new Date().toISOString().slice(0, 10), buyable_count: 0, url_count: 0 }
    : await checkDocumentAvailability(doc);

  const categoryFails = [...howCategoryFails(doc)];
  const topPicks = [...(doc.top_picks || [])].sort((a, b) => a.rank - b.rank);
  if (topPicks.length !== 5) categoryFails.push(`top_picks_count_${topPicks.length}`);
  if ((doc.longlist || []).length !== 15) categoryFails.push(`longlist_count_${(doc.longlist || []).length}`);
  if ((doc.skips || []).length < 5) categoryFails.push(`skips_below_5`);
  categoryFails.push(...uniqueTopPickNamesGate(topPicks));
  categoryFails.push(...nearDuplicateProductLineGate(topPicks));
  categoryFails.push(...brandConcentrationGate(topPicks));

  for (const row of doc.longlist || []) {
    const lr = Number(row.longlist_rank);
    if (lr >= 6 && lr <= 10 && !nonEmpty(row.missed_top5_reason)) {
      categoryFails.push(`longlist_${lr}_missed_top5_reason_missing`);
    }
    if (lr >= 1 && lr <= 10 && !nonEmpty(row.rank_rationale) && !row.included_in_top_5) {
      // Top-5 mirrors may omit if top_picks carry rationale; still require for 6-10 backups
      if (lr >= 6) categoryFails.push(`longlist_${lr}_rank_rationale_missing`);
    }
    // UK market: every longlist/backup row that carries a URL must be UK-buyable (not Top 5 only).
    const llUrl = row.product_url || row.url;
    if (nonEmpty(llUrl)) {
      const ukFails = ukMarketFailReasons(llUrl, {
        priceText: row.price_text || row.price_gbp || row.price || '',
        requireUrl: true,
      });
      for (const reason of ukFails) {
        categoryFails.push(`longlist_${lr || 'x'}_${reason}`);
      }
    }
  }

  const seenTags = new Set();
  const pickResults = [];
  const ledgerRows = [];
  const checked_at = smoke.checked_at || new Date().toISOString().slice(0, 10);

  for (const pick of topPicks) {
    const fail = [];
    const smokeHit = smoke.results?.[pick.product_url] || {
      url_ok: false,
      http_status: null,
      error: skipSmoke ? 'smoke_skipped' : 'missing_smoke',
    };
    if (!skipSmoke && !smokeHit.url_ok) fail.push(`url_not_ok:${smokeHit.error || smokeHit.http_status}`);

    const availHit = availability.results?.[pick.product_url];
    const altHits = (pick.alternate_urls || [])
      .map((u) => availability.results?.[u])
      .filter(Boolean);
    if (!skipAvailability) {
      fail.push(...availabilityGateFromPick(pick, availHit, altHits));
      if (availHit?.buyable) {
        pick.availability_verification = {
          checked_at: availHit.checked_at,
          product_status: availHit.product_status,
          buyable: true,
          signals: availHit.signals || [],
        };
      }
    }

    fail.push(...ratingGate(pick));
    fail.push(...bestForOk(pick.best_for_tag, seenTags));
    fail.push(...howPickFails(pick));
    fail.push(
      ...ukMarketFailReasons(pick.product_url || pick.url, {
        priceText: pick.price_text || pick.price_gbp || pick.price || '',
        requireUrl: true,
      }),
    );

    const ageGate = evaluateAgeGate(pick, months);
    if (ageGate.result === 'fail' || ageGate.result === 'unknown') {
      fail.push(...(ageGate.fail_reasons.length ? ageGate.fail_reasons : ['age_gate_unknown']));
    }

    for (const field of ['ember_verdict', 'product_description_under_30_words', 'best_for_tag', 'rank_rationale']) {
      const hits = bannedHits(pick[field], {
        // Invented hyphen allowlist + formulaic closers: parent-facing Pip fields only.
        publicCopy: field !== 'rank_rationale',
        field,
      });
      if (hits.length) fail.push(`banned_copy:${hits.join('|')}`);
    }

    const uvOk = pick.url_verification?.primary_opens_product === true;
    const ff_pass = fail.length === 0;
    pickResults.push({
      rank: pick.rank,
      product_name: pick.product_name,
      ff_pass,
      fail_reasons: fail,
      url_ok: !!smokeHit.url_ok,
      http_status: smokeHit.http_status,
      buyable: !!availHit?.buyable,
      product_status: availHit?.product_status || '',
      age_gate: ageGate.result,
      age_fail_reasons: ageGate.fail_reasons,
    });

    ledgerRows.push({
      age_band_id: ageBand,
      category_entity_id: doc.category_entity_id,
      role: 'top_pick',
      rank: pick.rank,
      product_name: pick.product_name,
      brand: pick.brand || '',
      primary_url: pick.product_url || '',
      http_status: smokeHit.http_status,
      url_ok: !!smokeHit.url_ok,
      url_verification_ok: uvOk,
      product_status: availHit?.product_status || '',
      buyable: availHit?.buyable ?? '',
      availability_signals: (availHit?.signals || []).join('|'),
      rating_value: pick.rating_value,
      rating_count: pick.rating_count,
      rating_source: pick.rating_source || '',
      age_raw: pick.age_mark_on_listing || '',
      age_gate: ageGate.result,
      age_fail_reasons: ageGate.fail_reasons.join('|'),
      evidence_tier: pick.evidence_tier || '',
      ff_pass,
      ff_fail_reasons: fail.join('|'),
      rank_rationale: pick.rank_rationale || '',
      missed_top5_reason: '',
      include_rationale: pick.ember_verdict || pick.why_it_fits || '',
      exclude_rationale: '',
      checked_at,
    });
  }

  for (const row of doc.longlist || []) {
    const smokeHit = smoke.results?.[row.product_url] || {};
    ledgerRows.push({
      age_band_id: ageBand,
      category_entity_id: doc.category_entity_id,
      role: row.status === 'skip' ? 'longlist_skip' : 'longlist',
      rank: row.longlist_rank,
      product_name: row.product_name,
      brand: row.brand || '',
      primary_url: row.product_url || '',
      http_status: smokeHit.http_status ?? '',
      url_ok: smokeHit.url_ok ?? '',
      url_verification_ok: '',
      product_status: '',
      buyable: '',
      availability_signals: '',
      rating_value: row.rating_value ?? '',
      rating_count: row.rating_count ?? '',
      rating_source: '',
      age_raw: row.age_mark_on_listing || '',
      age_gate: '',
      age_fail_reasons: '',
      evidence_tier: row.evidence_tier || '',
      ff_pass: '',
      ff_fail_reasons: '',
      rank_rationale: row.rank_rationale || '',
      missed_top5_reason: row.missed_top5_reason || '',
      include_rationale: row.summary_reason || '',
      exclude_rationale: row.skip_reason || row.caveat_short || '',
      checked_at,
    });
  }

  for (const row of doc.skips || []) {
    const smokeHit = smoke.results?.[row.product_url] || {};
    ledgerRows.push({
      age_band_id: ageBand,
      category_entity_id: doc.category_entity_id,
      role: 'skip',
      rank: '',
      product_name: row.product_name,
      brand: row.brand || '',
      primary_url: row.product_url || '',
      http_status: smokeHit.http_status ?? '',
      url_ok: smokeHit.url_ok ?? '',
      url_verification_ok: '',
      product_status: '',
      buyable: '',
      availability_signals: '',
      rating_value: row.rating_value ?? '',
      rating_count: row.rating_count ?? '',
      rating_source: '',
      age_raw: row.age_mark_on_listing || '',
      age_gate: '',
      age_fail_reasons: '',
      evidence_tier: row.evidence_tier || '',
      ff_pass: false,
      ff_fail_reasons: 'skip',
      rank_rationale: '',
      missed_top5_reason: '',
      include_rationale: '',
      exclude_rationale: row.skip_reason || '',
      checked_at,
    });
  }

  const anyPickFail = pickResults.some((p) => !p.ff_pass);
  const overall_pass = !categoryFails.length && !anyPickFail;

  return {
    file: path.basename(filePath),
    age_band_id: ageBand,
    category_entity_id: doc.category_entity_id,
    category_label: doc.category_label,
    overall_pass,
    category_fails: categoryFails,
    pick_results: pickResults,
    smoke_summary: {
      url_count: Object.keys(smoke.results || {}).length,
      ok_count: Object.values(smoke.results || {}).filter((r) => r.url_ok).length,
    },
    availability_summary: {
      url_count: availability.url_count || Object.keys(availability.results || {}).length,
      buyable_count: availability.buyable_count ?? Object.values(availability.results || {}).filter((r) => r.buyable).length,
    },
    ledgerRows,
    smoke,
    availability,
    doc,
  };
}

function writeReport(reportPath, result) {
  const lines = [];
  lines.push(`# FF Stage 3 check — ${result.category_entity_id}`);
  lines.push('');
  lines.push(`- **Overall:** ${result.overall_pass ? 'PASS' : 'FAIL'}`);
  lines.push(`- **Band:** ${result.age_band_id}`);
  lines.push(`- **URL smoke:** ${result.smoke_summary.ok_count}/${result.smoke_summary.url_count} ok`);
  if (result.availability_summary) {
    lines.push(
      `- **Availability:** ${result.availability_summary.buyable_count}/${result.availability_summary.url_count} buyable`,
    );
  }
  if (result.category_fails.length) {
    lines.push(`- **Category fails:** ${result.category_fails.join(', ')}`);
  }
  lines.push('');
  lines.push('| Rank | Product | Pass | Reasons |');
  lines.push('|---:|---|---|---|');
  for (const p of result.pick_results) {
    lines.push(
      `| ${p.rank} | ${p.product_name} | ${p.ff_pass ? 'pass' : 'fail'} | ${(p.fail_reasons || []).join('; ') || '—'} |`,
    );
  }
  lines.push('');
  if (!result.overall_pass) {
    lines.push('## Re-research brief (for founder approval)');
    lines.push('');
    lines.push(`Re-run Stage 3 research for \`${result.category_entity_id}\` (${result.age_band_id}).`);
    lines.push('Fix every FAIL reason above. Use schema `ember_picks_research_v3`. Trusted URL first (brand/publisher). Capture `age_signals` from the live listing.');
    lines.push('Fill `buying_factor_memo`, per-pick `rank_rationale`, and longlist 6–10 `missed_top5_reason`.');
    lines.push('Do not light-repair quarantine JSON. Full Mode A `$ember-stage3-research` → write to `inbox/` for another FF check.');
  }
  fs.writeFileSync(reportPath, lines.join('\n') + '\n', 'utf8');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  let ageBand = args.ageBand;
  let files = [...args.files];

  if (ageBand) {
    const dirs = researchDirs(ageBand);
    ensureDirs(dirs);
    // Bootstrap: move loose research JSON into inbox if inbox empty-ish
    const loose = fs
      .readdirSync(dirs.base)
      .filter((f) => f.startsWith('ember_picks_') && f.endsWith('.json'));
    for (const f of loose) {
      const from = path.join(dirs.base, f);
      const to = path.join(dirs.inbox, f);
      if (!fs.existsSync(to)) fs.renameSync(from, to);
    }
    if (!files.length) {
      files = fs
        .readdirSync(dirs.inbox)
        .filter((f) => f.startsWith('ember_picks_') && f.endsWith('.json'))
        .map((f) => path.join(dirs.inbox, f));
    }
  }

  if (!files.length) {
    console.error('Usage: node stage3-ff-check.mjs --age-band=34-36m | <files…>');
    process.exit(1);
  }

  if (!ageBand) {
    const first = JSON.parse(fs.readFileSync(files[0], 'utf8'));
    ageBand = first.age_band_id;
  }
  const dirs = researchDirs(ageBand);
  ensureDirs(dirs);

  const results = [];
  for (const file of files) {
    const result = await checkDocument(file, {
      skipSmoke: args.skipSmoke,
      skipAvailability: args.skipAvailability,
      band: bandMonths(ageBand, {}),
    });
    results.push(result);

    const ledgerPath = path.join(dirs.ledgers, `stage3_evidence_ledger_${ageBand}_${result.category_entity_id}.csv`);
    writeLedger(ledgerPath, result.ledgerRows);

    const reportName = `ff_check_${result.category_entity_id}.md`;
    const reportPath = path.join(result.overall_pass ? dirs.green : dirs.quarantine, reportName);
    writeReport(reportPath, result);

    // Attach check summary onto a sidecar next to destination
    const smokePath = path.join(
      result.overall_pass ? dirs.green : dirs.quarantine,
      `ember_picks_${ageBand}_${result.category_entity_id}.url_smoke.json`,
    );
    fs.writeFileSync(smokePath, JSON.stringify(result.smoke, null, 2), 'utf8');
    const availPath = path.join(
      result.overall_pass ? dirs.green : dirs.quarantine,
      `ember_picks_${ageBand}_${result.category_entity_id}.availability.json`,
    );
    fs.writeFileSync(availPath, JSON.stringify(result.availability, null, 2), 'utf8');

    if (args.move) {
      const destDir = result.overall_pass ? dirs.green : dirs.quarantine;
      const dest = path.join(destDir, path.basename(file));
      // Write doc with availability_verification stamped on picks
      fs.writeFileSync(dest, JSON.stringify(result.doc, null, 2), 'utf8');
      const base = path.basename(file, '.json');
      for (const companionName of [`${base}.csv`, `${base}_summary.md`]) {
        const fromC = path.join(path.dirname(file), companionName);
        if (fs.existsSync(fromC)) {
          fs.copyFileSync(fromC, path.join(destDir, companionName));
          if (path.dirname(file) === dirs.inbox) fs.unlinkSync(fromC);
        }
      }
      if (path.dirname(file) === dirs.inbox) {
        fs.unlinkSync(file);
      }
      // Stamp ingestion status on a small sidecar
      const stamp = {
        ff_check_pass: result.overall_pass,
        checked_at: new Date().toISOString().slice(0, 10),
        ingestion_ready_status: result.overall_pass ? 'founder-review-ready' : 'not-ready',
        pick_results: result.pick_results,
        category_fails: result.category_fails,
      };
      fs.writeFileSync(dest.replace(/\.json$/i, '.ff_check.json'), JSON.stringify(stamp, null, 2), 'utf8');
    }
  }

  const summary = {
    age_band_id: ageBand,
    passed: results.filter((r) => r.overall_pass).map((r) => r.category_entity_id),
    failed: results.filter((r) => !r.overall_pass).map((r) => r.category_entity_id),
    details: results.map((r) => ({
      category_entity_id: r.category_entity_id,
      overall_pass: r.overall_pass,
      category_fails: r.category_fails,
      picks_failed: r.pick_results.filter((p) => !p.ff_pass).map((p) => ({
        rank: p.rank,
        product_name: p.product_name,
        fail_reasons: p.fail_reasons,
      })),
      smoke: r.smoke_summary,
      availability: r.availability_summary,
    })),
  };

  const summaryPath = path.join(dirs.base, `ff_check_summary_${ageBand}.json`);
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log(JSON.stringify(summary, null, 2));
  if (summary.failed.length) process.exitCode = 2;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
