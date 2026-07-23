/**
 * Founder 2026-07-23c — strip AI process speak + nursery benchmarking from parent copy.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
  return text;
}

function assertDesc(id, text) {
  const n = wc(text);
  if (n < 20 || n > 40) throw new Error(`${id} desc=${n}: ${text}`);
  return text;
}

const PATCH = {
  cat_balance_stepping_stones: {
    4: {
      why: 'Once flat paths are sorted, a little height makes the next step interesting without turning play into daredevil jumping. Three fixed levels invite step-up, pause and step-down, which matches the planned movement this age is growing into. That is why they suit height practice beside flatter stones you may already own.',
    },
  },
  cat_feelings_faces_books: {
    4: {
      why: 'Holding a grudge is a new nearly-three skill, and so is starting again. A Food Group story brings enough humour for repeat reads when the cross feeling has stuck. That kind reset is why it suits stuck-cross nights without turning feelings into a lesson plan.',
    },
  },
  cat_jigsaw_puzzles: {
    3: {
      why: 'Warm-up sessions matter when a full twelve-piece tray still looks like a lot. Ravensburger My First farm scenes keep the picture clear while pieces stay thick enough for lots of turning. That gentler start is why this suits families easing into interlocking puzzles before the bigger farm and jungle trays.',
    },
    5: {
      why: 'Vehicle fans need a confidence-building set before a fuller twelve-piece tray. Short rescue scenes keep turn, compare and try-again play going without a table full of bits, and the characters invite a little matching story after the picture is done. That is why this suits rescue-vehicle play at this age.',
    },
  },
  cat_small_world_figures: {
    1: {
      desc: 'A chunky red London bus with seats for little people, made for loading passengers, driving somewhere, tipping them out and starting all over again.',
      why: 'Get on, go and come back is the pretend game nearly-threes love once they start talking about trips. A chunky bus with seats makes that pattern obvious every time they load, drive and tip out. That clear trip structure is why this set suits get-on-go-return play, especially if a Happyland bus is already in the house.',
    },
    2: {
      why: 'Once the local bus game is familiar, holiday talk needs a bigger trip. An airport shuttle opens boarding, going and coming-home stories without classic Playmobil tiny bits. That wider travel play is why this set suits airport pretend when street trips already feel covered.',
    },
    3: {
      why: 'After bus and trip toys, care roles become the next pretend stretch. A helper pack with doctor, fire and police figures lets kindness sit inside the story, not only the drive. That caring cast is why this set suits help-and-rescue play beside a bus they already love.',
    },
    4: {
      why: 'Help-on-wheels gives a clear care story with a beginning and an end: someone needs help, you drive, you help, you come back. DUPLO pieces stay sturdy when bus and helper figures already fill the basket. That simple rescue pattern is why this set suits help-on-wheels play at nearly three.',
    },
    5: {
      why: 'Rebuild vehicle jobs keep small-world play fresh after bus and helper sets. Chunky DUPLO pieces let them invent the job, not only follow one fixed idea, while still driving and rebuilding. That open inventiveness is why this set suits rebuild-vehicle play when the shelf already has a clear trip toy.',
    },
  },
  cat_threading_beads: {
    4: {
      why: 'When random threading is already sorted, the next stretch is copying a sequence. Picture cards turn the lace into a matching game without asking them to invent the pattern alone. That guided step is why this set suits copying-patterns play beside beads already in the house.',
    },
  },
  cat_visual_routine_cards: {
    1: {
      why: 'Nearly-threes manage everyday jobs better when they can see what comes next across the day. Rearrangeable morning and bedtime pictures turn those stretches into a shared plan you build together, with pride as each card moves. That whole-day visibility is why this timetable suits families ready for a fuller strip at home.',
    },
    2: {
      why: 'Fridge doors are where many UK homes already live. Magnetic strips make the plan easy to change without sticky mess, so morning and bedtime jobs can shift as the week changes. That everyday practicality is why magnetic planners suit families who want the routine visible in the kitchen, not tucked away in another room.',
    },
  },
};

// small world #2 still has "feel covered" - fix that
PATCH.cat_small_world_figures[2].why =
  'Once the local bus game is familiar, holiday talk needs a bigger trip. An airport shuttle opens boarding, going and coming-home stories without classic Playmobil tiny bits. That wider travel play is why this set suits airport pretend when ordinary street trips are already well practised.';

for (const [id, map] of Object.entries(PATCH)) {
  const fp = path.join(greenDir, `ember_picks_34-36m_${id}.json`);
  const doc = JSON.parse(fs.readFileSync(fp, 'utf8'));
  for (const pick of doc.top_picks) {
    const p = map[pick.rank];
    if (!p) continue;
    if (p.desc) pick.product_description_under_30_words = assertDesc(`${id}#${pick.rank}`, p.desc);
    if (p.why) pick.ember_verdict = assertWhy(`${id}#${pick.rank}`, p.why);
  }
  fs.writeFileSync(fp, `${JSON.stringify(doc, null, 2)}\n`);
  console.log('ok', id);
}
