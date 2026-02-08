'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Bookmark, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GatewayCategoryTypePublic } from '@/lib/pl/public';

const ICON_STROKE = '#B8432B';

export interface CategoryTileData extends Pick<GatewayCategoryTypePublic, 'id' | 'slug' | 'label' | 'name' | 'rationale' | 'image_url'> {}

interface CategoryCarouselProps {
  categories: CategoryTileData[];
  onShowExamples: (categoryId: string) => void;
  /** Returns signin URL for Save idea (enables button when provided) */
  signinUrlForCategory?: (categoryId: string) => string;
  /** Handler for Have them (enables button when provided) */
  onHaveThem?: (categoryId: string) => void;
}

function CategoryTypeCard({
  category,
  isSelected,
  onSelect,
  onShowExamples,
  signinUrlForCategory,
  onHaveThem,
}: {
  category: CategoryTileData;
  isSelected: boolean;
  onSelect: () => void;
  onShowExamples: (categoryId: string) => void;
  signinUrlForCategory?: (categoryId: string) => string;
  onHaveThem?: (categoryId: string) => void;
}) {
  const [rationaleExpanded, setRationaleExpanded] = useState(false);
  const label = category.label ?? category.name ?? category.slug ?? 'Category';
  const reason = category.rationale?.trim() ?? null;
  const imgUrl = category.image_url ?? null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        'flex-shrink-0 w-[280px] sm:w-[300px] min-h-[220px] rounded-xl overflow-hidden cursor-pointer',
        'border-2 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8432B] focus-visible:ring-offset-2',
        isSelected
          ? 'border-[#B8432B] shadow-[0px_0px_24px_rgba(184,67,43,0.25)]'
          : 'border-[var(--ember-border-subtle)] hover:border-[var(--ember-text-low)]'
      )}
      style={{
        backgroundColor: 'var(--ember-surface-primary)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div className="relative w-full h-[120px] overflow-hidden" style={{ backgroundColor: 'var(--ember-surface-soft)' }}>
        {imgUrl ? (
          <img
            src={imgUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, var(--ember-surface-soft) 0%, var(--ember-surface-primary) 100%)',
              borderBottom: '1px solid var(--ember-border-subtle)',
            }}
          >
            <Sparkles size={32} strokeWidth={1.5} style={{ color: ICON_STROKE }} className="opacity-80" />
          </div>
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
          aria-hidden
        />
        <div className="absolute bottom-2 left-2 right-2 text-white">
          <h3 className="text-base font-semibold leading-tight line-clamp-2">{label}</h3>
          {reason && (
            <p
              className={cn(
                'text-xs mt-0.5 opacity-90 leading-snug',
                rationaleExpanded ? '' : 'line-clamp-2'
              )}
              title={reason}
            >
              {reason}
            </p>
          )}
          {reason && reason.length > 80 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setRationaleExpanded((v) => !v);
              }}
              className="text-[11px] mt-0.5 font-medium opacity-95 hover:underline focus:outline-none focus:underline"
            >
              {rationaleExpanded ? 'Less' : 'More'}
            </button>
          )}
        </div>
      </div>
      <div className="p-3 flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          {signinUrlForCategory ? (
            <Link
              href={signinUrlForCategory(category.id)}
              onClick={(e) => e.stopPropagation()}
              className="min-h-[32px] px-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5"
              style={{
                borderColor: 'var(--ember-border-subtle)',
                backgroundColor: 'var(--ember-surface-primary)',
                color: 'var(--ember-text-high)',
              }}
            >
              <Bookmark size={12} strokeWidth={2} />
              Save idea
            </Link>
          ) : (
            <span
              className="min-h-[32px] px-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 opacity-50 cursor-not-allowed"
              style={{
                borderColor: 'var(--ember-border-subtle)',
                backgroundColor: 'var(--ember-surface-primary)',
                color: 'var(--ember-text-high)',
              }}
            >
              <Bookmark size={12} strokeWidth={2} />
              Save idea
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onHaveThem) onHaveThem(category.id);
            }}
            disabled={!onHaveThem}
            className="min-h-[32px] px-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: 'var(--ember-border-subtle)',
              backgroundColor: 'var(--ember-surface-primary)',
              color: 'var(--ember-text-high)',
            }}
          >
            <Check size={12} strokeWidth={2} />
            Have them
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShowExamples(category.id);
            }}
            className="min-h-[32px] px-2.5 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5"
            style={{
              backgroundColor: 'var(--ember-accent-base)',
              color: 'white',
            }}
          >
            <Sparkles size={12} strokeWidth={2} />
            Show examples
          </button>
        </div>
      </div>
    </div>
  );
}

export function CategoryCarousel({
  categories,
  onShowExamples,
  signinUrlForCategory,
  onHaveThem,
}: CategoryCarouselProps) {
  const [current, setCurrent] = useState(0);

  const handlePrevious = () => {
    setCurrent((prev) => (prev <= 0 ? categories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev >= categories.length - 1 ? 0 : prev + 1));
  };

  if (!categories.length) return null;

  return (
    <div
      className="relative w-full"
      role="region"
      aria-label="Category ideas carousel"
    >
      <div className="overflow-hidden">
        <ul
          className="flex"
          style={{
            transform: `translateX(-${current * 100}%)`,
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {categories.map((cat, index) => (
            <li key={cat.id} className="flex-shrink-0 w-full flex justify-center px-2">
              <CategoryTypeCard
                category={cat}
                isSelected={current === index}
                onSelect={() => setCurrent(index)}
                onShowExamples={onShowExamples}
                signinUrlForCategory={signinUrlForCategory}
                onHaveThem={onHaveThem}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-center gap-2 mt-4">
        <button
          type="button"
          onClick={handlePrevious}
          className="w-10 h-10 flex items-center justify-center rounded-full border shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8432B] focus-visible:ring-offset-2"
          style={{
            borderColor: 'var(--ember-border-subtle)',
            backgroundColor: 'var(--ember-surface-primary)',
            color: 'var(--ember-text-high)',
          }}
          aria-label="Previous category"
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
        <span
          className="text-sm tabular-nums"
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}
        >
          {current + 1} / {categories.length}
        </span>
        <button
          type="button"
          onClick={handleNext}
          className="w-10 h-10 flex items-center justify-center rounded-full border shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8432B] focus-visible:ring-offset-2"
          style={{
            borderColor: 'var(--ember-border-subtle)',
            backgroundColor: 'var(--ember-surface-primary)',
            color: 'var(--ember-text-high)',
          }}
          aria-label="Next category"
        >
          <ChevronRight size={20} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
