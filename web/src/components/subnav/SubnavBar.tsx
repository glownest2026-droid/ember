'use client';

import Link from 'next/link';
import { Plus, Info } from 'lucide-react';
import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';
import { SubnavSwitch } from './SubnavSwitch';
import { createClient } from '@/utils/supabase/client';
import { useState, useCallback } from 'react';

export function SubnavBar() {
  const { user, stats, refetch } = useSubnavStats();
  const [remindersBusy, setRemindersBusy] = useState(false);

  const remindersEnabled = stats?.remindersEnabled ?? false;

  const handleRemindersChange = useCallback(
    async (checked: boolean) => {
      if (!user) return;
      setRemindersBusy(true);
      const prev = remindersEnabled;
      try {
        const supabase = createClient();
        const { error } = await supabase.from('user_notification_prefs').upsert(
          { user_id: user.id, development_reminders_enabled: checked },
          { onConflict: 'user_id' }
        );
        if (error) throw error;
        await refetch();
      } catch {
        setRemindersBusy(false);
        return;
      }
      setRemindersBusy(false);
    },
    [user, remindersEnabled, refetch]
  );

  if (!user || !stats) return null;

  return (
    <div
      className="border-b"
      style={{
        borderColor: 'var(--ember-border-subtle, #E5E7EB)',
        backgroundColor: 'var(--ember-surface-secondary, #F9FAFB)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <Link
              href="/app/children"
              className="inline-flex items-center justify-center gap-2 h-8 rounded-md px-3 text-sm font-medium text-white transition-colors w-full sm:w-auto"
              style={{
                backgroundColor: 'var(--ember-cta-primary, #FF6347)',
              }}
            >
              <Plus className="w-4 h-4" aria-hidden />
              Add a child
            </Link>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-semibold" style={{ color: 'var(--ember-text-high)' }}>
                  {stats.toysSaved}
                </div>
                <div className="text-sm" style={{ color: 'var(--ember-text-low)' }}>
                  toys saved
                </div>
              </div>
              <div className="hidden sm:block h-8 w-px bg-gray-300" aria-hidden />
              <div className="flex items-center gap-2">
                <div className="text-2xl font-semibold" style={{ color: 'var(--ember-text-high)' }}>
                  {stats.giftsSaved}
                </div>
                <div className="text-sm" style={{ color: 'var(--ember-text-low)' }}>
                  gifts saved
                </div>
              </div>
              <div className="hidden sm:block h-8 w-px bg-gray-300" aria-hidden />
              <div className="flex items-center gap-2">
                <div className="text-2xl font-semibold" style={{ color: 'var(--ember-text-high)' }}>
                  {stats.categoryIdeasSaved}
                </div>
                <div className="text-sm" style={{ color: 'var(--ember-text-low)' }}>
                  category ideas saved
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: 'var(--ember-text-high)' }}>
              Send me development reminders
            </span>
            <SubnavSwitch
              checked={remindersEnabled}
              onCheckedChange={handleRemindersChange}
              disabled={remindersBusy}
            />
            <button
              type="button"
              className="ml-1 rounded-full p-0.5 transition-colors hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8432B]"
              style={{ color: 'var(--ember-text-low)' }}
              title="We'll automatically send you proactive play ideas at just the right time for your child's next developmental needs."
              aria-label="Info about development reminders"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
