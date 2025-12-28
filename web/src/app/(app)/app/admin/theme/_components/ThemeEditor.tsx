'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { ThemeSettings, RequiredThemeSettings } from '@/lib/theme';
import ThemePreview from './ThemePreview';

// Factory defaults (duplicated from theme.ts to avoid server import in client component)
const FACTORY_THEME: RequiredThemeSettings = {
  colors: {
    primary: '#FFBEAB',
    accent: '#FFC26E',
    background: '#FFFCF8',
    surface: '#FFFFFF',
    text: '#27303F',
    muted: '#57534E',
    border: '#D6D3D1',
  },
  typography: {
    fontHeading: 'inter_plusjakarta',
    fontBody: 'inter_plusjakarta',
    baseFontSize: 16,
  },
  components: {
    radius: 12,
  },
};

export default function ThemeEditor({ initial }: { initial: RequiredThemeSettings }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Draft state for live preview
  const [draft, setDraft] = useState<RequiredThemeSettings>(initial);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Build theme object from form
    const themeUpdate: ThemeSettings = {
      colors: {
        primary: String(fd.get('primary') || '').trim() || undefined,
        accent: String(fd.get('accent') || '').trim() || undefined,
        background: String(fd.get('background') || '').trim() || undefined,
        surface: String(fd.get('surface') || '').trim() || undefined,
        text: String(fd.get('text') || '').trim() || undefined,
        muted: String(fd.get('muted') || '').trim() || undefined,
        border: String(fd.get('border') || '').trim() || undefined,
      },
      typography: {
        fontHeading: String(fd.get('fontHeading') || '').trim() || undefined,
        fontBody: String(fd.get('fontBody') || '').trim() || undefined,
        baseFontSize: Number(fd.get('baseFontSize')) || undefined,
      },
      components: {
        radius: Number(fd.get('radius')) || undefined,
      },
    };

    // Validate hex colors
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const colorFields = ['primary', 'accent', 'background', 'surface', 'text', 'muted', 'border'] as const;
    for (const field of colorFields) {
      const value = themeUpdate.colors?.[field];
      if (value && !hexRegex.test(value)) {
        setError(`${field} must be a valid hex color (e.g., #FFBEAB)`);
        return;
      }
    }

    const validFontPairs = ['inter_plusjakarta', 'dmsans_inter', 'manrope_inter', 'worksans_inter', 'nunito_sourcesans3', 'lexend_inter', 'outfit_inter', 'sourcesans3_sourcesans3', 'inter_inter', 'fraunces_inter'];
    if (themeUpdate.typography?.fontHeading && !validFontPairs.includes(themeUpdate.typography.fontHeading)) {
      setError('Invalid heading font');
      return;
    }
    if (themeUpdate.typography?.fontBody && !validFontPairs.includes(themeUpdate.typography.fontBody)) {
      setError('Invalid body font');
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/admin/theme', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(themeUpdate),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || 'Failed to save theme');
        }

        setSuccess(true);
        // Refresh to apply new theme
        router.refresh();
      } catch (err: any) {
        setError(err.message || 'Failed to save theme');
      }
    });
  }

  function updateDraft(field: string, value: string | number) {
    const [category, key] = field.split('.');
    setDraft(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof RequiredThemeSettings],
        [key]: value,
      },
    }));
  }

  async function handleReset() {
    if (!confirm('Reset to Ember factory defaults? This will overwrite your current theme.')) {
      return;
    }

    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        const response = await fetch('/api/admin/theme', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(FACTORY_THEME),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || 'Failed to reset theme');
        }

        setDraft(FACTORY_THEME);
        setSuccess(true);
        router.refresh();
      } catch (err: any) {
        setError(err.message || 'Failed to reset theme');
      }
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded bg-red-100 p-3 text-red-700">{error}</div>
          )}
          {success && (
            <div className="rounded bg-green-100 p-3 text-green-700">
              Theme saved! Refreshing...
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-3">Colors</h2>
            <div className="space-y-3">
              {(['primary', 'accent', 'background', 'surface', 'text', 'muted', 'border'] as const).map((color) => (
                <div key={color}>
                  <label className="block text-sm mb-1 capitalize">{color}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      name={color}
                      defaultValue={initial.colors[color]}
                      onChange={(e) => updateDraft(`colors.${color}`, e.target.value)}
                      className="w-16 h-10 border rounded"
                    />
                    <input
                      type="text"
                      name={color}
                      defaultValue={initial.colors[color]}
                      onChange={(e) => updateDraft(`colors.${color}`, e.target.value)}
                      className="flex-1 border p-2 rounded"
                      pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Typography</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Heading Font</label>
                <select
                  name="fontHeading"
                  defaultValue={initial.typography.fontHeading}
                  onChange={(e) => updateDraft('typography.fontHeading', e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="inter_plusjakarta">Plus Jakarta + Inter</option>
                  <option value="dmsans_inter">DM Sans + Inter</option>
                  <option value="manrope_inter">Manrope + Inter</option>
                  <option value="worksans_inter">Work Sans + Inter</option>
                  <option value="nunito_sourcesans3">Nunito + Source Sans 3</option>
                  <option value="lexend_inter">Lexend + Inter</option>
                  <option value="outfit_inter">Outfit + Inter</option>
                  <option value="sourcesans3_sourcesans3">Source Sans 3 + Source Sans 3</option>
                  <option value="inter_inter">Inter + Inter</option>
                  <option value="fraunces_inter">Fraunces + Inter</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Body Font</label>
                <select
                  name="fontBody"
                  defaultValue={initial.typography.fontBody}
                  onChange={(e) => updateDraft('typography.fontBody', e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="inter_plusjakarta">Plus Jakarta + Inter</option>
                  <option value="dmsans_inter">DM Sans + Inter</option>
                  <option value="manrope_inter">Manrope + Inter</option>
                  <option value="worksans_inter">Work Sans + Inter</option>
                  <option value="nunito_sourcesans3">Nunito + Source Sans 3</option>
                  <option value="lexend_inter">Lexend + Inter</option>
                  <option value="outfit_inter">Outfit + Inter</option>
                  <option value="sourcesans3_sourcesans3">Source Sans 3 + Source Sans 3</option>
                  <option value="inter_inter">Inter + Inter</option>
                  <option value="fraunces_inter">Fraunces + Inter</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Base Font Size (px)</label>
                <input
                  type="number"
                  name="baseFontSize"
                  defaultValue={initial.typography.baseFontSize}
                  onChange={(e) => updateDraft('typography.baseFontSize', Number(e.target.value))}
                  min="12"
                  max="72"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="range"
                  min="14"
                  max="48"
                  defaultValue={initial.typography.baseFontSize}
                  onChange={(e) => updateDraft('typography.baseFontSize', Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Components</h2>
            <div>
              <label className="block text-sm mb-1">Border Radius (px)</label>
              <input
                type="number"
                name="radius"
                defaultValue={initial.components.radius}
                onChange={(e) => updateDraft('components.radius', Number(e.target.value))}
                min="0"
                max="24"
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
            >
              {isPending ? 'Saving…' : 'Save Theme'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isPending}
              className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Reset to Factory
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Live Preview</h2>
        <ThemePreview theme={draft} />
      </div>
    </div>
  );
}

