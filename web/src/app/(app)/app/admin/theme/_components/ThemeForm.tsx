'use client';
import { useState, useTransition } from 'react';
import type { ThemeSettings } from '../../../../../lib/theme';

export default function ThemeForm({ initial }: { initial: ThemeSettings }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const primary = String(fd.get('primary') || '').trim();
    const accent = String(fd.get('accent') || '').trim();
    const fontPair = String(fd.get('fontPair') || '').trim();

    // Validate hex colors
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (primary && !hexRegex.test(primary)) {
      setError('Primary color must be a valid hex color (e.g., #FFBEAB)');
      return;
    }
    if (accent && !hexRegex.test(accent)) {
      setError('Accent color must be a valid hex color (e.g., #FFC26E)');
      return;
    }

    const validFontPairs = ['inter_plusjakarta', 'dmSans_spaceGrotesk', 'nunito_sourceSans'];
    if (fontPair && !validFontPairs.includes(fontPair)) {
      setError('Invalid font pair selected');
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/admin/theme', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ primary, accent, fontPair }),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || 'Failed to save theme');
        }

        setSuccess(true);
        // Refresh page to apply new theme
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (err: any) {
        setError(err.message || 'Failed to save theme');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {error && (
        <div className="rounded bg-red-100 p-3 text-red-700">{error}</div>
      )}
      {success && (
        <div className="rounded bg-green-100 p-3 text-green-700">
          Theme saved! Refreshing...
        </div>
      )}

      <div>
        <label className="block text-sm mb-1">Primary Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            name="primary"
            defaultValue={initial.primary || '#FFBEAB'}
            className="w-16 h-10 border rounded"
          />
          <input
            type="text"
            name="primary"
            defaultValue={initial.primary || '#FFBEAB'}
            className="flex-1 border p-2 rounded"
            pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Accent Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            name="accent"
            defaultValue={initial.accent || '#FFC26E'}
            className="w-16 h-10 border rounded"
          />
          <input
            type="text"
            name="accent"
            defaultValue={initial.accent || '#FFC26E'}
            className="flex-1 border p-2 rounded"
            pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Font Pair</label>
        <select
          name="fontPair"
          defaultValue={initial.fontPair || 'inter_plusjakarta'}
          className="w-full border p-2 rounded"
        >
          <option value="inter_plusjakarta">Inter + Plus Jakarta Sans</option>
          <option value="dmSans_spaceGrotesk">DM Sans + Space Grotesk</option>
          <option value="nunito_sourceSans">Nunito + Source Sans 3</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {isPending ? 'Saving…' : 'Save Theme'}
        </button>
      </div>
    </form>
  );
}

