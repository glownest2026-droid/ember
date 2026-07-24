import fs from 'node:fs';

const urls = [
  'https://www.ikea.com/gb/en/p/duktig-play-kitchen-birch-60319972/',
  'https://www.ikea.com/gb/en/p/duktig-9-piece-tea-set-30373166/',
  'https://www.ikea.com/gb/en/p/duktig-5-piece-toy-cookware-set-80185745/',
  'https://www.ikea.com/gb/en/p/duktig-10-piece-play-food-set-fruit-and-vegetables-80185741/',
  'https://www.ikea.com/gb/en/p/duktig-14-piece-vegetables-set-10185748/',
  'https://www.ikea.com/gb/en/p/duktig-play-kitchen-20364566/',
];

async function main() {
  for (const u of urls) {
    const r = await fetch(u, {
      headers: { 'user-agent': 'Mozilla/5.0', 'accept-language': 'en-GB' },
      redirect: 'follow',
    });
    const t = await r.text();
    const snippets = [];
    for (const re of [
      /not suitable for children under[^.<]{0,40}/gi,
      /from\s+\d+\s*years?/gi,
      /Ages?\s*\d+\+/gi,
      /ageMin["\s:]+(\d+)/gi,
      /recommendedAge[^,]{0,80}/gi,
      /"age"\s*:\s*"?\d+/gi,
    ]) {
      const m = t.match(re);
      if (m) snippets.push(...m.slice(0, 3));
    }
    const buy = /add to bag/i.test(t);
    const price = (t.match(/£\d+\.?\d*/g) || []).slice(0, 3);
    console.log('\n', r.status, buy, price.join(','), u.split('/').filter(Boolean).pop());
    console.log('  ages:', [...new Set(snippets)].slice(0, 10).join(' || '));
  }
}
main();
