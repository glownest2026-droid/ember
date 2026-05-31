"use client";

import { useCallback, useEffect, useState } from "react";
import { STAGE1_WRAPPER_LABELS, type Stage1WrapperSlug } from "@/lib/marketplace/marketplace-taxonomy";

type IntelligencePayload = {
  marketplace_item_type_slug: string | null;
  development_area_slugs: string[];
  ai_estimated_min_age_months: number | null;
  ai_estimated_max_age_months: number | null;
  parent_confirmed_min_age_months: number | null;
  parent_confirmed_max_age_months: number | null;
  manufacturer_age_source: string | null;
  safety_flags: string[];
  recommendation_eligibility: string | null;
  coverage_state: string | null;
  parent_confirmed_intelligence_at: string | null;
};

const MANUFACTURER_AGE_OPTIONS: { label: string; months: number | null }[] = [
  { label: "Not sure", months: null },
  { label: "0+", months: 0 },
  { label: "6m+", months: 6 },
  { label: "12m+", months: 12 },
  { label: "18m+", months: 18 },
  { label: "24m+", months: 24 },
  { label: "3+", months: 36 },
  { label: "Other", months: null },
];

function stageLabel(slug: string): string | null {
  return (STAGE1_WRAPPER_LABELS as Record<string, string>)[slug as Stage1WrapperSlug] ?? null;
}

export function EmberEstimateSection({ draftId }: { draftId: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState<string | null>(null);
  const [data, setData] = useState<IntelligencePayload | null>(null);
  const [minAge, setMinAge] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");
  const [manufacturerLabel, setManufacturerLabel] = useState<string>("Not sure");

  const applyData = useCallback((payload: IntelligencePayload | null) => {
    setData(payload);
    if (payload) {
      const min = payload.parent_confirmed_min_age_months ?? payload.ai_estimated_min_age_months;
      const max = payload.parent_confirmed_max_age_months ?? payload.ai_estimated_max_age_months;
      setMinAge(min !== null && min !== undefined ? String(min) : "");
      setMaxAge(max !== null && max !== undefined ? String(max) : "");
      if (payload.manufacturer_age_source) setManufacturerLabel(payload.manufacturer_age_source);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function build() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/marketplace/listing-drafts/${draftId}/intelligence`, {
          method: "POST",
        });
        const body = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(body?.error ?? "Couldn’t load Ember’s estimate.");
        } else {
          applyData(body?.intelligence ?? null);
        }
      } catch {
        if (!cancelled) setError("Couldn’t load Ember’s estimate.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    build();
    return () => {
      cancelled = true;
    };
  }, [draftId, applyData]);

  const onSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    setSavedNote(null);
    const manufacturerMonths =
      MANUFACTURER_AGE_OPTIONS.find((o) => o.label === manufacturerLabel)?.months ?? null;
    const parsedMin = minAge.trim() === "" ? null : Number(minAge);
    const parsedMax = maxAge.trim() === "" ? null : Number(maxAge);
    try {
      const res = await fetch(`/api/marketplace/listing-drafts/${draftId}/intelligence`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          parent_confirmed_min_age_months: Number.isFinite(parsedMin as number) ? parsedMin : null,
          parent_confirmed_max_age_months: Number.isFinite(parsedMax as number) ? parsedMax : null,
          manufacturer_min_age_months: manufacturerMonths,
          manufacturer_age_source: manufacturerLabel === "Not sure" ? null : manufacturerLabel,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body?.error ?? "Couldn’t save your estimate.");
      } else {
        applyData(body?.intelligence ?? null);
        setSavedNote("Saved. Thanks — we’ll use your confirmation to improve matching.");
      }
    } catch {
      setError("Couldn’t save your estimate.");
    } finally {
      setSaving(false);
    }
  }, [draftId, minAge, maxAge, manufacturerLabel, applyData]);

  if (loading) {
    return (
      <section className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
        <p className="text-sm text-[#5C646D]">Loading Ember’s estimate…</p>
      </section>
    );
  }

  const min = data?.ai_estimated_min_age_months ?? null;
  const max = data?.ai_estimated_max_age_months ?? null;
  const hasEstimate = min !== null || max !== null;
  const devSlugs = data?.development_area_slugs ?? [];
  const uncertain = !data?.marketplace_item_type_slug || devSlugs.length === 0;

  return (
    <section
      id="ember-estimate"
      data-testid="ember-estimate-section"
      className="rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-3"
    >
      <h3 className="text-base font-medium text-[#1A1E23]">Ember’s estimate</h3>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {hasEstimate ? (
        <p className="text-sm text-[#1A1E23]">
          Estimated play stage: around {min ?? "?"}
          {max !== null ? `–${max}` : "+"} months.
        </p>
      ) : (
        <p className="text-sm text-[#5C646D]">
          Ember is still learning where this fits. We’ll use your confirmation to improve matching.
        </p>
      )}
      <p className="text-xs text-[#5C646D]">
        Please check the manufacturer’s age guidance if shown.
      </p>

      {devSlugs.length > 0 && (
        <ul className="space-y-1">
          {devSlugs.map((slug) => {
            const label = stageLabel(slug);
            if (!label) return null;
            return (
              <li key={slug} className="text-sm text-[#1A1E23]">
                May support: {label}
              </li>
            );
          })}
        </ul>
      )}

      {uncertain && (
        <p className="text-sm text-[#5C646D]">
          Ember is still learning where this fits. We’ll use your confirmation to improve matching.
        </p>
      )}

      {data?.safety_flags && data.safety_flags.length > 0 && (
        <div className="rounded-xl bg-[#FAFAFA] p-3">
          <p className="text-xs font-medium text-[#1A1E23]">Worth a quick check</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4">
            {data.safety_flags.map((flag, i) => (
              <li key={i} className="text-xs text-[#5C646D]">
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-3 border-t border-[#E5E7EB] pt-3">
        <p className="text-sm font-medium text-[#1A1E23]">Adjust the estimate (optional)</p>
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col text-xs text-[#5C646D]">
            Estimated min age (months)
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={minAge}
              onChange={(e) => setMinAge(e.target.value)}
              className="mt-1 w-28 rounded-lg border border-[#E5E7EB] px-2 py-1.5 text-sm text-[#1A1E23]"
            />
          </label>
          <label className="flex flex-col text-xs text-[#5C646D]">
            Estimated max age (months)
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={maxAge}
              onChange={(e) => setMaxAge(e.target.value)}
              className="mt-1 w-28 rounded-lg border border-[#E5E7EB] px-2 py-1.5 text-sm text-[#1A1E23]"
            />
          </label>
          <label className="flex flex-col text-xs text-[#5C646D]">
            Manufacturer age (if shown)
            <select
              value={manufacturerLabel}
              onChange={(e) => setManufacturerLabel(e.target.value)}
              className="mt-1 w-32 rounded-lg border border-[#E5E7EB] px-2 py-1.5 text-sm text-[#1A1E23]"
            >
              {MANUFACTURER_AGE_OPTIONS.map((o) => (
                <option key={o.label} value={o.label}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex min-h-[44px] items-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save estimate"}
        </button>
        {savedNote && <p className="text-sm text-emerald-700">{savedNote}</p>}
      </div>
    </section>
  );
}
