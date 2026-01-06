'use server';

import { createClient } from '../../../../../utils/supabase/server';
import { isAdmin } from '../../../../../lib/admin';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Helper to check admin and get user
async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/signin?next=/app/admin/pl');
  }

  const admin = await isAdmin();
  if (!admin) {
    throw new Error('Not authorized');
  }

  return { supabase, user };
}

// Create draft set for age band + moment
export async function createDraftSet(ageBandId: string, momentId: string) {
  const { supabase, user } = await requireAdmin();

  // Insert the set
  const { data: set, error: setError } = await supabase
    .from('pl_age_moment_sets')
    .insert({
      age_band_id: ageBandId,
      moment_id: momentId,
      status: 'draft',
      created_by: user.id,
    })
    .select()
    .single();

  if (setError || !set) {
    return { error: setError?.message || 'Failed to create set' };
  }

  // Insert 3 placeholder cards with default lanes
  const defaultLanes = ['obvious', 'nearby', 'surprise'] as const;
  const cards = defaultLanes.map((lane, index) => ({
    set_id: set.id,
    lane,
    rank: index + 1,
    because: '',
  }));

  const { error: cardsError } = await supabase
    .from('pl_reco_cards')
    .insert(cards);

  if (cardsError) {
    return { error: cardsError.message || 'Failed to create cards' };
  }

  revalidatePath(`/app/admin/pl/${ageBandId}`);
  return { success: true, setId: set.id };
}

// Update a card
export async function updateCard(
  cardId: string,
  ageBandId: string,
  data: {
    lane?: string;
    because?: string;
    category_type_id?: string | null;
    product_id?: string | null;
  }
) {
  const { supabase } = await requireAdmin();

  // Clear one if the other is set (mutually exclusive)
  const updateData: any = {};
  if (data.lane !== undefined) updateData.lane = data.lane;
  if (data.because !== undefined) updateData.because = data.because;
  if (data.category_type_id !== undefined) {
    updateData.category_type_id = data.category_type_id;
    if (data.category_type_id) updateData.product_id = null;
  }
  if (data.product_id !== undefined) {
    updateData.product_id = data.product_id;
    if (data.product_id) updateData.category_type_id = null;
  }

  const { error } = await supabase
    .from('pl_reco_cards')
    .update(updateData)
    .eq('id', cardId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/app/admin/pl/${ageBandId}`);
  return { success: true };
}

// Add evidence to a card
export async function addEvidence(
  cardId: string,
  ageBandId: string,
  data: {
    source_type: string;
    url?: string;
    quote_snippet?: string;
    confidence: number;
  }
) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from('pl_evidence')
    .insert({
      card_id: cardId,
      source_type: data.source_type,
      url: data.url || null,
      quote_snippet: data.quote_snippet || null,
      confidence: data.confidence,
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/app/admin/pl/${ageBandId}`);
  return { success: true };
}

// Update evidence
export async function updateEvidence(
  evidenceId: string,
  ageBandId: string,
  data: {
    source_type?: string;
    url?: string;
    quote_snippet?: string;
    confidence?: number;
  }
) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from('pl_evidence')
    .update(data)
    .eq('id', evidenceId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/app/admin/pl/${ageBandId}`);
  return { success: true };
}

// Delete evidence
export async function deleteEvidence(evidenceId: string, ageBandId: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from('pl_evidence')
    .delete()
    .eq('id', evidenceId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/app/admin/pl/${ageBandId}`);
  return { success: true };
}

// Publish a set (with validation)
export async function publishSet(setId: string, ageBandId: string) {
  const { supabase } = await requireAdmin();

  // Fetch the set and its cards with evidence
  const { data: set, error: setError } = await supabase
    .from('pl_age_moment_sets')
    .select(`
      *,
      pl_reco_cards (
        id,
        rank,
        lane,
        because,
        category_type_id,
        product_id,
        pl_evidence (id)
      )
    `)
    .eq('id', setId)
    .single();

  if (setError || !set) {
    return { error: setError?.message || 'Set not found' };
  }

  const cards = set.pl_reco_cards || [];

  // Validation: exactly 3 cards
  if (cards.length !== 3) {
    return { error: `Set must have exactly 3 cards, found ${cards.length}` };
  }

  // Validation: each card must have at least 1 evidence
  for (const card of cards) {
    const evidence = (card as any).pl_evidence || [];
    if (evidence.length === 0) {
      return { error: `Card at rank ${card.rank} has no evidence. All cards must have at least 1 evidence to publish.` };
    }
  }

  // Validation: each card must have a target (category_type_id OR product_id) and non-empty because
  for (const card of cards) {
    if (!card.because || card.because.trim() === '') {
      return { error: `Card at rank ${card.rank} must have a "because" field` };
    }
    if (!card.category_type_id && !card.product_id) {
      return { error: `Card at rank ${card.rank} must have either a category type or a product` };
    }
  }

  // All validations passed, publish
  const { error: updateError } = await supabase
    .from('pl_age_moment_sets')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', setId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath(`/app/admin/pl/${ageBandId}`);
  return { success: true };
}

// Unpublish a set
export async function unpublishSet(setId: string, ageBandId: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from('pl_age_moment_sets')
    .update({
      status: 'draft',
      published_at: null,
    })
    .eq('id', setId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/app/admin/pl/${ageBandId}`);
  return { success: true };
}

