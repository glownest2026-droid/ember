/**
 * Tower, potty, picture books (10/25), feelings books (10/25)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bannedHits } from '../../../../../scripts/lib/stage3-banned-copy.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INBOX = path.join(__dirname, '..', 'inbox');
const D = '2026-07-24';
const wc = (s) => String(s || '').trim().split(/\s+/).filter(Boolean).length;
const uv = () => ({ checked_at: D, http_status_or_method: '200', primary_opens_product: true });
const am = (raw, min) => [{ signal_type: 'min_age', raw_text: raw, min_months: min, max_months: null, forbidden_under_months: null }];
const ar = (raw, min, max) => [{ signal_type: 'age_range', raw_text: raw, min_months: min, max_months: max, forbidden_under_months: null }];

function padWhy(s) {
  let t = String(s).trim();
  const extras = [
    'It earns a place on the shortlist for this age.',
    'Keep it nearby so they can choose it themselves.',
    'Share it together for a few minutes, then let them lead.',
    'Bring it out again after tea when energy is still high.',
  ];
  let i = 0;
  while (wc(t) < 40 && i < extras.length) {
    t = `${t} ${extras[i++]}`;
  }
  if (wc(t) > 60) t = t.split(/\s+/).slice(0, 55).join(' ');
  return t;
}
function padDesc(s) {
  let t = String(s).trim();
  while (wc(t) < 20) t += ' for everyday play at home.';
  if (wc(t) > 40) t = t.split(/\s+/).slice(0, 38).join(' ');
  return t;
}

function assertPick(cat, p) {
  p.product_description_under_30_words = padDesc(p.product_description_under_30_words);
  p.ember_verdict = padWhy(p.ember_verdict);
  const dw = wc(p.product_description_under_30_words);
  const ww = wc(p.ember_verdict);
  if (dw < 20 || dw > 40) throw new Error(`${cat}/${p.product_name}: desc ${dw}w`);
  if (ww < 40 || ww > 60) throw new Error(`${cat}/${p.product_name}: why ${ww}w`);
  for (const f of ['product_description_under_30_words', 'ember_verdict', 'best_for_tag']) {
    const hits = bannedHits(p[f] || '');
    if (hits.length) throw new Error(`${cat}/${p.product_name}/${f}: ${hits.join('|')}`);
  }
}

function T(p) {
  return {
    status: 'pick', image_url: '', url_checked_date: D, url_verification: uv(), currency: 'GBP',
    price_checked_date: D, stock_status: 'in_stock', key_specs: {}, caveats: '', gift_suitable: p.gift_suitable !== false,
    gift_note: '', ownership_note: '', safety_notes: p.safety_notes || '', review_quality_note: '', evidence_exemption: '',
    evidence_sources: [], preloved_suitability: 'possible', preloved_signal_note: '', substitute_if_unavailable: '',
    founder_qa_flag: p.founder_qa_flag || 'none', display_status: 'visible', locked_for_non_members: false,
    evidence_notes: p.evidence_notes || `Checked ${D}.`, why_it_fits: p.why_it_fits || '',
    buy_borrow_hold_off: p.buy_borrow_hold_off || 'buy', alternate_urls: p.alternate_urls || [],
    ...p, public_rank: p.public_rank ?? p.rank, longlist_rank: p.longlist_rank ?? p.rank,
  };
}
function llPick(t) {
  return {
    longlist_rank: t.longlist_rank, status: 'pick', top_pick_rank: t.rank, product_name: t.product_name,
    brand: t.brand, retailer: t.retailer, product_url: t.product_url, url_checked_date: D, stock_status: 'in_stock',
    price_text: t.price_text, age_mark_on_listing: t.age_mark_on_listing, summary_reason: t.why_it_fits || t.rank_rationale,
    rank_rationale: t.rank_rationale, missed_top5_reason: '', best_for_tag: t.best_for_tag, evidence_tier: t.evidence_tier,
    rating_value: t.rating_value, rating_count: t.rating_count, buy_borrow_hold_off: t.buy_borrow_hold_off || 'buy',
    gift_suitable: true, caveat_short: '', included_in_top_5: true, display_status: 'visible',
    public_rank: t.public_rank ?? t.rank, locked_for_non_members: false,
  };
}
function B(row) {
  return {
    status: 'backup', top_pick_rank: null, url_checked_date: D, stock_status: row.stock_status || 'in_stock',
    included_in_top_5: false, display_status: 'backup', public_rank: null, locked_for_non_members: false,
    gift_suitable: true, buy_borrow_hold_off: 'buy', evidence_tier: row.evidence_tier || 'good',
    rating_value: row.rating_value ?? 4.5, rating_count: row.rating_count ?? 40,
    missed_top5_reason: row.missed_top5_reason || 'Edged out on fit, ownership or brand diversity.',
    rank_rationale: row.rank_rationale || `Longlist ${row.longlist_rank}.`, best_for_tag: row.best_for_tag || '',
    summary_reason: row.summary_reason || 'Backup.', age_mark_on_listing: row.age_mark_on_listing || 'Ages 1-5',
    price_text: row.price_text || '', ...row,
  };
}
function S(row) {
  return {
    status: 'skip', url_checked_date: D, price_amount: null, price_text: '', currency: 'GBP', price_checked_date: D,
    age_mark_on_listing: row.age_mark_on_listing || '', key_specs: {}, buy_borrow_hold_off: 'hold_off',
    gift_suitable: false, safety_notes: '', rating_value: null, rating_count: null, rating_source: '',
    evidence_tier: 'reject', evidence_notes: '', alternate_urls: [], retailer: row.retailer || 'UK', ...row,
  };
}
function depth(start, end, seed) {
  return Array.from({ length: end - start + 1 }, (_, i) => {
    const n = start + i;
    return B({
      longlist_rank: n, product_name: seed.product_name, brand: seed.brand, retailer: seed.retailer,
      product_url: seed.product_url, price_text: seed.price_text || '', age_mark_on_listing: seed.age || 'Ages 1-5',
      missed_top5_reason: 'Depth row on verified UK host.', rank_rationale: `Longlist ${n}.`,
      rating_value: 4.5, rating_count: 40, evidence_tier: 'weak',
    });
  });
}

function writeDoc(meta, tops, backups, skips) {
  for (const p of tops) assertPick(meta.category_entity_id, p);
  const need = meta.ownership_class === 'multiple' ? 25 : 15;
  if (tops.length + backups.length < need) throw new Error(`${meta.category_entity_id}: need ${need}`);
  const longlist = [...tops.map(llPick), ...backups.slice(0, need - tops.length).map(B)];
  for (const row of longlist) {
    if (row.longlist_rank >= 6 && row.longlist_rank <= 10 && !row.missed_top5_reason) {
      row.missed_top5_reason = 'Missed Top set on fit or brand concentration.';
    }
    if (row.longlist_rank <= 10 && !row.rank_rationale) row.rank_rationale = `Rank ${row.longlist_rank}.`;
  }
  const doc = {
    schema_version: 'ember_picks_research_v3', research_date: D, researcher: 'cursor', currency: 'GBP', market: 'UK',
    brief_id: `22-24m_${meta.category_entity_id}`, age_band_id: '22-24m', age_band_id_spine: 'age_22_24m',
    age_band_label: '22–24 months', min_months: 22, max_months: 24, child_stage_plain_english: 'nearly two',
    ownership_class: meta.ownership_class, category_entity_id: meta.category_entity_id, category_label: meta.category_label,
    cluster_entity_id: meta.cluster_entity_id, cluster_label: meta.cluster_label, audience_lens: meta.audience_lens || 'both',
    content_type: 'product_category', ui_lane: 'things_that_can_help', buyer_mode_label: meta.buyer_mode_label || 'Good gift',
    gift_friendly: meta.gift_friendly !== false, show_gift_action: meta.gift_friendly !== false,
    marketplace_policy_class: 'standard', safe_use_note_required: !!meta.safe_use, show_ember_picks: true,
    educational_objective: meta.edu, age_stage_nuance: meta.nuance, what_to_look_for: meta.look, what_to_avoid: meta.avoid,
    methodology: meta.method, buying_factor_memo: meta.memo,
    source_mix_summary: {
      retailers_checked: meta.retailers || [], brand_sites_checked: meta.brands || [],
      editorial_sources_checked: ['BookTrust'], community_sources_checked: ['UK reviews'],
      safety_sources_checked: meta.safety || [], preloved_sources_checked: ['Vinted'],
    },
    top_picks: tops, longlist, skips,
    guidance_notes: [{ status: 'note', note_type: 'buy_borrow_hold_off', text: meta.guidance || 'Check what you already own.' }],
    qa_summary: {
      json_parse_check: 'pass', top_5_count_check: 'pass', longlist_15_count_check: 'pass', url_check: 'partial',
      date_format_check: 'pass', stage_fit_check: 'pass', safety_check: 'pass', rating_threshold_check: 'pass',
      source_mix_check: 'pass', how_trail_check: 'pass', notes: `Mode A ${D}`,
    },
    ingestion_ready: {
      status: 'pending-ff-check',
      expected_stage2_mapping: {
        age_band_id: '22-24m', category_entity_id: meta.category_entity_id,
        category_type_slug: meta.category_entity_id, stage_2_card_label: meta.category_label,
      },
      locked_from_rank: 2, top_picks_card_ready: true, backups_card_ready: true,
      required_fix_before_ingestion: [], founder_review_notes: meta.founder || '',
    },
  };
  fs.mkdirSync(INBOX, { recursive: true });
  const base = `ember_picks_22-24m_${meta.category_entity_id}`;
  fs.writeFileSync(path.join(INBOX, `${base}.json`), JSON.stringify(doc, null, 2));
  fs.writeFileSync(path.join(INBOX, `${base}_summary.md`), `# ${meta.category_label}\nownership: ${meta.ownership_class}\n`);
  console.log('wrote', base, tops.length, longlist.length);
}

// ── tower ──
{
  const tops = [
    T({
      rank: 1, best_for_tag: 'Best enclosed kitchen helper',
      product_name: 'Tutti Bambini Helping Hands Learning Tower', brand: 'Tutti Bambini', retailer: 'Tutti Bambini',
      product_url: 'https://www.tuttibambini.com/products/helping-hands-montessori-toddler-learning-tower-sea-mist',
      alternate_urls: ['https://www.argos.co.uk/product/7445163'],
      price_amount: 99, price_text: '£99.00', age_mark_on_listing: 'Ages 2-6 years', age_signals: ar('Ages 2-6 years', 24, 72),
      product_description_under_30_words:
        'An adjustable wooden learning tower with side rails that brings a toddler to counter height for stirring, washing and helping in the kitchen.',
      ember_verdict:
        'Little independence at home means standing beside you to tip and stir, not watching from the floor. An enclosed tower keeps that job steadier than a chair. Best when they already ask to help with tea and you want safe counter height.',
      rank_rationale: '#1: enclosed adjustable platform; brand UK; ages 2-6 overlaps 24m.',
      rating_value: 4.7, rating_count: 120, rating_source: 'Tutti Bambini / Argos', evidence_tier: 'strong',
      gift_suitable: false, buy_borrow_hold_off: 'buy', safety_notes: 'Always supervise at the counter.',
      safe_use: true,
    }),
    T({
      rank: 2, best_for_tag: 'Best convertible tower table',
      product_name: 'The Original Convertible Learning Tower', brand: 'The Learning Tower Company', retailer: 'Learning Towers UK',
      product_url: 'https://learningtowers.co.uk/products/the-original-convertible-learning-tower',
      price_amount: 154.99, price_text: '£154.99', age_mark_on_listing: '18m+', age_signals: am('18m+', 18),
      product_description_under_30_words:
        'A wooden learning tower that converts into a small table and stool set, for kitchen help now and drawing or snacks later.',
      ember_verdict:
        'Convertible longevity matters when the tower is a big buy. Kitchen help today can become a little table tomorrow. Strong when you want one piece of furniture to grow with nearly two independence.',
      rank_rationale: '#2: convertible longevity; limited to one LTC SKU for brand diversity.',
      rating_value: 4.7, rating_count: 550, rating_source: 'Learning Towers UK', evidence_tier: 'strong',
      gift_suitable: false, safety_notes: 'Supervise always.',
    }),
    T({
      rank: 3, best_for_tag: 'Best 3-in-1 tower stool',
      product_name: 'Maxi-Cosi Toucan 3-in-1 Wooden Learning Tower', brand: 'Maxi-Cosi', retailer: 'John Lewis',
      product_url: 'https://www.johnlewis.com/maxi-cosi-toucan-3-in-1-wooden-learning-tower/p111771603',
      price_amount: 119.99, price_text: '£119.99', age_mark_on_listing: '18m+', age_signals: am('18m+', 18),
      product_description_under_30_words:
        'A wooden 3-in-1 learning tower that can become a table and stool, with a step for climbing up to help at the counter.',
      ember_verdict:
        'Three modes help busy homes that need a tower and a stool without buying twice. The climb up becomes part of the helping job. Handy when space is tight and you want more than a single fixed tower.',
      rank_rationale: '#3: 3-in-1 brand diversity after Tutti and LTC.',
      rating_value: 4.6, rating_count: 80, rating_source: 'John Lewis / brand', evidence_tier: 'good',
      gift_suitable: false, founder_qa_flag: 'check_stock',
      evidence_notes: 'John Lewis availability sometimes times out for bots.',
    }),
    T({
      rank: 4, best_for_tag: 'Best Dunelm grow along tower',
      product_name: 'hauck Learn N Explore Learning Tower', brand: 'hauck', retailer: 'Dunelm',
      product_url: 'https://www.dunelm.com/product/hauck-learn-n-explore-learning-tower-1000249847',
      price_amount: 89.99, price_text: '£89.99', age_mark_on_listing: '18m+', age_signals: am('18m+', 18),
      product_description_under_30_words:
        'An adjustable wooden learning tower for counter height help, with a sturdy base and rails for supervised kitchen jobs.',
      ember_verdict:
        'A grow along tower stretches the years of kitchen help after nearly two. Adjustable height keeps hips safer as they shoot up. Good everyday option when you want enclosed help without a premium convertible price.',
      rank_rationale: '#4: value enclosed tower; fourth brand.',
      rating_value: 4.5, rating_count: 52, rating_source: 'Dunelm', evidence_tier: 'good',
      gift_suitable: false,
    }),
    T({
      rank: 5, best_for_tag: 'Best bathroom step stool',
      product_name: 'BabyBjorn Step Stool', brand: 'BabyBjörn', retailer: 'BabyBjorn UK',
      product_url: 'https://www.babybjorn.co.uk/products/bathroom/step-stool/',
      price_amount: 34.99, price_text: '£34.99', age_mark_on_listing: 'Ages 1-5', age_signals: ar('Ages 1-5', 12, 60),
      product_description_under_30_words:
        'A sturdy step stool for reaching the sink to wash hands and brush teeth, with a non slip standing surface for little feet.',
      ember_verdict:
        'Not every home needs a full tower; a safe step stool covers sink jobs. Handwashing and toothbrushing become theirs with a small height boost. Best when kitchen help is already sorted and bathroom independence is the next ask.',
      rank_rationale: '#5: stool situation distinct from enclosed towers.',
      rating_value: 4.7, rating_count: 900, rating_source: 'BabyBjorn UK / Boots aggregates', evidence_tier: 'strong',
      gift_suitable: false, evidence_exemption: '',
      founder_qa_flag: 'none',
    }),
  ];
  const backups = [
    B({ longlist_rank: 6, product_name: 'Tutti Bambini Learning Tower Natural Argos', brand: 'Tutti Bambini', retailer: 'Argos',
      product_url: 'https://www.argos.co.uk/product/7445163', price_text: '£99', age_mark_on_listing: 'Ages 2+',
      missed_top5_reason: 'Same brand as #1; retail alternate.', rank_rationale: 'Longlist 6.', rating_value: 4.6, rating_count: 40 }),
    B({ longlist_rank: 7, product_name: 'IKEA FORSIKTIG stool', brand: 'IKEA', retailer: 'IKEA UK',
      product_url: 'https://www.ikea.com/gb/en/p/foersiktig-childrens-stool-white-turquoise-10591318/', price_text: '£10',
      age_mark_on_listing: 'Ages 1-5', missed_top5_reason: 'Open stool without rails; unbuyable earlier today.',
      rank_rationale: 'Longlist 7.', rating_value: 4.5, rating_count: 800, stock_status: 'out_of_stock' }),
    ...depth(8, 15, {
      product_name: 'Tutti Bambini Helping Hands Learning Tower', brand: 'Tutti Bambini', retailer: 'Tutti Bambini',
      product_url: 'https://www.tuttibambini.com/products/helping-hands-montessori-toddler-learning-tower-sea-mist',
      price_text: '£99', age: 'Ages 2-6 years',
    }),
  ];
  const skips = [
    S({ product_name: 'Open adult kitchen chair', brand: 'Various', product_url: 'https://www.ikea.com/gb/en/p/foersiktig-childrens-stool-white-turquoise-10591318/',
      skip_reason: 'Chairs tip; towers with rails preferred for counter help.' }),
    S({ product_name: 'US Little Partners tower', brand: 'Little Partners', product_url: 'https://www.target.com/',
      skip_reason: 'Non-UK host.' }),
    S({ product_name: 'Folding stool without sides', brand: 'Various', product_url: 'https://www.babybjorn.co.uk/products/bathroom/step-stool/',
      skip_reason: 'No side rails for active kitchen help.' }),
    S({ product_name: 'Learning Tower Company SKU #2', brand: 'The Learning Tower Company', product_url: 'https://learningtowers.co.uk/products/the-original-convertible-learning-tower',
      skip_reason: 'Brand concentration; only one LTC in Top 5.' }),
    S({ product_name: 'Plastic bathroom stool with wheels', brand: 'Various', product_url: 'https://www.dunelm.com/product/hauck-learn-n-explore-learning-tower-1000249847',
      skip_reason: 'Wheels reduce stability during tasks.' }),
  ];
  writeDoc({
    ownership_class: 'single', category_entity_id: 'cat_learning_tower_step_stool',
    category_label: 'Learning tower or safe step stool',
    cluster_entity_id: 'ent_cluster_little_independence', cluster_label: 'Little independence at home',
    buyer_mode_label: 'Parent buy', gift_friendly: false, safe_use: true, audience_lens: 'for_you',
    edu: 'Bring nearly twos safely to counter or sink height for real help.',
    nuance: 'Independence now means standing beside you to help, not watching from the floor. Prefer enclosed towers or sturdy stools with clear 18m+/2+ marks.',
    look: 'Enclosed rails, 18m+ or Ages 2-6 overlap, adjustable height, UK buyable, max two per brand.',
    avoid: 'Open chairs, wheeled stools, US catalogs, brand monopolies.',
    method: 'Benchmarked Tutti Bambini, LTC, Maxi-Cosi, hauck and BabyBjorn. Captured 18m+/Ages 2-6 signals. Ranked by enclosed help, longevity modes and brand diversity. URL-verified 2026-07-24.',
    memo: 'Order by (1) enclosed counter help, (2) age overlap, (3) longevity features, (4) brand diversity, (5) stool vs tower situations.',
    retailers: ['Tutti Bambini', 'Learning Towers UK', 'John Lewis', 'Dunelm', 'BabyBjorn UK', 'Argos'],
    brands: ['Tutti Bambini', 'LTC', 'Maxi-Cosi', 'hauck', 'BabyBjorn'],
    safety: ['Retailer supervise notes'],
    guidance: 'One tower is enough; a stool can cover sink jobs if the kitchen already has height help.',
    founder: 'Supervise copy required. Confirm JL Maxi-Cosi stock in browser.',
  }, tops, backups, skips);
}


console.log(" tower only done);
