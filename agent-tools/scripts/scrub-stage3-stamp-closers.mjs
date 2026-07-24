#!/usr/bin/env node
/**
 * Founder 2026-07-24 — strip stamp Why Pip closers from Stage 3 green research
 * and ensure unique endings within each Top N (FF repeated_why_pip_closer gate).
 *
 * Usage:
 *   node agent-tools/scripts/scrub-stage3-stamp-closers.mjs
 *   node agent-tools/scripts/scrub-stage3-stamp-closers.mjs --bands=6-9m,19-21m
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  bannedHits,
  whyPipClosingSentence,
  repeatedWhyPipCloserFails,
} from './lib/stage3-banned-copy.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DEFAULT_BANDS = [
  '4-6m',
  '6-9m',
  '9-12m',
  '13-15m',
  '16-18m',
  '19-21m',
  '22-24m',
  '25-27m',
];

const STAMP_SENTENCE_RES = [
  /\s*That is the practical shift parents notice in daily play\.?/gi,
  /\s*Shared play on the living-room floor keeps it kind for tired parents\.?/gi,
  /\s*That is enough for one short shared sit before the evening runs on\.?/gi,
  /\s*Keep it nearby so they can choose it themselves\.?/gi,
  /\s*Share it together for a few minutes, then let them lead\.?/gi,
  /\s*Share it at a quiet time on the sofa\.?/gi,
  /\s*Check harness fit every few weeks as they grow\.?/gi,
];

/** Unique, product-tied endings — cycle by rank; avoid stamp reuse. */
const ENDING_POOL = [
  (p) => `Keep ${shortName(p)} in easy reach for the next short try.`,
  (p) => `Leave ${shortName(p)} out where they can find it again tomorrow.`,
  (p) => `One short go with ${shortName(p)} is enough before you tidy away.`,
  (p) => `Stay nearby while they try ${shortName(p)}, then stop on a good note.`,
  (p) => `Bring ${shortName(p)} back out when the room is calm enough for another turn.`,
  (p) => `Put ${shortName(p)} where you both sit most evenings so the invite is easy.`,
  (p) => `Let them finish the turn with ${shortName(p)}, then close the activity kindly.`,
  (p) => `If interest fades, pack ${shortName(p)} away and try again another day.`,
  (p) => `Use ${shortName(p)} as the second option when the first favourite is already out.`,
  (p) => `Keep the session short with ${shortName(p)} so it stays a friendly invite.`,
];

function shortName(pick) {
  const name = String(pick.product_name || 'this')
    .replace(/\s+/g, ' ')
    .trim();
  // Prefer first 4–6 significant words, drop edition noise
  const cleaned = name
    .replace(/\([^)]*\)/g, '')
    .replace(/\b(Board Book|Anniversary Edition|Lift the Flap)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned.split(' ').filter(Boolean);
  if (words.length <= 4) return cleaned || 'this';
  return words.slice(0, 4).join(' ');
}

