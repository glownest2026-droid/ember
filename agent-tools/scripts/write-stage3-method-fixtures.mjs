#!/usr/bin/env node
/**
 * Write good/bad schema-v3 fixtures for FF + founder HTML self-check.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const outDir = path.join(root, 'agent-tools', 'exports', 'stage3', '_fixtures');
fs.mkdirSync(outDir, { recursive: true });

const URLS = [
  'https://www.gov.uk/',
  'https://www.gov.uk/browse/childcare-parenting',
  'https://www.gov.uk/child-car-seats-the-rules',
  'https://www.gov.uk/help',
  'https://www.gov.uk/search/all',
];

function ageSignals() {
  return [
    {
      signal_type: 'age_range',
      raw_text: 'Ages 2–5',
      min_months: 24,
      max_months: 60,
      forbidden_under_months: null,
    },
  ];
}

function urlVerification() {
  return {
    checked_at: '2026-07-22',
    http_status_or_method: '200',
    primary_opens_product: true,
  };
}

function makePick(rank) {
  return {
    rank,
    status: 'pick',
    longlist_rank: rank,
    best_for_tag: `Best for case ${rank}`,
    product_name: `Fixture Product ${rank}`,
    brand: 'Ember Fixture',
    retailer: 'Publisher',
    product_url: URLS[(rank - 1) % URLS.length],
    alternate_urls: [],
    image_url: '',
    url_checked_date: '2026-07-22',
    url_verification: urlVerification(),
    stock_status: 'in_stock',
    price_amount: 9.99,
    price_text: '£9.99',
    currency: 'GBP',
    price_checked_date: '2026-07-22',
    age_mark_on_listing: 'Ages 2–5',
    age_signals: ageSignals(),
    key_specs: {},
    product_description_under_30_words: `Fixture description for product ${rank} used only in self-check. It needs twenty to forty words so the Fastidious Founder description depth gate can pass on good fixtures.`,
    ember_verdict: `Why Pip picked fixture ${rank}: stage fit for nearly three talk-back without catalogue speak.`,
    rank_rationale: `Rank ${rank} because it beats rank ${rank + 1} on stage fit and review depth for this fixture category.`,
    why_it_fits: 'Fixture stage fit.',
    caveats: 'Fixture only.',
    buy_borrow_hold_off: 'buy',
    gift_suitable: true,
    gift_note: '',
    ownership_note: '',
    safety_notes: '',
    rating_value: 4.6,
    rating_count: 42,
    rating_source: 'Fixture',
    review_quality_note: '',
    evidence_tier: 'good',
    evidence_sources: [URLS[0]],
    preloved_suitability: 'possible',
    preloved_signal_note: '',
    substitute_if_unavailable: `Fixture Product ${Math.min(rank + 1, 5)}`,
    founder_qa_flag: 'none',
    display_status: 'visible',
    public_rank: rank,
    locked_for_non_members: false,
    evidence_notes: '',
  };
}

function makeLonglist() {
  const rows = [];
  for (let i = 1; i <= 15; i++) {
    rows.push({
      longlist_rank: i,
      status: i <= 5 ? 'pick' : 'backup',
      top_pick_rank: i <= 5 ? i : null,
      product_name: `Fixture Product ${i}`,
      brand: 'Ember Fixture',
      retailer: 'Publisher',
      product_url: URLS[(i - 1) % URLS.length],
      url_checked_date: '2026-07-22',
      stock_status: 'in_stock',
      price_text: '£9.99',
      age_mark_on_listing: 'Ages 2–5',
      summary_reason: `Longlist ${i} summary.`,
      rank_rationale:
        i <= 10
          ? `Longlist rank ${i} ordered by stage fit then evidence for the fixture bench.`
          : '',
      missed_top5_reason:
        i >= 6 && i <= 10
          ? `Missed Top 5: weaker talk-back fit than ranks 1–5 for this fixture category.`
          : '',
      best_for_tag: i <= 5 ? `Best for case ${i}` : '',
      evidence_tier: 'good',
      rating_value: 4.5,
      rating_count: 20,
      buy_borrow_hold_off: 'buy',
      gift_suitable: true,
      caveat_short: '',
      included_in_top_5: i <= 5,
      display_status: i <= 5 ? 'visible' : 'backup',
      public_rank: i <= 5 ? i : null,
      locked_for_non_members: false,
    });
  }
  return rows;
}

function makeSkips() {
  return [1, 2, 3, 4, 5].map((i) => ({
    status: 'skip',
    product_name: `Skipped Fixture ${i}`,
    brand: 'Skip Co',
    retailer: 'Amazon UK',
    product_url: URLS[(i - 1) % URLS.length],
    alternate_urls: [],
    url_checked_date: '2026-07-22',
    price_amount: null,
    price_text: '',
    currency: 'GBP',
    price_checked_date: '2026-07-22',
    age_mark_on_listing: 'Ages 5+',
    key_specs: {},
    buy_borrow_hold_off: 'hold_off',
    gift_suitable: false,
    safety_notes: '',
    rating_value: null,
    rating_count: null,
    rating_source: '',
    evidence_tier: 'reject',
    skip_reason: `Skipped fixture ${i}: wrong age or category for the brief.`,
    evidence_notes: '',
  }));
}

const good = {
  schema_version: 'ember_picks_research_v3',
  research_date: '2026-07-22',
  researcher: 'cursor',
  currency: 'GBP',
  market: 'UK',
  brief_id: '34-36m_cat_fixture_good',
  age_band_id: '34-36m',
  age_band_id_spine: '34-36m',
  age_band_label: '34–36 months',
  min_months: 34,
  max_months: 36,
  child_stage_plain_english: 'nearly three',
  category_entity_id: 'cat_fixture_good',
  category_label: 'Fixture good category',
  cluster_entity_id: 'ent_cluster_talk_stories_questions',
  cluster_label: 'Questions, stories and bigger chats',
  audience_lens: 'parent',
  content_type: 'product_category',
  buyer_mode_label: "I'm the parent",
  gift_friendly: true,
  show_gift_action: true,
  marketplace_policy_class: 'standard',
  safe_use_note_required: false,
  educational_objective: 'Fixture objective for self-check only.',
  age_stage_nuance: 'Nearly three talk-back.',
  what_to_look_for: 'Stage fit, live URLs, documented ranks.',
  what_to_avoid: 'Dead links, thin HOW trails.',
  methodology:
    'Bench of 15 equal candidates with live URLs; age signals captured from listings; rank using buying_factor_memo; URL verify on every Top Pick primary.',
  buying_factor_memo:
    'For this fixture: (1) stage talk-back fit, (2) age overlap, (3) review depth, (4) ownership risk, (5) URL trust, (6) distinct parent jobs across the Top 5.',
  source_mix_summary: {
    retailers_checked: ['Publisher'],
    brand_sites_checked: [],
    editorial_sources_checked: [],
    community_sources_checked: [],
    safety_sources_checked: ['GOV.UK'],
    preloved_sources_checked: [],
  },
  top_picks: [1, 2, 3, 4, 5].map(makePick),
  longlist: makeLonglist(),
  skips: makeSkips(),
  guidance_notes: [{ note: 'Fixture guidance only.' }],
  qa_summary: {
    json_parse_check: 'pass',
    top_5_count_check: 'pass',
    longlist_15_count_check: 'pass',
    url_check: 'pass',
    date_format_check: 'pass',
    stage_fit_check: 'pass',
    safety_check: 'pass',
    rating_threshold_check: 'pass',
    source_mix_check: 'pass',
    how_trail_check: 'pass',
    notes: 'Fixture good.',
  },
  ingestion_ready: {
    status: 'pending-ff-check',
    expected_stage2_mapping: {
      age_band_id: '34-36m',
      category_entity_id: 'cat_fixture_good',
      category_type_slug: 'cat_fixture_good',
      stage_2_card_label: 'Fixture good category',
    },
    locked_from_rank: 2,
    top_picks_card_ready: true,
    backups_card_ready: true,
    required_fix_before_ingestion: [],
    founder_review_notes: 'Fixture only — not for ingest.',
  },
};

const bad = {
  ...good,
  schema_version: 'ember_picks_research_v2',
  category_entity_id: 'cat_fixture_bad',
  brief_id: '34-36m_cat_fixture_bad',
  buying_factor_memo: '',
  methodology: 'Looked at Amazon.',
  top_picks: good.top_picks.map((p) => {
    const { rank_rationale, age_signals, url_verification, ...rest } = p;
    return { ...rest, product_name: `Bad ${rest.product_name}` };
  }),
  longlist: good.longlist.map((r) => ({
    ...r,
    rank_rationale: '',
    missed_top5_reason: '',
    product_name: `Bad ${r.product_name}`,
  })),
  ingestion_ready: {
    ...good.ingestion_ready,
    expected_stage2_mapping: {
      ...good.ingestion_ready.expected_stage2_mapping,
      category_entity_id: 'cat_fixture_bad',
      category_type_slug: 'cat_fixture_bad',
    },
  },
};

fs.writeFileSync(path.join(outDir, 'ember_picks_34-36m_cat_fixture_good.json'), JSON.stringify(good, null, 2));
fs.writeFileSync(path.join(outDir, 'ember_picks_34-36m_cat_fixture_bad.json'), JSON.stringify(bad, null, 2));
console.log(JSON.stringify({ outDir, good: true, bad: true }, null, 2));
