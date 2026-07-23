/**
 * Founder 2026-07-23f — kill formulaic “That is why X suits Y” Why Pip closers.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bannedHits } from './lib/stage3-banned-copy.mjs';

const greenDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'exports',
  'stage3',
  '34-36m',
  'research',
  'green',
);

function wc(s) {
  return String(s || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function assertWhy(id, text) {
  const n = wc(text);
  if (n < 40 || n > 60) throw new Error(`${id} why=${n}: ${text}`);
  const hits = bannedHits(text, { publicCopy: true, field: 'ember_verdict' });
  if (hits.length) throw new Error(`${id} why banned: ${hits.join('|')} — ${text}`);
  return text;
}

const WHY = {
  cat_balance_stepping_stones: {
    1: 'At nearly three, movement gets planned: step, pause, turn, rather than random crashing around the room. These stones let you invent little living-room routes with clear rules, so balance practice becomes a game you build together. Step, pause and turn paths you can invent on the carpet.',
    2: 'Not every family wants premium stones on day one. Five textured pieces are enough for a short hallway route with pause points, so you can see whether path play sticks before spending more. A kinder first look for smaller budgets, without cutting the balance skill short.',
    3: 'Hallways and small flats need kit that packs away. Nesting stump sizes still give a proper step-up path, then collapse into one stack with a carry bag so the living room is free again. Small spaces keep balance practice in everyday play without a permanent obstacle course.',
    4: 'Once flat paths are sorted, a little height makes the next step interesting without turning play into daredevil jumping. Three fixed levels invite step-up, pause and step-down, which matches the planned movement this age is growing into. Useful height practice beside flatter stones you may already own.',
    5: 'Distance judgement grows fast around this age: can they stretch to the next stone without rushing? Rope-linked gaps make that stretch visible and adjustable, so you can widen the challenge as confidence grows. Better gap practice than another set of freestanding stones that never change.',
  },
  cat_feelings_faces_books: {
    1: 'Best-friend feelings run deep at nearly three, and so do the wobbles when someone new joins in. This story keeps the evening light while naming that sting and the soft way back. Jealous wobbles stay gentle at bedtime, without turning into a behaviour chat.',
    2: 'Sharing is a skill to grow into after sticky playdates, not a warning to sit through. A sunny short read lets them practise the idea with you when the house is settled again. Sharing rows land softer when you want kindness more than a scolding.',
    3: 'Mine fights need humour after a sticky playdate more than a talking-to. A funny short book gives you a shared joke to reset the evening without replaying the row. The kind of mine fight night story you may want to open more than once.',
    4: 'Holding a grudge is new at nearly three, and so is starting again. A Food Group story brings enough humour for repeat reads when the cross feeling has stuck. Stuck cross nights get a kind reset, without turning feelings into homework.',
    5: 'Competitive rows need a team ending once both children want the same prize. A lively rhyme keeps the chase fun while landing on joining in rather than who won. Competitive rows stay playful, without dampening the fun of the race.',
  },
  cat_jigsaw_puzzles: {
    1: 'Nearly-three puzzle play is about turning, comparing and holding a small plan until the picture appears. Two readable twelve-piece farm scenes give that step up from peg puzzles without jumping to grown-up trays. Clear animals and backgrounds keep the plan visible for a first proper twelve-piece job.',
    2: 'When a full twelve-piece tray still looks like a stretch, rising piece counts give gentler starts in one box. Thick Galt pieces survive lots of turning while they learn to finish a picture. Rising piece counts before bigger interlocking sets, without asking for adult patience on day one.',
    3: 'A full twelve-piece tray can look like a lot when interlocking is still new. Ravensburger My First farm scenes keep the picture clear while pieces stay thick enough for lots of turning. A gentler start for families easing into interlocking puzzles before the bigger farm and jungle trays.',
    4: 'When cardboard is already chewed or stepped on in daily play, wood holds up better on the floor. Six-piece safari trays still need a small plan, but the material survives everyday life. Wooden durability in the mix, not another soft cardboard set for the same job.',
    5: 'Vehicle fans need a confidence building set before a fuller twelve-piece tray. Short rescue scenes keep turn, compare and try again going without a table full of bits, and the characters invite a little matching story after the picture is done. Rescue vehicle play with a short finish they can own.',
  },
  cat_picture_story_books: {
    1: 'Talk back is growing fast at nearly three: choosing and explaining, not only listening. Spread after spread of open choices gives them something to decide and say out loud. Open choice reading on the sofa or at bedtime, with their voice in the story.',
    2: 'Practising a firm, funny no is useful once opinions arrive. The pigeon argues back on every spread, and your child holds the line with a reason. Saying no practice that stays playful at bedtime, without turning the evening into a talking-to.',
    3: 'Guessing what comes next builds longer talk before bigger plots arrive. Each page invites a prediction from your child, so they stay in the conversation rather than only listening. Guessing what next reads keep them in the chat at nearly three.',
    4: 'Once stories stretch a little longer, spotting a wobbly idea becomes useful talk. This quieter read invites your child to say what went wrong and what to try next, without a noisy bird on every page. Predicting plans reads for bedtime when you want noticing, not noise.',
    5: 'Tired evenings need a short call-and-response that stays playful. Looking for a shark in a new spot each time keeps them answering without a long plot to carry. Shark guesses for nights when everyone is running on empty and a longer story would tip you both over.',
  },
  cat_small_world_figures: {
    1: 'Get on, go and come back is the pretend game nearly-threes love once they start talking about trips. A chunky bus with seats makes that pattern obvious every time they load, drive and tip out. Get on, go and return play is clearer if a Happyland bus is already in the house.',
    2: 'Once the local bus game is familiar, holiday talk needs a bigger trip. An airport shuttle opens boarding, going and coming-home stories without classic Playmobil tiny bits. Airport pretend for when ordinary street trips are already well practised and holiday chat is starting.',
    3: 'After bus and trip toys, care roles become the next pretend stretch. A helper pack with doctor, fire and police figures lets kindness sit inside the story, not only the drive. Help and rescue play beside a bus they already love.',
    4: 'Help on wheels gives a clear care story with a beginning and an end: someone needs help, you drive, you help, you come back. DUPLO pieces stay sturdy when bus and helper figures already fill the basket. Help on wheels play that still fits a nearly-three hand.',
    5: 'Rebuild vehicle jobs keep small-world play fresh after bus and helper sets. Chunky DUPLO pieces let them invent the job, not only follow one fixed idea, while still driving and rebuilding. Rebuild vehicle play when the shelf already has a clear trip toy.',
  },
  cat_threading_beads: {
    1: 'Letters make the lace into a finished word job, not endless random beads. Oversized sweets keep little hands on a proper threading task while concentration is still growing. Keep them company because the cords tangle easily. Letters and lacing practice at the table, with a word they can show you.',
    2: 'Some children need a story reason to keep lacing, not another loose bead tub. Fruit pieces along a caterpillar give a finished picture to show you, which keeps concentration going to the end. Storybook threading at nearly three, with a finish they are proud of.',
    3: 'Chunky first beads are the classic next step after posting toys. Soft lace and big wooden shapes invite a proper threading job while concentration is still growing. Sit with them while they lace. Chunky first beads without jumping to fiddly jewellery kits.',
    4: 'When random threading is already sorted, the next stretch is copying a sequence. Picture cards turn the lace into a matching game without asking them to invent the pattern alone. Copying patterns play beside beads you already keep in the house.',
    5: 'Siblings and pets make long cords a worry on the floor at this age. A kinder cord end keeps the same table threading practice without the tangle panic after play. Safer cord ends when you still want proper lace work at the table.',
  },
  cat_visual_routine_cards: {
    1: 'Nearly-threes manage everyday jobs better when they can see what comes next across the day. Rearrangeable morning and bedtime pictures turn those stretches into a shared plan you build together, with pride as each card moves. Whole day routines for families ready for a fuller strip at home.',
    2: 'Fridge doors are where many UK homes already live. Magnetic strips make the plan easy to change without sticky mess, so morning and bedtime jobs can shift as the week changes. Magnetic planners keep the routine visible in the kitchen, not tucked away in another room.',
    3: 'Big whole day boards can overwhelm when all you need is the next hand-off. Showing only a couple of pictures keeps the change clear for nearly-threes still learning transitions. Handmade UK metal and tokens matched to your day for now and next changes, without a ten step wall.',
    4: 'Wall charts stay in one room, but many nearly-three days move between home, childminder and grandparents. A portable picture book keeps the same routine symbols in the changing bag, so what comes next stays familiar when the place changes. Portable routines without buying a second wall set.',
    5: 'Leaving the house is its own nearly-three skill: shoes, coat and bag without a running commentary from you. A clear morning strip makes those doorway jobs visible and movable, so pride replaces nagging. Handmade UK build and tokens matched to your doorway jobs for getting out the door.',
  },
};

let updated = 0;
for (const [id, map] of Object.entries(WHY)) {
  const fp = path.join(greenDir, `ember_picks_34-36m_${id}.json`);
  const doc = JSON.parse(fs.readFileSync(fp, 'utf8'));
  for (const pick of doc.top_picks) {
    const text = map[pick.rank];
    if (!text) continue;
    pick.ember_verdict = assertWhy(`${id}#${pick.rank}`, text);
    for (const row of doc.longlist || []) {
      if (
        Number(row.top_pick_rank) === Number(pick.rank) ||
        (row.included_in_top_5 && Number(row.longlist_rank) === Number(pick.rank))
      ) {
        if (row.ember_verdict != null) row.ember_verdict = pick.ember_verdict;
      }
    }
    updated += 1;
  }

  for (const pick of doc.top_picks) {
    for (const field of ['ember_verdict', 'product_description_under_30_words', 'best_for_tag']) {
      const hits = bannedHits(pick[field], { publicCopy: true, field });
      if (hits.length) {
        throw new Error(`${id}#${pick.rank} ${field} still banned: ${hits.join('|')} — ${pick[field]}`);
      }
    }
  }

  fs.writeFileSync(fp, JSON.stringify(doc, null, 2) + '\n', 'utf8');
  console.log('updated', id);
}

console.log('done', updated, 'why pips');
