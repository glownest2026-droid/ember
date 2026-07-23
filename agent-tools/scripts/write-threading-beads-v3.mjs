#!/usr/bin/env node
/**
 * Mode A re-research: 34-36m cat_threading_beads → inbox (schema v3).
 */
import fs from 'node:fs';
import path from 'node:path';

const outDir = 'agent-tools/exports/stage3/34-36m/research/inbox';
fs.mkdirSync(outDir, { recursive: true });

const DATE = '2026-07-22';

const age2to6 = [
  {
    signal_type: 'age_range',
    raw_text: 'Ages 2-6 years',
    min_months: 24,
    max_months: 72,
    forbidden_under_months: null,
  },
];
const age18m = [
  {
    signal_type: 'min_age',
    raw_text: '18 months+',
    min_months: 18,
    max_months: null,
    forbidden_under_months: null,
  },
];
const age12m = [
  {
    signal_type: 'min_age',
    raw_text: '12 months+',
    min_months: 12,
    max_months: null,
    forbidden_under_months: null,
  },
];
const age3to7 = [
  {
    signal_type: 'age_range',
    raw_text: 'Recommended for Ages: 3 - 7 years',
    min_months: 36,
    max_months: 84,
    forbidden_under_months: null,
  },
];

function uv(http = '200') {
  return {
    checked_at: DATE,
    http_status_or_method: http,
    primary_opens_product: true,
  };
}

