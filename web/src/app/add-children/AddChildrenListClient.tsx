'use client';

import Link from 'next/link';
import { ArrowLeft, Plus, Sparkles } from 'lucide-react';

type ChildItem = {
  id: string;
  birthdate: string | null;
  gender: string | null;
  age_band: string | null;
};

export function AddChildrenListClient({
  children: items,
  saved,
  deleted,
}: {
  children: ChildItem[];
  saved: boolean;
  deleted: boolean;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--ember-accent-base)]/5 to-white">
      <header className="bg-white/90 backdrop-blur-sm border-b border-[var(--ember-border-subtle)] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/family"
            className="p-2 -ml-2 hover:bg-[var(--ember-surface-soft)] rounded-full transition-colors"
            aria-label="Back to family"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--ember-text-high)]" strokeWidth={2} />
          </Link>
          <h1 className="text-xl font-medium text-[var(--ember-text-high)]">Your children</h1>
          <Link
            href="/add-children/new"
            className="p-2 -mr-2 hover:bg-[var(--ember-surface-soft)] rounded-full transition-colors flex items-center gap-1"
            aria-label="Add a child"
          >
            <Plus className="w-5 h-5 text-[var(--ember-text-high)]" strokeWidth={2} />
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {saved && (
          <div className="rounded-xl bg-green-100 p-3 text-green-700 text-sm mb-4">Profile saved</div>
        )}
        {deleted && (
          <div className="rounded-xl bg-green-100 p-3 text-green-700 text-sm mb-4">Profile deleted</div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--ember-accent-base)]" strokeWidth={2} />
            <h2 className="text-lg font-medium text-[var(--ember-text-high)]">Child profiles</h2>
          </div>
          <Link
            href="/add-children/new"
            className="inline-flex items-center gap-2 px-4 py-3 bg-[var(--ember-accent-base)] text-white rounded-xl font-medium text-sm hover:bg-[var(--ember-accent-hover)] hover:shadow-[0px_8px_32px_rgba(255,99,71,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Add a child
          </Link>
        </div>

        {!items.length ? (
          <div className="text-center py-12 rounded-3xl border border-[var(--ember-border-subtle)] bg-white/80">
            <p className="text-[var(--ember-text-low)] mb-4">No child profiles yet.</p>
            <Link
              href="/add-children/new"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--ember-accent-base)] text-white rounded-xl font-medium hover:bg-[var(--ember-accent-hover)] transition-colors"
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              Add your first child
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((child) => (
              <div
                key={child.id}
                className="bg-white rounded-2xl border border-[var(--ember-border-subtle)] p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="text-sm text-[var(--ember-text-low)]">
                      {child.birthdate
                        ? `Birthdate: ${new Date(child.birthdate).toLocaleDateString()}`
                        : 'Birthdate: —'}
                    </div>
                    <div className="text-sm text-[var(--ember-text-low)]">
                      Age band: {child.age_band ?? '—'}
                    </div>
                    {child.gender && (
                      <div className="text-sm text-[var(--ember-text-low)]">Gender: {child.gender}</div>
                    )}
                  </div>
                  <Link
                    href={`/add-children/${child.id}`}
                    className="px-4 py-2 text-sm font-medium rounded-xl border border-[var(--ember-border-subtle)] bg-white text-[var(--ember-text-high)] hover:bg-[var(--ember-surface-soft)] transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
