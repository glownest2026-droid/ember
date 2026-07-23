'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import { Card, CardBody } from '../ui/Card';
import { createClient } from '../../utils/supabase/client';

type Moment = {
  id: string;
  label: string;
  description?: string;
};

type CardData = {
  id: string;
  lane: string;
  rank: number;
  because: string;
  category_type_id?: string;
  product_id?: string;
  pl_category_types?: { id: string; name: string; label: string } | { id: string; name: string; label: string }[] | null;
  products?: { id: string; name: string } | { id: string; name: string }[] | null;
};

type SetData = {
  id: string;
  moment_id: string;
  headline?: string;
  pl_reco_cards: CardData[];
};

interface DiscoveryPageProps {
  ageBand: { id: string; label: string; min_months: number; max_months: number } | null;
  moments: Moment[];
  setsByMoment: Record<string, SetData[]>;
  currentAge: number;
  minAge?: number;
  maxAge?: number;
  isCanonical?: boolean;
  canonicalSlug?: string;
}

export default function DiscoveryPage({
  ageBand,
  moments,
  setsByMoment,
  currentAge,
  minAge = 12,
  maxAge = 48,
  isCanonical = false,
  canonicalSlug,
}: DiscoveryPageProps) {
  const router = useRouter();
  const [selectedAge, setSelectedAge] = useState(currentAge);
  const [selectedMomentId, setSelectedMomentId] = useState<string | null>(
    moments.length > 0 ? moments[0].id : null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Update selectedMomentId if moments change
  useEffect(() => {
    if (moments.length > 0 && (!selectedMomentId || !moments.find(m => m.id === selectedMomentId))) {
      setSelectedMomentId(moments[0].id);
    }
  }, [moments, selectedMomentId]);

  const handleAgeChange = (age: number) => {
    setSelectedAge(age);
    // If this is the canonical route, navigate to /play?age=...
    // Otherwise, update the URL query param
    if (isCanonical) {
      router.push(`/play?age=${age}`);
    } else {
      const url = new URL(window.location.href);
      url.searchParams.set('age', age.toString());
      router.replace(url.pathname + url.search);
    }
  };

  const handleSaveShortlist = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Not logged in - redirect to signin with next parameter
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/signin?next=${encodeURIComponent(currentPath)}`;
        return;
      }

      // Logged in - show stub message (saving shortlists coming soon)
      setSaveMessage('Saving shortlists is coming soon');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error checking auth:', error);
      setSaveMessage('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Get current set for selected moment
  const currentSet = selectedMomentId ? setsByMoment[selectedMomentId]?.[0] : undefined;
  const currentCards = currentSet?.pl_reco_cards || [];

  // Sort cards by rank (should be exactly 3)
  const sortedCards = [...currentCards].sort((a, b) => a.rank - b.rank);

  if (!ageBand) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">We're preparing this stage</h2>
          <p className="text-sm opacity-80">Content for this age range is coming soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Age Slider */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Age: {selectedAge} months
        </label>
        <input
          type="range"
          min={minAge}
          max={maxAge}
          value={selectedAge}
          onChange={(e) => handleAgeChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs opacity-60">
          <span>{minAge} months</span>
          <span>{maxAge} months</span>
        </div>
      </div>

      {/* Moment Selector */}
      {moments.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {moments.map((moment) => {
            const isActive = moment.id === selectedMomentId;
            const hasSets = setsByMoment[moment.id] && setsByMoment[moment.id].length > 0;
            
            return (
              <button
                key={moment.id}
                onClick={() => setSelectedMomentId(moment.id)}
                disabled={!hasSets}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                  ${isActive
                    ? 'bg-[var(--brand-primary)] text-[var(--brand-primary-foreground)]'
                    : 'bg-[var(--brand-surface)] text-[var(--brand-text)] border border-[var(--brand-border)]'
                  }
                  ${!hasSets ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
                `}
              >
                {moment.label}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">We're preparing this stage</h2>
          <p className="text-sm opacity-80">Content for this age range is coming soon.</p>
        </div>
      )}

      {/* Cards */}
      {sortedCards.length > 0 ? (
        <div className="space-y-4">
          {sortedCards.map((card) => {
            // Handle both object and array cases for foreign key relationships
            const product = Array.isArray(card.products) ? card.products[0] : card.products;
            const categoryType = Array.isArray(card.pl_category_types) ? card.pl_category_types[0] : card.pl_category_types;
            const displayName = product?.name || categoryType?.name || categoryType?.label || 'Item';
            
            return (
              <Card key={card.id}>
                <CardBody>
                  <h3 className="font-semibold mb-2">{displayName}</h3>
                  <p className="text-sm opacity-80">
                    <strong>Because:</strong> {card.because}
                  </p>
                  {card.lane && (
                    <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-[var(--brand-bg)] opacity-60">
                      {card.lane}
                    </span>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      ) : selectedMomentId && moments.find(m => m.id === selectedMomentId) ? (
        <div className="text-center py-12">
          <p className="text-sm opacity-80">No recommendations available for this moment yet.</p>
        </div>
      ) : null}

      {/* Save Shortlist Button */}
      {sortedCards.length > 0 && (
        <div className="flex flex-col items-center gap-2 pt-4">
          <Button
            onClick={handleSaveShortlist}
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? 'Saving...' : 'Save shortlist'}
          </Button>
          {saveMessage && (
            <p className="text-sm opacity-80">{saveMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}

