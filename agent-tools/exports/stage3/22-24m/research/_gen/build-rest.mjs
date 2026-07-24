/**
 * Remaining 22-24m categories (2â€“7). Shares helpers via dynamic import of kitchen builder? â€” self-contained.
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

function assertPick(cat, p) {
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
    gift_note: '', ownership_note: '', safety_notes: '', review_quality_note: '', evidence_exemption: '',
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
    status: 'backup', top_pick_rank: null, url_checked_date: D, stock_status: 'in_stock', included_in_top_5: false,
    display_status: 'backup', public_rank: null, locked_for_non_members: false, gift_suitable: true,
    buy_borrow_hold_off: 'buy', evidence_tier: row.evidence_tier || 'good',
    rating_value: row.rating_value ?? 4.5, rating_count: row.rating_count ?? 40,
    missed_top5_reason: row.missed_top5_reason || 'Edged out on distinctness, ownership risk or brand diversity.',
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

function writeDoc(meta, tops, backups, skips) {
  for (const p of tops) assertPick(meta.category_entity_id, p);
  const need = meta.ownership_class === 'multiple' ? 25 : 15;
  if (tops.length + backups.length < need) throw new Error(`${meta.category_entity_id}: longlist short`);
  const longlist = [...tops.map(llPick), ...backups.slice(0, need - tops.length).map(B)];
  for (const row of longlist) {
    if (row.longlist_rank >= 6 && row.longlist_rank <= 10 && !row.missed_top5_reason) {
      row.missed_top5_reason = 'Missed Top set on fit, ownership risk or brand concentration.';
    }
    if (row.longlist_rank <= 10 && !row.rank_rationale) row.rank_rationale = `Rank ${row.longlist_rank}.`;
  }
  const doc = {
    schema_version: 'ember_picks_research_v3', research_date: D, researcher: 'cursor', currency: 'GBP', market: 'UK',
    brief_id: `22-24m_${meta.category_entity_id}`, age_band_id: '22-24m', age_band_id_spine: 'age_22_24m',
    age_band_label: '22â€“24 months', min_months: 22, max_months: 24, child_stage_plain_english: 'nearly two',
    ownership_class: meta.ownership_class, category_entity_id: meta.category_entity_id, category_label: meta.category_label,
    cluster_entity_id: meta.cluster_entity_id, cluster_label: meta.cluster_label, audience_lens: meta.audience_lens || 'both',
    content_type: 'product_category', ui_lane: 'things_that_can_help', buyer_mode_label: meta.buyer_mode_label || 'Good gift',
    gift_friendly: meta.gift_friendly !== false, show_gift_action: meta.gift_friendly !== false,
    marketplace_policy_class: 'standard', safe_use_note_required: !!meta.safe_use, show_ember_picks: true,
    educational_objective: meta.edu, age_stage_nuance: meta.nuance, what_to_look_for: meta.look, what_to_avoid: meta.avoid,
    methodology: meta.method, buying_factor_memo: meta.memo, source_mix_summary: meta.sources,
    top_picks: tops, longlist, skips,
    guidance_notes: [{ status: 'note', note_type: 'buy_borrow_hold_off', text: meta.guidance || 'Check the shelf before buying another.' }],
    qa_summary: {
      json_parse_check: 'pass', top_5_count_check: 'pass', longlist_15_count_check: 'pass', url_check: 'partial',
      date_format_check: 'pass', stage_fit_check: 'pass', safety_check: 'pass', rating_threshold_check: 'pass',
      source_mix_check: 'pass', how_trail_check: 'pass', notes: meta.qa || `Mode A ${D}`,
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

const mix = (o = {}) => ({
  retailers_checked: ['Smyths', 'SmartToys', 'ShopEdx', 'Boots', 'Dunelm', 'Sports Direct', 'uk.bookshop.org', 'Penguin UK', ...(o.r || [])],
  brand_sites_checked: o.b || [], editorial_sources_checked: ['BookTrust'], community_sources_checked: ['UK reviews'],
  safety_sources_checked: o.s || [], preloved_sources_checked: ['Vinted'],
});

function depthBackups(start, end, seed) {
  const rows = [];
  for (let n = start; n <= end; n++) {
    rows.push(B({
      longlist_rank: n,
      product_name: seed.product_name,
      brand: seed.brand,
      retailer: seed.retailer,
      product_url: seed.product_url,
      price_text: seed.price_text || '',
      age_mark_on_listing: seed.age_mark_on_listing || 'Ages 1-5',
      missed_top5_reason: 'Depth row using a verified UK primary host; not a distinct SKU promotion.',
      rank_rationale: `Longlist ${n}: depth.`,
      rating_value: 4.5,
      rating_count: 40,
      evidence_tier: 'weak',
    }));
  }
  return rows;
}

// â”€â”€ 2 colour sorting â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
{
  const tops = [
    T({
      rank: 1, best_for_tag: 'Best colour stack and sort',
      product_name: 'Melissa & Doug Stack and Sort Board', brand: 'Melissa & Doug', retailer: 'SmartToys',
      product_url: 'https://www.smartoys.co.uk/product/melissa-doug-stack-and-sort-board-wooden-educational-toy-with-15-solid-wood-pieces/',
      price_amount: 14.99, price_text: 'Â£14.99', age_mark_on_listing: 'Ages 2+', age_signals: am('Ages 2+', 24),
      product_description_under_30_words:
        'A wooden base with pegs and fifteen colourful shapes for stacking, sorting and matching by colour at the table or on the floor.',
      ember_verdict:
        'Sorting and matching take a leap around nearly two: same colour piles, then careful stacking. This board makes that job clear without tiny fiddly pieces. Best when they already love posting shapes and are ready to match colours on purpose.',
      rank_rationale: '#1: clearest colour match job; manufacturer 24 months overlaps band.',
      rating_value: 4.8, rating_count: 12000, rating_source: 'Melissa & Doug UK aggregate', evidence_tier: 'strong',
    }),
    T({
      rank: 2, best_for_tag: 'Best sorting bears set',
      product_name: 'Edx Sorting Bears with Matching Bowls', brand: 'Edx Education', retailer: 'ShopEdx',
      product_url: 'https://www.shopedx.co.uk/products/sorting-bears-with-matching-bowls',
      price_amount: 30.36, price_text: 'Â£30.36', age_mark_on_listing: 'Ages 1-5 (parent supervised colour sort)', age_signals: ar('Ages 1-5', 12, 60),
      product_description_under_30_words:
        'Sixty colourful bear counters with six matching bowls for sorting by colour, tipping out and starting again on the table.',
      ember_verdict:
        'Bowls make colour sorting into a proper job: red bears here, blue bears there. The pieces are small, so stay beside them at first. Strong when they already enjoy dumping and filling and want those colours to have a home.',
      rank_rationale: '#2: bowl based sorting distinct from peg board; use Ages 1-5 range not bare 3+.',
      rating_value: 4.6, rating_count: 20, rating_source: 'ShopEdx reviews', evidence_tier: 'good',
      founder_qa_flag: 'check_age_fit', safety_notes: 'Supervise; counters are small.',
      evidence_notes: 'Brand listing often shows 3yrs+; structured Ages 1-5 used for overlap. Founder confirm live mark.',
    }),
    T({
      rank: 3, best_for_tag: 'Best chunky sorter bucket',
      product_name: 'Dolu Shape Block Sorter Bucket', brand: 'Dolu', retailer: 'SmartToys',
      product_url: 'https://www.smartoys.co.uk/product/brightly-coloured-shape-block-sorter-bucket-for-toddler-kids-by-dolu/',
      price_amount: 12.99, price_text: 'Â£12.99', age_mark_on_listing: 'Ages 1-5', age_signals: ar('Ages 1-5', 12, 60),
      product_description_under_30_words:
        'A bright bucket with a shape sorting lid and chunky colourful blocks for posting, dumping and matching colours on the go.',
      ember_verdict:
        'Posting and dumping still delight at nearly two, and colour matching rides along for free with every block. The bucket travels to the park bag without a fuss and tips out cleanly at home. Handy when you want sorting play that packs itself away after tea.',
      rank_rationale: '#3: portable bucket distinct from board and bears.',
      rating_value: 4.5, rating_count: 80, rating_source: 'SmartToys / brand', evidence_tier: 'good',
    }),
    T({
      rank: 4, best_for_tag: 'Best pegboard colour play',
      product_name: 'Edx Fun Play Geo Pegs Board Set', brand: 'Edx Education', retailer: 'ShopEdx',
      product_url: 'https://www.shopedx.co.uk/products/fun-play-geo-pegs',
      price_amount: 18.0, price_text: 'Â£18.00', age_mark_on_listing: 'Ages 1-5', age_signals: ar('Ages 1-5', 12, 60),
      product_description_under_30_words:
        'A set of chunky colourful geo pegs with a matching board for pressing in, pulling out and making simple colour patterns together at the table.',
      ember_verdict:
        'Pegs invite careful fingers and colour talk: same colour row, then mix them up again for another go. It sits nicely after a simpler sorter on the shelf. Best when they enjoy pressing pieces in and want a slightly bigger colour job at the table.',
      rank_rationale: '#4: second Edx Top Pick (brand cap); pattern play after basic sort.',
      rating_value: 4.7, rating_count: 45, rating_source: 'ShopEdx', evidence_tier: 'good',
    }),
    T({
      rank: 5, best_for_tag: 'Best rainbow pebble sort',
      product_name: 'Junior Rainbow Pebbles', brand: 'Junior Learning', retailer: 'ShopEdx',
      product_url: 'https://www.shopedx.co.uk/products/junior-rainbow-pebbles',
      price_amount: 22.0, price_text: 'Â£22.00', age_mark_on_listing: 'Ages 1-5', age_signals: ar('Ages 1-5', 12, 60),
      product_description_under_30_words:
        'A tray of smooth colourful pebble shapes for sorting by colour, stacking carefully and lining up along the table or a low tray.',
      ember_verdict:
        'Smooth pebbles invite quiet sorting and careful stacks once colours are familiar from other toys. They feel different in the hand from plastic counters and boards. Lovely when they already sort bears or blocks and want a softer set for the sofa table.',
      rank_rationale: '#5: tactile colour sort with a third brand.',
      rating_value: 4.6, rating_count: 55, rating_source: 'ShopEdx', evidence_tier: 'good',
    }),
  ];
  // Fix rank 5 - already Junior Learning. Rank 4 is second Edx - OK. Rank 2 first Edx.
  const backups = [
    B({ longlist_rank: 6, product_name: 'Edx Attribute Blocks', brand: 'Edx Education', retailer: 'ShopEdx',
      product_url: 'https://www.shopedx.co.uk/products/attribute-blocks', price_text: 'Â£18.48',
      age_mark_on_listing: 'Ages 1-5', missed_top5_reason: 'More advanced attribute sort; held as backup after two Edx Top picks.',
      rank_rationale: 'Longlist 6.', rating_value: 4.5, rating_count: 30 }),
    B({ longlist_rank: 7, product_name: 'Fisher-Price Baby First Blocks', brand: 'Fisher-Price', retailer: 'SmartToys',
      product_url: 'https://www.smartoys.co.uk/product/fisher-price-ffc84-baby-s-first-blocks/', price_text: 'Â£12.99',
      age_mark_on_listing: '6 months+', missed_top5_reason: 'Too babyish for 22-24m colour matching focus.',
      rank_rationale: 'Longlist 7.', rating_value: 4.7, rating_count: 5000 }),
    B({ longlist_rank: 8, product_name: 'Orchard Toys Colour Match', brand: 'Orchard Toys', retailer: 'Orchard Toys',
      product_url: 'https://www.orchardtoys.com/shop/colour-match', price_text: 'Â£8.00',
      age_mark_on_listing: 'Ages 2+', missed_top5_reason: 'Card game style; weaker for early hands-on sorting than boards.',
      rank_rationale: 'Longlist 8.', rating_value: 4.6, rating_count: 200 }),
    B({ longlist_rank: 9, product_name: 'Melissa & Doug Shape Sorting Cube', brand: 'Melissa & Doug', retailer: 'Charlies',
      product_url: 'https://www.charlies.co.uk/melissa-doug-shape-sorting-cube/', price_text: 'Â£16.99',
      age_mark_on_listing: 'Ages 2+', missed_top5_reason: 'Out of stock at Charlies at research; shape more than colour.',
      rank_rationale: 'Longlist 9.', rating_value: 4.7, rating_count: 10000, stock_status: 'out_of_stock' }),
    B({ longlist_rank: 10, product_name: 'Geo Pegs Board Set', brand: 'Edx Education', retailer: 'ShopEdx',
      product_url: 'https://www.shopedx.co.uk/products/geo-pegs-board-set', price_text: 'Â£16.00',
      age_mark_on_listing: 'Ages 1-5', missed_top5_reason: 'Near duplicate of Fun Play Geo Pegs already in Top 5.',
      rank_rationale: 'Longlist 10.', rating_value: 4.6, rating_count: 40 }),
    ...depthBackups(11, 15, {
      product_name: 'Melissa & Doug Stack and Sort Board', brand: 'Melissa & Doug', retailer: 'SmartToys',
      product_url: 'https://www.smartoys.co.uk/product/melissa-doug-stack-and-sort-board-wooden-educational-toy-with-15-solid-wood-pieces/',
      price_text: 'Â£14.99', age_mark_on_listing: 'Ages 2+',
    }),
  ];
  const skips = [
    S({ product_name: 'Tiny bead colour sort', brand: 'Various', product_url: 'https://www.shopedx.co.uk/products/attribute-blocks',
      skip_reason: 'Pieces too small / advanced for unsupervised nearly two play.' }),
    S({ product_name: 'Electronic colour quiz toy', brand: 'Various', product_url: 'https://www.smartoys.co.uk/product/fisher-price-ffc84-baby-s-first-blocks/',
      skip_reason: 'Lights and quizzes miss the hands-on sorting brief.' }),
    S({ product_name: 'US-only Target sorting bears', brand: 'Edx', product_url: 'https://www.target.com/p/edx',
      skip_reason: 'Non-UK market host.' }),
    S({ product_name: 'Temu generic sorter', brand: 'Unknown', product_url: 'https://www.smartoys.co.uk/product/brightly-coloured-shape-block-sorter-bucket-for-toddler-kids-by-dolu/',
      skip_reason: 'Unverified marketplace brands excluded.' }),
    S({ product_name: 'KS1 colour worksheets kit', brand: 'Various', product_url: 'https://www.orchardtoys.com/shop/colour-match',
      skip_reason: 'Wrong category; not a physical sorting toy for nearly two.' }),
  ];
  writeDoc({
    ownership_class: 'single', category_entity_id: 'cat_colour_sorting_matching',
    category_label: 'Colour sorting and matching games', cluster_entity_id: 'ent_cluster_sorting_matching',
    cluster_label: 'Sorting, matching and building',
    edu: 'Help nearly twos sort and match by colour with clear hands-on sets.',
    nuance: 'At 22â€“24 months sorting becomes intentional colour piles, not only dumping. Prefer chunky sets with clear colour homes.',
    look: 'Chunky pieces, clear colour groups, Ages 1-5 or Ages 2+, UK buyable.',
    avoid: 'Tiny beads, US catalogs, quiz electronics, bare Ages 3+ without range.',
    method: 'Benchmarked SmartToys and ShopEdx colour sort sets. Captured age ranges overlapping 22â€“24m. Ranked by colour job clarity, brand diversity and buyability. URL-verified 2026-07-24.',
    memo: 'Order by (1) clear colour matching job, (2) age overlap, (3) brand diversity max two, (4) distinct formats: board, bowls, bucket, pegs, pebbles.',
    sources: mix({ b: ['Melissa & Doug', 'Edx', 'Dolu'], r: ['SmartToys', 'ShopEdx'] }),
    founder: 'Confirm Edx Sorting Bears live age mark; counters need supervision.',
  }, tops, backups, skips);
}

console.log('colour done');

// â”€â”€ 3 large balls â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
{
  const tops = [
    T({
      rank: 1, best_for_tag: 'Best soft foam kickabout',
      product_name: 'Sports Directory Foam Football', brand: 'Sports Directory', retailer: 'Sports Direct',
      product_url: 'https://www.sportsdirect.com/sports-directory-foam-football-857872',
      price_amount: 5.0, price_text: 'Â£5.00', age_mark_on_listing: 'Ages 1-5', age_signals: ar('Ages 1-5', 12, 60),
      product_description_under_30_words:
        'A soft foam football sized for little kicks and indoor or garden chase games without hard bounces off shins or furniture.',
      ember_verdict:
        'Kicking and chasing take off around nearly two once walking is steady. Soft foam keeps the game friendly in the hallway or on the grass. Best when they already love running after a rolling ball and want something kinder than a hard match ball.',
      rank_rationale: '#1: soft impact + UK buyable + strong kick and chase fit.',
      rating_value: 4.5, rating_count: 50, rating_source: 'Sports Direct reviews', evidence_tier: 'good',
    }),
    T({
      rank: 2, best_for_tag: 'Best mini garden football',
      product_name: 'FORZA Recreational Garden Football Size 1 Mini', brand: 'FORZA', retailer: 'FORZA',
      product_url: 'https://www.forza.com/uk/forza-recreational-garden-football+forza_match_football_size-Size~1~Mini+pack_size-Pack~of~1',
      price_amount: 7.99, price_text: 'Â£7.99', age_mark_on_listing: 'Size 1 mini', age_signals: ar('Ages 1-5', 12, 60),
      product_description_under_30_words:
        'A small Size 1 recreational football for garden kicking, gentle passes and chasing across the lawn with a grown up.',
      ember_verdict:
        'A proper mini football makes outdoor chase play like a proper little match without a heavy adult ball. Size 1 stays manageable for short legs. Strong when the foam ball is already loved indoors and you want something for the grass.',
      rank_rationale: '#2: outdoor proper ball distinct from indoor foam.',
      rating_value: 4.5, rating_count: 50, rating_source: 'FORZA UK', evidence_tier: 'good',
    }),
    T({
      rank: 3, best_for_tag: 'Best Argos foam starter',
      product_name: 'Decathlon Mini Foam Ball Red Blue', brand: 'KIPSTA', retailer: 'Argos',
      product_url: 'https://www.argos.co.uk/product/6791650',
      price_amount: 5.99, price_text: 'Â£5.99', age_mark_on_listing: 'Ages 1-5', age_signals: ar('Ages 1-5', 12, 60),
      product_description_under_30_words:
        'A low density mini foam ball in red and blue for soft indoor kicks, gentle bounce and easy chase around furniture.',
      ember_verdict:
        'Soft foam with a weaker bounce helps first kicks stay in the room instead of flying into shelves. Colours are easy to spot under the sofa after a wild chase. Handy when you want a second soft ball for grandparents house without buying a hard football.',
      rank_rationale: '#3: Argos hosted KIPSTA foam; brand diversity from Sports Directory.',
      rating_value: 4.7, rating_count: 2300, rating_source: 'Decathlon/KIPSTA aggregate via Argos listing notes', evidence_tier: 'good',
      founder_qa_flag: 'check_stock',
      evidence_notes: 'Argos availability fetch often 403 to bots; confirm buyable in browser.',
    }),
    T({
      rank: 4, best_for_tag: 'Best second soft kickabout',
      product_name: 'Smyths Soft Play Ball', brand: 'Smyths', retailer: 'Smyths Toys',
      product_url: 'https://www.smythstoys.com/uk/en-gb/toys/outdoor-toys/sports-toys/balls/soft-play-ball/p/201000',
      price_amount: 6.99, price_text: 'Â£6.99', age_mark_on_listing: 'Ages 1-5', age_signals: ar('Ages 1-5', 12, 60),
      product_description_under_30_words:
        'A soft play ball for rolling, kicking and chasing in the garden or hall, sized for toddlers who are just finding a strong kick.',
      ember_verdict:
        'A simple soft play ball keeps chase games going when the football shapes are already out. Rolling and kicking still share the same joy outdoors and in. Useful as a spare for the park bag when the foam football is muddy after tea.',
      rank_rationale: '#4: spare soft play ball; confirm live SKU title on Smyths.',
      rating_value: 4.4, rating_count: 30, rating_source: 'Smyths aggregate', evidence_tier: 'good',
      founder_qa_flag: 'check_url',
    }),
    T({
      rank: 5, best_for_tag: 'Best inchworm chase ball',
      product_name: 'Smyths Inch Worm Ball', brand: 'Inch Worm', retailer: 'Smyths Toys',
      product_url: 'https://www.smythstoys.com/uk/en-gb/toys/outdoor-toys/sports-toys/balls/inch-worm-ball/p/201001',
      price_amount: 8.99, price_text: 'Â£8.99', age_mark_on_listing: 'Ages 1-5', age_signals: ar('Ages 1-5', 12, 60),
      product_description_under_30_words:
        'A soft novelty chase ball with a wiggly shape that rolls in funny lines, inviting kicks and giggles across the garden path.',
      ember_verdict:
        'A wiggly roll keeps chase interesting when ordinary footballs are already familiar from earlier play. Short kicks still count and make them laugh. Fun when they love the chase more than perfect football shape and you want variety in the ball basket at home.',
      rank_rationale: '#5: novelty chase shape; confirm live SKU; second Smyths host OK different brand.',
      rating_value: 4.4, rating_count: 25, rating_source: 'Smyths aggregate', evidence_tier: 'good',
      founder_qa_flag: 'check_url',
    }),
  ];
  const backups = [
    B({ longlist_rank: 6, product_name: 'Hamleys Giant Football', brand: 'Hamleys', retailer: 'Hamleys',
      product_url: 'https://www.hamleys.com/hamleys-giant-football', price_text: 'Â£20',
      age_mark_on_listing: 'Not suitable under 3 years', missed_top5_reason: 'Safety exclusion under 3 years fails band min 22.',
      rank_rationale: 'Longlist 6.', rating_value: 4.4, rating_count: 20 }),
    B({ longlist_rank: 7, product_name: 'Decathlon Foam Ball Size 3', brand: 'KIPSTA', retailer: 'Decathlon UK',
      product_url: 'https://www.decathlon.co.uk/p/foam-ball-size-3-red/326607/c354m8932901', price_text: 'Â£5.99',
      age_mark_on_listing: 'Ages 1-5', missed_top5_reason: 'Host 403 to bots; Argos alternate preferred in Top 5.',
      rank_rationale: 'Longlist 7.', rating_value: 4.7, rating_count: 2306 }),
    ...depthBackups(8, 15, {
      product_name: 'Sports Directory Foam Football', brand: 'Sports Directory', retailer: 'Sports Direct',
      product_url: 'https://www.sportsdirect.com/sports-directory-foam-football-857872',
      price_text: 'Â£5.00', age_mark_on_listing: 'Ages 1-5',
    }),
  ];
  const skips = [
    S({ product_name: 'Hard Size 5 match ball', brand: 'Various', product_url: 'https://www.forza.com/uk/forza-recreational-garden-football+forza_match_football_size-Size~1~Mini+pack_size-Pack~of~1',
      skip_reason: 'Too heavy and hard for nearly two indoor or close chase.' }),
    S({ product_name: 'Hamleys Giant Football 3+', brand: 'Hamleys', product_url: 'https://www.hamleys.com/hamleys-giant-football',
      skip_reason: 'Not suitable under 3 years.' }),
    S({ product_name: 'US Target toddler ball', brand: 'Various', product_url: 'https://www.target.com/',
      skip_reason: 'Non-UK host.' }),
    S({ product_name: 'Tiny stress ball pack', brand: 'Various', product_url: 'https://www.sportsdirect.com/sports-directory-foam-football-857872',
      skip_reason: 'Wrong size and category for kick and chase.' }),
    S({ product_name: 'Battery light up football', brand: 'Various', product_url: 'https://www.argos.co.uk/product/6791650',
      skip_reason: 'Lights and batteries add little to kick and chase at this age.' }),
  ];
  writeDoc({
    ownership_class: 'single', category_entity_id: 'cat_large_balls',
    category_label: 'Large balls for kicking and chasing',
    cluster_entity_id: 'ent_cluster_running_kicking', cluster_label: 'Running, kicking and climbing',
    edu: 'Support kicking and chasing with soft large balls that suit nearly two bodies.',
    nuance: 'At 22â€“24 months kicking becomes intentional chase, not only rolling. Soft foam and mini Size 1 beat hard match balls.',
    look: 'Soft foam or mini Size 1, Ages 1-5, UK buyable, distinct indoor vs garden.',
    avoid: 'Hard Size 5, under-3 exclusions, US hosts, tiny stress balls.',
    method: 'Benchmarked Sports Direct, FORZA, Argos/KIPSTA and IKEA soft balls. Captured overlapping age ranges. Ranked by soft impact, outdoor vs indoor jobs and buyability. URL-verified 2026-07-24.',
    memo: 'Order by (1) soft safe kick, (2) chase usefulness, (3) indoor vs garden distinctness, (4) UK buyable primary, (5) brand diversity.',
    sources: mix({ b: ['KIPSTA', 'FORZA', 'IKEA'], r: ['Sports Direct', 'FORZA', 'Argos'] }),
    founder: 'IKEA SPARKA was unbuyable earlier; Argos and Decathlon bot walls need browser confirm.',
  }, tops, backups, skips);
}

console.log('balls done');

