/** PR2: puzzle ambiguity + age-fit helpers for At home add. */

export type PuzzleClarificationOption = {
  productTypeSlug: string;
  label: string;
  subtitle: string;
  ageFitVariant: string;
  ageFitMinMonths: number;
  ageFitMaxMonths: number;
};

export const PUZZLE_CLARIFICATION_OPTIONS: PuzzleClarificationOption[] = [
  {
    productTypeSlug: 'puzzle_peg_chunky',
    label: 'Chunky peg puzzle',
    subtitle: 'Big knobs, few pieces — usually before two.',
    ageFitVariant: 'peg_chunky',
    ageFitMinMonths: 9,
    ageFitMaxMonths: 27,
  },
  {
    productTypeSlug: 'puzzle_jigsaw_24_plus',
    label: '24+ piece jigsaw',
    subtitle: 'More pieces and a picture to work towards — usually from two up.',
    ageFitVariant: 'jigsaw_24_plus',
    ageFitMinMonths: 24,
    ageFitMaxMonths: 72,
  },
];

const PEG_HINTS =
  /\b(peg|chunky|knob|shape|sorter|few piece|3 piece|4 piece|5 piece|6 piece)\b/i;
const JIGSAW_HINTS =
  /\b(24|48|100|floor|\d+\s*-?\s*pieces?)\b/i;
const AMBIGUOUS_PUZZLE =
  /^(jigsaw|jigsaws|puzzle|puzzles)$/i;

/** True when parent typed a generic puzzle term without enough detail. */
export function needsPuzzleClarification(query: string, familySlug: string | null): boolean {
  const q = query.trim();
  if (!q) return false;
  if (familySlug === 'puzzles') {
    if (PEG_HINTS.test(q) || JIGSAW_HINTS.test(q)) return false;
    return /\b(jigsaw|puzzle)\b/i.test(q);
  }
  return AMBIGUOUS_PUZZLE.test(q);
}

export type AgeFitPin = {
  ageFitVariant: string | null;
  ageFitMinMonths: number | null;
  ageFitMaxMonths: number | null;
  ageFitSource: 'parent_choice' | 'query_parse' | 'default' | 'none';
};

export function ageFitFromQuery(query: string): AgeFitPin | null {
  const q = query.trim();
  if (!q) return null;
  if (PEG_HINTS.test(q)) {
    return {
      ageFitVariant: 'peg_chunky',
      ageFitMinMonths: 9,
      ageFitMaxMonths: 27,
      ageFitSource: 'query_parse',
    };
  }
  if (JIGSAW_HINTS.test(q)) {
    return {
      ageFitVariant: 'jigsaw_24_plus',
      ageFitMinMonths: 24,
      ageFitMaxMonths: 72,
      ageFitSource: 'query_parse',
    };
  }
  return null;
}

export function ageFitFromClarification(option: PuzzleClarificationOption): AgeFitPin {
  return {
    ageFitVariant: option.ageFitVariant,
    ageFitMinMonths: option.ageFitMinMonths,
    ageFitMaxMonths: option.ageFitMaxMonths,
    ageFitSource: 'parent_choice',
  };
}
