import { createClient } from '../utils/supabase/server';

export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.email) {
      return false;
    }

    // Use env var allowlist (comma-separated emails)
    const adminEmails = process.env.EMBER_ADMIN_EMAILS;
    if (!adminEmails) {
      return false;
    }

    const allowedEmails = adminEmails.split(',').map(e => e.trim().toLowerCase());
    return allowedEmails.includes(user.email.toLowerCase());
  } catch (err) {
    return false;
  }
}

