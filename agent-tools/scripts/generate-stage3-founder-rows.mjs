#!/usr/bin/env node
/**
 * Build founder-review rows JSON from Stage 3 research JSON files in green/ only.
 * Usage: node agent-tools/scripts/generate-stage3-founder-rows.mjs 34-36m
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ageBand = process.argv[2] || '34-36m';
const researchDir = path.join(repoRoot, 'agent-tools', 'exports', 'stage3', ageBand, 'research');
const greenDir = path.join(researchDir, 'green');
const outDir = path.join(repoRoot, 'agent-tools', 'exports', 'stage3', ageBand, 'founder-preview');

const CLUSTER_ORDER = [
  'ent_cluster_talk_stories_questions',
  'ent_cluster_pretend_social_worlds',
  'ent_cluster_puzzles_patterns_problem_solving',
  'ent_cluster_feelings_turn_taking',
  'ent_cluster_busy_hands_making_marks',
  'ent_cluster_jumping_balance_big_moves',
  'ent_cluster_little_helper_independence',
];

const SAFETY_ACTIONS = [
  {
    name: 'Car-seat fit and harness check',
    url: 'https://www.gov.uk/child-car-seats-the-rules',
    description: 'Re-check height, weight, harness position and vehicle fit before assuming the seat still fits.',
    why: 'Near three, it is easy to assume the car seat is still doing its job — this is a reset check, not a shopping list.',
  },
  {
    name: 'Button battery and magnet check',
    url: 'https://www.capt.org.uk/button-batteries',
    description: 'Check compartments on cards, remotes, scales and older-child toys; keep spares locked away.',
    why: 'Birthday gifts and older siblings can bring button batteries into reach without you noticing.',
  },
  {
    name: 'Water and paddling-pool reset',
    url: 'https://www.rospa.com/leisure-safety/water-safety/',
    description: 'Empty paddling pools, buckets and bowls after use; keep bathroom water supervised.',
    why: 'Shallow water still needs full attention as copying and reach improve.',
  },
  {
    name: 'Blind cord and window-climb check',
    url: 'https://www.rospa.com/home-safety/advice/blind-cord-safety/',
    description: 'Check blind cords, windows and furniture they could climb to reach them.',
    why: 'A taller toddler can reach things that felt safely out of range months ago.',
  },
  {
    name: '36-month toy-warning check',
    url: 'https://www.gov.uk/toy-safety-regulations',
    description: 'Check age warnings, small parts and younger siblings before gifts go in.',
    why: 'Turning three changes packaging labels — it does not make every small part safe for every home.',
  },
];

function urlStatus(pick) {
  const url = String(pick.product_url || '');
  const flag = String(pick.founder_qa_flag || 'none');
  if (!url) return 'missing';
  if (/google\.com\/search|udm=28/i.test(url)) return 'google_shopping';
  if (flag === 'check_url' || flag === 'shopping_search_link') return 'direct_needs_qa';
  if (flag === 'check_price' || flag === 'check_stock' || flag === 'check_claim' || flag === 'check_age_fit') {
    return 'direct_needs_qa';
  }
  if (pick.url_verification?.primary_opens_product === true) return 'verified_direct';
  return 'verified_direct';
}

function qaNote(pick) {
  const flag = String(pick.founder_qa_flag || 'none');
  if (flag === 'none') return '';
  return `Founder QA: ${flag.replace(/^check_/, '')}`;
}

function loadResearchFiles() {
  if (!fs.existsSync(greenDir)) {
    throw new Error(`Missing green dir: ${greenDir}. Run stage3-ff-check.mjs first.`);
  }
  const files = fs
    .readdirSync(greenDir)
    .filter(
      (f) =>
        f.startsWith(`ember_picks_${ageBand}_`) &&
        f.endsWith('.json') &&
        !f.includes('manifest') &&
        !f.includes('ff_check') &&
        !f.includes('url_smoke'),
    );
  if (!files.length) {
    throw new Error(`No green research JSON in ${greenDir}. Run stage3-ff-check.mjs first.`);
  }
  return files.map((f) => JSON.parse(fs.readFileSync(path.join(greenDir, f), 'utf8')));
}

function howTrail(doc) {
  const longlist = [...(doc.longlist || [])].sort((a, b) => a.longlist_rank - b.longlist_rank);
  const ranks = [];
  for (const pick of [...(doc.top_picks || [])].sort((a, b) => a.rank - b.rank)) {
    ranks.push({
      rank: pick.rank,
      role: 'top_pick',
      product_name: pick.product_name,
      brand: pick.brand || '',
      rank_rationale: pick.rank_rationale || '',
      missed_top5_reason: '',
    });
  }
  for (const row of longlist) {
    if (row.longlist_rank >= 6 && row.longlist_rank <= 10) {
      ranks.push({
        rank: row.longlist_rank,
        role: 'longlist',
        product_name: row.product_name,
        brand: row.brand || '',
        rank_rationale: row.rank_rationale || '',
        missed_top5_reason: row.missed_top5_reason || '',
      });
    }
  }
  return {
    buying_factor_memo: doc.buying_factor_memo || '',
    methodology: doc.methodology || '',
    ranks_1_to_10: ranks,
  };
}

function buildProductRows(doc) {
  const how = howTrail(doc);
  const picks = [...(doc.top_picks || [])].sort((a, b) => a.rank - b.rank);
  return picks.map((pick) => ({
    age_band_id: ageBand,
    stage_1_rank: CLUSTER_ORDER.indexOf(doc.cluster_entity_id) + 1,
    stage_1_card_label: doc.cluster_label,
    cluster_entity_id: doc.cluster_entity_id,
    stage_2_card_label: doc.category_label,
    category_entity_id: doc.category_entity_id,
    content_type: doc.content_type || 'product_category',
    ff_pass_badge: 'green',
    rank: pick.rank,
    product_or_action_name: [pick.brand, pick.product_name].filter(Boolean).join(' — ') || pick.product_name,
    url: pick.product_url || '',
    alternate_urls: pick.alternate_urls || [],
    url_status: urlStatus(pick),
    ui_title: pick.best_for_tag || '',
    ui_description: pick.product_description_under_30_words || '',
    why_pip_picked_this: pick.ember_verdict || pick.why_it_fits || '',
    buy_borrow_hold_off: pick.buy_borrow_hold_off || '',
    rank_rationale: pick.rank_rationale || '',
    buying_factor_memo: how.buying_factor_memo,
    how_trail: how,
    qa_note: qaNote(pick),
    researcher: doc.researcher,
    ingestion_ready_status: doc.ingestion_ready?.status || 'founder-review-ready',
  }));
}

function buildSafetyRows() {
  return SAFETY_ACTIONS.map((action, i) => ({
    age_band_id: ageBand,
    stage_1_rank: 8,
    stage_1_card_label: 'The safety reset for a taller, stronger toddler',
    cluster_entity_id: 'ent_cluster_safer_spaces_bigger_curiosity',
    stage_2_card_label: 'Quick safety checks (no shopping)',
    category_entity_id: 'safety_quick_checks',
    content_type: 'safety_check',
    ff_pass_badge: 'green',
    rank: i + 1,
    product_or_action_name: action.name,
    url: action.url,
    alternate_urls: [],
    url_status: 'official_guidance',
    ui_title: action.name,
    ui_description: action.description,
    why_pip_picked_this: action.why,
    buy_borrow_hold_off: 'hold_off',
    rank_rationale: '',
    buying_factor_memo: '',
    how_trail: null,
    qa_note: 'Quick Check only — not a Pip product pick',
    researcher: 'n/a',
    ingestion_ready_status: 'not_applicable',
  }));
}

const docs = loadResearchFiles().sort(
  (a, b) => CLUSTER_ORDER.indexOf(a.cluster_entity_id) - CLUSTER_ORDER.indexOf(b.cluster_entity_id),
);

const rows = [...docs.flatMap(buildProductRows), ...buildSafetyRows()];

const categoryHow = docs.map((doc) => ({
  category_entity_id: doc.category_entity_id,
  stage_2_card_label: doc.category_label,
  stage_1_card_label: doc.cluster_label,
  ...howTrail(doc),
}));

fs.mkdirSync(outDir, { recursive: true });
const rowsPath = path.join(outDir, `stage3_founder_review_rows_${ageBand}.json`);
fs.writeFileSync(rowsPath, JSON.stringify({ age_band_id: ageBand, rows, category_how: categoryHow }, null, 2), 'utf8');

const registry = docs.map((doc) => ({
  age_band_id: ageBand,
  stage_1_rank: CLUSTER_ORDER.indexOf(doc.cluster_entity_id) + 1,
  cluster_entity_id: doc.cluster_entity_id,
  stage_1_card_label: doc.cluster_label,
  category_entity_id: doc.category_entity_id,
  stage_2_card_label: doc.category_label,
  content_type: doc.content_type || 'product_category',
  research_status: 'complete',
  researcher: doc.researcher || 'unknown',
  source_artifact_path: path.join(
    'agent-tools/exports/stage3',
    ageBand,
    'research/green',
    `ember_picks_${ageBand}_${doc.category_entity_id}.json`,
  ),
  json_path: path.join(
    'agent-tools/exports/stage3',
    ageBand,
    'research/green',
    `ember_picks_${ageBand}_${doc.category_entity_id}.json`,
  ),
  csv_path: path.join(
    'agent-tools/exports/stage3',
    ageBand,
    'research/green',
    `ember_picks_${ageBand}_${doc.category_entity_id}.csv`,
  ),
  summary_path: path.join(
    'agent-tools/exports/stage3',
    ageBand,
    'research/green',
    `ember_picks_${ageBand}_${doc.category_entity_id}_summary.md`,
  ),
  founder_preview_path: path.join(
    'agent-tools/exports/stage3',
    ageBand,
    'founder-preview',
    `stage3_founder_review_${ageBand}.html`,
  ),
  top_pick_count: (doc.top_picks || []).length,
  url_status_summary: (doc.top_picks || []).map((p) => urlStatus(p)).join(', '),
  ingestion_ready_status: 'founder-review-ready',
  qa_notes: (doc.top_picks || [])
    .filter((p) => p.founder_qa_flag && p.founder_qa_flag !== 'none')
    .map((p) => `${p.rank}: ${p.founder_qa_flag}`)
    .join('; '),
}));

registry.push({
  age_band_id: ageBand,
  stage_1_rank: 8,
  cluster_entity_id: 'ent_cluster_safer_spaces_bigger_curiosity',
  stage_1_card_label: 'The safety reset for a taller, stronger toddler',
  category_entity_id: 'safety_quick_checks',
  stage_2_card_label: 'Quick safety checks (no shopping)',
  content_type: 'safety_check',
  research_status: 'quick_check',
  researcher: 'n/a',
  source_artifact_path: 'supabase migration discover_projection',
  json_path: '',
  csv_path: '',
  summary_path: '',
  founder_preview_path: path.join(
    'agent-tools/exports/stage3',
    ageBand,
    'founder-preview',
    `stage3_founder_review_${ageBand}.html`,
  ),
  top_pick_count: 5,
  url_status_summary: 'official_guidance',
  ingestion_ready_status: 'not_applicable',
  qa_notes: 'Safety cluster — no product picks',
});

const registryDir = path.join(repoRoot, 'agent-tools', 'exports', 'stage3', ageBand, 'registry');
fs.mkdirSync(registryDir, { recursive: true });
fs.writeFileSync(path.join(registryDir, `stage3_registry_${ageBand}.json`), JSON.stringify(registry, null, 2), 'utf8');

console.log(JSON.stringify({ rowsPath, rowCount: rows.length, categories: docs.length }, null, 2));
