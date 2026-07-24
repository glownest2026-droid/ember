import { smokeUrl } from '../../../../../scripts/stage3-url-smoke.mjs';
import { checkUrlAvailability } from '../../../../../scripts/stage3-availability-check.mjs';

const urls = [
  'https://www.babybjorn.co.uk/products/bathroom/step-stool/',
  'https://www.babybjorn.co.uk/products/bathroom/potty-chair/',
  'https://www.babybjorn.co.uk/products/bathroom/toilet-training-seat/',
  'https://www.babybjorn.co.uk/products/bathroom/smart-potty/',
  'https://www.boots.com/bumbo-step-n-potty',
  'https://www.boots.com/babybjorn-potty-chair-white-grey-10220695',
  'https://www.amazon.co.uk/OXO-Tot-Step-Stool-White/dp/B0759QF6T2',
  'https://www.ikea.com/gb/en/p/uppsta-shape-sorter-multicolour-90592088/',
  'https://www.ikea.com/gb/en/p/uppsta-building-beakers-multicolour-70513884/',
  'https://www.ikea.com/gb/en/p/uppsta-stacking-rings-multicolour-00513892/',
  'https://www.ikea.com/gb/en/p/sparka-soft-toy-football-mini-blue-red-20506758/',
  'https://www.ikea.com/gb/en/p/sparka-soft-toy-football-green-70302645/',
  'https://www.amazon.co.uk/dp/B087F8T3S1',
  'https://www.gompels.co.uk/soft-rugby-ball.html',
  'https://www.kidsdream.co.uk/little-dutch-mini-kitchen-3936-p.asp',
  'https://www.scandiborn.co.uk/products/little-dutch-wooden-mini-kitchen',
  'https://www.zidarkid.co.uk/products/little-dutch-wooden-mini-kitchen',
  'https://www.amazon.co.uk/dp/B0BBRYNNF7',
  'https://www.penguin.co.uk/books/108934/dear-zoo-by-campbell-rod/9780230747890',
  'https://www.penguin.co.uk/books/111124/peepo-by-ahlberg-janet/9780141337425',
  'https://www.penguin.co.uk/books/312672/ten-minutes-to-bed-little-dinosaur-by-fielding-rhiannon/9780241532676',
  'https://www.penguin.co.uk/books/317914/the-colour-monster-by-llenas-anna/9781787412736',
  'https://www.booktrust.org.uk/book-recommendations/bookfinder/dear-zoo/',
  'https://www.booktrust.org.uk/book-recommendations/bookfinder/the-colour-monster/',
  'https://www.booktrust.org.uk/book-recommendations/bookfinder/peepo/',
  'https://letoyvan.co.uk/collections/role-play-cooking-wooden-kitchens/products/honeybake-oven-hob-set',
  'https://rockawaytoys.co.uk/products/le-toy-van-chopping-board-with-super-food',
  'https://www.elc.co.uk/brand/wooden-toys/wooden-puzzles-and-shape-sorters/early-learning-centre-wooden-shape-sorter/128849.html',
  'https://www.argos.co.uk/product/9202129',
  'https://www.smythstoys.com/uk/en-gb/toys/preschool/educational-toys/melissa-and-doug-shape-sorting-cube/p/159210',
];

for (const u of urls) {
  const s = await smokeUrl(u);
  const a = await checkUrlAvailability(u);
  console.log(
    [
      s.url_ok ? 'OK' : 'FAIL',
      a.unavailable ? 'OOS' : 'IN',
      s.http_status,
      String(s.error || a.reason || a.signal || '-').slice(0, 45),
      u.replace(/^https?:\/\//, '').slice(0, 72),
    ].join(' | '),
  );
}
