/**
 * Centralized admin check using EMBER_ADMIN_EMAILS env var.
 * Email-based allowlist (comma-separated, case-insensitive).
 * 
 * @param email - User email to check (can be null/undefined)
 * @returns true if email is in allowlist, false otherwise
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }

  const adminEmails = process.env.EMBER_ADMIN_EMAILS;
  if (!adminEmails) {
    // If env var not set, no admins (fail secure)
    return false;
  }

  const allowedEmails = adminEmails
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(e => e.length > 0);

  return allowedEmails.includes(email.toLowerCase());
}

