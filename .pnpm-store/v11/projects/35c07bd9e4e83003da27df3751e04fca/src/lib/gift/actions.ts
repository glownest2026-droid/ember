'use server';

import { createClient } from '@/utils/supabase/server';

const SLUG_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

/** Generate an 8–12 character URL-safe slug (non-sequential). */
function generateSlug(): string {
  const bytes = new Uint8Array(10);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  }
  let s = '';
  for (let i = 0; i < 10; i++) {
    s += SLUG_CHARS[bytes[i]! % SLUG_CHARS.length];
  }
  return s;
}

/**
 * Get existing gift share slug for the current user, or create one.
 * Used by Copy link and Preview in /family. Returns null if not authenticated.
 */
export async function getOrCreateGiftShareSlug(): Promise<{ slug: string } | { error: string } | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: existing } = await supabase
    .from('gift_shares')
    .select('slug')
    .eq('user_id', user.id)
    .single();

  if (existing?.slug) {
    return { slug: existing.slug };
  }

  let slug = generateSlug();
  for (let i = 0; i < 5; i++) {
    const { error } = await supabase.from('gift_shares').insert({
      user_id: user.id,
      slug,
    });
    if (!error) {
      return { slug };
    }
    if (error.code === '23505') {
      slug = generateSlug();
      continue;
    }
    return { error: error.message };
  }
  return { error: 'Failed to create share slug' };
}
