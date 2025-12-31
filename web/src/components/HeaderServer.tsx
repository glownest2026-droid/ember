import Header from './Header';
import { createClient } from '../utils/supabase/server';
import { isAdminEmail } from '../lib/admin';
import SignOutButton from '../app/components/SignOutButton';

export default async function HeaderServer({ homeHref = '/' }: { homeHref?: string }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = user?.email ? isAdminEmail(user.email) : false;

  return (
    <Header 
      userEmail={user?.email} 
      isAdmin={admin} 
      signOutButton={<SignOutButton />}
      homeHref={homeHref}
    />
  );
}

