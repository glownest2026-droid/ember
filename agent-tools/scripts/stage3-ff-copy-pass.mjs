#!/usr/bin/env node
/**
 * Copy-only FF pass across Stage 3 green folders (no URL smoke).
 * Fails on banned stamps + repeated Why Pip closers within Top N.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  bannedHits,
  repeatedWhyPipCloserFails,
  whyPipClosingSentence,
} from './lib/stage3-banned-copy.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const bands = process.argv.find((a) => a.startsWith('--bands='))
  ? process.argv
      .find((a) => a.startsWith('--bands='))
      .slice('--bands='.length)
      .split(',')
  : ['4-6m', '6-9m', '9-12m', '13-15m', '16-18m', '19-21m', '22-24m', '25-27m'];

function wordCount(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

const fails = [];
let files = 0;
let picks = 0;

for (const band of bands) {
  const greenDir = path.join(root, 'agent-tools', 'exports', 'stage3', band, 'research', 'green');
  if (!fs.existsSync(greenDir)) continue;
  for (const file of fs.readdirSync(greenDir).filter(
    (f) => f.startsWith('ember_picks_') && f.endsWith('.json') && !f.includes('availability') && !f.includes('url_smoke'),
  )) {
    files += 1;
    const doc = JSON.parse(fs.readFileSync(path.join(greenDir, file), 'utf8'));
    const top = [...(doc.top_picks || [])].sort((a, b) => a.rank - b.rank);
    const catFails = [...repeatedWhyPipCloserFails(top)];
    for (const pick of top) {
      picks += 1;
      for (const field of ['ember_verdict', 'product_description_under_30_words', 'best_for_tag']) {
        const hits = bannedHits(pick[field], { publicCopy: true, field });
        if (hits.length) catFails.push(`r${pick.rank}:${field}:${hits.join('|')}`);
      }
      const wc = wordCount(pick.ember_verdict);
      if (wc < 40 || wc > 60) catFails.push(`r${pick.rank}:why_pip_wc_${wc}`);
    }
    // Cross-band stamp hunt on last sentences
    for (const pick of top) {
      const close = whyPipClosingSentence(pick.ember_verdict);
      if (/practical shift|living-room floor keeps it kind|short shared sit before the evening|choose it themselves|few minutes, then let them lead|quiet time on the sofa/.test(close)) {
        catFails.push(`r${pick.rank}:stamp_closer_survived`);
      }
    }
    if (catFails.length) fails.push({ band, file, catFails });
  }
}

const out = { files, picks, failFiles: fails.length, fails };
fs.writeFileSync(
  path.join(root, 'agent-tools', 'exports', 'stage3', 'ff_copy_pass_4-27m.json'),
  JSON.stringify(out, null, 2),
);
console.log(JSON.stringify({ files, picks, failFiles: fails.length, sample: fails.slice(0, 8) }, null, 2));
process.exit(fails.length ? 1 : 0);
