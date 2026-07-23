/**
 * Founder 2026-07-23g — ban "reset"; fix dead Amazon communication-book primary.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bannedHits } from './lib/stage3-banned-copy.mjs';

const greenDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'exports',
  'stage3',
  '34-36m',
  'research',
  'green',
);

function wc(s) {
  return String(s || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function assertWhy(id, text) {
  const n = wc(text);
  if (n < 40 || n > 60) throw new Error(`${id} why=${n}: ${text}`);
  const hits = bannedHits(text, { publicCopy: true, field: 'ember_verdict' });
  if (hits.length) throw new Error(`${id} banned ${hits.join('|')}: ${text}`);
  return text;
}

const feelPath = path.join(greenDir, 'ember_picks_34-36m_cat_feelings_faces_books.json');
const feel = JSON.parse(fs.readFileSync(feelPath, 'utf8'));
const feelWhy = {
  3: 'Mine fights need humour after a sticky playdate more than a talking-to. A funny short book gives you a shared joke to ease the evening without replaying the row. The kind of mine fight night story you may want to open more than once.',
  4: 'Holding a grudge is new at nearly three, and so is starting again. A Food Group story brings enough humour for repeat reads when the cross feeling has stuck. Stuck cross nights get a kind way back, without turning feelings into homework.',
};
for (const pick of feel.top_picks) {
  if (!feelWhy[pick.rank]) continue;
  pick.ember_verdict = assertWhy(`feelings#${pick.rank}`, feelWhy[pick.rank]);
}
fs.writeFileSync(feelPath, JSON.stringify(feel, null, 2) + '\n', 'utf8');
console.log('feelings: reset scrubbed');

const visPath = path.join(greenDir, 'ember_picks_34-36m_cat_visual_routine_cards.json');
const vis = JSON.parse(fs.readFileSync(visPath, 'utf8'));
const brand =
  'https://www.createvisualaids.co.uk/products/new-my-communication-book-for-early-years-settings-on-improved-materials';
const brandTimetable = 'https://www.createvisualaids.co.uk/products/visual-timetable-for-home-1';
const deadAmazon = 'https://www.amazon.co.uk/Create-Visual-Aids-My-Communication-Book/dp/B0CJ5QXG8L';
const timetableAmazon = 'https://www.amazon.co.uk/Create-Visual-Aids-communication-transition/dp/B093YJ5RL6';

for (const pick of vis.top_picks) {
  if (pick.rank === 1) {
    // Amazon returns bot-wall 200 — cannot substance-verify. Brand is the durable primary.
    pick.product_url = brandTimetable;
    pick.retailer = 'Create Visual Aids';
    pick.alternate_urls = [timetableAmazon];
    pick.url_verification = {
      checked_at: '2026-07-23',
      http_status_or_method: 'brand_primary_amazon_bot_wall',
      primary_opens_product: true,
    };
    pick.evidence_notes =
      (pick.evidence_notes || '') +
      ' Primary swapped to brand URL 2026-07-23: Amazon substance gate fails bot-wall stubs (HTTP 200 alone is not enough). Amazon kept as alternate for human Shopping.';
    console.log('visual#1 primary →', pick.product_url);
  }
  if (pick.rank !== 4) continue;
  pick.product_name = 'My Communication Book For Early Years Settings';
  pick.product_url = brand;
  pick.retailer = 'Create Visual Aids';
  pick.alternate_urls = [];
  pick.url_verification = {
    checked_at: '2026-07-23',
    http_status_or_method: 'brand_primary_amazon_asin_dead',
    primary_opens_product: true,
  };
  pick.evidence_notes =
    (pick.evidence_notes || '') +
    ' Amazon ASIN B0CJ5QXG8L no longer resolves to a buyable product (2026-07-23 founder report + Amazon search miss). Primary swapped to brand URL. Amazon primaries must pass substance gate (bot wall / soft-404 / stub), not HTTP 200 alone.';
  pick.founder_qa_flag = 'check_url';
  console.log('visual#4 primary →', pick.product_url);
}

for (const row of vis.longlist || []) {
  if (row.product_url === deadAmazon || Number(row.top_pick_rank) === 4) {
    row.product_url = brand;
    row.product_name = 'My Communication Book For Early Years Settings';
  }
  if (row.product_url === timetableAmazon || Number(row.top_pick_rank) === 1) {
    if (Number(row.top_pick_rank) === 1 || row.included_in_top_5) {
      row.product_url = brandTimetable;
    }
  }
}

fs.writeFileSync(visPath, JSON.stringify(vis, null, 2) + '\n', 'utf8');
console.log('visual: communication book primary fixed');
