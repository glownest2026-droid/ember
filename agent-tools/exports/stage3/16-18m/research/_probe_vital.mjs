import { smokeUrl } from '../../../../scripts/stage3-url-smoke.mjs';
import { checkUrlAvailability } from '../../../../scripts/stage3-availability-check.mjs';
import { ukMarketFailReasons } from '../../../../scripts/lib/stage3-uk-market.mjs';

const urls = [
  'https://www.johnlewis.com/vital-baby-hydrate-free-flow-cup-200ml-natural-stone/p112856635',
  'https://www.johnlewis.com/vital-baby-hydrate-free-flow-cup-200ml-natural-moss/p112856634',
  'https://www.superdrug.com/baby/sippy-cups/vital-baby-hydrate-free-flow-cup/p/850654',
  'https://www.ocado.com/products/vital-baby-hydrate-free-flow-cup-natural-moss-658280011',
  'https://vitalbaby.com/products/445081',
  'https://www.munchkin.co.uk/products/miracle-360-sippy-cup-7oz-207ml',
  'https://growingsmiles.co.uk/shop/doidy-cup/',
];

for (const url of urls) {
  const uk = ukMarketFailReasons(url, { priceText: '£2.49' });
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
