import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const Q = path.join(__dirname, 'quarantine');
const IN = path.join(__dirname, 'inbox');

function words(s) {
  return String(s || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function bump(file, rank, why) {
  const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
  const p = doc.top_picks.find((x) => x.rank === rank);
  p.ember_verdict = why;
  const w = words(why);
  if (w < 40 || w > 60) throw new Error(`${p.product_name} ${w}`);
  fs.writeFileSync(path.join(IN, path.basename(file)), JSON.stringify(doc, null, 2));
  console.log('fixed', p.product_name, w);
}

const booksQ = path.join(Q, 'ember_picks_16-18m_cat_first_word_picture_books.json');
const booksIn = path.join(IN, 'ember_picks_16-18m_cat_first_word_picture_books.json');
const books = fs.existsSync(booksQ) ? booksQ : booksIn;

bump(
  books,
  7,
  'Touch patches keep describing words going when photo catalogues lose them. Dinosaur pages give a different theme from everyday object lists on the sofa. Choose when Ladybird touch books already cover one line and you want Usborne style texture naming.',
);
bump(
  books,
  9,
  'Texture pages buy you another minute of attention when plain photos lose them. See, Touch, Feel First Words keeps labels simple while fingers stay busy on the page. Best as the second Priddy when First 100 Words already covers photo pointing.',
);
bump(
  books,
  10,
  'Describing words arrive beside object names when fingers meet a patch. That’s Not My Puppy keeps the pattern short and familiar on the sofa. Choose when Dinosaur already covers one touchy feely theme and you want a puppy version too.',
);

const cupsQ = path.join(Q, 'ember_picks_16-18m_cat_open_cup.json');
const cupsIn = path.join(IN, 'ember_picks_16-18m_cat_open_cup.json');
const cups = fs.existsSync(cupsQ) ? cupsQ : cupsIn;
bump(
  cups,
  4,
  'Bag days do not always need a second full set on the shelf. This single First Cup covers travel or grandparent visits without another two pack. Choose after Explora already handles the kitchen and you only want one extra spout cup.',
);
