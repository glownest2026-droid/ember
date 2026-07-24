const urls = [
  'https://www.ikea.com/gb/en/p/uppsta-shape-sorter-multicolour-90592088/',
  'https://www.ikea.com/gb/en/p/duktig-3-piece-tea-playset-mixed-colours-20499989/',
  'https://www.ikea.com/gb/en/p/duktig-8-piece-cup-saucer-playset-mixed-colours-10490244/',
  'https://www.ikea.com/gb/en/p/duktig-5-piece-toy-kitchen-utensil-set-multicolour-80130168/',
  'https://www.elc.co.uk/baby/activity-toys/VTech-My-First-Football-Friend-Musical-Football/p/568800',
  'https://www.vtech.co.uk/toys-by-age/12-36-months/my-first-football-friend/',
];

for (const url of urls) {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-GB' },
  });
  const html = await r.text();
  const title = ((html.match(/<title>([^<]+)/) || [])[1] || '').replace(/\s+/g, ' ').slice(0, 70);
  const ages = [...html.matchAll(/Recommended for ages from [^."<]+/gi)].map((m) => m[0]);
  const under = [...html.matchAll(/(?:Not suitable|hazardous to children under)[^."<]{0,40}/gi)].map(
    (m) => m[0],
  );
  const rating = (html.match(/"ratingValue":([\d.]+)/) || [])[1];
  const count = (html.match(/"reviewCount":(\d+)/) || [])[1];
  const price = (html.match(/"price":([\d.]+)/) || [])[1];
  console.log({
    status: r.status,
    title,
    ages: ages[0],
    under: under[0],
    rating,
    count,
    price,
  });
}
