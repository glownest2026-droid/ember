'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Users } from 'lucide-react';

interface CoParentCardProps {
  coParentEmail: string;
  setCoParentEmail: (value: string) => void;
}

/** UI only — invite not persisted in this PR. */
export function CoParentCard({ coParentEmail, setCoParentEmail }: CoParentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSendInvite = async () => {
    if (!coParentEmail || !coParentEmail.includes('@')) return;
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSending(false);
    setCoParentEmail('');
    setIsExpanded(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-[var(--ember-border-subtle)] overflow-hidden shadow-sm mb-6">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-[var(--ember-surface-soft)]/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[var(--ember-accent-base)]" strokeWidth={2} />
          <div>
            <h2 className="text-lg font-medium text-[var(--ember-text-high)] mb-0.5">Invite a co-parent</h2>
            <p className="text-xs text-[var(--ember-text-low)]">Optional — you can do this later</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-[var(--ember-text-low)] flex-shrink-0" strokeWidth={2} />
        ) : (
          <ChevronDown className="w-5 h-5 text-[var(--ember-text-low)] flex-shrink-0" strokeWidth={2} />
        )}
      </button>
      {isExpanded && (
        <div className="px-6 pb-6">
          <p className="text-sm text-[var(--ember-text-low)] mb-4">
            They can view and add saves. You can change this later.
          </p>
          <div className="space-y-3">
            <div>
              <label htmlFor="coParentEmail" className="block text-sm font-medium text-[var(--ember-text-high)] mb-2">
                Email address
              </label>
              <div className="relative">
                <input
                  id="coParentEmail"
                  type="email"
                  value={coParentEmail}
                  onChange={(e) => setCoParentEmail(e.target.value)}
                  placeholder="partner@example.com"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-[var(--ember-border-subtle)] bg-white text-[var(--ember-text-high)] placeholder:text-[var(--ember-text-low)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--ember-accent-base)] input"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ember-text-low)] pointer-events-none" strokeWidth={2} />
              </div>
            </div>
            <button
              type="button"
              onClick={handleSendInvite}
              disabled={isSending || !coParentEmail}
              className="w-full py-3 bg-[var(--ember-text-high)] text-white rounded-xl text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending…</span>
                </>
              ) : (
                'Send invite'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
