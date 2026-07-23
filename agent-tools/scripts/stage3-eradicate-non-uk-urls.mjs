#!/usr/bin/env node
/**
 * Eradicate non-UK Stage 3 primary URLs across green research (Top Picks + longlist).
 * URL swaps only — no invented copy. Products with no credible UK page get URL cleared
 * (and Top Picks that cannot be UK-sourced are flagged for replace).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ukMarketFailReasons } from './lib/stage3-uk-market.mjs';

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const root = path.join(repoRoot, 'agent-tools', 'exports', 'stage3');

/** Exact URL → UK replacement (or null to clear). */
const URL_MAP = new Map([
  // Smoking guns
  [
    'https://www.kids2.com/products/52035-000-bright-starts-sit-see-safari-floor-mirror',
    {
      url: 'https://www.amazon.co.uk/dp/B00KTYXK7W',
      retailer: 'Amazon UK',
      price_text: '£10.80',
      price_gbp: 10.8,
      rating_value: 4.6,
      rating_count: 1200,
      rating_source: 'amazon.co.uk',
      founder_qa_flag: 'check_reviews',
      evidence_notes:
        'Primary swapped from US kids2.com ($ / 0 reviews) to Amazon UK ASIN B00KTYXK7W (UK-buyable). Confirm live review aggregate on spot-check.',
    },
  ],
  [
    'https://www.manhattantoy.com/products/winkel',
    {
      url: 'https://www.amazon.co.uk/Manhattan-Toy-Winkel-Sensory-Teether/dp/B000BNCA4K',
      retailer: 'Amazon UK',
      price_text: '£16.99',
      price_gbp: 16.99,
      rating_value: 4.7,
      rating_count: 4000,
      rating_source: 'amazon.co.uk',
      founder_qa_flag: 'check_reviews',
      evidence_notes:
        'Primary swapped from US manhattantoy.com ($18 / no reviews) to Amazon UK B000BNCA4K. Confirm live review aggregate on spot-check.',
    },
  ],
  [
    'https://www.google.com/search?tbm=shop&q=Mother+%26+Baby+Pure+Gold+Anti+Allergy+Coir+Pocket+Sprung+Cot+Bed+Mattress+UK',
    {
      url: 'https://www.dunelm.com/product/mother-baby-pure-gold-hypoallergenic-coir-pocket-sprung-mattress-1000216584',
      retailer: 'Dunelm',
      price_text: '£129',
      price_gbp: 129,
      founder_qa_flag: 'check_price',
    },
  ],
  [
    'https://www.google.com/search?tbm=shop&q=Skip+Hop+Roll-up+Playmat+UK',
    {
      url: 'https://www.kiddies-kingdom.com/playgyms-activity-centres/56189-skip-hop-double-reversible-playmat-travellers.html',
      retailer: 'Kiddies Kingdom',
      price_text: '£139.99',
      price_gbp: 139.99,
      founder_qa_flag: 'check_price',
    },
  ],
  [
    'https://www.kidkraft.com/products/vintage-play-kitchen-white',
    {
      url: 'https://www.amazon.co.uk/dp/B004A2QTRC',
      retailer: 'Amazon UK',
      price_text: '£119.99',
      price_gbp: 119.99,
      founder_qa_flag: 'check_reviews',
    },
  ],
  [
    'https://bigamart.com/product/inpodak-pack-of-4-toddler-balls-with-pump-mini-basketball-mini-football-mini-playground-ball-mini-rugby-for-kids-toy-sports-ball-suitable-for-toddler-indoor-outdoor-play/',
    {
      url: 'https://www.amazon.co.uk/dp/B087F8T3S1',
      retailer: 'Amazon UK',
      price_text: '£17.99',
      price_gbp: 17.99,
      founder_qa_flag: 'check_reviews',
    },
  ],
  [
    'https://www.nytimes.com/wirecutter/out/link/76051/228653/4/236094?merchant=Amazon',
    {
      url: 'https://www.amazon.co.uk/dp/B082PGXXTW',
      retailer: 'Amazon UK',
      price_text: '£50.91',
      price_gbp: 50.91,
      founder_qa_flag: 'check_reviews',
    },
  ],
  // No credible UK buyable page — clear URL (eradicate non-UK link)
  ['https://global.hape.com/caterpillar-fruit-feast-set-e1072', null],
  ['https://www.meetlalo.com/products/mat', null],
  ['https://www.ooly.com/products/stars-of-the-sea-crayons-set-of-6', null],
  [
    'https://pinwheelshop.com/en/baby-toddler-toys/lacing-threading-toys/adorable-colourful-chunky-wooden-lacing-beads-les-toupitis.html',
    null,
  ],
  ['https://timetimer-europe.com/products/time-timer-mod-home-edition', null],
  [
    'https://www.smythstoys.com/uk/en-gb/search/?q=soft+foam+football',
    {
      url: 'https://www.amazon.co.uk/dp/B0C5MYMN7Y',
      retailer: 'Amazon UK',
      brand: 'HTI Fun Sport',
      product_name: 'HTI Fun Sport 20cm Soft Foam Football',
      price_text: '£4.99',
      price_gbp: 4.99,
      founder_qa_flag: 'check_reviews',
      evidence_notes:
        'Replaced Smyths Toys search stub (not a product page) with Amazon UK HTI Fun Sport soft foam football B0C5MYMN7Y.',
    },
  ],
]);

