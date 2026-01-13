'use client';

import { useState, useTransition, useMemo, useEffect } from 'react';
import { createDraftSet, updateCard, publishSet, unpublishSet, createCard, placeProductIntoSlot, getAutopilotWeights, saveAutopilotWeights, regenerateDraftSet } from '../../_actions';

type Moment = {
  id: string;
  label: string;
  description?: string;
};

type Set = {
  id: string;
  status: string;
  headline?: string;
  published_at?: string;
  pl_reco_cards?: Card[];
};

type Card = {
  id: string;
  rank: number;
  lane: string;
  because: string;
  category_type_id?: string;
  product_id?: string;
  is_locked?: boolean;
  pl_evidence?: Array<{
    id: string;
    source_type: string;
    url?: string;
    quote_snippet?: string;
    confidence: number;
  }>;
};

type CategoryType = {
  id: string;
  slug: string;
  name: string;
  label?: string;
  description?: string | null;
  image_url?: string | null;
};

type Product = {
  id: string;
  name: string;
  brand?: string;
  category_type_id?: string | null;
  category_type_slug?: string;
  evidence_count?: number;
  evidence_domain_count?: number;
  is_ready_for_publish?: boolean;
  confidence_score_0_to_10?: number | null;
  quality_score_0_to_10?: number | null;
};

// Slot label mapping: lane -> display label
const LANE_TO_LABEL: Record<string, string> = {
  obvious: 'Great fit',
  nearby: 'Also good',
  surprise: 'Fresh idea',
};

// Reverse mapping for creating cards
const LABEL_TO_LANE: Record<string, string> = {
  'Great fit': 'obvious',
  'Also good': 'nearby',
  'Fresh idea': 'surprise',
};

