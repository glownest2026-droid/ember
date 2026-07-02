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

/** After add-child: open Discover on the child's month with nav scoped to them. */
export function discoverPathForChild(childId: string, birthdate: string | null | undefined): string {
  const childQ = `child=${encodeURIComponent(childId)}`;
  if (!birthdate?.trim()) return `/discover/26?${childQ}`;

  const birth = new Date(birthdate.trim());
  if (Number.isNaN(birth.getTime())) return `/discover/26?${childQ}`;

  const now = new Date();
  const rawMonths =
    (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  const monthSegment = rawMonths < 0 ? 0 : rawMonths;
  return `/discover/${monthSegment}?${childQ}`;
}

export type DiscoverChildPersonalization = {
  displayLabel: string | null;
  gender: string | null;
  monthsOld: number | null;
};

function strCell(v: unknown): string | null {
  if (v == null || v === '') return null;
  if (typeof v === 'string') {
    const t = v.trim();
    return t || null;
  }
  if (v instanceof Date && !Number.isNaN(v.getTime())) {
    return v.toISOString().split('T')[0];
  }
  const s = String(v).trim();
  return s || null;
}

/** Map a children row (e.g. select('*')) to discover hero copy fields. */
export function personalizationFromChildrenRow(row: Record<string, unknown>): DiscoverChildPersonalization {
  const birth = strCell(row.birthdate) ?? strCell(row.date_of_birth);
  return {
    displayLabel: displayLabelFromProfile(strCell(row.child_name), strCell(row.display_name)),
    gender: strCell(row.gender),
    monthsOld: monthsOldFromBirthdate(birth),
  };
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

/** Object pronoun — "them" → him/her when gender known */
export function objectPronoun(gender: string | null | undefined): 'him' | 'her' | 'them' {
  const g = (gender || '').trim().toLowerCase();
  if (g === 'male' || g === 'boy' || g === 'm') return 'him';
  if (g === 'female' || g === 'girl' || g === 'f') return 'her';
  return 'them';
}

/** Reflexive — "themselves" → himself/herself when gender known */
export function reflexivePronoun(gender: string | null | undefined): 'himself' | 'herself' | 'themselves' {
  const g = (gender || '').trim().toLowerCase();
  if (g === 'male' || g === 'boy' || g === 'm') return 'himself';
  if (g === 'female' || g === 'girl' || g === 'f') return 'herself';
  return 'themselves';
}

export type DiscoverCopyPersonalization = {
  displayLabel?: string | null;
  gender?: string | null;
};

/**
 * Runtime personalization for discover-facing copy (hero, Stage 1 why-text, Stage 2 rationale).
 * Swaps generic child references for name + gendered pronouns when profile data exists.
 */
export function personalizeDiscoverCopy(
  text: string,
  { displayLabel, gender }: DiscoverCopyPersonalization
): string {
  if (!text?.trim()) return text;

  const name = displayLabel?.trim() || null;
  const subj = subjectPronoun(gender);
  const poss = possessivePronoun(gender);
  const obj = objectPronoun(gender);
  const refl = reflexivePronoun(gender);

  let out = text;

  if (name) {
    out = out
      .replace(/\byour toddler\b/gi, name)
      .replace(/\byour young one\b/gi, name)
      .replace(/\byour baby\b/gi, name)
      .replace(/\byour child\b/gi, name)
      .replace(/\bYour toddler\b/g, name)
      .replace(/\bYour baby\b/g, name)
      .replace(/\bYour child\b/g, name);
  }

  if (gender && (subj === 'he' || subj === 'she')) {
    out = out
      .replace(/\bthey\b/gi, (match) => (match[0] === 'T' ? subj.charAt(0).toUpperCase() + subj.slice(1) : subj))
      .replace(/\bthem\b/gi, (match) => (match[0] === 'T' ? obj.charAt(0).toUpperCase() + obj.slice(1) : obj))
      .replace(/\btheir\b/gi, (match) => (match[0] === 'T' ? poss.charAt(0).toUpperCase() + poss.slice(1) : poss))
      .replace(/\bthemselves\b/gi, (match) => (match[0] === 'T' ? refl.charAt(0).toUpperCase() + refl.slice(1) : refl));
  }

  return out;
}

