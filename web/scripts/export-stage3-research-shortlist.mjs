/**
 * MVP research shortlist for Pip's Picks (Stage 3).
 *
 * Launch principle: for each Stage 1 card, pick the single strongest
 * eligible Stage 2 product card to research first (min 1 Stage 3 shortlist
 * per Stage 1 where a valid product-action row exists).
 *
 * Usage:
 *   node web/scripts/export-stage3-research-shortlist.mjs "path/to/02_Ember_Bible_….xlsx"
 *   node web/scripts/export-stage3-research-shortlist.mjs --out=agent-tools/exports "path/to/…"
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const REQUIRED_COLUMNS = [
  'age_band_id',
  'cluster_entity_id',
  'cluster_label',
  'cluster_rank',
  'category_entity_id',
  'category_label',
  'category_rank',
  'content_type',
  'show_ember_picks',
  'render_rule',
  'is_physical_product',
  'evidence_ids',
  'buyer_mode_label',
  'primary_persona',
  'gift_friendly',
  'show_gift_action',
  'gift_display_eligible',
  'gift_confidence',
  'common_ownership_risk',
  'ownership_note',
  'needs_research',
];

const OPTIONAL_SOURCE_COLS = ['source_ids', 'community_source_ids'];

function parseArgs(argv) {
  let outDir = path.join(repoRoot, 'agent-tools', 'exports');
  const files = [];
  for (const arg of argv) {
    if (arg.startsWith('--out=')) outDir = path.resolve(arg.slice('--out='.length));
    else if (!arg.startsWith('-')) files.push(arg);
  }
  return { outDir, files };
}

function truthy(v) {
  if (v === true || v === 1) return true;
  const s = String(v ?? '')
    .trim()
    .toLowerCase();
  return s === 'true' || s === '1' || s === 'yes' || s === 'y';
}

function falsy(v) {
  if (v === false || v === 0 || v === null || v === undefined) return true;
  const s = String(v ?? '')
    .trim()
    .toLowerCase();
  return s === '' || s === 'false' || s === '0' || s === 'no' || s === 'n';
}

function blank(v) {
  return String(v ?? '').trim() === '';
}

function idList(v) {
  const s = String(v ?? '').trim();
  if (!s) return [];
  return s
    .split(/[;|]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function num(v, fallback = 999) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function csvEscape(v) {
  const s = String(v ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function bandToken(ageBandId) {
  return String(ageBandId || 'unknown')
    .replace(/^age_/, '')
    .replace(/_/g, '-');
}

function sourceField(row) {
  if (!blank(row.source_ids)) return { col: 'source_ids', ids: idList(row.source_ids) };
  if (!blank(row.community_source_ids)) {
    return { col: 'community_source_ids', ids: idList(row.community_source_ids) };
  }
  return { col: null, ids: [] };
}

function excludeReason(row) {
  if (String(row.content_type).trim() !== 'product_category') return 'not product_category';
  if (!truthy(row.show_ember_picks)) return 'show_ember_picks is FALSE';
  if (String(row.render_rule).trim() !== 'product_actions') return 'render_rule is not product_actions';
  if (!truthy(row.is_physical_product)) return 'is_physical_product is not TRUE';
  if (truthy(row.needs_research)) return 'needs_research is TRUE';
  if (blank(row.category_entity_id)) return 'missing category_entity_id';
  if (blank(row.category_label)) return 'missing category_label';
  return null;
}

function isEligible(row) {
  return excludeReason(row) === null;
}

/**
 * Fixed weights — deterministic across bands.
 * Gift bonuses are capped so parent buys are not overpowered.
 */