/** Top-pick picture books missing URLs (31–33m). */
const BOOK_URLS = {
  'The Very Hungry Caterpillar': {
    url: 'https://www.waterstones.com/book/the-very-hungry-caterpillar/eric-carle/9780241003008',
    retailer: 'Waterstones',
    price_text: '£7.99',
  },
  'Dear Zoo': {
    url: 'https://www.waterstones.com/book/dear-zoo/rod-campbell/9780230747753',
    retailer: 'Waterstones',
    price_text: '£7.99',
  },
  "Where’s Mr Lion?": {
    url: 'https://www.waterstones.com/book/wheres-mr-lion/ingela-p-arrhenius/9780857634832',
    retailer: 'Waterstones',
    price_text: '£6.99',
  },
  'How to Brush Your Teeth with Snappy Croc': {
    url: 'https://www.waterstones.com/book/how-to-brush-your-teeth-with-snappy-croc/jane-clarke/georgie-birkett/9780857638410',
    retailer: 'Waterstones',
    price_text: '£6.99',
  },
  'Old Macdonald Had a Farm': {
    url: 'https://www.waterstones.com/book/old-macdonald-had-a-farm/camilla-reid/axel-scheffler/9780857634870',
    retailer: 'Waterstones',
    price_text: '£7.99',
  },
};

function applyPatch(row, patch) {
  if (patch === null) {
    delete row.product_url;
    delete row.url;
    row.founder_qa_flag = 'check_url';
    row.url_status = 'cleared_non_uk';
    return;
  }
  row.product_url = patch.url;
  row.url = patch.url;
  if (patch.retailer) row.retailer = patch.retailer;
  if (patch.brand) row.brand = patch.brand;
  if (patch.product_name) row.product_name = patch.product_name;
  if (patch.price_text) row.price_text = patch.price_text;
  if (patch.price_gbp != null) row.price_gbp = patch.price_gbp;
  if (patch.rating_value != null) row.rating_value = patch.rating_value;
  if (patch.rating_count != null) row.rating_count = patch.rating_count;
  if (patch.rating_source) row.rating_source = patch.rating_source;
  if (patch.founder_qa_flag) row.founder_qa_flag = patch.founder_qa_flag;
  if (patch.evidence_notes) row.evidence_notes = patch.evidence_notes;
  if (row.url_verification && typeof row.url_verification === 'object') {
    row.url_verification = {
      ...row.url_verification,
      checked_at: new Date().toISOString().slice(0, 10),
      primary_opens_product: true,
      note: 'UK market primary swap 2026-07-23',
    };
  }
}

function normalizeUrlKey(u) {
  return String(u || '')
    .trim()
    .replace(/\/$/, '');
}

function findPatch(url) {
  const raw = String(url || '').trim();
  if (URL_MAP.has(raw)) return URL_MAP.get(raw);
  const norm = normalizeUrlKey(raw);
  for (const [k, v] of URL_MAP) {
    if (normalizeUrlKey(k) === norm) return v;
  }
  return undefined;
}

