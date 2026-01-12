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

  // Server-side validation: if both category_type_id and product_id are set, validate they match
  const finalCategoryTypeId = data.category_type_id !== undefined 
    ? (data.category_type_id || null)
    : null; // Will fetch from existing card if not provided
  const finalProductId = data.product_id !== undefined 
    ? (data.product_id || null)
    : null; // Will fetch from existing card if not provided

  // If both are being set, we need to validate
  if (finalCategoryTypeId && finalProductId) {
    // Get the product's category_type_id from products table
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('category_type_id')
      .eq('id', finalProductId)
      .single();

    if (productError || !product) {
      return { error: `Product not found: ${productError?.message || 'Unknown error'}` };
    }

    // Check if product's category matches the selected category
    if (product.category_type_id !== finalCategoryTypeId) {
      return { error: 'Selected product does not belong to selected category type for this age band.' };
    }
  } else if (finalProductId && !finalCategoryTypeId) {
    // If only product is being set, fetch current category from card
    const { data: card, error: cardError } = await supabase
      .from('pl_reco_cards')
      .select('category_type_id')
      .eq('id', cardId)
      .single();

    if (!cardError && card?.category_type_id) {
      // Validate product matches existing category
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('category_type_id')
        .eq('id', finalProductId)
        .single();

      if (productError || !product) {
        return { error: `Product not found: ${productError?.message || 'Unknown error'}` };
      }

      if (product.category_type_id !== card.category_type_id) {
        return { error: 'Selected product does not belong to selected category type for this age band.' };
      }
    }
  } else if (finalCategoryTypeId && !finalProductId) {
    // If only category is being set, fetch current product from card
    const { data: card, error: cardError } = await supabase
      .from('pl_reco_cards')
      .select('product_id')
      .eq('id', cardId)
      .single();

    if (!cardError && card?.product_id) {
      // Validate existing product matches new category
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('category_type_id')
        .eq('id', card.product_id)
        .single();

      if (productError || !product) {
        return { error: `Product not found: ${productError?.message || 'Unknown error'}` };
      }

      if (product.category_type_id !== finalCategoryTypeId) {
        return { error: 'Selected product does not belong to selected category type for this age band.' };
      }
    }
  }

  // Allow both category_type_id and product_id to be set (v1: both can be set)
  const updateData: any = {};
  if (data.lane !== undefined) updateData.lane = data.lane;
  if (data.because !== undefined) updateData.because = data.because;
  if (data.category_type_id !== undefined) {
    updateData.category_type_id = data.category_type_id || null;
  }
  if (data.product_id !== undefined) {
    updateData.product_id = data.product_id || null;
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
      return { error: `Card at rank ${card.rank} must have a "Why it can work" field` };
    }
    if (!card.category_type_id && !card.product_id) {
      return { error: `Card at rank ${card.rank} must have either a category type or a product` };
    }
  }

  // Validation: if both category_type_id and product_id are set, validate they match
  const cardsWithBoth = cards.filter((card: any) => card.category_type_id && card.product_id);
  if (cardsWithBoth.length > 0) {
    const productIds = cardsWithBoth.map((card: any) => card.product_id);
    
    // Fetch products to get their category_type_id
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, category_type_id')
      .in('id', productIds);

    if (productsError) {
      return { error: `Error validating product-category match: ${productsError.message}` };
    }

    const productsMap = new Map(
      (productsData || []).map((p: any) => [p.id, p.category_type_id])
    );

    // Check each card for mismatch
    const mismatchedCards: string[] = [];
    for (const card of cardsWithBoth) {
      const productCategoryId = productsMap.get(card.product_id);
      if (productCategoryId !== card.category_type_id) {
        mismatchedCards.push(`Card at rank ${card.rank}`);
      }
    }

    if (mismatchedCards.length > 0) {
      return { 
        error: `Cannot publish: Selected product does not belong to selected category type for this age band in ${mismatchedCards.join(', ')}.` 
      };
    }
  }

  // Validation: product publish readiness gating
  // For cards with product_id, check if product is publish-ready (is_ready_for_publish = true)
  const cardsWithProducts = cards.filter((card: any) => card.product_id);
  if (cardsWithProducts.length > 0) {
    const productIds = cardsWithProducts.map((card: any) => card.product_id);
    
    // Query v_pl_product_fits_ready_for_recs to check publish readiness
    const { data: productFitsData, error: productFitsError } = await supabase
      .from('v_pl_product_fits_ready_for_recs')
      .select('product_id, product_name, is_ready_for_publish')
      .eq('age_band_id', ageBandId)
      .in('product_id', productIds);

    if (productFitsError) {
      return { error: `Error checking product publish readiness: ${productFitsError.message}` };
    }

    // Build map of product_id -> publish readiness
    const productReadinessMap: Record<string, { name: string; isReady: boolean }> = {};
    if (productFitsData) {
      productFitsData.forEach((fit: any) => {
        productReadinessMap[fit.product_id] = {
          name: fit.product_name || 'Unknown Product',
          isReady: fit.is_ready_for_publish === true,
        };
      });
    }

    // Check each card's product for publish readiness
    const notReadyProducts: string[] = [];
    for (const card of cardsWithProducts) {
      const productInfo = productReadinessMap[card.product_id];
      if (!productInfo) {
        // Product not found in view - treat as not ready
        notReadyProducts.push(`Product ID ${card.product_id} (not found in catalogue)`);
      } else if (!productInfo.isReady) {
        notReadyProducts.push(productInfo.name);
      }
    }

    if (notReadyProducts.length > 0) {
      return { 
        error: `Cannot publish: The following products are not publish-ready (need >=2 evidence AND >=2 domains): ${notReadyProducts.join(', ')}` 
      };
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

// Add item to pool
export async function addPoolItem(
  ageBandId: string,
  momentId: string,
  data: {
    category_type_id: string;
    note?: string;
  }
) {
  const { supabase, user } = await requireAdmin();

  const { error } = await supabase
    .from('pl_pool_items')
    .insert({
      age_band_id: ageBandId,
      moment_id: momentId,
      category_type_id: data.category_type_id,
      note: data.note || null,
      created_by: user.id,
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/app/admin/pl/${ageBandId}`);
  return { success: true };
}

// Remove item from pool
export async function removePoolItem(poolItemId: string, ageBandId: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from('pl_pool_items')
    .delete()
    .eq('id', poolItemId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/app/admin/pl/${ageBandId}`);
  return { success: true };
}

// Use pool item in card (assigns category_type_id to card)
export async function usePoolItemInCard(
  poolItemId: string,
  cardId: string,
  ageBandId: string
) {
  const { supabase } = await requireAdmin();

  // Get pool item to get category_type_id
  const { data: poolItem, error: poolError } = await supabase
    .from('pl_pool_items')
    .select('category_type_id')
    .eq('id', poolItemId)
    .single();

  if (poolError || !poolItem) {
    return { error: poolError?.message || 'Pool item not found' };
  }

  // Update card with category_type_id from pool item
  // Note: product_id is not cleared, allowing both to be set if needed
  const { error: updateError } = await supabase
    .from('pl_reco_cards')
    .update({
      category_type_id: poolItem.category_type_id,
    })
    .eq('id', cardId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath(`/app/admin/pl/${ageBandId}`);
  return { success: true };
}

// Create a new card for a set
export async function createCard(
  setId: string,
  ageBandId: string,
  data: {
    lane: string;
    rank: number;
  }
) {
  const { supabase } = await requireAdmin();

  // Insert the card
  const { data: card, error: cardError } = await supabase
    .from('pl_reco_cards')
    .insert({
      set_id: setId,
      lane: data.lane,
      rank: data.rank,
      because: '',
    })
    .select()
    .single();

  if (cardError || !card) {
    return { error: cardError?.message || 'Failed to create card' };
  }

  revalidatePath(`/app/admin/pl/${ageBandId}`);
  return { success: true, cardId: card.id };
}

// Place a product into a card slot (with category auto-align)
export async function placeProductIntoSlot(
  cardId: string,
  ageBandId: string,
  data: {
    product_id: string;
    category_type_slug: string;
  }
) {
  const { supabase } = await requireAdmin();

  // Find category_type_id that matches the product's category_type_slug
  const { data: categoryType, error: categoryError } = await supabase
    .from('pl_category_types')
    .select('id')
    .eq('slug', data.category_type_slug)
    .single();

  if (categoryError || !categoryType) {
    return { error: `Category type not found for slug: ${data.category_type_slug}` };
  }

  // Update the card with product_id and category_type_id
  const { error: updateError } = await supabase
    .from('pl_reco_cards')
    .update({
      product_id: data.product_id,
      category_type_id: categoryType.id,
    })
    .eq('id', cardId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath(`/app/admin/pl/${ageBandId}`);
  return { success: true };
}

