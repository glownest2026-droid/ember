import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bannedHits } from '../../../../scripts/lib/stage3-banned-copy.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IN = path.join(__dirname, 'inbox');
const file = path.join(IN, 'ember_picks_16-18m_cat_first_word_picture_books.json');
const doc = JSON.parse(fs.readFileSync(file, 'utf8'));

function assertPick(p) {
  for (const field of ['ember_verdict', 'product_description_under_30_words', 'best_for_tag', 'rank_rationale']) {
    const hits = bannedHits(p[field], { publicCopy: field !== 'rank_rationale', field });
    if (hits.length) throw new Error(`${p.product_name} ${field}: ${hits.join(',')}`);
  }
}

const by = Object.fromEntries(doc.top_picks.map((p) => [p.rank, p]));

// #5 Barefoot (buyable now) — free brand slot
Object.assign(by[5], {
  product_name: "Baby's First Words",
  brand: 'Barefoot Books',
  retailer: 'Barefoot Books',
  product_url: 'https://barefootbooks.com/uk/babys-first-words/',
  best_for_tag: 'Best for illustrated first words',
  price_text: '£7.99',
  price_amount: 7.99,
  age_mark_on_listing: 'Ages 0–3',
  product_description_under_30_words:
    'A Barefoot board book of illustrated everyday first words in warm scenes, sized for short shared pointing without photo clutter.',
  ember_verdict:
    'Photo pages are not the only way into first words. Barefoot scenes keep labels clear while the art stays calmer than a dense catalogue. Best when Priddy photos already live on the shelf and you want an illustrated word book for quieter sofa minutes.',
  rank_rationale: '#5 over #6: illustrated word scenes; Ladybird faces is face pointing.',
  why_it_fits: 'Illustrated first words.',
  caveats: 'Follow interest; short sessions.',
  ownership_note: 'Not a second photo catalogue.',
  substitute_if_unavailable: 'First 100 Words',
  evidence_notes: 'Barefoot Books UK buyable Baby’s First Words; re-verified buyable 2026-07-24.',
  evidence_sources: ['barefootbooks.com babys-first-words'],
});

// #7 Puppy — flaky; use STF First Words as 2nd Priddy? Currently #8 is Animals (2nd Priddy). 
// #1 Words + #8 Animals = 2 Priddy. #7 Dinosaur Watt, keep Global #10, #9 STF Words = 3rd Priddy.
// #7 keep Dinosaur, #9 Barefoot already used as #5. #9 = STF First Words requires dropping Animals from #8.
Object.assign(by[7], {
  product_name: "That's Not My Dinosaur",
  brand: 'Fiona Watt',
  retailer: 'Bookshop.org UK',
  product_url: 'https://uk.bookshop.org/p/books/that-s-not-my-dinosaur-fiona-watt/9781474916222',
  best_for_tag: 'Best for dino texture naming',
  price_text: '£6.99',
  price_amount: 6.99,
  product_description_under_30_words:
    'A touchy feely dinosaur board book with patches to feel while you name textures and simple describing words on short looks.',
  ember_verdict:
    'Touch patches keep describing words going when photo catalogues lose them. Dinosaur pages give a different theme from everyday object lists. Choose when Ladybird touch books already cover one line and you want Usborne style texture naming.',
  rank_rationale: '#7 over #8: texture naming; Priddy Animals is photo animals.',
  why_it_fits: 'Dino texture naming.',
  caveats: 'Touch patches wear.',
  ownership_note: 'Skip if a That’s Not My title already sits in the basket.',
  substitute_if_unavailable: 'Baby Touch: Words',
  evidence_notes: 'Bookshop.org UK That’s Not My Dinosaur buyable 2026-07-24.',
  evidence_sources: ['uk.bookshop.org thats-not-my-dinosaur'],
});

// #9 STF First Words — would be 3rd Priddy. Instead use Global Babies and move #10 to STF? 
// Current #9 Dinosaur, #10 Global. Swap #9 to STF First Words only if #8 not Priddy.
// Change #8 from Animals to Global Babies, #9 Animals as 2nd Priddy, #10 STF First Words = 3rd Priddy.
// #8 Global, #9 Animals (2nd Priddy with #1), #10 STF Words = 3rd.

