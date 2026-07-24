import { smokeUrl } from '../../../../scripts/stage3-url-smoke.mjs';
import { checkUrlAvailability } from '../../../../scripts/stage3-availability-check.mjs';

const urls = [
  'https://www.argos.co.uk/product/9470497', // guess
  'https://www.argos.co.uk/search/crayola-my-first/',
  'https://www.boots.com/crayola-my-first-washable-crayons-8-pack-10289001',
  'https://www.boots.com/crayola-my-first-jumbo-crayons',
  'https://www.johnlewis.com/crayola-my-first-jumbo-crayons/p123456',
  'https://www.ikea.com/gb/en/p/mala-drawing-paper-roll-70423333/',
  'https://www.ikea.com/gb/en/p/mala-felt-tip-pen-assorted-colours-70423334/',
  'https://www.ikea.com/gb/en/p/mala-crayon-assorted-colours-70423335/',
  'https://www.smythstoys.com/uk/en-gb/toys/arts-and-crafts/crayons-and-pastels/crayola-my-first-tripod-grip-crayons/p/203441',
  'https://www.smythstoys.com/uk/en-gb/toys/arts-and-crafts/painting-and-drawing/ses-creative-my-first-fingerpaint/p/180001',
  'https://www.smythstoys.com/uk/en-gb/search/?text=ses%20my%20first%20colourball',
  'https://toytastic.co.uk/product/moxy-colouring-case-86-piece-fsc-wood/',
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
