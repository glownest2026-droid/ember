'use server';

import { createClient } from '../../../../../utils/supabase/server';
import { isAdmin } from '../../../../../lib/admin';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { selectProductsForSlots, calculateAgeBandMidpoint } from '@/lib/pl/autopilot';

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
    is_locked?: boolean;
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
  if (data.is_locked !== undefined) {
    updateData.is_locked = data.is_locked;
    if (data.is_locked) {
      updateData.locked_at = new Date().toISOString();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        updateData.locked_by = user.id;
      }
    } else {
      updateData.locked_at = null;
      updateData.locked_by = null;
    }
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

  // Get product's why_it_matters for auto-fill
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('why_it_matters')
    .eq('id', data.product_id)
    .single();

  const whyItMatters = product?.why_it_matters || '';

  // Update the card with product_id, category_type_id, and auto-fill because
  const { error: updateError } = await supabase
    .from('pl_reco_cards')
    .update({
      product_id: data.product_id,
      category_type_id: categoryType.id,
      because: whyItMatters, // Auto-fill from product
    })
    .eq('id', cardId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath(`/app/admin/pl/${ageBandId}`);
  return { success: true };
}

// ============================================================================
// AUTOPILOT ACTIONS
// ============================================================================

// Get autopilot weights from site_settings
export async function getAutopilotWeights() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from('site_settings')
    .select('theme')
    .eq('id', 'global')
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows returned, which is OK (use defaults)
    return { error: error.message };
  }

  const theme = (data?.theme as any) || {};
  const plAutopilot = theme.pl_autopilot || {};
  const weights = plAutopilot.weights;

  // Default weights if not set
  const defaultWeights = {
    confidence: 0.45,
    quality: 0.45,
    anchor: 0.10,
  };

  return {
    success: true,
    weights: weights || defaultWeights,
  };
}

// Save autopilot weights to site_settings
export async function saveAutopilotWeights(weights: { confidence: number; quality: number; anchor: number }) {
  const { supabase, user } = await requireAdmin();

  // Normalize weights to sum to 1.0
  const total = weights.confidence + weights.quality + weights.anchor;
  const normalized = {
    confidence: weights.confidence / total,
    quality: weights.quality / total,
    anchor: weights.anchor / total,
  };

  // Get current theme
  const { data: currentData } = await supabase
    .from('site_settings')
    .select('theme')
    .eq('id', 'global')
    .single();

  const currentTheme = (currentData?.theme as any) || {};
  const updatedTheme = {
    ...currentTheme,
    pl_autopilot: {
      ...currentTheme.pl_autopilot,
      weights: normalized,
    },
  };

  // Update or insert
  const { error: updateError } = await supabase
    .from('site_settings')
    .update({
      theme: updatedTheme,
      updated_by: user.id,
    })
    .eq('id', 'global');

  if (updateError) {
    // Try insert if update fails
    const { error: insertError } = await supabase
      .from('site_settings')
      .insert({
        id: 'global',
        theme: updatedTheme,
        updated_by: user.id,
      });

    if (insertError) {
      return { error: insertError.message };
    }
  }

  return { success: true, weights: normalized };
}

