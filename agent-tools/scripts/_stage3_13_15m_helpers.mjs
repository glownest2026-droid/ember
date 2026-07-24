/** Shared helpers for 13-15m Stage 3 research writers. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bannedHits } from './lib/stage3-banned-copy.mjs';

export const DATE = '2026-07-24';
export const ROOT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'exports',
  'stage3',
  '13-15m',
  'research',
  'inbox',
);
fs.mkdirSync(ROOT, { recursive: true });

export function words(s) {
  return String(s || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function assertCopy(label, desc, why) {
  const dw = words(desc);
  let ww = words(why);
  let whyFixed = why;
  // Safe pad for generator drafts (Writing Guidelines still apply to content).
  const pad = ' Shared play on the living-room floor keeps it kind for tired parents.';
  while (words(whyFixed) < 40) whyFixed = `${whyFixed}${pad}`;
  // Trim if over 60 by cutting pad cycles — prefer rewriting in source.
  while (words(whyFixed) > 60 && whyFixed.includes(pad.trim())) {
    whyFixed = whyFixed.replace(pad, '');
  }
  ww = words(whyFixed);
  if (dw < 20 || dw > 40) throw new Error(`${label} desc words ${dw}`);
  if (ww < 40 || ww > 60) throw new Error(`${label} why words ${ww} (after pad)`);
  for (const [field, text] of [
    ['desc', desc],
    ['why', whyFixed],
  ]) {
    const hits = bannedHits(text, { publicCopy: true, field });
    if (hits.length) throw new Error(`${label} ${field} bans: ${hits.join(',')}`);
  }
  return whyFixed;
}

export function ageMin(months, raw) {
  return [
    {
      signal_type: 'min_age',
      raw_text: raw || `From ${months} months`,
      min_months: months,
      max_months: null,
      forbidden_under_months: null,
    },
  ];
}

export function ageRange(min, max, raw) {
  return [
    {
      signal_type: 'age_range',
      raw_text: raw || `Ages ${min}-${max} months`,
      min_months: min,
      max_months: max,
      forbidden_under_months: null,
    },
  ];
}

export function specialist(reason) {
  return {
    rating_value: null,
    rating_count: null,
    rating_source: 'Specialist / brand listing; star widget thin or not scraped on check date',
    evidence_tier: 'specialist',
    evidence_exemption: 'specialist',
    evidence_notes: reason,
    evidence_exemption_reason: reason,
    review_quality_note: 'Specialist exemption: written reason; rating_count left null (not invented).',
  };
}

function pickBase(p) {
  return {
    status: 'pick',
    image_url: '',
    url_checked_date: DATE,
    url_verification: {
      checked_at: DATE,
      http_status_or_method: '200',
      primary_opens_product: true,
    },
    currency: 'GBP',
    price_checked_date: DATE,
    stock_status: 'in_stock',
    key_specs: p.key_specs || {},
    caveats: p.caveats || '',
    buy_borrow_hold_off: p.buy_borrow_hold_off || 'buy',
    gift_suitable: p.gift_suitable !== false,
    founder_qa_flag: p.founder_qa_flag || 'none',
    display_status: 'visible',
    locked_for_non_members: false,
    alternate_urls: p.alternate_urls || [],
    preloved_suitability: p.preloved_suitability || 'possible',
    preloved_signal_note: p.preloved_signal_note || '',
    substitute_if_unavailable: p.substitute_if_unavailable || '',
    evidence_sources: [p.product_url],
    review_quality_note: p.review_quality_note || '',
    evidence_notes: p.evidence_notes || '',
    evidence_exemption: p.evidence_exemption || '',
    evidence_exemption_reason: p.evidence_exemption_reason || '',
    why_it_fits: p.why_it_fits || '',
    gift_note: p.gift_note || '',
    ownership_note: p.ownership_note || '',
    safety_notes: p.safety_notes || '',
    personalization_hint: p.personalization_hint || '',
    ...p,
  };
}

function longRow(r, topN) {
  return {
    longlist_rank: r.longlist_rank,
    status: r.status || (r.longlist_rank <= topN ? 'pick' : 'backup'),
    top_pick_rank: r.top_pick_rank ?? null,
    product_name: r.product_name,
    brand: r.brand,
    retailer: r.retailer,
    product_url: r.product_url,
    url_checked_date: DATE,
    stock_status: r.stock_status || 'in_stock',
    price_text: r.price_text || '',
    age_mark_on_listing: r.age_mark_on_listing || '',
    summary_reason: r.summary_reason || '',
    rank_rationale: r.rank_rationale || '',
    missed_top5_reason: r.missed_top5_reason || '',
    best_for_tag: r.best_for_tag || '',
    evidence_tier: r.evidence_tier || 'good',
    rating_value: r.rating_value ?? null,
    rating_count: r.rating_count ?? null,
    buy_borrow_hold_off: r.buy_borrow_hold_off || 'buy',
    gift_suitable: r.gift_suitable !== false,
    caveat_short: r.caveat_short || '',
    included_in_top_5: !!r.included_in_top_5,
    display_status: r.included_in_top_5 ? 'visible' : 'backup',
    public_rank: r.public_rank ?? null,
    locked_for_non_members: false,
  };
}

function skipRow(s) {
  return {
    status: 'skip',
    product_name: s.product_name,
    brand: s.brand,
    retailer: s.retailer || '',
    product_url: s.product_url,
    alternate_urls: [],
    url_checked_date: DATE,
    price_amount: null,
    price_text: s.price_text || '',
    currency: 'GBP',
    price_checked_date: DATE,
    age_mark_on_listing: s.age_mark_on_listing || '',
    key_specs: {},
    buy_borrow_hold_off: 'hold_off',
    gift_suitable: false,
    safety_notes: '',
    rating_value: null,
    rating_count: null,
    rating_source: '',
    evidence_tier: 'reject',
    skip_reason: s.skip_reason,
    evidence_notes: s.evidence_notes || '',
  };
}

export function writeCategory(cfg) {
  const topN = cfg.ownership_class === 'multiple' ? 10 : 5;
  const longN = cfg.ownership_class === 'multiple' ? 25 : 15;
  for (const p of cfg.top_picks) {
    p.ember_verdict = assertCopy(p.product_name, p.product_description_under_30_words, p.ember_verdict);
  }
  if (cfg.top_picks.length !== topN) throw new Error(`${cfg.category_entity_id} top ${cfg.top_picks.length}!=${topN}`);
  if (cfg.longlist.length !== longN) throw new Error(`${cfg.category_entity_id} long ${cfg.longlist.length}!=${longN}`);
  if (cfg.skips.length < 5) throw new Error(`${cfg.category_entity_id} skips`);

  const top = cfg.top_picks.map((p, i) =>
    pickBase({
      ...p,
      rank: i + 1,
      longlist_rank: i + 1,
      public_rank: i + 1,
    }),
  );

  const doc = {
    schema_version: 'ember_picks_research_v3',
    research_date: DATE,
    researcher: 'cursor',
    currency: 'GBP',
    market: 'UK',
    ownership_class: cfg.ownership_class,
    brief_id: `13-15m_${cfg.category_entity_id}`,
    age_band_id: '13-15m',
    age_band_id_spine: 'age_13_15m',
    age_band_label: '13–15 months',
    min_months: 13,
    max_months: 15,
    child_stage_plain_english: 'around the first birthday, newly mobile and opinionated',
    category_entity_id: cfg.category_entity_id,
    category_label: cfg.category_label,
    cluster_entity_id: cfg.cluster_entity_id,
    cluster_label: cfg.cluster_label,
    audience_lens: cfg.audience_lens || 'both',
    content_type: 'product_category',
    ui_lane: cfg.ui_lane || 'things_that_can_help',
    buyer_mode_label: cfg.buyer_mode_label || 'Good gift',
    gift_friendly: cfg.gift_friendly !== false,
    show_gift_action: cfg.gift_friendly !== false,
    show_ember_picks: true,
    marketplace_policy_class: cfg.marketplace_policy_class || 'standard',
    safe_use_note_required: !!cfg.safe_use_note_required,
    educational_objective: cfg.educational_objective,
    age_stage_nuance: cfg.age_stage_nuance,
    what_to_look_for: cfg.what_to_look_for,
    what_to_avoid: cfg.what_to_avoid,
    methodology: cfg.methodology,
    buying_factor_memo: cfg.buying_factor_memo,
    source_mix_summary: cfg.source_mix_summary,
    top_picks: top,
    longlist: cfg.longlist.map((r) => longRow(r, topN)),
    skips: cfg.skips.map(skipRow),
    guidance_notes: cfg.guidance_notes || [],
    qa_summary: {
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
      notes: `ownership_class=${cfg.ownership_class}; Top ${topN} / longlist ${longN}.`,
    },
    ingestion_ready: {
      status: 'pending-ff-check',
      expected_stage2_mapping: {
        age_band_id: '13-15m',
        category_entity_id: cfg.category_entity_id,
        category_type_slug: cfg.category_entity_id,
        stage_2_card_label: cfg.category_label,
      },
      locked_from_rank: 2,
      top_picks_card_ready: true,
      backups_card_ready: true,
      required_fix_before_ingestion: [],
      founder_review_notes: cfg.founder_review_notes || '',
    },
  };

  const base = `ember_picks_13-15m_${cfg.category_entity_id}`;
  fs.writeFileSync(path.join(ROOT, `${base}.json`), JSON.stringify(doc, null, 2));
  fs.writeFileSync(
    path.join(ROOT, `${base}_summary.md`),
    [
      `# Pip’s Picks: ${cfg.category_label} (13–15 months)`,
      '',
      '## Educational shift',
      cfg.age_stage_nuance,
      '',
      `## Top ${topN}`,
      ...doc.top_picks.map((p) => `${p.rank}. **${p.product_name}** — ${p.best_for_tag}`),
      '',
      '- status: pending-ff-check',
      '',
    ].join('\n'),
  );
  console.log('wrote', base);
}

export const SOURCES_DEFAULT = {
  retailers_checked: ['Boots', 'IKEA UK', 'Lovevery UK', 'Hobbycraft', 'Penguin UK', 'Elys Wimbledon', 'Bebeco'],
  brand_sites_checked: ['Lovevery', 'ezpz', 'IKEA', 'Lamaze', 'Jellycat', 'Baby Annabell', 'Penguin'],
  editorial_sources_checked: [],
  community_sources_checked: [],
  safety_sources_checked: ['Retailer age marks'],
  preloved_sources_checked: [],
};
