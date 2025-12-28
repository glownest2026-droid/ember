import { ReactNode } from 'react';
import Link from 'next/link';
import SignOutButton from '../components/SignOutButton';
import { createClient } from '../../utils/supabase/server';
import { isAdmin } from '../../lib/admin';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // Middleware already redirects if no user; this is defensive.
  const admin = await isAdmin();

  return (
    <div style={{ background: 'var(--brand-bg, #FFFCF8)', minHeight: '100vh' }}>
      <header className="container-wrap py-4 flex items-center justify-between">
        <Link href="/app" className="font-semibold" style={{ fontFamily: 'var(--brand-font-head, inherit)' }}>Ember — Dashboard</Link>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <Link href="/app/children" className="hover:underline" style={{ color: 'var(--brand-text, inherit)' }}>Child Profiles</Link>
              <Link href="/app/recs" className="hover:underline" style={{ color: 'var(--brand-text, inherit)' }}>Recommendations</Link>
              {admin && (
                <Link href="/app/admin/theme" className="hover:underline" style={{ color: 'var(--brand-primary, inherit)' }}>Theme</Link>
              )}
              <span style={{ color: 'var(--brand-muted, #6b7280)' }}>Signed in as {user.email}</span>
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