export default function MerchandisingOffice({
  ageBandId,
  moment,
  set,
  categoryTypes,
  products,
}: {
  ageBandId: string;
  moment: Moment;
  set?: Set;
  categoryTypes: CategoryType[];
  products: Product[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [replaceConfirm, setReplaceConfirm] = useState<{ productId: string; cardId: string; slotLabel: string; oldProductName: string } | null>(null);
  
  // Filter state for Factory pane
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'ready' | 'needs_source'>('all');
  const [sortBy, setSortBy] = useState<'confidence' | 'quality' | 'evidence'>('confidence');

  // Algorithm weights panel state
  const [showAlgorithm, setShowAlgorithm] = useState(false);
  const [weights, setWeights] = useState({ confidence: 0.45, quality: 0.45, anchor: 0.10 });
  const [weightsLoading, setWeightsLoading] = useState(true);
  const [weightsSaving, setWeightsSaving] = useState(false);

  // Load autopilot weights on mount
  useEffect(() => {
    getAutopilotWeights().then((result) => {
      if (result.success && result.weights) {
        setWeights(result.weights);
      }
      setWeightsLoading(false);
    });
  }, []);

  // Get populated cards only (no placeholders)
  const cards = set?.pl_reco_cards || [];
  const populatedCards = cards.filter((card) => card.category_type_id || card.product_id);
  const sortedCards = [...populatedCards].sort((a, b) => {
    // Sort by rank first, then by lane order
    if (a.rank !== b.rank) return a.rank - b.rank;
    const laneOrder = { obvious: 0, nearby: 1, surprise: 2 };
    return (laneOrder[a.lane as keyof typeof laneOrder] || 99) - (laneOrder[b.lane as keyof typeof laneOrder] || 99);
  });

  // Filtered and sorted products for Factory pane
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => 
        p.name.toLowerCase().includes(query) || 
        (p.brand && p.brand.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategorySlug) {
      filtered = filtered.filter((p) => p.category_type_slug === selectedCategorySlug);
    }

    // Publish readiness filter
    if (filterType === 'ready') {
      filtered = filtered.filter((p) => p.is_ready_for_publish === true);
    } else if (filterType === 'needs_source') {
      filtered = filtered.filter((p) => p.is_ready_for_publish !== true);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'confidence') {
        const aScore = a.confidence_score_0_to_10 ?? 0;
        const bScore = b.confidence_score_0_to_10 ?? 0;
        return bScore - aScore;
      } else if (sortBy === 'quality') {
        const aScore = a.quality_score_0_to_10 ?? 0;
        const bScore = b.quality_score_0_to_10 ?? 0;
        return bScore - aScore;
      } else {
        // evidence count
        const aCount = a.evidence_count ?? 0;
        const bCount = b.evidence_count ?? 0;
        return bCount - aCount;
      }
    });

    return filtered;
  }, [products, searchQuery, selectedCategorySlug, filterType, sortBy]);

  async function handleCreateSet() {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await createDraftSet(ageBandId, moment.id);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Draft set created');
        window.location.reload();
      }
    });
  }

  async function handlePublish() {
    if (!set) return;
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await publishSet(set.id, ageBandId);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Set published');
        window.location.reload();
      }
    });
  }

  async function handleUnpublish() {
    if (!set) return;
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await unpublishSet(set.id, ageBandId);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Set unpublished');
        window.location.reload();
      }
    });
  }

  async function handleAddCard(lane: string) {
    if (!set) return;
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      // Find highest rank and add 1
      const maxRank = cards.length > 0 ? Math.max(...cards.map(c => c.rank)) : 0;
      const result = await createCard(set.id, ageBandId, {
        lane,
        rank: maxRank + 1,
      });
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Card added');
        // Use router refresh instead of window.location.reload for better UX
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    });
  }

  async function handleSaveWeights() {
    setWeightsSaving(true);
    setError(null);
    const result = await saveAutopilotWeights(weights);
    if (result.error) {
      setError(result.error);
    } else if (result.success && result.weights) {
      setWeights(result.weights);
      setSuccess('Weights saved');
      setTimeout(() => setSuccess(null), 2000);
    }
    setWeightsSaving(false);
  }

  async function handleResetWeights() {
    setWeights({ confidence: 0.45, quality: 0.45, anchor: 0.10 });
    setSuccess('Weights reset to defaults');
    setTimeout(() => setSuccess(null), 2000);
  }

  async function handleRegenerateDraft() {
    if (!set) return;
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await regenerateDraftSet(set.id, ageBandId, moment.id);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Draft regenerated');
        window.location.reload();
      }
    });
  }

  // Normalize weights to sum to 1.0
  const normalizedWeights = useMemo(() => {
    const total = weights.confidence + weights.quality + weights.anchor;
    if (total === 0) return { confidence: 0.45, quality: 0.45, anchor: 0.10 };
    return {
      confidence: weights.confidence / total,
      quality: weights.quality / total,
      anchor: weights.anchor / total,
    };
  }, [weights]);

  async function handlePlaceProduct(productId: string, lane: string) {
    if (!set) return;
    
    const product = products.find(p => p.id === productId);
    if (!product || !product.category_type_slug) return;

    // Find or create card for this lane
    let card = cards.find(c => c.lane === lane);
    
    if (!card) {
      // Create new card for this lane
      const maxRank = cards.length > 0 ? Math.max(...cards.map(c => c.rank)) : 0;
      const createResult = await createCard(set.id, ageBandId, {
        lane,
        rank: maxRank + 1,
      });
      if (createResult.error) {
        setError(createResult.error);
        return;
      }
      // Card will be created, reload to get it
      window.location.reload();
      return;
    }

    // Check if card already has a product
    if (card.product_id && card.product_id !== productId) {
      const oldProduct = products.find(p => p.id === card.product_id);
      const oldProductName = oldProduct ? `${oldProduct.name}${oldProduct.brand ? ` — ${oldProduct.brand}` : ''}` : 'current product';
      setReplaceConfirm({
        productId,
        cardId: card.id,
        slotLabel: LANE_TO_LABEL[lane] || lane,
        oldProductName,
      });
      return;
    }

    // Place product directly
    await doPlaceProduct(productId, card.id, product.category_type_slug);
  }

  async function doPlaceProduct(productId: string, cardId: string, categoryTypeSlug: string) {
    setError(null);
    setSuccess(null);
    setReplaceConfirm(null);
    startTransition(async () => {
      const result = await placeProductIntoSlot(cardId, ageBandId, {
        product_id: productId,
        category_type_slug: categoryTypeSlug,
      });
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Placed — remember to Save Card');
        // Don't reload immediately - let user see the toast and save manually
        setTimeout(() => window.location.reload(), 2000);
      }
    });
  }

  // Calculate publish readiness stats
  const cardsWithProducts = sortedCards.filter((card) => card.product_id);
  const productsMap = new Map(products.map((p) => [p.id, p]));
  const publishReadyCount = cardsWithProducts.filter((card) => {
    const product = productsMap.get(card.product_id!);
    return product?.is_ready_for_publish === true;
  }).length;
  const needsSecondSourceCount = cardsWithProducts.filter((card) => {
    const product = productsMap.get(card.product_id!);
    return product && product.is_ready_for_publish !== true;
  }).length;
  const missingWhyCount = sortedCards.filter((card) => !card.because || card.because.trim() === '').length;

  // Get unique category slugs for filter
  const categorySlugs = Array.from(new Set(products.map(p => p.category_type_slug).filter(Boolean))) as string[];

  if (!set) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{moment.label}</h2>
            {moment.description && (
              <p className="text-sm mt-1" style={{ color: 'var(--brand-muted, #6b7280)' }}>
                {moment.description}
              </p>
            )}
          </div>
        </div>
        {error && (
          <div className="rounded bg-red-100 p-3 text-red-700 text-sm mt-4">{error}</div>
        )}
        {success && (
          <div className="rounded bg-green-100 p-3 text-green-700 text-sm mt-4">{success}</div>
        )}
        <div className="mt-6">
          <button
            onClick={handleCreateSet}
            disabled={isPending}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {isPending ? 'Creating...' : 'Create draft set'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      {error && (
        <div className="rounded bg-red-100 p-3 text-red-700 text-sm mb-4">{error}</div>
      )}
      {success && (
        <div className="rounded bg-green-100 p-3 text-green-700 text-sm mb-4">{success}</div>
      )}

      {/* Two-pane layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* SHOPFRONT PANE - Left 40% */}
        <div className="flex-[0.4] space-y-4">
          {/* Moment Header */}
          <div className="sticky top-0 bg-white z-10 pb-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold">{moment.label}</h2>
                {moment.description && (
                  <p className="text-sm mt-1" style={{ color: 'var(--brand-muted, #6b7280)' }}>
                    {moment.description}
                  </p>
                )}
              </div>
            </div>

            {/* Status Strip */}
            <div className="border rounded p-3 bg-gray-50 space-y-2">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    set.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {set.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
                {cardsWithProducts.length > 0 && (
                  <div className="text-sm" style={{ color: 'var(--brand-muted, #6b7280)' }}>
                    SKU cards: {publishReadyCount}/{cardsWithProducts.length} ready to publish
                  </div>
                )}
              </div>
              {needsSecondSourceCount > 0 && (
                <div className="rounded bg-yellow-100 p-2 text-yellow-800 text-sm">
                  {needsSecondSourceCount} card{needsSecondSourceCount !== 1 ? 's' : ''} need{needsSecondSourceCount !== 1 ? '' : 's'} 2nd source
                </div>
              )}
              {missingWhyCount > 0 && (
                <div className="rounded bg-amber-100 p-2 text-amber-800 text-sm">
                  {missingWhyCount} card{missingWhyCount !== 1 ? 's' : ''} missing "Why it can work"
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {set.status === 'published' ? (
                <button
                  onClick={handleUnpublish}
                  disabled={isPending}
                  className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Unpublish
                </button>
              ) : (
                <>
                  <button
                    onClick={handlePublish}
                    disabled={isPending}
                    className="px-3 py-1.5 text-sm bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
                  >
                    Publish
                  </button>
                  <button
                    onClick={handleRegenerateDraft}
                    disabled={isPending}
                    className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Regenerate draft
                  </button>
                </>
              )}
              <button
                onClick={() => setShowAlgorithm(!showAlgorithm)}
                className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
              >
                {showAlgorithm ? 'Hide' : 'Show'} algorithm
              </button>
            </div>

            {/* Algorithm Weights Panel */}
            {showAlgorithm && (
              <div className="mt-4 border rounded p-4 bg-gray-50 space-y-4">
                <h4 className="font-semibold text-sm">Algorithm Weights</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs mb-1">
                      Confidence: {normalizedWeights.confidence.toFixed(2)} ({weights.confidence.toFixed(2)})
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={weights.confidence}
                      onChange={(e) => setWeights({ ...weights, confidence: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">
                      Quality: {normalizedWeights.quality.toFixed(2)} ({weights.quality.toFixed(2)})
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={weights.quality}
                      onChange={(e) => setWeights({ ...weights, quality: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">
                      Anchor: {normalizedWeights.anchor.toFixed(2)} ({weights.anchor.toFixed(2)})
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={weights.anchor}
                      onChange={(e) => setWeights({ ...weights, anchor: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div className="text-xs" style={{ color: 'var(--brand-muted, #6b7280)' }}>
                    Normalized sum: {(normalizedWeights.confidence + normalizedWeights.quality + normalizedWeights.anchor).toFixed(2)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveWeights}
                    disabled={weightsSaving || weightsLoading}
                    className="px-3 py-1.5 text-sm bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
                  >
                    {weightsSaving ? 'Saving...' : 'Save weights'}
                  </button>
                  <button
                    onClick={handleResetWeights}
                    disabled={weightsSaving || weightsLoading}
                    className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Reset defaults
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card List - Only populated cards */}
          <div className="space-y-4">
            {sortedCards.length === 0 ? (
              <div className="border rounded p-6 text-center">
                <p className="text-sm" style={{ color: 'var(--brand-muted, #6b7280)' }}>
                  No cards yet. Click "Add card" to create your first card.
                </p>
              </div>
            ) : (
              sortedCards.map((card) => (
                <ShopfrontCard
                  key={card.id}
                  card={card}
                  categoryTypes={categoryTypes}
                  products={products}
                  ageBandId={ageBandId}
                  isPending={isPending}
                  showAlgorithm={showAlgorithm}
                  weights={normalizedWeights}
                />
              ))
            )}

            {/* Add Card CTA */}
            <button
              onClick={() => {
                // Prefer missing lanes first
                const existingLanes = new Set(cards.map(c => c.lane));
                const allLanes = ['obvious', 'nearby', 'surprise'];
                const missingLane = allLanes.find(l => !existingLanes.has(l));
                const laneToUse = missingLane || 'obvious';
                handleAddCard(laneToUse);
              }}
              disabled={isPending}
              className="w-full px-4 py-2 border-2 border-dashed rounded hover:bg-gray-50 disabled:opacity-50 text-sm"
              style={{ color: 'var(--brand-muted, #6b7280)' }}
            >
              + Add card
            </button>
          </div>
        </div>

        {/* FACTORY PANE - Right 60% */}
        <div className="flex-[0.6] space-y-4">
          <div className="sticky top-0 bg-white z-10 pb-4 border-b">
            <h3 className="text-lg font-semibold mb-4">Factory</h3>
            
            {/* Controls */}
            <div className="space-y-3">
              {/* Search */}
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border p-2 rounded text-sm"
              />

              {/* Filters */}
              <div className="flex gap-3 flex-wrap">
                <select
                  value={selectedCategorySlug}
                  onChange={(e) => setSelectedCategorySlug(e.target.value)}
                  className="border p-2 rounded text-sm"
                >
                  <option value="">All categories</option>
                  {categorySlugs.map(slug => {
                    const cat = categoryTypes.find(ct => ct.slug === slug);
                    return (
                      <option key={slug} value={slug}>{cat?.label || cat?.name || slug}</option>
                    );
                  })}
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1 text-xs rounded ${filterType === 'all' ? 'bg-black text-white' : 'border hover:bg-gray-50'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterType('ready')}
                    className={`px-3 py-1 text-xs rounded ${filterType === 'ready' ? 'bg-black text-white' : 'border hover:bg-gray-50'}`}
                  >
                    Ready to publish
                  </button>
                  <button
                    onClick={() => setFilterType('needs_source')}
                    className={`px-3 py-1 text-xs rounded ${filterType === 'needs_source' ? 'bg-black text-white' : 'border hover:bg-gray-50'}`}
                  >
                    Needs 2nd source
                  </button>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'confidence' | 'quality' | 'evidence')}
                  className="border p-2 rounded text-sm"
                >
                  <option value="confidence">Sort: Confidence</option>
                  <option value="quality">Sort: Quality</option>
                  <option value="evidence">Sort: Evidence count</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Confidence</th>
                  <th className="text-left p-2">Quality</th>
                  <th className="text-left p-2">Evidence</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedProductId(product.id === selectedProductId ? null : product.id)}
                  >
                    <td className="p-2">
                      <div className="font-medium">{product.name}</div>
                      {product.brand && (
                        <div className="text-xs" style={{ color: 'var(--brand-muted, #6b7280)' }}>
                          {product.brand}
                        </div>
                      )}
                    </td>
                    <td className="p-2">
                      {(() => {
                        const cat = categoryTypes.find(ct => ct.slug === product.category_type_slug);
                        return cat?.label || cat?.name || product.category_type_slug || '—';
                      })()}
                    </td>
                    <td className="p-2">{product.confidence_score_0_to_10 ?? '—'}</td>
                    <td className="p-2">{product.quality_score_0_to_10 ?? '—'}</td>
                    <td className="p-2">{product.evidence_count ?? 0}</td>
                    <td className="p-2">
                      {product.is_ready_for_publish ? (
                        <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                          Ready
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
                          Needs source
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-sm" style={{ color: 'var(--brand-muted, #6b7280)' }}>
              No products found. Try adjusting your filters.
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Drawer */}
      {selectedProductId && (() => {
        const product = products.find(p => p.id === selectedProductId);
        if (!product) return null;
        return (
          <ProductDrawer
            product={product}
            categoryTypes={categoryTypes}
            cards={cards}
            onPlace={(lane) => handlePlaceProduct(product.id, lane)}
            onClose={() => setSelectedProductId(null)}
          />
        );
      })()}

      {/* Replace Confirmation Modal */}
      {replaceConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-md w-full mx-4">
            <h3 className="font-semibold mb-3">Replace product?</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--brand-muted, #6b7280)' }}>
              Replace {replaceConfirm.oldProductName} with {(() => {
                const p = products.find(pr => pr.id === replaceConfirm.productId);
                return p ? `${p.name}${p.brand ? ` — ${p.brand}` : ''}` : 'this product';
              })()} in {replaceConfirm.slotLabel}?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setReplaceConfirm(null)}
                className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => doPlaceProduct(replaceConfirm.productId, replaceConfirm.cardId, products.find(p => p.id === replaceConfirm.productId)?.category_type_slug || '')}
                disabled={isPending}
                className="px-3 py-1.5 text-sm bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
              >
                Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShopfrontCard({
  card,
  categoryTypes,
  products,
  ageBandId,
  isPending,
  showAlgorithm,
  weights,
}: {
  card: Card;
  categoryTypes: CategoryType[];
  products: Product[];
  ageBandId: string;
  isPending: boolean;
  showAlgorithm: boolean;
  weights: { confidence: number; quality: number; anchor: number };
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localPending, startTransition] = useTransition();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(card.category_type_id || '');
  const slotLabel = LANE_TO_LABEL[card.lane] || card.lane;
  const category = card.category_type_id ? categoryTypes.find(ct => ct.id === card.category_type_id) : null;
  const product = card.product_id ? products.find(p => p.id === card.product_id) : null;
  const evidence = card.pl_evidence || [];
  const evidenceCount = evidence.length;

  const selectedCategory = categoryTypes.find(ct => ct.id === selectedCategoryId);
  const eligibleProducts = selectedCategory
    ? products.filter(p => p.category_type_slug === selectedCategory.slug)
    : [];

  async function handleUpdate(formData: FormData) {
    startTransition(async () => {
      const result = await updateCard(card.id, ageBandId, {
        lane: card.lane, // Keep existing lane
        because: formData.get('because') as string,
        category_type_id: formData.get('category_type_id') ? (formData.get('category_type_id') as string) : null,
        product_id: formData.get('product_id') ? (formData.get('product_id') as string) : null,
      });
      if (result.error) {
        alert(result.error);
      } else {
        window.location.reload();
      }
    });
  }

  async function handleToggleLock() {
    startTransition(async () => {
      const result = await updateCard(card.id, ageBandId, {
        is_locked: !card.is_locked,
      });
      if (result.error) {
        alert(result.error);
      } else {
        window.location.reload();
      }
    });
  }

  // Calculate score breakdown if product exists and algorithm is shown
  const scoreBreakdown = useMemo(() => {
    if (!showAlgorithm || !product) return null;
    const confidenceNorm = (product.confidence_score_0_to_10 ?? 0) / 10;
    const qualityNorm = (product.quality_score_0_to_10 ?? 0) / 10;
    const anchorNorm = 0.5; // Simplified for now
    const total = weights.confidence + weights.quality + weights.anchor;
    const normalizedWeights = {
      confidence: weights.confidence / total,
      quality: weights.quality / total,
      anchor: weights.anchor / total,
    };
    return {
      confidence: confidenceNorm * normalizedWeights.confidence,
      quality: qualityNorm * normalizedWeights.quality,
      anchor: anchorNorm * normalizedWeights.anchor,
      evidence: product.is_ready_for_publish ? 0.1 : (product.evidence_count && product.evidence_count >= 1 ? 0.05 : 0),
      total: (confidenceNorm * normalizedWeights.confidence) + (qualityNorm * normalizedWeights.quality) + (anchorNorm * normalizedWeights.anchor) + (product.is_ready_for_publish ? 0.1 : (product.evidence_count && product.evidence_count >= 1 ? 0.05 : 0)),
    };
  }, [showAlgorithm, product, weights]);

  if (!isEditing) {
    return (
      <div className="border rounded p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{slotLabel}</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleLock}
              disabled={localPending || isPending}
              className={`text-xs px-2 py-1 rounded ${
                card.is_locked
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } disabled:opacity-50`}
              title={card.is_locked ? 'Unlock card (allow autopilot to update)' : 'Lock card (prevent autopilot updates)'}
            >
              {card.is_locked ? '🔒 Locked' : '🔓 Unlocked'}
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-blue-600 hover:underline"
              disabled={card.is_locked}
            >
              Edit
            </button>
          </div>
        </div>
        {category && (
          <div className="text-sm">
            <span className="font-medium">Category: </span>
            {category.label || category.name}
          </div>
        )}
        {product && (
          <div className="text-sm space-y-1">
            <div>
              <span className="font-medium">Product: </span>
              {product.name}{product.brand ? ` — ${product.brand}` : ''}
              {product.is_ready_for_publish && (
                <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                  Ready
                </span>
              )}
            </div>
            {/* Evidence chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs" style={{ color: 'var(--brand-muted, #6b7280)' }}>
                Sources: {evidenceCount}
              </span>
              {evidenceCount < 2 && product.id && (
                <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
                  Needs 2nd source
                </span>
              )}
              {product.is_ready_for_publish && (
                <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                  Ready to publish
                </span>
              )}
            </div>
            {/* Score breakdown */}
            {showAlgorithm && scoreBreakdown && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs space-y-1">
                <div className="font-medium">Score breakdown:</div>
                <div className="grid grid-cols-2 gap-1">
                  <div>Confidence: {scoreBreakdown.confidence.toFixed(3)}</div>
                  <div>Quality: {scoreBreakdown.quality.toFixed(3)}</div>
                  <div>Anchor: {scoreBreakdown.anchor.toFixed(3)}</div>
                  <div>Evidence: {scoreBreakdown.evidence.toFixed(3)}</div>
                </div>
                <div className="font-medium pt-1 border-t">
                  Total: {scoreBreakdown.total.toFixed(3)}
                </div>
              </div>
            )}
          </div>
        )}
        {card.because && (
          <div className="text-sm" style={{ color: 'var(--brand-muted, #6b7280)' }}>
            <span className="font-medium">Why it can work: </span>
            {card.because}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border rounded p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{slotLabel}</h4>
        <button
          onClick={() => {
            setIsEditing(false);
            setSelectedCategoryId(card.category_type_id || '');
          }}
          className="text-xs text-gray-600 hover:underline"
        >
          Cancel
        </button>
      </div>

      <form action={handleUpdate} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Category Type</label>
          <select
            name="category_type_id"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full border p-2 rounded text-sm"
          >
            <option value="">None</option>
            {categoryTypes.map(ct => (
              <option key={ct.id} value={ct.id}>{ct.label || ct.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Product (SKU)</label>
          <select
            name="product_id"
            defaultValue={card.product_id || ''}
            className="w-full border p-2 rounded text-sm"
            disabled={!selectedCategoryId || card.is_locked}
          >
            <option value="">
              {!selectedCategoryId ? 'Select a category first...' : card.is_locked ? 'Card is locked' : 'Select a product...'}
            </option>
            {eligibleProducts.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}{p.brand ? ` — ${p.brand}` : ''}
              </option>
            ))}
          </select>
          {card.is_locked && (
            <p className="text-xs mt-1" style={{ color: 'var(--brand-muted, #6b7280)' }}>
              Card is locked. Unlock to edit.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Why it can work</label>
          <textarea
            name="because"
            defaultValue={card.because}
            className="w-full border p-2 rounded text-sm"
            rows={2}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isPending || localPending || card.is_locked}
            className="px-3 py-1.5 text-sm bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            Save Card
          </button>
          {card.is_locked && (
            <span className="text-xs" style={{ color: 'var(--brand-muted, #6b7280)' }}>
              Card is locked
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

function ProductDrawer({
  product,
  categoryTypes,
  cards,
  onPlace,
  onClose,
}: {
  product: Product;
  categoryTypes: CategoryType[];
  cards: Card[];
  onPlace: (lane: string) => void;
  onClose: () => void;
}) {
  const category = categoryTypes.find(ct => ct.slug === product.category_type_slug);

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-lg z-50 flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Product Details</h3>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
          ×
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <h4 className="font-semibold">{product.name}</h4>
          {product.brand && (
            <p className="text-sm" style={{ color: 'var(--brand-muted, #6b7280)' }}>
              {product.brand}
            </p>
          )}
        </div>
        {category && (
          <div>
            <span className="text-sm font-medium">Category: </span>
            <span className="text-sm">{category.label || category.name}</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Confidence: </span>
            {product.confidence_score_0_to_10 ?? '—'}
          </div>
          <div>
            <span className="font-medium">Quality: </span>
            {product.quality_score_0_to_10 ?? '—'}
          </div>
          <div>
            <span className="font-medium">Evidence: </span>
            {product.evidence_count ?? 0} source{product.evidence_count !== 1 ? 's' : ''}
          </div>
          <div>
            {product.is_ready_for_publish ? (
              <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                Ready to publish
              </span>
            ) : (
              <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
                Needs 2nd source
              </span>
            )}
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-3">Place into slot</h4>
          <div className="space-y-2">
            {(['obvious', 'nearby', 'surprise'] as const).map(lane => {
              const label = LANE_TO_LABEL[lane];
              const existingCard = cards.find(c => c.lane === lane);
              const hasProduct = existingCard?.product_id;
              const isLocked = existingCard?.is_locked;
              return (
                <button
                  key={lane}
                  onClick={() => onPlace(lane)}
                  disabled={isLocked}
                  className="w-full px-3 py-2 border rounded hover:bg-gray-50 text-left text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title={isLocked ? 'Card is locked - unlock to replace' : hasProduct ? `Replace in ${label}` : `Place into ${label}`}
                >
                  {isLocked ? `${label} (locked)` : hasProduct ? `Replace in ${label}` : `Place into ${label}`}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