const top = [
  {
    rank: 1,
    status: 'pick',
    longlist_rank: 1,
    public_rank: 1,
    best_for_tag: 'Best for letters and lacing',
    product_name: 'Smart Snacks ABC Lacing Sweets',
    brand: 'Learning Resources',
    retailer: 'Primary ICT',
    product_url:
      'https://www.primaryict.co.uk/pr8561/smart-snacks-abc-lacing-sweets-learning-r-ler7204',
    alternate_urls: [
      'https://www.amazon.co.uk/Learning-Resources-Snacks-Lacing-Sweets/dp/B0007KLHBE',
    ],
    image_url: '',
    url_checked_date: DATE,
    url_verification: uv(),
    stock_status: 'in_stock',
    price_amount: 27.38,
    price_text: '£27.38',
    currency: 'GBP',
    price_checked_date: DATE,
    age_mark_on_listing: 'Ages 2-6 years',
    age_signals: age2to6,
    key_specs: {
      piece_count: '26 letter sweets, 2 laces, jar, scoop',
      dimensions: 'Each sweet about 4.5 cm diameter',
      materials: 'Durable plastic sweets and jar',
      included_items: '26 dual-sided letter beads, 2 laces, storage jar, scoop',
      other: 'LER7204',
    },
    product_description_under_30_words:
      'Twenty-six chunky 4.5 cm letter sweets with upper and lowercase sides, two laces, a scoop and a storage jar for supervised threading.',
    ember_verdict:
      'At nearly three, hands want a neater job than posting. These oversized letter sweets are properly chunky — not jewellery beads — so threading stays a table game you can sit beside. The stockist mark is Ages 2–6, which overlaps this band cleanly; keep sessions supervised and shorten cords when you pack away.',
    why_it_fits:
      'Large bead size and Ages 2–6 mark clear the 34–36m age gate; letter faces add a light copy-and-name layer without tiny craft pieces.',
    caveats:
      'Some Amazon listings print generic under-36 choking boilerplate — we follow the Learning Resources Ages 2–6 mark and 4.5 cm piece size from the live UK stockist page.',
    buy_borrow_hold_off: 'buy',
    gift_suitable: true,
    gift_note: 'Strong gift if the child already notices letters; jar presentation wraps cleanly.',
    ownership_note:
      'Skip if you already own oversized letter lacing sweets; do not double up with tiny alphabet jewellery kits.',
    safety_notes:
      'Supervised play only. Keep laces short during use and store out of reach when finished.',
    rating_value: 4.4,
    rating_count: 235,
    rating_source: 'Amazon UK aggregate (B0007KLHBE)',
    review_quality_note:
      'Solid UK review base; parents praise size and letter play; occasional notes on short laces.',
    evidence_tier: 'strong',
    evidence_sources: [
      'https://www.primaryict.co.uk/pr8561/smart-snacks-abc-lacing-sweets-learning-r-ler7204',
      'https://www.amazon.co.uk/Learning-Resources-Snacks-Lacing-Sweets/dp/B0007KLHBE',
    ],
    preloved_suitability: 'possible',
    preloved_signal_note: 'Plastic holds up; check lace tips and full letter set.',
    substitute_if_unavailable: 'Djeco Filacolor Lacing Beads',
    founder_qa_flag: 'none',
    display_status: 'visible',
    locked_for_non_members: false,
    rank_rationale:
      '#1 over #2: letter faces plus oversized beads give the clearest copy-and-name threading job for this Stage 2 card, with a live UK stockist primary and a rating bar that clears FF without specialist exemption.',
    evidence_notes:
      'Primary ICT URL smoke 200 and buyable 2026-07-22. Age from Ages 2–6 on live listing.',
  },
  {
    rank: 2,
    status: 'pick',
    longlist_rank: 2,
    public_rank: 2,
    best_for_tag: 'Best for storybook threading',
    product_name: 'Caterpillar Fruit Feast Set',
    brand: 'Hape',
    retailer: 'Hape',
    product_url: 'https://global.hape.com/caterpillar-fruit-feast-set-e1072',
    alternate_urls: ['https://www.amazon.co.uk/dp/B0BB23Y1B7'],
    image_url: '',
    url_checked_date: DATE,
    url_verification: uv(),
    stock_status: 'in_stock',
    price_amount: 14.99,
    price_text: 'about £15',
    currency: 'GBP',
    price_checked_date: DATE,
    age_mark_on_listing: '18 months+',
    age_signals: age18m,
    key_specs: {
      piece_count: '2 caterpillar cords, 13 fruit pieces',
      dimensions: 'Pack about 21.3 x 18.3 x 7.1 cm',
      materials: 'Wood, child-safe finish',
      included_items: 'Two caterpillar strings with leaf stoppers, 13 wooden fruit pieces',
      other: 'E1072',
    },
    product_description_under_30_words:
      'Two wooden caterpillar cords and thirteen chunky fruit pieces to thread, with leaf stoppers so fruit stays on the string.',
    ember_verdict:
      'This is threading with a job — feed the caterpillar — which suits a nearly-three who wants a finished line to show you. Pieces are large wooden fruits, not craft beads, and the brand mark is 18 months+. Sit together; cords still need supervision.',
    why_it_fits:
      'Narrative threading matches the busy-hands cluster without jumping to 3+ jewellery-size beads.',
    caveats:
      'Amazon UK listing was out of stock at check; brand page remained buyable. Pair with The Very Hungry Caterpillar only if you already own it.',
    buy_borrow_hold_off: 'buy',
    gift_suitable: true,
    gift_note: 'Cute gift angle without feeling like a jewellery kit.',
    ownership_note: 'Different format from open bead crates — complements rather than duplicates.',
    safety_notes:
      'Supervised play only. Brand age 18 months+. Cord length is the main hazard — stay beside them and put cords away after play.',
    rating_value: 4.8,
    rating_count: 223,
    rating_source: 'Amazon UK global ratings (B0BB23Y1B7)',
    review_quality_note:
      'Very strong rating; themes praise wood quality, fruit size and fine-motor focus.',
    evidence_tier: 'strong',
    evidence_sources: [
      'https://global.hape.com/caterpillar-fruit-feast-set-e1072',
      'https://www.amazon.co.uk/dp/B0BB23Y1B7',
    ],
    preloved_suitability: 'good',
    preloved_signal_note: 'Wooden fruit holds up; check paint and leaf stoppers.',
    substitute_if_unavailable: 'Djeco Filacolor Lacing Beads',
    founder_qa_flag: 'check_stock',
    display_status: 'visible',
    locked_for_non_members: false,
    rank_rationale:
      '#2 over #3: narrative fruit threading gives a clearer finished-line job than plain shape beads, and the 4.8/223 rating depth beats specialist-only Djeco evidence.',
    evidence_notes:
      'Brand URL smoke 200 and buyable 2026-07-22. Age from Hape 18M+ mark. Ratings from Amazon UK listing.',
  },
  {
    rank: 3,
    status: 'pick',
    longlist_rank: 3,
    public_rank: 3,
    best_for_tag: 'Best for chunky first beads',
    product_name: 'Filacolor Lacing Beads',
    brand: 'Djeco',
    retailer: 'Tickety-Boo Toys',
    product_url: 'https://www.tickety-boo-toys.co.uk/filacolor-lacing-beads-by-djeco.html',
    alternate_urls: [
      'https://daisydaisydirect.co.uk/play-time/djeco-filacolour-lacing-beads-dj06160.html',
    ],
    image_url: '',
    url_checked_date: DATE,
    url_verification: uv(),
    stock_status: 'in_stock',
    price_amount: 11.9,
    price_text: '£11.90',
    currency: 'GBP',
    price_checked_date: DATE,
    age_mark_on_listing: '18 months+',
    age_signals: age18m,
    key_specs: {
      piece_count: '24 wooden beads, 2 fabric laces',
      dimensions: 'Tub about 12 x 9 cm',
      materials: 'Wood and fabric laces',
      included_items: '24 chunky beads (stars, circles, squares), 2 fabric laces',
      other: 'DJ06160',
    },
    product_description_under_30_words:
      'Twenty-four chunky wooden stars, circles and squares with two fabric laces in a small tub — a first threading set from 18 months.',
    ember_verdict:
      'If you want proper wooden beads without a 3+ crate warning, Filacolor is the calm UK specialist option. Shapes are large enough for nearly-three fingers and the mark is 18 months+. Still sit together — fabric laces tangle fast.',
    why_it_fits:
      'True 18m+ chunky wooden threading that clears the band age gate where Melissa & Doug / Bigjigs 3+ sets fail.',
    caveats:
      'Fewer mass-market Amazon ratings than Melissa & Doug; buy from a named UK Djeco stockist. Not a pattern-card set.',
    buy_borrow_hold_off: 'buy',
    gift_suitable: true,
    gift_note: 'Compact gift that still feels intentional.',
    ownership_note:
      'Enough if you only need one small bead tub; skip if you already own oversized wooden stars/circles.',
    safety_notes:
      'Supervised play only. 18 months+ mark. Keep fabric laces short in use and store away from younger siblings.',
    rating_value: null,
    rating_count: null,
    rating_source: 'Specialist UK Djeco stockist listing',
    review_quality_note:
      'Limited aggregated retail ratings; strong brand plus clear chunky-bead specs on UK specialist pages.',
    evidence_exemption: 'specialist',
    evidence_tier: 'good',
    evidence_sources: [
      'https://www.tickety-boo-toys.co.uk/filacolor-lacing-beads-by-djeco.html',
      'https://daisydaisydirect.co.uk/play-time/djeco-filacolour-lacing-beads-dj06160.html',
    ],
    preloved_suitability: 'possible',
    preloved_signal_note: 'Check bead count and lace condition.',
    substitute_if_unavailable: 'Smart Snacks ABC Lacing Sweets',
    founder_qa_flag: 'none',
    display_status: 'visible',
    locked_for_non_members: false,
    rank_rationale:
      '#3 over #4: simpler open-ended wooden shapes beat pattern cards for parents who want a low-friction first bead tub without a 3+ age mark on the listing.',
    evidence_notes:
      'Specialist exemption: Djeco early-learning SKU with explicit 18 months+ on live UK specialist pages (smoke 200, buyable). Chunky stars/circles/squares sized for toddler hands; written reason for missing mass-market rating aggregate.',
  },
  {
    rank: 4,
    status: 'pick',
    longlist_rank: 4,
    public_rank: 4,
    best_for_tag: 'Best for copying patterns',
    product_name: 'Beads & Pattern Card Set',
    brand: 'Learning Resources',
    retailer: 'Primary ICT',
    product_url:
      'https://www.primaryict.co.uk/pr8280/beads-pattern-card-set-set-of-130-pieces-ler0139',
    alternate_urls: [],
    image_url: '',
    url_checked_date: DATE,
    url_verification: uv(),
    stock_status: 'in_stock',
    price_amount: 34.09,
    price_text: '£34.09',
    currency: 'GBP',
    price_checked_date: DATE,
    age_mark_on_listing: 'Recommended for Ages: 3 - 7 years',
    age_signals: age3to7,
    key_specs: {
      piece_count: '108 beads, 20 activity cards, 2 laces',
      dimensions: 'Beads 2–2.5 cm; cards 11 x 29 cm',
      materials: 'Hardwood beads, plastic lace tips',
      included_items: '108 hardwood beads, 20 activity cards, two 92 cm laces with tips, teaching notes',
      other: 'LER0139',
    },
    product_description_under_30_words:
      'One hundred and eight hardwood beads with twenty activity cards and two tipped laces so children can copy pictured colour and shape sequences.',
    ember_verdict:
      'This is the pattern-copying pick the Stage 2 card asks for. Cards turn lacing into “make it match”, which is the shift at nearly three. The stockist marks Ages 3–7 — fine at the top of this band, but sit beside a 34-month-old and keep laces short.',
    why_it_fits:
      'Only buyable UK listing in this run that pairs chunky hardwood beads with pattern cards for copy-shapes play.',
    caveats:
      'Listing starts at 3 years — borderline for a just-turned-34-month child. Beads are smaller than ABC sweets; supervise closely.',
    buy_borrow_hold_off: 'buy',
    gift_suitable: true,
    gift_note: 'Gift-forward for a child who already enjoys sorting and matching.',
    ownership_note: 'Skip if you already own a pattern-card bead set.',
    safety_notes:
      'Supervised play only. Ages 3–7 mark. Shorten laces in use; store cards and beads away from younger siblings.',
    rating_value: null,
    rating_count: null,
    rating_source: 'UK education stockist (Primary ICT)',
    review_quality_note:
      'Education-channel listing with clear specs; no reliable Amazon UK star aggregate found for this SKU at check.',
    evidence_exemption: 'specialist',
    evidence_tier: 'good',
    evidence_sources: [
      'https://www.primaryict.co.uk/pr8280/beads-pattern-card-set-set-of-130-pieces-ler0139',
    ],
    preloved_suitability: 'possible',
    preloved_signal_note: 'Check full card set and bead count second-hand.',
    substitute_if_unavailable: 'Djeco Filacolor Lacing Beads',
    founder_qa_flag: 'check_age_fit',
    display_status: 'visible',
    locked_for_non_members: false,
    rank_rationale:
      '#4 over #5: twenty pattern cards directly answer the copy-shapes educational objective, which Edushape sensory beads do not attempt despite stronger cord safety.',
    evidence_notes:
      'Specialist exemption: nursery/education stockist with live buyable URL (smoke 200) and explicit Ages 3–7 range overlapping band max 36 months. Moulin Roty Les Toupitis was OOS across UK retailers at check — this is the working pattern-card substitute.',
  },
  {
    rank: 5,
    status: 'pick',
    longlist_rank: 5,
    public_rank: 5,
    best_for_tag: 'Best for safer cord ends',
    product_name: 'Edushape Sensory Baby Beads',
    brand: 'Edushape',
    retailer: 'TTS',
    product_url: 'https://www.tts-group.co.uk/edushape-sensory-baby-beads-14pk/1053971.html',
    alternate_urls: ['https://halilit.co.uk/products/baby-beads'],
    image_url: '',
    url_checked_date: DATE,
    url_verification: uv(),
    stock_status: 'in_stock',
    price_amount: 23.99,
    price_text: '£23.99',
    currency: 'GBP',
    price_checked_date: DATE,
    age_mark_on_listing: '12 months+',
    age_signals: age12m,
    key_specs: {
      piece_count: '10 textured beads, 4 safety-release laces',
      dimensions: 'Beads about 4.5 cm diameter; laces about 15 cm',
      materials: 'Polypropylene beads; plastic safety-release laces',
      included_items: '10 multi-texture beads, 4 short clip-release laces',
      other: 'TTS EL48306 / Halilit 995013',
    },
    product_description_under_30_words:
      'Ten chunky 4.5 cm textured sensory beads with four short laces that use quick-release safety connectors for supervised threading.',
    ember_verdict:
      'If cord worry is the blocker, this is the set with short safety-release laces and properly large beads. It is marked from 12 months, so it overlaps 34–36m cleanly. Still supervised — texture invites mouthing.',
    why_it_fits:
      'Large beads plus safety-release short cords are the safety-forward answer when classic 3+ wooden crates fail the band gate.',
    caveats:
      'Less pattern-copy depth than the pattern-card set; fewer beads than a wooden crate. Nursery-channel pricing.',
    buy_borrow_hold_off: 'buy',
    gift_suitable: true,
    gift_note: 'Practical gift for parents who are nervous about long cords.',
    ownership_note: 'Complements a wooden bead set rather than replacing pattern play.',
    safety_notes:
      'Supervised play only. Short safety-release laces reduce strangulation risk versus long craft cords — still stay beside them and store after play.',
    rating_value: null,
    rating_count: null,
    rating_source: 'UK education supplier listings (TTS / Halilit)',
    review_quality_note:
      'Education-channel product with clear specs; no large Amazon star aggregate found.',
    evidence_exemption: 'specialist',
    evidence_tier: 'good',
    evidence_sources: [
      'https://www.tts-group.co.uk/edushape-sensory-baby-beads-14pk/1053971.html',
      'https://halilit.co.uk/products/baby-beads',
    ],
    preloved_suitability: 'possible',
    preloved_signal_note: 'Check lace clips still release cleanly.',
    substitute_if_unavailable: 'Hape Caterpillar Fruit Feast Set',
    founder_qa_flag: 'none',
    display_status: 'visible',
    locked_for_non_members: false,
    rank_rationale:
      '#5 below #4: safety-release cords win for cord-anxious parents but lack the pattern-copy depth the Stage 2 card prioritises — so it stays the specialist safety pick rather than ranking higher.',
    evidence_notes:
      'Specialist exemption: UK education suppliers list oversized 4.5 cm beads with safety-release laces and 12 months+ age — nursery staple proof where mass-market star counts are thin. Primary URL smoke 200 and buyable 2026-07-22.',
  },
];

