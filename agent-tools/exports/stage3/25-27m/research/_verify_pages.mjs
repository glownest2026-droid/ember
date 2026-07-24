const urls = [
  'https://www.smythstoys.com/uk/en-gb/toys/preschool/educational-toys/melissa-and-doug-shape-sorting-cube/p/159210',
  'https://www.smythstoys.com/uk/en-gb/toys/preschool/role-play-and-dress-up/kitchens-and-shops/learning-resources-new-sprouts-cook-it/p/186200',
  'https://www.smythstoys.com/uk/en-gb/toys/preschool/role-play-and-dress-up/kitchens-and-shops/chad-valley-wooden-table-top-mini-kitchen/p/191234',
  'https://www.smythstoys.com/uk/en-gb/toys/baby-toys/nursery/babybjorn-step-stool/p/186212',
  'https://www.smythstoys.com/uk/en-gb/toys/outdoor-toys/balls-and-rackets/soft-foam-football/p/186210',
  'https://www.sportsdirect.com/sports-directory-foam-football-857872',
  'https://www.bigjigstoys.co.uk/products/wooden-shape-puzzle',
];

for (const url of urls) {
  const r = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-GB',
    },
  });
  const html = await r.text();
  const title = (html.match(/<title[^>]*>([^<]+)</i) || [])[1] || '';
  const bot = /pardon our interruption|are you a bot|access denied|imperva/i.test(html);
  const price = (html.match(/£\s?\d+(?:\.\d{2})?/) || [])[0] || '';
  const age = (html.match(/Ages?\s*\d+\+?|suitable from[^.<]{0,40}|Not suitable[^.<]{0,40}/i) || [])[0] || '';
  console.log({
    status: r.status,
    bot,
    title: title.replace(/\s+/g, ' ').slice(0, 80),
    price,
    age: String(age).replace(/\s+/g, ' ').slice(0, 60),
    len: html.length,
    url: url.slice(-50),
  });
}
