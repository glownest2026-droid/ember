/**
 * Founder 2026-07-23e — strip invented AI hyphen compounds from 34–36m Pip copy.
 * Ordinary English hyphens only (allowlist in stage3-banned-copy.mjs).
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
  const hits = bannedHits(text);
  if (hits.length) throw new Error(`${id} why banned: ${hits.join('|')} — ${text}`);
  return text;
}

function assertDesc(id, text) {
  const n = wc(text);
  if (n < 20 || n > 40) throw new Error(`${id} desc=${n}: ${text}`);
  const hits = bannedHits(text);
  if (hits.length) throw new Error(`${id} desc banned: ${hits.join('|')} — ${text}`);
  return text;
}

function assertTag(id, text) {
  const rest = text.replace(/^best for\s+/i, '');
  const words = rest.split(/\s+/).filter(Boolean);
  if (words.length > 6) throw new Error(`${id} tag too long (${words.length}): ${text}`);
  const hits = bannedHits(text);
  if (hits.length) throw new Error(`${id} tag banned: ${hits.join('|')} — ${text}`);
  return text;
}

const PATCH = {
  cat_balance_stepping_stones: {
    1: {
      tag: 'Best for step pause turn paths',
      why: 'At nearly three, movement gets planned: step, pause, turn, rather than random crashing around the room. These stones let you invent little living-room routes with clear rules, so balance practice becomes a game you build together. That is why they suit step, pause and turn paths so well for this age.',
    },
    3: {
      why: 'Hallways and small flats need kit that packs away. Nesting stump sizes still give a proper step-up path, then collapse into one stack with a carry bag so the living room is free again. That tidy pack away is why they suit small spaces while balance practice stays part of everyday play.',
    },
  },
  cat_feelings_faces_books: {
    3: {
      why: 'Mine fights need humour after a sticky playdate more than a talking-to. A funny short book gives you a shared joke to reset the evening without replaying the row. That light reset is why it suits mine fight nights you may want to open more than once.',
    },
    4: {
      tag: 'Best for stuck cross nights',
      why: 'Holding a grudge is new at nearly three, and so is starting again. A Food Group story brings enough humour for repeat reads when the cross feeling has stuck. That kind reset is why it suits stuck cross nights without turning feelings into homework.',
    },
    5: {
      why: 'Competitive rows need a team ending once both children want the same prize. A lively rhyme keeps the chase fun while landing on joining in rather than who won. That joining in finish is why it suits competitive rows without dampening the fun of the race.',
    },
  },
  cat_jigsaw_puzzles: {
    1: {
      why: 'Nearly-three puzzle play is about turning, comparing and holding a small plan until the picture appears. Two readable twelve-piece farm scenes give that step up from peg puzzles without jumping to grown-up trays. Clear animals and backgrounds keep the plan visible, which is why this suits a first proper twelve-piece job.',
    },
    5: {
      desc: 'Six small emergency vehicle jigsaws in one Orchard Toys box, mostly two and three pieces, plus character pieces for matching drivers to ambulance, fire engine and more.',
      why: 'Vehicle fans need a confidence building set before a fuller twelve-piece tray. Short rescue scenes keep turn, compare and try again going without a table full of bits, and the characters invite a little matching story after the picture is done. That is why this suits rescue vehicle play at this age.',
    },
  },
  cat_picture_story_books: {
    1: {
      why: 'Talk back is growing fast at nearly three: choosing and explaining, not only listening. Spread after spread of open choices gives them something to decide and say out loud. That choosing practice is why this book suits open choice reading on the sofa or at bedtime.',
    },
    2: {
      tag: 'Best for saying no',
      why: 'Practising a firm, funny no is useful once opinions arrive. The pigeon argues back on every spread, and your child holds the line with a reason. That playful back-and-forth is why this board book suits saying no practice without turning bedtime into a talking-to.',
    },
    3: {
      tag: "Best for guessing what's next",
      why: 'Guessing what comes next builds longer talk before bigger plots arrive. Each page invites a prediction from your child, so they stay in the conversation rather than only listening. That forward looking chat is why this board book suits guessing what next reads at nearly three.',
    },
    4: {
      tag: 'Best for predicting plans',
      why: 'Once stories stretch a little longer, spotting a wobbly idea becomes useful talk. This quieter read invites your child to say what went wrong and what to try next, without a noisy bird on every page. That noticing chat is why it suits predicting plans reads at bedtime.',
    },
    5: {
      tag: 'Best for shark guesses',
      why: 'Tired evenings need a short call-and-response that still feels playful. Looking for a shark in a new spot each time keeps them answering without a long plot to carry. That light repeat pattern is why this rhyme suits shark guesses when everyone is running on empty.',
    },
  },
  cat_small_world_figures: {
    1: {
      tag: 'Best for get on go return',
      why: 'Get on, go and come back is the pretend game nearly-threes love once they start talking about trips. A chunky bus with seats makes that pattern obvious every time they load, drive and tip out. That clear trip structure is why this set suits get on, go and return play, especially if a Happyland bus is already in the house.',
    },
    3: {
      tag: 'Best for help and rescue roles',
      why: 'After bus and trip toys, care roles become the next pretend stretch. A helper pack with doctor, fire and police figures lets kindness sit inside the story, not only the drive. That caring cast is why this set suits help and rescue play beside a bus they already love.',
    },
    4: {
      tag: 'Best for help on wheels',
      desc: 'A chunky DUPLO ambulance with a driver and patient figure, made for load the patient, drive, help and return play with pieces sized for little hands.',
      why: 'Help on wheels gives a clear care story with a beginning and an end: someone needs help, you drive, you help, you come back. DUPLO pieces stay sturdy when bus and helper figures already fill the basket. That simple rescue pattern is why this set suits help on wheels play at nearly three.',
    },
    5: {
      tag: 'Best for rebuild vehicle jobs',
    },
  },
  cat_threading_beads: {
    1: {
      tag: 'Best for letters and lacing',
      why: 'Letters make the lace into a finished word job, not endless random beads. Oversized sweets keep little hands on a proper threading task while concentration is still growing. Keep them company because the cords tangle easily. That letter finish pride is why this set suits letters and lacing practice at the table.',
    },
    2: {
      why: 'Some children need a story reason to keep lacing, not another loose bead tub. Fruit pieces along a caterpillar give a finished picture to show you, which keeps concentration going to the end. That finish line pride is why this set suits storybook threading at nearly three.',
    },
    3: {
      why: 'Chunky first beads are the classic next step after posting toys. Soft lace and big wooden shapes invite a proper threading job while concentration is still growing. Sit with them while they lace. That simple big bead start is why this set suits chunky first beads without jumping to fiddly jewellery kits.',
    },
    4: {
      tag: 'Best for copying patterns',
      why: 'When random threading is already sorted, the next stretch is copying a sequence. Picture cards turn the lace into a matching game without asking them to invent the pattern alone. That guided step is why this set suits copying patterns play beside beads already in the house.',
    },
    5: {
      desc: 'Large sensory beads on short safety-release laces, for families who want a kinder cord design while still practising a chunky threading job together.',
      why: 'Cord ends need care when siblings or pets share the floor. Safety-release laces and large sensory beads keep the threading skill while making pack away kinder after play. That safer finish is why this set suits safer cord ends without dropping table practice.',
    },
  },
  cat_visual_routine_cards: {
    1: {
      tag: 'Best for whole day routines',
      why: 'Nearly-threes manage everyday jobs better when they can see what comes next across the day. Rearrangeable morning and bedtime pictures turn those stretches into a shared plan you build together, with pride as each card moves. That whole day visibility is why this timetable suits families ready for a fuller strip at home.',
    },
    3: {
      tag: 'Best for now and next',
      why: 'Big whole day boards can overwhelm when all you need is the next hand-off. Showing only a couple of pictures keeps the change clear for nearly-threes still learning transitions. Handmade UK metal and tokens matched to your day are why this suits now and next changes without a ten step wall.',
    },
    4: {
      why: 'Wall charts stay in one room, but many nearly-three days move between home, childminder and grandparents. A portable picture book keeps the same routine symbols in the changing bag, so what comes next stays familiar when the place changes. That take anywhere design is why this suits portable routines without buying a second wall set.',
    },
    5: {
      why: 'Leaving the house is its own nearly-three skill: shoes, coat and bag without a running commentary from you. A clear morning strip makes those doorway jobs visible and movable, so pride replaces nagging. Handmade UK build and tokens matched to your doorway jobs are why this suits getting out the door practice at this age.',
    },
  },
};

// Picture #5 "feels playful" — soften to avoid feel-judgement drift
PATCH.cat_picture_story_books[5].why =
  'Tired evenings need a short call-and-response that stays playful. Looking for a shark in a new spot each time keeps them answering without a long plot to carry. That light repeat pattern is why this rhyme suits shark guesses when everyone is running on empty.';

let updated = 0;
for (const [id, map] of Object.entries(PATCH)) {
  const fp = path.join(greenDir, `ember_picks_34-36m_${id}.json`);
  const doc = JSON.parse(fs.readFileSync(fp, 'utf8'));
  for (const pick of doc.top_picks) {
    const p = map[pick.rank];
    if (!p) continue;
    if (p.tag) {
      pick.best_for_tag = assertTag(`${id}#${pick.rank}`, p.tag);
      for (const row of doc.longlist || []) {
        if (Number(row.top_pick_rank) === Number(pick.rank) || (row.included_in_top_5 && Number(row.longlist_rank) === Number(pick.rank))) {
          row.best_for_tag = pick.best_for_tag;
        }
      }
    }
    if (p.desc) pick.product_description_under_30_words = assertDesc(`${id}#${pick.rank}`, p.desc);
    if (p.why) {
      pick.ember_verdict = assertWhy(`${id}#${pick.rank}`, p.why);
      for (const row of doc.longlist || []) {
        if (Number(row.top_pick_rank) === Number(pick.rank) || (row.included_in_top_5 && Number(row.longlist_rank) === Number(pick.rank))) {
          if (row.ember_verdict != null) row.ember_verdict = pick.ember_verdict;
        }
      }
    }
    updated += 1;
  }

  for (const pick of doc.top_picks) {
    for (const field of ['ember_verdict', 'product_description_under_30_words', 'best_for_tag']) {
      const hits = bannedHits(pick[field]);
      if (hits.length) {
        throw new Error(`${id}#${pick.rank} ${field} still banned: ${hits.join('|')} — ${pick[field]}`);
      }
    }
  }

  fs.writeFileSync(fp, JSON.stringify(doc, null, 2) + '\n', 'utf8');
  console.log('updated', id);
}

console.log('done', updated, 'picks patched');