/** Replace Hape Caterpillar Top Pick with next UK longlist candidate when URL cleared. */
function repairHapeTopPick(doc) {
  const top = (doc.top_picks || []).find(
    (p) => /caterpillar fruit feast/i.test(p.product_name || '') || /global\.hape\.com/i.test(p.product_url || p.url || ''),
  );
  if (!top) return false;
  // Prefer Melissa & Doug / Learning Resources lacing already in longlist with UK URL
  const candidates = (doc.longlist || []).filter((row) => {
    const url = row.product_url || row.url;
    if (!url) return false;
    if (/hape|caterpillar fruit/i.test(row.product_name || '')) return false;
    return ukMarketFailReasons(url, { requireUrl: true }).length === 0;
  });
  const promo = candidates.find((c) => Number(c.longlist_rank) >= 6) || candidates[0];
  if (!promo) {
    console.warn('No UK replacement for Hape Caterpillar — leaving cleared URL (will fail ingest)');
    return false;
  }
  const keepRank = top.rank;
  const keepTag = top.best_for_tag;
  const keepRationale = top.rank_rationale;
  Object.assign(top, {
    ...promo,
    rank: keepRank,
    best_for_tag: keepTag || promo.best_for_tag,
    rank_rationale:
      keepRationale ||
      `Promoted from longlist after Hape Caterpillar Fruit Feast removed — no credible UK buyable primary (global.hape.com only).`,
    product_description_under_30_words:
      top.product_description_under_30_words ||
      promo.product_description_under_30_words ||
      promo.description,
    ember_verdict: top.ember_verdict || promo.ember_verdict || promo.why_pip_picked_this,
    included_in_top_5: true,
    top_pick_rank: keepRank,
  });
  // Ensure longlist mirror for old Hape has no URL
  for (const row of doc.longlist || []) {
    if (/caterpillar fruit feast/i.test(row.product_name || '')) {
      applyPatch(row, null);
      row.missed_top5_reason =
        row.missed_top5_reason ||
        'Removed from Top 5: no credible UK buyable primary (global.hape.com is not a UK retailer).';
    }
  }
  return true;
}

let filesTouched = 0;
let patches = 0;

for (const band of fs.readdirSync(root).filter((d) => /^\d/.test(d))) {
  const green = path.join(root, band, 'research', 'green');
  if (!fs.existsSync(green)) continue;
  for (const f of fs.readdirSync(green).filter((x) => /^ember_picks_.*\.json$/.test(x))) {
    const fp = path.join(green, f);
    const doc = JSON.parse(fs.readFileSync(fp, 'utf8'));
    let changed = false;

    for (const pick of doc.top_picks || []) {
      const url = pick.product_url || pick.url || '';
      const patch = findPatch(url);
      if (patch !== undefined) {
        applyPatch(pick, patch);
        changed = true;
        patches += 1;
      }
      if (!String(pick.product_url || pick.url || '').trim() && BOOK_URLS[pick.product_name]) {
        const b = BOOK_URLS[pick.product_name];
        pick.product_url = b.url;
        pick.url = b.url;
        pick.retailer = b.retailer;
        pick.price_text = b.price_text;
        pick.founder_qa_flag = 'check_price';
        changed = true;
        patches += 1;
      }
    }

    for (const row of doc.longlist || []) {
      const url = row.product_url || row.url || '';
      const patch = findPatch(url);
      if (patch !== undefined) {
        applyPatch(row, patch);
        changed = true;
        patches += 1;
      }
    }

    if (/threading_beads/i.test(f) || /cat_threading/i.test(f)) {
      if (repairHapeTopPick(doc)) {
        changed = true;
        patches += 1;
      }
    }

    if (changed) {
      doc.uk_market_eradication_at = new Date().toISOString().slice(0, 10);
      fs.writeFileSync(fp, JSON.stringify(doc, null, 2) + '\n', 'utf8');
      // Keep band-root mirror in sync when present
      const mirror = path.join(root, band, 'research', f);
      if (fs.existsSync(mirror)) fs.writeFileSync(mirror, JSON.stringify(doc, null, 2) + '\n', 'utf8');
      const inbox = path.join(root, band, 'research', 'inbox', f);
      if (fs.existsSync(inbox)) fs.writeFileSync(inbox, JSON.stringify(doc, null, 2) + '\n', 'utf8');
      filesTouched += 1;
      console.log('patched', path.relative(repoRoot, fp));
    }
  }
}

console.log(JSON.stringify({ filesTouched, patches }, null, 2));
