/**
 * Build a standard Stage 3 Pip's Picks ingestion bundle from research JSON.
 *
 * This is intentionally a generator, not a database mutator. It makes the
 * ingestion step deterministic: validate research, emit a canonical bundle,
 * QA notes, and a Supabase migration that uses the established Stage 3 table,
 * RLS, public-pick gating, and dormant backup pattern.
 *
 * Usage:
 *   node web/scripts/ingest-stage3-pips-picks.mjs --age-band=34-36m --inputs=agent-tools/exports/ember_picks_34-36m_*.json
 *   node web/scripts/ingest-stage3-pips-picks.mjs --age-band=34-36m --timestamp=20260717110000 path/to/a.json path/to/b.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DEFAULT_OUT_DIR = path.join(repoRoot, 'agent-tools', 'exports');
const DEFAULT_MIGRATION_DIR = path.join(repoRoot, 'supabase', 'migrations');

const BANNED_COPY = [
  'magic',
  'unlock',
  'optimise',
  'essential',
  'must-have',
  'research-backed',
  'developmental domain',
  'stage-based',
  'proactive parenting',
  'accelerate development',
  'another spiral',
  'endless tabs',
  '40 tabs',
  'six months behind',
];

function parseArgs(argv) {
  const args = {
    ageBand: '',
    inputs: [],
    outDir: DEFAULT_OUT_DIR,
    migrationDir: DEFAULT_MIGRATION_DIR,
    timestamp: timestampToken(new Date()),
    dryRun: false,
    /** How many picks are card-visible (paid members see all; pick 1 is free). */
    visibleCount: 5,
  };

  for (const arg of argv) {
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg.startsWith('--age-band=')) args.ageBand = arg.slice('--age-band='.length);
    else if (arg.startsWith('--visible-count=')) {
      const n = Number(arg.slice('--visible-count='.length));
      if (!Number.isFinite(n) || n < 1 || n > 10) {
        throw new Error('--visible-count must be an integer from 1 to 10');
      }
      args.visibleCount = Math.floor(n);
    }
    else if (arg.startsWith('--inputs=')) {
      const inputList = arg.slice('--inputs='.length).split(',').map((part) => part.trim()).filter(Boolean);
      for (const input of inputList) args.inputs.push(...expandInputs(input));
    }
    else if (arg.startsWith('--out=')) args.outDir = path.resolve(arg.slice('--out='.length));
    else if (arg.startsWith('--migration-dir=')) args.migrationDir = path.resolve(arg.slice('--migration-dir='.length));
    else if (arg.startsWith('--timestamp=')) args.timestamp = arg.slice('--timestamp='.length);
    else if (!arg.startsWith('-')) args.inputs.push(...expandInputs(arg));
  }

  args.inputs = [...new Set(args.inputs.map((p) => path.resolve(p)))].filter((p) =>
    /^ember_picks_.+_cat_[a-z0-9_]+\.json$/i.test(path.basename(p)),
  );
  return args;
}

function expandInputs(pattern) {
  if (!/[*?]/.test(pattern)) return [pattern];
  const abs = path.resolve(pattern);
  const dir = path.dirname(abs);
  const base = path.basename(abs);
  const re = new RegExp(
    '^' +
      base
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.') +
      '$'
  );
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((name) => re.test(name)).map((name) => path.join(dir, name));
}

