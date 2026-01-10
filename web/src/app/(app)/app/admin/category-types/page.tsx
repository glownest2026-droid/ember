'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type CategoryType = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export default function CategoryTypesAdminPage() {
  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadCategoryTypes();
  }, []);

  async function loadCategoryTypes() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/category-types');
      const json = await res.json();
      if (json.success) {
        setCategoryTypes(json.data || []);
        setError(null);
      } else {
        setError(json.error || 'Failed to load category types');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load category types');
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
      const res = await fetch('/api/admin/category-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          description: formData.get('description'),
          image_url: formData.get('image_url'),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setShowCreateForm(false);
        form.reset();
        loadCategoryTypes();
      } else {
        setError(json.error || 'Failed to create category type');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create category type');
    }
  }

  async function handleUpdate(id: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch(`/api/admin/category-types/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          description: formData.get('description'),
          image_url: formData.get('image_url'),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setEditingId(null);
        loadCategoryTypes();
      } else {
        setError(json.error || 'Failed to update category type');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update category type');
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
            Category Types
          </h1>
        </div>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Create Category Type
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded text-sm">{error}</div>
      )}

      {showCreateForm && (
        <div className="border rounded p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Create Category Type</h2>
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
                placeholder="e.g., Character bath toys"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea
                name="description"
                rows={2}
                className="w-full border p-2 rounded"
                placeholder="Optional description"
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
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Create
            </button>
          </form>
        </div>
      )}

      {categoryTypes.length === 0 ? (
        <div className="p-6 border rounded text-center text-sm" style={{ color: 'var(--brand-muted, #6b7280)' }}>
          No category types yet. Create one to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {categoryTypes.map((ct) => (
            <div key={ct.id} className="border rounded p-4">
              {editingId === ct.id ? (
                <form onSubmit={(e) => handleUpdate(ct.id, e)} className="space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Edit Category Type</h3>
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
                      defaultValue={ct.name}
                      required
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Description</label>
                    <textarea
                      name="description"
                      defaultValue={ct.description || ''}
                      rows={2}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Image URL</label>
                    <input
                      type="url"
                      name="image_url"
                      defaultValue={ct.image_url || ''}
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
                    <h3 className="font-semibold">{ct.name}</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--brand-muted, #6b7280)' }}>
                      {ct.description || 'No description'}
                    </p>
                    {ct.image_url && (
                      <div className="mt-2">
                        <img
                          src={ct.image_url}
                          alt={ct.name}
                          className="max-w-[200px] h-auto rounded border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <p className="text-xs mt-2" style={{ color: 'var(--brand-muted, #6b7280)' }}>
                      Slug: {ct.slug} • Updated: {new Date(ct.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingId(ct.id)}
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

