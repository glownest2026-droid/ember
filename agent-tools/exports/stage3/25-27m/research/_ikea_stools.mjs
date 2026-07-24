const urls = [
  'https://www.ikea.com/gb/en/p/trogen-childrens-step-stool-yellow-80371520/',
  'https://www.ikea.com/gb/en/p/bolmen-step-stool-white-70574429/',
  'https://www.ikea.com/gb/en/p/flisat-childrens-stool-pine-30596536/',
  'https://www.ikea.com/gb/en/p/foersiktig-childrens-stool-white-pink-00591319/',
  'https://www.ikea.com/gb/en/p/duktig-14-piece-vegetables-set-10185748/',
];
for (const url of urls) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-GB' } });
  const html = await r.text();
  const title = ((html.match(/<title>([^<]+)/) || [])[1] || '').replace(/\s+/g, ' ').slice(0, 70);
  const ages = [...html.matchAll(/Recommended for ages from [^."<]+/gi)].map((m) => m[0]);
  const under = [...html.matchAll(/Not suitable for children under [^."<]+/gi)].map((m) => m[0]);
  const rating = (html.match(/"ratingValue":([\d.]+)/) || [])[1];
  const count = (html.match(/"reviewCount":(\d+)/) || [])[1];
  const price = (html.match(/"price":([\d.]+)/) || [])[1];
  console.log({ title, ages: ages[0], under: under[0], rating, count, price });
}
