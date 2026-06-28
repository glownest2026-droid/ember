type BandRange = { min: number; max: number };

type BandHeroCopy = {
  headlineAnonymous: string;
  subAnonymous: string;
  /** Phrase to swap for the child's display label in personalized copy. */
  subjectPhrase: string;
};

const BAND_HERO_COPY: Record<string, BandHeroCopy> = {
  '1-3': {
    headlineAnonymous: "What your baby's practising now",
    subAnonymous:
      'At 1–3 months, your baby may start turning towards faces, voices and movement while building strength in short awake moments. Notice what draws them in, then choose a focus to find simple ideas for what\u2019s coming next.',
    subjectPhrase: 'your baby',
  },
  '4-6': {
    headlineAnonymous: "What your baby's practising now",
    subAnonymous:
      'At 4–6 months, your baby may start reaching with purpose, pushing up, exploring with their mouth and getting ready for first tastes. Choose a development and we\u2019ll show simple ideas for this stage.',
    subjectPhrase: 'your baby',
  },
  '7-9': {
    headlineAnonymous: "What your baby's practising now",
    subAnonymous:
      'At 7–9 months, your baby may be sitting steadier, reaching with more purpose and exploring everything with their hands and mouth. Hidden objects, finger foods and early crawling signs can all become lovely clues for what to try next.',
    subjectPhrase: 'your baby',
  },
  '10-12': {
    headlineAnonymous: "What your baby's practising now",
    subAnonymous:
      'At 9–12 months, your baby may be getting busier, braver and more curious: reaching, crawling, pulling up, copying sounds, finding hidden things and trying finger foods. Choose a development and we\u2019ll show useful ideas for this stage.',
    subjectPhrase: 'your baby',
  },
  '13-15': {
    headlineAnonymous: "What your young one's practising now",
    subAnonymous:
      'At 13–15 months, your toddler may be getting steadier on their feet, louder in their choices and more eager to copy you. Choose a development and we\u2019ll show useful ideas for what\u2019s coming next.',
    subjectPhrase: 'your toddler',
  },
};

function possessiveName(displayLabel: string): string {
  const name = displayLabel.trim();
  if (!name) return "your child's";
  return name.endsWith('s') ? `${name}'` : `${name}'s`;
}

function bandKey(range: BandRange | null): string | null {
  if (!range) return null;
  return `${range.min}-${range.max}`;
}

export function getDiscoverHeroCopy({
  bandRange,
  childDisplayLabel,
  isExpecting,
  monthAge,
}: {
  bandRange: BandRange | null;
  childDisplayLabel: string | null;
  isExpecting: boolean;
  monthAge: number;
}): { headline: string; sub: string } {
  const name = childDisplayLabel?.trim() || null;

  if (isExpecting) {
    return {
      headline: name ? `What ${name} will need` : 'What your baby will need',
      sub: `Get ready for the early days. Choose a focus and we'll show useful ideas to prepare for ${name ?? 'your baby'}.`,
    };
  }

  const copy = BAND_HERO_COPY[bandKey(bandRange) ?? ''];
  if (copy) {
    const headline = name ? `What ${possessiveName(name)} practising now` : copy.headlineAnonymous;
    const sub = name
      ? copy.subAnonymous.replace(copy.subjectPhrase, name)
      : copy.subAnonymous;
    return { headline, sub };
  }

  return {
    headline: name ? `What ${possessiveName(name)} practising now` : "What your child's practising now",
    sub: name
      ? `At ${monthAge} months, ${name} may be getting more independent, more physical and more expressive. Choose a development and we'll show useful ideas for this stage.`
      : `At ${monthAge} months, your child may be getting more independent, more physical and more expressive. Choose a development and we'll show useful ideas for this stage.`,
  };
}
