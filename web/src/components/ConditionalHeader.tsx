import { createClient } from '../utils/supabase/server';
import Header from './Header';

/**
 * Server-side header wrapper for public pages.
 * App routes have their own header in (app)/layout.tsx.
 */
export default async function ConditionalHeader() {
  // Read session server-side for public pages
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return <Header userEmail={user?.email || null} />;
}
