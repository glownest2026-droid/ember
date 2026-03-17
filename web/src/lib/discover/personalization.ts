/**
 * Copy helpers for /discover personalization (first name + gender fallbacks).
 */

export function firstNameFromProfile(childName: string | null | undefined, displayName: string | null | undefined): string | null {
  const raw = (displayName || childName || '').trim();
  if (!raw) return null;
  const first = raw.split(/\s+/)[0];
  return first || null;
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

/** "Ben" / "your child" for headings */
export function displayChildName(firstName: string | null): string {
  return firstName?.trim() || 'your child';
}

/** "Ben is" / "Your child is" (sentence start) */
export function childIsPhrase(firstName: string | null): string {
  return firstName?.trim() ? `${firstName.trim()} is` : 'Your child is';
}

/** "Ben's" / "your child's" */
export function childPossessive(firstName: string | null): string {
  return firstName?.trim() ? `${firstName.trim()}'s` : "your child's";
}
