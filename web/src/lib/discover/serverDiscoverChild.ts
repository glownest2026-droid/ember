import { createClient } from '@/utils/supabase/server';
import { firstNameFromProfile } from '@/lib/discover/personalization';

export type DiscoverChildPersonalization = {
  firstName: string | null;
  gender: string | null;
};

/**
 * Load child name/gender on the server so /discover hero personalizes on first paint.
 * Client-only fetch was unreliable (hydration / user timing / searchParams).
 */
export async function getDiscoverServerPersonalization(
  childId: string | null | undefined
): Promise<DiscoverChildPersonalization | null> {
  const id = typeof childId === 'string' ? childId.trim() : '';
  if (!id) return null;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const full = await supabase
    .from('children')
    .select('child_name, display_name, gender')
    .eq('id', id)
    .maybeSingle();

  let row = full.data as
    | { child_name?: string | null; display_name?: string | null; gender?: string | null }
    | null;

  if (full.error && (full.error.message?.includes('column') || full.error.code === '42703')) {
    const fb = await supabase.from('children').select('display_name, gender').eq('id', id).maybeSingle();
    row = fb.data as { display_name?: string | null; gender?: string | null } | null;
    if (row) {
      return {
        firstName: firstNameFromProfile(null, row.display_name),
        gender: row.gender?.trim() ?? null,
      };
    }
    return null;
  }

  if (full.error || !row) return null;

  return {
    firstName: firstNameFromProfile(row.child_name, row.display_name),
    gender: row.gender?.trim() ?? null,
  };
}
