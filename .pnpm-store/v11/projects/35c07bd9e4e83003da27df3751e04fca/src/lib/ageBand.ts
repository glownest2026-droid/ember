/**
 * Calculate age band from birthdate
 * Returns age band string like "0-6m", "6-12m", "12-18m", "18-24m", "2-3y", "3-4y", "4-5y", "5-6y", "6+"
 */
export function calculateAgeBand(birthdate: string | null | undefined): string | null {
  if (!birthdate) return null;
  
  const birth = new Date(birthdate);
  const now = new Date();
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  
  if (months < 0) return null; // Future date
  
  if (months < 6) return '0-6m';
  if (months < 12) return '6-12m';
  if (months < 18) return '12-18m';
  if (months < 24) return '18-24m';
  
  const years = Math.floor(months / 12);
  if (years < 3) return '2-3y';
  if (years < 4) return '3-4y';
  if (years < 5) return '4-5y';
  if (years < 6) return '5-6y';
  
  return '6+';
}

