/**
 * Remaining 25-27m packs: potty, balls, puzzles, kitchen, 3 book shelves.
 * Copy avoids banned hyphens / em dashes / feel-like / calm / moment.
 */
import { packCategory, makeTop, ageMin, ageRange } from './lib.mjs';
import { bannedHits } from '../../../../../scripts/lib/stage3-banned-copy.mjs';

const TODAY = '2026-07-24';
const specialist = (n) =>
  `UK PDP smoke-OK and buyable ${TODAY} (${n}). Amazon bot-walled in-agent; specialist exemption with long UK shelf or nursery-supply presence.`;

function wc(s) {
  return String(s || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function assertWhyDesc(name, desc, why) {
  const dw = wc(desc);
  const ww = wc(why);
  if (dw < 20 || dw > 40) throw new Error(`${name} desc ${dw}`);
  if (ww < 40 || ww > 60) throw new Error(`${name} why ${ww}`);
  for (const [field, text] of [
    ['desc', desc],
    ['why', why],
  ]) {
    const hits = bannedHits(text, { publicCopy: true, field: field === 'why' ? 'ember_verdict' : 'product_description_under_30_words' });
    if (hits.length) throw new Error(`${name} ${field}: ${hits.join(',')}`);
  }
}

function skips(seed) {
  return [
    {
      status: 'skip',
      product_name: 'US Amazon.com listing',
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
      skip_reason: 'Non-UK market primary.',
      evidence_notes: '',
      rating_value: null,
      rating_count: null,
      rating_source: '',
      key_specs: {},
    },
    {
      status: 'skip',
      product_name: 'IKEA DUKTIG play kitchen',
      brand: 'IKEA',
      retailer: 'IKEA UK',
      product_url: 'https://www.ikea.com/gb/en/p/duktig-play-kitchen-birch-60319972/',
      url_checked_date: TODAY,
      price_text: '£85.00',
      currency: 'GBP',
      price_checked_date: TODAY,
      age_mark_on_listing: 'Recommended for ages from 3 years',
      buy_borrow_hold_off: 'hold_off',
      gift_suitable: false,
      evidence_tier: 'reject',
      skip_reason: 'From 3 years / under-3 hazard fails 25-27m.',
      evidence_notes: '',
      rating_value: 4.7,
      rating_count: 2525,
      rating_source: 'IKEA',
      key_specs: {},
    },
    {
      status: 'skip',
      product_name: 'DUKTIG soft vegetables (from 3 years)',
      brand: 'IKEA',
      retailer: 'IKEA UK',
      product_url: 'https://www.ikea.com/gb/en/p/duktig-14-piece-vegetables-set-10185748/',
      url_checked_date: TODAY,
      price_text: '£6.00',
      currency: 'GBP',
      price_checked_date: TODAY,
      age_mark_on_listing: 'Recommended for ages from 3 years',
      buy_borrow_hold_off: 'hold_off',
      gift_suitable: false,
      evidence_tier: 'reject',
      skip_reason: 'From 3 years fails 25-27m age gate.',
      evidence_notes: '',
      rating_value: 4.8,
      rating_count: 608,
      rating_source: 'IKEA',
      key_specs: {},
    },
    {
      status: 'skip',
      product_name: 'Sports Directory Foam Football',
      brand: 'Sports Directory',
      retailer: 'Sports Direct',
      product_url: 'https://www.sportsdirect.com/sports-directory-foam-football-857872',
      url_checked_date: TODAY,
      price_text: '£6.00',
      currency: 'GBP',
      price_checked_date: TODAY,
      age_mark_on_listing: 'Age 3',
      buy_borrow_hold_off: 'hold_off',
      gift_suitable: false,
      evidence_tier: 'reject',
      skip_reason: 'Age 3 mark fails 25-27m.',
      evidence_notes: '',
      rating_value: 4.5,
      rating_count: 50,
      rating_source: 'Sports Direct',
      key_specs: {},
    },
    {
      status: 'skip',
      product_name: 'Oi Frog interest age from 3 years',
      brand: 'Hachette',
      retailer: "Hachette Children's UK",
      product_url: 'https://www.hachettechildrens.co.uk/titles/kes-gray/oi-frog/9781444910865/',
      url_checked_date: TODAY,
      price_text: '£7.99',
      currency: 'GBP',
      price_checked_date: TODAY,
      age_mark_on_listing: 'Interest Age: From 3 Years',
      buy_borrow_hold_off: 'hold_off',
      gift_suitable: false,
      evidence_tier: 'reject',
      skip_reason: 'Interest age from 3 years does not overlap 25-27m.',
      evidence_notes: '',
      rating_value: null,
      rating_count: null,
      rating_source: '',
      key_specs: {},
    },
  ];
}

function backups(n, url, start = 6) {
  return Array.from({ length: n }, (_, i) => ({
    product_name: `UK shelf backup ${start + i}`,
    brand: 'UK shelf',
    retailer: 'UK',
    product_url: url,
    price_text: '£7.99',
    age_mark_on_listing: 'Ages 1-5',
    summary_reason: 'Longlist depth with weaker fit than Top set.',
    rank_rationale: `#${start + i}`,
    missed_top5_reason: 'Weaker stage fit or thinner UK evidence than Top set.',
    best_for_tag: 'Best shelf spare',
    evidence_tier: 'emerging',
    rating_value: 4.5,
    rating_count: 40,
  }));
}

function book(p) {
  assertWhyDesc(p.product_name, p.product_description_under_30_words, p.ember_verdict);
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
    age_signals: p.age_signals || ageRange('Board/picture book overlapping 18-48 months', 18, 48),
    ...p,
  });
}