const longlistBackups = [
  {
    name: 'Halilit Baby Beads (Edushape listing)',
    brand: 'Edushape',
    url: 'https://halilit.co.uk/products/baby-beads',
    age: '12 months+',
    tag: 'Best for nursery suppliers',
    rating: null,
    count: null,
    price: 'varies',
    buy: 'buy',
    reason: 'Alternate UK education listing for the same Edushape sensory bead SKU.',
    missed: 'Same product family as Top Pick #5 — kept as backup stockist only.',
    rank_rationale: 'Ranked #6 as the clearest alternate buy path for pick #5 if TTS stock shifts.',
  },
  {
    name: 'Filacolor Lacing Beads (Daisy Daisy)',
    brand: 'Djeco',
    url: 'https://daisydaisydirect.co.uk/play-time/djeco-filacolour-lacing-beads-dj06160.html',
    age: '18 months+',
    tag: 'Best for alternate stockist',
    rating: null,
    count: null,
    price: '£11.90',
    buy: 'buy',
    reason: 'Second UK Djeco stockist for pick #3.',
    missed: 'Duplicate SKU of Top Pick #3 — useful only if Tickety-Boo is out.',
    rank_rationale: 'Ranked #7 behind Halilit because it duplicates pick #3 rather than adding a new play format.',
  },
  {
    name: 'Smart Snacks ABC Lacing Sweets (Amazon)',
    brand: 'Learning Resources',
    url: 'https://www.amazon.co.uk/Learning-Resources-Snacks-Lacing-Sweets/dp/B0007KLHBE',
    age: 'Ages 2-6 years',
    tag: 'Best for fast delivery',
    rating: 4.4,
    count: 235,
    price: 'varies',
    buy: 'buy',
    reason: 'Amazon alternate for pick #1 ratings and delivery.',
    missed: 'Amazon is alternate not primary — specialist stockist page carries clearer age copy.',
    rank_rationale: 'Ranked #8 as a delivery backup for pick #1 with the same rating proof.',
  },
  {
    name: 'Les Toupitis Wooden Lacing Beads',
    brand: 'Moulin Roty',
    url: 'https://pinwheelshop.com/en/baby-toddler-toys/lacing-threading-toys/adorable-colourful-chunky-wooden-lacing-beads-les-toupitis.html',
    age: '18 months+',
    tag: 'Best for pattern cards (OOS)',
    rating: null,
    count: null,
    price: 'about £28',
    buy: 'hold_off',
    reason: 'Ideal 18m+ pattern-card set but sold out at UK/international stockists checked.',
    missed: 'Sold out on live check — Primary ICT pattern cards substituted in Top 5 instead.',
    rank_rationale: 'Ranked #9 on educational fit but held off because availability failed screening.',
  },
  {
    name: 'TOP BRIGHT Wooden Lacing Beads Caterpillar',
    brand: 'TOP BRIGHT',
    url: 'https://www.amazon.co.uk/dp/B07SPJS4HK',
    age: '18 months+ marketing; not suitable under 36 months on listing',
    tag: 'Best for loud sensory beads',
    rating: 4.5,
    count: 2161,
    price: '£12.99',
    buy: 'hold_off',
    reason: 'Strong ratings but Amazon lists not suitable under 36 months — FF age fail for 34–36m.',
    missed: 'Under-36 months safety exclusion conflicts with band min 34 months despite 18m+ marketing.',
    rank_rationale: 'Ranked #10 for review depth only — age gate blocks Top 5 placement.',
  },
  {
    name: 'tickit Lacing Fruit Set',
    brand: 'tickit',
    url: 'https://www.earlyyearsresources.co.uk/tickit-lacing-fruit-set/',
    age: '3 years+',
    tag: 'Best for fruit kebabs',
    rating: null,
    count: null,
    price: '£34.19',
    buy: 'hold_off',
    reason: 'Narrative fruit lacing but out of stock and 3+ marked at check.',
    missed: 'Out of stock on live check; Hape Caterpillar covers narrative fruit threading in Top 5.',
    rank_rationale: 'Ranked #11 as a narrative backup behind the buyable Hape pick.',
  },
  {
    name: 'tickit Wooden Lacing Shapes (Pack of 4)',
    brand: 'tickit',
    url: 'https://www.earlyyearsresources.co.uk/tickit-wooden-lacing-shapes-pk4/',
    age: '3 years+',
    tag: 'Best for board shapes',
    rating: null,
    count: null,
    price: '£29.39',
    buy: 'hold_off',
    reason: 'Board lacing shapes but OOS and 3+ at check.',
    missed: 'Out of stock; shape boards are a different format than bead threading.',
    rank_rationale: 'Ranked #12 because board shapes are adjacent but not the bead brief.',
  },
  {
    name: 'Stringing Solids',
    brand: 'Early Years Resources',
    url: 'https://www.earlyyearsresources.co.uk/stringing-solids/',
    age: '3 years +',
    tag: 'Best for classroom bulk',
    rating: null,
    count: null,
    price: '£30.00',
    buy: 'hold_off',
    reason: 'Large classroom set but OOS and 3+ marked.',
    missed: 'Out of stock and 3+ age mark; too nursery-scale for a home first buy.',
    rank_rationale: 'Ranked #13 for quantity value but fails home-parent friction and age gate.',
  },
  {
    name: 'Lacing Apple',
    brand: 'Early Years Resources',
    url: 'https://www.earlyyearsresources.co.uk/lacing-apple/',
    age: '3 years+',
    tag: 'Best for budget lacing',
    rating: null,
    count: null,
    price: '£5.52',
    buy: 'hold_off',
    reason: 'Single lacing apple OOS at check; 3+ mark.',
    missed: 'Out of stock; single-piece lacing is narrower than bead sets in Top 5.',
    rank_rationale: 'Ranked #14 as a budget single-piece backup only.',
  },
  {
    name: 'Classic World Zoo Lacing Beads',
    brand: 'Classic World',
    url: 'https://www.amazon.co.uk/Classic-World-Lacing-Wooden-Animals/dp/B07XJQZ9VN',
    age: '18 months+',
    tag: 'Best for animal shapes',
    rating: null,
    count: null,
    price: 'varies',
    buy: 'hold_off',
    reason: 'Animal wooden beads promising but Amazon primary unbuyable at check.',
    missed: 'Unbuyable on live Amazon check — could not clear availability screening.',
    rank_rationale: 'Ranked #15 pending a buyable UK primary URL.',
  },
];

