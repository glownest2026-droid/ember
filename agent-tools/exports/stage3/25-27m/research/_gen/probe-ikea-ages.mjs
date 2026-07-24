const urls = [
  'https://www.ikea.com/gb/en/p/duktig-9-piece-tea-set-80363966/',
  'https://www.ikea.com/gb/en/p/duktig-10-piece-cookware-set-60185745/',
  'https://www.ikea.com/gb/en/p/duktig-play-kitchen-white-20319974/',
  'https://www.ikea.com/gb/en/p/duktig-14-piece-vegetable-set-40185747/',
  'https://www.ikea.com/gb/en/p/duktig-24-piece-pizza-set-70363982/',
  'https://www.ikea.com/gb/en/p/duktig-6-piece-roll-set-50185751/',
];

for (const u of urls) {
  const r = await fetch(u, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      accept: 'text/html',
      'accept-language': 'en-GB',
    },
    redirect: 'follow',
  });
  const t = await r.text();
  const title = (t.match(/<title[^>]*>([^<]+)/i) || [])[1]?.replace(/\s+/g, ' ').trim().slice(0, 100);
  const ageLines = [];
  for (const re of [
    /"ageMin":\s*\d+/g,
    /"ageMax":\s*\d+/g,
    /suitable for[^"<]{0,60}/gi,
    /from \d+ year/gi,
    /not suitable for children under[^"<.]{0,40}/gi,
    /Recommended age[^"<]{0,40}/gi,
    /AGE\d+/g,
  ]) {
    const m = t.match(re);
    if (m) ageLines.push(...m.slice(0, 4));
  }
  const buy = /add.to.(bag|basket|cart)/i.test(t);
  const oos = /out of stock|temporarily out of stock/i.test(t);
  console.log(JSON.stringify({ s: r.status, buy, oos, title, age: [...new Set(ageLines)].slice(0, 8), u }));
}