function scoreRow(row) {
  const evidenceCount = idList(row.evidence_ids).length;
  const { ids: sourceIds } = sourceField(row);
  const sourceCount = sourceIds.length;

  const categoryRank = num(row.category_rank);
  const laneRank = blank(row.lane_rank) ? 50 : num(row.lane_rank);
  const clusterRank = num(row.cluster_rank);

  let score = 0;
  const reasons = [];

  // 1. Editorial priority
  score += Math.max(0, 20 - categoryRank);
  score += Math.max(0, 10 - laneRank) * 0.5;
  score += Math.max(0, 15 - clusterRank) * 0.15;

  // 2. Evidence strength
  const ePts = Math.min(evidenceCount, 5);
  const sPts = Math.min(sourceCount, 4);
  score += ePts * 1.5;
  score += sPts * 1.0;
  if (ePts) reasons.push(`${evidenceCount} evidence id(s)`);
  if (sPts) reasons.push(`${sourceCount} source id(s)`);

  // 3. Persona value (gift capped)
  const persona = String(row.primary_persona || '')
    .trim()
    .toLowerCase();
  const buyer = String(row.buyer_mode_label || '').trim();
  let giftBonus = 0;

  if (persona === 'both') {
    score += 6;
    reasons.push('persona both');
  } else if (persona === 'conor' && buyer === 'Parent buy') {
    score += 5;
    reasons.push('Conor parent buy');
  } else if (persona === 'thea' && truthy(row.gift_friendly)) {
    giftBonus += 3;
    reasons.push('Thea gift lane');
  }

  if (truthy(row.gift_display_eligible)) giftBonus += 1.5;
  const gConf = String(row.gift_confidence || '')
    .trim()
    .toLowerCase();
  if (gConf === 'high') giftBonus += 2;
  else if (gConf === 'medium') giftBonus += 1;
  giftBonus = Math.min(giftBonus, 5);
  score += giftBonus;
  if (giftBonus) reasons.push(`gift bonus ${giftBonus}`);

  // 4. Stage 3 readiness
  if (buyer === 'Parent buy') {
    score += 4;
    reasons.push('Parent buy');
  } else if (buyer === 'Good gift') {
    score += 3;
    reasons.push('Good gift');
  }
  if (truthy(row.show_gift_action)) score += 1;
  if (!blank(row.product_family_label)) {
    score += 1;
    reasons.push('has product family');
  }

  // 5. Ownership risk (do not exclude)
  const risk = String(row.common_ownership_risk || '')
    .trim()
    .toLowerCase();
  if (risk === 'high') {
    score -= 1.5;
    reasons.push('high ownership risk (−)');
  } else if (risk === 'medium') {
    score -= 0.75;
    reasons.push('medium ownership risk (−)');
  }

  score = Math.round(score * 100) / 100;

  return {
    score,
    evidenceCount,
    sourceCount,
    reasonSelected: reasons.length
      ? `Top eligible in cluster; ${reasons.join('; ')}`
      : 'Top eligible in cluster',
  };
}

function tieBreak(a, b) {
  if (a.category_rank !== b.category_rank) return a.category_rank - b.category_rank;
  if (b.evidenceCount !== a.evidenceCount) return b.evidenceCount - a.evidenceCount;
  if (b.sourceCount !== a.sourceCount) return b.sourceCount - a.sourceCount;
  const personaRank = (p) => (String(p).toLowerCase() === 'both' ? 0 : 1);
  if (personaRank(a.primary_persona) !== personaRank(b.primary_persona)) {
    return personaRank(a.primary_persona) - personaRank(b.primary_persona);
  }
  const confRank = (c) => (String(c).toLowerCase() === 'high' ? 0 : 1);
  if (confRank(a.gift_confidence) !== confRank(b.gift_confidence)) {
    return confRank(a.gift_confidence) - confRank(b.gift_confidence);
  }
  return 0;
}

function dominantContentTypes(rows) {
  const m = new Map();
  for (const r of rows) {
    const k = String(r.content_type || '(blank)');
    m.set(k, (m.get(k) || 0) + 1);
  }
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([k, n]) => `${k} (${n})`)
    .join(', ');
}

