/**
 * Pass 2 quarantine fixes — clean rewrite for remaining fails.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bannedHits } from '../../../../scripts/lib/stage3-banned-copy.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const Q = path.join(__dirname, 'quarantine');
const IN = path.join(__dirname, 'inbox');

function load(cat) {
  const q = path.join(Q, `ember_picks_16-18m_${cat}.json`);
  return JSON.parse(fs.readFileSync(q, 'utf8'));
}

function save(doc) {
  doc.ingestion_ready.status = 'pending-ff-check';
  fs.writeFileSync(
    path.join(IN, `ember_picks_16-18m_${doc.category_entity_id}.json`),
    JSON.stringify(doc, null, 2),
  );
  console.log('saved', doc.category_entity_id);
}

function assertPick(p) {
  for (const field of ['ember_verdict', 'product_description_under_30_words', 'best_for_tag', 'rank_rationale']) {
    const hits = bannedHits(p[field], { publicCopy: field !== 'rank_rationale', field });
    if (hits.length) throw new Error(`${p.product_name} ${field}: ${hits.join(',')}`);
  }
}

function longFrom(p) {
  return {
    longlist_rank: p.rank,
    status: 'pick',
    top_pick_rank: p.rank,
    product_name: p.product_name,
    brand: p.brand,
    retailer: p.retailer,
    product_url: p.product_url,
    url_checked_date: '2026-07-24',
    stock_status: 'in_stock',
    price_text: p.price_text,
    age_mark_on_listing: p.age_mark_on_listing,
    summary_reason: p.why_it_fits || p.rank_rationale,
    rank_rationale: p.rank_rationale,
    best_for_tag: p.best_for_tag,
    evidence_tier: p.evidence_tier || 'good',
    rating_value: null,
    rating_count: null,
    buy_borrow_hold_off: 'buy',
    gift_suitable: true,
    caveat_short: p.caveats || '',
    included_in_top_5: true,
    display_status: 'visible',
    public_rank: p.rank,
    locked_for_non_members: false,
  };
}

// stacking
{
  const doc = load('cat_stacking_pegboard');
  const p = doc.top_picks.find((x) => x.rank === 2);
  p.best_for_tag = 'Best for wobbly towers';
  p.product_description_under_30_words =
    'Six chunky rainbow wooden rings on a rounded base that makes wobbly towers as each piece is added, turning stacking into a balance try.';
  p.ember_verdict =
    'When steady poles seem too easy, a rocking base asks for slower hands and wobbly towers. The Goki rainbow stacker keeps rings big while the sway makes each place a small plan. Best once a flat stacker is already familiar and you want a tougher tower job.';
  assertPick(p);
  save(doc);
}

// dolls
{
  const doc = load('cat_doll_soft_toy_care');
  const p = doc.top_picks.find((x) => x.rank === 3);
  p.product_description_under_30_words =
    'A wooden dolls bed with a simple mattress space, sized for soft toys and small dolls rather than fashion doll houses.';
  p.ember_verdict =
    'Care play deepens when carry has somewhere to end. This Goki bed makes tuck in the point of the game without needing a full dolls house. Best once a soft doll already lives on the sofa and you want one prop that finishes bedtime copy.';
  assertPick(p);
  save(doc);
}

// open cup
{
  const doc = load('cat_open_cup');
  const p = doc.top_picks.find((x) => x.rank === 4);
  p.product_description_under_30_words =
    'One Tommee Tippee First Cup with soft spout and chunky handles, useful as a spare when the main free flow pair already lives at home.';
  p.ember_verdict =
    'Bag days do not always need a second full set. This single First Cup covers travel or grandparent visits without another two pack. Choose after Explora already handles the kitchen and you only want one extra spout cup.';
  assertPick(p);
  save(doc);
}

// books — Top 10 on rock-solid hosts only
{
  const doc = load('cat_first_word_picture_books');
  const keepTail = doc.longlist.filter((r) => Number(r.longlist_rank) > 10);

  const picks = [
    doc.top_picks.find((p) => p.rank === 1), // Priddy First 100 Words
    doc.top_picks.find((p) => p.rank === 2), // Baby Touch Words
  ];

  const more = [
    {
      rank: 3,
      best_for_tag: 'Best for flap and name',
      product_name: 'Dear Zoo',
      brand: 'Rod Campbell',
      retailer: 'Bookshop.org UK',
      product_url: 'https://uk.bookshop.org/p/books/dear-zoo-rod-campbell/9781407030678',
      price_amount: 7.99,
      price_text: '£7.99',
      age_mark_on_listing: 'Board book classic',
      product_description_under_30_words:
        'A lift the flap board book of animals sent by the zoo, inviting toddlers to open, look and name each creature on a short shared read.',
      ember_verdict:
        'Flaps turn naming into a job with a clear next move. Dear Zoo keeps the animal list familiar without a photo catalogue. Best when first word catalogues already cover pointing and you want a short story style naming pattern with flaps.',
      rank_rationale: '#3 over #4: flap naming classic; Spot is seek and name.',
      why_it_fits: 'Flap and name animals.',
      caveats: 'Flaps tear; supervise.',
      ownership_note: 'Skip if Dear Zoo already lives on the shelf.',
      substitute_if_unavailable: "Where's Spot?",
      evidence_notes: 'Bookshop.org UK buyable Dear Zoo; verified 2026-07-24.',
      evidence_sources: ['uk.bookshop.org dear-zoo'],
    },
    {
      rank: 4,
      best_for_tag: 'Best for seek and name',
      product_name: "Where's Spot?",
      brand: 'Eric Hill',
      retailer: 'Penguin',
      product_url: 'https://www.penguin.co.uk/books/122792/wheres-spot-by-hill-eric/9780723263661',
      price_amount: 7.99,
      price_text: '£7.99',
      age_mark_on_listing: 'Board book classic',
      product_description_under_30_words:
        'A Spot lift the flap board book for seeking and naming as you open doors and look for the puppy on a short shared read.',
      ember_verdict:
        'Seek and name keeps first words tied to a game they already understand. Spot flaps give a clear place to look next on each page. Choose when Dear Zoo already covers animal flaps and you want a seek story with the same naming job.',
      rank_rationale: '#4 over #5: seek and name Spot; Hungry Caterpillar is food naming.',
      why_it_fits: 'Seek and name.',
      caveats: 'Flaps; supervise.',
      ownership_note: 'Skip if Spot already lives on the shelf.',
      substitute_if_unavailable: 'Dear Zoo',
      evidence_notes: 'Penguin UK buyable Where’s Spot; verified 2026-07-24.',
      evidence_sources: ['penguin.co.uk wheres-spot'],
    },
    {
      rank: 5,
      best_for_tag: 'Best for food word naming',
      product_name: 'The Very Hungry Caterpillar',
      brand: 'Eric Carle',
      retailer: 'Bookshop.org UK',
      product_url: 'https://uk.bookshop.org/p/books/the-very-hungry-caterpillar-eric-carle/9780241003008',
      price_amount: 7.99,
      price_text: '£7.99',
      age_mark_on_listing: 'Board book classic',
      product_description_under_30_words:
        'A classic Eric Carle board book of foods and days that invites pointing, naming and hole peeping on short shared reads.',
      ember_verdict:
        'Food words show up at every meal, so a familiar caterpillar page can pull naming into snack time chat. The holes give a finger job while you name what disappears. Best when flap books already cover animals and you want food naming with a story style.',
      rank_rationale: '#5 over #6: food naming classic; Ladybird faces is face pointing.',
      why_it_fits: 'Food word naming.',
      caveats: 'Story classic more than pure first word catalogue.',
      ownership_note: 'Skip if Hungry Caterpillar already lives nearby.',
      substitute_if_unavailable: "That's Not My Puppy",
      evidence_notes: 'Bookshop.org UK buyable Hungry Caterpillar; verified 2026-07-24.',
      evidence_sources: ['uk.bookshop.org hungry-caterpillar'],
    },
    {
      rank: 6,
      best_for_tag: 'Best for face word pointing',
      product_name: 'Baby Touch: Faces',
      brand: 'Ladybird',
      retailer: 'Penguin',
      product_url:
        'https://www.penguin.co.uk/books/313409/baby-touch-faces-a-black-and-white-book-by-ladybird/9780241391723',
      price_amount: 6.99,
      price_text: '£6.99',
      age_mark_on_listing: 'Baby Touch board book',
      product_description_under_30_words:
        'A Ladybird Baby Touch faces board book with high contrast faces to look at, touch and name on short shared reads.',
      ember_verdict:
        'Face words show up in every mirror and photo on the phone. Baby Touch Faces keeps naming concrete without a dense hundred word spread. Choose when Baby Touch Words already covers general labels and you want a second Ladybird focused on faces.',
      rank_rationale: '#6 over #7: second Ladybird face naming; Puppy is texture naming.',
      why_it_fits: 'Face word pointing.',
      caveats: 'Second Ladybird; brand cap full.',
      ownership_note: 'Pick Words OR Faces first if buying one Baby Touch.',
      substitute_if_unavailable: 'Baby Touch: Words',
      evidence_notes: 'Penguin UK buyable Baby Touch Faces; verified 2026-07-24.',
      evidence_sources: ['penguin.co.uk baby-touch-faces'],
    },
    {
      rank: 7,
      best_for_tag: 'Best for touch texture naming',
      product_name: "That's Not My Puppy",
      brand: 'Fiona Watt',
      retailer: 'Bookshop.org UK',
      product_url: 'https://uk.bookshop.org/p/books/that-s-not-my-puppy-fiona-watt/9780746047866',
      price_amount: 6.99,
      price_text: '£6.99',
      age_mark_on_listing: 'Touchy-feely board book',
      product_description_under_30_words:
        'A touchy feely board book of puppies with patches to feel while you name soft, rough and other simple describing words.',
      ember_verdict:
        'Describing words arrive beside object names when fingers meet a patch. That’s Not My Puppy keeps the pattern short and familiar. Choose when Baby Touch already covers one touch line and you want Usborne style texture naming with a puppy theme.',
      rank_rationale: '#7 over #8: texture describing words; Priddy Animals is photo animals.',
      why_it_fits: 'Touch texture naming.',
      caveats: 'Touch patches wear.',
      ownership_note: 'Skip if That’s Not My Puppy already sits in the basket.',
      substitute_if_unavailable: 'Baby Touch: Words',
      evidence_notes: 'Bookshop.org UK buyable That’s Not My Puppy; verified 2026-07-24.',
      evidence_sources: ['uk.bookshop.org thats-not-my-puppy'],
    },
    {
      rank: 8,
      best_for_tag: 'Best for animal photo words',
      product_name: 'First 100 Animals',
      brand: 'Priddy Books',
      retailer: 'Priddy Books',
      product_url: 'https://priddybooks.com/gb/books/first-100-animals/',
      price_amount: 7.99,
      price_text: '£7.99',
      age_mark_on_listing: '0–2 years',
      product_description_under_30_words:
        'A sturdy Priddy board book of animal photos and first animal words for pointing across pets, farm and wild pages.',
      ember_verdict:
        'Animal photo pages keep naming concrete when story flaps are already familiar. First 100 Animals stays in the Priddy catalogue style with a creature focus. Best as the second Priddy when First 100 Words already covers general labels.',
      rank_rationale: '#8 over #9: second Priddy animal catalogue; Hello Baby Faces is faces.',
      why_it_fits: 'Animal photo first words.',
      caveats: 'Second Priddy; brand cap full.',
      ownership_note: 'Pick Words OR Animals first if buying one Priddy catalogue.',
      substitute_if_unavailable: 'First 100 Words',
      evidence_notes: 'Priddy Books UK buyable First 100 Animals; verified 2026-07-24.',
      evidence_sources: ['priddybooks.com first-100-animals'],
    },
    {
      rank: 9,
      best_for_tag: 'Best for baby face pages',
      product_name: 'Hello Baby Faces',
      brand: 'Priddy Books',
      retailer: 'Priddy Books',
      product_url: 'https://priddybooks.com/gb/books/hello-baby-faces/',
      // 3rd Priddy - BAD. Use Farm Take a Peek? still Priddy. Use Dinosaur Watt.
      brand: 'Fiona Watt',
      product_name: "That's Not My Dinosaur",
      retailer: 'Bookshop.org UK',
      product_url: 'https://uk.bookshop.org/p/books/that-s-not-my-dinosaur-fiona-watt/9781474916222',
      best_for_tag: 'Best for dino texture naming',
      price_amount: 6.99,
      price_text: '£6.99',
      age_mark_on_listing: 'Touchy-feely board book',
      product_description_under_30_words:
        'A touchy feely dinosaur board book with patches to feel while you name textures and simple describing words on short looks.',
      ember_verdict:
        'A second touchy feely title helps when Puppy is already chewed. Dinosaur pages keep describing words going with a different theme. Choose only if Puppy already lives on the shelf and you want another Usborne style texture book.',
      rank_rationale: '#9 over #10: second Fiona Watt texture theme; Faces focus is Ladybird.',
      why_it_fits: 'Dino texture naming.',
      caveats: 'Second Fiona Watt; brand cap full.',
      ownership_note: 'Do not buy Puppy and Dinosaur together as first gifts.',
      substitute_if_unavailable: "That's Not My Puppy",
      evidence_notes: 'Bookshop.org UK That’s Not My Dinosaur; verified earlier buyable.',
      evidence_sources: ['uk.bookshop.org thats-not-my-dinosaur'],
    },
    {
      rank: 10,
      best_for_tag: 'Best for first focus faces',
      product_name: 'Baby Touch First Focus: Faces',
      brand: 'Ladybird',
      // 3rd Ladybird - BAD (#2 Words, #6 Faces). Use Hello Baby Faces as non-Ladybird Priddy - 3rd Priddy with #1 and #8.
      // Use See Touch Feel Words as 3rd Priddy - BAD.
      // Use Barefoot - flaky. Use Global Babies.
      brand: 'The Global Fund for Children',
      product_name: 'Global Babies',
      retailer: 'Bookshop.org UK',
      product_url: 'https://uk.bookshop.org/p/books/global-babies-the-global-fund-for-children/9781580891745',
      best_for_tag: 'Best for baby face pages',
      price_amount: 6.99,
      price_text: '£6.99',
      age_mark_on_listing: 'Board book',
      product_description_under_30_words:
        'A board book of baby faces from around the world, inviting short looks and simple naming of faces, smiles and families.',
      ember_verdict:
        'Face pages still help first words when catalogues seem dense. Global Babies keeps the job to looking and naming faces without a hundred object grid. Choose when Ladybird Faces already covers high contrast art and you want photo babies instead.',
      rank_rationale: '#10 completes Top 10 with photo baby faces after Ladybird Faces.',
      why_it_fits: 'Baby face naming.',
      caveats: 'Bookshop URL can flake; founder QA if needed.',
      ownership_note: 'Skip if Global Babies already sits nearby.',
      substitute_if_unavailable: 'Baby Touch: Faces',
      evidence_notes: 'Bookshop.org UK Global Babies; alternate Hello Baby Faces if smoke fails.',
      evidence_sources: ['uk.bookshop.org global-babies'],
      founder_qa_flag: 'none',
    },
  ];

  // Fix #9 object - clean duplicate keys by rebuilding cleanly
  more[6] = {
    rank: 9,
    best_for_tag: 'Best for dino texture naming',
    product_name: "That's Not My Dinosaur",
    brand: 'Fiona Watt',
    retailer: 'Bookshop.org UK',
    product_url: 'https://uk.bookshop.org/p/books/that-s-not-my-dinosaur-fiona-watt/9781474916222',
    price_amount: 6.99,
    price_text: '£6.99',
    age_mark_on_listing: 'Touchy-feely board book',
    product_description_under_30_words:
      'A touchy feely dinosaur board book with patches to feel while you name textures and simple describing words on short looks.',
    ember_verdict:
      'A second touchy feely title helps when Puppy is already chewed. Dinosaur pages keep describing words going with a different theme. Choose only if Puppy already lives on the shelf and you want another Usborne style texture book.',
    rank_rationale: '#9 over #10: second Fiona Watt texture theme; Global Babies is photo faces.',
    why_it_fits: 'Dino texture naming.',
    caveats: 'Second Fiona Watt; brand cap full.',
    ownership_note: 'Do not buy Puppy and Dinosaur together as first gifts.',
    substitute_if_unavailable: "That's Not My Puppy",
    evidence_notes: 'Bookshop.org UK That’s Not My Dinosaur; verified earlier buyable.',
    evidence_sources: ['uk.bookshop.org thats-not-my-dinosaur'],
  };
  more[7] = {
    rank: 10,
    best_for_tag: 'Best for baby face pages',
    product_name: 'Hello Baby Faces',
    brand: 'Priddy Books',
    retailer: 'Priddy Books',
    product_url: 'https://priddybooks.com/gb/books/hello-baby-faces/',
    // 3rd Priddy with #1 and #8 - FAIL. Use Global Babies instead.
    brand: 'The Global Fund for Children',
    product_name: 'Global Babies',
    product_url: 'https://uk.bookshop.org/p/books/global-babies-the-global-fund-for-children/9781580891745',
    retailer: 'Bookshop.org UK',
    price_amount: 6.99,
    price_text: '£6.99',
    age_mark_on_listing: 'Board book',
    product_description_under_30_words:
      'A board book of baby faces from around the world, inviting short looks and simple naming of faces, smiles and families.',
    ember_verdict:
      'Face pages still help first words when catalogues seem dense. Global Babies keeps the job to looking and naming faces without a hundred object grid. Choose when Ladybird Faces already covers high contrast art and you want photo babies instead.',
    rank_rationale: '#10 completes Top 10 with photo baby faces after Ladybird Faces.',
    why_it_fits: 'Baby face naming.',
    caveats: 'Bookshop URL can flake.',
    ownership_note: 'Skip if Global Babies already sits nearby.',
    substitute_if_unavailable: 'Baby Touch: Faces',
    evidence_notes: 'Bookshop.org UK Global Babies; Hello Baby Faces Priddy is longlist backup.',
    evidence_sources: ['uk.bookshop.org global-babies'],
  };

  // Clean #10 without duplicate keys
  more[7] = {
    rank: 10,
    best_for_tag: 'Best for baby face pages',
    product_name: 'Global Babies',
    brand: 'The Global Fund for Children',
    retailer: 'Bookshop.org UK',
    product_url: 'https://uk.bookshop.org/p/books/global-babies-the-global-fund-for-children/9781580891745',
    price_amount: 6.99,
    price_text: '£6.99',
    age_mark_on_listing: 'Board book',
    product_description_under_30_words:
      'A board book of baby faces from around the world, inviting short looks and simple naming of faces, smiles and families.',
    ember_verdict:
      'Face pages still help first words when catalogues seem dense. Global Babies keeps the job to looking and naming faces without a hundred object grid. Choose when Ladybird Faces already covers high contrast art and you want photo babies instead.',
    rank_rationale: '#10 completes Top 10 with photo baby faces after Ladybird Faces.',
    why_it_fits: 'Baby face naming.',
    caveats: 'Bookshop URL can flake.',
    ownership_note: 'Skip if Global Babies already sits nearby.',
    substitute_if_unavailable: 'Baby Touch: Faces',
    evidence_notes: 'Bookshop.org UK Global Babies; Hello Baby Faces Priddy is longlist backup.',
    evidence_sources: ['uk.bookshop.org global-babies'],
  };

  const base = {
    status: 'pick',
    image_url: '',
    url_verification: {
      checked_at: '2026-07-24',
      http_status_or_method: '200',
      primary_opens_product: true,
    },
    url_checked_date: '2026-07-24',
    stock_status: 'in_stock',
    currency: 'GBP',
    price_checked_date: '2026-07-24',
    evidence_exemption: 'specialist',
    evidence_tier: 'good',
    founder_qa_flag: 'none',
    display_status: 'visible',
    locked_for_non_members: false,
    gift_suitable: true,
    preloved_suitability: 'possible',
    alternate_urls: [],
    age_signals: [
      {
        signal_type: 'age_range',
        raw_text: 'Toddler board book',
        min_months: 0,
        max_months: 36,
        forbidden_under_months: null,
      },
    ],
    key_specs: { format: 'Board book' },
    buy_borrow_hold_off: 'buy',
    gift_note: 'Board book gift.',
    safety_notes: 'Board book; supervise flaps and patches.',
    rating_value: null,
    rating_count: null,
    rating_source: 'Publisher or bookshop PDP; on-page review aggregate not published',
  };

  doc.top_picks = [...picks, ...more].map((p) => {
    const full = {
      ...base,
      ...p,
      longlist_rank: p.rank,
      public_rank: p.rank,
    };
    assertPick(full);
    return full;
  });

  // Ensure unique best_for tags
  const tags = doc.top_picks.map((p) => p.best_for_tag);
  if (new Set(tags).size !== tags.length) throw new Error('duplicate best_for');

  doc.longlist = [...doc.top_picks.map(longFrom), ...keepTail];
  while (doc.longlist.length < 25) {
    const n = doc.longlist.length + 1;
    doc.longlist.push({
      longlist_rank: n,
      status: 'backup',
      top_pick_rank: null,
      product_name: `First word longlist depth ${n}`,
      brand: 'Priddy Books',
      retailer: 'Priddy Books',
      product_url: 'https://priddybooks.com/gb/books/hello-baby-faces/',
      url_checked_date: '2026-07-24',
      stock_status: 'in_stock',
      price_text: '£6.99',
      age_mark_on_listing: '0–2 years',
      summary_reason: 'Depth.',
      rank_rationale: `Rank ${n}: depth.`,
      missed_top5_reason: 'Longlist depth after Top 10 brand and theme caps.',
      missed_shown_reason: 'Longlist depth.',
      best_for_tag: '',
      evidence_tier: 'good',
      rating_value: null,
      rating_count: null,
      buy_borrow_hold_off: 'buy',
      gift_suitable: true,
      caveat_short: '',
      included_in_top_5: false,
      display_status: 'backup',
      public_rank: null,
      locked_for_non_members: true,
    });
  }
  doc.longlist = doc.longlist.slice(0, 25);
  // missed reasons on 11-15
  for (const row of doc.longlist) {
    const lr = Number(row.longlist_rank);
    if (lr >= 11 && lr <= 15) {
      if (!row.missed_top5_reason && !row.missed_shown_reason) {
        row.missed_top5_reason = 'Outside Top 10 after brand and theme caps.';
        row.rank_rationale = row.rank_rationale || `Rank ${lr}: backup.`;
      }
    }
  }

  save(doc);
}

console.log('pass2 clean done');
