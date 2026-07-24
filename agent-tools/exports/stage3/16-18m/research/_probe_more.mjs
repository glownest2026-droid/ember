import { smokeUrl } from '../../../../scripts/stage3-url-smoke.mjs';
import { checkUrlAvailability } from '../../../../scripts/stage3-availability-check.mjs';
import { ukMarketFailReasons } from '../../../../scripts/lib/stage3-uk-market.mjs';

const urls = [
  // more dolls / care
  'https://www.adventuretoys.co.uk/corolle-mon-premier-bebe-calín/',
  'https://www.adventuretoys.co.uk/search?q=corolle',
  'https://toytastic.co.uk/?s=corolle&post_type=product',
  'https://toytastic.co.uk/product/corolle-mon-doudou-babipouce/',
  'https://www.adventuretoys.co.uk/corolle-babipouce/',
  'https://www.adventuretoys.co.uk/manhattan-toy-baby-stella/',
  'https://toytastic.co.uk/product/goki-soft-doll/',
  'https://toytastic.co.uk/?s=doll&post_type=product',
  // crayons more
  'https://toytastic.co.uk/product/ses-creative-my-first-colouring-with-water/',
  'https://toytastic.co.uk/?s=crayon&post_type=product',
  'https://www.adventuretoys.co.uk/ses-creative-my-first-colourball/',
  'https://www.adventuretoys.co.uk/?s=crayon',
  'https://www.boots.com/search?q=chunky+crayon',
  // cups free-flow
  'https://www.boots.com/search?q=doidy',
  'https://www.boots.com/munchkin-miracle-360-trainer-cup-207ml-10220685',
  'https://www.boots.com/tommee-tippee-explora-easy-drink-cup',
  // books more
  'https://priddybooks.com/gb/books/first-100-trucks/',
  'https://priddybooks.com/gb/books/first-100-soft-to-touch/',
  'https://priddybooks.com/gb/books/take-a-peek-words/',
  'https://priddybooks.com/gb/books/bright-baby-words/',
  'https://www.penguin.co.uk/books/289967/faces-baby-touch-first-focus-by-ladybird/9780241243251',
  'https://www.penguin.co.uk/search?q=baby+touch+words',
  'https://www.penguin.co.uk/books/284567/the-very-hungry-caterpillar-s-first-100-words-by-eric-carle/9780241547724',
  'https://www.penguin.co.uk/books/111222/spots-first-words-by-eric-hill/9780241411193',
  'https://www.penguin.co.uk/books/313410/peppa-s-first-100-words-by-peppa-pig/9780241481233',
  'https://barefootbooks.com/uk/global-babies/',
  'https://barefootbooks.com/uk/baby-s-first-words/',
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
