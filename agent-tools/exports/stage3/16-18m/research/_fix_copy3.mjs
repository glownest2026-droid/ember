import fs from 'node:fs';

const care = 'agent-tools/exports/stage3/16-18m/research/_build_care_art_cups.mjs';
const books = 'agent-tools/exports/stage3/16-18m/research/_build_books.mjs';

let a = fs.readFileSync(care, 'utf8');
a = a.replace(/clean-up/g, 'clean up');
a = a.replace(/non-washable/g, 'non washable');
fs.writeFileSync(care, a);

let b = fs.readFileSync(books, 'utf8');
b = b.replace(/hole-peeping/g, 'hole peeping');
fs.writeFileSync(books, b);

console.log('ok');
