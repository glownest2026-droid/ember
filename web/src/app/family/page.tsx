export const dynamic = 'force-dynamic';

import { createClient } from '@/utils/supabase/server';
import { FamilySignInRequired } from '@/components/family/FamilySignInRequired';
import { FamilyDashboardClient } from '@/components/family/FamilyDashboardClient';

/** /family — Manage My Family dashboard (authenticated). Shell only; no DB reads/writes. */
export default async function FamilyPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="container-wrap min-h-screen py-8">
        <FamilySignInRequired />
      </div>
    );
  }

  return (
    <div className="container-wrap min-h-screen py-6">
      <FamilyDashboardClient />
    </div>
  );
}
