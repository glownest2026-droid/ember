const UA = 'EmberStage3Availability/1.0';
const searches = [
  'https://www.ikea.com/gb/en/search/?q=mala%20crayon',
  'https://www.ikea.com/gb/en/search/?q=M%C3%85LA%20crayon',
  'https://www.ikea.com/gb/en/cat/drawing-painting-st003/',
];

for (const url of searches) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' }, redirect: 'follow' });
  const html = await res.text();
  console.log('\n===', res.status, url);
  const title = ((html.match(/<title[^>]*>([^<]+)/i) || [])[1] || '').slice(0, 80);
  console.log('title', title);
  const links = [...html.matchAll(/href="(https:\/\/www\.ikea\.com\/gb\/en\/p\/[^"]+)"/g)]
    .map((m) => m[1])
    .filter((h, i, a) => a.indexOf(h) === i)
    .slice(0, 20);
  for (const l of links) console.log(l);
}

// Also confirm Smyths titles via availability UA
const smyths = [
  'https://www.smythstoys.com/uk/en-gb/toys/arts-and-crafts/crayons-and-pastels/crayola-my-first-jumbo-crayons-8-pack/p/195185',
  'https://www.smythstoys.com/uk/en-gb/toys/arts-and-crafts/crayons-and-pastels/crayola-my-first-washable-crayons/p/189012',
];
for (const url of smyths) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' }, redirect: 'follow' });
  const html = await res.text();
  const title = ((html.match(/<title[^>]*>([^<]+)/i) || [])[1] || '').replace(/\s+/g, ' ').trim().slice(0, 120);
  console.log('\nSMYTHS', res.status, title);
  console.log(url);
}
