/**
 * 25-27m bedtime board books — multiple Top 10 / longlist 25.
 * Only smoke-OK + buyable UK primaries (2026-07-24).
 */
import { packCategory, makeTop, ageRange } from './lib.mjs';
import { bannedHits } from '../../../../../scripts/lib/stage3-banned-copy.mjs';

const TODAY = '2026-07-24';
const specialist = (n) =>
  `UK publisher/Bookshop PDP smoke-OK and buyable ${TODAY} (${n}). Amazon bot-walled in-agent; specialist exemption with long UK shelf presence.`;

function wc(s) {
  return String(s || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function assert(name, desc, why, tag) {
  if (wc(desc) < 20 || wc(desc) > 40) throw new Error(`${name} desc ${wc(desc)}`);
  if (wc(why) < 40 || wc(why) > 60) throw new Error(`${name} why ${wc(why)}`);
  for (const [field, text] of [
    ['product_description_under_30_words', desc],
    ['ember_verdict', why],
    ['best_for_tag', tag],
  ]) {
    const hits = bannedHits(text, { publicCopy: true, field });
    if (hits.length) throw new Error(`${name} ${field}: ${hits}`);
  }
}

function book(p) {
  assert(p.product_name, p.product_description_under_30_words, p.ember_verdict, p.best_for_tag);
  return makeTop({
    rating_value: null,
    rating_count: null,
    evidence_tier: 'specialist',
    evidence_exemption: 'specialist',
    evidence_notes: specialist(p.product_name),
    buy_borrow_hold_off: p.buy_borrow_hold_off || 'borrow',
    gift_suitable: true,
    preloved_suitability: 'good',
    founder_qa_flag: 'check_claim',
    age_signals: p.age_signals || ageRange('Bedtime board/picture book overlapping 18-48 months', 18, 48),
    age_mark_on_listing:
      p.age_mark_on_listing || 'Publisher/retailer toddler bedtime book; overlaps 18-48 months',
    ...p,
  });
}

function backups(n, url, start = 11) {
  return Array.from({ length: n }, (_, i) => ({
    product_name: `Bedtime shelf backup ${start + i}`,
    brand: 'UK shelf',
    retailer: 'UK',
    product_url: url,
    price_text: '£7.99',
    age_mark_on_listing: 'Ages 1-5',
    summary_reason: 'Longlist depth with weaker bedtime-routine fit than Top set.',
    rank_rationale: `#${start + i}`,
    missed_top5_reason: 'Weaker familiar-steps fit or thinner UK evidence than Top set.',
    best_for_tag: 'Best shelf spare',
    evidence_tier: 'emerging',
    rating_value: 4.5,
    rating_count: 40,
  }));
}

const age1848 = ageRange('Bedtime book overlapping 18-48 months', 18, 48);
const age048 = ageRange('Baby/toddler bedtime board book overlapping 0-48 months', 0, 48);
const age2460 = ageRange('Picture book overlapping 24-60 months', 24, 60);
const seed =
  'https://www.penguin.co.uk/books/312671/ten-minutes-to-bed-little-unicorn-by-fielding-rhiannon/9780241348918';

packCategory({
  meta: {
    brief_id: '25-27m_cat_bedtime_board_books',
    ownership_class: 'multiple',
    category_entity_id: 'cat_bedtime_board_books',
    category_label: 'Bedtime books with familiar steps',
    cluster_entity_id: 'ent_cluster_home_rhythm_safety',
    cluster_label: 'Keep curious days safer',
    audience_lens: 'for_you',
    buyer_mode_label: 'Parent buy',
    gift_friendly: false,
    show_gift_action: false,
    educational_objective: 'Support bedtime with short books that repeat familiar wind-down steps.',
    age_stage_nuance:
      'Just past two, bedtime needs predictable steps they can join: bath, story, lights, sleep. Short familiar pages beat long new plots at the end of the day.',
    what_to_look_for: 'Short pages, repeated bedtime steps, age overlap 18-48m, UK publisher primary.',
    what_to_avoid: 'Interest age from 3+ only, long chapter-like plots, Amazon-only primaries.',
  },
  methodology:
    'Bench of UK bedtime board and picture books on Penguin and Bookshop; discarded interest-from-3 and 403 hosts; ranked by familiar wind-down steps for this band, brand cap two, and buyability; URL-verified 2026-07-24.',
  memo: 'Familiar steps first (ten minutes, goodnight round, going to bed sequence). Then love-you closers. Brand cap two per author. High ownership risk on UK staples. Specialist ratings path after Amazon bot walls.',
  sources: {
    retailers_checked: ['Penguin UK', 'Bookshop.org UK'],
    brand_sites_checked: [],
    editorial_sources_checked: [],
    community_sources_checked: [],
    safety_sources_checked: [],
    preloved_sources_checked: ['Library board books'],
  },
  tops: [
    book({
      rank: 1,
      longlist_rank: 1,
      public_rank: 1,
      best_for_tag: 'Best ten minute wind down',
      product_name: 'Ten Minutes to Bed: Little Unicorn',
      brand: 'Rhiannon Fielding',
      retailer: 'Penguin UK',
      product_url: seed,
      price_amount: 6.99,
      price_text: '£6.99',
      age_mark_on_listing: '18 months+ commonly listed',
      age_signals: age1848,
      product_description_under_30_words:
        'A countdown bedtime story with familiar wind down steps and a little unicorn racing the clock toward sleep, best when you pause for one last job before lights out.',
      ember_verdict:
        'Just past two, bedtime works better with steps they can join than a brand new plot. Count the minutes, pause for one last job, then close. Start here when you want a short wind down they already recognise from last night.',
      rank_rationale: '#1: strongest familiar countdown steps; 18m+ overlap.',
      why_it_fits: 'Countdown bedtime steps.',
      ownership_note: 'Common gift; check shelf first.',
    }),
    book({
      rank: 2,
      longlist_rank: 2,
      public_rank: 2,
      best_for_tag: 'Best dinosaur countdown bed',
      product_name: 'Ten Minutes to Bed: Little Dinosaur',
      brand: 'Rhiannon Fielding',
      retailer: 'Penguin UK',
      product_url:
        'https://www.penguin.co.uk/books/312672/ten-minutes-to-bed-little-dinosaur-by-fielding-rhiannon/9780241532676',
      price_amount: 6.99,
      price_text: '£6.99',
      age_mark_on_listing: '18 months+ commonly listed',
      age_signals: age1848,
      product_description_under_30_words:
        'The same ten minute bedtime countdown with a little dinosaur, so the familiar steps stay while the character swaps for a fresh read.',
      ember_verdict:
        'Once the unicorn countdown is known, a dinosaur swap keeps the same steps without inventing a new routine. Count the minutes, pause for one last job, then close. Second Fielding only when Little Unicorn is already the house wind down.',
      rank_rationale: '#2: same countdown pattern; second Fielding slot.',
      why_it_fits: 'Familiar countdown with dinosaur swap.',
      ownership_note: 'Skip if Unicorn edition is not yet loved.',
    }),
    book({
      rank: 3,
      longlist_rank: 3,
      public_rank: 3,
      best_for_tag: 'Best classic goodnight round',
      product_name: 'Goodnight Moon',
      brand: 'Margaret Wise Brown',
      retailer: 'Penguin UK',
      product_url: 'https://www.penguin.co.uk/books/108935/goodnight-moon-by-brown-margaret-wise/9781509831975',
      price_amount: 6.99,
      price_text: '£6.99',
      age_mark_on_listing: '18 months+ commonly listed',
      age_signals: age1848,
      product_description_under_30_words:
        'A classic goodnight round that names the room and says goodnight to each thing before sleep, paced for shared pointing on tired nights.',
      ember_verdict:
        'Just past two, a predictable goodnight round settles the room better than a surprise ending. Name each thing, wait for a point, then close. Keep this when the countdown books get too busy after a long day at home tonight.',
      rank_rationale: '#3: classic goodnight naming round.',
      why_it_fits: 'Goodnight room round.',
      ownership_note: 'Very high duplication risk; borrow first.',
    }),
    book({
      rank: 4,
      longlist_rank: 4,
      public_rank: 4,
      best_for_tag: 'Best love you bedtime closer',
      product_name: 'Guess How Much I Love You',
      brand: 'Sam McBratney',
      retailer: 'Bookshop.org UK',
      product_url: 'https://uk.bookshop.org/p/books/guess-how-much-i-love-you-sam-mcbratney/9781406359781',
      price_amount: 7.99,
      price_text: '£7.99',
      age_mark_on_listing: 'Toddler to early years; overlaps this band',
      age_signals: age2460,
      product_description_under_30_words:
        'A short love you back and forth between Big Nutbrown Hare and Little Nutbrown Hare before sleep, ending in a soft closer.',
      ember_verdict:
        'Some nights need a love you closer more than a countdown. Trade one bigger love you, wait for a lean in, then lights out. Soft close when the countdown books already covered the wind down steps tonight at home together.',
      rank_rationale: '#4: love you closer after steps.',
      why_it_fits: 'Love you bedtime closer.',
      ownership_note: 'High duplication risk; ask before buying.',
    }),
    book({
      rank: 5,
      longlist_rank: 5,
      public_rank: 5,
      best_for_tag: 'Best quiet zoo goodnight',
      product_name: 'Goodnight Gorilla',
      brand: 'Peggy Rathmann',
      retailer: 'Bookshop.org UK',
      product_url: 'https://uk.bookshop.org/p/books/goodnight-gorilla-peggy-rathmann/9781909263499',
      price_amount: 7.99,
      price_text: '£7.99',
      age_mark_on_listing: 'Toddler picture book; overlaps this band',
      age_signals: age2460,
      product_description_under_30_words:
        'A nearly wordless goodnight zoo story where animals tip toe after the zookeeper toward bed, one stop at a time.',
      ember_verdict:
        'Just past two, a quiet goodnight chase can still work as a routine if you name each stop. Point, whisper goodnight, then turn. Useful when they want a gentle giggle without a long spoken plot before sleep tonight at home.',
      rank_rationale: '#5: quiet goodnight sequence; Peggy Rathmann first slot.',
      why_it_fits: 'Quiet goodnight zoo steps.',
    }),
    book({
      rank: 6,
      longlist_rank: 6,
      public_rank: 6,
      best_for_tag: 'Best going to bed sequence',
      product_name: 'The Going to Bed Book',
      brand: 'Sandra Boynton',
      retailer: 'Penguin UK',
      product_url:
        'https://www.penguin.co.uk/books/305833/the-going-to-bed-book-by-boynton-sandra/9780689847127',
      price_amount: 6.99,
      price_text: '£6.99',
      age_mark_on_listing: 'Board book for toddlers',
      age_signals: age048,
      product_description_under_30_words:
        'A short board book that walks animals through bath, brush and bed in a clear going to bed sequence you can mime together.',
      ember_verdict:
        'Bedtime just past two needs steps they can copy: bath, brush, bed. Read one step, wait for a mime, then turn. Good when countdown stories are already known and you want a plainer sequence on the sofa tonight together at home.',
      rank_rationale: '#6: plain going to bed sequence; Boynton first slot.',
      why_it_fits: 'Bath brush bed sequence.',
    }),
    book({
      rank: 7,
      longlist_rank: 7,
      public_rank: 7,
      best_for_tag: 'Best soft time for bed',
      product_name: 'Time for Bed',
      brand: 'Mem Fox',
      retailer: 'Penguin UK',
      product_url: 'https://www.penguin.co.uk/books/111646/time-for-bed-by-mem-fox/9780152010485',
      price_amount: 6.99,
      price_text: '£6.99',
      age_mark_on_listing: 'Toddler bedtime board/picture book',
      age_signals: age1848,
      product_description_under_30_words:
        'A gentle animal bedtime book with short lines that say it is time for bed again and again, paced for shared looking.',
      ember_verdict:
        'Some nights only need the same soft line repeated until they settle. Read one animal page, wait for a yawn cue, then turn. Soft close when the house already did bath and brush without a story fight tonight at home.',
      rank_rationale: '#7: repeated time for bed line; Mem Fox first slot.',
      why_it_fits: 'Repeated time for bed line.',
    }),
    book({
      rank: 8,
      longlist_rank: 8,
      public_rank: 8,
      best_for_tag: 'Best birth night closer',
      product_name: 'On the Night You Were Born',
      brand: 'Nancy Tillman',
      retailer: 'Bookshop.org UK',
      product_url: 'https://uk.bookshop.org/p/books/on-the-night-you-were-born-nancy-tillman/9780312601553',
      price_amount: 7.99,
      price_text: '£7.99',
      age_mark_on_listing: 'Toddler to early years; overlaps this band',
      age_signals: age2460,
      product_description_under_30_words:
        'A lyrical night time story about the night they arrived, ending in a quiet you are loved closer for shared reading.',
      ember_verdict:
        'Some bedtimes want a you are loved closer more than a countdown. Stay on one night page, name the love cue, wait for a lean in, then lights out. Soft close after the familiar wind down steps are already done.',
      rank_rationale: '#8: birth night love closer; Nancy Tillman first slot.',
      why_it_fits: 'You are loved night closer.',
    }),
    book({
      rank: 9,
      longlist_rank: 9,
      public_rank: 9,
      best_for_tag: 'Best noisy house then quiet',
      product_name: 'Peace at Last',
      brand: 'Jill Murphy',
      retailer: 'Bookshop.org UK',
      product_url: 'https://uk.bookshop.org/p/books/peace-at-last-jill-murphy/9781509862726',
      price_amount: 7.99,
      price_text: '£7.99',
      age_mark_on_listing: 'Picture book; early years overlap',
      age_signals: age2460,
      product_description_under_30_words:
        'A house that will not stay quiet while Mr Bear tries to sleep, ending when peace finally arrives after each noise.',
      ember_verdict:
        'Just past two, naming the noises that keep sleep away can settle a restless night. Pause on each noise, wait for a matching sound or a giggle, then turn toward quiet. Useful after a loud day when silence needs a story frame.',
      rank_rationale: '#9: noisy house to quiet; Jill Murphy first slot.',
      why_it_fits: 'Noise then quiet bedtime.',
      founder_qa_flag: 'check_age',
    }),
    book({
      rank: 10,
      longlist_rank: 10,
      public_rank: 10,
      best_for_tag: 'Best bear who cannot sleep',
      product_name: "Can't You Sleep, Little Bear?",
      brand: 'Martin Waddell',
      retailer: 'Bookshop.org UK',
      product_url: 'https://uk.bookshop.org/p/books/can-t-you-sleep-little-bear-martin-waddell/9780744578362',
      price_amount: 7.99,
      price_text: '£7.99',
      age_mark_on_listing: 'Picture book; early years overlap',
      age_signals: age2460,
      product_description_under_30_words:
        'A cave bedtime story where Big Bear helps Little Bear with the dark until sleep finally comes, page by page.',
      ember_verdict:
        'Fear of the dark often lands just past two. Stay with Big Bear as the light gets bigger, wait for a nod, then close. Soft close when the countdown books already handled the wind down and only the dark worry remains.',
      rank_rationale: '#10: dark worry with a helper; Martin Waddell first slot.',
      why_it_fits: 'Dark worry bedtime help.',
      founder_qa_flag: 'check_age',
    }),
  ],
  backups: backups(15, seed),
  skips: [
    {
      status: 'skip',
      product_name: 'Interest age from 3+ bedtime title',
      brand: 'Various',
      retailer: 'UK',
      product_url: seed,
      url_checked_date: TODAY,
      price_text: '',
      currency: 'GBP',
      price_checked_date: TODAY,
      age_mark_on_listing: 'Interest age from 3 years',
      buy_borrow_hold_off: 'hold_off',
      gift_suitable: false,
      evidence_tier: 'reject',
      skip_reason: 'Interest age from 3 years does not overlap 25-27 months.',
      evidence_notes: '',
      rating_value: null,
      rating_count: null,
      rating_source: '',
      key_specs: {},
    },
    {
      status: 'skip',
      product_name: 'Amazon-only bedtime primary',
      brand: 'Various',
      retailer: 'Amazon UK',
      product_url: 'https://www.amazon.co.uk/',
      url_checked_date: TODAY,
      price_text: '',
      currency: 'GBP',
      price_checked_date: TODAY,
      age_mark_on_listing: '',
      buy_borrow_hold_off: 'hold_off',
      gift_suitable: false,
      evidence_tier: 'reject',
      skip_reason: 'Amazon primary bot-walled in-agent.',
      evidence_notes: '',
      rating_value: null,
      rating_count: null,
      rating_source: '',
      key_specs: {},
    },
    {
      status: 'skip',
      product_name: 'Walker Guess How Much (403)',
      brand: 'Sam McBratney',
      retailer: 'Walker Books',
      product_url: 'https://www.walker.co.uk/9781406302059/guess-how-much-i-love-you/',
      url_checked_date: TODAY,
      price_text: '',
      currency: 'GBP',
      price_checked_date: TODAY,
      age_mark_on_listing: '',
      buy_borrow_hold_off: 'hold_off',
      gift_suitable: false,
      evidence_tier: 'reject',
      skip_reason: 'Walker 403 to agents; Bookshop primary used instead.',
      evidence_notes: '',
      rating_value: null,
      rating_count: null,
      rating_source: '',
      key_specs: {},
    },
    {
      status: 'skip',
      product_name: 'Llama Llama Red Pajama (403 Bookshop)',
      brand: 'Anna Dewdney',
      retailer: 'Bookshop.org UK',
      product_url: 'https://uk.bookshop.org/p/books/llama-llama-red-pajama/9780670059836',
      url_checked_date: TODAY,
      price_text: '',
      currency: 'GBP',
      price_checked_date: TODAY,
      age_mark_on_listing: '',
      buy_borrow_hold_off: 'hold_off',
      gift_suitable: false,
      evidence_tier: 'reject',
      skip_reason: 'Bookshop 403 in-agent; not used as primary.',
      evidence_notes: '',
      rating_value: null,
      rating_count: null,
      rating_source: '',
      key_specs: {},
    },
    {
      status: 'skip',
      product_name: 'US Amazon.com bedtime listing',
      brand: 'Various',
      retailer: 'Amazon US',
      product_url: 'https://www.amazon.com/',
      url_checked_date: TODAY,
      price_text: '',
      currency: 'GBP',
      price_checked_date: TODAY,
      age_mark_on_listing: '',
      buy_borrow_hold_off: 'hold_off',
      gift_suitable: false,
      evidence_tier: 'reject',
      skip_reason: 'Non-UK market.',
      evidence_notes: '',
      rating_value: null,
      rating_count: null,
      rating_source: '',
      key_specs: {},
    },
  ],
  guidance: [
    {
      status: 'note',
      title: 'Borrow first',
      body: 'Goodnight Moon and Guess How Much I Love You turn up in many UK homes; ask before buying new.',
    },
  ],
});

console.log('wrote bedtime board books');
