/**
 * Stage 2 card helper notes — parent vs gift mode and Conor-grade redundancy filter.
 */

const REDUNDANT_OWNERSHIP_PATTERNS: RegExp[] = [
  /^borrow or reuse\b/i,
  /^if you already have\b/i,
  /^if the family already owns\b/i,
  /^if they already have\b/i,
  /^use photos you already have/i,
  /^use a (?:small |real )?(?:cup|basket|tub)\b/i,
  /^give one a caring role before buying/i,
  /^a favourite soft toy can become a puppet/i,
  /^choose this only if it adds a clearer age-fit/i,
  /^if you already have something similar, check whether/i,
  /^if blocks are already out\b/i,
  /^cups, bowls or bath toys may already cover/i,
  /^useful if you do not already have\b/i,
  /^if you already have lots of (?:books|toys)\b/i,
  /^if they already have (?:books|a rattle|a good mat)\b/i,
  /^skip this and choose\b/i,
  /^common ownership risk is medium, so check whether they already have one/i,
];

/** Gift-buyer / Thea copy that must never surface in parent mode (even if stored in ownership_note). */
const GIFT_ORIENTED_NOTE_PATTERNS: RegExp[] = [
  /^high chance the family owns/i,
  /^good gift\b/i,
  /^a practical gift\b/i,
  /^a familiar gift\b/i,
  /^a more thoughtful (?:gift|idea)\b/i,
  /^thoughtful if age-fit/i,
  /^gift buyers?\b/i,
  /^for gift buyers?\b/i,
  /^buying as a gift\b/i,
  /^the family (?:may|might|already)\b/i,
  /^family owns\b/i,
  /^already owned\b/i,
  /^not already owned\b/i,
  /^ownership risk\b/i,
  /^high ownership risk\b/i,
  /^common ownership risk\b/i,
  /^check whether they already have\b/i,
  /^choose this only if it adds\b/i,
  /^look for the stage shift:.*rather than simply more of the same/i,
];

const GIFT_BADGE_LABELS = new Set(
  ['gift idea', 'good gift', 'gift', 'buying a gift', 'for gifters', 'gift pick'].map((s) => s.toLowerCase())
);

export function isRedundantOwnershipNote(note: string | null | undefined): boolean {
  const trimmed = (note ?? '').trim();
  if (!trimmed) return false;
  return REDUNDANT_OWNERSHIP_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export function isGiftOrientedNote(note: string | null | undefined): boolean {
  const trimmed = (note ?? '').trim();
  if (!trimmed) return false;
  return GIFT_ORIENTED_NOTE_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export function resolveStage2HelperNote(
  mode: 'parent' | 'gift',
  ownershipNote: string | null | undefined,
  giftNote: string | null | undefined
): string | null {
  if (mode === 'gift') {
    const gift = (giftNote ?? '').trim();
    if (gift) return gift;
    const owned = (ownershipNote ?? '').trim();
    if (owned && isGiftOrientedNote(owned)) return owned;
    return null;
  }
  const owned = (ownershipNote ?? '').trim();
  if (!owned || isRedundantOwnershipNote(owned) || isGiftOrientedNote(owned)) return null;
  return owned;
}

export function resolveStage2BadgeLabel(
  mode: 'parent' | 'gift',
  buyerModeLabel: string | null | undefined
): string | null {
  const label = (buyerModeLabel ?? '').trim();
  if (!label) return null;
  if (mode === 'gift') return label;
  if (GIFT_BADGE_LABELS.has(label.toLowerCase())) return null;
  if (/gift/i.test(label)) return null;
  return label;
}
