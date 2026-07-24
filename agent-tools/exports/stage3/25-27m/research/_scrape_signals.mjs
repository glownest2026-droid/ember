/**
 * Fetch age/rating snippets from product pages for 25-27m research.
 */
const urls = [
  'https://www.ikea.com/gb/en/p/duktig-play-kitchen-birch-60319972/',
  'https://www.ikea.com/gb/en/p/foersiktig-childrens-stool-white-turquoise-10591318/',
  'https://www.ikea.com/gb/en/p/sparka-soft-toy-football-mini-blue-red-20506758/',
  'https://www.argos.co.uk/product/7658747',
  'https://www.scandiborn.co.uk/products/little-dutch-wooden-play-kitchen-mint',
  'https://www.smythstoys.com/uk/en-gb/toys/preschool/role-play-and-dress-up/kitchens-and-shops/kidkraft-vintage-kitchen-white/p/186193',
  'https://www.charlies.co.uk/melissa-doug-shape-sorting-cube/',
  'https://www.johnlewis.com/skip-hop-zoo-ready-set-roll-activity-ball-set/p3985433',
  'https://www.johnlewis.com/babybjorn-step-stool/p3392730',
  'https://www.boots.com/babybjorn-potty-chair-white-grey-10220695',
  'https://www.penguin.co.uk/books/317914/the-colour-monster-by-llenas-anna/9781787412736',
  'https://www.penguin.co.uk/books/108934/dear-zoo-by-campbell-rod/9780230747890',
  'https://uk.bookshop.org/p/books/press-here-herve-tullet/6458474',
];

const AGE_RE =
  /(?:suitable|ages?|age range|from|not suitable)[^.<]{0,80}?(?:\d+\s*(?:months?|years?|\+)|under\s+\d+)/gi;
const RATING_RE =
  /(?:ratingValue|reviewCount|out of 5|Average rating|customer reviews)[^0-9]{0,40}\d[\d.,]*/gi;

for (const url of urls) {
  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-GB,en;q=0.9',
        Accept: 'text/html',
      },
      redirect: 'follow',
    });
    const html = await r.text();
    const ages = [...html.matchAll(AGE_RE)].map((m) => m[0].replace(/\s+/g, ' ').trim()).slice(0, 8);
  const ratings = [...html.matchAll(RATING_RE)].map((m) => m[0].replace(/\s+/g, ' ').trim()).slice(0, 8);
    const price = (html.match(/£\s?\d+(?:\.\d{2})?/) || [])[0] || '';
    console.log('\n===', r.status, url);
    console.log('price', price);
    console.log('ages', ages);
    console.log('ratings', ratings);
  } catch (e) {
    console.log('\n=== ERR', url, e.message);
  }
}
