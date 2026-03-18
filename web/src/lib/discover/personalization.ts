/**
 * Copy helpers for /discover personalization (first name + gender fallbacks).
 */

export function firstNameFromProfile(childName: string | null | undefined, displayName: string | null | undefined): string | null {
  const raw = (displayName || childName || '').trim();
  if (!raw) return null;
  const first = raw.split(/\s+/)[0];
  return first || null;
}

const DISPLAY_LABEL_MAX = 48;

/** Full label for copy (matches nav: child_name then display_name). */
export function displayLabelFromProfile(
  childName: string | null | undefined,
  displayName: string | null | undefined
): string | null {
  const raw = (childName || displayName || '').trim();
  if (!raw) return null;
  return raw.length > DISPLAY_LABEL_MAX ? `${raw.slice(0, DISPLAY_LABEL_MAX - 1)}…` : raw;
}

/** Completed months since birthdate (>=0); null if missing/invalid. Aligns with /discover redirect logic. */
export function monthsOldFromBirthdate(birthdate: string | null | undefined): number | null {
  if (!birthdate || typeof birthdate !== 'string') return null;
  const birth = new Date(birthdate.trim());
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  return months >= 0 ? months : null;
}

/** Subject pronoun for short copy */
export function subjectPronoun(gender: string | null | undefined): 'he' | 'she' | 'they' {
  const g = (gender || '').trim().toLowerCase();
  if (g === 'male' || g === 'boy' || g === 'm') return 'he';
  if (g === 'female' || g === 'girl' || g === 'f') return 'she';
  return 'they';
}

/** Possessive pronoun */
export function possessivePronoun(gender: string | null | undefined): 'his' | 'her' | 'their' {
  const g = (gender || '').trim().toLowerCase();
  if (g === 'male' || g === 'boy' || g === 'm') return 'his';
  if (g === 'female' || g === 'girl' || g === 'f') return 'her';
  return 'their';
}

/** "Ben" / "Pop pop" / "your child" for headings */
export function displayChildName(label: string | null): string {
  return label?.trim() || 'your child';
}

/** "Ben is" / "Your child is" (sentence start) */
export function childIsPhrase(firstName: string | null): string {
  return firstName?.trim() ? `${firstName.trim()} is` : 'Your child is';
}

/** "Ben's" / "your child's" */
export function childPossessive(firstName: string | null): string {
  return firstName?.trim() ? `${firstName.trim()}'s` : "your child's";
}
