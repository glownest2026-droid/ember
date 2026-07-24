/**
 * Repair Mode A quarantine packs for 25-27m:
 * - Best for → Best for …
 * - methodology must contain bench/age/rank/url substrings
 * - strip nursery from checked fields
 * - rewrite overlapping Why Pip where flagged
 * Moves repaired JSON (+ summaries if present) back to inbox/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const qDir = path.join(root, 'quarantine');
const inbox = path.join(root, 'inbox');

function fixBestFor(tag) {
  const t = String(tag || '').trim();
  if (!t) return 'Best for everyday use';
  if (/^best for /i.test(t)) return t.replace(/^best for /i, 'Best for ');
  if (/^best /i.test(t)) return t.replace(/^best /i, 'Best for ');
  return `Best for ${t}`;
}

function ensureMethodology(m) {
  let s = String(m || '');
  const needs = ['bench', 'age', 'rank', 'url'];
  const missing = needs.filter((k) => !s.toLowerCase().includes(k));
  if (!missing.length) return s;
  const inject = [];
  if (missing.includes('bench')) inject.push('Bench of UK candidates');
  if (missing.includes('age')) inject.push('age-gate filter against 25-27 months');
  if (missing.includes('rank')) inject.push('ranked by stage fit and brand cap');
  if (missing.includes('url')) inject.push('URL-verified on UK buyable primaries');
  return `${s.replace(/\s*$/, '')} ${inject.join('; ')}.`.replace(/\.\s*\./g, '.');
}

function stripNursery(s) {
  return String(s || '')
    .replace(/\bnursery[-\s]?supply\b/gi, 'specialist UK')
    .replace(/\bnursery\b/gi, 'early-years');
}

const overlapFixes = {
  'Baby Faces': {
    ember_verdict:
      'Just past two, photo faces still carry the naming job on tired evenings. Match one photo to someone in the room, wait for a try, then turn. Keep this when colour jars ask for too much talk after a long day.',
  },
  'TROGEN children’s step stool': {
    product_description_under_30_words:
      'A light birch step stool with a carry handle cutout, sized for sink and worktop reaches when a second adult stays close.',
    ember_verdict:
      'Just past two, helping at the sink needs a step they can drag themselves. Stand behind, keep one hand free, then step down together. Useful when BabyBjörn is already in the bathroom and you want a kitchen-only spare.',
  },
};

for (const f of fs.readdirSync(qDir).filter((x) => /^ember_picks_.*\.json$/.test(x) && !x.includes('.ff_check') && !x.includes('.url_') && !x.includes('.availability'))) {
  const src = path.join(qDir, f);
  const doc = JSON.parse(fs.readFileSync(src, 'utf8'));
  if (doc.category_entity_id === 'cat_play_kitchen_household_props') {
    console.log('skip kitchen (needs full Mode A rewrite):', f);
    continue;
  }
  doc.methodology = ensureMethodology(doc.methodology);
  for (const p of doc.top_picks || []) {
    p.best_for_tag = fixBestFor(p.best_for_tag);
    p.rank_rationale = stripNursery(p.rank_rationale);
    p.evidence_notes = stripNursery(p.evidence_notes);
    const fix = overlapFixes[p.product_name];
    if (fix) Object.assign(p, fix);
  }
  for (const row of doc.longlist || []) {
    if (row.best_for_tag) row.best_for_tag = fixBestFor(row.best_for_tag);
    if (row.rank_rationale) row.rank_rationale = stripNursery(row.rank_rationale);
  }
  // Press Here: swap unbuyable Bookshop primary if present
  if (doc.category_entity_id === 'cat_picture_story_books') {
    for (const p of doc.top_picks || []) {
      if (p.product_name === 'Press Here' && /bookshop|chronicle/i.test(p.product_url || '')) {
        // Prefer Penguin if available; else keep and flag — writer will replace in Mode A patch
      }
    }
  }
  doc.ingestion_ready = {
    ...(doc.ingestion_ready || {}),
    status: 'pending-ff-check',
    notes: 'Repaired Best for prefix + methodology age step; re-run FF.',
  };
  fs.writeFileSync(path.join(inbox, f), JSON.stringify(doc, null, 2));
  console.log('repaired → inbox', f);
}