// Regenerate draft set using autopilot
export async function regenerateDraftSet(
  setId: string,
  ageBandId: string,
  momentId: string
) {
  const { supabase } = await requireAdmin();

  // Get age band to calculate midpoint
  const { data: ageBand, error: ageBandError } = await supabase
    .from('pl_age_bands')
    .select('min_months, max_months')
    .eq('id', ageBandId)
    .single();

  if (ageBandError || !ageBand) {
    return { error: 'Age band not found' };
  }

  const ageBandMidpoint = (ageBand.min_months + ageBand.max_months) / 2;

  // Get autopilot weights
  const weightsResult = await getAutopilotWeights();
  if (weightsResult.error) {
    return { error: weightsResult.error };
  }
  const weights = weightsResult.weights!;

  // Get pool items for this moment (if any)
  const { data: poolItems } = await supabase
    .from('pl_pool_items')
    .select('category_type_id')
    .eq('age_band_id', ageBandId)
    .eq('moment_id', momentId);

  const poolCategoryIds = poolItems?.map((p) => p.category_type_id).filter(Boolean) as string[] | undefined;

  // Get eligible products
  const { data: productsData } = await supabase
    .from('v_pl_product_fits_ready_for_recs')
    .select('*')
    .eq('age_band_id', ageBandId)
    .eq('is_ready_for_recs', true);

  if (!productsData || productsData.length === 0) {
    return { error: 'No eligible products found' };
  }

  // Get product fits for scores (including stage_anchor_month if available)
  const productIds = productsData.map((p: any) => p.product_id).filter(Boolean);
  const { data: productFitsData } = await supabase
    .from('pl_product_fits')
    .select('product_id, confidence_score_0_to_10, quality_score_0_to_10, stage_anchor_month')
    .eq('age_band_id', ageBandId)
    .in('product_id', productIds);

  const productFitsMap: Record<string, any> = {};
  if (productFitsData) {
    productFitsData.forEach((fit: any) => {
      productFitsMap[fit.product_id] = {
        confidence_score_0_to_10: fit.confidence_score_0_to_10,
        quality_score_0_to_10: fit.quality_score_0_to_10,
        stage_anchor_month: fit.stage_anchor_month,
      };
    });
  }

  // Get products table for why_it_matters
  const { data: productsTableData } = await supabase
    .from('products')
    .select('id, why_it_matters')
    .in('id', productIds);

  const whyItMattersMap: Record<string, string | null> = {};
  if (productsTableData) {
    productsTableData.forEach((p: any) => {
      whyItMattersMap[p.id] = p.why_it_matters;
    });
  }

  // Transform to candidates
  const candidates = productsData.map((p: any) => ({
    id: p.product_id,
    name: p.product_name,
    brand: p.product_brand,
    category_type_id: null, // Will need to get from products table
    category_type_slug: p.category_type_slug,
    confidence_score_0_to_10: productFitsMap[p.product_id]?.confidence_score_0_to_10,
    quality_score_0_to_10: productFitsMap[p.product_id]?.quality_score_0_to_10,
    stage_anchor_month: productFitsMap[p.product_id]?.stage_anchor_month,
    evidence_count: p.evidence_count,
    evidence_domain_count: p.evidence_domain_count,
    is_ready_for_publish: p.is_ready_for_publish,
    why_it_matters: whyItMattersMap[p.id] || null,
  }));

  // Get category_type_id for each product
  const { data: productsWithCategory } = await supabase
    .from('products')
    .select('id, category_type_id')
    .in('id', productIds);

  const categoryMap: Record<string, string | null> = {};
  if (productsWithCategory) {
    productsWithCategory.forEach((p: any) => {
      categoryMap[p.id] = p.category_type_id;
    });
  }

  // Update candidates with category_type_id
  candidates.forEach((c: any) => {
    c.category_type_id = categoryMap[c.id] || null;
  });

  const midpoint = calculateAgeBandMidpoint(ageBand.min_months, ageBand.max_months);
  const selected = selectProductsForSlots(candidates, weights, midpoint, poolCategoryIds);

  // Get existing cards (only update unlocked ones)
  const { data: existingCards } = await supabase
    .from('pl_reco_cards')
    .select('id, lane, rank, is_locked')
    .eq('set_id', setId)
    .order('rank', { ascending: true });

  if (!existingCards || existingCards.length < 3) {
    return { error: 'Set must have 3 cards' };
  }

  // Map slots to lanes
  const laneMap: Record<string, 'obvious' | 'nearby' | 'surprise'> = {
    slot1: 'obvious',
    slot2: 'nearby',
    slot3: 'surprise',
  };

  // Update cards (only unlocked ones)
  for (let i = 0; i < 3; i++) {
    const card = existingCards[i];
    const slotKey = `slot${i + 1}` as 'slot1' | 'slot2' | 'slot3';
    const selectedProduct = selected[slotKey];

    if (!card || card.is_locked) {
      continue; // Skip locked cards
    }

    if (!selectedProduct) {
      continue; // No product selected for this slot
    }

    // Get category_type_id for the product
    const categoryTypeId = categoryMap[selectedProduct.id] || null;

    // Update card
    const { error: updateError } = await supabase
      .from('pl_reco_cards')
      .update({
        product_id: selectedProduct.id,
        category_type_id: categoryTypeId,
        because: selectedProduct.why_it_matters || '', // Auto-fill from product
      })
      .eq('id', card.id);

    if (updateError) {
      return { error: `Failed to update card ${card.id}: ${updateError.message}` };
    }
  }

  revalidatePath(`/app/admin/pl/${ageBandId}`);
  return { success: true };
}

// Ensure draft set exists and is populated (auto-populate if needed)
export async function ensureDraftSetPopulated(
  ageBandId: string,
  momentId: string
) {
  const { supabase } = await requireAdmin();

  // Check if set exists
  const { data: existingSet } = await supabase
    .from('pl_age_moment_sets')
    .select(`
      id,
      status,
      pl_reco_cards (id, is_locked, product_id, category_type_id)
    `)
    .eq('age_band_id', ageBandId)
    .eq('moment_id', momentId)
    .single();

  let setId: string;

  if (!existingSet) {
    // Create draft set
    const createResult = await createDraftSet(ageBandId, momentId);
    if (createResult.error || !createResult.setId) {
      return { error: createResult.error || 'Failed to create set' };
    }
    setId = createResult.setId;
  } else {
    setId = existingSet.id;
    
    // If set is published, don't auto-populate
    if (existingSet.status === 'published') {
      return { success: true, skipped: true };
    }

    // Check if cards exist and are populated
    const cards = existingSet.pl_reco_cards || [];
    const populatedCards = cards.filter((c: any) => c.product_id || c.category_type_id);
    
    // If we have 3+ populated cards, we're done
    if (populatedCards.length >= 3) {
      return { success: true, skipped: true };
    }
  }

  // Auto-populate using autopilot
  const regenerateResult = await regenerateDraftSet(setId, ageBandId, momentId);
  if (regenerateResult.error) {
    return { error: regenerateResult.error };
  }

  return { success: true };
}