function timestampToken(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function bandToken(ageBandId) {
  return String(ageBandId || 'unknown').replace(/^age_/, '').replace(/_/g, '-');
}

function sqlString(value) {
  return `'${String(value ?? '').replace(/'/g, "''")}'`;
}

function sqlText(value) {
  const s = String(value ?? '').trim();
  return s ? sqlString(s) : 'NULL';
}

function sqlBool(value) {
  return value ? 'true' : 'false';
}

function sqlArray(values) {
  const list = Array.isArray(values) ? values.filter(Boolean) : [];
  return `ARRAY[${list.map(sqlString).join(', ')}]::text[]`;
}

function field(obj, key, fallback = '') {
  const v = obj?.[key];
  return v === null || v === undefined ? fallback : v;
}

function firstField(obj, keys, fallback = '') {
  for (const key of keys) {
    const v = obj?.[key];
    if (v !== null && v !== undefined && String(v).trim() !== '') return v;
  }
  return fallback;
}

function compactText(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join('; ');
  return value === null || value === undefined ? '' : String(value);
}

function priceText(item) {
  const explicit = firstField(item, ['price_text', 'price']);
  if (explicit) return explicit;
  const gbp = item?.price_gbp;
  return typeof gbp === 'number' ? `GBP ${gbp.toFixed(2)}` : '';
}

function sanitizeParentCopy(value) {
  return compactText(value)
    .replace(/\bbaby essentials\b/gi, 'baby kit')
    .replace(/\ban essential\b/gi, 'a useful basic')
    .replace(/\bessential basic\b/gi, 'useful basic')
    .replace(/\bessentials\b/gi, 'useful basics')
    .replace(/\bessential\b/gi, 'useful')
    .replace(/\bmust-haves?\b/gi, 'useful option')
    .replace(/\bmust have\b/gi, 'worth considering')
    .replace(/\bunlock(?:s|ing|ed)?\b/gi, 'open up')
    .replace(/\bmagic\b/gi, 'helpful')
    .replace(/\boptimise\b/gi, 'improve')
    .replace(/\boptimize\b/gi, 'improve');
}

function founderQaFlag(item) {
  const flag = String(item?.founder_qa_flag ?? '').trim();
  return flag || 'none';
}

function hasBannedCopy(text) {
  const lower = String(text ?? '').toLowerCase();
  return BANNED_COPY.filter((term) => lower.includes(term));
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

const PROMOTE_BEST_FOR_TAGS = [
  'Best for budgets',
  'Best for small spaces',
  'Best for borrowing first',
  'Best for gifting',
  'Best for growing with them',
];

function wordCount(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function clipWords(text, maxWords) {
  const words = String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length <= maxWords) return words.join(' ');
  return `${words.slice(0, maxWords).join(' ')}`;
}

function ensureBestForTag(tag, fallbackIndex) {
  const raw = String(tag || '').trim();
  if (/^best for\b/i.test(raw)) return raw.replace(/^best for/i, 'Best for');
  if (raw) return `Best for ${clipWords(raw, 6)}`;
  return PROMOTE_BEST_FOR_TAGS[fallbackIndex % PROMOTE_BEST_FOR_TAGS.length];
}

/**
 * Promote longlist rows into visible Top Picks when founder asks for a broader
 * paid set (e.g. 10). Synthesises card-ready fields where Manus left backups thin.
 */
function expandVisiblePicks(topPicks, longlist, stage2, visibleCount) {
  const sortedTop = [...topPicks].sort((a, b) => Number(a.rank) - Number(b.rank));
  if (sortedTop.length >= visibleCount) {
    return sortedTop.slice(0, visibleCount).map((pick, index) => ({
      ...pick,
      rank: index + 1,
      longlist_rank: Number(pick.longlist_rank || index + 1),
    }));
  }

  const usedNames = new Set(sortedTop.map((pick) => String(pick.product_name || '').toLowerCase()));
  const candidates = [...longlist]
    .filter((item) => {
      const name = String(item.product_name || '').toLowerCase();
      if (!name || usedNames.has(name)) return false;
      if (item.included_in_top_5 === true || item.status === 'pick') return false;
      return true;
    })
    .sort((a, b) => Number(a.longlist_rank) - Number(b.longlist_rank));

  const expanded = [...sortedTop];
  let promoteIndex = 0;
  while (expanded.length < visibleCount && promoteIndex < candidates.length) {
    const item = candidates[promoteIndex];
    promoteIndex += 1;
    const reason = firstField(item, ['summary_reason', 'reason', 'caveat_short', 'ember_verdict']);
    const description =
      sanitizeParentCopy(firstField(item, ['product_description_under_30_words', 'description'])) ||
      sanitizeParentCopy(
        clipWords(
          [item.brand, item.product_name].filter(Boolean).join(' — ') || 'Product option from the research longlist.',
          28
        )
      );
    const verdict =
      sanitizeParentCopy(reason) ||
      sanitizeParentCopy(
        `Kept as a wider-choice Pip's Pick for founder stress-testing. Compare fit, ownership risk and whether it earns a place over the core five.`
      );
    const hasUrl = Boolean(firstField(item, ['product_url', 'url']));
    const promoted = normalizeTopPick(
      {
        ...item,
        rank: expanded.length + 1,
        longlist_rank: Number(item.longlist_rank || expanded.length + 1),
        best_for_tag: ensureBestForTag(item.best_for_tag || item.best_for, expanded.length - sortedTop.length),
        product_description_under_30_words: description,
        ember_verdict: verdict,
        why_it_fits: verdict,
        product_url: firstField(item, ['product_url', 'url']),
        founder_qa_flag: hasUrl ? 'check_claim' : 'check_url',
        evidence_tier: firstField(item, ['evidence_tier'], 'emerging'),
        buy_borrow_hold_off: firstField(item, ['buy_borrow_hold_off'], 'borrow'),
        promoted_from_longlist: true,
      },
      stage2
    );
    usedNames.add(String(promoted.product_name || '').toLowerCase());
    expanded.push(promoted);
  }

  return expanded.map((pick, index) => ({
    ...pick,
    rank: index + 1,
    longlist_rank: Number(pick.longlist_rank || index + 1),
    best_for_tag: ensureBestForTag(pick.best_for_tag, index),
  }));
}

function normalizeResearch(filePath, forcedAgeBand, visibleCount = 5) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const doc = JSON.parse(raw);
  const ageBandId = forcedAgeBand || doc.age_band || doc.age_band_id;
  const stage1 = doc.stage1 ?? {};
  const stage2 = doc.stage2 ?? {};
  const categoryEntityId = firstField(doc, ['category_entity_id'], firstField(stage2, ['category_entity_id', 'category_type_slug']));
  const categoryLabel = firstField(doc, ['category_label'], firstField(stage2, ['category_label']));
  const clusterEntityId = firstField(doc, ['cluster_entity_id'], firstField(stage1, ['cluster_entity_id']));
  const clusterLabel = firstField(doc, ['cluster_label'], firstField(stage1, ['cluster_label']));
  let topPicks = asArray(doc.top_picks).map((pick) => normalizeTopPick(pick, stage2));
  const longlist = normalizeLonglist(asArray(doc.longlist), topPicks);
  topPicks = expandVisiblePicks(topPicks, longlist, stage2, visibleCount);
  const skips = asArray(doc.skips);

  const errors = [];
  const warnings = [];

  if (!['ember_picks_research_v2', 'ember_picks_research_v3'].includes(doc.schema_version)) {
    errors.push(`Expected schema_version ember_picks_research_v2 or ember_picks_research_v3, got ${doc.schema_version || '(blank)'}`);
  }
  if (!ageBandId) errors.push('Missing age_band_id');
  if (!categoryEntityId) errors.push('Missing category_entity_id');
  if (topPicks.length !== visibleCount) {
    errors.push(`Expected exactly ${visibleCount} visible top_picks after expansion, got ${topPicks.length}`);
  }
  if (longlist.length < Math.max(visibleCount, 10)) {
    warnings.push(`Longlist is short (${longlist.length}); expected at least ${Math.max(visibleCount, 10)} for a ${visibleCount}-pick visible set`);
  } else if (visibleCount <= 5 && longlist.length < 15) {
    errors.push(`Expected at least 15 longlist entries, got ${longlist.length}`);
  } else if (visibleCount > 5 && longlist.length < 15) {
    warnings.push(`Expected 15 longlist entries for classic depth, got ${longlist.length}`);
  }
  if (skips.length < 5) warnings.push(`Expected at least 5 skips, got ${skips.length}`);

  const longlistRanks = new Set(longlist.map((item) => Number(item.longlist_rank)).filter(Number.isFinite));
  const topNames = new Set(topPicks.map((pick) => String(pick.product_name || '').toLowerCase()));
  for (const pick of topPicks) {
    const rank = Number(pick.rank);
    if (!Number.isFinite(rank) || rank < 1 || rank > visibleCount) {
      errors.push(`Top pick has invalid rank: ${field(pick, 'product_name', '(unnamed)')}`);
    }
    if (!field(pick, 'best_for_tag')) errors.push(`Top pick missing best_for_tag: ${field(pick, 'product_name', '(unnamed)')}`);
    if (!/^best for\b/i.test(String(pick.best_for_tag || ''))) {
      errors.push(`best_for_tag must start with "Best for": ${field(pick, 'product_name', '(unnamed)')}`);
    }
    if (!field(pick, 'product_description_under_30_words')) {
      errors.push(`Top pick missing product_description_under_30_words: ${field(pick, 'product_name', '(unnamed)')}`);
    } else {
      const n = wordCount(pick.product_description_under_30_words);
      if (n < 20 || n > 40) {
        errors.push(
          `Description must be 20–40 words (got ${n}): ${field(pick, 'product_name', '(unnamed)')}`,
        );
      }
    }
    if (!field(pick, 'ember_verdict')) errors.push(`Top pick missing ember_verdict: ${field(pick, 'product_name', '(unnamed)')}`);
    if (!field(pick, 'product_url') && founderQaFlag(pick) === 'none') {
      errors.push(`Top pick missing product_url without founder_qa_flag: ${field(pick, 'product_name', '(unnamed)')}`);
    }
    if (!longlistRanks.has(Number(pick.longlist_rank))) {
      warnings.push(`Top pick not matched to longlist_rank ${pick.longlist_rank}: ${field(pick, 'product_name', '(unnamed)')}`);
    }
    const banned = hasBannedCopy(
      [
        pick.product_description_under_30_words,
        pick.ember_verdict,
        pick.why_it_fits,
        pick.caveats,
        pick.gift_note,
        pick.ownership_note,
        pick.safety_notes,
      ].join(' ')
    );
    if (banned.length) errors.push(`Banned copy in ${field(pick, 'product_name', '(unnamed)')}: ${banned.join(', ')}`);
  }

  const backups = longlist
    .filter((item) => {
      const rank = Number(item.longlist_rank);
      const name = String(item.product_name || '').toLowerCase();
      if (topNames.has(name)) return false;
      const included = item.included_in_top_5 === true || item.status === 'pick' || Number(item.top_pick_rank) > 0;
      return Number.isFinite(rank) && rank > visibleCount && rank <= 15 && !included;
    })
    .sort((a, b) => Number(a.longlist_rank) - Number(b.longlist_rank));

  const expectedBackupFloor = Math.max(0, 15 - visibleCount);
  if (backups.length < expectedBackupFloor) {
    warnings.push(`Expected at least ${expectedBackupFloor} dormant backups after visible ${visibleCount}, got ${backups.length}`);
  }

  return {
    source_file: path.relative(repoRoot, filePath).replace(/\\/g, '/'),
    schema_version: doc.schema_version,
    research_date: doc.research_date,
    researcher: doc.researcher,
    age_band_id: ageBandId,
    category_entity_id: categoryEntityId,
    category_label: categoryLabel,
    cluster_entity_id: clusterEntityId,
    cluster_label: clusterLabel,
    qa_summary: doc.qa_summary ?? {},
    visible_count: visibleCount,
    top_picks: [...topPicks].sort((a, b) => Number(a.rank) - Number(b.rank)),
    backup_picks: backups,
    skips,
    errors,
    warnings,
    ingestion_ready: errors.length === 0 ? 'pass' : 'fail',
  };
}

function normalizeTopPick(pick, stage2) {
  const rank = Number(pick.rank);
  const safetyNotes = compactText(firstField(pick, ['safety_notes'], firstField(stage2, ['safety_note_public'])));
  const description = sanitizeParentCopy(firstField(pick, ['product_description_under_30_words', 'description', 'ui_description']));
  const verdict = sanitizeParentCopy(firstField(pick, ['ember_verdict', 'why_pip_picked_this']));
  const productUrl = firstField(pick, ['product_url', 'url']);
  const existingFlag = firstField(pick, ['founder_qa_flag', 'qa_flag'], pick.url_status === 'verified_direct' ? 'none' : firstField(pick, ['url_status', 'qa_note'], 'none'));
  const founderFlag = !productUrl && (existingFlag === 'none' || !existingFlag) ? 'check_url' : existingFlag || 'none';
  return {
    ...pick,
    rank,
    longlist_rank: Number(pick.longlist_rank || pick.rank),
    product_name: firstField(pick, ['product_name', 'name']),
    best_for_tag: ensureBestForTag(firstField(pick, ['best_for_tag', 'best_for']), Math.max(0, rank - 1)),
    product_url: productUrl,
    price_text: priceText(pick),
    stock_status: firstField(pick, ['stock_status', 'availability']),
    description,
    product_description_under_30_words: description,
    why_pip_picked_this: verdict,
    ember_verdict: verdict,
    why_it_fits: sanitizeParentCopy(firstField(pick, ['why_it_fits'], verdict)),
    safety_notes: safetyNotes,
    gift_suitable: pick.gift_suitable ?? stage2.gift_friendly ?? null,
    gift_note: firstField(pick, ['gift_note'], firstField(stage2, ['buyer_mode_label'])),
    founder_qa_flag: founderFlag,
  };
}

function normalizeLonglist(longlist, topPicks) {
  const topNames = new Set(topPicks.map((pick) => String(pick.product_name || '').toLowerCase()));
  return longlist.map((item, index) => {
    const longlistRank = Number(item.longlist_rank || index + 1);
    const productName = firstField(item, ['product_name', 'name']);
    const isTopPick =
      item.included_in_top_5 === true ||
      item.status === 'pick' ||
      item.include_status === 'top_pick' ||
      Number(item.top_pick_rank) > 0 ||
      topNames.has(String(productName).toLowerCase());
    return {
      ...item,
      longlist_rank: longlistRank,
      product_name: productName,
      product_url: firstField(item, ['product_url', 'url']),
      best_for_tag: firstField(item, ['best_for_tag', 'best_for']),
      price_text: priceText(item),
      stock_status: firstField(item, ['stock_status', 'availability']),
      included_in_top_5: isTopPick,
      summary_reason: firstField(item, ['summary_reason', 'reason']),
    };
  });
}

function visibleTuple(category, pick) {
  const rank = Number(pick.rank);
  return [
    sqlString(category.category_entity_id),
    rank,
    Number(pick.longlist_rank || rank),
    sqlString('visible'),
    'true',
    sqlBool(rank > 1),
    sqlText(pick.best_for_tag),
    sqlText(pick.product_name),
    sqlText(pick.brand),
    sqlText(pick.retailer),
    sqlText(pick.product_url),
    sqlText(pick.image_url),
    sqlText(pick.price_text),
    sqlText(pick.stock_status),
    sqlText(pick.age_mark_on_listing),
    sqlText(pick.product_description_under_30_words),
    sqlText(pick.ember_verdict),
    sqlText(pick.why_it_fits),
    sqlText(pick.caveats),
    sqlText(pick.buy_borrow_hold_off),
    pick.gift_suitable === undefined || pick.gift_suitable === null ? 'NULL' : sqlBool(Boolean(pick.gift_suitable)),
    sqlText(pick.gift_note),
    sqlText(pick.ownership_note),
    sqlText(pick.safety_notes),
    sqlText(pick.evidence_tier),
    sqlArray(pick.evidence_sources),
    sqlText(founderQaFlag(pick)),
  ].join(', ');
}

function backupTuple(category, item) {
  const rank = Number(item.longlist_rank);
  return [
    sqlString(category.category_entity_id),
    rank,
    sqlText(item.product_name),
    sqlText(item.brand),
    sqlText(item.best_for_tag),
    sqlText(item.product_url),
    sqlText(item.retailer),
    sqlText(item.price_text),
    sqlText(item.stock_status),
    sqlText(item.age_mark_on_listing),
    sqlText(item.evidence_tier),
    sqlText(item.buy_borrow_hold_off),
    item.gift_suitable === undefined || item.gift_suitable === null ? 'NULL' : sqlBool(Boolean(item.gift_suitable)),
    sqlText(item.caveat_short || item.summary_reason),
  ].join(', ');
}

function buildMigration(bundle, timestamp) {
  const ageBandId = bundle.age_band_id;
  const categories = bundle.categories;
  const categorySlugs = categories.map((c) => c.category_entity_id);
  const visibleRows = categories.flatMap((c) => c.top_picks.map((pick) => `    (${visibleTuple(c, pick)})`));
  const backupRows = categories.flatMap((c) => c.backup_picks.map((item) => `    (${backupTuple(c, item)})`));
  const visibleCount = Number(bundle.visible_count || 5);
  const expectedVisible = categories.length * visibleCount;
  const expectedBackups = backupRows.length;

  return `-- Generated by web/scripts/ingest-stage3-pips-picks.mjs
-- Bundle: agent-tools/exports/stage3_ingestion_bundle_${bandToken(ageBandId)}.json

BEGIN;

CREATE TABLE IF NOT EXISTS public.pl_stage3_picks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_band_id TEXT NOT NULL REFERENCES public.pl_age_bands(id) ON DELETE RESTRICT,
  category_type_id UUID NOT NULL REFERENCES public.pl_category_types(id) ON DELETE CASCADE,
  source_category_entity_id TEXT NOT NULL,
  pick_rank INTEGER NOT NULL CHECK (pick_rank > 0),
  longlist_rank INTEGER NOT NULL CHECK (longlist_rank > 0),
  status TEXT NOT NULL CHECK (status IN ('visible', 'backup', 'skip')),
  is_visible BOOLEAN NOT NULL DEFAULT true,
  is_locked BOOLEAN NOT NULL DEFAULT true,
  best_for_tag TEXT,
  product_name TEXT NOT NULL,
  brand TEXT,
  retailer TEXT,
  product_url TEXT,
  image_url TEXT,
  price_text TEXT,
  stock_status TEXT,
  age_mark_on_listing TEXT,
  product_description TEXT,
  ember_verdict TEXT,
  why_it_fits TEXT,
  caveats TEXT,
  buy_borrow_hold_off TEXT,
  gift_suitable BOOLEAN,
  gift_note TEXT,
  ownership_note TEXT,
  safety_notes TEXT,
  evidence_tier TEXT,
  evidence_sources TEXT[],
  founder_qa_flag TEXT,
  research_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pl_stage3_picks_unique UNIQUE (age_band_id, category_type_id, pick_rank, status)
);

ALTER TABLE public.pl_stage3_picks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pl_stage3_picks_public_read" ON public.pl_stage3_picks;
CREATE POLICY "pl_stage3_picks_public_read" ON public.pl_stage3_picks
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'visible'
    AND is_visible = true
    AND (
      is_locked = false
      OR lower(coalesce(auth.jwt() ->> 'email', '')) = 'timwd23@gmail.com'
      OR lower(coalesce(auth.jwt() -> 'app_metadata' ->> 'membership_type', '')) = 'ember_plus'
    )
  );

DROP POLICY IF EXISTS "pl_stage3_picks_admin_all" ON public.pl_stage3_picks;
CREATE POLICY "pl_stage3_picks_admin_all" ON public.pl_stage3_picks
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT SELECT ON public.pl_stage3_picks TO anon, authenticated;

CREATE INDEX IF NOT EXISTS pl_stage3_picks_age_category_rank_idx
  ON public.pl_stage3_picks(age_band_id, category_type_id, status, pick_rank);

DROP TRIGGER IF EXISTS trg_pl_stage3_picks_updated_at ON public.pl_stage3_picks;
CREATE TRIGGER trg_pl_stage3_picks_updated_at
  BEFORE UPDATE ON public.pl_stage3_picks
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP VIEW IF EXISTS public.v_gateway_stage3_picks_public;
CREATE VIEW public.v_gateway_stage3_picks_public
WITH (security_invoker = true) AS
SELECT
  s.id,
  s.age_band_id,
  s.category_type_id,
  ct.slug AS category_type_slug,
  s.source_category_entity_id,
  s.pick_rank,
  s.longlist_rank,
  s.status,
  s.is_visible,
  s.is_locked,
  s.best_for_tag,
  s.product_name,
  s.brand,
  s.retailer,
  s.product_url,
  s.image_url,
  s.price_text,
  s.stock_status,
  s.age_mark_on_listing,
  s.product_description,
  s.ember_verdict,
  s.why_it_fits,
  s.caveats,
  s.buy_borrow_hold_off,
  s.gift_suitable,
  s.gift_note,
  s.ownership_note,
  s.safety_notes,
  s.evidence_tier,
  s.evidence_sources,
  s.founder_qa_flag,
  s.research_payload
FROM public.pl_stage3_picks s
JOIN public.pl_category_types ct ON ct.id = s.category_type_id
WHERE s.status = 'visible'
  AND s.is_visible = true
  AND s.is_locked = false;

GRANT SELECT ON public.v_gateway_stage3_picks_public TO anon, authenticated;

DELETE FROM public.pl_stage3_picks
WHERE age_band_id = ${sqlString(ageBandId)}
  AND source_category_entity_id IN (${categorySlugs.map(sqlString).join(', ')});

WITH stage3_rows AS (
  SELECT *
  FROM (VALUES
${visibleRows.join(',\n')}
  ) AS v(source_category_entity_id, pick_rank, longlist_rank, status, is_visible, is_locked, best_for_tag, product_name, brand, retailer, product_url, image_url, price_text, stock_status, age_mark_on_listing, product_description, ember_verdict, why_it_fits, caveats, buy_borrow_hold_off, gift_suitable, gift_note, ownership_note, safety_notes, evidence_tier, evidence_sources, founder_qa_flag)
)
INSERT INTO public.pl_stage3_picks (
  age_band_id,
  category_type_id,
  source_category_entity_id,
  pick_rank,
  longlist_rank,
  status,
  is_visible,
  is_locked,
  best_for_tag,
  product_name,
  brand,
  retailer,
  product_url,
  image_url,
  price_text,
  stock_status,
  age_mark_on_listing,
  product_description,
  ember_verdict,
  why_it_fits,
  caveats,
  buy_borrow_hold_off,
  gift_suitable,
  gift_note,
  ownership_note,
  safety_notes,
  evidence_tier,
  evidence_sources,
  founder_qa_flag,
  research_payload
)
SELECT
  ${sqlString(ageBandId)},
  ct.id,
  r.source_category_entity_id,
  r.pick_rank,
  r.longlist_rank,
  r.status,
  r.is_visible,
  r.is_locked,
  r.best_for_tag,
  r.product_name,
  r.brand,
  r.retailer,
  r.product_url,
  r.image_url,
  r.price_text,
  r.stock_status,
  r.age_mark_on_listing,
  r.product_description,
  r.ember_verdict,
  r.why_it_fits,
  r.caveats,
  r.buy_borrow_hold_off,
  r.gift_suitable,
  r.gift_note,
  r.ownership_note,
  r.safety_notes,
  r.evidence_tier,
  r.evidence_sources,
  r.founder_qa_flag,
  jsonb_build_object(
    'bundle_schema_version', ${sqlString(bundle.schema_version)},
    'bundle_generated_at', ${sqlString(bundle.generated_at)},
    'research_schema_version', ${sqlString(categories[0]?.schema_version || 'ember_picks_research_v3')},
    'source_category_entity_id', r.source_category_entity_id
  )
FROM stage3_rows r
JOIN public.pl_category_types ct
  ON ct.slug = r.source_category_entity_id
WHERE EXISTS (
  SELECT 1
  FROM public.pl_age_band_development_need_category_types abdnct
  WHERE abdnct.age_band_id = ${sqlString(ageBandId)}
    AND abdnct.category_type_id = ct.id
    AND abdnct.is_active = true
);

WITH backup_rows AS (
  SELECT *
  FROM (VALUES
${backupRows.join(',\n')}
  ) AS v(source_category_entity_id, longlist_rank, product_name, brand, best_for_tag, product_url, retailer, price_text, stock_status, age_mark_on_listing, evidence_tier, buy_borrow_hold_off, gift_suitable, caveat_short)
)
INSERT INTO public.pl_stage3_picks (
  age_band_id,
  category_type_id,
  source_category_entity_id,
  pick_rank,
  longlist_rank,
  status,
  is_visible,
  is_locked,
  best_for_tag,
  product_name,
  brand,
  retailer,
  product_url,
  price_text,
  stock_status,
  age_mark_on_listing,
  caveats,
  buy_borrow_hold_off,
  gift_suitable,
  evidence_tier,
  founder_qa_flag,
  research_payload
)
SELECT
  ${sqlString(ageBandId)},
  ct.id,
  r.source_category_entity_id,
  r.longlist_rank,
  r.longlist_rank,
  'backup',
  false,
  true,
  r.best_for_tag,
  r.product_name,
  r.brand,
  r.retailer,
  r.product_url,
  r.price_text,
  r.stock_status,
  r.age_mark_on_listing,
  r.caveat_short,
  r.buy_borrow_hold_off,
  -- All-NULL VALUES columns are inferred as text; cast for the boolean target column.
  r.gift_suitable::boolean,
  r.evidence_tier,
  'backup_not_card_ready',
  jsonb_build_object(
    'bundle_schema_version', ${sqlString(bundle.schema_version)},
    'bundle_generated_at', ${sqlString(bundle.generated_at)},
    'status', 'dormant_backup',
    'source_category_entity_id', r.source_category_entity_id
  )
FROM backup_rows r
JOIN public.pl_category_types ct
  ON ct.slug = r.source_category_entity_id
WHERE EXISTS (
  SELECT 1
  FROM public.pl_age_band_development_need_category_types abdnct
  WHERE abdnct.age_band_id = ${sqlString(ageBandId)}
    AND abdnct.category_type_id = ct.id
    AND abdnct.is_active = true
);

DO $$
DECLARE
  v_visible_count INTEGER;
  v_backup_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_visible_count
  FROM public.pl_stage3_picks s
  JOIN public.pl_category_types ct ON ct.id = s.category_type_id
  WHERE s.age_band_id = ${sqlString(ageBandId)}
    AND ct.slug IN (${categorySlugs.map(sqlString).join(', ')})
    AND s.status = 'visible'
    AND s.is_visible = true;

  IF v_visible_count <> ${expectedVisible} THEN
    RAISE EXCEPTION 'Expected ${expectedVisible} visible Stage 3 picks for ${ageBandId}, got %', v_visible_count;
  END IF;

  SELECT COUNT(*) INTO v_backup_count
  FROM public.pl_stage3_picks s
  JOIN public.pl_category_types ct ON ct.id = s.category_type_id
  WHERE s.age_band_id = ${sqlString(ageBandId)}
    AND ct.slug IN (${categorySlugs.map(sqlString).join(', ')})
    AND s.status = 'backup'
    AND s.is_visible = false;

  IF v_backup_count <> ${expectedBackups} THEN
    RAISE EXCEPTION 'Expected ${expectedBackups} backup Stage 3 picks for ${ageBandId}, got %', v_backup_count;
  END IF;
END $$;

COMMIT;
`;
}

function buildQaMarkdown(bundle, migrationPath) {
  const lines = [];
  lines.push(`# Stage 3 ingestion bundle QA - ${bundle.age_band_id}`);
  lines.push('');
  lines.push(`Generated: ${bundle.generated_at}`);
  lines.push(`Migration: \`${path.relative(repoRoot, migrationPath).replace(/\\/g, '/')}\``);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('| Category | Top picks | Backups | Skips | Ingestion | Notes |');
  lines.push('|---|---:|---:|---:|---|---|');
  for (const c of bundle.categories) {
    const notes = [...c.errors.map((e) => `ERROR: ${e}`), ...c.warnings.map((w) => `WARN: ${w}`)].join('<br>');
    lines.push(`| ${c.category_label || c.category_entity_id} | ${c.top_picks.length} | ${c.backup_picks.length} | ${c.skips.length} | ${c.ingestion_ready} | ${notes || 'OK'} |`);
  }
  lines.push('');
  lines.push('## Signed-Out API Smoke Template');
  lines.push('');
  lines.push('After the migration is applied and deployed, call:');
  lines.push('');
  lines.push('```powershell');
  lines.push("$r=Invoke-RestMethod 'https://PREVIEW_URL/api/discover/picks?ageBandId=AGE_BAND&categoryTypeId=CATEGORY_TYPE_UUID'");
  lines.push("$r.picks | Select-Object @{n='rank';e={$_.product.rank}}, @{n='name';e={$_.product.name}}, @{n='locked';e={$_.product.is_locked}}, @{n='url';e={$_.product.canonical_url}}");
  lines.push('```');
  lines.push('');
  lines.push(`Expected signed-out result: rank 1 real product with URL; ranks 2-${bundle.visible_count || 5} locked placeholders with no URLs.`);
  return lines.join('\n');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.ageBand || !args.inputs.length) {
    console.error('Usage: node web/scripts/ingest-stage3-pips-picks.mjs --age-band=34-36m [--visible-count=10] --inputs=agent-tools/exports/ember_picks_34-36m_*.json');
    process.exit(1);
  }

  const categories = args.inputs.map((input) => normalizeResearch(input, args.ageBand, args.visibleCount));
  const ageBands = [...new Set(categories.map((c) => c.age_band_id))];
  if (ageBands.length !== 1) {
    throw new Error(`Inputs contain multiple age bands: ${ageBands.join(', ')}`);
  }

  const bundle = {
    schema_version: 'stage3_ingestion_bundle_v1',
    generated_at: new Date().toISOString(),
    age_band_id: ageBands[0],
    visible_count: args.visibleCount,
    locked_from_rank: 2,
    founder_paid_proxy_email: 'timwd23@gmail.com',
    categories,
    acceptance_checks: {
      top_5_per_category: categories.every((c) => c.top_picks.length === args.visibleCount),
      visible_count_per_category: categories.every((c) => c.top_picks.length === args.visibleCount),
      backups_after_visible_per_category: categories.every((c) => c.backup_picks.length >= Math.max(0, 15 - args.visibleCount)),
      no_banned_copy: categories.every((c) => c.errors.every((e) => !e.startsWith('Banned copy'))),
      all_categories_ingestion_ready: categories.every((c) => c.ingestion_ready === 'pass'),
    },
  };

  const token = bandToken(bundle.age_band_id);
  const migrationName = `${args.timestamp}_ingest_stage3_pips_picks_${token.replace(/-/g, '_')}.sql`;
  const bundlePath = path.join(args.outDir, `stage3_ingestion_bundle_${token}.json`);
  const qaPath = path.join(args.outDir, `stage3_ingestion_bundle_${token}_qa.md`);
  const migrationPath = path.join(args.migrationDir, migrationName);
  const migrationSql = buildMigration(bundle, args.timestamp);
  const qaMarkdown = buildQaMarkdown(bundle, migrationPath);

  if (!args.dryRun) {
    fs.mkdirSync(args.outDir, { recursive: true });
    fs.mkdirSync(args.migrationDir, { recursive: true });
    fs.writeFileSync(bundlePath, `${JSON.stringify(bundle, null, 2)}\n`, 'utf8');
    fs.writeFileSync(qaPath, `${qaMarkdown}\n`, 'utf8');
    fs.writeFileSync(migrationPath, migrationSql, 'utf8');
  }

  console.log(
    JSON.stringify(
      {
        age_band_id: bundle.age_band_id,
        categories: categories.map((c) => ({
          category_entity_id: c.category_entity_id,
          top_picks: c.top_picks.length,
          backups: c.backup_picks.length,
          skips: c.skips.length,
          ingestion_ready: c.ingestion_ready,
          errors: c.errors,
          warnings: c.warnings,
        })),
        bundle: bundlePath,
        qa: qaPath,
        migration: migrationPath,
        dry_run: args.dryRun,
      },
      null,
      2
    )
  );

  if (!bundle.acceptance_checks.all_categories_ingestion_ready) process.exit(2);
}

main();
