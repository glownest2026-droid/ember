import Header from './Header';
import { getServerUser } from '../lib/auth';
import { isAdminEmail } from '../lib/admin';
import SignOutButton from '../app/components/SignOutButton';

/**
 * Server-side header wrapper that reads session and passes auth state to Header.
 * Use this as the single source of truth for header auth state.
 */
export default async function HeaderServer({ homeHref = '/' }: { homeHref?: string } = {}) {
  const { user, email } = await getServerUser();
  const admin = isAdminEmail(email);

  return (
    <Header 
      userEmail={email}
      isAdmin={admin}
      signOutButton={<SignOutButton />}
      homeHref={homeHref}
    />
  );
}

