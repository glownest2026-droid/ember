import { smokeUrl } from '../../../../scripts/stage3-url-smoke.mjs';
import { checkUrlAvailability } from '../../../../scripts/stage3-availability-check.mjs';
import { ukMarketFailReasons } from '../../../../scripts/lib/stage3-uk-market.mjs';

const urls = [
  // ramp
  'https://toytastic.co.uk/product/quercetti-flipcar-racetrack/',
  'https://toytastic.co.uk/product/quercetti-migoga-tower-sound/',
  'https://toytastic.co.uk/product/quercetti-spiral-tower-06501/',
  'https://www.adventuretoys.co.uk/scrunch-ball/',
  'https://www.adventuretoys.co.uk/big-jigs-activity-balls/',
  'https://toytastic.co.uk/product/les-deglingos-activity-ball-melimelos-the-deer/',
  // dolls
  'https://www.adventuretoys.co.uk/corolle-miss-floral-sweet-dreams-soft-doll/',
  'https://www.adventuretoys.co.uk/corolle-miss-blandine-sweet-hearts/',
  'https://www.adventuretoys.co.uk/corolle-babipouce-floral-bloom/',
  'https://toytastic.co.uk/product/goki-dolls-bed/',
  'https://toytastic.co.uk/product/goki-dolls-cradle/',
  // crayons
  'https://toytastic.co.uk/product/ses-creative-my-first-colourball/',
  'https://toytastic.co.uk/product/ses-creative-my-first-crayon-beads/',
  'https://toytastic.co.uk/product/ses-creative-my-first-fingerpaint/',
  'https://toytastic.co.uk/product/ses-creative-my-first-fingerpaint-4-colours/',
  // cups
  'https://www.boots.com/doidy-cup-10150006',
  'https://www.boots.com/tommee-tippee-explora-first-cup-2-pack-10202518',
  'https://www.boots.com/tommee-tippee-first-cup-10202516',
  'https://www.boots.com/nuby-no-spill-easy-grip-trainer-cup-10220690',
  'https://www.boots.com/philips-avent-natural-response-trainer-cup-150ml-10275508',
  // books
  'https://priddybooks.com/gb/books/first-100-words/',
  'https://priddybooks.com/gb/books/first-100-animals/',
  'https://priddybooks.com/gb/books/hello-baby-faces/',
  'https://priddybooks.com/gb/books/see-touch-feel-words/',
  'https://www.penguin.co.uk/books/313409/baby-touch-faces-a-black-and-white-book-by-ladybird/9780241391723',
  'https://uk.bookshop.org/p/books/baby-touch-words-ladybird/9780241361634',
  'https://www.penguin.co.uk/books/111111/baby-touch-words-by-ladybird/9780241361634',
  'https://barefootbooks.com/uk/babys-first-words/',
  'https://www.penguin.co.uk/books/451935/my-first-words-lets-get-talking-by-dk/9780241533376',
];

for (const url of urls) {
  const uk = ukMarketFailReasons(url, { priceText: '£9.99' });
  if (uk.length) {
    console.log('UKFAIL', uk.join(','), url);
    continue;
  }
  try {
    const smoke = await smokeUrl(url);
    if (!smoke.url_ok) {
      console.log('SMOKEFAIL', smoke.http_status || smoke.error, url);
      continue;
    }
    const avail = await checkUrlAvailability(url);
    console.log(
      avail.buyable ? 'BUYABLE' : String(avail.product_status || 'UNK').toUpperCase(),
      avail.http_status,
      url,
    );
  } catch (e) {
    console.log('ERR', e.message, url);
  }
}
