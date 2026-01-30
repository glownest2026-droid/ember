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

interface Wrapper {
  ux_wrapper_id: string;
  ux_label: string;
  ux_slug: string;
  ux_description: string | null;
  age_band_id: string;
  rank: number;
}

interface WrapperDetail {
  age_band_id: string;
  rank: number;
  ux_wrapper_id: string;
  ux_label: string;
  ux_slug: string;
  ux_description: string | null;
  development_need_id: string;
  development_need_name: string;
  development_need_slug: string;
  plain_english_description: string | null;
  why_it_matters: string | null;
  stage_anchor_month: number | null;
  stage_phase: string | null;
  stage_reason: string | null;
}

interface CategoryType {
  age_band_id: string;
  development_need_id: string;
  rank: number;
  rationale: string | null;
  id: string;
  slug: string;
  label: string;
  name: string;
  description: string | null;
  image_url: string | null;
  safety_notes: string | null;
}

interface Product {
  age_band_id: string;
  category_type_id: string;
  rank: number;
  rationale: string | null;
  id: string;
  name: string;
  brand: string | null;
  image_url: string | null;
  canonical_url: string | null;
  amazon_uk_url: string | null;
  affiliate_url: string | null;
  affiliate_deeplink: string | null;
}

interface NewLandingPageClientProps {
  ageBand: AgeBand | null;
  wrappers: Wrapper[];
  wrapperDetail: WrapperDetail | null;
  categories: CategoryType[];
  products: Product[];
  currentMonths: number;
  selectedWrapperId: string | null;
  minMonths: number;
  maxMonths: number;
}


