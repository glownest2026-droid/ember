const UA = 'Mozilla/5.0 (compatible; EmberStage3Research/1.0)';
const urls = [
  'https://www.ikea.com/gb/en/p/mala-crayon-assorted-colours-70423335/',
  'https://www.ikea.com/gb/en/p/mala-felt-tip-pen-assorted-colours-70423334/',
  'https://www.ikea.com/gb/en/p/mala-drawing-paper-roll-70423333/',
  'https://www.boots.com/crayola-my-first-washable-crayons-8-pack-10289001',
  'https://www.boots.com/crayola-my-first-jumbo-crayons',
  'https://www.smythstoys.com/uk/en-gb/toys/arts-and-crafts/crayons-and-pastels/crayola-my-first-jumbo-crayons-8-pack/p/195185',
  'https://www.smythstoys.com/uk/en-gb/toys/arts-and-crafts/crayons-and-pastels/crayola-my-first-washable-crayons/p/189012',
  'https://www.smythstoys.com/uk/en-gb/toys/arts-and-crafts/crayons-and-pastels/crayola-my-first-tripod-grip-crayons/p/203441',
];

for (const url of urls) {
  const res = await fetch(url, {
    headers: { 'user-agent': 'EmberStage3Availability/1.0', accept: 'text/html' },
    redirect: 'follow',
  });
  const html = await res.text();
  const title = ((html.match(/<title[^>]*>([^<]+)/i) || [])[1] || '').replace(/\s+/g, ' ').trim().slice(0, 100);
  const h1 = ((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
  const price = (html.match(/£\s?\d+[\.,]\d{2}/) || [])[0];
  const ageBits = [...html.matchAll(/(?:age|months|years|from)\s[^<.]{0,40}/gi)]
    .map((m) => m[0].replace(/\s+/g, ' ').trim())
    .slice(0, 5);
  console.log(res.status, price || '-', '|', title);
  console.log('  H1:', h1);
  if (ageBits.length) console.log('  age:', ageBits.join(' || '));
  console.log(' ', url);
}
