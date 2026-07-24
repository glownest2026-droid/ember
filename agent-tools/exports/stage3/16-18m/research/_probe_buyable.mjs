import { smokeUrl } from '../../../../scripts/stage3-url-smoke.mjs';
import { checkUrlAvailability } from '../../../../scripts/stage3-availability-check.mjs';
import { ukMarketFailReasons } from '../../../../scripts/lib/stage3-uk-market.mjs';

const urls = [
  // balls
  'https://www.smythstoys.com/uk/en-gb/toys/baby-and-toddler/baby-toys/bright-starts-oball-classic-ball/p/184109',
  'https://www.smythstoys.com/uk/en-gb/toys/baby-and-toddler/baby-toys/edushape-sensory-ball/p/189855',
  'https://www.smythstoys.com/uk/en-gb/toys/baby-and-toddler/baby-toys/infantino-sensory-balls/p/191234',
  'https://www.elc.co.uk/bright-starts-oball-classic/p/bright-starts-oball-classic',
  'https://www.theenterainer.com/bright-starts-oball-classic-10340/p',
  // stacking
  'https://www.smythstoys.com/uk/en-gb/toys/baby-and-toddler/baby-toys/hape-double-rainbow-stacker/p/178234',
  'https://www.galttoys.com/products/stacking-pyramid',
  'https://www.galttoys.com/products/pop-up-farm',
  'https://www.melissaanddoug.com/products/geometric-stacker',
  'https://www.melissaanddoug.com/products/stack-and-sort-board',
  'https://www.hape.com/uk/en_GB/double-rainbow-stacker/E0406.html',
  'https://www.elc.co.uk/search?q=rainbow+stacker',
  // ramp
  'https://toytastic.co.uk/product/quercetti-flipcar-racetrack/',
  'https://www.smythstoys.com/uk/en-gb/toys/preschool/vehicles/wooden-car-ramp/p/201111',
  'https://www.theenterainer.com/search?q=car+ramp',
  'https://www.elc.co.uk/search?q=car+ramp',
  // books
  'https://www.priddybooks.com/books/first-100-words/',
  'https://www.priddybooks.com/books/big-board-first-100-words/',
  'https://www.penguin.co.uk/books/451935/my-first-words-lets-get-talking-by-dk/9780241533376',
  'https://www.penguin.co.uk/search/my-first-words',
  'https://uk.bookshop.org/books/my-first-words-let-s-get-talking/9780241533376',
  'https://uk.bookshop.org/books/first-100-words/9781843322924',
  'https://www.orphans.co.uk/',
  // dolls
  'https://www.smythstoys.com/uk/en-gb/toys/dolls/baby-dolls/baby-annabell-my-first-annabell/p/188001',
  'https://www.theenterainer.com/baby-annabell-my-first/p',
  'https://www.elc.co.uk/baby-annabell',
  'https://www.smythstoys.com/uk/en-gb/search/?text=baby+stella',
  'https://www.hamleys.com/manhattan-toy-baby-stella',
  // crayons
  'https://www.smythstoys.com/uk/en-gb/toys/arts-and-crafts/crayons-and-pastels/crayola-my-first-jumbo-crayons-8-pack/p/195185',
  'https://www.smythstoys.com/uk/en-gb/toys/arts-and-crafts/crayons-and-pastels/crayola-my-first-jumbo-crayons-24-pack/p/195186',
  'https://www.elc.co.uk/crayola-my-first',
  // cups
  'https://www.boots.com/doidy-cup-10150006',
  'https://www.boots.com/tommee-tippee-explora-first-cup-2-pack',
  'https://www.boots.com/munchkin-miracle-360-trainer-cup-207ml-10220685',
  'https://www.boots.com/philips-avent-natural-response-trainer-cup',
  'https://www.boots.com/nuk-first-choice-learner-cup',
];

for (const url of urls) {
  const uk = ukMarketFailReasons(url, { priceText: '£9.99' });
  if (uk.length) {
    console.log('UKFAIL', uk.join(','), url);
    continue;
  }
  const smoke = await smokeUrl(url);
  if (!smoke.url_ok) {
    console.log('SMOKEFAIL', smoke.http_status || smoke.error, url);
    continue;
  }
  const avail = await checkUrlAvailability(url);
  console.log(
    avail.buyable ? 'BUYABLE' : avail.product_status.toUpperCase(),
    avail.http_status,
    url,
  );
}
