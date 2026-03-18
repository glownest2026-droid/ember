'use client';

import { motion } from 'motion/react';
import { DiscoverFigmaImage } from './DiscoverFigmaImage';

export function DiscoverFigmaPlayIdeaCard({
  title,
  description,
  scienceConnection,
  imageUrl,
  isSelected,
  onClick,
  onSeeExamples,
  onSaveIdea,
  onHaveThem,
}: {
  id: string;
  title: string;
  description: string;
  scienceConnection: string;
  imageUrl: string;
  isSelected: boolean;
  onClick: () => void;
  onSeeExamples: () => void;
  onSaveIdea: (e: React.MouseEvent, el: HTMLButtonElement | null) => void;
  onHaveThem: (e: React.MouseEvent) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative rounded-3xl overflow-hidden bg-white border-2 transition-all duration-300 cursor-pointer group
        ${isSelected
          ? 'border-[var(--ember-accent-base)] shadow-xl'
          : 'border-transparent hover:border-[var(--ember-accent-base)]/30 hover:shadow-lg'
        }
      `}
      whileHover={{ y: -6 }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="relative h-52 lg:h-64 overflow-hidden bg-[var(--ember-surface-soft)]">
        <DiscoverFigmaImage
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
          <h4 className="text-base lg:text-xl font-medium text-white mb-1 drop-shadow-lg leading-tight">{title}</h4>
          <p className="text-xs lg:text-sm text-white/95 font-medium drop-shadow">{scienceConnection}</p>
        </div>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 lg:top-4 lg:right-4 w-8 h-8 lg:w-9 lg:h-9 bg-white rounded-full flex items-center justify-center shadow-lg"
          >
            <svg className="w-4 h-4 lg:w-5 lg:h-5 text-[var(--ember-accent-base)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </div>

      {description ? (
        <p className="px-4 pt-3 text-xs text-[var(--ember-text-low)] line-clamp-3 lg:line-clamp-4">{description}</p>
      ) : null}

      <div className="p-4 lg:p-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSeeExamples();
          }}
          className="flex-1 min-w-[120px] px-4 py-2.5 lg:py-3 bg-[var(--ember-accent-base)] text-white rounded-xl font-medium text-xs lg:text-sm hover:opacity-95 transition-opacity hover:shadow-md"
        >
          See examples
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSaveIdea(e, e.currentTarget);
          }}
          className="px-3.5 lg:px-4 py-2.5 lg:py-3 border-2 border-[var(--ember-border-subtle)] rounded-xl hover:border-[var(--ember-accent-base)] hover:bg-[rgba(255,99,71,0.06)] transition-colors text-xs lg:text-sm font-medium text-[var(--ember-text-high)]"
        >
          Save
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onHaveThem(e);
          }}
          className="px-3.5 lg:px-4 py-2.5 lg:py-3 border-2 border-[var(--ember-border-subtle)] rounded-xl hover:border-[var(--ember-accent-base)] hover:bg-[rgba(255,99,71,0.06)] transition-colors text-xs lg:text-sm font-medium text-[var(--ember-text-high)]"
        >
          Have
        </button>
      </div>
    </motion.div>
  );
}
