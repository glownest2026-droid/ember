export const dynamic = "force-dynamic";
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { createClient } from '../../../../utils/supabase/server';

/**
 * Admin layout: Enforces admin-only access for all /app/admin/* routes.
 * Admin = public.user_roles.role='admin' for auth.uid().
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Step 1: Check if user is authenticated
  if (!user) {
    redirect('/signin?next=/app/admin');
  }

  // Step 2: Query public.user_roles for admin role
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .limit(1)
    .single();

  // Step 3: If query errors or no admin role found, treat as not-authorized
  if (roleError || !roleData || roleData.role !== 'admin') {
    // Redirect to /app (match existing "no access" behaviour)
    redirect('/app');
  }

  // Step 4: If admin, render children
  return <>{children}</>;
}

