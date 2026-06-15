export type AudienceLens = 'for_your_child' | 'for_you' | 'for_both';

export type AudienceLensCardStyle = {
  card: string;
  cardSelected: string;
  iconWrap: string;
  iconWrapSelected: string;
  sectionAccent: string;
};

const LENS_STYLES: Record<AudienceLens, AudienceLensCardStyle> = {
  for_your_child: {
    card: 'bg-[#FFE8DE] border-[#FF5C34]',
    cardSelected: 'bg-[#FFD4C4] border-[#E04B28] shadow-md z-10',
    iconWrap: 'bg-[#FFC9B5] border border-[#FF5C34]/40',
    iconWrapSelected: 'bg-white shadow-sm',
    sectionAccent: 'text-[#E04B28]',
  },
  for_you: {
    card: 'bg-[#DFF5E8] border-[#2E9B5A]',
    cardSelected: 'bg-[#C8EDD6] border-[#1F7A45] shadow-md z-10',
    iconWrap: 'bg-[#B8E6C8] border border-[#2E9B5A]/40',
    iconWrapSelected: 'bg-white shadow-sm',
    sectionAccent: 'text-[#1F7A45]',
  },
  for_both: {
    card: 'bg-[#E8E4FF] border-[#6B4FBB]',
    cardSelected: 'bg-[#D8D0FF] border-[#5538A8] shadow-md z-10',
    iconWrap: 'bg-[#D0C4FF] border border-[#6B4FBB]/40',
    iconWrapSelected: 'bg-white shadow-sm',
    sectionAccent: 'text-[#5538A8]',
  },
};

/** Stage 1 section order and copy for grouped doorway cards. */
export const AUDIENCE_LENS_SECTIONS: {
  lenses: AudienceLens[];
  title: string;
}[] = [
  { lenses: ['for_your_child'], title: 'For them' },
  { lenses: ['for_both', 'for_you'], title: 'For you' },
];

export function parseAudienceLens(value: string | null | undefined): AudienceLens | null {
  if (value === 'for_your_child' || value === 'for_you' || value === 'for_both') {
    return value;
  }
  return null;
}

export function getAudienceLensCardStyle(lens: string | null | undefined): AudienceLensCardStyle | null {
  const parsed = parseAudienceLens(lens);
  return parsed ? LENS_STYLES[parsed] : null;
}

export function groupByAudienceLensSection<T extends { audienceLens?: string | null }>(
  items: T[]
): { title: string; items: T[] }[] {
  const buckets = new Map<AudienceLens, T[]>();
  const ungrouped: T[] = [];

  for (const item of items) {
    const lens = parseAudienceLens(item.audienceLens);
    if (!lens) {
      ungrouped.push(item);
      continue;
    }
    const list = buckets.get(lens) ?? [];
    list.push(item);
    buckets.set(lens, list);
  }

  const sections = AUDIENCE_LENS_SECTIONS.map((section) => ({
    title: section.title,
    items: section.lenses.flatMap((lens) => buckets.get(lens) ?? []),
  })).filter((section) => section.items.length > 0);

  if (ungrouped.length > 0) {
    sections.push({ title: 'More to explore', items: ungrouped });
  }

  return sections;
}
