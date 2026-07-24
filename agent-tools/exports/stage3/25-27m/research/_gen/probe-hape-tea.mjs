const r = await fetch('https://www.adventuretoys.co.uk/hape-tea-set-for-two/', {
  headers: {
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'accept-language': 'en-GB',
  },
});
const t = await r.text();
const idx = t.toLowerCase().indexOf('age');
console.log('status', r.status, 'len', t.length);
// pull product description region
const m = t.match(/About the[\s\S]{0,1200}/i);
console.log(m?.[0]?.replace(/\s+/g, ' ').slice(0, 500));
const ages = t.match(/Age[:\s]*\d+[\s\S]{0,20}|from\s+\d+\s*years?|Years And Older|\d\s*\+\s*years?/gi);
console.log('ages', ages);
const plain = t.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
console.log('plain age hits', plain.match(/Age .{0,30}|years?.{0,10}|months?.{0,10}/gi)?.slice(0, 20));
