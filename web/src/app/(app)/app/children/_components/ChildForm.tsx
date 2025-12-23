'use client';
import { useState, useTransition } from 'react';
import { saveChild, deleteChild } from '../_actions';

type ChildData = {
  id?: string;
  birthdate?: string | null;
  gender?: string | null;
  age_band?: string | null;
  preferences?: Record<string, any>;
};

export default function ChildForm({ initial }: { initial?: ChildData }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await saveChild(formData, initial?.id);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  async function handleDelete() {
    if (!initial?.id) return;
    
    if (!confirm('Are you sure you want to delete this profile? This cannot be undone.')) {
      return;
    }

    setDeleting(true);
    setError(null);

    startTransition(async () => {
      const result = await deleteChild(initial.id!);
      if (result?.error) {
        setError(result.error);
        setDeleting(false);
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded bg-red-100 p-2 text-red-700">{error}</div>
      )}

      <div>
        <label className="block text-sm mb-1">Birthdate</label>
        <input
          type="date"
          name="birthdate"
          defaultValue={initial?.birthdate || ''}
          className="w-full border p-2 rounded"
        />
        <p className="text-xs mt-1 text-gray-500">
          Age band will be calculated automatically from birthdate
        </p>
      </div>

      <div>
        <label className="block text-sm mb-1">Gender</label>
        <select
          name="gender"
          defaultValue={initial?.gender || ''}
          className="w-full border p-2 rounded"
        >
          <option value="">—</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {isPending ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 rounded border"
        >
          Cancel
        </button>
        {initial?.id && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || isPending}
            className="px-4 py-2 rounded border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50 ml-auto"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        )}
      </div>
      {error && (
        <div className="text-sm text-red-600 mt-2">{error}</div>
      )}
    </form>
  );
}

