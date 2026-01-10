'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AgeBand {
  id: string;
  label: string;
  min_months: number;
  max_months: number;
}

interface Moment {
  id: string;
  label: string;
  description?: string;
}

interface CategoryType {
  id: string;
  label?: string;
  slug?: string;
  name?: string;
}

interface Product {
  id: string;
  name: string;
}

interface RecoCard {
  id: string;
  lane: 'obvious' | 'nearby' | 'surprise';
  rank: number;
  because: string;
  why_tags?: string[] | null;
  category_type_id?: string | null;
  product_id?: string | null;
  pl_category_types?: CategoryType | null;
  products?: Product | null;
}

interface AgeMomentSet {
  id: string;
  age_band_id: string;
  moment_id: string;
  headline?: string | null;
  pl_reco_cards?: RecoCard[] | null;
}

interface NewLandingPageClientProps {
  ageBand: AgeBand | null;
  moments: Moment[];
  selectedSet: AgeMomentSet | null;
  currentMonths: number;
  selectedMomentId: string | null;
  minMonths: number;
  maxMonths: number;
}

// Map lane enum to badge label (matching mockup)
const laneLabelMap: Record<string, string> = {
  obvious: 'Bath pick',
  nearby: 'Nearby idea',
  surprise: 'Surprise pick',
};

// Map moment IDs to display labels (fallback if moment label not available)
const momentLabelMap: Record<string, string> = {
  bath: 'Bath time',
  help: '"Let me help"',
  quiet: 'Quiet play',
  energy: 'Burn energy',
};

// Map moment IDs to descriptions (matching mockup)
const momentDescMap: Record<string, string> = {
  bath: 'More fun, less fuss',
  help: 'Cooking, chores, pretend',
  quiet: 'Hands busy, head calm',
  energy: 'Move, climb, chase',
};

