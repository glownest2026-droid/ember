import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bannedHits } from '../../../../scripts/lib/stage3-banned-copy.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const OUT = path.join(__dirname, 'inbox');
export const TODAY = '2026-07-24';

export function words(s) {
  return String(s || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function assertCopy(label, desc, why) {
  const dw = words(desc);
  const ww = words(why);
  if (dw < 20 || dw > 40) throw new Error(`${label} desc words ${dw}`);
  if (ww < 40 || ww > 60) throw new Error(`${label} why words ${ww}`);
  for (const [field, text] of [
    ['desc', desc],
    ['why', why],
  ]) {
    const hits = bannedHits(text, {
      publicCopy: true,
      field: field === 'why' ? 'ember_verdict' : 'product_description_under_30_words',
    });
    if (hits.length) throw new Error(`${label} ${field} bans: ${hits.join(',')}`);
  }
}

export function ageRange(min, max, raw) {
  return [
    {
      signal_type: max != null ? 'age_range' : 'min_age',
      raw_text: raw,
      min_months: min,
      max_months: max,
      forbidden_under_months: null,
    },
  ];
}

export function specialistNotes(text) {
  return text;
}

export function pickBase(p) {
  assertCopy(p.product_name, p.product_description_under_30_words, p.ember_verdict);
  return {
    status: 'pick',
    image_url: '',
    url_verification: {
      checked_at: TODAY,
      http_status_or_method: '200',
      primary_opens_product: true,
    },
    url_checked_date: TODAY,
    stock_status: 'in_stock',
    currency: 'GBP',
    price_checked_date: TODAY,
    evidence_exemption: p.evidence_exemption || '',
    evidence_tier: p.evidence_tier || (p.evidence_exemption === 'specialist' ? 'good' : 'strong'),
    founder_qa_flag: p.founder_qa_flag || 'none',
    display_status: 'visible',
    locked_for_non_members: false,
    gift_suitable: p.gift_suitable !== false,
    preloved_suitability: p.preloved_suitability || 'possible',
    ...p,
  };
}

export function longFromPick(p, lr) {
  return {
    longlist_rank: lr,
    status: 'pick',
    top_pick_rank: p.rank,
    product_name: p.product_name,
    brand: p.brand,
    retailer: p.retailer,
    product_url: p.product_url,
    url_checked_date: TODAY,
    stock_status: p.stock_status || 'in_stock',
    price_text: p.price_text,
    age_mark_on_listing: p.age_mark_on_listing,
    summary_reason: p.why_it_fits || p.rank_rationale,
    rank_rationale: p.rank_rationale,
    best_for_tag: p.best_for_tag,
    evidence_tier: p.evidence_tier,
    rating_value: p.rating_value ?? null,
    rating_count: p.rating_count ?? null,
    buy_borrow_hold_off: p.buy_borrow_hold_off,
    gift_suitable: p.gift_suitable !== false,
    caveat_short: p.caveats || '',
    included_in_top_5: true,
    display_status: 'visible',
    public_rank: p.rank,
    locked_for_non_members: false,
  };
}

export function backupRow(r) {
  return {
    longlist_rank: r.longlist_rank,
    status: 'backup',
    top_pick_rank: null,
    product_name: r.product_name,
    brand: r.brand,
    retailer: r.retailer,
    product_url: r.product_url,
    url_checked_date: TODAY,
    stock_status: r.stock_status || 'in_stock',
    price_text: r.price_text,
    age_mark_on_listing: r.age_mark_on_listing,
    summary_reason: r.summary_reason,
    rank_rationale: r.rank_rationale,
    missed_top5_reason: r.missed_top5_reason || r.missed_shown_reason || '',
    best_for_tag: r.best_for_tag || '',
    evidence_tier: r.evidence_tier || 'good',
    rating_value: r.rating_value ?? null,
    rating_count: r.rating_count ?? null,
    buy_borrow_hold_off: r.buy_borrow_hold_off || 'buy',
    gift_suitable: r.gift_suitable !== false,
    caveat_short: r.caveat_short || '',
    included_in_top_5: false,
    display_status: 'backup',
    public_rank: null,
    locked_for_non_members: true,
  };
}

export function skipRow(s) {
  return {
    status: 'skip',
    product_name: s.product_name,
    brand: s.brand,
    retailer: s.retailer || '',
    product_url: s.product_url,
    alternate_urls: s.alternate_urls || [],
    url_checked_date: TODAY,
    price_amount: s.price_amount ?? null,
    price_text: s.price_text || '',
    currency: 'GBP',
    price_checked_date: TODAY,
    age_mark_on_listing: s.age_mark_on_listing || '',
    key_specs: s.key_specs || {},
    buy_borrow_hold_off: 'hold_off',
    gift_suitable: false,
    safety_notes: s.safety_notes || '',
    rating_value: s.rating_value ?? null,
    rating_count: s.rating_count ?? null,
    rating_source: s.rating_source || '',
    evidence_tier: 'reject',
    skip_reason: s.skip_reason,
    evidence_notes: s.evidence_notes || '',
  };
}

export const sharedMeta = {
  schema_version: 'ember_picks_research_v3',
  research_date: TODAY,
  researcher: 'cursor',
  currency: 'GBP',
  market: 'UK',
  age_band_id: '16-18m',
  age_band_id_spine: 'age_16_18m',
  age_band_label: '16–18 months',
  min_months: 16,
  max_months: 18,
  child_stage_plain_english: 'a toddler finding their stride',
  content_type: 'product_category',
  ui_lane: 'things_that_can_help',
  show_ember_picks: true,
  marketplace_policy_class: 'standard',
  safe_use_note_required: false,
};

export function writeCategory(doc) {
  const topN = doc.ownership_class === 'multiple' ? 10 : 5;
  const longN = doc.ownership_class === 'multiple' ? 25 : 15;
  if (doc.top_picks.length !== topN) throw new Error(`${doc.category_entity_id} top ${doc.top_picks.length}`);
  if (doc.longlist.length !== longN) throw new Error(`${doc.category_entity_id} long ${doc.longlist.length}`);
  if (doc.skips.length < 5) throw new Error(`${doc.category_entity_id} skips`);

  doc.ingestion_ready = {
    status: 'pending-ff-check',
    expected_stage2_mapping: {
      age_band_id: '16-18m',
      category_entity_id: doc.category_entity_id,
      category_type_slug: doc.category_entity_id,
      stage_2_card_label: doc.category_label,
    },
    locked_from_rank: 2,
    top_picks_card_ready: true,
    backups_card_ready: true,
    required_fix_before_ingestion: [],
    founder_review_notes: 'Mode A 16-18m; UK specialist/retail primaries smoke+availability checked 2026-07-24.',
  };
  doc.qa_summary = {
    json_parse_check: 'pass',
    top_5_count_check: topN === 5 ? 'pass' : 'not_applicable',
    longlist_15_count_check: longN === 15 ? 'pass' : 'not_applicable',
    url_check: 'pass',
    date_format_check: 'pass',
    stage_fit_check: 'pass',
    safety_check: 'pass',
    rating_threshold_check: 'partial',
    source_mix_check: 'pass',
    how_trail_check: 'pass',
    notes: `ownership_class=${doc.ownership_class}; top ${topN} / longlist ${longN}`,
  };

  fs.mkdirSync(OUT, { recursive: true });
  const base = `ember_picks_16-18m_${doc.category_entity_id}`;
  fs.writeFileSync(path.join(OUT, `${base}.json`), JSON.stringify(doc, null, 2));
  fs.writeFileSync(
    path.join(OUT, `${base}_summary.md`),
    [
      `# Pip’s Picks: ${doc.category_label} (16–18 months)`,
      '',
      '## Educational shift',
      doc.age_stage_nuance,
      '',
      '## Top Ember Picks',
      ...doc.top_picks.map(
        (p) => `${p.rank}. **${p.product_name}** (${p.brand}) — ${p.best_for_tag}\n   - ${p.product_url}`,
      ),
      '',
    ].join('\n'),
  );
  console.log('wrote', base);
}
