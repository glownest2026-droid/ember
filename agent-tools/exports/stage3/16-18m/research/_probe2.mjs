import { smokeUrl } from '../../../../scripts/stage3-url-smoke.mjs';
import { checkUrlAvailability } from '../../../../scripts/stage3-availability-check.mjs';
import { ukMarketFailReasons } from '../../../../scripts/lib/stage3-uk-market.mjs';

const urls = [
  'https://toytastic.co.uk/product/quercetti-flipcar-racetrack/',
  'https://toytastic.co.uk/?s=oball&post_type=product',
  'https://toytastic.co.uk/?s=stacking&post_type=product',
  'https://toytastic.co.uk/?s=crayon&post_type=product',
  'https://toytastic.co.uk/?s=doll&post_type=product',
  'https://www.adventuretoys.co.uk/',
  'https://www.woodentoyshop.co.uk/',
  'https://www.jaqueslondon.co.uk/',
  'https://www.orchardtoys.com/',
  'https://www.galttoys.com/',
  'https://www.learningresources.co.uk/',
  'https://www.donebydeer.com/uk/',
  'https://www.lovevery.co.uk/',
  'https://uk.bookshop.org/books/first-100-words/9781843322924',
  'https://uk.bookshop.org/search?keywords=first+words+board',
  'https://www.penguin.co.uk/books/111/111/my-first-words-lets-get-talking-by-dk/9780241533376',
  'https://www.dk.com/uk/book/9780241533376-my-first-words-lets-get-talking/',
  'https://www.priddybooks.com/books/first-100-words/',
  'https://www.ikea.com/gb/en/p/sandbi-soft-toy-ball-multicolour-70564473/',
  'https://www.ikea.com/gb/en/cat/baby-toys-45525/',
  'https://www.dunelm.com/product/soft-balls',
  'https://www.notonthehighstreet.com/search?term=soft+ball+baby',
  'https://www.hamleys.com/toys/baby-and-preschool',
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
  console.log(avail.buyable ? 'BUYABLE' : avail.product_status.toUpperCase(), avail.http_status, url);
}
