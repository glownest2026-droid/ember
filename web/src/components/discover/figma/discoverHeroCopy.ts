type BandRange = { min: number; max: number };

type BandHeroCopy = {
  headlineAnonymous: string;
  /** Body after "At {range}, " — generic child references personalised at runtime. */
  body: string;
};

const BAND_HERO_COPY: Record<string, BandHeroCopy> = {
  '1-3': {
    headlineAnonymous: "What your baby's practising now",
    body: 'your baby may start turning towards faces, voices and movement while building strength in short awake moments. Notice what draws them in, then choose a focus to find simple ideas for what\u2019s coming next.',
  },
  '4-6': {
    headlineAnonymous: "What your baby's practising now",
    body: 'your baby may start reaching with purpose, pushing up, exploring with their mouth and getting ready for first tastes. Choose a development and we\u2019ll show simple ideas for this stage.',
  },
  '7-9': {
    headlineAnonymous: "What your baby's practising now",
    body: 'your baby may be sitting steadier, reaching with more purpose and exploring everything with their hands and mouth. Hidden objects, finger foods and early crawling signs can all become lovely clues for what to try next.',
  },
  '10-12': {
    headlineAnonymous: "What your baby's practising now",
    body: 'your baby may be getting busier, braver and more curious: reaching, crawling, pulling up, copying sounds, finding hidden things and trying finger foods. Choose a development and we\u2019ll show useful ideas for this stage.',
  },
  '13-15': {
    headlineAnonymous: "What your young one's practising now",
    body: 'your toddler may be turning first-year basics into purposeful experiments: carrying, tipping, pointing, copying, feeding and trying to get everywhere. Pick a development to see what is changing now, useful ideas for this stage, and what to buy, borrow or bring back out.',
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

function formatRangePhrase(range: BandRange): string {
  return `${range.min}\u2013${range.max} months`;
}

function headlineForBand(range: BandRange | null, name: string | null): string {
  const key = bandKey(range);
  const template = (key && BAND_HERO_COPY[key]?.headlineAnonymous) || "What your child's practising now";
  if (!name) return template;
  if (template.includes("young one's")) {
    return `What ${possessiveName(name)} practising now`;
  }
  return `What ${possessiveName(name)} practising now`;
}

function childSubject(name: string | null): string {
  return name?.trim() || 'your child';
}

export function getDiscoverHeroCopy({
  bandRange,
  childDisplayLabel,
  isExpecting,
  monthAge,
  personalizeCopy,
}: {
  bandRange: BandRange | null;
  childDisplayLabel: string | null;
  isExpecting: boolean;
  monthAge: number;
  personalizeCopy: (text: string) => string;
}): { headline: string; sub: string } {
  const name = childDisplayLabel?.trim() || null;

  if (isExpecting) {
    return {
      headline: name ? `What ${name} will need` : 'What your baby will need',
      sub: personalizeCopy(
        `Get ready for the early days. Choose a focus and we'll show useful ideas to prepare for ${name ?? 'your baby'}.`
      ),
    };
  }

  const copy = BAND_HERO_COPY[bandKey(bandRange) ?? ''];
  if (copy && bandRange) {
    const rangePhrase = formatRangePhrase(bandRange);
    const body = personalizeCopy(copy.body);
    return {
      headline: headlineForBand(bandRange, name),
      sub: `At ${rangePhrase}, ${body}`,
    };
  }

  const rangePhrase = bandRange ? formatRangePhrase(bandRange) : `${monthAge} months`;
  const subject = childSubject(name);
  return {
    headline: headlineForBand(bandRange, name),
    sub: personalizeCopy(
      `At ${rangePhrase}, ${subject} may be getting more independent, more physical and more expressive. Choose a development and we'll show useful ideas for this stage.`
    ),
  };
}
