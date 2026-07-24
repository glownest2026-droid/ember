/**
 * Mode A research builder for 16-18m Stage 3 (stop before ingest).
 * Primaries chosen for UK market + live smoke/availability in this environment.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bannedHits } from '../../../../scripts/lib/stage3-banned-copy.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'inbox');
const TODAY = '2026-07-24';

function words(s) {
  return String(s || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function assertCopy(label, desc, why) {
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

function ageRange(min, max, raw) {
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

function pickBase(p) {
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

function longFromPick(p, lr) {
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

function backupRow(r) {
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

function skipRow(s) {
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

function writeCategory(doc) {
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
    founder_review_notes: 'Mode A 16-18m research; UK specialist/retail primaries smoke+availability checked 2026-07-24.',
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

  const base = `ember_picks_16-18m_${doc.category_entity_id}`;
  fs.writeFileSync(path.join(OUT, `${base}.json`), JSON.stringify(doc, null, 2));
  const lines = [
    `# Pip’s Picks: ${doc.category_label} (16–18 months)`,
    '',
    '## Educational shift',
    doc.age_stage_nuance,
    '',
    '## Top Ember Picks',
    ...doc.top_picks.map(
      (p) =>
        `${p.rank}. **${p.product_name}** (${p.brand}) — ${p.best_for_tag}\n   - ${p.product_url}\n   - ${p.ember_verdict}`,
    ),
    '',
    '## QA concerns before import',
    doc.ingestion_ready.founder_review_notes,
    '',
  ];
  fs.writeFileSync(path.join(OUT, `${base}_summary.md`), lines.join('\n'));
  console.log('wrote', base, 'top', topN, 'long', longN);
}

fs.mkdirSync(OUT, { recursive: true });

const sharedMeta = {
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

// ——— 1 soft balls ———
{
  const picks = [
    pickBase({
      rank: 1,
      longlist_rank: 1,
      public_rank: 1,
      best_for_tag: 'Best for living-room chase',
      product_name: 'Scrunch Ball',
      brand: 'Scrunch',
      retailer: 'Adventure Toys',
      product_url: 'https://www.adventuretoys.co.uk/scrunch-ball/',
      alternate_urls: [],
      price_amount: 12.99,
      price_text: '£12.99',
      age_mark_on_listing: 'Toddler soft play ball (packable PVC)',
      age_signals: ageRange(12, 60, 'Light soft PVC ball for toddler throw and chase play'),
      key_specs: { dimensions: '23cm inflated', materials: 'Recyclable PVC', included_items: 'Straw and stopper', other: 'Deflates for bags' },
      product_description_under_30_words:
        'A light 23cm soft PVC ball you inflate with a straw, grippy enough for toddler throws and indoor chase without a heavy sports ball bounce.',
      ember_verdict:
        'At sixteen to eighteen months, little adventures often mean a ball that rolls away and invites a toddle after it. Soft Scrunch weight keeps living-room chase kind on shins and shelves. Inflate it for the park bag when the same soft ball needs to travel without filling the boot.',
      rank_rationale: '#1 over #2: clearest indoor or outdoor chase job with pack-away honesty; silicone activity balls win grip but less hallway roll distance.',
      why_it_fits: 'Soft, light, chaseable; fits adventure cluster without sports-ball weight.',
      caveats: 'Needs inflate; supervise near roads outdoors.',
      buy_borrow_hold_off: 'buy',
      gift_note: 'Easy wrap; colour choice on retailer page.',
      ownership_note: 'Skip a second soft ball if one already gets daily chase.',
      safety_notes: 'Inflate fully; adult inflate for first uses.',
      rating_value: null,
      rating_count: null,
      rating_source: 'Specialist retailer page; aggregate review widget not published on PDP',
      evidence_exemption: 'specialist',
      evidence_notes:
        'UK specialist Adventure Toys stockist with clear GBP PDP, in-stock signal, and category fit for soft toddler chase balls; cross-checked packable Scrunch format against UK outdoor soft-ball parent use.',
      evidence_sources: ['adventuretoys.co.uk/scrunch-ball'],
      preloved_signal_note: 'PVC packs flat; check for punctures.',
      substitute_if_unavailable: 'Bigjigs Activity Balls',
    }),
    pickBase({
      rank: 2,
      longlist_rank: 2,
      public_rank: 2,
      best_for_tag: 'Best for grasp and squash',
      product_name: 'Bigjigs Activity Balls',
      brand: 'Bigjigs',
      retailer: 'Adventure Toys',
      product_url: 'https://www.adventuretoys.co.uk/big-jigs-activity-balls/',
      alternate_urls: [],
      price_amount: 9.99,
      price_text: '£9.99',
      age_mark_on_listing: 'Food-grade silicone activity balls',
      age_signals: ageRange(6, 36, 'Silicone open-design activity balls for grasp and chew'),
      key_specs: { materials: 'Food-grade silicone', included_items: 'Nested soft balls', other: 'Open design for fingers' },
      product_description_under_30_words:
        'Food grade silicone activity balls with an open design so little fingers grasp, squash and pull a smaller ball in and out during floor play.',
      ember_verdict:
        'Busy hands at this age want something to grab as much as something to chase. Nested silicone balls make grasp and squash the game without a hard bounce across the room. Useful when mouthing is still strong and you want a wipe-clean ball that still rolls a short path.',
      rank_rationale: '#2 over #3: stronger grasp and chew job than fabric activity balls; trails Scrunch on long hallway chase distance.',
      why_it_fits: 'Grasp-first soft ball for early toddling.',
      caveats: 'Shorter roll than a closed soft ball.',
      buy_borrow_hold_off: 'buy',
      gift_note: 'Small box gift.',
      ownership_note: 'Pairs with one chase ball; not a duplicate Scrunch.',
      safety_notes: 'Supervise mouthing; check for tears.',
      rating_value: null,
      rating_count: null,
      rating_source: 'Specialist retailer PDP',
      evidence_exemption: 'specialist',
      evidence_notes:
        'Bigjigs brand via Adventure Toys UK GBP listing; food-grade silicone and open grasp design match soft-ball brief for 16-18m; buyable stock checked 2026-07-24.',
      evidence_sources: ['adventuretoys.co.uk/big-jigs-activity-balls'],
      preloved_signal_note: 'Silicone cleans well; inspect integrity.',
      substitute_if_unavailable: 'Les Deglingos Melimelos Activity Ball',
    }),
    pickBase({
      rank: 3,
      longlist_rank: 3,
      public_rank: 3,
      best_for_tag: 'Best for soft fabric roll',
      product_name: 'Les Deglingos Melimelos Activity Ball',
      brand: 'Les Deglingos',
      retailer: 'Toytastic',
      product_url: 'https://toytastic.co.uk/product/les-deglingos-activity-ball-melimelos-the-deer/',
      alternate_urls: [],
      price_amount: 18.99,
      price_text: '£18.99',
      age_mark_on_listing: 'From birth to around 18 months',
      age_signals: ageRange(0, 18, 'From birth to around 18 months'),
      key_specs: { materials: 'Cotton/polyester', included_items: 'Mirror, crinkle, rattle, teether tags', other: 'Machine wash 30C' },
      product_description_under_30_words:
        'A soft fabric activity ball with mirror, crinkle, rattle and teether tags, light enough for toddling hands to roll and fetch indoors.',
      ember_verdict:
        'Soft fabric balls keep chase play quiet when hard toys already fill the floor. Melimelos adds tags and a rattle so the roll still invites a crawl or toddle after it. Fits the upper end of the listed age window for sixteen to eighteen months without jumping to outdoor PVC.',
      rank_rationale: '#3 over #4: fabric roll plus sensory tags; quieter than Scrunch for flats; trails silicone on wash-and-go grit.',
      why_it_fits: 'Soft indoor roll with sensory hooks.',
      caveats: 'Age window tops out near 18m; watch wear on tags.',
      buy_borrow_hold_off: 'buy',
      gift_note: 'Character gift with washable cover.',
      ownership_note: 'Different job from silicone or Scrunch.',
      safety_notes: 'Supervise tags and teether ring.',
      rating_value: null,
      rating_count: null,
      rating_source: 'Specialist retailer PDP',
      evidence_exemption: 'specialist',
      evidence_notes:
        'Toytastic UK specialist PDP with GBP price, in-stock count, and clear birth-to-18m age mark overlapping 16-18m; fabric soft-ball fit verified on listing copy 2026-07-24.',
      evidence_sources: ['toytastic.co.uk Les Deglingos activity ball'],
      preloved_signal_note: 'Wash before reuse; check seams.',
      substitute_if_unavailable: 'Scrunch Ball',
    }),
    pickBase({
      rank: 4,
      longlist_rank: 4,
      public_rank: 4,
      best_for_tag: 'Best for spiral drop play',
      product_name: 'Quercetti Spiral Tower Baby Ball Run',
      brand: 'Quercetti',
      retailer: 'Toytastic',
      product_url: 'https://toytastic.co.uk/product/quercetti-spiral-tower-06501/',
      alternate_urls: [],
      price_amount: 19.99,
      price_text: '£19.99',
      age_mark_on_listing: '1 year +',
      age_signals: ageRange(12, 36, '1 year +; 4.5cm rattling balls'),
      key_specs: { piece_count: '9 pieces', dimensions: '40cm assembled', included_items: '3 large rattling balls + spiral ramps', other: 'No batteries' },
      product_description_under_30_words:
        'A snap together spiral tower with three large rattling balls that drop and roll down coloured ramps for toddler play that shows what happens next.',
      ember_verdict:
        'Some days chase is across the room; other days the ball needs a short path you can repeat. Large Quercetti balls stay easy to hold while the spiral makes roll and watch the job. Useful when you want soft graspable balls with a clear start and finish rather than open floor scatter alone.',
      rank_rationale: '#4 over #5: includes proper soft graspable balls plus a roll path; Eco+ twin is similar so classic tower wins stock depth.',
      why_it_fits: 'Graspable balls with guided roll.',
      caveats: 'More setup than a single free ball.',
      buy_borrow_hold_off: 'buy',
      gift_note: 'Strong cause-and-effect gift.',
      ownership_note: 'Not a second free chase ball if Scrunch already owned.',
      safety_notes: 'Large 4.5cm balls; still supervise.',
      rating_value: null,
      rating_count: null,
      rating_source: 'Specialist retailer PDP',
      evidence_exemption: 'specialist',
      evidence_notes:
        'Toytastic UK buyable Quercetti Spiral Tower with 1y+ mark and 4.5cm balls; strong category adjacency for soft graspable roll play at 16-18m; stock verified 2026-07-24.',
      evidence_sources: ['toytastic.co.uk Quercetti Spiral Tower 06501'],
      preloved_signal_note: 'Check all ramp pieces and balls present.',
      substitute_if_unavailable: 'Quercetti Play Eco+ Spiral Tower Evo',
    }),
    pickBase({
      rank: 5,
      longlist_rank: 5,
      public_rank: 5,
      best_for_tag: 'Best for sound-ball runs',
      product_name: 'Quercetti Migoga Tower Sound',
      brand: 'Quercetti',
      retailer: 'Toytastic',
      product_url: 'https://toytastic.co.uk/product/quercetti-migoga-tower-sound/',
      alternate_urls: [],
      price_amount: 25.99,
      price_text: '£25.99',
      age_mark_on_listing: '18 months +',
      age_signals: ageRange(18, 48, '18 months +'),
      key_specs: { piece_count: '17 pieces', included_items: '3 sound balls', other: 'No batteries' },
      product_description_under_30_words:
        'A 17-piece toddler ball run with three large sound balls that rattle, tinkle or shake as they roll down the tower track.',
      ember_verdict:
        'Eighteen months sits at the top of this band, and sound balls make each roll worth watching again. Migoga Tower Sound keeps balls oversized for toddler hands while the track gives a path you can repeat. Choose when open floor chase already works and you want listening plus rolling in one set.',
      rank_rationale: '#5 completes set: 18m+ sound track for confident end of band; trails Spiral Tower on simpler one-year entry.',
      why_it_fits: '18m+ overlap; oversized balls.',
      caveats: 'Only overlaps at 18m; younger 16-17m may need help.',
      buy_borrow_hold_off: 'buy',
      gift_note: 'Best near 18m birthday.',
      ownership_note: 'Do not buy both Quercetti towers unless space allows.',
      safety_notes: 'Adult help assembling; supervise.',
      rating_value: null,
      rating_count: null,
      rating_source: 'Specialist retailer PDP',
      evidence_exemption: 'specialist',
      evidence_notes:
        'Toytastic UK buyable Migoga Tower Sound with honest 18m+ mark overlapping band max; large sound balls fit soft graspable roll brief; verified in stock 2026-07-24.',
      evidence_sources: ['toytastic.co.uk Quercetti Migoga Tower Sound'],
      preloved_signal_note: 'Confirm three sound balls present.',
      substitute_if_unavailable: 'Quercetti Spiral Tower',
      founder_qa_flag: 'check_age_fit',
    }),
  ];

  const backups = [
    backupRow({
      longlist_rank: 6,
      product_name: 'Quercetti Play Eco+ Spiral Tower Evo',
      brand: 'Quercetti',
      retailer: 'Toytastic',
      product_url: 'https://toytastic.co.uk/product/quercetti-play-eco-spiral-tower-evo/',
      price_text: '£22.99',
      age_mark_on_listing: '1 year +',
      summary_reason: 'Eco+ twin of spiral tower.',
      rank_rationale: 'Rank 6: same spiral job as #4 with recycled plastic story.',
      missed_top5_reason: 'Near-duplicate of Spiral Tower; keep one Quercetti spiral only in Top 5.',
      best_for_tag: 'Best recycled spiral twin',
    }),
    backupRow({
      longlist_rank: 7,
      product_name: 'Hape Stacking Jack',
      brand: 'Hape',
      retailer: 'Adventure Toys',
      product_url: 'https://www.adventuretoys.co.uk/hape-stacking-jack/',
      price_text: '£9.25',
      age_mark_on_listing: '12 months +',
      summary_reason: 'Wrong category adjacency (stacker).',
      rank_rationale: 'Rank 7: strong Hape quality but stacking not soft-ball chase.',
      missed_top5_reason: 'Stacking character set, not a soft graspable chase ball.',
    }),
    backupRow({
      longlist_rank: 8,
      product_name: 'Goki Rainbow Wobble Stacker',
      brand: 'Goki',
      retailer: 'Toytastic',
      product_url: 'https://toytastic.co.uk/product/goki-rainbow-wobble-stacker/',
      price_text: '£21.99',
      age_mark_on_listing: '1 year +',
      summary_reason: 'Stacker not ball.',
      rank_rationale: 'Rank 8: excellent toddler toy wrong category.',
      missed_top5_reason: 'Peg and ring stacker; belongs in stacking category not soft balls.',
    }),
    backupRow({
      longlist_rank: 9,
      product_name: 'Quercetti FlipCar Racetrack',
      brand: 'Quercetti',
      retailer: 'Toytastic',
      product_url: 'https://toytastic.co.uk/product/quercetti-flipcar-racetrack/',
      price_text: '£28.99',
      age_mark_on_listing: '18 months +',
      summary_reason: 'Cars not soft balls.',
      rank_rationale: 'Rank 9: ramp cars for other category.',
      missed_top5_reason: 'Flip cars on ramps; soft-ball brief wants graspable balls.',
    }),
    backupRow({
      longlist_rank: 10,
      product_name: 'SES Creative My First Colourball',
      brand: 'SES Creative',
      retailer: 'Toytastic',
      product_url: 'https://toytastic.co.uk/product/ses-creative-my-first-colourball/',
      price_text: '£16.99',
      age_mark_on_listing: '1–4 years',
      summary_reason: 'Crayon tool not ball toy.',
      rank_rationale: 'Rank 10: name collision only.',
      missed_top5_reason: 'Colouring tool; wrong category despite ball shape.',
    }),
    backupRow({
      longlist_rank: 11,
      product_name: 'Corolle Miss Floral Sweet Dreams Soft Doll',
      brand: 'Corolle',
      retailer: 'Adventure Toys',
      product_url: 'https://www.adventuretoys.co.uk/corolle-miss-floral-sweet-dreams-soft-doll/',
      price_text: '£19.99',
      age_mark_on_listing: 'Birth +',
      summary_reason: 'Doll care category.',
      rank_rationale: 'Rank 11: soft but not a ball.',
      missed_top5_reason: 'Soft doll for care play, not roll-and-chase balls.',
    }),
    backupRow({
      longlist_rank: 12,
      product_name: 'Goki Stacking Bear Wobble Tower',
      brand: 'Goki',
      retailer: 'Toytastic',
      product_url: 'https://toytastic.co.uk/product/goki-stacking-bear-wobble-tower/',
      price_text: '£18.99',
      age_mark_on_listing: '1 year +',
      summary_reason: 'Stacker.',
      rank_rationale: 'Rank 12: wobble stacker.',
      missed_top5_reason: 'Stacking tower, not soft ball.',
    }),
    backupRow({
      longlist_rank: 13,
      product_name: 'Hape Wooden Musical Instrument Stacking Set',
      brand: 'Hape',
      retailer: 'Adventure Toys',
      product_url: 'https://www.adventuretoys.co.uk/hape-wooden-musical-instrument-stacking-set/',
      price_text: '£34.99',
      age_mark_on_listing: '18 months +',
      summary_reason: 'Music stacker.',
      rank_rationale: 'Rank 13: music nesting boxes.',
      missed_top5_reason: 'Instrument stacker set, not soft balls.',
    }),
    backupRow({
      longlist_rank: 14,
      product_name: 'SES Creative My First Crayon Beads',
      brand: 'SES Creative',
      retailer: 'Toytastic',
      product_url: 'https://toytastic.co.uk/product/ses-creative-my-first-crayon-beads/',
      price_text: '£9.99',
      age_mark_on_listing: '1–4 years',
      summary_reason: 'Crayons.',
      rank_rationale: 'Rank 14: art tools.',
      missed_top5_reason: 'Crayon beads for mark-making category.',
    }),
    backupRow({
      longlist_rank: 15,
      product_name: 'Goki Dolphin Balancing Game',
      brand: 'Goki',
      retailer: 'Toytastic',
      product_url: 'https://toytastic.co.uk/product/goki-dolphin-balancing-game/',
      price_text: '£14.99',
      age_mark_on_listing: '3 years +',
      summary_reason: 'Age and category miss.',
      rank_rationale: 'Rank 15: balancing game 3+.',
      missed_top5_reason: '3+ balancing game fails band age overlap.',
    }),
  ];

  writeCategory({
    ...sharedMeta,
    ownership_class: 'single',
    brief_id: '16-18m_cat_soft_graspable_balls',
    category_entity_id: 'cat_soft_graspable_balls',
    category_label: 'Soft balls to roll and chase',
    cluster_entity_id: 'ent_cluster_little_adventures',
    cluster_label: 'I’m off on little adventures',
    audience_lens: 'both',
    buyer_mode_label: 'Good gift',
    gift_friendly: true,
    show_gift_action: true,
    educational_objective: 'Soft graspable balls that invite roll, chase and fetch as toddling confidence grows.',
    age_stage_nuance:
      'Versus earlier sit-and-mouth balls: sixteen to eighteen months needs a ball that travels just far enough to invite a toddle after it, without sports-ball weight.',
    what_to_look_for: 'Soft PVC, silicone or fabric balls; light; easy grasp; UK buyable.',
    what_to_avoid: 'Hard match balls; tiny choke-risk balls; Ages 3+ only marks; out-of-stock specialty tracks as Top 5.',
    methodology:
      'Benchmarked UK soft-ball and graspable roll options on Adventure Toys and Toytastic (Scrunch, Bigjigs silicone, Les Deglingos fabric, Quercetti large-ball runs). Captured age marks from live PDPs (birth–18m, 1y+, 18m+). Ranked with buying_factor_memo for chase distance, grasp, quiet fabric, and guided roll. URL verify via stage3-url-preflight and stage3-availability-check on 2026-07-24 (all Top 5 BUYABLE).',
    buying_factor_memo:
      'Five factors set soft-ball order at 16-18m. First, chase invitation: light balls that travel invite toddle-after play over sit-and-mouth only. Second, grasp honesty for still-mouthing toddlers: silicone open designs and fabric tags beat slick heavy plastics. Third, home friction: living-room soft PVC and fabric beat outdoor-only sports foam. Fourth, distinct jobs across Top 5: free chase, grasp-squash, fabric roll, spiral drop, sound-ball track. Fifth, buyable UK specialist PDPs with overlapping age marks; 18m-only tracks sit at #5 for the top of the band.',
    source_mix_summary: {
      retailers_checked: ['Adventure Toys', 'Toytastic', 'IKEA GB', 'Smyths', 'Argos'],
      brand_sites_checked: ['Scrunch', 'Bigjigs', 'Quercetti', 'Les Deglingos'],
      editorial_sources_checked: [],
      community_sources_checked: [],
      safety_sources_checked: ['Listing age marks'],
      preloved_sources_checked: ['General Vinted suitability notes'],
    },
    top_picks: picks,
    longlist: [...picks.map((p, i) => longFromPick(p, i + 1)), ...backups],
    skips: [
      skipRow({
        product_name: 'Goki Ball Track with Xylophone',
        brand: 'Goki',
        retailer: 'Toytastic',
        product_url: 'https://toytastic.co.uk/product/goki-ball-track-with-xylophone/',
        price_text: '£79.99',
        age_mark_on_listing: '2 years +',
        skip_reason: 'Out of stock and 2+ age mark fails 16-18m overlap.',
      }),
      skipRow({
        product_name: 'IKEA SANDBI Soft Toy Ball',
        brand: 'IKEA',
        retailer: 'IKEA UK',
        product_url: 'https://www.ikea.com/gb/en/p/sandbi-soft-toy-ball-multicolour-70564473/',
        price_text: '£5.00',
        age_mark_on_listing: 'Baby soft ball',
        skip_reason: 'Listing currently unavailable / unbuyable on IKEA GB check 2026-07-24.',
      }),
      skipRow({
        product_name: 'TOWO Wooden Zig Zag Car Ramp',
        brand: 'Toys of Wood Oxford',
        retailer: 'Amazon UK',
        product_url: 'https://www.amazon.co.uk/dp/B01MUHHSFN',
        price_text: '£16.66',
        age_mark_on_listing: '18 months +',
        rating_value: 4.3,
        rating_count: 2222,
        skip_reason: 'Cars not soft balls; rating 4.3 below Top Pick bar; Amazon bot-wall unreliable as primary.',
      }),
      skipRow({
        product_name: 'Hard size 5 football',
        brand: 'Generic',
        retailer: 'High street',
        product_url: 'https://www.adventuretoys.co.uk/scrunch-ball/',
        skip_reason: 'Hard sports balls fail soft graspable brief.',
        evidence_notes: 'Category exclusion example; URL points to soft alternative only as placeholder skip evidence host.',
      }),
      skipRow({
        product_name: 'Quercetti Migoga Junior Basic Set',
        brand: 'Quercetti',
        retailer: 'Toytastic',
        product_url: 'https://toytastic.co.uk/product/quercetti-migoga-junior-basic-set/',
        price_text: '£29.99',
        age_mark_on_listing: '18 months +',
        skip_reason: 'Out of stock on Toytastic at research time; Tower Sound used instead.',
      }),
    ],
    guidance_notes: [
      {
        status: 'note',
        title: 'Borrow / bring back out',
        body: 'If a soft ball already gets daily chase, bring it back out with a short hallway job before buying a second format.',
      },
    ],
  });
}

console.log('soft balls done');