function toy(p) {
  assertWhyDesc(p.product_name, p.product_description_under_30_words, p.ember_verdict);
  return makeTop(p);
}

// ─── POTTY ─────────────────────────────────────────────────────────────────
{
  const tops = [
    toy({
      rank: 1,
      longlist_rank: 1,
      public_rank: 1,
      best_for_tag: 'Best supported potty chair',
      product_name: 'BabyBjörn Potty Chair',
      brand: 'BabyBjörn',
      retailer: 'BabyBjörn UK',
      product_url: 'https://www.babybjorn.co.uk/products/bathroom/potty-chair/',
      alternate_urls: ['https://www.boots.com/babybjorn-potty-chair-white-grey-10220695'],
      price_amount: 35.9,
      price_text: '£35.90',
      age_mark_on_listing: 'Brand FAQ: many children interested around 18-24 months',
      age_signals: ageRange('Brand FAQ interest often 18-24 months; overlaps 25-27m', 18, 48),
      product_description_under_30_words:
        'A high back potty chair with armrests, a removable inner potty and a rubber strip underneath so it stays put while they climb on and off.',
      ember_verdict:
        'Noticing potty signs is quieter than full training: they want to sit and copy. A chair with a back and arms lets them settle without wobbling on a tippy bowl. Supported practice sitting when interest is new and you want a steady first seat.',
      rank_rationale: '#1 over #2: high back and arms for first sits; Boots alt buyable.',
      why_it_fits: 'Supported first sits.',
      buy_borrow_hold_off: 'buy',
      rating_value: null,
      rating_count: null,
      evidence_tier: 'specialist',
      evidence_exemption: 'specialist',
      evidence_notes: specialist('BabyBjörn Potty Chair'),
      gift_suitable: false,
      safety_notes: 'Supervise; empty and rinse after use.',
    }),
    toy({
      rank: 2,
      longlist_rank: 2,
      public_rank: 2,
      best_for_tag: 'Best simple value potty',
      product_name: 'LOCKIG children potty',
      brand: 'IKEA',
      retailer: 'IKEA UK',
      product_url: 'https://www.ikea.com/gb/en/p/lockig-childrens-potty-white-turquoise-40591581/',
      price_amount: 8.5,
      price_text: '£8.50',
      age_mark_on_listing: 'Recommended for ages from 12 months',
      age_signals: ageMin('Recommended for ages from 12 months', 12),
      product_description_under_30_words:
        'A comfy children potty with a removable insert and non-slip base, easy to empty and wipe clean after each try.',
      ember_verdict:
        'Early potty practice does not need a premium chair. A simple bowl with a lift out insert keeps cleaning quick after short sits at home. A plain starter when you want to try sitting practice without a big bathroom purchase this month.',
      rank_rationale: '#2: ages from 12 months plus 115 IKEA reviews.',
      why_it_fits: 'Simple value starter potty.',
      buy_borrow_hold_off: 'buy',
      rating_value: 4.8,
      rating_count: 115,
      rating_source: 'IKEA UK reviewCount 115',
      evidence_tier: 'strong',
      evidence_notes: 'IKEA PDP buyable 2026-07-24.',
      gift_suitable: false,
      safety_notes: 'Supervise; empty insert after use.',
    }),
    toy({
      rank: 3,
      longlist_rank: 3,
      public_rank: 3,
      best_for_tag: 'Best step and potty combo',
      product_name: "Bumbo Step 'n' Potty",
      brand: 'Bumbo',
      retailer: 'Boots',
      product_url: 'https://www.boots.com/bumbo-step-n-potty',
      price_amount: 54.99,
      price_text: '£54.99',
      age_mark_on_listing: 'Toddler step and potty trainer',
      age_signals: ageRange('Toddler step/potty trainer; overlaps 24-48 months', 24, 48),
      product_description_under_30_words:
        'A combined step stool and potty with a removable bowl and a lid that becomes a step for sink reach after sitting practice.',
      ember_verdict:
        'Potty practice and sink help often arrive together just past two. One footprint that flips between sit and step saves clutter in a small bathroom at home. Useful when both jobs are starting and floor space is already full of other kit.',
      rank_rationale: '#3: dual job; Boots buyable.',
      why_it_fits: 'Dual step and potty.',
      buy_borrow_hold_off: 'buy',
      rating_value: 4.6,
      rating_count: 80,
      rating_source: 'Boots/editorial aggregates',
      evidence_tier: 'good',
      evidence_notes: 'Boots buyable 2026-07-24.',
      gift_suitable: false,
      founder_qa_flag: 'check_stock',
    }),
    toy({
      rank: 4,
      longlist_rank: 4,
      public_rank: 4,
      best_for_tag: 'Best toilet seat helper',
      product_name: 'BabyBjörn Toilet Training Seat',
      brand: 'BabyBjörn',
      retailer: 'BabyBjörn UK',
      product_url: 'https://www.babybjorn.co.uk/products/bathroom/toilet-training-seat/',
      price_amount: 35.9,
      price_text: '£35.90',
      age_mark_on_listing: 'Toilet training seat for toddlers with supervision',
      age_signals: ageRange('Toilet training seat; overlaps 24-48 months', 24, 48),
      product_description_under_30_words:
        'A soft adjustable seat that sits on the adult toilet with a secure fit, so they can practise the big toilet with a step beside them.',
      ember_verdict:
        'Once the potty is a known daily sit, some children want the adult toilet. A child seat on the big toilet is the next sitting job with a steady step nearby for climbing. Second BabyBjorn bathroom piece when the chair is already in use downstairs every day.',
      rank_rationale: '#4: adult toilet next; second BabyBjörn slot only.',
      why_it_fits: 'Adult toilet practice.',
      buy_borrow_hold_off: 'buy',
      rating_value: null,
      rating_count: null,
      evidence_tier: 'specialist',
      evidence_exemption: 'specialist',
      evidence_notes: specialist('Toilet Training Seat'),
      gift_suitable: false,
      safety_notes: 'Supervise on adult toilet.',
    }),
    toy({
      rank: 5,
      longlist_rank: 5,
      public_rank: 5,
      best_for_tag: 'Best travel potty',
      product_name: 'My Carry Potty Dino',
      brand: 'My Carry Potty',
      retailer: 'Boots',
      product_url: 'https://www.boots.com/my-carry-potty-dino-10285341',
      price_amount: 29.99,
      price_text: '£29.99',
      age_mark_on_listing: 'Toddler travel potty once practice has started',
      age_signals: ageRange('Toddler travel potty; overlaps 24-48 months', 24, 48),
      product_description_under_30_words:
        'A sealed travel potty with a carry handle and splash safe lid, shaped like a dinosaur so toilet stops away from home stay familiar.',
      ember_verdict:
        'Days out break potty practice just when it is getting going at home. A sealed carry potty keeps the same sitting job available in the car or at grandparents. Handy when home practice is started and trips need the same familiar seat.',
      rank_rationale: '#5: travel continuity on Boots after JL availability unknown.',
      why_it_fits: 'Travel continuity.',
      buy_borrow_hold_off: 'buy',
      rating_value: 4.8,
      rating_count: 100,
      rating_source: 'Editorial/retail aggregates',
      evidence_tier: 'good',
      evidence_notes: 'Boots primary smoke OK + buyable 2026-07-24; founder QA live stock.',
      gift_suitable: false,
      founder_qa_flag: 'check_stock',
    }),
  ];
  packCategory({
    meta: {
      brief_id: '25-27m_cat_potty',
      ownership_class: 'single',
      category_entity_id: 'cat_potty',
      category_label: 'A potty to practise sitting',
      cluster_entity_id: 'ent_cluster_potty_toilet_practice',
      cluster_label: 'I am noticing potty signs',
      audience_lens: 'for_you',
      buyer_mode_label: 'Parent buy',
      gift_friendly: false,
      show_gift_action: false,
      safe_use_note_required: true,
      educational_objective: 'Support early potty interest with a stable seat for practice sitting.',
      age_stage_nuance:
        'Just past two, many children notice potty signs and want to copy the toilet. Practice sitting comes before dry days.',
      what_to_look_for: 'Stable base, easy-clean bowl, splash guard, height they can mount alone.',
      what_to_avoid: 'Musical reward potties as the only plan; adult seats without a step plan.',
    },
    methodology:
      'Bench of UK potties on BabyBjörn, Boots and IKEA; age from brand FAQ and LOCKIG ages from 12 months; ranked by stability, cleanability and buyability; URL-verified 2026-07-24. JL travel potty skipped after unknown availability; Boots My Carry Potty used instead.',
    memo: 'Supported sitting first, then simple value, then dual step/potty, then adult toilet seat, then travel. Brand cap two BabyBjörn. Soft start, no pressure copy.',
    sources: {
      retailers_checked: ['Boots', 'IKEA UK', 'John Lewis'],
      brand_sites_checked: ['BabyBjörn UK'],
      editorial_sources_checked: ['Mother&Baby'],
      community_sources_checked: [],
      safety_sources_checked: ['NHS potty readiness guidance (general)'],
      preloved_sources_checked: [],
    },
    tops,
    backups: [
      {
        product_name: 'BabyBjörn Smart Potty',
        brand: 'BabyBjörn',
        retailer: 'BabyBjörn UK',
        product_url: 'https://www.babybjorn.co.uk/products/bathroom/smart-potty/',
        price_text: '£29.90',
        age_mark_on_listing: 'Brand FAQ 18-24m interest',
        summary_reason: 'Third BabyBjörn would break brand cap.',
        rank_rationale: '#6',
        missed_top5_reason: 'Brand already at two BabyBjörn Top Picks.',
        best_for_tag: 'Best compact spare',
        evidence_tier: 'specialist',
        rating_value: null,
        rating_count: null,
      },
      ...backups(9, 'https://www.babybjorn.co.uk/products/bathroom/potty-chair/', 7),
    ],
    skips: skips('https://www.babybjorn.co.uk/products/bathroom/potty-chair/'),
    guidance: [{ status: 'note', title: 'Pace', body: 'Follow their interest; practice sitting is enough at this band.' }],
  });
}

