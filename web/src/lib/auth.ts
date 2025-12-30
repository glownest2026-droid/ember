import { createClient } from '../utils/supabase/server';

/**
 * Centralized server-side session reader.
 * Returns user and email from session cookies.
 * Use this as the single source of truth for auth state.
 */
export async function getServerUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return { user: null, email: null };
  }
  
  return { user, email: user.email || null };
}