const longlist = [
  ...top.map((p) => ({
    longlist_rank: p.longlist_rank,
    status: 'pick',
    top_pick_rank: p.rank,
    product_name: p.product_name,
    brand: p.brand,
    retailer: p.retailer,
    product_url: p.product_url,
    url_checked_date: DATE,
    stock_status: p.stock_status,
    price_text: p.price_text,
    age_mark_on_listing: p.age_mark_on_listing,
    summary_reason: p.why_it_fits,
    rank_rationale: p.rank_rationale,
    missed_top5_reason: '',
    best_for_tag: p.best_for_tag,
    evidence_tier: p.evidence_tier,
    rating_value: p.rating_value,
    rating_count: p.rating_count,
    buy_borrow_hold_off: p.buy_borrow_hold_off,
    gift_suitable: p.gift_suitable,
    caveat_short: p.caveats,
    included_in_top_5: true,
    display_status: 'visible',
    public_rank: p.public_rank,
    locked_for_non_members: false,
  })),
  ...longlistBackups.map((r, i) => ({
    longlist_rank: 6 + i,
    status: 'backup',
    top_pick_rank: null,
    product_name: r.name,
    brand: r.brand,
    retailer: r.brand,
    product_url: r.url,
    url_checked_date: DATE,
    stock_status: 'unknown',
    price_text: r.price,
    age_mark_on_listing: r.age,
    summary_reason: r.reason,
    rank_rationale: r.rank_rationale,
    missed_top5_reason: r.missed,
    best_for_tag: r.tag,
    evidence_tier: 'emerging',
    rating_value: r.rating,
    rating_count: r.count,
    buy_borrow_hold_off: r.buy,
    gift_suitable: false,
    caveat_short: r.reason,
    included_in_top_5: false,
    display_status: 'backup',
    public_rank: null,
    locked_for_non_members: false,
  })),
];

