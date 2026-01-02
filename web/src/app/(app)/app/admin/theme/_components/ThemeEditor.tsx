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
    background1: '#FFFCF8',
    background2: '#FFFFFF',
    surface: '#FFFFFF',
    section1: '#FFF8F0',
    section2: '#FFFCF8',
    text: '#27303F',
    muted: '#57534E',
    border: '#D6D3D1',
    primaryForeground: '#27303F',
    accentForeground: '#27303F',
    scrollbarThumb: '#D6D3D1',
  },
  typography: {
    fontHeading: 'inter_plusjakarta',
    fontSubheading: 'inter_plusjakarta',
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
  const [savedAt, setSavedAt] = useState<string | null>(null);
  
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
        background1: String(fd.get('background1') || '').trim() || undefined,
        background2: String(fd.get('background2') || '').trim() || undefined,
        surface: String(fd.get('surface') || '').trim() || undefined,
        section1: String(fd.get('section1') || '').trim() || undefined,
        section2: String(fd.get('section2') || '').trim() || undefined,
        text: String(fd.get('text') || '').trim() || undefined,
        muted: String(fd.get('muted') || '').trim() || undefined,
        border: String(fd.get('border') || '').trim() || undefined,
        primaryForeground: String(fd.get('primaryForeground') || '').trim() || undefined,
        accentForeground: String(fd.get('accentForeground') || '').trim() || undefined,
        scrollbarThumb: String(fd.get('scrollbarThumb') || '').trim() || undefined,
      },
      typography: {
        fontHeading: String(fd.get('fontHeading') || '').trim() || undefined,
        fontSubheading: String(fd.get('fontSubheading') || '').trim() || undefined,
        fontBody: String(fd.get('fontBody') || '').trim() || undefined,
        baseFontSize: Number(fd.get('baseFontSize')) || undefined,
      },
      components: {
        radius: Number(fd.get('radius')) || undefined,
      },
    };

    // Validate hex colors
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const colorFields = ['primary', 'accent', 'background1', 'background2', 'surface', 'section1', 'section2', 'text', 'muted', 'border', 'primaryForeground', 'accentForeground', 'scrollbarThumb'] as const;
    for (const field of colorFields) {
      const value = themeUpdate.colors?.[field];
      if (value && !hexRegex.test(value)) {
        setError(`${field} must be a valid hex color (e.g., #FFBEAB)`);
        return;
      }
    }

    const validFontPairs = ['inter_plusjakarta', 'dmsans_inter', 'manrope_inter', 'worksans_inter', 'nunito_sourcesans3', 'lexend_inter', 'outfit_inter', 'inter_outfit', 'sourcesans3_sourcesans3', 'inter_inter', 'fraunces_inter', 'inter_fraunces'];
    if (themeUpdate.typography?.fontHeading && !validFontPairs.includes(themeUpdate.typography.fontHeading)) {
      setError('Invalid heading font');
      return;
    }
    if (themeUpdate.typography?.fontSubheading && !validFontPairs.includes(themeUpdate.typography.fontSubheading)) {
      setError('Invalid subheading font');
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
          let errorMessage = text || 'Failed to save theme';
          try {
            const errorJson = JSON.parse(text);
            if (errorJson.error) {
              errorMessage = errorJson.error;
            }
          } catch {
            // Use text as-is if not JSON
          }
          throw new Error(errorMessage);
        }

        const result = await response.json();
        if (result.success === true && result.updated_at) {
          setSuccess(true);
          setSavedAt(result.updated_at);
          // Refresh to apply new theme
          router.refresh();
        } else {
          throw new Error(result.error || 'Save failed: invalid response');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to save theme');
        setSuccess(false);
        setSavedAt(null);
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
    setSavedAt(null);

    startTransition(async () => {
      try {
        const response = await fetch('/api/admin/theme', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(FACTORY_THEME),
        });

        if (!response.ok) {
          const text = await response.text();
          let errorMessage = text || 'Failed to reset theme';
          try {
            const errorJson = JSON.parse(text);
            if (errorJson.error) {
              errorMessage = errorJson.error;
            }
          } catch {
            // Use text as-is if not JSON
          }
          throw new Error(errorMessage);
        }

        const result = await response.json();
        if (result.success === true && result.updated_at) {
          setDraft(FACTORY_THEME);
          setSuccess(true);
          setSavedAt(result.updated_at);
          router.refresh();
        } else {
          throw new Error(result.error || 'Reset failed: invalid response');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to reset theme');
        setSuccess(false);
        setSavedAt(null);
      }
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-start" style={{ alignContent: 'start' }}>
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="rounded bg-red-100 p-3 text-red-700">{error}</div>
          )}
          {success && savedAt && (
            <div className="rounded bg-green-100 p-3 text-green-700">
              <div className="font-semibold">Saved ✓</div>
              <div className="text-xs mt-1">
                {new Date(savedAt).toLocaleString()}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-3">Colors</h2>
            <div className="space-y-3">
              {/* Primary & Accent */}
              <div>
                <label className="block text-sm mb-1">Primary (buttons, CTAs)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    name="primary"
                    defaultValue={initial.colors.primary}
                    onChange={(e) => updateDraft('colors.primary', e.target.value)}
                    className="w-16 h-10 border rounded"
                  />
                  <input
                    type="text"
                    name="primary"
                    defaultValue={initial.colors.primary}
                    onChange={(e) => updateDraft('colors.primary', e.target.value)}
                    className="flex-1 border p-2 rounded"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Primary Foreground (text on primary buttons)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    name="primaryForeground"
                    defaultValue={initial.colors.primaryForeground}
                    onChange={(e) => updateDraft('colors.primaryForeground', e.target.value)}
                    className="w-16 h-10 border rounded"
                  />
                  <input
                    type="text"
                    name="primaryForeground"
                    defaultValue={initial.colors.primaryForeground}
                    onChange={(e) => updateDraft('colors.primaryForeground', e.target.value)}
                    className="flex-1 border p-2 rounded"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Accent (secondary buttons, highlights)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    name="accent"
                    defaultValue={initial.colors.accent}
                    onChange={(e) => updateDraft('colors.accent', e.target.value)}
                    className="w-16 h-10 border rounded"
                  />
                  <input
                    type="text"
                    name="accent"
                    defaultValue={initial.colors.accent}
                    onChange={(e) => updateDraft('colors.accent', e.target.value)}
                    className="flex-1 border p-2 rounded"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Accent Foreground (text on accent buttons)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    name="accentForeground"
                    defaultValue={initial.colors.accentForeground}
                    onChange={(e) => updateDraft('colors.accentForeground', e.target.value)}
                    className="w-16 h-10 border rounded"
                  />
                  <input
                    type="text"
                    name="accentForeground"
                    defaultValue={initial.colors.accentForeground}
                    onChange={(e) => updateDraft('colors.accentForeground', e.target.value)}
                    className="flex-1 border p-2 rounded"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  />
                </div>
              </div>
              
              {/* Background gradient */}
              <div className="pt-2 border-t">
                <label className="block text-sm font-medium mb-2">Background Gradient (page)</label>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs mb-1 text-gray-600">Background 1 (top)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        name="background1"
                        defaultValue={initial.colors.background1}
                        onChange={(e) => updateDraft('colors.background1', e.target.value)}
                        className="w-16 h-10 border rounded"
                      />
                      <input
                        type="text"
                        name="background1"
                        defaultValue={initial.colors.background1}
                        onChange={(e) => updateDraft('colors.background1', e.target.value)}
                        className="flex-1 border p-2 rounded"
                        pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs mb-1 text-gray-600">Background 2 (bottom)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        name="background2"
                        defaultValue={initial.colors.background2}
                        onChange={(e) => updateDraft('colors.background2', e.target.value)}
                        className="w-16 h-10 border rounded"
                      />
                      <input
                        type="text"
                        name="background2"
                        defaultValue={initial.colors.background2}
                        onChange={(e) => updateDraft('colors.background2', e.target.value)}
                        className="flex-1 border p-2 rounded"
                        pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section gradient */}
              <div className="pt-2 border-t">
                <label className="block text-sm font-medium mb-2">Section Gradient (alternating blocks)</label>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs mb-1 text-gray-600">Section 1 (top)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        name="section1"
                        defaultValue={initial.colors.section1}
                        onChange={(e) => updateDraft('colors.section1', e.target.value)}
                        className="w-16 h-10 border rounded"
                      />
                      <input
                        type="text"
                        name="section1"
                        defaultValue={initial.colors.section1}
                        onChange={(e) => updateDraft('colors.section1', e.target.value)}
                        className="flex-1 border p-2 rounded"
                        pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs mb-1 text-gray-600">Section 2 (bottom)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        name="section2"
                        defaultValue={initial.colors.section2}
                        onChange={(e) => updateDraft('colors.section2', e.target.value)}
                        className="w-16 h-10 border rounded"
                      />
                      <input
                        type="text"
                        name="section2"
                        defaultValue={initial.colors.section2}
                        onChange={(e) => updateDraft('colors.section2', e.target.value)}
                        className="flex-1 border p-2 rounded"
                        pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Other colors */}
              {(['surface', 'text', 'muted', 'border'] as const).map((color) => (
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
                <label className="block text-sm mb-1">Heading Font (H1)</label>
                <select
                  name="fontHeading"
                  defaultValue={initial.typography.fontHeading}
                  onChange={(e) => updateDraft('typography.fontHeading', e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="inter_plusjakarta">Plus Jakarta (head) + Inter (body)</option>
                  <option value="dmsans_inter">DM Sans (head) + Inter (body)</option>
                  <option value="manrope_inter">Manrope (head) + Inter (body)</option>
                  <option value="worksans_inter">Work Sans (head) + Inter (body)</option>
                  <option value="nunito_sourcesans3">Nunito (head) + Source Sans 3 (body)</option>
                  <option value="lexend_inter">Lexend (head) + Inter (body)</option>
                  <option value="outfit_inter">Outfit (head) + Inter (body)</option>
                  <option value="sourcesans3_sourcesans3">Source Sans 3 (both)</option>
                  <option value="inter_inter">Inter (both)</option>
                  <option value="fraunces_inter">Fraunces (head) + Inter (body)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Subheading Font (H2-H6)</label>
                <select
                  name="fontSubheading"
                  defaultValue={initial.typography.fontSubheading}
                  onChange={(e) => updateDraft('typography.fontSubheading', e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="inter_plusjakarta">Plus Jakarta (head) + Inter (body)</option>
                  <option value="dmsans_inter">DM Sans (head) + Inter (body)</option>
                  <option value="manrope_inter">Manrope (head) + Inter (body)</option>
                  <option value="worksans_inter">Work Sans (head) + Inter (body)</option>
                  <option value="nunito_sourcesans3">Nunito (head) + Source Sans 3 (body)</option>
                  <option value="lexend_inter">Lexend (head) + Inter (body)</option>
                  <option value="outfit_inter">Outfit (head) + Inter (body)</option>
                  <option value="sourcesans3_sourcesans3">Source Sans 3 (both)</option>
                  <option value="inter_inter">Inter (both)</option>
                  <option value="fraunces_inter">Fraunces (head) + Inter (body)</option>
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
                  <option value="inter_plusjakarta">Inter + Plus Jakarta</option>
                  <option value="dmsans_inter">Inter + DM Sans</option>
                  <option value="manrope_inter">Inter + Manrope</option>
                  <option value="worksans_inter">Inter + Work Sans</option>
                  <option value="nunito_sourcesans3">Source Sans 3 + Nunito</option>
                  <option value="lexend_inter">Inter + Lexend</option>
                  <option value="outfit_inter">Inter + Outfit</option>
                  <option value="inter_outfit">Outfit + Inter</option>
                  <option value="sourcesans3_sourcesans3">Source Sans 3 + Source Sans 3</option>
                  <option value="inter_inter">Inter + Inter</option>
                  <option value="fraunces_inter">Inter + Fraunces</option>
                  <option value="inter_fraunces">Fraunces + Inter</option>
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

          <div className="mt-4">
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

          <div className="flex gap-2 mt-4">
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

      <div className="lg:sticky lg:top-[calc(var(--header-height,56px)+16px)] lg:self-start">
        <h2 className="text-lg font-semibold mb-3">Live Preview</h2>
        <div className="lg:max-h-[calc(100vh-var(--header-height,56px)-32px)] lg:overflow-auto">
          <ThemePreview theme={draft} />
        </div>
      </div>
    </div>
  );
}

