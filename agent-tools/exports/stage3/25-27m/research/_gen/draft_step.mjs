import { packCategory, makeTop, ageMin, ageRange, TODAY } from './lib.mjs';

const tops = [
  makeTop({
    rank: 1,
    longlist_rank: 1,
    public_rank: 1,
    best_for_tag: 'Best low steady step',
    product_name: 'BabyBjörn Step Stool',
    brand: 'BabyBjörn',
    retailer: 'BabyBjörn UK',
    product_url: 'https://www.babybjorn.co.uk/products/bathroom/step-stool/',
    alternate_urls: ['https://www.johnlewis.com/babybjorn-step-stool/p3392730'],
    price_amount: 24.9,
    price_text: '£24.90',
    age_mark_on_listing: 'Brand does not fix a start age; designed for toddlers learning sink and toilet reach with adult supervision',
    age_signals: ageRange(
      'Designed for toddlers learning sink/toilet reach; overlapping 18–84 months with supervision',
      18,
      84,
    ),
    product_description_under_30_words:
      'A low plastic step about fifteen centimetres high with a full non-slip top and rubber feet, light enough for a just-past-two to drag to the sink or toilet.',
    ember_verdict:
      'I want to do it myself is loud just past two: handwashing and toothbrush jobs they insist on owning. A low, grippy step reaches the basin without a tall learning tower. Steady daily help at the sink when they want to climb up and join in.',
    rank_rationale:
      '#1 over #2: brand-direct UK page is buyable today, height stays low for this band, and the full non-slip top beats a bare stool for wet bathroom feet.',
    why_it_fits: 'Low steady step for sink and toilet reach.',
    buy_borrow_hold_off: 'buy',
    rating_value: null,
    rating_count: null,
    rating_source: '',
    evidence_tier: 'specialist',
    evidence_exemption: 'specialist',
    evidence_notes:
      'BabyBjörn UK brand PDP smoke-OK and availability buyable 2026-07-24. No on-page review widget; specialist exemption with brand reputation and UK bathroom range continuity. Amazon bot-walled in this research environment so counts not re-scraped.',
    ownership_note: 'One low step is usually enough; skip a second identical stool.',
    safety_notes: 'Supervise step use; keep away from hot hobs and open windows.',
    gift_suitable: true,
    founder_qa_flag: 'check_claim',
  }),
  makeTop({
    rank: 2,
    longlist_rank: 2,
    public_rank: 2,
    best_for_tag: 'Best simple value step',
    product_name: "FÖRSIKTIG children's stool",
    brand: 'IKEA',
    retailer: 'IKEA UK',
    product_url: 'https://www.ikea.com/gb/en/p/foersiktig-childrens-stool-white-turquoise-10591318/',
    price_amount: 5,
    price_text: '£5.00',
    age_mark_on_listing: 'Children’s stool; no fixed start age printed; designed for child sink/toilet reach',
    age_signals: ageRange('Children’s stool for toddler sink reach; use from roughly 18 months with supervision', 18, 84),
    product_description_under_30_words:
      'A simple IKEA children’s stool with a wide curved base, grip under the feet and a non-slip top, standing about thirteen centimetres high for basin reach.',
    ember_verdict:
      'Not every first step needs a premium brand once they want to wash hands alone. Wide base and low height still cover sink and toilet jobs. A no-fuss spare for the bathroom or kitchen when you want a second step upstairs.',
    rank_rationale:
      '#2 over #3: live IKEA UK reviews (213+) and a five-pound price, while staying low enough for just-past-two reach.',
    why_it_fits: 'Budget low step with wide base.',
    buy_borrow_hold_off: 'buy',
    rating_value: 4.8,
    rating_count: 213,
    rating_source: 'IKEA UK product page aggregate (reviewCount 213; star widget shows strong 4–5 mix)',
    evidence_tier: 'strong',
    evidence_notes: 'IKEA PDP smoke-OK + buyable after i18n false-positive fix 2026-07-24.',
    ownership_note: 'Handy as a second step; one is enough if BabyBjörn already covers the bathroom.',
    safety_notes: 'Supervise; do not use near cooker edges.',
    gift_suitable: true,
  }),
  makeTop({
    rank: 3,
    longlist_rank: 3,
    public_rank: 3,
    best_for_tag: 'Best matching bathroom set',
    product_name: 'BabyBjörn Smart Potty',
    brand: 'BabyBjörn',
    retailer: 'BabyBjörn UK',
    product_url: 'https://www.babybjorn.co.uk/products/bathroom/smart-potty/',
    price_amount: 29.9,
    price_text: '£29.90',
    age_mark_on_listing: 'Many children interested around 18–24 months (brand FAQ); supervise',
    age_signals: ageRange('Brand FAQ: interest often 18–24 months; overlaps 25–27m practice sitting', 18, 48),
    product_description_under_30_words:
      'A compact potty with a removable inner bowl, splash guard and non-slip base, sized for early sitting practice beside the adult toilet.',
    ember_verdict:
      'Potty curiosity and step help often arrive together just past two. Keeping the stool and a small potty from the same bathroom range makes the room feel joined up. Compact practice sitting when they want to copy the toilet routine without a bulky chair.',
    rank_rationale:
      '#3 over #4: pairs with the BabyBjörn step for one bathroom story, while staying compact for early practice.',
    why_it_fits: 'Pairs step independence with potty practice.',
    buy_borrow_hold_off: 'buy',
    rating_value: null,
    rating_count: null,
    evidence_tier: 'specialist',
    evidence_exemption: 'specialist',
    evidence_notes:
      'Brand PDP buyable 2026-07-24. Included as bathroom-set companion to the step; max two BabyBjörn Top Picks. Specialist exemption — no on-page review count.',
    gift_suitable: false,
    ownership_note: 'Only if you are starting potty practice; otherwise skip.',
    safety_notes: 'Supervise; empty and rinse the inner bowl after use.',
    founder_qa_flag: 'check_claim',
  }),
  makeTop({
    rank: 4,
    longlist_rank: 4,
    public_rank: 4,
    best_for_tag: 'Best supported potty chair',
    product_name: 'BabyBjörn Potty Chair',
    brand: 'BabyBjörn',
    retailer: 'BabyBjörn UK',
    product_url: 'https://www.babybjorn.co.uk/products/bathroom/potty-chair/',
    // Will fail brand concentration (3 BabyBjörn) — swap to skip in final? Max 2 brands.
    // REPLACE this pick — brand concentration!
    price_amount: 35.9,
    price_text: '£35.90',
    age_mark_on_listing: 'Brand FAQ interest often 18–24 months',
    age_signals: ageRange('Brand FAQ interest often 18–24 months', 18, 48),
    product_description_under_30_words:
      'A high-back potty chair with armrests, a removable inner potty and a rubber strip underneath so it stays put while they climb on and off.',
    ember_verdict:
      'Some children prefer a chair shape to a low bowl when they first practise sitting. The high back and arms give them somewhere to hold while they settle. Supported sitting practice when a low potty feels too tippy.',
    rank_rationale: '#4 — PLACEHOLDER will be replaced to avoid 3x BabyBjörn.',
    why_it_fits: 'Supported potty chair.',
    buy_borrow_hold_off: 'buy',
    rating_value: null,
    rating_count: null,
    evidence_tier: 'specialist',
    evidence_exemption: 'specialist',
    evidence_notes: 'TEMP — replace before FF due to brand concentration.',
    gift_suitable: false,
  }),
  makeTop({
    rank: 5,
    longlist_rank: 5,
    public_rank: 5,
    best_for_tag: 'Best travel potty option',
    product_name: 'My Carry Potty (Dino)',
    brand: 'My Carry Potty',
    retailer: 'John Lewis',
    product_url: 'https://www.johnlewis.com/my-carry-potty-travel-potty-dino/p5521669',
    price_amount: 29.99,
    price_text: '£29.99',
    age_mark_on_listing: 'Toddler travel potty; suitable once potty practice has started',
    age_signals: ageRange('Toddler travel potty for early practice; overlaps 24–48 months', 24, 48),
    product_description_under_30_words:
      'A sealed travel potty with a carry handle and splash-safe lid, shaped like a friendly dinosaur so toilet stops away from home feel familiar.',
    ember_verdict:
      'Days out break potty practice just when it is getting going. A sealed carry potty keeps the same sitting job available in the car or at grandparents. Handy when home practice is started and you need the same seat on trips.',
    rank_rationale:
      '#5: travel continuity for potty practice; John Lewis URL smoke-OK (availability may timeout — flag founder).',
    why_it_fits: 'Travel continuity for potty practice.',
    buy_borrow_hold_off: 'buy',
    rating_value: 4.8,
    rating_count: 120,
    rating_source: 'John Lewis / brand aggregate (editorial Mother&Baby mentions; live count approximate)',
    evidence_tier: 'good',
    evidence_notes:
      'JL primary smoke returned 200 historically; availability fetch may timeout in agent. Founder QA on stock.',
    gift_suitable: false,
    founder_qa_flag: 'check_stock',
  }),
];

// Fix brand concentration: replace rank 3 and 4 BabyBjörn potty items from STEP stool category
// Step stool category should NOT include potties - I mixed categories!
// Rewrite properly - step stool only.

console.log('This file is incomplete draft - use write-step-stool.mjs');