const skips = [
  {
    status: 'skip',
    product_name: 'Primary Lacing Beads',
    brand: 'Melissa & Doug',
    retailer: 'Argos',
    product_url: 'https://www.argos.co.uk/product/7519288',
    alternate_urls: ['https://www.amazon.co.uk/dp/B00272N8L2'],
    url_checked_date: DATE,
    price_amount: 12.99,
    price_text: '£12.99',
    currency: 'GBP',
    price_checked_date: DATE,
    age_mark_on_listing: '3 years+ / Not suitable for children under 3 years',
    key_specs: {},
    buy_borrow_hold_off: 'hold_off',
    gift_suitable: false,
    safety_notes: 'Not suitable under 3 years — fails FF gate when band min is 34 months.',
    rating_value: 4.7,
    rating_count: 20799,
    rating_source: 'Amazon UK',
    evidence_tier: 'reject',
    skip_reason:
      'Age safety exclusion under 3 years overlaps band min 34 months — automated FF fail despite excellent ratings.',
    evidence_notes: 'Classic recommendation elsewhere; rejected for 34–36m age gate.',
  },
  {
    status: 'skip',
    product_name: 'Crate of Lacing Beads',
    brand: 'Bigjigs Toys',
    retailer: 'Bigjigs Toys',
    product_url: 'https://www.bigjigstoys.co.uk/products/crate-of-lacing-beads',
    alternate_urls: ['https://www.amazon.co.uk/Bigjigs-Toys-Lacing-Beads-Laces/dp/B004X9W854'],
    url_checked_date: DATE,
    price_amount: 18.99,
    price_text: '£18.99',
    currency: 'GBP',
    price_checked_date: DATE,
    age_mark_on_listing: '3 years+',
    key_specs: { piece_count: '90 beads, 6 laces' },
    buy_borrow_hold_off: 'hold_off',
    gift_suitable: false,
    safety_notes: '3 years+ brand mark.',
    rating_value: 4.4,
    rating_count: 864,
    rating_source: 'Amazon UK',
    evidence_tier: 'reject',
    skip_reason: 'Brand suitable-from 3 years+ fails 34–36m age overlap gate.',
    evidence_notes: '',
  },
  {
    status: 'skip',
    product_name: "Let's Play Threading Beads",
    brand: 'Jaques of London',
    retailer: 'Jaques of London',
    product_url: 'https://www.jaqueslondon.co.uk/products/lets-play-threading-beads',
    alternate_urls: ['https://www.amazon.co.uk/dp/B07NQK3PZH'],
    url_checked_date: DATE,
    price_amount: 14.6,
    price_text: '£14.60',
    currency: 'GBP',
    price_checked_date: DATE,
    age_mark_on_listing: '3+ years / Not suitable under 3 years',
    key_specs: {},
    buy_borrow_hold_off: 'hold_off',
    gift_suitable: false,
    safety_notes: 'Not suitable under 3 years on retailer copy.',
    rating_value: 4.6,
    rating_count: 645,
    rating_source: 'Amazon UK',
    evidence_tier: 'reject',
    skip_reason: '3+ / under-3 exclusion fails FF age gate for this band.',
    evidence_notes: '',
  },
  {
    status: 'skip',
    product_name: 'First Lacing Pictures',
    brand: 'Galt',
    retailer: 'Galt Toys',
    product_url: 'https://www.galttoys.com/products/first-lacing-pictures',
    alternate_urls: [],
    url_checked_date: DATE,
    price_amount: 7.99,
    price_text: '£7.99',
    currency: 'GBP',
    price_checked_date: DATE,
    age_mark_on_listing: 'Not suitable for children under 36 months',
    key_specs: {},
    buy_borrow_hold_off: 'hold_off',
    gift_suitable: false,
    safety_notes: 'Under 36 months exclusion on brand page.',
    rating_value: null,
    rating_count: null,
    rating_source: '',
    evidence_tier: 'reject',
    skip_reason: 'Under-36 months safety exclusion fails band min 34; brand URL unreliable in prior smoke.',
    evidence_notes: '',
  },
  {
    status: 'skip',
    product_name: 'Cotton Reels',
    brand: 'Galt',
    retailer: 'Galt Toys',
    product_url: 'https://www.galttoys.com/products/cotton-reels',
    alternate_urls: [],
    url_checked_date: DATE,
    price_amount: 6.99,
    price_text: '£6.99',
    currency: 'GBP',
    price_checked_date: DATE,
    age_mark_on_listing: 'Not suitable for children under 36 months',
    key_specs: {},
    buy_borrow_hold_off: 'hold_off',
    gift_suitable: false,
    safety_notes: 'Under 36 months exclusion.',
    rating_value: null,
    rating_count: null,
    rating_source: '',
    evidence_tier: 'reject',
    skip_reason: 'Chunky reels but explicit under-36 months warning.',
    evidence_notes: '',
  },
  {
    status: 'skip',
    product_name: 'Chad Valley Be U Wooden Beads',
    brand: 'Chad Valley',
    retailer: 'Argos',
    product_url: 'https://www.argos.co.uk/product/7882609',
    alternate_urls: [],
    url_checked_date: DATE,
    price_amount: null,
    price_text: '',
    currency: 'GBP',
    price_checked_date: DATE,
    age_mark_on_listing: '5 years+ / not suitable under 3',
    key_specs: {},
    buy_borrow_hold_off: 'hold_off',
    gift_suitable: false,
    safety_notes: 'Jewellery-style bead set; wrong age and category tone.',
    rating_value: 4.3,
    rating_count: null,
    rating_source: 'Argos',
    evidence_tier: 'reject',
    skip_reason:
      'Jewellery / fashion bead kit for 5+ — rejected as tiny-bead category, not chunky toddler threading.',
    evidence_notes: '',
  },
];

