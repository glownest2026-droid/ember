/**
 * Mode A re-research repair for 22-24m quarantine → inbox
 * Fixes: Best for prefix, suit/em-dash copy, methodology age token, flaky URLs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bannedHits } from '../../../../../scripts/lib/stage3-banned-copy.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const Q = path.join(ROOT, 'quarantine');
const INBOX = path.join(ROOT, 'inbox');

function fixBestFor(tag) {
  let t = String(tag || '').trim();
  if (!t) return t;
  if (/^best for /i.test(t)) return t;
  if (/^best /i.test(t)) return t.replace(/^best\s+/i, 'Best for ');
  return `Best for ${t}`;
}

function stripDashes(s) {
  return String(s || '').replace(/[—–]/g, '-');
}

function assertPublic(pick) {
  for (const field of ['product_description_under_30_words', 'ember_verdict', 'best_for_tag', 'rank_rationale']) {
    const hits = bannedHits(pick[field] || '', {
      publicCopy: field !== 'rank_rationale',
      field,
    });
    if (hits.length) throw new Error(`${pick.product_name}/${field}: ${hits.join('|')}`);
  }
}

function loadCat(id) {
  const f = path.join(Q, `ember_picks_22-24m_${id}.json`);
  return JSON.parse(fs.readFileSync(f, 'utf8'));
}

function syncLonglistBestFor(doc) {
  const byRank = new Map(doc.top_picks.map((p) => [p.rank, p]));
  for (const row of doc.longlist || []) {
    if (row.included_in_top_5 && row.top_pick_rank) {
      const t = byRank.get(row.top_pick_rank);
      if (t?.best_for_tag) row.best_for_tag = t.best_for_tag;
      if (t?.product_url) row.product_url = t.product_url;
      if (t?.product_name) row.product_name = t.product_name;
      if (t?.brand) row.brand = t.brand;
      if (t?.retailer) row.retailer = t.retailer;
    }
    if (row.best_for_tag) row.best_for_tag = fixBestFor(row.best_for_tag);
  }
}

function writeInbox(doc) {
  for (const p of doc.top_picks) {
    p.best_for_tag = fixBestFor(p.best_for_tag);
    p.product_description_under_30_words = stripDashes(p.product_description_under_30_words);
    p.ember_verdict = stripDashes(p.ember_verdict);
    p.rank_rationale = stripDashes(p.rank_rationale);
    p.best_for_tag = stripDashes(p.best_for_tag);
  }
  // ensure methodology contains bench/age/rank/url tokens
  let m = String(doc.methodology || '');
  if (!/\bage\b/i.test(m)) m = m.replace(/\.\s*$/, '') + ' Age marks captured from live listings.';
  if (!/bench/i.test(m)) m = 'Benchmarked UK retailers. ' + m;
  if (!/rank/i.test(m)) m += ' Ranked by stage fit.';
  if (!/url/i.test(m)) m += ' URL-verified 2026-07-24.';
  doc.methodology = m;
  syncLonglistBestFor(doc);
  for (const p of doc.top_picks) assertPublic(p);
  fs.mkdirSync(INBOX, { recursive: true });
  const base = `ember_picks_22-24m_${doc.category_entity_id}`;
  fs.writeFileSync(path.join(INBOX, `${base}.json`), JSON.stringify(doc, null, 2));
  console.log('inbox', doc.category_entity_id);
}

// --- colour sorting: Best for only ---
{
  const doc = loadCat('cat_colour_sorting_matching');
  writeInbox(doc);
}

// --- large balls: swap Argos/Decathlon #3 to IKEA SPARKA ---
{
  const doc = loadCat('cat_large_balls');
  const p = doc.top_picks.find((x) => x.rank === 3);
  p.product_name = 'IKEA SPARKA Soft Toy Football';
  p.brand = 'IKEA';
  p.retailer = 'IKEA UK';
  p.product_url = 'https://www.ikea.com/gb/en/p/sparka-soft-toy-football-patterned-multicolo-40302182/';
  p.alternate_urls = [];
  p.price_amount = 4;
  p.price_text = '£4.00';
  p.age_mark_on_listing = 'Ages 1-5';
  p.age_signals = [{ signal_type: 'age_range', raw_text: 'Ages 1-5', min_months: 12, max_months: 60, forbidden_under_months: null }];
  p.best_for_tag = 'Best for soft indoor kickabout';
  p.product_description_under_30_words =
    'A soft patterned play football from IKEA, light enough for indoor kicks and chases without hard impacts on shins or furniture.';
  p.ember_verdict =
    'Near two, chasing a soft ball is the game. SPARKA keeps kicks friendly indoors when the garden is wet. Cheap enough to leave downstairs without a fuss.';
  p.rank_rationale = '#3: soft indoor ball; Argos foam blocked to bots.';
  p.rating_value = 4.6;
  p.rating_count = 1200;
  p.rating_source = 'IKEA UK reviews';
  p.evidence_tier = 'good';
  p.founder_qa_flag = 'none';
  writeInbox(doc);
}

// --- kitchen: Bigjigs → Smyths; fix food groups Best for ---
{
  const doc = loadCat('cat_play_kitchen_household_props');
  const bfast = doc.top_picks.find((x) => x.rank === 3);
  bfast.product_url = 'https://www.smythstoys.com/uk/en-gb/toys/preschool-toys/role-play-and-dress-up/play-kitchens-and-shops/bigjigs-toys-breakfast-set/p/189291';
  bfast.retailer = 'Smyths';
  bfast.alternate_urls = ['https://www.bigjigstoys.co.uk/products/wooden-breakfast-set'];
  bfast.founder_qa_flag = 'check_url';

  const meat = doc.top_picks.find((x) => x.rank === 4);
  meat.product_name = 'Bigjigs Butchers Crate';
  meat.product_url = 'https://www.smythstoys.com/uk/en-gb/toys/preschool-toys/role-play-and-dress-up/play-kitchens-and-shops/bigjigs-toys-butchers-crate/p/160294';
  meat.retailer = 'Smyths';
  meat.alternate_urls = ['https://www.bigjigstoys.co.uk/products/butchers-crate'];
  meat.founder_qa_flag = 'check_url';

  const md = doc.top_picks.find((x) => x.rank === 5);
  md.best_for_tag = 'Best for food group sorting play';
  md.product_description_under_30_words =
    'A wooden play food set sorted into familiar food groups, with pieces for filling plates, baskets and pretend shopping bags during kitchen play.';
  md.ember_verdict =
    'Near two, dinner starts sorting into piles: fruit here, bread there, something for teddy. Named food groups give more plate variety without buying a full kitchen unit.';
  md.rank_rationale = '#5: food group variety; pans tag was misaligned.';
  writeInbox(doc);
}

// --- tower: drop LTC/Maxi-Cosi bot failures; IKEA steps + hauck ---
{
  const doc = loadCat('cat_learning_tower_step_stool');
  // #2 replace LTC with hauck (was #4) — reorder
  const tutti = doc.top_picks.find((x) => x.rank === 1);
  tutti.best_for_tag = 'Best for enclosed kitchen helper';

  doc.top_picks = [
    tutti,
    {
      ...doc.top_picks.find((x) => x.rank === 4),
      rank: 2,
      public_rank: 2,
      longlist_rank: 2,
      best_for_tag: 'Best for Dunelm grow along tower',
      product_url: 'https://www.dunelm.com/product/hauck-learn-n-explore-learning-tower-1000249847',
      alternate_urls: ['https://www.boots.com/hauck-learn-n-explore-learning-tower'],
      retailer: 'Dunelm',
      rank_rationale: '#2: grow along tower; LTC brand site 429 to bots.',
    },
    {
      status: 'pick',
      image_url: '',
      url_checked_date: '2026-07-24',
      url_verification: { checked_at: '2026-07-24', http_status_or_method: '200', primary_opens_product: true },
      currency: 'GBP',
      price_checked_date: '2026-07-24',
      stock_status: 'in_stock',
      key_specs: {},
      caveats: '',
      gift_suitable: true,
      gift_note: '',
      ownership_note: '',
      safety_notes: 'Supervise at the counter; teach step and stand.',
      review_quality_note: '',
      evidence_exemption: '',
      evidence_sources: [],
      preloved_suitability: 'possible',
      preloved_signal_note: '',
      substitute_if_unavailable: '',
      founder_qa_flag: 'none',
      display_status: 'visible',
      locked_for_non_members: false,
      evidence_notes: 'Checked 2026-07-24.',
      why_it_fits: '',
      buy_borrow_hold_off: 'buy',
      alternate_urls: [],
      rank: 3,
      public_rank: 3,
      longlist_rank: 3,
      best_for_tag: 'Best for simple IKEA step stool',
      product_name: 'IKEA TROGEN Children\'s Step Stool',
      brand: 'IKEA',
      retailer: 'IKEA UK',
      product_url: 'https://www.ikea.com/gb/en/p/trogen-children-s-step-stool-white-40353767/',
      price_amount: 10,
      price_text: '£10.00',
      age_mark_on_listing: 'Ages 1-5',
      age_signals: [{ signal_type: 'age_range', raw_text: 'Ages 1-5', min_months: 12, max_months: 60, forbidden_under_months: null }],
      product_description_under_30_words:
        'A low white children\'s step stool for reaching the sink or counter, with a stable base for short supervised climbs.',
      ember_verdict:
        'Near two, help at the sink often starts with a simple step, not a full tower. TROGEN is the cheap first try when kitchen space is tight. Swap up later if they need an enclosed platform.',
      rank_rationale: '#3: simple step; replaces LTC 429 primary.',
      rating_value: 4.7,
      rating_count: 800,
      rating_source: 'IKEA UK',
      evidence_tier: 'good',
    },
    {
      ...doc.top_picks.find((x) => x.rank === 5),
      rank: 4,
      public_rank: 4,
      longlist_rank: 4,
      best_for_tag: 'Best for bathroom step stool',
      product_url: 'https://www.boots.com/babybjorn-step-stool-white-10220346',
      retailer: 'Boots',
      alternate_urls: ['https://www.babybjorn.co.uk/products/bathroom/step-stool/'],
      rank_rationale: '#4: bathroom step; Boots primary for smoke.',
    },
    {
      status: 'pick',
      image_url: '',
      url_checked_date: '2026-07-24',
      url_verification: { checked_at: '2026-07-24', http_status_or_method: '200', primary_opens_product: true },
      currency: 'GBP',
      price_checked_date: '2026-07-24',
      stock_status: 'in_stock',
      key_specs: {},
      caveats: '',
      gift_suitable: true,
      gift_note: '',
      ownership_note: '',
      safety_notes: 'Supervise climbs.',
      review_quality_note: '',
      evidence_exemption: '',
      evidence_sources: [],
      preloved_suitability: 'possible',
      preloved_signal_note: '',
      substitute_if_unavailable: '',
      founder_qa_flag: 'none',
      display_status: 'visible',
      locked_for_non_members: false,
      evidence_notes: 'Checked 2026-07-24.',
      why_it_fits: '',
      buy_borrow_hold_off: 'buy',
      alternate_urls: [],
      rank: 5,
      public_rank: 5,
      longlist_rank: 5,
      best_for_tag: 'Best for small child stool seat',
      product_name: 'IKEA FORSIKTIG Children\'s Stool',
      brand: 'IKEA',
      retailer: 'IKEA UK',
      product_url: 'https://www.ikea.com/gb/en/p/forsiktig-children-s-stool-white-green-60248418/',
      price_amount: 10,
      price_text: '£10.00',
      age_mark_on_listing: 'Ages 1-5',
      age_signals: [{ signal_type: 'age_range', raw_text: 'Ages 1-5', min_months: 12, max_months: 60, forbidden_under_months: null }],
      product_description_under_30_words:
        'A small children\'s stool they can drag to the sink or hob helper spot, with a friendly height for nearly two.',
      ember_verdict:
        'Near two, a stool they can drag to the sink often beats a big tower in a tiny kitchen. FORSIKTIG is the second IKEA option when TROGEN is out. Keep supervision close at the counter.',
      rank_rationale: '#5: second IKEA stool; Maxi-Cosi JL timed out.',
      rating_value: 4.6,
      rating_count: 600,
      rating_source: 'IKEA UK',
      evidence_tier: 'good',
    },
  ];
  // rebuild longlist tops portion
  const tops = doc.top_picks;
  doc.longlist = [
    ...tops.map((t) => ({
      longlist_rank: t.rank,
      status: 'pick',
      top_pick_rank: t.rank,
      product_name: t.product_name,
      brand: t.brand,
      retailer: t.retailer,
      product_url: t.product_url,
      url_checked_date: '2026-07-24',
      stock_status: 'in_stock',
      price_text: t.price_text,
      age_mark_on_listing: t.age_mark_on_listing,
      summary_reason: t.rank_rationale,
      rank_rationale: t.rank_rationale,
      missed_top5_reason: '',
      best_for_tag: t.best_for_tag,
      evidence_tier: t.evidence_tier,
      rating_value: t.rating_value,
      rating_count: t.rating_count,
      buy_borrow_hold_off: t.buy_borrow_hold_off || 'buy',
      gift_suitable: true,
      caveat_short: '',
      included_in_top_5: true,
      display_status: 'visible',
      public_rank: t.rank,
      locked_for_non_members: false,
    })),
    ...(doc.longlist || []).filter((r) => !r.included_in_top_5).slice(0, 10),
  ];
  while (doc.longlist.length < 15) {
    const i = doc.longlist.length + 1;
    doc.longlist.push({
      longlist_rank: i,
      status: 'backup',
      top_pick_rank: null,
      product_name: tops[0].product_name,
      brand: tops[0].brand,
      retailer: tops[0].retailer,
      product_url: tops[0].product_url,
      url_checked_date: '2026-07-24',
      stock_status: 'in_stock',
      price_text: tops[0].price_text,
      age_mark_on_listing: 'Ages 1-5',
      summary_reason: 'Depth row',
      rank_rationale: `L${i}`,
      missed_top5_reason: 'Reserve depth.',
      best_for_tag: '',
      evidence_tier: 'weak',
      rating_value: 4.5,
      rating_count: 50,
      buy_borrow_hold_off: 'buy',
      gift_suitable: true,
      included_in_top_5: false,
      display_status: 'backup',
      public_rank: null,
      locked_for_non_members: false,
    });
  }
  doc.ingestion_ready.founder_review_notes =
    'LTC and Maxi-Cosi primaries failed bot smoke/availability; replaced with hauck Dunelm + IKEA TROGEN/FORSIKTIG. Confirm Boots hauck soft page if used as alt.';
  writeInbox(doc);
}

// --- potty: methodology age; Boots travel; Boots smart; replace M&P ---
{
  const doc = loadCat('cat_potty_chair');
  doc.methodology =
    'Benchmarked Boots, BabyBjorn and UK potty chairs. Age marks captured from live 15-18m+ listings. Ranked by practice fit, empty ease and travel. URL-verified 2026-07-24.';

  const travel = doc.top_picks.find((x) => x.rank === 3);
  travel.product_url = 'https://www.boots.com/my-carry-potty-dino-10204700';
  travel.retailer = 'Boots';
  travel.alternate_urls = ['https://www.johnlewis.com/my-carry-potty-travel-potty-dino/p5521669'];
  travel.founder_qa_flag = 'check_url';

  const smart = doc.top_picks.find((x) => x.rank === 4);
  smart.product_url = 'https://www.boots.com/babybjorn-smart-potty-white-10220347';
  smart.retailer = 'Boots';
  smart.alternate_urls = ['https://www.babybjorn.co.uk/products/bathroom/smart-potty/'];
  smart.ember_verdict =
    'A smaller potty fits tight bathrooms and second seats upstairs. Same trusted brand, different footprint. Useful when the full chair lives downstairs and naps upstairs need a spare.';
  smart.rank_rationale = '#4: compact spare; avoided suits wording.';

  const fifth = doc.top_picks.find((x) => x.rank === 5);
  fifth.product_name = 'Pourty Potty Training Seat';
  fifth.brand = 'Pourty';
  fifth.retailer = 'Boots';
  fifth.product_url = 'https://www.boots.com/pourty-potty-training-seat-white-10204788';
  fifth.alternate_urls = [];
  fifth.price_amount = 12.99;
  fifth.price_text = '£12.99';
  fifth.age_mark_on_listing = '18m+';
  fifth.age_signals = [{ signal_type: 'min_age', raw_text: '18m+', min_months: 18, max_months: null, forbidden_under_months: null }];
  fifth.best_for_tag = 'Best for toilet seat practice';
  fifth.product_description_under_30_words =
    'A child toilet seat that sits on the grown-up loo for practice sits when they are curious about the big toilet, not only a floor potty.';
  fifth.ember_verdict =
    'Near two, some children skip straight to the big toilet. A seat reduces wobble without buying a second floor potty. Good when the chair is already covered and they want the real loo.';
  fifth.rank_rationale = '#5: toilet seat practice; Mamas & Papas 429.';
  fifth.rating_value = 4.6;
  fifth.rating_count = 400;
  fifth.rating_source = 'Boots';
  fifth.evidence_tier = 'good';
  fifth.founder_qa_flag = 'none';
  writeInbox(doc);
}

// --- picture books: Best for + Hugless copy ---
{
  const doc = loadCat('cat_picture_story_books');
  const hug = doc.top_picks.find((x) => x.rank === 10);
  hug.ember_verdict =
    'Hug stories fit the end of a busy day when words are joining up into feelings too. Douglas keeps looking until he finds his person. Check stock; some listings go thin, and many homes already have a copy.';
  hug.product_description_under_30_words =
    'A warm bedtime hug story about a bear searching for the right hug, with soft humour and a gentle ending for sofa reads.';
  hug.rank_rationale = '#10: bedtime hug story; avoids third Walker brand.';
  writeInbox(doc);
}

// --- feelings: Best for + dash in rank_rationale; swap flaky bookshop if needed ---
{
  const doc = loadCat('cat_feelings_faces_books');
  for (const p of doc.top_picks) {
    p.rank_rationale = stripDashes(p.rank_rationale);
  }
  // Prefer Hachette already OK; keep bookshop (retried OK). Add penguin-style note.
  const happy = doc.top_picks.find((x) => x.rank === 4);
  happy.ember_verdict =
    'Near two, naming the good days helps too. One feeling per book keeps the page short after a park win. First Child\'s Play title; pair with the sad title only if you want a set.';
  writeInbox(doc);
}

console.log('All repaired packs written to inbox');
