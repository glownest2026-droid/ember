const urls = [
  'https://www.ikea.com/gb/en/p/duktig-3-piece-tea-playset-mixed-colours-40319973/',
  'https://www.ikea.com/gb/en/p/duktig-8-piece-cup-saucer-playset-mixed-colours-00185746/',
  'https://www.ikea.com/gb/en/p/duktig-9-piece-toy-kitchen-accessories-set-multicolour-80185745/',
  'https://www.ikea.com/gb/en/p/duktig-24-piece-pizza-set-pizza-multicolour-00469833/',
  'https://www.ikea.com/gb/en/p/lekfull-10-piece-toy-fruit-set-multicolour-20540208/',
  'https://www.ikea.com/gb/en/p/mula-building-beakers-multicolour-30294888/',
  'https://www.ikea.com/gb/en/p/mula-shape-sorter-beech-multicolour-30294889/',
  'https://www.ikea.com/gb/en/p/undervisa-puzzle-game-shapes-and-numbers-40365187/',
  'https://www.ikea.com/gb/en/p/sparka-soft-toy-football-green-70302645/',
  'https://www.ikea.com/gb/en/p/foersiktig-childrens-stool-white-turquoise-10591318/',
];

for (const url of urls) {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-GB' },
  });
  const html = await r.text();
  const title = ((html.match(/<title>([^<]+)/) || [])[1] || '').replace(/\s+/g, ' ').slice(0, 75);
  const ages = [...html.matchAll(/Recommended for ages from [^."<]+/gi)].map((m) => m[0]);
  const under = [...html.matchAll(/contains small parts hazardous to children under [^."<]+/gi)].map(
    (m) => m[0],
  );
  const rating = (html.match(/"ratingValue":([\d.]+)/) || [])[1];
  const count = (html.match(/"reviewCount":(\d+)/) || [])[1];
  const price = (html.match(/"price":([\d.]+)/) || [])[1];
  const real = !/Discover Our Full Range/i.test(title);
  console.log({ real, title, ages: ages[0], under: under[0], rating, count, price });
}
