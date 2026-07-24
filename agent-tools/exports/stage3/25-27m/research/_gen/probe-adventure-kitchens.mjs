await new Promise((r) => setTimeout(r, 1000));
const urls = [
  'https://www.adventuretoys.co.uk/wooden-toys/kitchens/',
  'https://www.adventuretoys.co.uk/indoor-toys/kitchens/',
  'https://www.adventuretoys.co.uk/search/?q=tidlo+fruit',
  'https://www.adventuretoys.co.uk/search/?q=plan+toys',
  'https://www.adventuretoys.co.uk/search/?q=orange+tree',
];
for (const u of urls) {
  try {
    const r = await fetch(u, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'accept-language': 'en-GB',
      },
      signal: AbortSignal.timeout(20000),
    });
    const t = await r.text();
    const title = (t.match(/<title[^>]*>([^<]+)/i) || [])[1]?.replace(/\s+/g, ' ').trim().slice(0, 80);
    const links = [...t.matchAll(/href="(\/[^"]+)"/g)]
      .map((m) => m[1])
      .filter((h) => /toaster|fruit|kitchen|food|tea|pot|tidlo|plan|orange|cook/i.test(h));
    console.log(JSON.stringify({ s: r.status, title, links: [...new Set(links)].slice(0, 20), u: u.slice(0, 70) }));
  } catch (e) {
    console.log(JSON.stringify({ err: e.message, u }));
  }
}
