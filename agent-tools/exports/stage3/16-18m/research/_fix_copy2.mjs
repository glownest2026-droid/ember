import fs from 'node:fs';

const care = 'agent-tools/exports/stage3/16-18m/research/_build_care_art_cups.mjs';
const books = 'agent-tools/exports/stage3/16-18m/research/_build_books.mjs';

let a = fs.readFileSync(care, 'utf8');
a = a.replace(/one-tool/g, 'one tool');
a = a.replace(/care loop/g, 'care pattern');
fs.writeFileSync(care, a);

let b = fs.readFileSync(books, 'utf8');
b = b.replace(
  /short story shaped naming pattern with flaps/g,
  'short story style naming pattern with flaps',
);
b = b.replace(/story shape/g, 'story style');
b = b.replace(/story-shaped/g, 'story style');
fs.writeFileSync(books, b);

console.log('patched');
