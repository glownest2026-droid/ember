import { smokeUrl } from '../../../../scripts/stage3-url-smoke.mjs';
import { checkUrlAvailability } from '../../../../scripts/stage3-availability-check.mjs';
import { ukMarketFailReasons } from '../../../../scripts/lib/stage3-uk-market.mjs';

const urls = [
  'https://www.fledglings.org.uk/products/doidy-cup',
  'https://growingsmiles.co.uk/shop/doidy-cup/',
  'https://ebebek.co.uk/products/doidy-cup-3/',
  'https://www.munchkin.co.uk/products/miracle-360-sippy-cup-7oz-207ml',
  'https://www.boots.com/tommee-tippee-explora-first-cup-2-pack-10202518',
  'https://www.boots.com/tommee-tippee-first-cup-10202516',
  'https://www.boots.com/doidy-cup-10150006',
  'https://toytastic.co.uk/product/cerda-bing-wax-crayons/',
  'https://uk.bookshop.org/p/books/my-first-words-let-s-get-talking-dk/9780241533376',
];

for (const url of urls) {
  const uk = ukMarketFailReasons(url, { priceText: '£5.99' });
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
  console.log(avail.buyable ? 'BUYABLE' : String(avail.product_status || 'UNK').toUpperCase(), url);
}
