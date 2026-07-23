/**
 * One-shot: fix Description/Why Pip overlap + banned “real jobs” leftovers.
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
  if (n < 40 || n > 60) throw new Error(`${id} why=${n}`);
  if (/\b(the tag|that tag|this tag|tag promises|earns that tag|real (playgroup|wobbles|jobs|moments))\b/i.test(text)) {
    throw new Error(`${id} banned phrase`);
  }
  return text;
}

const PATCH = {
  cat_feelings_faces_books: {
    1: 'Best-friend feelings run deep at nearly three, and so do the wobbles when someone new joins in. This story keeps the evening light while naming that sting and the soft way back. That gentle recovery is why it suits jealous moments without turning bedtime into a talk about behaviour.',
    2: 'Sharing is a skill to grow into after sticky playdates, not a lecture to survive. A sunny short read lets them practise the idea with you when the house feels settled again. That warm rehearsal is why this book suits sharing rows when you want kindness more than a warning.',
    3: 'Mine fights need humour after a sticky playdate more than a sermon. A funny short book gives you a shared joke to reset the evening without replaying the row. That light reset is why it suits mine-fight nights you may want to open more than once.',
    4: 'Holding a grudge is a new nearly-three skill, and so is starting again. A Food Group story brings enough humour for repeat reads when the cross feeling has stuck. That kind loop is why it suits grudge-loop nights without turning feelings into a lesson plan.',
    5: 'Competitive rows need a team ending once both children want the same prize. A lively rhyme keeps the chase fun while landing on joining in rather than who won. That joining-in finish is why it suits competitive moments without dampening the fun of the race.',
  },
  cat_picture_story_books: {
    1: 'Talk-back is growing fast at nearly three: choosing and explaining, not only listening. Spread after spread of open choices gives them something to decide and say out loud. That choosing muscle is why this book suits open-choice reading on the sofa or at bedtime.',
    3: 'Guessing what comes next builds talk-stories muscle before longer plots arrive. Each page invites a prediction from your child, so they stay in the conversation rather than only listening. That forward-looking chat is why this board book suits guessing-what-next reads at nearly three.',
    4: 'Once stories stretch a little longer, spotting a wobbly idea becomes useful talk. This quieter read invites your child to say what went wrong and what to try next, without a noisy bird on every page. That noticing chat is why it suits predicting-plans moments at bedtime.',
  },
};

for (const [id, map] of Object.entries(PATCH)) {
  const fp = path.join(greenDir, `ember_picks_34-36m_${id}.json`);
  const doc = JSON.parse(fs.readFileSync(fp, 'utf8'));
  for (const pick of doc.top_picks) {
    const why = map[pick.rank];
    if (!why) continue;
    pick.ember_verdict = assertWhy(`${id}#${pick.rank}`, why);
  }
  fs.writeFileSync(fp, `${JSON.stringify(doc, null, 2)}\n`);
  console.log('ok', id);
}