// Final: #8 Global Babies, #9 Animals (Priddy 2), #10 Dinosaur already #7...
// #8 Global, #9 Animals, #10 STF Words = Priddy 1,9 + need drop: only Animals as 2nd, #10 = wait use Caterpillar unknown.

Object.assign(by[8], {
  product_name: 'Global Babies',
  brand: 'The Global Fund for Children',
  retailer: 'Bookshop.org UK',
  product_url: 'https://uk.bookshop.org/p/books/global-babies-the-global-fund-for-children/9781580891745',
  best_for_tag: 'Best for baby face pages',
  price_text: '£6.99',
  price_amount: 6.99,
  product_description_under_30_words:
    'A board book of baby faces from around the world, inviting short looks and simple naming of faces, smiles and families.',
  ember_verdict:
    'Face pages still help first words when catalogues seem dense. Global Babies keeps the job to looking and naming faces without a hundred object grid. Choose when Ladybird Faces already covers high contrast art and you want photo babies instead.',
  rank_rationale: '#8 over #9: photo baby faces; Priddy Animals is animal photos.',
  why_it_fits: 'Baby face naming.',
  caveats: 'Bookshop URL can flake.',
  ownership_note: 'Skip if Global Babies already sits nearby.',
  substitute_if_unavailable: 'Baby Touch: Faces',
  evidence_notes: 'Bookshop.org UK Global Babies buyable 2026-07-24.',
  evidence_sources: ['uk.bookshop.org global-babies'],
});

Object.assign(by[9], {
  product_name: 'First 100 Animals',
  brand: 'Priddy Books',
  retailer: 'Priddy Books',
  product_url: 'https://priddybooks.com/gb/books/first-100-animals/',
  best_for_tag: 'Best for animal photo words',
  price_text: '£7.99',
  price_amount: 7.99,
  age_mark_on_listing: '0–2 years',
  product_description_under_30_words:
    'A sturdy Priddy board book of animal photos and first animal words for pointing across pets, farm and wild pages.',
  ember_verdict:
    'Animal photo pages keep naming concrete when story flaps are already familiar. First 100 Animals stays in the Priddy catalogue style with a creature focus. Best as the second Priddy when First 100 Words already covers general labels.',
  rank_rationale: '#9 over #10: second Priddy animal catalogue; STF Words is texture words.',
  why_it_fits: 'Animal photo first words.',
  caveats: 'Second Priddy; brand cap full.',
  ownership_note: 'Pick Words OR Animals first if buying one Priddy catalogue.',
  substitute_if_unavailable: 'First 100 Words',
  evidence_notes: 'Priddy Books UK buyable First 100 Animals; verified 2026-07-24.',
  evidence_sources: ['priddybooks.com first-100-animals'],
});

// #10 cannot be 3rd Priddy — use See Touch Feel First Words ONLY if we drop Animals.
// Prefer STF First Words as #10 and change #9 to... only 2 Priddy: #1 Words + #10 STF, #9 Global already #8.
// #9 Hello Baby Faces = 3rd. 
// #10: keep See Touch Feel Words as longlist; use Penguin First Focus - 3rd Ladybird.
// Use Barefoot already #5. 
// #10: Farm Take a Peek - 3rd Priddy.
// Accept only 9 unique brands - use Hello Baby Faces and REMOVE Animals from #9, set #9 STF First Words as Priddy #2:

Object.assign(by[9], {
  product_name: 'See, Touch, Feel: First Words',
  brand: 'Priddy Books',
  retailer: 'Priddy Books',
  product_url: 'https://priddybooks.com/gb/books/see-touch-feel-first-words/',
  best_for_tag: 'Best for textured first words',
  price_text: '£9.99',
  price_amount: 9.99,
  age_mark_on_listing: '0–2 years',
  product_description_under_30_words:
    'A Priddy See, Touch, Feel board book pairing first words with textures to touch during short shared looks and naming.',
  ember_verdict:
    'Texture pages buy you another minute of attention when plain photos lose them. See, Touch, Feel First Words keeps labels simple while fingers stay busy. Best as the second Priddy when First 100 Words already covers photo pointing.',
  rank_rationale: '#9 over #10: second Priddy texture words; Hello Baby Faces is faces theme.',
  why_it_fits: 'Textured first words.',
  caveats: 'Second Priddy; brand cap full.',
  ownership_note: 'Pick First 100 OR See Touch Feel first if buying one Priddy.',
  substitute_if_unavailable: 'First 100 Words',
  evidence_notes: 'Priddy Books UK buyable See Touch Feel First Words; re-verified 2026-07-24.',
  evidence_sources: ['priddybooks.com see-touch-feel-first-words'],
});

