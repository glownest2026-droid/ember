import { smokeUrl } from '../../../../scripts/stage3-url-smoke.mjs';
import { checkUrlAvailability } from '../../../../scripts/stage3-availability-check.mjs';

const urls = [
  'https://toytastic.co.uk/product/geomag-magicube-full-colour-recycled-24-pieces/',
  'https://www.smythstoys.com/uk/en-gb/toys/arts-and-crafts/crayons-and-pastels/crayola-my-first-jumbo-crayons-8-pack/p/195185',
  'https://www.smythstoys.com/uk/en-gb/toys/arts-and-crafts/crayons-and-pastels/crayola-my-first-washable-crayons/p/189012',
  'https://www.smythstoys.com/uk/en-gb/toys/arts-and-crafts/crayons-and-pastels/crayola-my-first-tripod-grip-crayons/p/203441',
  'https://www.boots.com/crayola-my-first-washable-crayons-8-pack-10289001',
  // more bookshop first-word
  'https://uk.bookshop.org/p/books/baby-touch-colours-ladybird/9780241288382',
  'https://uk.bookshop.org/p/books/spot-goes-to-the-farm-eric-hill/9780723263708',
  'https://uk.bookshop.org/p/books/global-babies-the-global-fund-for-children/9781580891745',
  'https://uk.bookshop.org/p/books/that-s-not-my-dinosaur-fiona-watt/9781474916222',
  'https://www.penguin.co.uk/books/451935/my-first-words-lets-get-talking-by-dk/9780241533376',
];

for (const url of urls) {
  const smoke = await smokeUrl(url);
  if (!smoke.url_ok) {
    console.log('SMOKEFAIL', smoke.http_status || smoke.error, url);
    continue;
  }
  // title check with same UA as smoke if possible - just report buyable
  const avail = await checkUrlAvailability(url);
  console.log(avail.buyable ? 'BUYABLE' : String(avail.product_status || 'UNK').toUpperCase(), url);
}
