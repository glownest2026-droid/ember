export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { calculateAgeBand } from '@/lib/ageBand';
import { AddChildrenListClient } from './AddChildrenListClient';

export default async function AddChildrenPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const params = await searchParams;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-[var(--ember-text-high)]">
          Please <Link className="underline text-[var(--ember-accent-base)]" href="/signin?next=/add-children">sign in</Link>.
        </p>
      </div>
    );
  }

  const { data: children, error } = await supabase
    .from('children')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-red-600">
        Error: {error.message}
      </div>
    );
  }

  const items = (children ?? []).map((c: { id: string; birthdate?: string | null; gender?: string | null; age_band?: string | null }) => ({
    id: c.id,
    birthdate: c.birthdate ?? null,
    gender: c.gender ?? null,
    age_band: c.age_band ?? (c.birthdate ? calculateAgeBand(c.birthdate) : null),
  }));

  return (
    <AddChildrenListClient
      children={items}
      saved={params.saved === '1'}
      deleted={params.deleted === '1'}
    />
  );
}