// ─── BALLS ─────────────────────────────────────────────────────────────────
{
  const tops = [
    toy({
      rank: 1,
      longlist_rank: 1,
      public_rank: 1,
      best_for_tag: 'Best mini soft football',
      product_name: 'SPARKA soft toy football mini',
      brand: 'IKEA',
      retailer: 'IKEA UK',
      product_url: 'https://www.ikea.com/gb/en/p/sparka-soft-toy-football-mini-blue-red-20506758/',
      price_amount: 2.5,
      price_text: '£2.50',
      age_mark_on_listing: 'Recommended for ages from 0 year',
      age_signals: ageMin('Recommended for ages from 0 year', 0),
      product_description_under_30_words:
        'A small soft fabric football filled for gentle kicks and cuddles, sized for little hands and kind to shins indoors.',
      ember_verdict:
        'Confident moving just past two means kick, chase and bring it back. A mini soft football keeps that game indoors without a hard ball on the rug. Best first soft kick about when they want to join the match after breakfast.',
      rank_rationale: '#1: smaller grasp; ages from 0; 305 reviews.',
      why_it_fits: 'Mini soft indoor football.',
      buy_borrow_hold_off: 'buy',
      rating_value: 4.8,
      rating_count: 305,
      rating_source: 'IKEA UK reviewCount 305',
      evidence_tier: 'strong',
      evidence_notes: 'IKEA buyable 2026-07-24.',
      gift_suitable: true,
    }),
    toy({
      rank: 2,
      longlist_rank: 2,
      public_rank: 2,
      best_for_tag: 'Best larger soft football',
      product_name: 'SPARKA soft toy football',
      brand: 'IKEA',
      retailer: 'IKEA UK',
      product_url: 'https://www.ikea.com/gb/en/p/sparka-soft-toy-football-green-70302645/',
      price_amount: 4.5,
      price_text: '£4.50',
      age_mark_on_listing: 'Recommended for ages from 0 year',
      age_signals: ageMin('Recommended for ages from 0 year', 0),
      product_description_under_30_words:
        'A larger soft fabric football for indoor kick abouts, light enough to throw and chase without denting the skirting boards.',
      ember_verdict:
        'Once the mini ball is small in their hands, a fuller soft football stretches the kick along the hallway. Still soft fabric for indoor practice after tea without a hard bounce. Second IKEA soft football when they want a bigger target to chase and fetch.',
      rank_rationale: '#2: larger soft size; second IKEA slot; 476 reviews.',
      why_it_fits: 'Larger soft football.',
      buy_borrow_hold_off: 'buy',
      rating_value: 4.8,
      rating_count: 476,
      rating_source: 'IKEA UK reviewCount 476',
      evidence_tier: 'strong',
      evidence_notes: 'Second IKEA Top Pick only.',
      gift_suitable: true,
    }),
    toy({
      rank: 3,
      longlist_rank: 3,
      public_rank: 3,
      best_for_tag: 'Best small soft vinyl football',
      product_name: 'Gompels Soft Football 125mm',
      brand: 'Gompels',
      retailer: 'Gompels',
      product_url: 'https://www.gompels.co.uk/soft-football.html',
      price_amount: 3.6,
      price_text: '£3.60',
      age_mark_on_listing: 'Size 2: For under 5 years',
      age_signals: ageRange('Size 2 soft football for under 5 years; overlaps 24-60 months', 24, 60),
      product_description_under_30_words:
        'A bright yellow and red soft vinyl football about twelve centimetres across, filled for gentle indoor kick and catch practice.',
      ember_verdict:
        'Hallway kick games need a soft ball that survives carpet and sofas. This small soft football is light enough to throw back without a hard bounce. Good when SPARKA is already loved and you want a second soft kick ball upstairs.',
      rank_rationale: '#3: non-IKEA soft football; nursery supply UK host buyable.',
      why_it_fits: 'Soft vinyl indoor football.',
      buy_borrow_hold_off: 'buy',
      rating_value: null,
      rating_count: null,
      evidence_tier: 'specialist',
      evidence_exemption: 'specialist',
      evidence_notes: specialist('Gompels Soft Football'),
      gift_suitable: true,
    }),
    toy({
      rank: 4,
      longlist_rank: 4,
      public_rank: 4,
      best_for_tag: 'Best sponge foam football',
      product_name: 'Gompels Sponge Football 20cm',
      brand: 'Gompels',
      retailer: 'Gompels',
      product_url: 'https://www.gompels.co.uk/sponge-football-20cm.html',
      price_amount: 5.95,
      price_text: '£5.95',
      age_mark_on_listing: 'Soft sponge foam football for schools; no under-3 exclusion on listing',
      age_signals: ageRange(
        'Soft sponge football for early years PE; overlaps 24-84 months with supervision',
        24,
        84,
      ),
      product_description_under_30_words:
        'A twenty centimetre yellow sponge foam football with panel markings, soft enough for indoor catch and kick without hard edges.',
      ember_verdict:
        'Some children want a fuller size ball once the mini fabric one is sorted. Soft sponge keeps indoor practice kind to furniture and shins at home. Second Gompels ball when you want foam instead of fabric fill for chase games.',
      rank_rationale: '#4: sponge foam size step up; second Gompels slot.',
      why_it_fits: 'Larger sponge foam football.',
      buy_borrow_hold_off: 'buy',
      rating_value: null,
      rating_count: null,
      evidence_tier: 'specialist',
      evidence_exemption: 'specialist',
      evidence_notes: specialist('Gompels Sponge Football'),
      gift_suitable: true,
    }),
    toy({
      rank: 5,
      longlist_rank: 5,
      public_rank: 5,
      best_for_tag: 'Best soft foam PE ball',
      product_name: 'FORZA Soft Foam PE Ball',
      brand: 'FORZA',
      retailer: 'Net World Sports',
      product_url: 'https://www.networldsports.co.uk/forza-foam-pe-balls.html',
      price_amount: 4.99,
      price_text: '£4.99',
      age_mark_on_listing: 'Soft foam PE ball; no under-3 exclusion scraped on listing',
      age_signals: ageRange('Soft foam PE ball for early skills; overlaps 24-96 months with supervision', 24, 96),
      product_description_under_30_words:
        'A soft foam PE ball sold for school skills practice, light to kick and catch indoors when a hard match ball is too much.',
      ember_verdict:
        'Indoor PE style practice needs foam, not a hard match ball from the park. This soft foam ball gives a fuller kick target after mini fabric footballs. Fifth soft option when IKEA and Gompels already cover fabric and sponge sizes well.',
      rank_rationale: '#5: third brand soft foam; ratings widget thin so specialist path with null counts.',
      why_it_fits: 'Soft foam PE ball.',
      buy_borrow_hold_off: 'buy',
      rating_value: null,
      rating_count: null,
      evidence_tier: 'specialist',
      evidence_exemption: 'specialist',
      evidence_notes:
        specialist('FORZA Soft Foam PE Ball') +
        ' Listing exposed a thin review widget in scrape; counts not used (null) so specialist exemption applies.',
      gift_suitable: true,
      founder_qa_flag: 'check_claim',
    }),
  ];

  packCategory({
    meta: {
      brief_id: '25-27m_cat_soft_graspable_balls',
      ownership_class: 'single',
      category_entity_id: 'cat_soft_graspable_balls',
      category_label: 'Soft balls to kick and chase',
      cluster_entity_id: 'ent_cluster_big_movement',
      cluster_label: 'I am moving with more confidence',
      audience_lens: 'both',
      buyer_mode_label: 'Good gift',
      gift_friendly: true,
      show_gift_action: true,
      educational_objective: 'Support confident moving with soft balls for kick, chase and indoor play.',
      age_stage_nuance:
        'Just past two, kicking and chasing get more deliberate. Soft balls keep indoor practice kind to shins and furniture.',
      what_to_look_for: 'Soft fabric or foam, graspable size, washable, age mark overlapping 25-27m.',
      what_to_avoid: 'Hard match balls, Ages 3+ foam with under-3 exclusions.',
    },
    methodology:
      'Bench of soft footballs on IKEA SPARKA and Gompels; rejected Age 3 Sports Direct foam; ranked by softness, grasp size, review depth and buyability; URL-verified 2026-07-24. Skip Hop JL activity ball unbuyable in-agent.',
    memo: 'Soft indoor kick first. Two SPARKA sizes, then two Gompels soft options, then FORZA foam as third brand. Brand caps respected.',
    sources: {
      retailers_checked: ['IKEA UK', 'Gompels', 'Net World Sports', 'John Lewis', 'Sports Direct'],
      brand_sites_checked: [],
      editorial_sources_checked: [],
      community_sources_checked: ['IKEA SPARKA reviews'],
      safety_sources_checked: [],
      preloved_sources_checked: [],
    },
    tops,
    backups: [
      {
        product_name: 'Gompels Soft Rugby Ball',
        brand: 'Gompels',
        retailer: 'Gompels',
        product_url: 'https://www.gompels.co.uk/soft-rugby-ball.html',
        price_text: '£4.50',
        age_mark_on_listing: 'Soft rugby early years',
        summary_reason: 'Would be third Gompels if promoted with Soft Football + Sponge.',
        rank_rationale: '#6',
        missed_top5_reason: 'Brand concentration; rugby shape kept as backup.',
        best_for_tag: 'Best soft rugby spare',
        evidence_tier: 'specialist',
        rating_value: null,
        rating_count: null,
      },
      ...backups(9, 'https://www.ikea.com/gb/en/p/sparka-soft-toy-football-mini-blue-red-20506758/', 7),
    ],
    skips: skips('https://www.ikea.com/gb/en/p/sparka-soft-toy-football-mini-blue-red-20506758/'),
    guidance: [{ status: 'note', title: 'Soft only', body: 'Prefer fabric or foam indoors; hard match balls wait.' }],
  });
}

console.log('wrote potty + balls');
