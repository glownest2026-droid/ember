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

export function isRedundantOwnershipNote(note: string | null | undefined): boolean {
  const trimmed = (note ?? '').trim();
  if (!trimmed) return false;
  return REDUNDANT_OWNERSHIP_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export function resolveStage2HelperNote(
  mode: 'parent' | 'gift',
  ownershipNote: string | null | undefined,
  giftNote: string | null | undefined
): string | null {
  if (mode === 'gift') {
    const gift = (giftNote ?? '').trim();
    return gift || null;
  }
  const owned = (ownershipNote ?? '').trim();
  if (!owned || isRedundantOwnershipNote(owned)) return null;
  return owned;
}
