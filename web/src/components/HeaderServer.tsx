import Header from './Header';
import { createClient } from '../utils/supabase/server';
import { isAdminEmail } from '../lib/admin';
import SignOutButton from '../app/components/SignOutButton';

export default async function HeaderServer({ homeHref = '/' }: { homeHref?: string }) {
  // READ-ONLY auth read: middleware handles cookie refresh/cleanup
  // Wrap in try/catch to handle any auth errors gracefully
  let user = null;
  let admin = false;
  
  try {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;
    admin = user?.email ? isAdminEmail(user.email) : false;
  } catch (err) {
    // On any error, treat as signed out (render logged-out header)
    // Do NOT attempt to clear cookies here - middleware handles that
    user = null;
    admin = false;
  }

  return (
    <Header 
      userEmail={user?.email || undefined} 
      isAdmin={admin} 
      signOutButton={<SignOutButton />}
      homeHref={homeHref}
    />
  );
}

