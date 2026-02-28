'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { calculateAgeBand } from '@/lib/ageBand';
import { Plus } from 'lucide-react';

const baseStyle = { fontFamily: 'var(--font-sans)' } as const;

/** Child profile from DB (no name field – privacy). */
interface ChildProfile {
  id: string;
  birthdate: string | null;
  gender: string | null;
  age_band: string | null;
}

/** Dashboard: child profiles only; list/today/sidebar live on /my-ideas. */
export function FamilyDashboardClient({
  saved = false,
  deleted = false,
}: { saved?: boolean; deleted?: boolean } = {}) {
  const [children, setChildren] = useState<ChildProfile[]>([]);

  const fetchChildren = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('children')
      .select('id, birthdate, gender, age_band')
      .order('created_at', { ascending: false });
    const list = (data ?? []) as ChildProfile[];
    setChildren(list);
  }, []);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--brand-bg-1, #FFFCF8) 0%, var(--brand-bg-2, #FFFFFF) 100%)' }}>
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
            Everything you&apos;ve saved and what&apos;s next – in one place.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {saved && (
          <div className="rounded-xl bg-green-100 p-3 text-green-700 text-sm mb-4">Profile saved</div>
        )}
        {deleted && (
          <div className="rounded-xl bg-green-100 p-3 text-green-700 text-sm mb-4">Profile deleted</div>
        )}

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
              Child profiles
            </h2>
            <Link
              href="/add-children"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors"
              style={{ backgroundColor: 'var(--ember-accent-base)', color: 'white' }}
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              Add a child
            </Link>
          </div>
          {children.length === 0 ? (
            <div className="text-center py-10 rounded-2xl border bg-white/80" style={{ borderColor: 'var(--ember-border-subtle)' }}>
              <p className="text-sm mb-3" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>No child profiles yet.</p>
              <Link
                href="/add-children"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: 'var(--ember-accent-base)' }}
              >
                <Plus className="w-4 h-4" strokeWidth={2} />
                Add your first child
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {children.map((child) => {
                const ageBand = child.age_band || (child.birthdate ? calculateAgeBand(child.birthdate) : null) || '—';
                return (
                  <div
                    key={child.id}
                    className="rounded-2xl border p-4 bg-white flex items-start justify-between"
                    style={{ borderColor: 'var(--ember-border-subtle)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
                        {child.birthdate ? `Birthdate: ${new Date(child.birthdate).toLocaleDateString()}` : 'Birthdate: —'}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
                        Age band: {ageBand}
                      </p>
                      {child.gender && (
                        <p className="text-sm" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
                          Gender: {child.gender}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/add-children/${child.id}`}
                      className="px-3 py-2 rounded-xl text-sm font-medium border shrink-0"
                      style={{ borderColor: 'var(--ember-border-subtle)', color: 'var(--ember-text-high)', ...baseStyle }}
                    >
                      Edit
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="mt-6">
          <Link
            href="/my-ideas"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ backgroundColor: 'var(--ember-accent-base)', color: 'white' }}
          >
            Go to My ideas
          </Link>
        </div>
      </main>
    </div>
  );
}
