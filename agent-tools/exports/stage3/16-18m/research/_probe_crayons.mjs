import { smokeUrl } from '../../../../scripts/stage3-url-smoke.mjs';
import { checkUrlAvailability } from '../../../../scripts/stage3-availability-check.mjs';

const urls = [
  'https://www.smythstoys.com/uk/en-gb/toys/arts-and-crafts/crayons-and-pastels/crayola-my-first-jumbo-crayons-8-pack/p/195185',
  'https://www.smythstoys.com/uk/en-gb/toys/arts-and-crafts/crayons-and-pastels/crayola-my-first-washable-crayons/p/189012',
  'https://www.theenterainer.com/crayola-my-first-jumbo-crayons-8-pk/p',
  'https://www.elc.co.uk/crayola-my-first-chunky-crayons/mp/80001',
  'https://www.galttoys.com/products/first-crayons',
  'https://www.galttoys.com/products/chunky-crayons',
  'https://www.galttoys.com/products/early-years-finger-paints',
  'https://toytastic.co.uk/product/ses-creative-my-first-fingerpaint-4-pack/',
  'https://toytastic.co.uk/product/ses-creative-my-first-colouring-with-water-dinos/',
  'https://www.adventuretoys.co.uk/ses-my-first-colourball/',
  'https://www.adventuretoys.co.uk/stockmar-stick-crayons/',
  'https://www.adventuretoys.co.uk/?s=crayon+chunky',
  'https://www.adventuretoys.co.uk/?s=stockmar',
  'https://www.adventuretoys.co.uk/?s=galt+crayon',
  'https://toytastic.co.uk/?s=stockmar&post_type=product',
  'https://toytastic.co.uk/?s=lyra&post_type=product',
  'https://toytastic.co.uk/?s=crayola&post_type=product',
];

for (const url of urls) {
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