function renderRulesSummary(rows) {
  return [...new Set(rows.map((r) => String(r.render_rule || '(blank)')))].join(', ');
}

function noPickRecommendation(rows) {
  const types = new Set(rows.map((r) => String(r.content_type || '')));
  if (types.has('safety_check') && !types.has('product_category')) return 'Keep as Quick Check';
  if (types.has('setup') && !types.has('product_category')) return 'Keep as Setup';
  if (types.has('activity') && !types.has('product_category')) return 'Keep as Useful Idea';
  const productish = rows.filter((r) => String(r.content_type) === 'product_category');
  if (productish.length && productish.every((r) => !truthy(r.show_ember_picks))) {
    return 'Keep as Useful Idea';
  }
  return 'Needs manual review';
}

function noPickReason(rows) {
  const eligibleFailed = rows.map((r) => excludeReason(r)).filter(Boolean);
  const counts = new Map();
  for (const reason of eligibleFailed) counts.set(reason, (counts.get(reason) || 0) + 1);
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  if (!top) return 'No Stage 2 rows in cluster';
  const product = rows.some((r) => String(r.content_type) === 'product_category');
  if (!product) {
    return `No product-category rows (${dominantContentTypes(rows)})`;
  }
  return `No eligible product-action row; most common gate: ${top[0]} (${top[1]} rows)`;
}

