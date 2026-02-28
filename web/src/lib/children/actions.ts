'use server';

import { createClient } from '@/utils/supabase/server';
import { calculateAgeBand } from '@/lib/ageBand';
import { redirect } from 'next/navigation';

const NEXT_ADD_CHILDREN = '/add-children';
const FAMILY_PAGE = '/family';

export async function saveChild(formData: FormData, childId?: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/signin?next=${NEXT_ADD_CHILDREN}`);
  }

  const display_name = String(formData.get('display_name') || '').trim() || null;
  const birthdate = String(formData.get('birthdate') || '').trim() || null;
  const gender = String(formData.get('gender') || '').trim() || null;

  const computedAgeBand = birthdate ? calculateAgeBand(birthdate) : null;
  const age_band = computedAgeBand || null;

  const childData: Record<string, unknown> = {
    user_id: user.id,
    display_name: display_name,
    birthdate: birthdate || null,
    gender: gender || null,
    age_band: age_band,
    preferences: {},
  };

  if (childId) {
    const { error } = await supabase
      .from('children')
      .update(childData)
      .eq('id', childId)
      .eq('user_id', user.id);

    if (error) {
      return { error: error.message };
    }
  } else {
    const { error } = await supabase.from('children').insert(childData);

    if (error) {
      return { error: error.message };
    }
  }

  redirect(`${FAMILY_PAGE}?saved=1`);
}

export async function deleteChild(childId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/signin?next=${NEXT_ADD_CHILDREN}`);
  }

  const { error } = await supabase
    .from('children')
    .delete()
    .eq('id', childId)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  redirect(`${FAMILY_PAGE}?deleted=1`);
}
