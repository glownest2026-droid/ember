const urls = [
  'https://www.ikea.com/gb/en/p/duktig-5-piece-toy-kitchen-utensil-set-multicolour-80130168/',
  'https://www.ikea.com/gb/en/p/duktig-play-kitchen-birch-60319972/',
  'https://www.ikea.com/gb/en/p/foersiktig-childrens-stool-white-turquoise-10591318/',
  'https://www.ikea.com/gb/en/p/sparka-soft-toy-football-green-70302645/',
  'https://www.boots.com/babybjorn-smart-potty-white-grey-10220700',
  'https://www.boots.com/babybjorn-potty-chair-white-grey-10220695',
  'https://www.babybjorn.co.uk/products/bathroom/smart-potty/',
  'https://www.babybjorn.co.uk/products/bathroom/potty-chair/',
  'https://www.charlies.co.uk/melissa-doug-shape-sorting-cube/',
];

function pick(html, re, n = 10) {
  return [...html.matchAll(re)].map((m) => m[0].replace(/\s+/g, ' ').trim()).slice(0, n);
}

for (const url of urls) {
  const r = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-GB',
    },
  });
  const html = await r.text();
  const jsonLd = pick(html, /"ratingValue"\s*:\s*"?[\d.]+"?|"reviewCount"\s*:\s*"?\d+"?/g, 12);
  const ages = pick(
    html,
    /(?:Recommended for ages|suitable from|Ages?|Not suitable for children under|Min\.?\s*Age)[^<]{0,90}/gi,
    8,
  );
  const price = pick(html, /"price"\s*:\s*"?[\d.]+"?|£\s?\d+(?:\.\d{2})?/g, 6);
  const buy = pick(html, /Add to (?:basket|bag|cart)|out of stock|sold out|in stock/gi, 6);
  console.log('\n===', r.status, url.split('/').slice(-2).join('/'));
  console.log('jsonLd', jsonLd);
  console.log('ages', ages);
  console.log('price', price);
  console.log('buy', buy);
}
