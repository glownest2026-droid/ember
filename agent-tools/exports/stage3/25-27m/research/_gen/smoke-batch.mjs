import { checkUrl } from '../../../../../scripts/stage3-url-smoke.mjs';
import { checkAvailability } from '../../../../../scripts/stage3-availability-check.mjs';

const urls = [
  'https://www.babybjorn.co.uk/products/bathroom/step-stool/',
  'https://www.ikea.com/gb/en/p/foersiktig-childrens-stool-white-turquoise-10591318/',
  'https://www.ikea.com/gb/en/p/trogen-childrens-step-stool-yellow-80371520/',
  'https://www.ikea.com/gb/en/p/bolmen-step-stool-white-70574429/',
  'https://www.boots.com/bumbo-step-n-potty',
  'https://www.babybjorn.co.uk/products/bathroom/toilet-training-seat/',
  'https://ekobo.co/products/bamboo-kids-step-stool-lemon',
  'https://www.babybjorn.co.uk/products/bathroom/potty-chair/',
  'https://www.ikea.com/gb/en/p/lockig-childrens-potty-white-turquoise-40591581/',
  'https://www.babybjorn.co.uk/products/bathroom/smart-potty/',
  'https://www.johnlewis.com/my-carry-potty-travel-potty-dino/p5521669',
  'https://www.boots.com/babybjorn-potty-chair-white-grey-10220695',
  'https://www.ikea.com/gb/en/p/sparka-soft-toy-football-mini-blue-red-20506758/',
  'https://www.ikea.com/gb/en/p/sparka-soft-toy-football-green-70302645/',
  'https://www.decathlon.co.uk/p/mini-football-sunny-300-size-1-pastel-pink/146095/c174c344c227m8753526',
  'https://www.gompels.co.uk/soft-rugby-ball.html',
  'https://www.networldsports.co.uk/forza-foam-pe-balls.html',
  'https://littletoyhouse.co.uk/product/giant-45cm-mega-ball/',
  'https://www.ikea.com/gb/en/p/duktig-9-piece-soft-toy-food-set-60364995/',
  'https://www.ikea.com/gb/en/p/duktig-5-piece-toy-kitchen-utensil-set-multicolour-80130168/',
  'https://www.ikea.com/gb/en/p/uppstaa-shape-sorter-80319422/',
  'https://www.charlies.co.uk/melissa-doug-shape-sorting-cube/',
  'https://www.woodentoyshop.co.uk/products/bigjigs-toys-wooden-chunky-lift-out-puzzle-farm-animals',
  'https://www.penguin.co.uk/books/108934/dear-zoo-by-campbell-rod/9780230747890',
  'https://www.penguin.co.uk/books/317914/the-colour-monster-by-llenas-anna/9781787412736',
  'https://www.hachettechildrens.co.uk/titles/kes-gray/oi-frog/9781444910865/',
  'https://www.hachettechildrens.co.uk/titles/rachel-bright/dino-feelings-happy/9781444967111/',
  'https://www.penguin.co.uk/books/312672/ten-minutes-to-bed-little-dinosaur-by-fielding-rhiannon/9780241532676',
  'https://www.penguin.co.uk/books/108935/goodnight-moon-by-brown-margaret-wise/9781509831975',
  'https://uk.bookshop.org/p/books/press-here-herve-tullet/6458474',
  'https://www.panmacmillan.com/authors/julia-donaldson/frog-s-day-out/9781035006885',
  'https://www.penguin.co.uk/books/57304/each-peach-pear-plum-by-ahlberg-janet/9780140506396',
  'https://www.penguin.co.uk/books/111124/peepo-by-ahlberg-janet/9780141337425',
  'https://www.penguin.co.uk/books/305040/you-choose-by-goodhart-pippa/9780141379319',
  'https://www.amazon.co.uk/dp/B087F8T3S1',
  'https://www.amazon.co.uk/OXO-Tot-Step-Stool-White/dp/B0759QF6T2',
  'https://www.amazon.co.uk/Pourty-Easy-Pour-Potty-White/dp/B003V1W2R0',
];

for (const u of urls) {
  try {
    const s = await checkUrl(u);
    let a;
    try {
      a = await checkAvailability(u);
    } catch (e) {
      a = { unavailable: true, reason: `avail_err:${String(e.message).slice(0, 40)}` };
    }
    const short = u.replace(/^https?:\/\//, '').slice(0, 70);
    console.log(
      [
        s.ok ? 'OK' : 'FAIL',
        a.unavailable ? 'OOS' : 'IN',
        s.status ?? s.httpStatus ?? '?',
        String(a.reason || '-').slice(0, 40),
        short,
      ].join(' | '),
    );
  } catch (e) {
    console.log('ERR', String(e.message).slice(0, 60), u.slice(0, 50));
  }
}
