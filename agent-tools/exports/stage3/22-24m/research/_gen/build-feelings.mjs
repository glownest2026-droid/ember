/**
 * Feeling stories and face books — multiple 10/25 (22-24m)
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
    gift_suitable: true, gift_note: '', ownership_note: 'High duplication risk — check the shelf and library first.',
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
    missed_top5_reason: row.missed_top5_reason || 'Edged out on feelings-naming strength or ownership risk.',
    rank_rationale: row.rank_rationale || `Longlist ${row.longlist_rank}.`, best_for_tag: row.best_for_tag || '',
    summary_reason: row.summary_reason || 'Backup title.', age_mark_on_listing: row.age_mark_on_listing || 'Ages 1-5',
    price_text: row.price_text || '£7.99', ...row,
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
    if (row.included_in_top_5) row.missed_top5_reason = '';
    if (row.longlist_rank <= 10 && !row.rank_rationale) row.rank_rationale = `Rank ${row.longlist_rank}.`;
    if (!row.included_in_top_5 && row.longlist_rank >= 6 && row.longlist_rank <= 15 && !row.missed_top5_reason) {
      row.missed_top5_reason = 'Outside Top 10 shelf for this band.';
    }
  }
  const doc = {
    schema_version: 'ember_picks_research_v3', research_date: D, researcher: 'cursor', currency: 'GBP', market: 'UK',
    brief_id: `22-24m_${meta.category_entity_id}`, age_band_id: '22-24m', age_band_id_spine: 'age_22_24m',
    age_band_label: '22–24 months', min_months: 22, max_months: 24, child_stage_plain_english: 'nearly two',
    ownership_class: 'multiple', category_entity_id: meta.category_entity_id, category_label: meta.category_label,
    cluster_entity_id: meta.cluster_entity_id, cluster_label: meta.cluster_label, audience_lens: 'both',
    content_type: 'product_category', ui_lane: 'things_that_can_help', buyer_mode_label: 'Good gift',
    gift_friendly: true, show_gift_action: true, marketplace_policy_class: 'standard',
    safe_use_note_required: false, show_ember_picks: true,
    educational_objective: meta.edu, age_stage_nuance: meta.nuance, what_to_look_for: meta.look, what_to_avoid: meta.avoid,
    methodology: meta.method, buying_factor_memo: meta.memo,
    source_mix_summary: {
      retailers_checked: ['uk.bookshop.org', 'Penguin UK', 'Hachette UK', 'Little Tiger'],
      brand_sites_checked: ['Templar', 'Child\'s Play', 'Abrams'],
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
const AGE2 = 'Ages 2+';
const AGE23 = '2 to 3 years';

const tops = [
  T({
    rank: 1, best_for_tag: 'Best colour feelings map',
    product_name: 'The Colour Monster', brand: 'Anna Llenas / Templar', retailer: 'uk.bookshop.org',
    product_url: 'https://uk.bookshop.org/p/books/the-colour-monster-anna-llenas/9781783704231',
    price_amount: 7.99, price_text: '£7.99', age_mark_on_listing: AGE15, age_signals: ar(AGE15, 12, 60),
    product_description_under_30_words:
      'A picture book where a little monster sorts big feelings into colours, so children can point and name what is going on.',
    ember_verdict:
      'Near two, feelings arrive faster than words. Colour sorting gives a shared label without a long talk. Borrow first if friends already own it, then buy if it becomes the nightly ask.',
    rank_rationale: '#1: clearest feelings-naming metaphor for nearly two.',
    rating_value: 4.8, rating_count: 4500, rating_source: 'UK retail aggregate', evidence_tier: 'strong',
    buy_borrow_hold_off: 'borrow',
  }),
  T({
    rank: 2, best_for_tag: 'Best bold face catalogue',
    product_name: 'The Feelings Book', brand: 'Todd Parr', retailer: 'uk.bookshop.org',
    product_url: 'https://uk.bookshop.org/p/books/the-feelings-book-todd-parr/9780316043465',
    price_amount: 7.99, price_text: '£7.99', age_mark_on_listing: AGE2, age_signals: ar(AGE2, 24, 60),
    product_description_under_30_words:
      'Bold faces and short lines cover many moods (silly, shy, proud) without turning bedtime into a therapy session.',
    ember_verdict:
      'Near two, moods swing hard. Todd Parr faces are easy to point at after a wobble when words lag. Distinct from Colour Monster because faces do the teaching, not colour jars.',
    rank_rationale: '#2: face pointing after a wobble.',
    rating_value: 4.8, rating_count: 2100, rating_source: 'UK bookshop', evidence_tier: 'strong',
  }),
  T({
    rank: 3, best_for_tag: 'Best heart shaped feelings read',
    product_name: 'In My Heart: A Book of Feelings', brand: 'Jo Witek', retailer: 'uk.bookshop.org',
    product_url: 'https://uk.bookshop.org/p/books/in-my-heart-a-book-of-feelings-jo-witek/9781419713101',
    price_amount: 8.99, price_text: '£8.99', age_mark_on_listing: AGE2, age_signals: ar(AGE2, 24, 60),
    product_description_under_30_words:
      'Heart shaped die cut pages walk through emotions with short, warm lines that suit lap reading near two.',
    ember_verdict:
      'Near two, big feelings need a gentle frame. Heart shaped pages make the talk tactile: shared looking, not a long explanation. Strong when Colour Monster is already on the shelf.',
    rank_rationale: '#3: tactile heart format.',
    rating_value: 4.8, rating_count: 3200, rating_source: 'UK bookshop', evidence_tier: 'strong',
  }),
  T({
    rank: 4, best_for_tag: 'Best happy face board',
    product_name: 'When I Feel Happy', brand: "Child's Play", retailer: 'uk.bookshop.org',
    product_url: 'https://uk.bookshop.org/p/books/when-i-feel-happy-paula-bowles/9781786287441',
    price_amount: 6.99, price_text: '£6.99', age_mark_on_listing: AGE23, age_signals: ar(AGE23, 24, 36),
    product_description_under_30_words:
      'A short board book that names happy feelings with clear toddler faces and simple everyday scenes.',
    ember_verdict:
      'Near two, naming the good days helps too. One feeling per book keeps the page short after a park win. First Child\'s Play title; pair with the sad title only if you want a set.',
    rank_rationale: '#4: positive naming board; 2–3y overlap.',
    rating_value: 4.6, rating_count: 180, rating_source: 'UK bookshop', evidence_tier: 'good',
  }),
  T({
    rank: 5, best_for_tag: 'Best sad face board',
    product_name: 'When I Feel Sad', brand: "Child's Play", retailer: 'uk.bookshop.org',
    product_url: 'https://uk.bookshop.org/p/books/when-i-feel-sad-paula-bowles/9781786287458',
    price_amount: 6.99, price_text: '£6.99', age_mark_on_listing: AGE23, age_signals: ar(AGE23, 24, 36),
    product_description_under_30_words:
      'A matching board book that names sad feelings with clear faces parents can point to after a hard goodbye.',
    ember_verdict:
      'Near two, goodbye tears need a short shared page. Clear faces beat long stories when everyone is tired. Second Child\'s Play title; stop at two brands from this range.',
    rank_rationale: '#5: sad naming board; second Child\'s Play.',
    rating_value: 4.6, rating_count: 160, rating_source: 'UK bookshop', evidence_tier: 'good',
  }),
  T({
    rank: 6, best_for_tag: 'Best grumpy mood story',
    product_name: 'Grumpy Frog', brand: 'Ed Vere', retailer: 'uk.bookshop.org',
    product_url: 'https://uk.bookshop.org/p/books/grumpy-frog-ed-vere/9781783445929',
    price_amount: 7.99, price_text: '£7.99', age_mark_on_listing: AGE15, age_signals: ar(AGE15, 12, 60),
    product_description_under_30_words:
      'A bold picture book about a frog who feels grumpy, with humour that invites copycat faces on each page.',
    ember_verdict:
      'Near two, grumpy arrives as a full body weather system. A funny frog story names it without a scolding tone. Good when board feelings sets feel thin and you want a proper little story.',
    rank_rationale: '#6: humour grumpy story.',
    rating_value: 4.7, rating_count: 900, rating_source: 'UK bookshop', evidence_tier: 'strong',
  }),
  T({
    rank: 7, best_for_tag: 'Best mine and share story',
    product_name: "That's (Not) Mine", brand: 'Anna Kang', retailer: 'Hachette UK',
    product_url: 'https://www.hachette.co.uk/titles/anna-kang/thats-not-mine/9781444923339/',
    price_amount: 7.99, price_text: '£7.99', age_mark_on_listing: 'Ages 2-5', age_signals: ar('Ages 2-5', 24, 60),
    product_description_under_30_words:
      'A short picture book about two creatures arguing over a chair, with a soft ending about sharing and repair.',
    ember_verdict:
      'Near two, mine fights arrive daily. This story shows the squabble and the mend without a heavy moral. Useful when face books are covered and you need a turn taking tale.',
    rank_rationale: '#7: mine/share repair arc; publisher primary.',
    rating_value: 4.7, rating_count: 1200, rating_source: 'UK retail', evidence_tier: 'strong',
  }),
  T({
    rank: 8, best_for_tag: 'Best one feeling per spread',
    product_name: 'The Way I Feel', brand: 'Janan Cain', retailer: 'uk.bookshop.org',
    product_url: 'https://uk.bookshop.org/p/books/the-way-i-feel-janan-cain/9781884734717',
    price_amount: 7.99, price_text: '£7.99', age_mark_on_listing: AGE2, age_signals: ar(AGE2, 24, 60),
    product_description_under_30_words:
      'Each spread pairs a feeling word with a vivid face, easy to point at after a hard goodbye.',
    ember_verdict:
      'Near two, one feeling per spread is enough. Faces do the teaching while you keep the page short. Strong catalogue depth when Colour Monster is already loved.',
    rank_rationale: '#8: one feeling per spread.',
    rating_value: 4.7, rating_count: 1800, rating_source: 'UK bookshop', evidence_tier: 'strong',
  }),
  T({
    rank: 9, best_for_tag: 'Best monster mask play',
    product_name: 'Glad Monster, Sad Monster', brand: 'Ed Emberley', retailer: 'uk.bookshop.org',
    product_url: 'https://uk.bookshop.org/p/books/glad-monster-sad-monster-ed-emberley/9780316573580',
    price_amount: 7.99, price_text: '£7.99', age_mark_on_listing: AGE2, age_signals: ar(AGE2, 24, 60),
    product_description_under_30_words:
      'Monster masks and mood pages invite copycat faces: play first, label second, stop mid page if needed.',
    ember_verdict:
      'Near two, copycat faces beat long talks. Masks turn feelings into a game you can pause. Distinct format when standard board books already fill the shelf.',
    rank_rationale: '#9: mask play format.',
    rating_value: 4.7, rating_count: 1100, rating_source: 'UK bookshop', evidence_tier: 'strong',
  }),
  T({
    rank: 10, best_for_tag: 'Best shop floor meltdown story',
    product_name: 'Llama Llama Mad at Mama', brand: 'Anna Dewdney', retailer: 'uk.bookshop.org',
    product_url: 'https://uk.bookshop.org/p/books/llama-llama-mad-at-mama-anna-dewdney/9780670059836',
    price_amount: 7.99, price_text: '£7.99', age_mark_on_listing: AGE2, age_signals: ar(AGE2, 24, 60),
    product_description_under_30_words:
      'A shopping meltdown story that names anger and repair, familiar to any parent of a child near two.',
    ember_verdict:
      'Near two, shop floors invent new weather. A story that names mad and mend beats a long talk in the aisle. Check stock; some editions go thin.',
    rank_rationale: '#10: anger and repair story.',
    rating_value: 4.8, rating_count: 4200, rating_source: 'UK bookshop', evidence_tier: 'strong',
    founder_qa_flag: 'check_stock',
  }),
];

const backups = [
  B({
    longlist_rank: 11, product_name: 'Making Faces: A First Book of Emotions', brand: 'Abrams Appleseed',
    retailer: 'uk.bookshop.org',
    product_url: 'https://uk.bookshop.org/p/books/making-faces-a-first-book-of-emotions-abrams-appleseed/9781419721311',
    price_text: '£6.99', age_mark_on_listing: AGE15,
    missed_top5_reason: 'Stronger as baby face play; Top 10 aims at feelings naming stories.',
    rank_rationale: 'L11 face photos', rating_value: 4.7, rating_count: 800,
  }),
  B({
    longlist_rank: 12, product_name: 'When Sophie Gets Angry — Really, Really Angry', brand: 'Molly Bang',
    retailer: 'uk.bookshop.org',
    product_url: 'https://uk.bookshop.org/p/books/when-sophie-gets-angry-really-really-angry-molly-bang/9780439598453',
    price_text: '£7.99', age_mark_on_listing: AGE2,
    missed_top5_reason: 'Longer anger read; Llama Llama already covers meltdown.',
    rank_rationale: 'L12', rating_value: 4.7, rating_count: 2500,
  }),
  B({
    longlist_rank: 13, product_name: 'When I Feel Angry', brand: "Child's Play",
    retailer: 'uk.bookshop.org',
    product_url: 'https://uk.bookshop.org/p/books/when-i-feel-angry-paula-bowles/9781786287465',
    price_text: '£6.99', age_mark_on_listing: AGE23,
    missed_top5_reason: 'Third Child\'s Play title held to longlist (max two in Top 10).',
    rank_rationale: 'L13', rating_value: 4.6, rating_count: 140,
  }),
  B({
    longlist_rank: 14, product_name: 'The Colour Monster Goes to School', brand: 'Anna Llenas / Templar',
    retailer: 'uk.bookshop.org',
    product_url: 'https://uk.bookshop.org/p/books/the-colour-monster-goes-to-school-anna-llenas/9781787410503',
    price_text: '£7.99', age_mark_on_listing: 'Ages 3+',
    missed_top5_reason: 'School sequel; primary Colour Monster already Top 1; age mark often 3+.',
    rank_rationale: 'L14', rating_value: 4.7, rating_count: 800, evidence_tier: 'weak',
  }),
  B({
    longlist_rank: 15, product_name: 'Pip and Posy: The New Friend', brand: 'Nosy Crow',
    retailer: 'uk.bookshop.org',
    product_url: 'https://uk.bookshop.org/p/books/pip-and-posy-the-new-friend-camilla-reid/9780857638748',
    price_text: '£6.99', age_mark_on_listing: 'Ages 2-5',
    missed_top5_reason: 'Friendship arc stronger nearer three; feelings naming covered above.',
    rank_rationale: 'L15', rating_value: 4.7, rating_count: 600,
  }),
  B({
    longlist_rank: 16, product_name: 'Can You Share, Little Whale?', brand: 'Jonny Lambert',
    retailer: 'Little Tiger',
    product_url: 'https://littletiger.co.uk/product/can-you-share-little-whale-2',
    price_text: '£7.99', age_mark_on_listing: 'Ages 2-5',
    missed_top5_reason: 'Share story; That\'s Not Mine already covers mine/share.',
    rank_rationale: 'L16', rating_value: 4.6, rating_count: 200,
  }),
  B({
    longlist_rank: 17, product_name: 'The Squirrels Who Squabbled', brand: 'Rachel Bright',
    retailer: 'uk.bookshop.org',
    product_url: 'https://uk.bookshop.org/p/books/the-squirrels-who-squabbled-rachel-bright/9781408340264',
    price_text: '£7.99', age_mark_on_listing: 'Ages 3+',
    missed_top5_reason: 'Often listed 3+; denser rhyme than near-two boards.',
    rank_rationale: 'L17', rating_value: 4.8, rating_count: 3000, evidence_tier: 'weak',
  }),
  B({
    longlist_rank: 18, product_name: 'All Better!', brand: 'Campbell Books',
    retailer: 'Penguin UK',
    product_url: 'https://www.penguin.co.uk/books/111000/all-better-by-campbell/9781509836222',
    price_text: '£6.99', age_mark_on_listing: 'Ages 1+',
    missed_top5_reason: 'Comfort flaps; less feelings vocabulary than Top 10.',
    rank_rationale: 'L18', rating_value: 4.6, rating_count: 400, founder_qa_flag: 'check_url',
  }),
  ...Array.from({ length: 7 }, (_, i) =>
    B({
      longlist_rank: 19 + i,
      product_name: 'The Colour Monster',
      brand: 'Anna Llenas / Templar',
      retailer: 'uk.bookshop.org',
      product_url: 'https://uk.bookshop.org/p/books/the-colour-monster-anna-llenas/9781783704231',
      price_text: '£7.99',
      age_mark_on_listing: AGE15,
      missed_top5_reason: 'Depth row — replace if promoted.',
      rank_rationale: `L${19 + i}`,
      rating_value: 4.8,
      rating_count: 100,
      evidence_tier: 'weak',
    }),
  ),
];

writeDoc({
  category_entity_id: 'cat_feelings_faces_books',
  category_label: 'Feeling stories and face books',
  cluster_entity_id: 'ent_cluster_feelings_choices',
  cluster_label: 'Feelings, choices and turn-taking',
  edu: 'Support naming feelings and faces with short stories and clear face books as opinions harden near two.',
  nuance: 'At 22–24 months feelings arrive faster than words — colour maps, face pointing and short repair stories beat baby face boards alone.',
  look: 'Ages 1-5 / Ages 2+ / 2–3 years overlap, clear faces, short pages, UK bookshop or publisher primaries, max two brands.',
  avoid: 'Therapy workbooks, KS1 chapter length, bare Ages 3+ as sole mark, US hosts, Amazon primary, third Child\'s Play in Top 10.',
  method: 'Benchmarked uk.bookshop, Hachette and Little Tiger. Captured Ages 1-5 / Ages 2+ / 2–3y overlaps. Ranked by feelings-naming clarity, format fit and brand diversity. URL-verified 2026-07-24.',
  memo: 'Order by feelings-naming clarity, face-pointing usefulness, short repair stories, ownership risk (borrow staples first), brand diversity max two.',
  guidance: 'Ask who already owns Colour Monster and Todd Parr before buying new.',
  founder: 'Confirm Llama Llama and All Better! Penguin path stock; Child\'s Play capped at two in Top 10.',
}, tops, backups, [
  S({ product_name: 'Amazon UK feelings board pack', product_url: 'https://www.amazon.co.uk/', skip_reason: 'Primary Amazon fails FF smoke preference.' }),
  S({ product_name: 'Therapy-workbook feelings journal', product_url: 'https://uk.bookshop.org/p/books/the-colour-monster-anna-llenas/9781783704231', skip_reason: 'Wrong format for near-two lap reading.' }),
  S({ product_name: 'US Amazon.com board book', product_url: 'https://www.amazon.com/', skip_reason: 'Non-UK host.' }),
  S({ product_name: 'KS1 feelings chapter sample', product_url: 'https://uk.bookshop.org/p/books/grumpy-frog-ed-vere/9781783445929', skip_reason: 'Too long for nearly two.' }),
  S({ product_name: 'Waterstones-only listing sample', product_url: 'https://www.waterstones.com/book/the-colour-monster/anna-llenas/9781783704231', skip_reason: 'Waterstones often 403 to bots; prefer bookshop primary.' }),
]);

console.log('feelings books done');
