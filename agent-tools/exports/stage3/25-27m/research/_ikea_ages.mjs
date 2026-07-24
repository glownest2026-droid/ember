const urls = [
  'https://www.ikea.com/gb/en/p/duktig-5-piece-toy-kitchen-utensil-set-multicolour-80130168/',
  'https://www.ikea.com/gb/en/p/klappa-soft-toy-ball-multicolour-40372638/',
  'https://www.ikea.com/gb/en/p/klappa-soft-toy-ball-multicolour-30372639/',
  'https://www.ikea.com/gb/en/p/lekfull-soft-toy-ball-set-of-3-multicolour-90540209/',
  'https://www.ikea.com/gb/en/p/sparka-soft-toy-football-mini-blue-red-20506758/',
];

for (const url of urls) {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-GB' },
  });
  const html = await r.text();
  const ages = [...html.matchAll(/Recommended for ages from [^"<]+/gi)].map((m) => m[0]).slice(0, 3);
  const under = [...html.matchAll(/Not suitable for children under [^"<]+/gi)].map((m) => m[0]).slice(0, 3);
  const rating = (html.match(/"ratingValue":([\d.]+)/) || [])[1];
  const count = (html.match(/"reviewCount":(\d+)/) || [])[1];
  const title = ((html.match(/<title>([^<]+)/) || [])[1] || '').replace(/\s+/g, ' ').slice(0, 70);
  console.log({ status: r.status, title, ages, under, rating, count });
}