export default function NewLandingPageClient({
  ageBand,
  moments,
  selectedSet,
  currentMonths,
  selectedMomentId,
  minMonths,
  maxMonths,
}: NewLandingPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedAge, setSelectedAge] = useState(currentMonths);
  const [selectedMoment, setSelectedMoment] = useState(selectedMomentId);

  // Sync state with props when route changes
  useEffect(() => {
    setSelectedAge(currentMonths);
    setSelectedMoment(selectedMomentId);
  }, [currentMonths, selectedMomentId]);

  // Update URL when age changes (deep linking)
  useEffect(() => {
    if (selectedAge !== currentMonths) {
      const params = new URLSearchParams(searchParams.toString());
      if (selectedMoment) {
        params.set('moment', selectedMoment);
      }
      const queryString = params.toString();
      router.push(`/new/${selectedAge}${queryString ? `?${queryString}` : ''}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAge]);

  // Update URL when moment changes (query param)
  const handleMomentChange = (momentId: string) => {
    if (momentId === selectedMoment) return; // No change needed
    setSelectedMoment(momentId);
    const params = new URLSearchParams();
    params.set('moment', momentId);
    router.push(`/new/${selectedAge}?${params.toString()}`, { scroll: false });
  };

  // Handle age slider change
  const handleAgeChange = (months: number) => {
    setSelectedAge(months);
  };

  // Get cards from selected set, sorted by rank
  const cards = selectedSet?.pl_reco_cards 
    ? [...selectedSet.pl_reco_cards].sort((a, b) => a.rank - b.rank)
    : [];

  // Get moment label
  const getMomentLabel = (momentId: string) => {
    const moment = moments.find(m => m.id === momentId);
    return moment?.label || momentLabelMap[momentId] || momentId;
  };

  // Get moment description
  const getMomentDesc = (momentId: string) => {
    const moment = moments.find(m => m.id === momentId);
    return moment?.description || momentDescMap[momentId] || '';
  };

  // Get card title (from category type or product)
  const getCardTitle = (card: RecoCard) => {
    if (card.pl_category_types?.label) {
      return card.pl_category_types.label;
    }
    if (card.pl_category_types?.name) {
      return card.pl_category_types.name;
    }
    if (card.products?.name) {
      return card.products.name;
    }
    // Fallback placeholder
    return 'Toy idea';
  };

  // Get card subtitle/description
  const getCardSubtitle = (card: RecoCard) => {
    // For now, use a generic description - this could come from category type description
    if (card.lane === 'obvious') {
      return 'The kind of thing they stick with.';
    }
    if (card.lane === 'nearby') {
      return 'A close cousin that works just as well.';
    }
    return 'You might not have thought of that.';
  };

  // Build signin redirect URL with current state
  const getSigninUrl = (cardId?: string) => {
    const params = new URLSearchParams();
    params.set('next', `/new/${selectedAge}${selectedMoment ? `?moment=${selectedMoment}` : ''}`);
    if (cardId) {
      params.set('cardId', cardId);
    }
    return `/signin?${params.toString()}`;
  };

  return (
    <div className="max-w-[430px] mx-auto px-3.5 pb-14" style={{
      background: 'linear-gradient(180deg, #FFF3EA 0%, #FFFDFB 58%, #FFFFFF 100%)',
      minHeight: '100vh',
    }}>
      {/* Hero Section */}
      <section className="pt-4 pb-2.5 relative">
        <h1 className="font-serif text-[28px] leading-[1.06] tracking-[-0.6px] my-1.5" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
          Toy ideas that fit your child&apos;s age.
        </h1>
        <p className="text-sm leading-[1.55] opacity-70 mb-3" style={{ color: '#6B5B52' }}>
          A quick starter set (3 picks + the &quot;why&quot;), then save your shortlist to unlock more like what they love.
        </p>

        {/* Promise Pills */}
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-xs px-2.5 py-2 rounded-full border bg-white/65 shadow-sm" style={{ 
            color: 'rgba(23,17,14,.84)',
            borderColor: 'rgba(23,17,14,.10)',
          }}>
            No child name
          </span>
          <span className="text-xs px-2.5 py-2 rounded-full border bg-white/65 shadow-sm" style={{ 
            color: 'rgba(23,17,14,.84)',
            borderColor: 'rgba(23,17,14,.10)',
          }}>
            Under a minute
          </span>
          <span className="text-xs px-2.5 py-2 rounded-full border bg-white/65 shadow-sm" style={{ 
            color: 'rgba(23,17,14,.84)',
            borderColor: 'rgba(23,17,14,.10)',
          }}>
            Reasoned picks
          </span>
        </div>

        {/* Control Deck */}
        <div className="mt-3.5 rounded-[28px] bg-gradient-to-b from-white/86 to-white/66 border shadow-md overflow-hidden relative" style={{
          borderColor: 'rgba(23,17,14,.08)',
          boxShadow: '0 18px 46px rgba(23,17,14,.10)',
        }}>
          <div className="p-4 pb-3.5 relative">
            {/* Age Slider Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between gap-2.5 mb-2">
                <label className="text-sm opacity-70" style={{ color: '#6B5B52' }}>
                  My child is:
                </label>
                <div className="flex items-center gap-2 px-2.5 py-2 rounded-full bg-white/78 border shadow-xs" style={{
                  borderColor: 'rgba(23,17,14,.10)',
                }}>
                  <strong className="font-extrabold text-xs">{selectedAge}</strong>
                  <span className="text-xs opacity-70" style={{ color: '#6B5B52' }}>months</span>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={minMonths}
                max={maxMonths}
                value={selectedAge}
                onChange={(e) => handleAgeChange(Number(e.target.value))}
                className="w-full new-age-slider"
              />

              {/* Tick marks */}
              <div className="flex justify-between text-[11px] opacity-42 mt-0.5 px-0.5" style={{ color: 'rgba(23,17,14,.42)' }}>
                {Array.from({ length: maxMonths - minMonths + 1 }, (_, i) => minMonths + i).map(num => (
                  <span key={num}>{num}</span>
                ))}
              </div>
            </div>

            {/* Trust indicator */}
            <div className="flex items-center gap-2 mt-1.5 mb-4">
              <span className="w-[7px] h-[7px] rounded-full" style={{
                background: 'rgba(227,91,63,.55)',
                boxShadow: '0 8px 18px rgba(227,91,63,.22)',
              }}></span>
              <span className="text-xs opacity-70" style={{ color: '#8A756A' }}>
                We only use age + what you pick below to tailor ideas.
              </span>
            </div>

            {/* Moment Selection */}
            <div className="mb-4">
              <div className="text-sm opacity-70 mb-2.5" style={{ color: '#6B5B52' }}>
                What do you want help with today?
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {moments.map((moment) => {
                  const isSelected = selectedMoment === moment.id;
                  return (
                    <button
                      key={moment.id}
                      onClick={() => handleMomentChange(moment.id)}
                      className="min-h-[74px] p-3 rounded-[20px] border bg-white/92 shadow-xs cursor-pointer transition-all flex items-center gap-3 relative overflow-hidden"
                      style={{
                        borderColor: isSelected ? 'rgba(227,91,63,.42)' : 'rgba(23,17,14,.10)',
                        boxShadow: isSelected ? '0 18px 40px rgba(227,91,63,.16)' : '0 6px 16px rgba(23,17,14,.06)',
                        background: isSelected 
                          ? 'radial-gradient(circle at 20% 15%, rgba(244,167,122,.28), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.92) 0%, rgba(255,255,255,.65) 70%)'
                          : 'linear-gradient(180deg, rgba(255,255,255,.92) 0%, rgba(255,255,255,.65) 70%)',
                      }}
                      aria-selected={isSelected}
                    >
                      {/* Icon placeholder */}
                      <div className="w-[42px] h-[42px] rounded-2xl bg-gradient-to-br from-white via-orange-200 to-orange-400 border flex-shrink-0" style={{
                        borderColor: 'rgba(255,255,255,.55)',
                        boxShadow: '0 16px 30px rgba(227,91,63,.18)',
                      }}></div>
                      <div className="min-w-0 flex-1">
                        <strong className="block text-sm font-extrabold leading-tight mb-0.5 tracking-[-0.15px]">
                          {getMomentLabel(moment.id)}
                        </strong>
                        <span className="block text-xs opacity-70 whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: '#6B5B52' }}>
                          {getMomentDesc(moment.id)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA Button */}
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  // Scroll to cards section
                  document.getElementById('findsSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="w-full min-h-[44px] rounded-[20px] border-0 py-3.5 px-4 font-extrabold text-[15px] tracking-[0.1px] text-white cursor-pointer transition-all"
                style={{
                  background: 'linear-gradient(180deg, rgba(227,91,63,.98) 0%, rgba(185,67,52,.98) 100%)',
                  boxShadow: '0 22px 48px rgba(227,91,63,.26)',
                }}
              >
                {selectedMoment ? `Show my 3 picks for ${getMomentLabel(selectedMoment).toLowerCase()}` : 'Show my 3 picks'}
              </button>
              <p className="text-center text-xs opacity-70" style={{ color: '#8A756A' }}>
                Tip: save one thing to unlock &quot;more like this&quot;.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section id="findsSection" className="mt-4.5 pt-1.5">
        <div className="flex items-baseline justify-between gap-2.5 mb-2.5">
          <h2 className="text-base font-black tracking-[-0.15px] m-0">
            {selectedMoment ? `Your 3 picks for ${getMomentLabel(selectedMoment).toLowerCase()}` : 'Your 3 picks'}
          </h2>
          <button className="bg-white/62 border rounded-2xl px-3 py-2.5 text-sm opacity-70 shadow-xs cursor-pointer" style={{
            borderColor: 'rgba(23,17,14,.10)',
            color: '#6B5B52',
          }}>
            Why these?
          </button>
        </div>

        {/* Cards */}
        {cards.length === 0 ? (
          <div className="rounded-[28px] bg-gradient-to-b from-white/92 to-white/78 border shadow-sm p-6 text-center" style={{
            borderColor: 'rgba(23,17,14,.08)',
          }}>
            <p className="text-sm opacity-70 mb-2" style={{ color: '#6B5B52' }}>
              We&apos;re still building this moment for this age. Try another moment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {cards.map((card, index) => (
              <article
                key={card.id}
                className="rounded-[28px] bg-gradient-to-b from-white/92 to-white/78 border shadow-sm overflow-hidden"
                style={{
                  borderColor: 'rgba(23,17,14,.08)',
                  boxShadow: '0 12px 28px rgba(23,17,14,.08)',
                }}
              >
                {/* Media placeholder */}
                <div className="h-[162px] relative bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300">
                  <div className="absolute left-3 top-3 px-2.5 py-2 rounded-full bg-white/78 border backdrop-blur-sm shadow-xs inline-flex items-center gap-2" style={{
                    borderColor: 'rgba(255,255,255,.55)',
                  }}>
                    <span className="w-2 h-2 rounded-full" style={{
                      background: 'rgba(227,91,63,.60)',
                      boxShadow: '0 10px 20px rgba(227,91,63,.25)',
                    }}></span>
                    <span className="text-xs opacity-80" style={{ color: 'rgba(23,17,14,.80)' }}>
                      {laneLabelMap[card.lane] || `${card.lane} pick`}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 space-y-2.5">
                  <p className="text-sm leading-[1.5] opacity-70 m-0" style={{ color: '#6B5B52' }}>
                    {card.because}
                  </p>
                  <div>
                    <strong className="block text-base font-black tracking-[-0.2px] mb-0.5">
                      Try: {getCardTitle(card)}
                    </strong>
                    <span className="block text-xs leading-[1.45] opacity-70" style={{ color: '#8A756A' }}>
                      {getCardSubtitle(card)}
                    </span>
                  </div>

                  {/* Tags */}
                  {card.why_tags && card.why_tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-0.5">
                      {card.why_tags.map((tag, tagIndex) => (
                        <button
                          key={tagIndex}
                          className="text-xs px-2.5 py-1.5 rounded-full bg-orange-50 border cursor-pointer transition-all"
                          style={{
                            borderColor: 'rgba(227,91,63,.16)',
                            color: 'rgba(23,17,14,.85)',
                            background: 'rgba(227,91,63,.09)',
                          }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2.5 items-center mt-1">
                    <Link
                      href={getSigninUrl(card.id)}
                      className="flex-1 min-h-[44px] rounded-[20px] border bg-white/88 shadow-xs font-black text-sm text-inherit cursor-pointer transition-all flex items-center justify-center"
                      style={{
                        borderColor: 'rgba(23,17,14,.10)',
                      }}
                    >
                      Save to shortlist
                    </Link>
                    <button
                      className="flex-shrink-0 text-sm opacity-70 py-2.5 px-2.5 rounded-2xl border-0 bg-transparent cursor-pointer"
                      style={{ color: '#6B5B52' }}
                    >
                      Already got it?
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

