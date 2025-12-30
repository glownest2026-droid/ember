import { ReactNode } from 'react';
import { createClient } from '../../utils/supabase/server';
import { isAdmin } from '../../lib/admin';
import AppHeaderClient from '../../components/AppHeaderClient';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // Middleware already redirects if no user; this is defensive.
  const admin = await isAdmin();

  return (
    <div style={{ background: 'linear-gradient(180deg, var(--brand-bg-1, #FFFCF8) 0%, var(--brand-bg-2, #FFFFFF) 100%)', minHeight: '100vh' }}>
      <AppHeaderClient userEmail={user?.email} isAdmin={admin} />
      <main className="container-wrap py-6">{children}</main>
    </div>
  );
}
