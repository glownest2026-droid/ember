'use client';

import { Calendar, Info, Heart } from 'lucide-react';

interface ChildDetailsCardProps {
  /** Optional: "What do you call them?" (Figma). */
  childName: string;
  setChildName: (value: string) => void;
  dateOfBirth: string;
  setDateOfBirth: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  onPrivacyClick: () => void;
}

/** Child details: optional call name (Figma), DOB, gender. */
export function ChildDetailsCard({
  childName,
  setChildName,
  dateOfBirth,
  setDateOfBirth,
  gender,
  setGender,
  onPrivacyClick,
}: ChildDetailsCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-[var(--ember-border-subtle)] p-6 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-5 h-5 text-[var(--ember-accent-base)]" strokeWidth={2} fill="currentColor" />
        <h2 className="text-lg font-medium text-[var(--ember-text-high)]">Tell us about them</h2>
      </div>

      {/* Name input (Figma: "What do you call them?" optional) */}
      <div className="mb-6">
        <label htmlFor="childName" className="block text-sm font-medium text-[var(--ember-text-high)] mb-2">
          What do you call them? <span className="font-normal text-[var(--ember-text-low)]">(optional)</span>
        </label>
        <input
          id="childName"
          type="text"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          placeholder="e.g., Lily, Button, Little One..."
          className="w-full px-4 py-3 bg-white border border-[var(--ember-border-subtle)] rounded-xl text-base text-[var(--ember-text-high)] placeholder:text-[var(--ember-text-low)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--ember-accent-base)] focus:border-transparent transition-all input"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-[var(--ember-text-high)] mb-2">
          When were they born?
        </label>
        <div className="relative">
          <input
            id="dateOfBirth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full px-4 py-3 pr-12 rounded-xl border border-[var(--ember-border-subtle)] bg-white text-[var(--ember-text-high)] focus:outline-none focus:ring-2 focus:ring-[var(--ember-accent-base)] focus:border-transparent transition-all input"
          />
          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ember-text-low)] pointer-events-none" strokeWidth={2} />
        </div>
        <button
          type="button"
          onClick={onPrivacyClick}
          className="flex items-center gap-1.5 mt-2 text-xs text-[var(--ember-text-low)] hover:text-[var(--ember-accent-base)] transition-colors"
        >
          <Info className="w-3.5 h-3.5" strokeWidth={2} />
          <span className="underline">Why we ask this</span>
        </button>
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-[var(--ember-text-high)] mb-2">
          Gender <span className="font-normal text-[var(--ember-text-low)]">(optional)</span>
        </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-[var(--ember-border-subtle)] bg-white text-[var(--ember-text-high)] focus:outline-none focus:ring-2 focus:ring-[var(--ember-accent-base)] focus:border-transparent transition-all input"
        >
          <option value="">—</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
      </div>
    </div>
  );
}