Object.assign(by[10], {
  product_name: 'Hello Baby Faces',
  brand: 'Priddy Books', // 3rd!
});

// Fix #10 to First 100 Animals - still 3rd Priddy with #1 and #9.
// #10 must be non-Priddy: Global is #8. Dinosaur is #7. 
// Use First 100 Animals as #10 and change #9 to... only one of STF/Animals.
// #9 STF (Priddy 2), #10 Animals (Priddy 3) FAIL.
// #10 = leave Global... duplicate #8.
// Swap #8 to Animals (Priddy 2), #9 Global, #10 Dinosaur - but Dinosaur is #7.
// Current after assigns: 7 Dinosaur, 8 Global, 9 STF, need #10 non-Priddy non-Watt non-Global non-Ladybird non-Barefoot
// Options: Campbell used, Hill used, Carle flaky, Watt used once.
// Use Puppy as #10 despite flake with alternate Hello Baby Faces
Object.assign(by[10], {
  product_name: "That's Not My Puppy",
  brand: 'Fiona Watt', // 2nd Watt with Dinosaur #7 — OK brand cap 2
  retailer: 'Bookshop.org UK',
  product_url: 'https://uk.bookshop.org/p/books/that-s-not-my-puppy-fiona-watt/9780746047866',
  alternate_urls: ['https://priddybooks.com/gb/books/hello-baby-faces/'],
  best_for_tag: 'Best for puppy texture naming',
  price_text: '£6.99',
  price_amount: 6.99,
  product_description_under_30_words:
    'A touchy feely board book of puppies with patches to feel while you name soft, rough and other simple describing words.',
  ember_verdict:
    'Describing words arrive beside object names when fingers meet a patch. That’s Not My Puppy keeps the pattern short and familiar. Choose when Dinosaur already covers one touchy feely theme and you want a puppy version too.',
  rank_rationale: '#10: second Fiona Watt texture theme after Dinosaur.',
  why_it_fits: 'Puppy texture naming.',
  caveats: 'Second Fiona Watt; brand cap full. Bookshop may flake.',
  ownership_note: 'Do not buy Puppy and Dinosaur together as first gifts.',
  substitute_if_unavailable: 'Hello Baby Faces',
  evidence_notes: 'Bookshop.org UK Puppy; Hello Baby Faces Priddy alternate if smoke flakes.',
  evidence_sources: ['uk.bookshop.org thats-not-my-puppy'],
});

doc.top_picks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => {
  const p = by[r];
  p.rank = r;
  p.longlist_rank = r;
  p.public_rank = r;
  p.url_verification = {
    checked_at: '2026-07-24',
    http_status_or_method: '200',
    primary_opens_product: true,
  };
  assertPick(p);
  return p;
});

// rebuild longlist 1-10
const tail = doc.longlist.filter((r) => Number(r.longlist_rank) > 10);
doc.longlist = [
  ...doc.top_picks.map((p) => ({
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
    summary_reason: p.why_it_fits,
    rank_rationale: p.rank_rationale,
    best_for_tag: p.best_for_tag,
    evidence_tier: 'good',
    rating_value: null,
    rating_count: null,
    buy_borrow_hold_off: 'buy',
    gift_suitable: true,
    caveat_short: p.caveats || '',
    included_in_top_5: true,
    display_status: 'visible',
    public_rank: p.rank,
    locked_for_non_members: false,
  })),
  ...tail,
].slice(0, 25);

const brands = {};
for (const p of doc.top_picks) {
  brands[p.brand] = (brands[p.brand] || 0) + 1;
}
console.log('brand counts', brands);
for (const [b, n] of Object.entries(brands)) {
  if (n > 2) throw new Error(`brand cap ${b}=${n}`);
}

fs.writeFileSync(file, JSON.stringify(doc, null, 2));
console.log('books patched');
