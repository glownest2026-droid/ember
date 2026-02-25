'use client';

import { useState } from 'react';
import Link from 'next/link';

const baseStyle = { fontFamily: 'var(--font-sans)' } as const;

/** Placeholder child for shell only. Name optional (display fallback). */
const PLACEHOLDER_CHILDREN = [
  { id: 'placeholder-1', displayName: null as string | null, ageBand: '—', currentFocus: '—', nextUp: '—' },
];

type TabId = 'ideas' | 'products' | 'gifts';

/** Want + Gift as two controls (not mutually exclusive). Gift implies Want. No persistence. */
function WantGiftControls({
  want,
  gift,
  onWantChange,
  onGiftChange,
}: {
  want: boolean;
  gift: boolean;
  onWantChange: (v: boolean) => void;
  onGiftChange: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3" style={baseStyle}>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={want}
          onChange={(e) => onWantChange(e.target.checked)}
          className="rounded border-gray-300"
        />
        <span style={{ color: 'var(--ember-text-high)' }}>Want</span>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={gift}
          onChange={(e) => onGiftChange(e.target.checked)}
          disabled={!want}
          className="rounded border-gray-300 disabled:opacity-50"
        />
        <span style={{ color: 'var(--ember-text-high)' }}>Gift</span>
      </label>
    </div>
  );
}