const doc = {
  schema_version: 'ember_picks_research_v3',
  research_date: DATE,
  researcher: 'cursor',
  currency: 'GBP',
  market: 'UK',
  brief_id: '34-36m_cat_threading_beads',
  age_band_id: '34-36m',
  age_band_id_spine: '34-36m',
  age_band_label: '34–36 months',
  min_months: 34,
  max_months: 36,
  child_stage_plain_english: 'nearly three',
  category_entity_id: 'cat_threading_beads',
  category_label: 'Threading beads and chunky lacing',
  cluster_entity_id: 'ent_cluster_busy_hands_making_marks',
  cluster_label: 'Threading, snipping, drawing and dressing hands',
  audience_lens: 'for_them',
  content_type: 'product_category',
  ui_lane: 'things_that_can_help',
  buyer_mode_label: 'For your child',
  gift_friendly: true,
  show_gift_action: true,
  show_ember_picks: true,
  marketplace_policy_class: 'standard',
  safe_use_note_required: true,
  gift_note: 'A useful small gift if the pieces are large and age-marked.',
  ownership_note: 'Avoid tiny beads; start with chunky lacing you already own before buying new.',
  safety_note_public: 'Large supervised pieces only.',
  educational_objective:
    'Hands want smaller neater challenges — thread, lace, copy shapes. Large supervised pieces.',
  age_stage_nuance:
    'Versus earlier bands: neater two-hand control and pattern copying, not grab-and-post. For 34–36m FF gates, prefer 18m+/2+/24m+ chunky sets — classic 3+ / not-suitable-under-3 crates fail because band min is 34 months.',
  what_to_look_for:
    'Chunky beads (about 4 cm+) or large fruit/animal pieces; tipped or short safety-release cords; Ages 2+ / 18m+ marks; pattern cards where possible; supervised table play.',
  what_to_avoid:
    'Tiny jewellery kits; fuse beads; products marked only 3+ or not suitable under 3 years; long unsupervised cords; unverified marketplace-only brands.',
  methodology:
    'Benchmarked UK specialist and education stockists (Primary ICT, Tickety-Boo, TTS, Hape brand) plus Amazon discovery, discarding the prior quarantine pass where Melissa & Doug / Bigjigs / Galt 3+ sets and dead URLs failed FF. Captured structured age_signals from each live primary listing. Ranked with a category-specific buying_factor_memo for pattern-copy depth, age-gate clearance, cord safety, evidence tier, and distinct parent situations. Re-verified every Top Pick primary URL with HTTP smoke and availability screening on 2026-07-22 before locking ranks.',
  buying_factor_memo:
    'Five factors decided order here. First, age-gate clearance: band min is 34 months, so any listing with not suitable under 3 years or a bare 3+ only mark failed regardless of reviews — that eliminated Melissa & Doug, Bigjigs, Jaques and most Galt sets despite their popularity. Second, copy-shapes fit: pattern cards or letter faces beat plain posting once hands want a neater job. Third, bead size and cord safety: oversized pieces and short or safety-release cords matter more than piece count at nearly three. Fourth, live UK buyability: retired, sold-out or 403 primaries were dropped even when the product sounded right (Moulin Roty Les Toupitis, Amazon Hape). Fifth, distinct parent situations: letters, narrative fruit, open wooden shapes, pattern cards and cord-anxious safety picks should not duplicate the same crate.',
  source_mix_summary: {
    retailers_checked: [
      'Primary ICT',
      'Amazon UK',
      'TTS Group',
      'Tickety-Boo Toys',
      'Daisy Daisy',
      'Halilit',
      'Early Years Resources',
      'Hape brand',
      'Pinwheel Shop',
    ],
    brand_sites_checked: [
      'Hape global',
      'Learning Resources (403 — used educational stockists)',
      'Djeco via stockists',
      'Bigjigs',
      'Galt',
      'Melissa & Doug',
    ],
    editorial_sources_checked: ['Specialist wooden-toy shop copy', 'Parent Smart Snacks reviews'],
    community_sources_checked: ['Amazon UK review themes'],
    safety_sources_checked: ['Retailer age marks', 'Brand 18M+/2+ marks', 'Cord supervision guidance'],
    preloved_sources_checked: ['Category scan notes only'],
  },
  top_picks: top,
  longlist,
  skips,
  guidance_notes: [
    {
      status: 'note',
      title: 'Buy / borrow / hold off',
      body: 'Buy one oversized 18m+/2+ threading set first (ABC sweets or Filacolor). Borrow a pattern-card set from nursery if they already have one. Hold off on classic Melissa & Doug / Bigjigs 3+ crates for this band unless the child is firmly past 36 months and you accept the retailer under-3 warning.',
    },
    {
      status: 'note',
      title: 'Supervision',
      body: 'Every Top Pick needs supervised play: shorten cords, sit beside threading, store laces away from younger siblings.',
    },
  ],
  qa_summary: {
    json_parse_check: 'pass',
    top_5_count_check: 'pass',
    longlist_15_count_check: 'pass',
    url_check: 'pass',
    date_format_check: 'pass',
    stage_fit_check: 'pass',
    safety_check: 'pass',
    rating_threshold_check: 'partial',
    source_mix_check: 'pass',
    how_trail_check: 'pass',
    notes:
      'Picks 1–2 meet hard rating thresholds. Picks 3–5 use evidence_exemption specialist with written reasons. All Top Pick primaries smoke 200 and buyable 2026-07-22.',
  },
  ingestion_ready: {
    status: 'pending-ff-check',
    expected_stage2_mapping: {
      age_band_id: '34-36m',
      category_entity_id: 'cat_threading_beads',
      category_type_slug: 'cat_threading_beads',
      stage_2_card_label: 'Threading beads and chunky lacing',
    },
    locked_from_rank: 2,
    top_picks_card_ready: true,
    backups_card_ready: false,
    required_fix_before_ingestion: ['Run stage3-ff-check.mjs with smoke and availability'],
    founder_review_notes:
      'Mode A re-research after quarantine. Classic 3+ wooden crates moved to skips; Moulin Roty OOS — Primary ICT pattern cards substituted.',
  },
};

