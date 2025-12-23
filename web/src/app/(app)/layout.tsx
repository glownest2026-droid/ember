import { ReactNode } from 'react';
import Link from 'next/link';
import SignOutButton from '../components/SignOutButton';
import { createClient } from '../../utils/supabase/server';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // Middleware already redirects if no user; this is defensive.

  return (
    <div>
      <header className="container-wrap py-4 flex items-center justify-between">
        <Link href="/app" className="font-semibold">Ember — Dashboard</Link>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <Link href="/app/children" className="hover:underline">Child Profiles</Link>
              <Link href="/app/recs" className="hover:underline">Recommendations</Link>
              <span className="text-gray-600">Signed in as {user.email}</span>
              <SignOutButton />
            </>
          ) : (
            <Link href="/signin" className="hover:underline">Sign in</Link>
          )}
        </div>
      </header>
      <main className="container-wrap py-6">{children}</main>
    </div>
  );
}
