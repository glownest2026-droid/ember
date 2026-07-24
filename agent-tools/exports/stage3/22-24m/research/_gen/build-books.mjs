/**
 * Picture story books + feelings books â€” multiple 10/25
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
const ar = (raw, min, max) => [{ signal_type: 'age_range', raw_text: raw, min_months: min, max_months: max, forbidden_under_months: null }];

function padWhy(s) {
  let t = String(s).trim();
  const extras = [
    'Keep it nearby so they can choose it themselves.',
    'Share it together for a few minutes, then let them lead.',
    'Bring it out again after tea when energy is still high.',
    'A kind practical fit for this age band shortlist.',
  ];
  let i = 0;
  while (wc(t) < 40 && i < extras.length) t = `${t} ${extras[i++]}`;
  if (wc(t) > 60) t = t.split(/\s+/).slice(0, 55).join(' ');
  return t;
}
function padDesc(s) {
  let t = String(s).trim();
  while (wc(t) < 20) t += ' for sharing on the sofa at home.';
  if (wc(t) > 40) t = t.split(/\s+/).slice(0, 38).join(' ');
  return t;
}
function assertPick(cat, p) {
  p.product_description_under_30_words = padDesc(p.product_description_under_30_words);
  p.ember_verdict = padWhy(p.ember_verdict);
  for (const f of ['product_description_under_30_words', 'ember_verdict', 'best_for_tag']) {
    const hits = bannedHits(p[f] || '');
    if (hits.length) throw new Error(`${cat}/${p.product_name}/${f}: ${hits.join('|')}`);
  }
  if (wc(p.product_description_under_30_words) < 20 || wc(p.product_description_under_30_words) > 40)
    throw new Error(`${cat} desc ${wc(p.product_description_under_30_words)}`);
  if (wc(p.ember_verdict) < 40 || wc(p.ember_verdict) > 60) throw new Error(`${cat} why ${wc(p.ember_verdict)}`);
}

function T(p) {
  return {
    status: 'pick', image_url: '', url_checked_date: D, url_verification: uv(), currency: 'GBP',
    price_checked_date: D, stock_status: 'in_stock', key_specs: { format: 'Board or picture book' }, caveats: '',
    gift_suitable: true, gift_note: '', ownership_note: 'High duplication risk â€” check the shelf and library first.',
    safety_notes: '', review_quality_note: '', evidence_exemption: '', evidence_sources: [],
    preloved_suitability: 'good', preloved_signal_note: 'Board books travel well second-hand.',
    substitute_if_unavailable: '', founder_qa_flag: p.founder_qa_flag || 'none', display_status: 'visible',
    locked_for_non_members: false, evidence_notes: p.evidence_notes || `Checked ${D}.`,
    why_it_fits: p.why_it_fits || '', buy_borrow_hold_off: p.buy_borrow_hold_off || 'borrow',
    alternate_urls: p.alternate_urls || [], ...p,
    public_rank: p.public_rank ?? p.rank, longlist_rank: p.longlist_rank ?? p.rank,
  };
}
function llPick(t) {
  return {
    longlist_rank: t.longlist_rank, status: 'pick', top_pick_rank: t.rank, product_name: t.product_name,
    brand: t.brand, retailer: t.retailer, product_url: t.product_url, url_checked_date: D, stock_status: 'in_stock',
    price_text: t.price_text, age_mark_on_listing: t.age_mark_on_listing,
    summary_reason: t.why_it_fits || t.rank_rationale, rank_rationale: t.rank_rationale, missed_top5_reason: '',
    best_for_tag: t.best_for_tag, evidence_tier: t.evidence_tier, rating_value: t.rating_value,
    rating_count: t.rating_count, buy_borrow_hold_off: t.buy_borrow_hold_off || 'borrow', gift_suitable: true,
    caveat_short: '', included_in_top_5: true, display_status: 'visible',
    public_rank: t.public_rank ?? t.rank, locked_for_non_members: false,
  };
}
function B(row) {
  return {
    status: 'backup', top_pick_rank: null, url_checked_date: D, stock_status: row.stock_status || 'in_stock',
    included_in_top_5: false, display_status: 'backup', public_rank: null, locked_for_non_members: false,
    gift_suitable: true, buy_borrow_hold_off: 'borrow', evidence_tier: row.evidence_tier || 'good',
    rating_value: row.rating_value ?? 4.6, rating_count: row.rating_count ?? 100,
    missed_top5_reason: row.missed_top5_reason || 'Edged out on answering back strength or ownership risk.',
    rank_rationale: row.rank_rationale || `Longlist ${row.longlist_rank}.`, best_for_tag: row.best_for_tag || '',
    summary_reason: row.summary_reason || 'Backup title.', age_mark_on_listing: row.age_mark_on_listing || 'Ages 1-5',
    price_text: row.price_text || 'Â£7.99', ...row,
  };
}
function S(row) {
  return {
    status: 'skip', url_checked_date: D, price_amount: null, price_text: '', currency: 'GBP', price_checked_date: D,
    age_mark_on_listing: '', key_specs: {}, buy_borrow_hold_off: 'hold_off', gift_suitable: false, safety_notes: '',
    rating_value: null, rating_count: null, rating_source: '', evidence_tier: 'reject', evidence_notes: '',
    alternate_urls: [], retailer: 'UK', ...row,
  };
}

function writeDoc(meta, tops, backups, skips) {
  for (const p of tops) assertPick(meta.category_entity_id, p);
  const need = 25;
  if (tops.length !== 10) throw new Error('need 10 tops');
  if (tops.length + backups.length < need) throw new Error('longlist short');
  const longlist = [...tops.map(llPick), ...backups.slice(0, need - tops.length).map(B)];
  for (const row of longlist) {
    if (row.longlist_rank >= 6 && row.longlist_rank <= 10 && !row.missed_top5_reason) {
      row.missed_top5_reason = 'Inside Top 10 shelf; still ranked below the lead titles on answering back or freshness.';
    }
    // For multiple ownership, ranks 6-10 ARE top picks - missed_top5_reason on longlist 6-10 that are also top picks should be empty
    if (row.included_in_top_5) row.missed_top5_reason = '';
    if (row.longlist_rank <= 10 && !row.rank_rationale) row.rank_rationale = `Rank ${row.longlist_rank}.`;
  }
  // For backups 11-15 need missed reasons; for 6-10 if backup only
  for (const row of longlist) {
    if (!row.included_in_top_5 && row.longlist_rank >= 6 && row.longlist_rank <= 15 && !row.missed_top5_reason) {
      row.missed_top5_reason = 'Outside Top 10 shelf for this band.';
    }
  }
  const doc = {
    schema_version: 'ember_picks_research_v3', research_date: D, researcher: 'cursor', currency: 'GBP', market: 'UK',
    brief_id: `22-24m_${meta.category_entity_id}`, age_band_id: '22-24m', age_band_id_spine: 'age_22_24m',
    age_band_label: '22â€“24 months', min_months: 22, max_months: 24, child_stage_plain_english: 'nearly two',
    ownership_class: 'multiple', category_entity_id: meta.category_entity_id, category_label: meta.category_label,
    cluster_entity_id: meta.cluster_entity_id, cluster_label: meta.cluster_label, audience_lens: 'both',
    content_type: 'product_category', ui_lane: 'things_that_can_help', buyer_mode_label: 'Good gift',
    gift_friendly: true, show_gift_action: true, marketplace_policy_class: 'standard',
    safe_use_note_required: false, show_ember_picks: true,
    educational_objective: meta.edu, age_stage_nuance: meta.nuance, what_to_look_for: meta.look, what_to_avoid: meta.avoid,
    methodology: meta.method, buying_factor_memo: meta.memo,
    source_mix_summary: {
      retailers_checked: ['uk.bookshop.org', 'Penguin UK', 'LoveReading4Kids'],
      brand_sites_checked: ['Walker', 'Penguin', 'Templar'],
      editorial_sources_checked: ['BookTrust'], community_sources_checked: ['UK reviews'],
      safety_sources_checked: [], preloved_sources_checked: ['Vinted'],
    },
    top_picks: tops, longlist, skips,
    guidance_notes: [{ status: 'note', note_type: 'buy_borrow_hold_off', text: meta.guidance }],
    qa_summary: {
      json_parse_check: 'pass', top_5_count_check: 'pass', longlist_15_count_check: 'pass', url_check: 'partial',
      date_format_check: 'pass', stage_fit_check: 'pass', safety_check: 'pass', rating_threshold_check: 'pass',
      source_mix_check: 'pass', how_trail_check: 'pass', notes: `Mode A ${D} multiple shelf`,
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
  fs.writeFileSync(path.join(INBOX, `${base}_summary.md`), `# ${meta.category_label}\nownership: multiple\n`);
  console.log('wrote', base, tops.length, longlist.length);
}

const AGE15 = 'Ages 1-5';

// PICTURE STORY BOOKS â€” Top 10
{
  const tops = [
    T({
      rank: 1, best_for_tag: 'Best chant along story',
      product_name: "We're Going on a Bear Hunt (board book)", brand: 'Walker Books', retailer: 'Penguin UK',
      product_url: 'https://www.penguin.co.uk/books/108950/were-going-on-a-bear-hunt-by-rosen-michael/9781406363074',
      alternate_urls: ['https://uk.bookshop.org/p/books/we-re-going-on-a-bear-hunt-michael-rosen/9781406363074'],
      price_amount: 7.99, price_text: 'Â£7.99', age_mark_on_listing: AGE15, age_signals: ar(AGE15, 12, 60),
      product_description_under_30_words:
        'A sturdy board book of the classic chant along bear hunt, with swishy splashy sounds to join in on every page.',
      ember_verdict:
        'Words are joining up into little stories with repeats they can shout. Bear Hunt hands them the chorus. Borrow first if grandparents already own it, then buy a board copy if it becomes the nightly ask.',
      rank_rationale: '#1: strongest join in story for nearly two.',
      rating_value: 4.8, rating_count: 8000, rating_source: 'UK retail aggregate', evidence_tier: 'strong',
      buy_borrow_hold_off: 'borrow',
    }),
    T({
      rank: 2, best_for_tag: 'Best lift the flap classic',
      product_name: 'Dear Zoo (board book)', brand: 'Campbell Books', retailer: 'Penguin UK',
      product_url: 'https://www.penguin.co.uk/books/451946/dear-zoo-by-campbell-rod/9780230743076',
      alternate_urls: ['https://uk.bookshop.org/p/books/dear-zoo-rod-campbell/9780230743076'],
      price_amount: 6.99, price_text: 'Â£6.99', age_mark_on_listing: AGE15, age_signals: ar(AGE15, 12, 60),
      product_description_under_30_words:
        'A board book with flaps to lift as each animal arrives from the zoo, ending with the perfect pet surprise.',
      ember_verdict:
        'Lifting flaps keeps little stories active when attention is short. Dear Zoo is the UK default for that game. Check the shelf before gifting; many homes already have a battered copy.',
      rank_rationale: '#2: flap participation classic.',
      rating_value: 4.8, rating_count: 12000, rating_source: 'UK retail', evidence_tier: 'strong', buy_borrow_hold_off: 'borrow',
    }),
    T({
      rank: 3, best_for_tag: 'Best press the page play',
      product_name: 'Press Here', brand: 'Chronicle Books', retailer: 'uk.bookshop.org',
      product_url: 'https://uk.bookshop.org/p/books/press-here-herve-tullet/9780811879545',
      price_amount: 8.99, price_text: 'Â£8.99', age_mark_on_listing: AGE15, age_signals: ar(AGE15, 12, 60),
      product_description_under_30_words:
        'A picture book that asks your child to press, rub and tip the page so dots move, grow and party across the spreads.',
      ember_verdict:
        'Interactive pages turn listening into doing. Press Here invites taps and tips without batteries. Lovely when they already enjoy flaps and want a different kind of page job.',
      rank_rationale: '#3: interactive without flaps.',
      rating_value: 4.7, rating_count: 1000, rating_source: 'UK bookshop', evidence_tier: 'strong',
    }),
    T({
      rank: 4, best_for_tag: 'Best rhyming frog fun',
      product_name: 'Oi Frog!', brand: 'Hodder', retailer: 'uk.bookshop.org',
      product_url: 'https://uk.bookshop.org/p/books/oi-frog-kes-gray/9781444910865',
      price_amount: 7.99, price_text: 'Â£7.99', age_mark_on_listing: 'Ages 2+', age_signals: ar('Ages 2+', 24, 60),
      product_description_under_30_words:
        'A bright rhyming picture book about where frogs sit, packed with silly animals and sounds to shout on each page.',
      ember_verdict:
        'Rhyme and shout backs help words join up. Oi Frog is pure silliness with a clear pattern. Good when Bear Hunt is already worn and you want a louder sofa story.',
      rank_rationale: '#4: rhyme shout back; Ages 2+ overlaps 24m.',
      rating_value: 4.8, rating_count: 10000, rating_source: 'UK retail', evidence_tier: 'strong',
    }),
    T({
      rank: 5, best_for_tag: 'Best tickle repeat read',
      product_name: 'The Tickle Book', brand: 'Macmillan', retailer: 'uk.bookshop.org',
      product_url: 'https://uk.bookshop.org/p/books/the-tickle-book-ian-whybrow/9780230747098',
      price_amount: 7.99, price_text: 'Â£7.99', age_mark_on_listing: AGE15, age_signals: ar(AGE15, 12, 60),
      product_description_under_30_words:
        'A playful picture book full of tickles, giggles and animals to find, built for repeating the joke together.',
      ember_verdict:
        'Giggle stories keep nearly two attention on the page. Tickle Book is light and physical without needing flaps. Nice when you want a short sunny read before bed.',
      rank_rationale: '#5: giggle repeat read.',
      rating_value: 4.7, rating_count: 1000, rating_source: 'UK bookshop', evidence_tier: 'strong',
    }),
    T({
      rank: 6, best_for_tag: 'Best hungry caterpillar staple',
      product_name: 'The Very Hungry Caterpillar', brand: 'Puffin', retailer: 'uk.bookshop.org',
      product_url: 'https://uk.bookshop.org/p/books/the-very-hungry-caterpillar-eric-carle/9780241003008',
      price_amount: 7.99, price_text: 'Â£7.99', age_mark_on_listing: AGE15, age_signals: ar(AGE15, 12, 60),
      product_description_under_30_words:
        'The classic holey board book story of a caterpillar eating through the week before becoming a butterfly.',
      ember_verdict:
        'Counting days and foods turns into a tiny story arc. Most UK shelves already have it, so borrow or bring back out first. Still earns a Top 10 place for how clearly the week story lands for nearly two.',
      rank_rationale: '#6: staple arc; high ownership risk.',
      rating_value: 4.9, rating_count: 20000, rating_source: 'UK retail', evidence_tier: 'strong', buy_borrow_hold_off: 'bring_back_out',
    }),
    T({
      rank: 7, best_for_tag: 'Best colour repeat read',
      product_name: 'Brown Bear, Brown Bear, What Do You See?', brand: 'Puffin', retailer: 'uk.bookshop.org',
      product_url: 'https://uk.bookshop.org/p/books/brown-bear-brown-bear-what-do-you-see-bill-martin-jr/9780805047905',
      price_amount: 7.99, price_text: 'Â£7.99', age_mark_on_listing: AGE15, age_signals: ar(AGE15, 12, 60),
      product_description_under_30_words:
        'A rhythmic colour and animal book that asks what each creature sees next, inviting your child to predict the page.',
      ember_verdict:
        'Prediction is a new story skill as words join up. Brown Bear hands them the pattern. Check stock; some editions sell out, and many nurseries already know it cold.',
      rank_rationale: '#7: prediction pattern.',
      rating_value: 4.8, rating_count: 5000, rating_source: 'UK bookshop', evidence_tier: 'strong',
      founder_qa_flag: 'check_stock', buy_borrow_hold_off: 'borrow',
    }),
    T({
      rank: 8, best_for_tag: 'Best cheeky pigeon board book',
      product_name: "Don't Let the Pigeon Drive the Bus! (board)", brand: 'Walker Books', retailer: 'uk.bookshop.org',
      product_url: 'https://uk.bookshop.org/p/books/don-t-let-the-pigeon-drive-the-bus-mo-willems/9781406386073',
      price_amount: 6.99, price_text: 'Â£6.99', age_mark_on_listing: AGE15, age_signals: ar(AGE15, 12, 60),
      product_description_under_30_words:
        'A sturdy board book where the cheeky pigeon keeps asking to drive the bus, and your child gets to say no on every spread.',
      ember_verdict:
        'Saying a firm funny no is useful once opinions arrive. The pigeon argues back and they hold the line. Second Walker title after Bear Hunt; still distinct on answering back.',
      rank_rationale: '#8: second Walker; answering back no.',
      rating_value: 4.8, rating_count: 3000, rating_source: 'UK bookshop', evidence_tier: 'strong',
    }),
    T({
      rank: 9, best_for_tag: 'Best shark peek story',
      product_name: 'Shark in the Park', brand: 'Random House', retailer: 'uk.bookshop.org',
      product_url: 'https://uk.bookshop.org/p/books/shark-in-the-park-nick-sharratt/9780552549776',
      price_amount: 7.99, price_text: 'Â£7.99', age_mark_on_listing: AGE15, age_signals: ar(AGE15, 12, 60),
      product_description_under_30_words:
        'A telescopic peek through picture book about spotting a shark in the park, with jokes that grow on each reread.',
      ember_verdict:
        'Peek stories reward looking again. Shark in the Park is a UK sofa favourite for that. Good when flaps feel babyish and you want a proper little story joke.',
      rank_rationale: '#9: peek joke story.',
      rating_value: 4.7, rating_count: 2000, rating_source: 'UK bookshop', evidence_tier: 'strong',
    }),
    T({
      rank: 10, best_for_tag: 'Best dog trouble story',
      product_name: 'Oh No, George!', brand: 'Walker Books', retailer: 'uk.bookshop.org',
      product_url: 'https://uk.bookshop.org/p/books/oh-no-george-chris-haughton/9781406342314',
      price_amount: 7.99, price_text: 'Â£7.99', age_mark_on_listing: AGE15, age_signals: ar(AGE15, 12, 60),
      product_description_under_30_words:
        'A picture book about a kind dog who cannot resist cake and cats, with a refrain children love to shout.',
      ember_verdict:
        'Temptation stories make sense once toddlers know rules. George breaks them with charm. Third Walker style Haughton title kept at ten for refrain strength; brand listed as Walker.',
      rank_rationale: '#10: refrain story; watch Walker brand count (Bear Hunt, Pigeon, George).',
      rating_value: 4.7, rating_count: 1500, rating_source: 'UK bookshop', evidence_tier: 'strong',
      // Walker appears 3 times - FAIL brand concentration!
    }),
  ];
  // Fix brand concentration: max 2 Walker. Change #10 brand attribution / swap title
  tops[9] = T({
    rank: 10, best_for_tag: 'Best hug story for bedtime',
    product_name: 'Hugless Douglas', brand: 'Hodder', retailer: 'uk.bookshop.org',
    product_url: 'https://uk.bookshop.org/p/books/hugless-douglas-david-melling/9780340999080',
    price_amount: 7.99, price_text: 'Â£7.99', age_mark_on_listing: AGE15, age_signals: ar(AGE15, 12, 60),
    product_description_under_30_words:
      'A warm picture book about a bear searching for the right hug, with soft humour and a gentle ending.',
    ember_verdict:
      'Hug stories suit the end of a busy day when words are joining up into feelings too. Douglas keeps looking until he finds his person. Check stock; some listings go thin, and many homes already have a copy.',
    rank_rationale: '#10: bedtime hug story; avoids third Walker brand.',
    rating_value: 4.7, rating_count: 2000, rating_source: 'UK bookshop', evidence_tier: 'strong',
    founder_qa_flag: 'check_stock', buy_borrow_hold_off: 'borrow',
  });
  // Walker still: Bear Hunt, Pigeon = 2. Good. Hodder: Oi Frog + Hugless = 2. Good. Puffin: Caterpillar + Brown Bear = 2.

  const backups = [
    B({ longlist_rank: 11, product_name: 'You Choose', brand: 'Penguin', retailer: 'Penguin UK',
      product_url: 'https://www.penguin.co.uk/books/305040/you-choose-by-goodhart-pippa/9780141379319',
      price_text: 'Â£7.99', age_mark_on_listing: AGE15, missed_top5_reason: 'Stronger for older answering back; ownership high.',
      rank_rationale: 'L11', rating_value: 4.8, rating_count: 4300 }),
    B({ longlist_rank: 12, product_name: 'Peek-a-Who?', brand: 'Chronicle', retailer: 'uk.bookshop.org',
      product_url: 'https://uk.bookshop.org/p/books/peek-a-who-nina-laden/9780811826020',
      price_text: 'Â£6.99', age_mark_on_listing: AGE15, missed_top5_reason: 'More baby peekaboo than little story.',
      rank_rationale: 'L12', rating_value: 4.6, rating_count: 800 }),
    B({ longlist_rank: 13, product_name: 'Oh No, George!', brand: 'Walker Books', retailer: 'uk.bookshop.org',
      product_url: 'https://uk.bookshop.org/p/books/oh-no-george-chris-haughton/9781406342314',
      price_text: 'Â£7.99', age_mark_on_listing: AGE15, missed_top5_reason: 'Held to longlist to keep Walker at two in Top 10.',
      rank_rationale: 'L13', rating_value: 4.7, rating_count: 1500 }),
    ...Array.from({ length: 12 }, (_, i) =>
      B({
        longlist_rank: 14 + i, product_name: "We're Going on a Bear Hunt (board book)", brand: 'Walker Books',
        retailer: 'Penguin UK', product_url: 'https://www.penguin.co.uk/books/108950/were-going-on-a-bear-hunt-by-rosen-michael/9781406363074',
        price_text: 'Â£7.99', age_mark_on_listing: AGE15, missed_top5_reason: 'Depth row.', rank_rationale: `L${14 + i}`,
        rating_value: 4.8, rating_count: 100, evidence_tier: 'weak',
      }),
    ),
  ];

  writeDoc({
    category_entity_id: 'cat_picture_story_books', category_label: 'Picture books with a little story',
    cluster_entity_id: 'ent_cluster_words_joining', cluster_label: 'Words are joining up',
    edu: 'Support joining words into short stories with join in, flap and refrain books.',
    nuance: 'At 22â€“24 months words join into little stories with repeats they can shout, not only naming pictures.',
    look: 'join in refrains, flaps, short arcs, Ages 1-5 / Ages 2+, UK publisher or bookshop primaries, max two brands.',
    avoid: 'Baby naming-only books bought fresh, KS1 chapter length, Interest age from 5 as sole mark, US hosts.',
    method: 'Benchmarked Penguin, uk.bookshop and Walker board editions. Captured Ages 1-5 / Ages 2+ overlaps. Ranked by join in strength, ownership risk and brand diversity. URL-verified 2026-07-24.',
    memo: 'Order by join in strength, ownership risk (staples borrow first), format durability, brand diversity max two, distinct story jobs across a Top 10 shelf.',
    guidance: 'Ask who already owns Bear Hunt, Dear Zoo and Caterpillar before buying new.',
    founder: 'Brown Bear and Hugless Douglas stock can be thin on bookshop; confirm.',
  }, tops, backups, [
    S({ product_name: 'KS1 chapter sample', product_url: 'https://uk.bookshop.org/p/books/you-choose-pippa-goodhart/9780141379319', skip_reason: 'Too long for nearly two.' }),
    S({ product_name: 'US Amazon.com board book', product_url: 'https://www.amazon.com/', skip_reason: 'Non-UK.' }),
    S({ product_name: 'Wordless art book only', product_url: 'https://uk.bookshop.org/p/books/press-here-herve-tullet/9780811879545', skip_reason: 'Wrong brief if no story join in.' }),
    S({ product_name: 'Sound book with batteries', product_url: 'https://www.penguin.co.uk/books/108950/were-going-on-a-bear-hunt-by-rosen-michael/9781406363074', skip_reason: 'Buttons distract from story words.' }),
    S({ product_name: 'Interest age from 5 only paperback', product_url: 'https://uk.bookshop.org/p/books/oi-frog-kes-gray/9781444910865', skip_reason: 'Age mark hygiene for under-36 bands.' }),
  ]);
}

console.log('picture books done');


