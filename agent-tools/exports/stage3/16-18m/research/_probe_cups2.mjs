import { smokeUrl } from '../../../../scripts/stage3-url-smoke.mjs';
import { checkUrlAvailability } from '../../../../scripts/stage3-availability-check.mjs';

const urls = [
  'https://www.boots.com/vital-baby-nourishtoddlers-open-cup-10289000',
  'https://www.boots.com/beaba-360-learning-cup',
  'https://www.boots.com/nuby-no-spill-easy-grip-trainer-cup-10220690',
  'https://www.boots.com/philips-avent-natural-response-trainer-cup-150ml-10275508',
  'https://www.boots.com/tommee-tippee-explora-easy-drink-cup',
  'https://www.johnlewis.com/doidy-cup/p2319486',
  'https://www.johnlewis.com/brand/doidy/c5000023',
  'https://www.smythstoys.com/uk/en-gb/toys/baby-and-toddler/feeding/doidy-cup/p/189999',
  'https://www.very.co.uk/doidy-cup/1600123456.prd',
  'https://www.amazon.co.uk/dp/B0000C67X1', // classic doidy - likely bot wall
];

for (const url of urls) {
  try {
    const smoke = await smokeUrl(url);
    if (!smoke.url_ok) {
      console.log('SMOKEFAIL', smoke.http_status || smoke.error, url);
      continue;
    }
    const avail = await checkUrlAvailability(url);
    console.log(avail.buyable ? 'BUYABLE' : String(avail.product_status || 'UNK').toUpperCase(), url);
  } catch (e) {
    console.log('ERR', e.message, url);
  }
}
