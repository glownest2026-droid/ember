'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type CategoryType = {
  id: string;
  name: string;
  slug: string;
};

type AgeBand = {
  id: string;
  label: string;
  min_months: number;
  max_months: number;
};

type Product = {
  id: string;
  name: string;
  age_band: string;
  image_url: string | null;
  why_it_matters: string | null;
  tags: string[];
  category_type_id: string | null;
  category_type?: CategoryType;
  affiliate_url: string | null;
  rating: number | null;
  created_at: string;
  updated_at: string;
};

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>([]);
  const [ageBands, setAgeBands] = useState<AgeBand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [productsRes, categoryTypesRes, ageBandsRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/category-types'),
        fetch('/api/admin/age-bands'),
      ]);

      const productsJson = await productsRes.json();
      const categoryTypesJson = await categoryTypesRes.json();
      const ageBandsJson = await ageBandsRes.json();

      if (productsJson.success) {
        setProducts(productsJson.data || []);
      } else {
        setError(productsJson.error || 'Failed to load products');
      }

      if (categoryTypesJson.success) {
        setCategoryTypes(categoryTypesJson.data || []);
      }

      if (ageBandsJson.success) {
        setAgeBands(ageBandsJson.data || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          age_band: formData.get('age_band'),
          image_url: formData.get('image_url'),
          why_it_matters: formData.get('why_it_matters'),
          tags: formData.get('tags') ? String(formData.get('tags')).split(',').map(t => t.trim()) : [],
          category_type_id: formData.get('category_type_id') || null,
          deep_link_url: formData.get('deep_link_url'),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setShowCreateForm(false);
        form.reset();
        loadData();
      } else {
        setError(json.error || 'Failed to create product');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    }
  }

  async function handleUpdate(id: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          age_band: formData.get('age_band'),
          image_url: formData.get('image_url'),
          why_it_matters: formData.get('why_it_matters'),
          tags: formData.get('tags') ? String(formData.get('tags')).split(',').map(t => t.trim()) : [],
          category_type_id: formData.get('category_type_id') || null,
          deep_link_url: formData.get('deep_link_url'),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setEditingId(null);
        loadData();
      } else {
        setError(json.error || 'Failed to update product');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-sm" style={{ color: 'var(--brand-muted, #6b7280)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/app/admin/pl" className="text-blue-600 hover:underline text-sm">← Back to PL Admin</Link>
          <h1 className="text-xl font-semibold mt-2" style={{ fontFamily: 'var(--brand-font-head, inherit)' }}>
            Products (SKUs)
          </h1>
        </div>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Create Product
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded text-sm">{error}</div>
      )}

      {showCreateForm && (
        <div className="border rounded p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Create Product</h2>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setError(null);
              }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Name *</label>
              <input
                type="text"
                name="name"
                required
                className="w-full border p-2 rounded"
                placeholder="Product name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Age Band *</label>
                <select
                  name="age_band"
                  required
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select age band...</option>
                  {ageBands.map((ab) => (
                    <option key={ab.id} value={ab.id}>{ab.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Category Type</label>
                <select
                  name="category_type_id"
                  className="w-full border p-2 rounded"
                >
                  <option value="">None</option>
                  {categoryTypes.map((ct) => (
                    <option key={ct.id} value={ct.id}>{ct.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Rating (optional, 0-5)</label>
                <input
                  type="number"
                  name="rating"
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full border p-2 rounded"
                  placeholder="e.g., 4.5"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Image URL</label>
                <input
                  type="url"
                  name="image_url"
                  className="w-full border p-2 rounded"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Why It Matters</label>
              <textarea
                name="why_it_matters"
                rows={2}
                className="w-full border p-2 rounded"
                placeholder="Optional description"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                className="w-full border p-2 rounded"
                placeholder="tag1, tag2, tag3"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Deep Link / Affiliate URL</label>
              <input
                type="url"
                name="deep_link_url"
                className="w-full border p-2 rounded"
                placeholder="https://example.com/product"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Create
            </button>
          </form>
        </div>
      )}

      {products.length === 0 ? (
        <div className="p-6 border rounded text-center text-sm" style={{ color: 'var(--brand-muted, #6b7280)' }}>
          No products yet. Create one to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded p-4">
              {editingId === product.id ? (
                <form onSubmit={(e) => handleUpdate(product.id, e)} className="space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Edit Product</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setError(null);
                      }}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Name *</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={product.name}
                      required
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Age Band *</label>
                      <select
                        name="age_band"
                        defaultValue={product.age_band}
                        required
                        className="w-full border p-2 rounded"
                      >
                        <option value="">Select age band...</option>
                        {ageBands.map((ab) => (
                          <option key={ab.id} value={ab.id}>{ab.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Category Type</label>
                      <select
                        name="category_type_id"
                        defaultValue={product.category_type_id || ''}
                        className="w-full border p-2 rounded"
                      >
                        <option value="">None</option>
                        {categoryTypes.map((ct) => (
                          <option key={ct.id} value={ct.id}>{ct.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Rating (optional, 0-5)</label>
                      <input
                        type="number"
                        name="rating"
                        min="0"
                        max="5"
                        step="0.1"
                        defaultValue={product.rating || ''}
                        className="w-full border p-2 rounded"
                        placeholder="e.g., 4.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Image URL</label>
                      <input
                        type="url"
                        name="image_url"
                        defaultValue={product.image_url || ''}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Why It Matters</label>
                    <textarea
                      name="why_it_matters"
                      defaultValue={product.why_it_matters || ''}
                      rows={2}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Tags (comma-separated)</label>
                    <input
                      type="text"
                      name="tags"
                      defaultValue={product.tags?.join(', ') || ''}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Deep Link / Affiliate URL</label>
                    <input
                      type="url"
                      name="deep_link_url"
                      defaultValue={product.affiliate_url || ''}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                  >
                    Save
                  </button>
                </form>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{product.name}</h3>
                      {product.category_type && (
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded" style={{ color: 'var(--brand-muted, #6b7280)' }}>
                          {product.category_type.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm mt-1" style={{ color: 'var(--brand-muted, #6b7280)' }}>
                      Age: {product.age_band} • {product.why_it_matters || 'No description'}
                    </p>
                    {product.image_url && (
                      <div className="mt-2">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="max-w-[200px] h-auto rounded border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    {product.tags && product.tags.length > 0 && (
                      <p className="text-xs mt-2" style={{ color: 'var(--brand-muted, #6b7280)' }}>
                        Tags: {product.tags.join(', ')}
                      </p>
                    )}
                    <p className="text-xs mt-2" style={{ color: 'var(--brand-muted, #6b7280)' }}>
                      Updated: {new Date(product.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingId(product.id)}
                    className="ml-4 px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

