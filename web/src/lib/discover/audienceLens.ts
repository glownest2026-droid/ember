export type AudienceLens = 'for_your_child' | 'for_you' | 'for_both';

export type AudienceLensCardStyle = {
  card: string;
  cardSelected: string;
  iconWrap: string;
  iconWrapSelected: string;
};

const LENS_STYLES: Record<AudienceLens, AudienceLensCardStyle> = {
  for_your_child: {
    card: 'bg-[#FFF9F7] border-[#FFD4C8]',
    cardSelected: 'bg-[#FFF6F3] border-[#FF5C34] shadow-md z-10',
    iconWrap: 'bg-[#FFF0EB] border border-[#FFD4C8]',
    iconWrapSelected: 'bg-white shadow-sm',
  },
  for_you: {
    card: 'bg-[#F7F9FF] border-[#C8D4FF]',
    cardSelected: 'bg-[#F0F4FF] border-[#4B6FD4] shadow-md z-10',
    iconWrap: 'bg-[#EEF3FF] border border-[#C8D4FF]',
    iconWrapSelected: 'bg-white shadow-sm',
  },
  for_both: {
    card: 'bg-[#F7FBF8] border-[#C8E6D0]',
    cardSelected: 'bg-[#F0F8F3] border-[#5A9E6F] shadow-md z-10',
    iconWrap: 'bg-[#EDF7F0] border border-[#C8E6D0]',
    iconWrapSelected: 'bg-white shadow-sm',
  },
};

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
