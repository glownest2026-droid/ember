'use server';

import { createClient } from '../../../utils/supabase/server';
import { calculateAgeBand } from '../../../lib/ageBand';
import { redirect } from 'next/navigation';

export async function saveChild(formData: FormData, childId?: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/signin?next=/app/children');
  }

  const birthdate = String(formData.get('birthdate') || '').trim() || null;
  const gender = String(formData.get('gender') || '').trim() || null;
  
  // Calculate age band from birthdate if provided
  const computedAgeBand = birthdate ? calculateAgeBand(birthdate) : null;
  const age_band = computedAgeBand || null;

  const childData: any = {
    user_id: user.id, // Set from server, never from client
    birthdate: birthdate || null,
    gender: gender || null,
    age_band: age_band,
    preferences: {},
  };

  if (childId) {
    // Update existing
    const { error } = await supabase
      .from('children')
      .update(childData)
      .eq('id', childId)
      .eq('user_id', user.id);
    
    if (error) {
      return { error: error.message };
    }
  } else {
    // Insert new
    const { error } = await supabase
      .from('children')
      .insert(childData);
    
    if (error) {
      return { error: error.message };
    }
  }

  // Redirect on success (throws internally, which is expected)
  redirect('/app/children');
}

export async function deleteChild(childId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/signin?next=/app/children');
  }

  const { error } = await supabase
    .from('children')
    .delete()
    .eq('id', childId)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  // Redirect on success (throws internally, which is expected)
  redirect('/app/children');
}

