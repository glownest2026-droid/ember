'use client';

export type DiscoverAudienceMode = 'parent' | 'gift';

function AudiencePillToggle({
  mode,
  onChange,
}: {
  mode: DiscoverAudienceMode;
  onChange: (mode: DiscoverAudienceMode) => void;
}) {
  return (
    <div
      className="inline-flex w-auto shrink-0 rounded-full border border-[#E7E2DC] bg-[#FBFAF7] p-1"
      role="tablist"
      aria-label="Discover audience"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'parent'}
        onClick={() => onChange('parent')}
        className={`whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-semibold transition-colors ${
          mode === 'parent'
            ? 'border border-[#E7E2DC] bg-white text-[#253044] shadow-sm'
            : 'text-[#66717D] hover:text-[#253044]'
        }`}
      >
        I&apos;m the parent
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'gift'}
        onClick={() => onChange('gift')}
        className={`whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-semibold transition-colors ${
          mode === 'gift'
            ? 'border border-[#E7E2DC] bg-white text-[#253044] shadow-sm'
            : 'text-[#66717D] hover:text-[#253044]'
        }`}
      >
        Buying a gift
      </button>
    </div>
  );
}

export function DiscoverAudienceToggle({
  mode,
  onChange,
  bandLabel,
  className = '',
  variant = 'card',
}: {
  mode: DiscoverAudienceMode;
  onChange: (mode: DiscoverAudienceMode) => void;
  bandLabel: string;
  className?: string;
  /** `inline` — pill toggle only (desktop top row). `card` — full panel with helper copy. */
  variant?: 'card' | 'inline';
}) {
  if (variant === 'inline') {
    return (
      <div className={className}>
        <AudiencePillToggle mode={mode} onChange={onChange} />
      </div>
    );
  }

  const helper =
    mode === 'parent'
      ? 'What’s changing, useful ideas, and what to bring back out at home.'
      : `Tangible gift ideas for ${bandLabel} — no routines or safety checks mixed in.`;

  return (
    <section
      className={`rounded-[20px] border border-[#E7E2DC] bg-white p-4 shadow-sm ${className}`.trim()}
      aria-label="Who is this page for?"
    >
      <p className="text-[13px] font-semibold text-[#66717D] m-0 mb-3">Who is this for?</p>
      <AudiencePillToggle mode={mode} onChange={onChange} />
      <p className="text-[13px] text-[#66717D] leading-relaxed mt-3 mb-0 max-w-xl">{helper}</p>
    </section>
  );
}
