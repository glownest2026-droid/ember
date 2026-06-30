'use client';

import { Save, CheckCircle, ChevronRight, Maximize2, Gift } from 'lucide-react';
import { DiscoverFigmaImage } from './DiscoverFigmaImage';

export function DiscoverFigmaPlayIdeaCard({
  title,
  description,
  imageUrl,
  onSeeExamples,
  onSaveIdea,
  onGiftAction,
  onHaveThem,
  onExpand,
  isDimmed = false,
  isHaveActive = false,
  imagePriority = false,
  showEmberPicks = true,
  showSaveAction = true,
  showGiftAction = false,
  ctaLabel = 'Ember Picks',
  helperNote = null,
  badgeLabel = null,
}: {
  id: string;
  title: string;
  description: string;
  scienceConnection?: string;
  imageUrl: string;
  imagePriority?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onSeeExamples: () => void;
  onSaveIdea: (e: React.MouseEvent, el: HTMLButtonElement | null) => void;
  onGiftAction?: (e: React.MouseEvent, el: HTMLButtonElement | null) => void;
  onHaveThem?: (e: React.MouseEvent) => void;
  onExpand?: (e: React.MouseEvent) => void;
  isDimmed?: boolean;
  isHaveActive?: boolean;
  audienceLens?: string | null;
  showEmberPicks?: boolean;
  showSaveAction?: boolean;
  showGiftAction?: boolean;
  ctaLabel?: string;
  helperNote?: string | null;
  badgeLabel?: string | null;
}) {
  return (
    <article
      className={`bg-white border border-[#E7E2DC] rounded-[24px] overflow-hidden shadow-sm flex flex-col h-full group transition-all duration-300 ${
        isDimmed ? 'opacity-45 grayscale' : 'opacity-100'
      }`}
    >
      <div className="relative aspect-[16/9] max-h-[150px] md:max-h-[165px] overflow-hidden bg-[#FBFAF7]">
        <DiscoverFigmaImage
          src={imageUrl}
          alt={title}
          variant="card"
          priority={imagePriority}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {onExpand ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onExpand(e);
            }}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/95 border border-[#E7E2DC] text-[#253044] shadow-sm hover:bg-white hover:border-[#FF5C34] hover:text-[#FF5C34] transition-colors"
            aria-label={`Expand ${title}`}
          >
            <Maximize2 size={16} strokeWidth={2.5} />
          </button>
        ) : null}
      </div>

      <div className="p-4 md:p-5 flex flex-col flex-1 gap-2.5">
        <div>
          {badgeLabel ? (
            <span className="inline-flex rounded-full border border-[#E7E2DC] bg-[#FBFAF7] px-2 py-0.5 text-[11px] font-semibold text-[#66717D] mb-2">
              {badgeLabel}
            </span>
          ) : null}
          <h3 className="font-bold text-[18px] md:text-[19px] text-[#253044] mb-1 leading-tight">{title}</h3>
          {description ? (
            <p className="text-[14px] md:text-[15px] text-[#66717D] leading-relaxed line-clamp-3 md:line-clamp-4">{description}</p>
          ) : null}
          {helperNote ? (
            <p className="text-[12px] text-[#66717D] leading-relaxed mt-2">{helperNote}</p>
          ) : null}
        </div>

        <div className="mt-auto pt-2 flex items-center gap-3">
          {showEmberPicks ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSeeExamples();
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#FF5C34] hover:bg-[#E04B28] text-white py-3.5 px-4 rounded-full font-bold text-[15px] transition-colors shadow-sm whitespace-nowrap"
              aria-label={`${ctaLabel} for ${title}`}
            >
              {ctaLabel}
              <ChevronRight size={18} strokeWidth={2.5} aria-hidden />
            </button>
          ) : null}
          {showSaveAction ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSaveIdea(e, e.currentTarget);
              }}
              className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full border border-[#E7E2DC] text-[#66717D] hover:bg-[#FBFAF7] hover:border-[#D0C9C0] transition-colors shadow-sm"
              title="Save"
              aria-label="Save idea"
            >
              <Save size={20} strokeWidth={2.5} />
            </button>
          ) : null}
          {showGiftAction && onGiftAction ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onGiftAction(e, e.currentTarget);
              }}
              className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full border border-[#E7E2DC] text-[#66717D] hover:bg-[#FBFAF7] hover:border-[#D0C9C0] transition-colors shadow-sm"
              title="Save gift idea"
              aria-label="Save gift idea"
            >
              <Gift size={20} strokeWidth={2.5} />
            </button>
          ) : null}
          {onHaveThem ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onHaveThem(e);
              }}
              className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full border transition-colors shadow-sm ${
                isHaveActive
                  ? 'border-[#7DBA78] bg-[#7DBA78]/15 text-[#7DBA78]'
                  : 'border-[#E7E2DC] text-[#66717D] hover:text-[#7DBA78] hover:border-[#7DBA78] hover:bg-[#7DBA78]/10'
              }`}
              title={isHaveActive ? 'Show this idea again' : 'Already have it — hide while browsing'}
              aria-label={isHaveActive ? 'Show this idea again' : 'Already have it — hide while browsing'}
              aria-pressed={isHaveActive}
            >
              <CheckCircle size={20} strokeWidth={2.5} />
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
