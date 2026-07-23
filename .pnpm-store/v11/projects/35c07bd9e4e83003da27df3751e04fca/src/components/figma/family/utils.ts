/**
 * Format birthdate as "Jan 2020" from ISO date string.
 */
export function formatBirthMonthYear(birthdate: string | null | undefined): string {
  if (!birthdate) return '—';
  const d = new Date(birthdate);
  if (Number.isNaN(d.getTime())) return '—';
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  return `${month} ${year}`;
}

/**
 * Age string from birthdate: "6y 2m", "9 months", "2 years".
 */
export function formatAge(birthdate: string | null | undefined): string {
  if (!birthdate) return '—';
  const birth = new Date(birthdate);
  const now = new Date();
  if (Number.isNaN(birth.getTime())) return '—';
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (months < 0) return '—';
  if (months === 0) {
    const days = Math.floor((now.getTime() - birth.getTime()) / (24 * 60 * 60 * 1000));
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  }
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'}`;
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  if (remainder === 0) return `${years} ${years === 1 ? 'year' : 'years'}`;
  return `${years}y ${remainder}m`;
}

/**
 * Deterministic avatar initial from child id (no name/PII). Returns A–Z.
 */
export function getAvatarInitial(id: string): string {
  if (!id || id.length < 8) return 'C';
  const n = id.charCodeAt(0) + id.charCodeAt(4) + id.charCodeAt(7);
  return String.fromCharCode(65 + (n % 26));
}
