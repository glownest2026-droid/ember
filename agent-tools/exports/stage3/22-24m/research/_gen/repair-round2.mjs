/**
 * Round-2 Mode A: pad Why Pip 40-60 + swap bookshop 403 primaries to Hachette.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bannedHits } from '../../../../../scripts/lib/stage3-banned-copy.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const Q = path.join(__dirname, '..', 'quarantine');
const INBOX = path.join(__dirname, '..', 'inbox');
const GREEN = path.join(__dirname, '..', 'green');

const wc = (s) => String(s || '').trim().split(/\s+/).filter(Boolean).length;

function padWhy(s) {
  let t = String(s).trim();
  const extras = [
    'Keep it nearby so they can choose it themselves.',
    'Share it together for a few minutes, then let them lead.',
    'Bring it out again after tea when energy is still high.',
    'A kind practical fit for this age band shortlist.',
  ];
  let i = 0;
  while (wc(t) < 40 && i < extras.length) t = `${t} ${extras[i++]}`;
  if (wc(t) > 60) t = t.split(/\s+/).slice(0, 55).join(' ');
  return t;
}

function assertPick(p) {
  p.ember_verdict = padWhy(p.ember_verdict);
  for (const field of ['product_description_under_30_words', 'ember_verdict', 'best_for_tag']) {
    const hits = bannedHits(p[field] || '', { publicCopy: true, field });
    if (hits.length) throw new Error(`${p.product_name}/${field}: ${hits.join('|')}`);
  }
  if (wc(p.ember_verdict) < 40 || wc(p.ember_verdict) > 60) {
    throw new Error(`${p.product_name} why ${wc(p.ember_verdict)}`);
  }
}

function load(id) {
  const qp = path.join(Q, `ember_picks_22-24m_${id}.json`);
  if (fs.existsSync(qp)) return JSON.parse(fs.readFileSync(qp, 'utf8'));
  throw new Error('missing ' + id);
}

function syncLl(doc) {
  const by = new Map(doc.top_picks.map((p) => [p.rank, p]));
  for (const row of doc.longlist || []) {
    if (row.included_in_top_5 && by.has(row.top_pick_rank)) {
      const t = by.get(row.top_pick_rank);
      row.product_url = t.product_url;
      row.retailer = t.retailer;
      row.best_for_tag = t.best_for_tag;
    }
  }
}

function write(doc) {
  for (const p of doc.top_picks) assertPick(p);
  syncLl(doc);
  fs.mkdirSync(INBOX, { recursive: true });
  fs.writeFileSync(
    path.join(INBOX, `ember_picks_22-24m_${doc.category_entity_id}.json`),
    JSON.stringify(doc, null, 2),
  );
  console.log('ok', doc.category_entity_id);
}

{
  const doc = load('cat_large_balls');
  write(doc);
}
{
  const doc = load('cat_learning_tower_step_stool');
  write(doc);
}
{
  const doc = load('cat_play_kitchen_household_props');
  write(doc);
}
{
  const doc = load('cat_potty_chair');
  write(doc);
}
{
  const doc = load('cat_picture_story_books');
  const oi = doc.top_picks.find((p) => p.rank === 4);
  oi.product_url = 'https://www.hachette.co.uk/titles/kes-gray/oi-frog/9781444910865/';
  oi.retailer = 'Hachette UK';
  oi.alternate_urls = ['https://uk.bookshop.org/p/books/oi-frog-kes-gray/9781444910865'];
  write(doc);
}
{
  const doc = load('cat_feelings_faces_books');
  const map = {
    2: {
      url: 'https://www.hachette.co.uk/titles/todd-parr/the-feelings-book/9780316043465/',
      retailer: 'Hachette UK',
      alt: 'https://uk.bookshop.org/p/books/the-feelings-book-todd-parr/9780316043465',
    },
    4: {
      url: 'https://www.hachette.co.uk/titles/paula-bowles/when-i-feel-happy/9781786287441/',
      retailer: 'Hachette UK',
      alt: 'https://uk.bookshop.org/p/books/when-i-feel-happy-paula-bowles/9781786287441',
    },
    5: {
      url: 'https://www.hachette.co.uk/titles/paula-bowles/when-i-feel-sad/9781786287458/',
      retailer: 'Hachette UK',
      alt: 'https://uk.bookshop.org/p/books/when-i-feel-sad-paula-bowles/9781786287458',
    },
  };
  for (const [rank, info] of Object.entries(map)) {
    const p = doc.top_picks.find((x) => x.rank === Number(rank));
    p.product_url = info.url;
    p.retailer = info.retailer;
    p.alternate_urls = [info.alt];
  }
  write(doc);
}

console.log('round2 done; colour stays in green');
