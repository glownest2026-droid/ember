export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { FamilySignInRequired } from '@/components/family/FamilySignInRequired';
import { AtHomeClient } from '@/components/family/AtHomeClient';

/** /family/at-home — household owned items (At home). */
export default async function AtHomePage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const params = await searchParams;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="container-wrap min-h-screen py-8">
        <FamilySignInRequired />
      </div>
    );
  }

  return (
    <div className="container-wrap min-h-screen py-6">
      <Suspense fallback={<p className="text-sm text-[#66717D]">Loading At home…</p>}>
        <AtHomeClient initialChildId={params.child ?? undefined} />
      </Suspense>
    </div>
  );
}
