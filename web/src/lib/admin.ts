import { createClient } from '../utils/supabase/server';

/**
 * Check if email is in admin allowlist (case-insensitive, trims whitespace).
 * Uses EMBER_ADMIN_EMAILS env var (comma-separated).
 */
export function isAdminEmail(email?: string | null): boolean {
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

export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    // Use email-based allowlist if available
    if (isAdminEmail(user.email)) {
      return true;
    }

    // Fallback to database check for backwards compatibility
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (error || !data) {
      return false;
    }

    return data.role === 'admin';
  } catch (err) {
    return false;
  }
}

