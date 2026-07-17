export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { FamilySignInRequired } from '@/components/family/FamilySignInRequired';
import { AtHomeAddClient } from '@/components/family/AtHomeAddClient';

/** /family/at-home/add — text-first At home add with Stage 2 confirm. */
export default async function AtHomeAddPage({
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
      <Suspense fallback={<p className="text-sm text-[#66717D]">Loading…</p>}>
        <AtHomeAddClient initialChildId={params.child ?? undefined} />
      </Suspense>
    </div>
  );
}