function wordCount(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function stripStamps(text) {
  let out = String(text || '');
  for (const re of STAMP_SENTENCE_RES) out = out.replace(re, '');
  // collapse duplicate spaces / leftover double periods
  out = out.replace(/\s+/g, ' ').replace(/\s+\./g, '.').trim();
  // remove accidental duplicate trailing sentences created by paste bugs
  const parts = out.split(/(?<=[.!?])\s+/).filter(Boolean);
  const seen = new Set();
  const uniq = [];
  for (const part of parts) {
    const key = part.toLowerCase().replace(/[.!?]+$/g, '').trim();
    if (seen.has(key)) continue;
    seen.add(key);
    uniq.push(part);
  }
  return uniq.join(' ').trim();
}

function ensureEnding(pick, usedClosings, rankIndex) {
  const before = String(pick.ember_verdict || '');
  let verdict = stripStamps(before);
  let hits = bannedHits(verdict, { publicCopy: true, field: 'ember_verdict' });
  let close = whyPipClosingSentence(verdict);
  let wc = wordCount(verdict);

  const needsNewEnding =
    hits.length > 0 ||
    wc < 40 ||
    wc > 60 ||
    (close && usedClosings.has(close));

  if (!needsNewEnding) {
    usedClosings.add(close);
    pick.ember_verdict = verdict;
    return { changed: verdict !== before.trim(), ok: true };
  }

  // Drop last sentence if it is a stamp / duplicate / pushing over 60
  const parts = verdict.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (parts.length >= 2 && (hits.length || usedClosings.has(close) || wc > 60)) {
    verdict = parts.slice(0, -1).join(' ').trim();
  }

  // Try pool endings until unique + in word band + clean
  let chosen = null;
  for (let i = 0; i < ENDING_POOL.length; i++) {
    const ending = ENDING_POOL[(rankIndex + i) % ENDING_POOL.length](pick);
    const candidate = `${verdict.replace(/[.!?]?$/, '.') } ${ending}`.replace(/\.\./g, '.');
    const cHits = bannedHits(candidate, { publicCopy: true, field: 'ember_verdict' });
    const cClose = whyPipClosingSentence(candidate);
    const cWc = wordCount(candidate);
    if (cHits.length) continue;
    if (usedClosings.has(cClose)) continue;
    if (cWc < 40 || cWc > 60) continue;
    chosen = candidate;
    usedClosings.add(cClose);
    break;
  }

  if (!chosen) {
    // Trim middle sentence if still too long, or pad with a short unique beat
    let base = verdict;
    while (wordCount(base) > 48) {
      const segs = base.split(/(?<=[.!?])\s+/).filter(Boolean);
      if (segs.length <= 2) break;
      base = [...segs.slice(0, 1), ...segs.slice(2)].join(' ').trim();
    }
    const ending = `Try ${shortName(pick)} once more when the next quiet gap appears.`;
    chosen = `${base.replace(/[.!?]?$/, '.') } ${ending}`.replace(/\.\./g, '.');
    // force uniqueness with rank crumb if still colliding
    let cClose = whyPipClosingSentence(chosen);
    let n = 0;
    while (usedClosings.has(cClose) && n < 5) {
      chosen = `${base.replace(/[.!?]?$/, '.') } Give ${shortName(pick)} one more short turn today, then stop.`.replace(
        /\.\./g,
        '.',
      );
      if (n > 0) {
        chosen = `${base.replace(/[.!?]?$/, '.') } Bring ${shortName(pick)} out again after a snack, then pack it away.`.replace(
          /\.\./g,
          '.',
        );
      }
      cClose = whyPipClosingSentence(chosen);
      n += 1;
    }
    usedClosings.add(whyPipClosingSentence(chosen));
  }

  pick.ember_verdict = chosen.trim();
  const afterHits = bannedHits(pick.ember_verdict, { publicCopy: true, field: 'ember_verdict' });
  return {
    changed: before !== pick.ember_verdict,
    ok: afterHits.length === 0 && wordCount(pick.ember_verdict) >= 40 && wordCount(pick.ember_verdict) <= 60,
    hits: afterHits,
    wc: wordCount(pick.ember_verdict),
  };
}

function parseArgs(argv) {
  let bands = DEFAULT_BANDS;
  for (const a of argv) {
    if (a.startsWith('--bands=')) {
      bands = a
        .slice('--bands='.length)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return { bands };
}

const { bands } = parseArgs(process.argv.slice(2));
const report = { filesTouched: 0, picksChanged: 0, stillDirty: [] };

for (const band of bands) {
  const greenDir = path.join(root, 'agent-tools', 'exports', 'stage3', band, 'research', 'green');
  if (!fs.existsSync(greenDir)) continue;
  const files = fs
    .readdirSync(greenDir)
    .filter((f) => f.startsWith('ember_picks_') && f.endsWith('.json') && !f.includes('availability') && !f.includes('url_smoke'));

  for (const file of files) {
    const fp = path.join(greenDir, file);
    const doc = JSON.parse(fs.readFileSync(fp, 'utf8'));
    const used = new Set();
    let fileChanged = false;

    const picks = [...(doc.top_picks || [])].sort((a, b) => a.rank - b.rank);
    picks.forEach((pick, idx) => {
      const res = ensureEnding(pick, used, idx);
      if (res.changed) {
        fileChanged = true;
        report.picksChanged += 1;
      }
      if (!res.ok) {
        report.stillDirty.push({
          band,
          file,
          rank: pick.rank,
          hits: res.hits || [],
          wc: res.wc,
          close: whyPipClosingSentence(pick.ember_verdict),
        });
      }
    });

    // Mirror top pick verdicts onto longlist rows with same product_name when present
    if (doc.longlist) {
      for (const row of doc.longlist) {
        const match = picks.find(
          (p) =>
            String(p.product_name || '').toLowerCase() === String(row.product_name || '').toLowerCase(),
        );
        if (match && row.ember_verdict && row.ember_verdict !== match.ember_verdict) {
          row.ember_verdict = match.ember_verdict;
          fileChanged = true;
        } else if (row.ember_verdict) {
          const cleaned = stripStamps(row.ember_verdict);
          if (cleaned !== row.ember_verdict) {
            row.ember_verdict = cleaned;
            fileChanged = true;
          }
        }
      }
    }

    const repeatFails = repeatedWhyPipCloserFails(picks);
    if (repeatFails.length) {
      report.stillDirty.push({ band, file, repeatFails });
    }

    if (fileChanged) {
      fs.writeFileSync(fp, `${JSON.stringify(doc, null, 2)}\n`);
      report.filesTouched += 1;
    }
  }
}

console.log(JSON.stringify(report, null, 2));