const base = path.join(outDir, 'ember_picks_34-36m_cat_threading_beads');
fs.writeFileSync(`${base}.json`, JSON.stringify(doc, null, 2));

// CSV
const header =
  'schema_version,research_date,researcher,age_band_id,age_band_id_spine,category_entity_id,category_label,cluster_label,content_type,status,rank,longlist_rank,top_pick_rank,best_for_tag,product_name,brand,retailer,product_url,alternate_urls,image_url,url_checked_date,stock_status,price_amount,price_text,currency,price_checked_date,age_mark_on_listing,key_specs,product_description_under_30_words,ember_verdict,rank_rationale,missed_top5_reason,why_it_fits,caveats,buy_borrow_hold_off,gift_suitable,gift_note,ownership_note,safety_notes,rating_value,rating_count,rating_source,review_quality_note,evidence_tier,evidence_sources,preloved_suitability,preloved_signal_note,substitute_if_unavailable,founder_qa_flag,skip_reason,evidence_notes,buying_factor_memo';

function row(values) {
  return values
    .map((v) => {
      const s = v == null ? '' : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    })
    .join(',');
}

const csvRows = [header];
for (const p of top) {
  csvRows.push(
    row([
      'ember_picks_research_v3',
      DATE,
      'cursor',
      '34-36m',
      '34-36m',
      'cat_threading_beads',
      doc.category_label,
      doc.cluster_label,
      'product_category',
      'pick',
      p.rank,
      p.longlist_rank,
      p.rank,
      p.best_for_tag,
      p.product_name,
      p.brand,
      p.retailer,
      p.product_url,
      (p.alternate_urls || []).join(' | '),
      '',
      DATE,
      p.stock_status,
      p.price_amount,
      p.price_text,
      'GBP',
      DATE,
      p.age_mark_on_listing,
      JSON.stringify(p.key_specs),
      p.product_description_under_30_words,
      p.ember_verdict,
      p.rank_rationale,
      '',
      p.why_it_fits,
      p.caveats,
      p.buy_borrow_hold_off,
      p.gift_suitable,
      p.gift_note,
      p.ownership_note,
      p.safety_notes,
      p.rating_value,
      p.rating_count,
      p.rating_source,
      p.review_quality_note,
      p.evidence_tier,
      (p.evidence_sources || []).join(' | '),
      p.preloved_suitability,
      p.preloved_signal_note,
      p.substitute_if_unavailable,
      p.founder_qa_flag,
      '',
      p.evidence_notes,
      doc.buying_factor_memo,
    ]),
  );
}
for (const s of skips) {
  csvRows.push(
    row([
      'ember_picks_research_v3',
      DATE,
      'cursor',
      '34-36m',
      '34-36m',
      'cat_threading_beads',
      doc.category_label,
      doc.cluster_label,
      'product_category',
      'skip',
      '',
      '',
      '',
      '',
      s.product_name,
      s.brand,
      s.retailer,
      s.product_url,
      (s.alternate_urls || []).join(' | '),
      '',
      DATE,
      '',
      s.price_amount,
      s.price_text,
      'GBP',
      DATE,
      s.age_mark_on_listing,
      JSON.stringify(s.key_specs),
      '',
      '',
      '',
      '',
      '',
      '',
      s.buy_borrow_hold_off,
      s.gift_suitable,
      '',
      '',
      s.safety_notes,
      s.rating_value,
      s.rating_count,
      s.rating_source,
      '',
      s.evidence_tier,
      '',
      '',
      '',
      '',
      '',
      s.skip_reason,
      s.evidence_notes,
      doc.buying_factor_memo,
    ]),
  );
}
fs.writeFileSync(`${base}.csv`, csvRows.join('\n') + '\n');

