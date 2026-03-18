import { createClient } from '@/utils/supabase/server';
import { displayLabelFromProfile, monthsOldFromBirthdate } from '@/lib/discover/personalization';

export type DiscoverChildPersonalization = {
  displayLabel: string | null;
  gender: string | null;
  monthsOld: number | null;
};

function rowToPersonalization(row: {
  child_name?: string | null;
  display_name?: string | null;
  gender?: string | null;
  birthdate?: string | null;
}): DiscoverChildPersonalization {
  return {
    displayLabel: displayLabelFromProfile(row.child_name, row.display_name),
    gender: row.gender?.trim() ?? null,
    monthsOld: monthsOldFromBirthdate(row.birthdate ?? null),
  };
}

/**
 * Load child label/gender/birthdate on the server so /discover hero personalizes on first paint.
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
    .select('child_name, display_name, gender, birthdate')
    .eq('id', id)
    .maybeSingle();

  let row = full.data as
    | {
        child_name?: string | null;
        display_name?: string | null;
        gender?: string | null;
        birthdate?: string | null;
      }
    | null;

  if (full.error && (full.error.message?.includes('column') || full.error.code === '42703')) {
    const fb = await supabase
      .from('children')
      .select('display_name, gender, birthdate')
      .eq('id', id)
      .maybeSingle();
    const r = fb.data as { display_name?: string | null; gender?: string | null; birthdate?: string | null } | null;
    if (r) {
      return rowToPersonalization({
        child_name: null,
        display_name: r.display_name,
        gender: r.gender,
        birthdate: r.birthdate,
      });
    }
    const fb2 = await supabase.from('children').select('display_name, gender').eq('id', id).maybeSingle();
    const r2 = fb2.data as { display_name?: string | null; gender?: string | null } | null;
    if (r2) {
      return rowToPersonalization({
        child_name: null,
        display_name: r2.display_name,
        gender: r2.gender,
        birthdate: null,
      });
    }
    return null;
  }

  if (full.error || !row) return null;

  return rowToPersonalization(row);
}
