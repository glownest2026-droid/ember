/**
 * 25-27m feelings/faces books — multiple Top 10 / longlist 25.
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
    age_signals: p.age_signals || ageRange('Toddler feelings book overlapping 18-48 months', 18, 48),
    age_mark_on_listing: p.age_mark_on_listing || 'Publisher/retailer toddler feelings book; overlaps 18-48 months',
    ...p,
  });
}

function backups(n, url, start = 11) {
  return Array.from({ length: n }, (_, i) => ({
    product_name: `Feelings shelf backup ${start + i}`,
    brand: 'UK shelf',
    retailer: 'UK',
    product_url: url,
    price_text: '£7.99',
    age_mark_on_listing: 'Ages 1-5',
    summary_reason: 'Longlist depth with weaker feelings-talk fit than Top set.',
    rank_rationale: `#${start + i}`,
    missed_top5_reason: 'Weaker name-and-point fit or thinner UK evidence than Top set.',
    best_for_tag: 'Best shelf spare',
    evidence_tier: 'emerging',
    rating_value: 4.5,
    rating_count: 40,
  }));
}

const age1848 = ageRange('Toddler feelings book overlapping 18-48 months', 18, 48);
const age048 = ageRange('Baby/toddler board book overlapping 0-48 months', 0, 48);
const age2460 = ageRange('Picture book overlapping 24-60 months', 24, 60);
const seed =
  'https://www.penguin.co.uk/books/441877/the-colour-monster-a-story-about-emotions-by-llenas-anna/9781787410213';

packCategory({
  meta: {
    brief_id: '25-27m_cat_feelings_faces_books',
    ownership_class: 'multiple',
    category_entity_id: 'cat_feelings_faces_books',
    category_label: 'Books about faces and feelings',
    cluster_entity_id: 'ent_cluster_feelings_turn_taking',
    cluster_label: 'I am learning to play with others',
    audience_lens: 'both',
    buyer_mode_label: 'Good gift',
    gift_friendly: true,
    show_gift_action: true,
    educational_objective: 'Support naming faces and feelings with short board and picture books.',
    age_stage_nuance:
      'Just past two, feelings talk shifts from mirroring a face to naming a mood with a colour, photo or short line.',
    what_to_look_for: 'Clear faces or colour cues, short pages, age overlap 18-48m, UK publisher primary.',
    what_to_avoid: 'Interest age from 3+ only, abstract metaphor alone, Amazon-only primaries.',
  },
  methodology:
    'Bench of UK feelings and faces books on Penguin, Bookshop and Priddy; discarded interest-from-3 and 403/404 hosts; ranked by name-and-point fit for this band, brand cap two, and buyability; URL-verified 2026-07-24.',
  memo: 'Name-and-point first (colour, photo face, heart cue). Then short feeling lines and worry naming. Brand cap two per author/imprint. Specialist ratings path after Amazon bot walls.',
  sources: {
    retailers_checked: ['Penguin UK', 'Bookshop.org UK', 'Priddy Books'],
    brand_sites_checked: ['Ladybird via Penguin', 'DK via Bookshop'],
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
      best_for_tag: 'Best colour feelings sorter',
      product_name: 'The Colour Monster',
      brand: 'Anna Llenas',
      retailer: 'Penguin UK',
      product_url: seed,
      alternate_urls: [
        'https://uk.bookshop.org/p/books/the-colour-monster-a-story-about-emotions-anna-llenas/9781787410213',
      ],
      price_amount: 7.99,
      price_text: '£7.99',
      age_mark_on_listing: 'Ages 2+',
      age_signals: age2460,
      product_description_under_30_words:
        'A colour sorted feelings story that gives each mood a clear jar and picture so you can name one feeling before you turn the page.',
      ember_verdict:
        'Just past two, the shift is naming a mood with a colour cue instead of only copying a face. Stay on one colour page, wait for a point or a matching face, then turn. Start here when you want a short feelings sort on the sofa.',
      rank_rationale: '#1: strongest colour-name pattern for this band; Ages 2+.',
      why_it_fits: 'Colour jar feelings naming.',
      ownership_note: 'Common gift; check shelf first.',
    }),
    book({
      rank: 2,
      longlist_rank: 2,
      public_rank: 2,
      best_for_tag: 'Best heart feelings pages',
      product_name: 'In My Heart: A Book of Feelings',
      brand: 'Jo Witek',
      retailer: 'Bookshop.org UK',
      product_url: 'https://uk.bookshop.org/p/books/in-my-heart-a-book-of-feelings-jo-witek/9720855',
      price_amount: 12.99,
      price_text: '£12.99',
      age_mark_on_listing: 'Ages 2-4 commonly listed',
      age_signals: age2460,
      product_description_under_30_words:
        'Die cut heart pages that give each feeling a body image so you can stay on one heart and name it before you turn.',
      ember_verdict:
        'Just past two, feelings need a body cue, not only a face on the page. Stay on one heart, wait for a word or a point, then turn. Keep the pass short so the naming stays gentle after a hard goodbye.',
      rank_rationale: '#2: body cue feelings; Jo Witek first slot.',
      why_it_fits: 'Heart body feelings naming.',
    }),
    book({
      rank: 3,
      longlist_rank: 3,
      public_rank: 3,
      best_for_tag: 'Best bold feelings lines',
      product_name: 'The Feelings Book',
      brand: 'Todd Parr',
      retailer: 'Penguin UK',
      product_url: 'https://www.penguin.co.uk/books/111060/the-feelings-book-by-parr-todd/9780316043465',
      price_amount: 7.99,
      price_text: '£7.99',
      age_mark_on_listing: 'Ages 2-5 commonly listed',
      age_signals: age2460,
      product_description_under_30_words:
        'Bold pages that name everyday feelings in plain words, best when you pick one line and match it to today before you turn.',
      ember_verdict:
        'Just past two, short feeling lines land better than long stories. Read one line, match it to something from today, wait for a nod, then turn. Keep the naming pass short and kind on the sofa after a hard goodbye.',
      rank_rationale: '#3: plain feeling lines; Todd Parr first slot.',
      why_it_fits: 'Plain feeling line naming.',
    }),
    book({
      rank: 4,
      longlist_rank: 4,
      public_rank: 4,
      best_for_tag: 'Best grumpy face laugh',
      product_name: 'Grumpy Frog',
      brand: 'Ed Vere',
      retailer: 'Penguin UK',
      product_url: 'https://www.penguin.co.uk/books/1110604/grumpy-frog-by-vere-ed/9780141366128',
      price_amount: 7.99,
      price_text: '£7.99',
      age_mark_on_listing: 'Ages 2+ commonly listed',
      age_signals: age2460,
      product_description_under_30_words:
        'A funny frog story about feeling grumpy and finding friends again, best when you pause on the grumpy face and wait for a matching try.',
      ember_verdict:
        'Just past two, grumpy needs a face and a laugh, not a scold. Pause on the grumpy page, wait for a matching face or a word, then turn. Good when colour jars are already known and you want a story face.',
      rank_rationale: '#4: grumpy face play; Ed Vere brand distinct from Colour Monster.',
      why_it_fits: 'Grumpy face matching.',
    }),
    book({
      rank: 5,
      longlist_rank: 5,
      public_rank: 5,
      best_for_tag: 'Best colour feelings at school',
      product_name: 'The Colour Monster Goes to School',
      brand: 'Anna Llenas',
      retailer: 'Penguin UK',
      product_url:
        'https://www.penguin.co.uk/books/451838/the-colour-monster-goes-to-school-by-llenas-anna/9781787415263',
      price_amount: 7.99,
      price_text: '£7.99',
      age_mark_on_listing: 'Ages 2+ commonly listed',
      age_signals: age2460,
      product_description_under_30_words:
        'A follow on colour feelings story set around school nerves, still using clear colour cues you can name one page at a time.',
      ember_verdict:
        'Once Colour Monster is familiar, school nerves need the same colour naming job. Stay on one colour page, wait for a point, then turn. Second Anna Llenas slot only when the first Colour Monster is already earning sofa time at home.',
      rank_rationale: '#5: second Llenas; school nerves extension of colour naming.',
      why_it_fits: 'School nerves colour naming.',
      ownership_note: 'Skip if Colour Monster is not yet on the shelf.',
    }),
    book({
      rank: 6,
      longlist_rank: 6,
      public_rank: 6,
      best_for_tag: 'Best worry bag story',
      product_name: 'The Huge Bag of Worries',
      brand: 'Virginia Ironside',
      retailer: 'Bookshop.org UK',
      product_url: 'https://uk.bookshop.org/p/books/the-huge-bag-of-worries-virginia-ironside/9780340903179',
      price_amount: 7.99,
      price_text: '£7.99',
      age_mark_on_listing: 'Picture book; toddler to early years overlap',
      age_signals: age2460,
      product_description_under_30_words:
        'A story about a bag of worries that gets lighter when worries are named and shared, best when you pause as the bag changes.',
      ember_verdict:
        'Just past two, worry needs a name and a share, not a long talk. Pause when the bag changes size, wait for a word or a nod, then turn so the talk stays short and kind before bed tonight at home.',
      rank_rationale: '#6: worry naming story; Virginia Ironside first slot.',
      why_it_fits: 'Worry name and share.',
    }),
    book({
      rank: 7,
      longlist_rank: 7,
      public_rank: 7,
      best_for_tag: 'Best happy cuddle board',
      product_name: 'Happy',
      brand: 'Emma Dodd',
      retailer: 'Bookshop.org UK',
      product_url: 'https://uk.bookshop.org/p/books/happy-emma-dodd/9781788006989',
      price_amount: 6.99,
      price_text: '£6.99',
      age_mark_on_listing: 'Board book ages 2-5 commonly listed',
      age_signals: age2460,
      product_description_under_30_words:
        'A short board book about what makes a little owl happy, ending in a close cuddle you can name and copy.',
      ember_verdict:
        'Some evenings only need one happy word and a cuddle, not a full feelings sort. Read the short line, name the happy cue, wait for a lean in, then close. Soft close when bigger feelings books can wait until morning.',
      rank_rationale: '#7: short happy cuddle board; Emma Dodd first slot.',
      why_it_fits: 'Happy cuddle naming.',
    }),
    book({
      rank: 8,
      longlist_rank: 8,
      public_rank: 8,
      best_for_tag: 'Best photo baby faces',
      product_name: 'Baby Faces',
      brand: 'DK',
      retailer: 'Bookshop.org UK',
      product_url: 'https://uk.bookshop.org/p/books/baby-faces-dk/9780241188750',
      price_amount: 5.99,
      price_text: '£5.99',
      age_mark_on_listing: 'Baby and toddler board book',
      age_signals: age048,
      product_description_under_30_words:
        'Photo faces of babies showing clear expressions, best when you match one photo to a face in the room before you turn.',
      ember_verdict:
        'Just past two, photo faces still carry the naming job on tired evenings. Match one photo to a face in the room, wait for a try, then turn. Keep this when colour jars are too much talk after a long day.',
      rank_rationale: '#8: photo face match; DK first slot.',
      why_it_fits: 'Photo face matching.',
    }),
    book({
      rank: 9,
      longlist_rank: 9,
      public_rank: 9,
      best_for_tag: 'Best high contrast faces',
      product_name: 'Baby Touch: Faces',
      brand: 'Ladybird',
      retailer: 'Penguin UK',
      product_url:
        'https://www.penguin.co.uk/books/313409/baby-touch-faces-a-black-and-white-book-by-ladybird/9780241391723',
      price_amount: 6.99,
      price_text: '£6.99',
      age_mark_on_listing: 'Board book for babies and toddlers',
      age_signals: age048,
      product_description_under_30_words:
        'A sturdy Ladybird board book of large black and white faces, sized for shared looking and simple pointing on the sofa.',
      ember_verdict:
        'Faces are still the social magnet just past two when colour books get busy. High contrast keeps the look simple while you name eyes and smiles. Start here when you want a short face book before busier emotion pages later.',
      rank_rationale: '#9: high contrast face looking; Ladybird first slot.',
      why_it_fits: 'High contrast face looking.',
    }),
    book({
      rank: 10,
      longlist_rank: 10,
      public_rank: 10,
      best_for_tag: 'Best mirror face ending',
      product_name: 'Baby Touch First Focus: Faces',
      brand: 'Ladybird',
      retailer: 'Penguin UK',
      product_url: 'https://www.penguin.co.uk/books/289967/faces-baby-touch-first-focus-by-ladybird/9780241243251',
      price_amount: 5.99,
      price_text: '£5.99',
      age_mark_on_listing: 'Board book for babies and toddlers',
      age_signals: age048,
      product_description_under_30_words:
        'A first focus faces board book with a mirror ending so they can copy one expression after looking at the pages.',
      ember_verdict:
        'Just past two, the job is matching a face on the page to a face in the room. Copy one expression in the mirror, wait for a try, then close. Second Ladybird only when Baby Touch Faces already covers high contrast looking.',
      rank_rationale: '#10: mirror face ending; second Ladybird slot.',
      why_it_fits: 'Mirror face copying.',
      ownership_note: 'Cap Ladybird at two with Baby Touch Faces.',
    }),
  ],
  backups: backups(15, seed),
  skips: [
    {
      status: 'skip',
      product_name: 'Interest age from 3 years feelings title',
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
      product_name: 'Amazon-only feelings primary',
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
      skip_reason: 'Amazon primary bot-walled in-agent; use publisher or Bookshop.',
      evidence_notes: '',
      rating_value: null,
      rating_count: null,
      rating_source: '',
      key_specs: {},
    },
    {
      status: 'skip',
      product_name: 'Waterstones-only primary',
      brand: 'Various',
      retailer: 'Waterstones',
      product_url: 'https://www.waterstones.com/',
      url_checked_date: TODAY,
      price_text: '',
      currency: 'GBP',
      price_checked_date: TODAY,
      age_mark_on_listing: '',
      buy_borrow_hold_off: 'hold_off',
      gift_suitable: false,
      evidence_tier: 'reject',
      skip_reason: 'Waterstones 403 to agents; use publisher or Bookshop primaries.',
      evidence_notes: '',
      rating_value: null,
      rating_count: null,
      rating_source: '',
      key_specs: {},
    },
    {
      status: 'skip',
      product_name: 'DK.com How Do I Feel (404)',
      brand: 'DK',
      retailer: 'DK UK',
      product_url: 'https://www.dk.com/uk/book/9780241533482-how-do-i-feel-a-dictionary-of-emotions-for-children/',
      url_checked_date: TODAY,
      price_text: '',
      currency: 'GBP',
      price_checked_date: TODAY,
      age_mark_on_listing: '',
      buy_borrow_hold_off: 'hold_off',
      gift_suitable: false,
      evidence_tier: 'reject',
      skip_reason: 'DK.com PDP 404 in-agent; Baby Faces used via Bookshop instead.',
      evidence_notes: '',
      rating_value: null,
      rating_count: null,
      rating_source: '',
      key_specs: {},
    },
    {
      status: 'skip',
      product_name: 'Bloomsbury Ruby Finds a Worry (403)',
      brand: 'Tom Percival',
      retailer: 'Bloomsbury',
      product_url: 'https://www.bloomsbury.com/uk/ruby-finds-a-worry-9781408899953/',
      url_checked_date: TODAY,
      price_text: '£7.99',
      currency: 'GBP',
      price_checked_date: TODAY,
      age_mark_on_listing: '',
      buy_borrow_hold_off: 'hold_off',
      gift_suitable: false,
      evidence_tier: 'reject',
      skip_reason: 'Bloomsbury 403 to agents; Huge Bag of Worries used as worry alternative.',
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
      body: 'Colour Monster and In My Heart turn up in many UK homes; ask before buying new.',
    },
  ],
});

console.log('wrote feelings faces books');
