import { createClient } from '@/utils/supabase/server';
import {
  personalizationFromChildrenRow,
  type DiscoverChildPersonalization,
} from '@/lib/discover/personalization';

export type { DiscoverChildPersonalization };

/**
 * Load child row on the server so /discover hero personalizes on first paint.
 * Uses select('*') so missing optional columns never break the query (unlike fixed column lists).
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

  const { data, error } = await supabase.from('children').select('*').eq('id', id).maybeSingle();
  if (error || !data) return null;

  return personalizationFromChildrenRow(data as Record<string, unknown>);
}
