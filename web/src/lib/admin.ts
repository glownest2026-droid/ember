/**
 * Check if email is in admin allowlist (case-insensitive, trims whitespace).
 * Uses EMBER_ADMIN_EMAILS env var (comma-separated).
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }

  const adminEmails = process.env.EMBER_ADMIN_EMAILS;
  if (!adminEmails) {
    return false;
  }

  const allowedEmails = adminEmails
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(e => e.length > 0);

  return allowedEmails.includes(email.toLowerCase());
}

// Legacy function for backwards compatibility
export async function isAdmin(): Promise<boolean> {
  try {
    const { createClient } = await import('../utils/supabase/server');
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.email) {
      return false;
    }

    return isAdminEmail(user.email);
  } catch (err) {
    return false;
  }
}