export default function NewLandingPageClient({
  ageBand,
  wrappers,
  wrapperDetail,
  categories,
  products,
  currentMonths,
  selectedWrapperId,
  minMonths,
  maxMonths,
}: NewLandingPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedAge, setSelectedAge] = useState(currentMonths);
  const [selectedWrapper, setSelectedWrapper] = useState(selectedWrapperId);

  // Sync state with props when route changes
  useEffect(() => {
    setSelectedAge(currentMonths);
    setSelectedWrapper(selectedWrapperId);
  }, [currentMonths, selectedWrapperId]);

  // Update URL when age changes (deep linking)
  useEffect(() => {
    if (selectedAge !== currentMonths) {
      const params = new URLSearchParams(searchParams.toString());
      if (selectedWrapper) {
        params.set('wrapper', selectedWrapper);
      }
      const queryString = params.toString();
      router.push(`/new/${selectedAge}${queryString ? `?${queryString}` : ''}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAge]);

  // Update URL when wrapper changes (query param)
  const handleWrapperChange = (wrapperId: string) => {
    if (wrapperId === selectedWrapper) return; // No change needed
    setSelectedWrapper(wrapperId);
    const params = new URLSearchParams();
    params.set('wrapper', wrapperId);
    router.push(`/new/${selectedAge}?${params.toString()}`, { scroll: false });
  };

  // Handle age slider change
  const handleAgeChange = (months: number) => {
    setSelectedAge(months);
  };

  // Get wrapper label
  const getWrapperLabel = (wrapperId: string) => {
    const wrapper = wrappers.find(w => w.ux_wrapper_id === wrapperId);
    return wrapper?.ux_label || wrapperId;
  };

  // Get wrapper description
  const getWrapperDesc = (wrapperId: string) => {
    const wrapper = wrappers.find(w => w.ux_wrapper_id === wrapperId);
    return wrapper?.ux_description || '';
  };

  // Build signin redirect URL with current state
  const getSigninUrl = (productId?: string) => {
    const params = new URLSearchParams();
    params.set('next', `/new/${selectedAge}${selectedWrapper ? `?wrapper=${selectedWrapper}` : ''}`);
    if (productId) {
      params.set('productId', productId);
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

            {/* Wrapper Selection */}
            <div className="mb-4">
              <div className="text-sm opacity-70 mb-2.5" style={{ color: '#6B5B52' }}>
                What do you want help with today?
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {wrappers.map((wrapper) => {
                  const isSelected = selectedWrapper === wrapper.ux_wrapper_id;
                  return (
                    <button
                      key={wrapper.ux_wrapper_id}
                      onClick={() => handleWrapperChange(wrapper.ux_wrapper_id)}
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
                          {wrapper.ux_label}
                        </strong>
                        <span className="block text-xs opacity-70 whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: '#6B5B52' }}>
                          {wrapper.ux_description || ''}
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
                  // Scroll to picks section
                  document.getElementById('findsSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="w-full min-h-[44px] rounded-[20px] border-0 py-3.5 px-4 font-extrabold text-[15px] tracking-[0.1px] text-white cursor-pointer transition-all"
                style={{
                  background: 'linear-gradient(180deg, rgba(227,91,63,.98) 0%, rgba(185,67,52,.98) 100%)',
                  boxShadow: '0 22px 48px rgba(227,91,63,.26)',
                }}
              >
                {selectedWrapper ? `Show my 3 picks for ${getWrapperLabel(selectedWrapper).toLowerCase()}` : 'Show my 3 picks'}
              </button>
              <p className="text-center text-xs opacity-70" style={{ color: '#8A756A' }}>
                Tip: save one thing to unlock &quot;more like this&quot;.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Picks Section */}
      <section id="findsSection" className="mt-4.5 pt-1.5">
        <div className="flex items-baseline justify-between gap-2.5 mb-2.5">
          <h2 className="text-base font-black tracking-[-0.15px] m-0">
            {selectedWrapper ? `Your 3 picks for ${getWrapperLabel(selectedWrapper).toLowerCase()}` : 'Your 3 picks'}
          </h2>
          {wrapperDetail?.stage_reason && (
            <button className="bg-white/62 border rounded-2xl px-3 py-2.5 text-sm opacity-70 shadow-xs cursor-pointer" style={{
              borderColor: 'rgba(23,17,14,.10)',
              color: '#6B5B52',
            }}>
              Why these?
            </button>
          )}
        </div>

        {/* Wrapper Detail Header */}
        {wrapperDetail && (
          <div className="rounded-[28px] bg-gradient-to-b from-white/92 to-white/78 border shadow-sm p-4 mb-3" style={{
            borderColor: 'rgba(23,17,14,.08)',
          }}>
            <h3 className="text-base font-black tracking-[-0.2px] mb-2">
              {wrapperDetail.ux_label}
            </h3>
            {wrapperDetail.plain_english_description && (
              <p className="text-sm leading-[1.5] opacity-70 mb-2" style={{ color: '#6B5B52' }}>
                {wrapperDetail.plain_english_description}
              </p>
            )}
            {wrapperDetail.why_it_matters && (
              <p className="text-xs leading-[1.45] opacity-70" style={{ color: '#8A756A' }}>
                {wrapperDetail.why_it_matters}
              </p>
            )}
          </div>
        )}

        {/* Products */}
        {products.length === 0 ? (
          <div className="rounded-[28px] bg-gradient-to-b from-white/92 to-white/78 border shadow-sm p-6 text-center" style={{
            borderColor: 'rgba(23,17,14,.08)',
          }}>
            <p className="text-sm opacity-70 mb-2" style={{ color: '#6B5B52' }}>
              {selectedWrapper ? 'No products found for this wrapper. Try another wrapper.' : 'Select a wrapper to see picks.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product, index) => {
              const category = categories.find(c => c.id === product.category_type_id);
              return (
                <article
                  key={product.id}
                  className="rounded-[28px] bg-gradient-to-b from-white/92 to-white/78 border shadow-sm overflow-hidden"
                  style={{
                    borderColor: 'rgba(23,17,14,.08)',
                    boxShadow: '0 12px 28px rgba(23,17,14,.08)',
                  }}
                >
                  {/* Product Image */}
                  <div className="h-[162px] relative bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-sm opacity-50" style={{ color: '#6B5B52' }}>No image</span>
                      </div>
                    )}
                    {category && (
                      <div className="absolute left-3 top-3 px-2.5 py-2 rounded-full bg-white/78 border backdrop-blur-sm shadow-xs inline-flex items-center gap-2" style={{
                        borderColor: 'rgba(255,255,255,.55)',
                      }}>
                        <span className="w-2 h-2 rounded-full" style={{
                          background: 'rgba(227,91,63,.60)',
                          boxShadow: '0 10px 20px rgba(227,91,63,.25)',
                        }}></span>
                        <span className="text-xs opacity-80" style={{ color: 'rgba(23,17,14,.80)' }}>
                          {category.label || category.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Body */}
                  <div className="p-3.5 space-y-2.5">
                    {product.rationale && (
                      <p className="text-sm leading-[1.5] opacity-70 m-0" style={{ color: '#6B5B52' }}>
                        {product.rationale}
                      </p>
                    )}
                    <div>
                      <strong className="block text-base font-black tracking-[-0.2px] mb-0.5">
                        {product.name}
                      </strong>
                      {product.brand && (
                        <span className="block text-xs leading-[1.45] opacity-70" style={{ color: '#8A756A' }}>
                          {product.brand}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2.5 items-center mt-1">
                      <Link
                        href={getSigninUrl(product.id)}
                        className="flex-1 min-h-[44px] rounded-[20px] border bg-white/88 shadow-xs font-black text-sm text-inherit cursor-pointer transition-all flex items-center justify-center"
                        style={{
                          borderColor: 'rgba(23,17,14,.10)',
                        }}
                      >
                        Save to shortlist
                      </Link>
                      {product.canonical_url && (
                        <a
                          href={product.canonical_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 text-sm opacity-70 py-2.5 px-2.5 rounded-2xl border-0 bg-transparent cursor-pointer"
                          style={{ color: '#6B5B52' }}
                        >
                          View
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

