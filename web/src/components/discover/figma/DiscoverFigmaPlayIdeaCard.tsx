'use client';

import { Bookmark, CheckCircle } from 'lucide-react';
import { DiscoverFigmaImage } from './DiscoverFigmaImage';

export function DiscoverFigmaPlayIdeaCard({
  title,
  description,
  ageRangeLabel,
  imageUrl,
  onSeeExamples,
  onSaveIdea,
  onHaveThem,
}: {
  id: string;
  title: string;
  description: string;
  scienceConnection?: string;
  ageRangeLabel: string;
  imageUrl: string;
  isSelected?: boolean;
  onClick?: () => void;
  onSeeExamples: () => void;
  onSaveIdea: (e: React.MouseEvent, el: HTMLButtonElement | null) => void;
  onHaveThem?: (e: React.MouseEvent) => void;
}) {
  return (
    <article className="bg-white border border-[#E7E2DC] rounded-[24px] overflow-hidden shadow-sm flex flex-col h-full group">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#FBFAF7]">
        <DiscoverFigmaImage
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
          <span className="text-[12px] font-bold text-[#253044] tracking-wide">{ageRangeLabel}</span>
        </div>
      </div>

      <div className="p-5 md:p-6 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-bold text-[18px] md:text-[20px] text-[#253044] mb-1.5 leading-tight">{title}</h3>
          {description ? (
            <p className="text-[15px] text-[#66717D] leading-relaxed line-clamp-3">{description}</p>
          ) : null}
        </div>

        <div className="mt-auto pt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSeeExamples();
            }}
            className="flex-1 bg-[#FF5C34] hover:bg-[#E04B28] text-white py-3.5 px-4 rounded-full font-bold text-[15px] transition-colors text-center shadow-sm"
          >
            See examples
          </button>
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
            <Bookmark size={20} strokeWidth={2.5} />
          </button>
          {onHaveThem ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onHaveThem(e);
              }}
              className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full border border-[#E7E2DC] text-[#66717D] hover:text-[#7DBA78] hover:border-[#7DBA78] hover:bg-[#7DBA78]/10 transition-colors shadow-sm"
              title="Already have it"
              aria-label="Already have it"
            >
              <CheckCircle size={20} strokeWidth={2.5} />
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
