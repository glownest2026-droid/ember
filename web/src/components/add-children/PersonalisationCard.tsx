'use client';

import { Bell } from 'lucide-react';

interface PersonalisationCardProps {
  remindersEnabled: boolean;
  setRemindersEnabled: (value: boolean) => void;
  reminderFrequency: string;
  setReminderFrequency: (value: string) => void;
}

/** UI only — not persisted to DB. */
export function PersonalisationCard({
  remindersEnabled,
  setRemindersEnabled,
  reminderFrequency,
  setReminderFrequency,
}: PersonalisationCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-[var(--ember-border-subtle)] p-6 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Bell className="w-5 h-5 text-[var(--ember-accent-base)]" strokeWidth={2} />
        <h2 className="text-lg font-medium text-[var(--ember-text-high)]">Get toy recommendations</h2>
      </div>
      <p className="text-xs text-[var(--ember-text-low)] mb-6">
        We&apos;ll suggest new toys as they grow and learn
      </p>
      <div className="mb-4">
        <div className="flex items-center justify-between p-4 bg-[var(--ember-surface-soft)] rounded-xl">
          <div>
            <label htmlFor="reminders" className="text-sm font-medium text-[var(--ember-text-high)] cursor-pointer">
              Send me updates
            </label>
            <p className="text-xs text-[var(--ember-text-low)] mt-0.5">
              Timely suggestions for their next developmental stage
            </p>
          </div>
          <input
            id="reminders"
            type="checkbox"
            checked={remindersEnabled}
            onChange={(e) => setRemindersEnabled(e.target.checked)}
            className="w-5 h-5 rounded border-[var(--ember-border-subtle)] text-[var(--ember-accent-base)] focus:ring-2 focus:ring-[var(--ember-accent-base)]"
          />
        </div>
      </div>
      {remindersEnabled && (
        <div>
          <label className="block text-sm font-medium text-[var(--ember-text-high)] mb-3">How often?</label>
          <div className="flex flex-wrap gap-2">
            {['monthly', 'two-months', 'off'].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setReminderFrequency(value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  reminderFrequency === value
                    ? 'bg-[var(--ember-accent-base)] text-white shadow-sm'
                    : 'bg-[var(--ember-surface-soft)] text-[var(--ember-text-high)] hover:bg-[var(--ember-border-subtle)]'
                }`}
              >
                {value === 'monthly' ? 'Monthly' : value === 'two-months' ? 'Every 2 months' : 'Milestones only'}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--ember-text-low)]">
            Perfect timing for new toys that match their growing abilities
          </p>
        </div>
      )}
    </div>
  );
}
