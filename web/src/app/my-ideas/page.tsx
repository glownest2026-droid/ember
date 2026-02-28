export const dynamic = 'force-dynamic';

import { createClient } from '@/utils/supabase/server';
import { FamilySignInRequired } from '@/components/family/FamilySignInRequired';
import { MyIdeasClient } from '@/components/family/MyIdeasClient';

/** /my-ideas — My list, today, next steps (authenticated). Content moved from /family below child profiles. */
export default async function MyIdeasPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const params = await searchParams;
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
      <MyIdeasClient initialChildId={params.child ?? undefined} />
    </div>
  );
}