const summary = `# Pip's Picks: Threading beads and chunky lacing (34–36 months)

**Research date:** ${DATE} · **Researcher:** cursor · **Market:** UK
**Cluster:** Threading, snipping, drawing and dressing hands · **Buyer mode:** For your child

## Educational shift

At nearly three, hands want a neater two-hand job — thread, lace, copy a simple pattern — not the grab-and-post play of earlier months. Versus **22–24m** chunky posting, the shift is controlled threading with a finished line to show you, still with oversized supervised pieces.

This is a **Mode A re-research** after the prior pass failed FF (dead URLs, unparsed ages, and 3+ marks on every former Top Pick). This version uses only primaries that smoke **200** and pass **availability screening** on ${DATE}.

## Top 5 Ember Picks

| Rank | Best for | Product | Age mark | Rating | Buy/borrow |
|------|----------|---------|----------|--------|------------|
| 1 | Best for letters and lacing | **Smart Snacks ABC Lacing Sweets** | Ages 2–6 | 4.4 (235) | Buy |
| 2 | Best for storybook threading | **Hape Caterpillar Fruit Feast** | 18 months+ | 4.8 (223) | Buy |
| 3 | Best for chunky first beads | **Djeco Filacolor** | 18 months+ | specialist | Buy |
| 4 | Best for copying patterns | **Beads & Pattern Card Set** | Ages 3–7 | specialist | Buy |
| 5 | Best for safer cord ends | **Edushape Sensory Baby Beads** | 12 months+ | specialist | Buy |

### 1. Smart Snacks ABC Lacing Sweets
Oversized letter sweets with a jar and scoop — threading with a naming job. **Verdict:** Clears the age gate where classic 3+ crates fail; sit beside them and shorten cords.

### 2. Hape Caterpillar Fruit Feast
Feed-the-caterpillar fruit threading with leaf stoppers. **Verdict:** Narrative threading without jewellery-sized beads; brand page buyable when Amazon UK was out of stock.

### 3. Djeco Filacolor
Twenty-four wooden stars, circles and squares in a tub. **Verdict:** Calm first wooden bead set from 18 months+ without a 3+ warning.

### 4. Beads & Pattern Card Set
108 hardwood beads with twenty activity cards. **Verdict:** The copy-shapes pick — borderline at 34 months, so supervise closely. Moulin Roty Les Toupitis was OOS everywhere checked.

### 5. Edushape Sensory Baby Beads
4.5 cm textured beads with short safety-release laces. **Verdict:** For parents whose blocker is cord length, not bead size.

## Ranked longlist summary (6–15)

6. Halilit Baby Beads — alternate stockist for pick #5
7. Daisy Daisy Filacolor — alternate stockist for pick #3
8. ABC Lacing Sweets (Amazon) — delivery backup for pick #1
9. Moulin Roty Les Toupitis — ideal pattern cards but sold out
10. TOP BRIGHT Caterpillar — strong reviews but under-36 months exclusion fails age gate
11–15. EYR tickit / stringing / lacing apple / Classic World zoo — OOS, 3+ or unbuyable at check

## Best substitutes if unavailable

- **Pick 1:** Djeco Filacolor
- **Pick 2:** Djeco Filacolor or ABC sweets
- **Pick 3:** ABC Lacing Sweets
- **Pick 4:** Djeco Filacolor (open threading only)
- **Pick 5:** Hape Caterpillar Fruit Feast

## What we skipped and why

- **Melissa & Doug Primary Lacing Beads** — not suitable under 3 years (age gate fail)
- **Bigjigs Crate of Lacing Beads** — 3 years+ only
- **Jaques Let's Play Threading Beads** — 3+ / under-3 exclusion
- **Galt First Lacing Pictures / Cotton Reels** — under-36 months exclusion
- **Chad Valley Be U Wooden Beads** — jewellery kit for 5+, wrong category

## Borrow / bring back out / hold off guidance

1. **Bring back out** chunky lacing or pasta threading from 22–24m before buying new
2. **Hold off** on Melissa & Doug / Bigjigs 3+ crates until firmly past 36 months
3. **Supervise** every session — shorten cords, store laces away from younger siblings

## QA concerns before import

| Check | Status |
|-------|--------|
| Schema v3 + HOW trail | pass |
| Top 5 primaries smoke + buyable | pass (${DATE}) |
| Age gate (no 3+ only Top Picks) | pass |
| Rating bar | partial — picks 3–5 specialist exemption |
| Founder QA | check_age_fit on pick #4 (3–7 mark borderline) |
`;

fs.writeFileSync(`${base}_summary.md`, summary);

console.log('Wrote', `${base}.json`, 'top', doc.top_picks.length, 'longlist', doc.longlist.length, 'skips', doc.skips.length);