/** Dashboard shell matching Figma layout. Placeholder data only; no DB. */
export function FamilyDashboardClient() {
  const [selectedChildId, setSelectedChildId] = useState(PLACEHOLDER_CHILDREN[0].id);
  const [activeTab, setActiveTab] = useState<TabId>('ideas');
  const [remindersOn, setRemindersOn] = useState(false);
  const [skeletonWant, setSkeletonWant] = useState(false);
  const [skeletonGift, setSkeletonGift] = useState(false);

  const selectedChild = PLACEHOLDER_CHILDREN.find((c) => c.id === selectedChildId) ?? PLACEHOLDER_CHILDREN[0];
  const displayName = selectedChild.displayName ?? 'My child';

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--brand-bg-1, #FFFCF8) 0%, var(--brand-bg-2, #FFFFFF) 100%)' }}>
      {/* Header */}
      <header
        className="border-b bg-[var(--ember-surface-primary)]"
        style={{ borderColor: 'var(--ember-border-subtle)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
              Manage My Family
            </h1>
            <div className="flex items-center gap-2">
              <button type="button" className="p-2 rounded-lg opacity-70 hover:opacity-100 text-sm" title="Coming soon" style={{ color: 'var(--ember-text-low)' }}>
                Help
              </button>
              <Link href="/account" className="p-2 rounded-lg opacity-70 hover:opacity-100 text-sm" style={{ color: 'var(--ember-text-low)' }}>
                Settings
              </Link>
            </div>
          </div>
          <p className="text-sm" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
            Everything you&apos;ve saved and what&apos;s next – in one place. <span className="opacity-70">(Coming soon)</span>
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Child chips */}
        <div className="mb-4 overflow-x-auto -mx-4 px-4 pb-2">
          <div className="flex gap-2 min-w-min">
            {PLACEHOLDER_CHILDREN.map((child) => (
              <button
                key={child.id}
                type="button"
                onClick={() => setSelectedChildId(child.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
                style={
                  selectedChildId === child.id
                    ? { backgroundColor: 'var(--ember-accent-base)', color: 'white' }
                    : { backgroundColor: 'var(--ember-surface-primary)', color: 'var(--ember-text-high)', border: '1px solid var(--ember-border-subtle)' }
                }
              >
                {child.displayName ?? '—'} · {child.ageBand}
              </button>
            ))}
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border border-dashed"
              style={{ borderColor: 'var(--ember-border-subtle)', color: 'var(--ember-accent-base)' }}
              title="Coming soon"
            >
              + Add child
            </button>
          </div>
        </div>

        {/* Personalization strip */}
        <div
          className="rounded-xl border p-5 mb-6"
          style={{
            background: 'linear-gradient(to bottom right, var(--ember-surface-primary), var(--ember-surface-secondary, #f5f5f5))',
            borderColor: 'var(--ember-border-subtle)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
            Today for {displayName}
          </h2>
          <p className="text-sm mb-1" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
            {displayName} (aged —): {selectedChild.currentFocus}.
          </p>
          <p className="text-sm" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
            {selectedChild.nextUp}
          </p>
        </div>

        {/* Two-column: My list (left) + Support (right) */}
        <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-8">
          {/* My list */}
          <div
            className="rounded-xl border p-5 sm:p-6 mb-6 lg:mb-0"
            style={{
              backgroundColor: 'var(--ember-surface-primary)',
              borderColor: 'var(--ember-border-subtle)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
                My list
              </h2>
              <div className="flex items-center gap-2">
                <button type="button" className="p-2 rounded opacity-70" title="Coming soon" style={{ color: 'var(--ember-text-low)' }}>
                  Filter
                </button>
                <button type="button" className="p-2 rounded opacity-70" title="Coming soon" style={{ color: 'var(--ember-text-low)' }}>
                  Search
                </button>
              </div>
            </div>

            {/* Tabs: Ideas, Products, Gifts */}
            <div className="flex gap-1 p-1 rounded-lg mb-6 bg-[var(--ember-surface-secondary,#f5f5f5)] w-fit">
              {(['ideas', 'products', 'gifts'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className="px-4 py-2 rounded-md text-sm font-medium capitalize"
                  style={
                    activeTab === tab
                      ? { backgroundColor: 'var(--ember-surface-primary)', color: 'var(--ember-text-high)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }
                      : { color: 'var(--ember-text-low)' }
                  }
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Placeholder: one skeleton card with Want + Gift controls */}
            <div className="space-y-4">
              <p className="text-sm" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
                No saved {activeTab} yet. When you save from Discover, they&apos;ll appear here.
              </p>
              <div
                className="rounded-lg border p-4"
                style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-secondary, #fafafa)' }}
              >
                <div className="h-4 w-3/4 rounded bg-gray-200 mb-3 animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-gray-100 mb-4 animate-pulse" />
                <WantGiftControls
                  want={skeletonWant}
                  gift={skeletonGift}
                  onWantChange={setSkeletonWant}
                  onGiftChange={setSkeletonGift}
                />
                <p className="text-xs mt-2" style={{ color: 'var(--ember-text-low)' }}>
                  (Placeholder – no persistence)
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--ember-border-subtle)' }}>
              <button type="button" className="text-sm opacity-70 hover:opacity-100" style={{ color: 'var(--ember-text-low)' }}>
                Share my list <span className="text-xs">(Coming soon)</span>
              </button>
            </div>
          </div>

          {/* Right column: Next steps, Reminders, Settings */}
          <div className="space-y-6">
            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: 'var(--ember-surface-primary)',
                borderColor: 'var(--ember-border-subtle)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
                Next steps for {displayName}
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
                — (Coming soon)
              </p>
              <Link
                href="/discover"
                className="inline-block w-full text-center py-2 rounded-lg font-medium text-sm text-white"
                style={{ backgroundColor: 'var(--ember-accent-base)' }}
              >
                Discover next steps
              </Link>
            </div>

            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: 'var(--ember-surface-primary)',
                borderColor: 'var(--ember-border-subtle)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
                  Remind me
                </h3>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={remindersOn}
                    onChange={(e) => setRemindersOn(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm" style={{ color: 'var(--ember-text-low)' }}>(Placeholder)</span>
                </label>
              </div>
              <p className="text-xs" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
                A gentle email when your child hits the next stage. <span className="opacity-70">(Coming soon)</span>
              </p>
            </div>

            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: 'var(--ember-surface-primary)',
                borderColor: 'var(--ember-border-subtle)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <Link href="/account" className="text-sm font-medium hover:underline" style={{ color: 'var(--ember-text-high)' }}>
                Settings
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
