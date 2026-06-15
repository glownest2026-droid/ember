'use client';

import type { LucideIcon } from 'lucide-react';
import { getAudienceLensCardStyle } from '@/lib/discover/audienceLens';

export function DiscoverFigmaNeedCard({
  icon: Icon,
  title,
  description,
  isSelected,
  onClick,
  disabled,
  showSuggested,
  audienceLens,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  science?: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  showSuggested?: boolean;
  audienceLens?: string | null;
}) {
  const lensStyle = getAudienceLensCardStyle(audienceLens);
  const defaultCard = isSelected
    ? 'bg-[#FFF6F3] border-[#FF5C34] shadow-md z-10'
    : 'bg-white border-[#E7E2DC] shadow-sm hover:border-[#D0C9C0] hover:shadow-md';
  const lensCard = lensStyle
    ? isSelected
      ? lensStyle.cardSelected
      : `${lensStyle.card} shadow-sm hover:shadow-md`
    : defaultCard;
  const defaultIconWrap =
    isSelected && !disabled ? 'bg-white shadow-sm' : 'bg-[#FBFAF7] border border-[#E7E2DC]';
  const lensIconWrap =
    lensStyle && (isSelected ? lensStyle.iconWrapSelected : lensStyle.iconWrap);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`relative flex flex-col items-start text-left p-4 md:p-5 rounded-[20px] transition-all border w-full ${
        disabled ? 'opacity-60 cursor-not-allowed border-[#E7E2DC] bg-white' : ''
      } ${!disabled ? lensCard : ''}`}
    >
      {showSuggested ? (
        <span className="absolute -top-2 left-2 z-10 text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#FFF6F3] text-[#FF5C34] border border-[#FF5C34]/20">
          Suggested
        </span>
      ) : null}
      <div
        className={`w-12 h-12 rounded-[14px] flex items-center justify-center mb-4 transition-colors ${
          lensIconWrap ?? defaultIconWrap
        }`}
      >
        <Icon size={24} strokeWidth={isSelected ? 2.5 : 2} className="text-[var(--ember-accent-base)]" />
      </div>
      <h3 className="font-bold text-[17px] text-[#253044] leading-tight">{title}</h3>
      {description.trim() ? (
        <p className="text-[14px] text-[#66717D] leading-relaxed mt-1.5 line-clamp-2 md:line-clamp-none">{description}</p>
      ) : null}
    </button>
  );
}
