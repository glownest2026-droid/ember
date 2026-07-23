/**
 * Upgrade 34–36m green Top Pick descriptions to Writing Guidelines
 * single Description rule: 20–40 words (field: product_description_under_30_words).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const greenDir = path.join(root, 'agent-tools', 'exports', 'stage3', '34-36m', 'research', 'green');

function wordCount(s) {
  return String(s || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

/** @type {Record<string, Record<number, string>>} */
const DESC = {
  cat_picture_story_books: {
    1: 'A picture book packed with choices on every page, inviting your child to pick, point and explain as you read together at bedtime or on the sofa.',
    2: 'A sturdy board book where the cheeky pigeon keeps asking to drive the bus, and your child gets to say no and explain why on every spread.',
    3: 'A board book where lovable George asks what he should do next, and whether he will get it right this time, turning each page into a gentle prediction game.',
    4: 'A quieter board book about a careful plan that does not quite work out, inviting your child to notice what went wrong and what might work better.',
    5: 'A light, repeatable rhyme about looking for a shark in the park, short enough for tired evenings and playful enough to answer again and again.',
  },
  cat_small_world_figures: {
    1: 'A chunky red London bus with seats for little people, made for loading passengers, driving somewhere, tipping them out and starting the journey all over again.',
    2: 'A PLAYMOBIL Junior airport shuttle with figures sized for little hands, ready for holiday and travel stories about getting on, going and coming back.',
    3: 'A PLAYMOBIL Junior helper set with doctor, fire and police figures, for pretend stories where someone needs looking after and kindness is part of the play.',
    4: 'A PLAYMOBIL Junior dump truck with one clear figure, made for load, tip, stack and go-back play that turns into little work trips with a beginning and an end.',
    5: 'Chunky LEGO DUPLO construction vehicles to build, drive and rebuild, with sturdy pieces that leave plenty of room for your child to invent their own job stories.',
  },
  cat_jigsaw_puzzles: {
    1: 'Two farm animal jigsaws with interlocking pieces and clear pictures to match, a friendly step up from peg puzzles when they are ready for a proper tray.',
    2: 'Two jungle animal jigsaws with interlocking pieces and bright monkey and giraffe scenes, ideal when farm puzzles already fill the nursery shelf.',
    3: 'My First farm jigsaws with thick pieces in rising counts, so you can start with smaller trays and build confidence before moving to busier pictures.',
    4: 'Three wooden safari puzzles with trays and six pieces each, sturdy enough for everyday play when you want wood rather than cardboard on the floor.',
    5: 'A vehicle jigsaw with large pieces for turn, compare and try again, a confidence builder before twelve-piece sets for children who love rescue and road stories.',
  },
  cat_feelings_faces_books: {
    1: 'A warm Pip and Posy picture book where Posy finds Pip playing with someone new, then finds her feet again in a story about friendship and joining in.',
    2: 'A short sunny picture book where Little Whale learns to share snacks, toys and attention with a friend, told in warm words that suit bedtime and playdates.',
    3: 'A short funny picture book about friends learning that sharing works better than shouting mine, with a pivot into shared play that feels light rather than heavy.',
    4: 'A Food Group picture book about staying cross, saying sorry and moving on, written with enough humour for repeat reads after sticky friend play.',
    5: 'A lively rhyming chase about two squirrels who both want the same nut, then learn to work as a team in a story about sharing and joining in.',
  },
  cat_threading_beads: {
    1: 'Oversized letter sweets on a chunky cord, sized for little hands that enjoy a proper threading job at the table rather than tiny jewellery beads.',
    2: 'Large wooden fruit pieces to feed along a caterpillar lace, so threading has a finished line to show you as they practise guiding each piece.',
    3: 'A set of large colourful wooden beads and shapes to thread onto a soft fabric lace, sized for little hands that are ready for a proper threading job.',
    4: 'Chunky beads plus picture cards that invite children to copy a pattern on the lace, turning simple threading into a matching game as their focus grows.',
    5: 'Large sensory beads on short safety-release laces, for families who want an extra-kind cord design while still practising a chunky threading job together.',
  },
  cat_balance_stepping_stones: {
    1: 'Six Gonge River Stones for step, pause and turn paths on the living-room floor, helping your child practise balance and little routes without climbing high.',
    2: 'A five-pack of textured stepping stones for cautious first paths at home, a friendly starter set for balance and pause games on carpet or laminate.',
    3: 'Six nesting Step-A-Stumps with ribbed tops and a carry bag, so balance practice packs into one stack that fits smaller homes and hallways.',
    4: 'Three Gonge Hilltops for step-up, pause and step-down practice, adding a little height variation beside flat stones as confidence grows.',
    5: 'Six low Step-A-Trails for heel-toe walking lines down the hall, helping your child practise steady steps and turns on a clear path.',
  },
  cat_visual_routine_cards: {
    1: 'A set of rearrangeable routine pictures for the day at home, so your child can see morning and bedtime steps in order and move the pieces as each job is done.',
    2: 'Magnetic routine planner strips for everyday jobs at home, so your child can see the order of the day and tick along as each small job is finished.',
    3: 'A compact now and next board for simple hand-offs through the day, helping your child move from one job to the next with a clear picture plan.',
    4: 'A portable picture book for routines that travel between home, childminder and grandparents, so your child can see what comes next when the day changes place.',
    5: 'A picture strip for shoes, coat and bag before leaving the house, helping your child see the doorway steps and feel proud of each one.',
  },
};

let n = 0;
for (const f of fs.readdirSync(greenDir)) {
  if (!f.startsWith('ember_picks_') || !f.endsWith('.json')) continue;
  if (f.includes('ff_check') || f.includes('availability') || f.includes('url_smoke')) continue;
  const fp = path.join(greenDir, f);
  const doc = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const map = DESC[doc.category_entity_id];
  if (!map) throw new Error(`No desc map for ${doc.category_entity_id}`);
  for (const pick of doc.top_picks) {
    const text = map[pick.rank];
    if (!text) throw new Error(`No desc for ${doc.category_entity_id}#${pick.rank}`);
    const wc = wordCount(text);
    if (wc < 20 || wc > 40) throw new Error(`${doc.category_entity_id}#${pick.rank} has ${wc} words: ${text}`);
    if (text.includes('—') || text.includes('–')) throw new Error(`em dash in ${doc.category_entity_id}#${pick.rank}`);
    pick.product_description_under_30_words = text;
  }
  doc.research_date = '2026-07-23';
  fs.writeFileSync(fp, JSON.stringify(doc, null, 2) + '\n');
  console.log('ok', f);
  n += 1;
}
console.log('updated', n);