function runWorkbook(filePath, outDir) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Workbook not found: ${filePath}`);
  }

  const wb = XLSX.readFile(filePath);
  const sheet = wb.Sheets.discover_projection;
  if (!sheet) throw new Error('Missing sheet: discover_projection');

  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  if (!rows.length) throw new Error('discover_projection is empty');

  const cols = Object.keys(rows[0]);
  const missing = REQUIRED_COLUMNS.filter((c) => !cols.includes(c));
  if (missing.length) {
    throw new Error(`Missing required columns:\n- ${missing.join('\n- ')}`);
  }
  if (!OPTIONAL_SOURCE_COLS.some((c) => cols.includes(c))) {
    throw new Error(
      `Missing source column: need one of ${OPTIONAL_SOURCE_COLS.join(' or ')}`,
    );
  }

  const ageBandId = String(rows[0].age_band_id || '').trim() || 'unknown';
  const token = bandToken(ageBandId);

  const byCluster = new Map();
  for (const row of rows) {
    const id = String(row.cluster_entity_id || '').trim();
    if (!id) continue;
    if (!byCluster.has(id)) byCluster.set(id, []);
    byCluster.get(id).push(row);
  }

  const shortlist = [];
  const noPick = [];
  const excludedAudit = new Map();
  const manualFlags = [];
  const csvRows = [];

  let eligibleTotal = 0;

  for (const [clusterId, clusterRows] of byCluster) {
    const clusterRank = Math.min(...clusterRows.map((r) => num(r.cluster_rank)));
    const clusterLabel =
      clusterRows.find((r) => !blank(r.cluster_label_parent_friendly))
        ?.cluster_label_parent_friendly ||
      clusterRows[0].cluster_label ||
      clusterId;

    for (const row of clusterRows) {
      const reason = excludeReason(row);
      if (reason) {
        if (!excludedAudit.has(reason)) excludedAudit.set(reason, []);
        excludedAudit.get(reason).push(row);
      }
    }

    const eligible = clusterRows
      .filter(isEligible)
      .map((row) => {
        const scored = scoreRow(row);
        return {
          row,
          ...scored,
          category_rank: num(row.category_rank),
          primary_persona: row.primary_persona,
          gift_confidence: row.gift_confidence,
        };
      });

    eligibleTotal += eligible.length;

    if (!eligible.length) {
      const reason = noPickReason(clusterRows);
      const rec = noPickRecommendation(clusterRows);
      noPick.push({
        clusterRank,
        clusterLabel,
        clusterId,
        reason,
        contentTypes: dominantContentTypes(clusterRows),
        renderRules: renderRulesSummary(clusterRows),
        recommendation: rec,
      });
      csvRows.push({
        age_band_id: ageBandId,
        cluster_rank: clusterRank,
        cluster_entity_id: clusterId,
        cluster_label: clusterLabel,
        selected_for_stage3: false,
        category_rank: '',
        category_entity_id: '',
        category_type_slug: '',
        category_label: '',
        priority_score: '',
        buyer_mode_label: '',
        primary_persona: '',
        gift_friendly: '',
        show_gift_action: '',
        gift_display_eligible: '',
        gift_confidence: '',
        common_ownership_risk: '',
        evidence_count: '',
        source_count: '',
        stage3_research_input_filename: '',
        stage3_ingestion_bundle_hint: `stage3_ingestion_bundle_${token}.json`,
        reason_selected: reason,
        manual_review_flag: rec === 'Needs manual review' ? 'no_eligible_product' : '',
      });
      continue;
    }

    eligible.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return tieBreak(a, b);
    });

    const top = eligible[0];
    const tied = eligible.filter(
      (e) => e.score === top.score && tieBreak(e, top) === 0 && e !== top,
    );
    let manual = '';
    if (tied.length) {
      manual = 'tied_rows';
      manualFlags.push({
        type: 'tied rows',
        detail: `${clusterLabel}: ${[top, ...tied]
          .map((e) => e.row.category_label)
          .join(' vs ')} (score ${top.score})`,
      });
    }

    if (
      truthy(top.row.gift_friendly) &&
      !truthy(top.row.show_gift_action)
    ) {
      manual = manual ? `${manual}; gift_friendly_without_action` : 'gift_friendly_without_action';
      manualFlags.push({
        type: 'gift_friendly = TRUE but show_gift_action = FALSE',
        detail: top.row.category_label,
      });
    }

    if (
      String(top.row.buyer_mode_label).trim() === 'Parent buy' &&
      String(top.row.primary_persona).trim().toLowerCase() === 'thea'
    ) {
      manual = manual ? `${manual}; parent_buy_thea` : 'parent_buy_thea';
      manualFlags.push({
        type: 'Parent buy but primary_persona = thea',
        detail: top.row.category_label,
      });
    }

    if (top.evidenceCount <= 1 && top.sourceCount === 0) {
      manual = manual ? `${manual}; sparse_evidence` : 'sparse_evidence';
      manualFlags.push({
        type: 'eligible but sparse evidence/sources',
        detail: top.row.category_label,
      });
    }

    shortlist.push({
      clusterRank,
      clusterLabel,
      clusterId,
      categoryLabel: top.row.category_label,
      categoryEntityId: top.row.category_entity_id,
      categoryRank: top.category_rank,
      score: top.score,
      buyer: top.row.buyer_mode_label,
      persona: top.row.primary_persona,
      giftFriendly: truthy(top.row.gift_friendly),
      giftConfidence: top.row.gift_confidence,
      evidenceCount: top.evidenceCount,
      sourceCount: top.sourceCount,
      ownershipRisk: top.row.common_ownership_risk,
      reason: top.reasonSelected,
      manual,
      row: top.row,
    });

    csvRows.push({
      age_band_id: ageBandId,
      cluster_rank: clusterRank,
      cluster_entity_id: clusterId,
      cluster_label: clusterLabel,
      selected_for_stage3: true,
      category_rank: top.category_rank,
      category_entity_id: top.row.category_entity_id,
      category_type_slug: top.row.category_entity_id,
      category_label: top.row.category_label,
      priority_score: top.score,
      buyer_mode_label: top.row.buyer_mode_label,
      primary_persona: top.row.primary_persona,
      gift_friendly: truthy(top.row.gift_friendly),
      show_gift_action: truthy(top.row.show_gift_action),
      gift_display_eligible: truthy(top.row.gift_display_eligible),
      gift_confidence: top.row.gift_confidence,
      common_ownership_risk: top.row.common_ownership_risk,
      evidence_count: top.evidenceCount,
      source_count: top.sourceCount,
      stage3_research_input_filename: `ember_picks_${token}_${top.row.category_entity_id}.json`,
      stage3_ingestion_bundle_hint: `stage3_ingestion_bundle_${token}.json`,
      reason_selected: top.reasonSelected,
      manual_review_flag: manual,
    });
  }

  // Extra manual flags: strong evidence but blocked by render_rule
  for (const row of rows) {
    if (String(row.content_type) !== 'product_category') continue;
    if (String(row.render_rule).trim() === 'product_actions') continue;
    const ev = idList(row.evidence_ids).length;
    if (ev >= 3) {
      manualFlags.push({
        type: 'strong evidence but excluded by render_rule',
        detail: `${row.category_label} (render_rule=${row.render_rule}; evidence=${ev})`,
      });
    }
  }

  shortlist.sort((a, b) => a.clusterRank - b.clusterRank);
  noPick.sort((a, b) => a.clusterRank - b.clusterRank);
  csvRows.sort((a, b) => num(a.cluster_rank, 999) - num(b.cluster_rank, 999));

  const mdPath = path.join(outDir, `stage3_shortlist_${token}.md`);
  const csvPath = path.join(outDir, `stage3_shortlist_${token}.csv`);
  fs.mkdirSync(outDir, { recursive: true });

  const md = [];
  md.push(`# Stage 3 research shortlist — ${token}`);
  md.push('');
  md.push(`Source: \`${path.basename(filePath)}\` · sheet \`discover_projection\``);
  md.push('');
  md.push('## 1. Summary');
  md.push('');
  md.push(`| Metric | Value |`);
  md.push(`|--------|-------|`);
  md.push(`| age_band_id | ${ageBandId} |`);
  md.push(`| total Stage 1 clusters | ${byCluster.size} |`);
  md.push(`| clusters with a Stage 3 candidate | ${shortlist.length} |`);
  md.push(`| clusters without a Stage 3 candidate | ${noPick.length} |`);
  md.push(`| total eligible product-action rows considered | ${eligibleTotal} |`);
  md.push('');
  md.push(
    '**MVP launch principle:** at least one Stage 2 card with Stage 3 recommendations under every Stage 1 parent card (where an eligible product row exists).',
  );
  md.push('');

  md.push('## 2. Stage 3 shortlist');
  md.push('');
  md.push(
    '| Stage 1 rank | Stage 1 card | Selected Stage 2 card | category_entity_id | category_type_slug | priority_score | buyer_mode_label | primary_persona | gift_friendly | gift_confidence | evidence_count | source_count | common_ownership_risk | stage3_research_input_filename | reason_selected |',
  );
  md.push(
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
  );
  for (const s of shortlist) {
    const researchFile = `ember_picks_${token}_${s.categoryEntityId}.json`;
    md.push(
      `| ${s.clusterRank} | ${s.clusterLabel} | ${s.categoryLabel} | \`${s.categoryEntityId}\` | \`${s.categoryEntityId}\` | ${s.score} | ${s.buyer} | ${s.persona} | ${s.giftFriendly} | ${s.giftConfidence} | ${s.evidenceCount} | ${s.sourceCount} | ${s.ownershipRisk} | \`${researchFile}\` | ${s.reason} |`,
    );
  }
  md.push('');

  md.push('## 3. Clusters with no Stage 3 product pick');
  md.push('');
  if (!noPick.length) {
    md.push('_None — every Stage 1 cluster has an eligible product candidate._');
  } else {
    md.push(
      '| Stage 1 rank | Stage 1 card | reason_no_pick | dominant_content_types | relevant render_rule values | recommendation |',
    );
    md.push('|---|---|---|---|---|---|');
    for (const n of noPick) {
      md.push(
        `| ${n.clusterRank} | ${n.clusterLabel} | ${n.reason} | ${n.contentTypes} | ${n.renderRules} | ${n.recommendation} |`,
      );
    }
  }
  md.push('');

  md.push('## 4. Excluded rows audit');
  md.push('');
  const auditOrder = [
    'not product_category',
    'show_ember_picks is FALSE',
    'render_rule is not product_actions',
    'is_physical_product is not TRUE',
    'needs_research is TRUE',
    'missing category_entity_id',
    'missing category_label',
  ];
  for (const reason of auditOrder) {
    const list = excludedAudit.get(reason) || [];
    md.push(`### ${reason} (${list.length})`);
    if (!list.length) {
      md.push('_None_');
    } else {
      for (const r of list.slice(0, 40)) {
        md.push(
          `- [${r.cluster_label_parent_friendly || r.cluster_label}] ${r.category_label || '(no label)'} (\`${r.category_entity_id || 'n/a'}\`)`,
        );
      }
      if (list.length > 40) md.push(`- …and ${list.length - 40} more`);
    }
    md.push('');
  }

  md.push('## 5. Manual review flags');
  md.push('');
  if (!manualFlags.length) {
    md.push('_None_');
  } else {
    const byType = new Map();
    for (const f of manualFlags) {
      if (!byType.has(f.type)) byType.set(f.type, []);
      byType.get(f.type).push(f.detail);
    }
    for (const [type, details] of byType) {
      md.push(`### ${type}`);
      for (const d of details) md.push(`- ${d}`);
      md.push('');
    }
  }

  fs.writeFileSync(mdPath, md.join('\n'), 'utf8');

  const csvHeader = [
    'age_band_id',
    'cluster_rank',
    'cluster_entity_id',
    'cluster_label',
    'selected_for_stage3',
    'category_rank',
    'category_entity_id',
    'category_type_slug',
    'category_label',
    'priority_score',
    'buyer_mode_label',
    'primary_persona',
    'gift_friendly',
    'show_gift_action',
    'gift_display_eligible',
    'gift_confidence',
    'common_ownership_risk',
    'evidence_count',
    'source_count',
    'stage3_research_input_filename',
    'stage3_ingestion_bundle_hint',
    'reason_selected',
    'manual_review_flag',
  ];
  const csvLines = [
    csvHeader.join(','),
    ...csvRows.map((r) => csvHeader.map((h) => csvEscape(r[h])).join(',')),
  ];
  fs.writeFileSync(csvPath, csvLines.join('\n'), 'utf8');

  return {
    ageBandId,
    token,
    clusters: byCluster.size,
    withPick: shortlist.length,
    withoutPick: noPick.length,
    eligibleTotal,
    mdPath,
    csvPath,
    shortlist,
    noPick,
  };
}

const { outDir, files } = parseArgs(process.argv.slice(2));
if (!files.length) {
  console.error(
    'Usage: node web/scripts/export-stage3-research-shortlist.mjs [--out=dir] <workbook.xlsx>',
  );
  process.exit(1);
}

for (const file of files) {
  const result = runWorkbook(path.resolve(file), outDir);
  console.log(
    JSON.stringify(
      {
        age_band_id: result.ageBandId,
        clusters: result.clusters,
        with_stage3_candidate: result.withPick,
        without_stage3_candidate: result.withoutPick,
        eligible_rows: result.eligibleTotal,
        markdown: result.mdPath,
        csv: result.csvPath,
        shortlist: result.shortlist.map((s) => ({
          stage1: s.clusterLabel,
          stage2: s.categoryLabel,
          score: s.score,
        })),
        no_pick: result.noPick.map((n) => ({
          stage1: n.clusterLabel,
          reason: n.reason,
          recommendation: n.recommendation,
        })),
      },
      null,
      2,
    ),
  );
}
