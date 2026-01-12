'use client';

import { useState, useTransition } from 'react';
import { createDraftSet, updateCard, addEvidence, updateEvidence, deleteEvidence, publishSet, unpublishSet, addPoolItem, removePoolItem, usePoolItemInCard } from '../../_actions';

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
  pl_evidence?: Evidence[];
};

type Evidence = {
  id: string;
  source_type: string;
  url?: string;
  quote_snippet?: string;
  confidence: number;
  captured_at?: string;
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

type PoolItem = {
  id: string;
  category_type_id: string;
  note?: string;
  pl_category_types?: CategoryType;
};

export default function MomentSetEditor({
  ageBandId,
  moment,
  set,
  categoryTypes,
  products,
  poolItems,
}: {
  ageBandId: string;
  moment: Moment;
  set?: Set;
  categoryTypes: CategoryType[];
  products: Product[];
  poolItems: PoolItem[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const cards = set?.pl_reco_cards || [];
  const sortedCards = [...cards].sort((a, b) => a.rank - b.rank);

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

  async function handleUpdateCard(cardId: string, formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await updateCard(cardId, ageBandId, {
        lane: formData.get('lane') as string,
        because: formData.get('because') as string,
        category_type_id: formData.get('category_type_id') ? (formData.get('category_type_id') as string) : null,
        product_id: formData.get('product_id') ? (formData.get('product_id') as string) : null,
      });
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Card updated');
        window.location.reload();
      }
    });
  }

  async function handleAddEvidence(cardId: string, formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await addEvidence(cardId, ageBandId, {
        source_type: formData.get('source_type') as string,
        url: formData.get('url') as string,
        quote_snippet: formData.get('quote_snippet') as string,
        confidence: parseInt(formData.get('confidence') as string),
      });
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Evidence added');
        window.location.reload();
      }
    });
  }

  async function handleDeleteEvidence(evidenceId: string) {
    if (!confirm('Delete this evidence?')) return;
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await deleteEvidence(evidenceId, ageBandId);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Evidence deleted');
        window.location.reload();
      }
    });
  }

  async function handlePublish() {
    if (!set) return;
    if (!confirm('Publish this set? It will be visible to the public.')) return;
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
    if (!confirm('Unpublish this set? It will no longer be visible to the public.')) return;
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

  async function handleAddPoolItem(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await addPoolItem(ageBandId, moment.id, {
        category_type_id: formData.get('category_type_id') as string,
        note: formData.get('note') as string,
      });
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Added to pool');
        window.location.reload();
      }
    });
  }

  async function handleRemovePoolItem(poolItemId: string) {
    if (!confirm('Remove this item from the pool?')) return;
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await removePoolItem(poolItemId, ageBandId);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Removed from pool');
        window.location.reload();
      }
    });
  }

  async function handleUsePoolItemInCard(poolItemId: string, cardId: string) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await usePoolItemInCard(poolItemId, cardId, ageBandId);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Product type assigned to card');
        window.location.reload();
      }
    });
  }

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{moment.label}</h2>
          {moment.description && (
            <p className="text-sm mt-1" style={{ color: 'var(--brand-muted, #6b7280)' }}>
              {moment.description}
            </p>
          )}
        </div>
        {set && (
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs ${
              set.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {set.status}
            </span>
            {set.status === 'published' ? (
              <button
                onClick={handleUnpublish}
                disabled={isPending}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Unpublish
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={isPending}
                className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
              >
                Publish
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded bg-red-100 p-3 text-red-700 text-sm">{error}</div>
      )}
      {success && (
        <div className="rounded bg-green-100 p-3 text-green-700 text-sm">{success}</div>
      )}

      {!set ? (
        <div>
          <button
            onClick={handleCreateSet}
            disabled={isPending}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {isPending ? 'Creating...' : 'Create draft set'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedCards.length === 0 ? (
            <p className="text-sm text-gray-500">No cards yet (this should not happen)</p>
          ) : (
            sortedCards.map((card) => (
              <CardEditor
                key={card.id}
                card={card}
                categoryTypes={categoryTypes}
                products={products}
                ageBandId={ageBandId}
                onUpdate={handleUpdateCard}
                onAddEvidence={handleAddEvidence}
                onDeleteEvidence={handleDeleteEvidence}
                isPending={isPending}
              />
            ))
          )}

          {/* Product Type Pool Section */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Product Type Pool</h3>
            
            {/* Add to Pool Form */}
            <form
              action={handleAddPoolItem}
              className="mb-4 p-4 border rounded space-y-3"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Category Type</label>
                  <select
                    name="category_type_id"
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="">Select...</option>
                    {categoryTypes.map((ct) => (
                      <option key={ct.id} value={ct.id}>{ct.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Note (optional)</label>
                  <input
                    type="text"
                    name="note"
                    placeholder="Short note..."
                    className="w-full border p-2 rounded text-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
              >
                Add to pool
              </button>
            </form>

            {/* Pool Items List */}
            {poolItems.length === 0 ? (
              <p className="text-sm text-gray-500">No items in pool yet. Add product types above.</p>
            ) : (
              <div className="space-y-2">
                {poolItems.map((item) => {
                  const categoryType = item.pl_category_types;
                  const categoryTypeLabel = categoryType?.name || 'Unknown';
                  return (
                    <div key={item.id} className="border rounded p-3 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{categoryTypeLabel}</div>
                        {item.note && (
                          <div className="text-sm text-gray-600 mt-1">{item.note}</div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        {set && sortedCards.map((card) => (
                          <button
                            key={card.id}
                            onClick={() => handleUsePoolItemInCard(item.id, card.id)}
                            disabled={isPending}
                            className="px-2 py-1 text-xs border rounded hover:bg-gray-50 disabled:opacity-50"
                            title={`Use in Card ${card.rank}`}
                          >
                            Card {card.rank}
                          </button>
                        ))}
                        <button
                          onClick={() => handleRemovePoolItem(item.id)}
                          disabled={isPending}
                          className="px-2 py-1 text-xs text-red-600 hover:underline disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CardEditor({
  card,
  categoryTypes,
  products,
  ageBandId,
  onUpdate,
  onAddEvidence,
  onDeleteEvidence,
  isPending,
}: {
  card: Card;
  categoryTypes: CategoryType[];
  products: Product[];
  ageBandId: string;
  onUpdate: (cardId: string, formData: FormData) => void;
  onAddEvidence: (cardId: string, formData: FormData) => void;
  onDeleteEvidence: (evidenceId: string) => void;
  isPending: boolean;
}) {
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);
  // Initialize category type and product from card
  const initialCategoryTypeId = card.category_type_id || '';
  const [selectedCategoryTypeId, setSelectedCategoryTypeId] = useState<string>(initialCategoryTypeId);
  const [selectedProductId, setSelectedProductId] = useState<string>(card.product_id || '');

  // Products are already filtered by age_band_id and is_ready_for_recs from the server
  // No need to filter by category type - show all eligible products
  const eligibleProducts = products;

  return (
    <div className="border rounded p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Card {card.rank} ({card.lane})</h3>
        <button
          onClick={() => setShowEvidenceForm(!showEvidenceForm)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showEvidenceForm ? 'Cancel' : 'Add Evidence'}
        </button>
      </div>

      <form
        action={(formData) => onUpdate(card.id, formData)}
        className="space-y-3"
      >
        <div>
          <label className="block text-sm mb-1">Lane</label>
          <select
            name="lane"
            defaultValue={card.lane}
            className="w-full border p-2 rounded"
            required
          >
            <option value="obvious">Obvious</option>
            <option value="nearby">Nearby</option>
            <option value="surprise">Surprise</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Because</label>
          <textarea
            name="because"
            defaultValue={card.because}
            className="w-full border p-2 rounded"
            rows={2}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Category Type</label>
            <select
              name="category_type_id"
              value={selectedCategoryTypeId}
              className="w-full border p-2 rounded"
              onChange={(e) => {
                const newCategoryTypeId = e.target.value;
                setSelectedCategoryTypeId(newCategoryTypeId);
                // Products are independent of category selection now, so we don't clear product
              }}
            >
              <option value="">None</option>
              {categoryTypes.map((ct) => {
                const displayLabel = ct.label || ct.name;
                // TODO: Add anchor text helper if available (e.g., "(anchor 26m)")
                return (
                  <option key={ct.id} value={ct.id}>{displayLabel}</option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Product (SKU)</label>
            <select
              name="product_id"
              value={selectedProductId}
              className="w-full border p-2 rounded"
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">Select a product...</option>
              {eligibleProducts.map((p) => {
                const productName = p.name || 'Unknown';
                const brand = p.brand ? ` — ${p.brand}` : '';
                const displayText = `${productName}${brand}`;
                return (
                  <option key={p.id} value={p.id} title={displayText}>
                    {displayText}
                  </option>
                );
              })}
            </select>
            {eligibleProducts.length === 0 && (
              <p className="text-xs mt-1" style={{ color: 'var(--brand-muted, #6b7280)' }}>
                No products available for this age band
              </p>
            )}
            {/* Product metadata display when a product is selected */}
            {selectedProductId && (() => {
              const selectedProduct = eligibleProducts.find((p) => p.id === selectedProductId);
              if (!selectedProduct) return null;
              return (
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    {selectedProduct.is_ready_for_publish ? (
                      <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs font-medium">
                        Ready to Publish
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                        Needs 2nd source
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-gray-600">
                    {selectedProduct.confidence_score_0_to_10 !== null && selectedProduct.confidence_score_0_to_10 !== undefined && (
                      <div>Confidence: {selectedProduct.confidence_score_0_to_10}/10</div>
                    )}
                    {selectedProduct.quality_score_0_to_10 !== null && selectedProduct.quality_score_0_to_10 !== undefined && (
                      <div>Quality: {selectedProduct.quality_score_0_to_10}/10</div>
                    )}
                    {selectedProduct.evidence_count !== undefined && (
                      <div>Evidence: {selectedProduct.evidence_count} source{selectedProduct.evidence_count !== 1 ? 's' : ''}</div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
        >
          Save Card
        </button>
      </form>

      {/* Evidence List */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">Evidence ({card.pl_evidence?.length || 0})</h4>
        {card.pl_evidence && card.pl_evidence.length > 0 ? (
          <div className="space-y-2">
            {card.pl_evidence.map((ev) => (
              <div key={ev.id} className="border rounded p-2 text-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{ev.source_type}</div>
                    {ev.url && (
                      <a href={ev.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                        {ev.url}
                      </a>
                    )}
                    {ev.quote_snippet && (
                      <div className="mt-1 text-gray-600 italic">"{ev.quote_snippet}"</div>
                    )}
                    <div className="mt-1 text-xs text-gray-500">Confidence: {ev.confidence}/5</div>
                  </div>
                  <button
                    onClick={() => onDeleteEvidence(ev.id)}
                    className="ml-2 text-red-600 hover:underline text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500">No evidence yet. Add at least 1 to publish.</p>
        )}
      </div>

      {/* Add Evidence Form */}
      {showEvidenceForm && (
        <form
          action={(formData) => {
            onAddEvidence(card.id, formData);
            setShowEvidenceForm(false);
          }}
          className="mt-4 border rounded p-3 space-y-2"
        >
          <div>
            <label className="block text-xs mb-1">Source Type</label>
            <input
              type="text"
              name="source_type"
              placeholder="e.g., Research Paper, Expert Review"
              className="w-full border p-2 rounded text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs mb-1">URL</label>
            <input
              type="url"
              name="url"
              placeholder="https://..."
              className="w-full border p-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Quote Snippet</label>
            <textarea
              name="quote_snippet"
              placeholder="Short quote or summary"
              className="w-full border p-2 rounded text-sm"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Confidence (1-5)</label>
            <input
              type="number"
              name="confidence"
              min="1"
              max="5"
              defaultValue="3"
              className="w-full border p-2 rounded text-sm"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
            >
              Add Evidence
            </button>
            <button
              type="button"
              onClick={() => setShowEvidenceForm(false)}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

