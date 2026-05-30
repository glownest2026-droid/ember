"use client";

import { LocateFixed, MapPin, Pencil } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Preferences = {
  postcode: string | null;
  lat: number | null;
  lng: number | null;
  radius_miles: number;
  approximate_area_label: string | null;
};

async function parseJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

type Props = {
  onPreferencesSaved?: () => void;
};

export function MarketplaceYourPostcode({ onPreferencesSaved }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [draftPostcode, setDraftPostcode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/marketplace/preferences");
      const payload = await parseJson<{ preferences?: Preferences | null; error?: string }>(
        response
      );
      if (!response.ok) {
        throw new Error(payload?.error ?? "Could not load your postcode.");
      }
      setPrefs(payload?.preferences ?? null);
      setDraftPostcode(payload?.preferences?.postcode ?? "");
      if (!payload?.preferences?.postcode) setEditing(true);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load your postcode.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (body: { postcode?: string; lat?: number; lng?: number }) => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/marketplace/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await parseJson<{ preferences?: Preferences; error?: string }>(response);
      if (!response.ok) {
        throw new Error(payload?.error ?? "Could not save your postcode.");
      }
      if (payload?.preferences) {
        setPrefs(payload.preferences);
        setDraftPostcode(payload.preferences.postcode ?? "");
        setEditing(false);
        onPreferencesSaved?.();
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save your postcode.");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePostcode = () => {
    void save({ postcode: draftPostcode.trim() });
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError("Your browser does not support location. Enter your postcode instead.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        void (async () => {
          try {
            await save({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          } finally {
            setLocating(false);
          }
        })();
      },
      () => {
        setLocating(false);
        setError("Location permission denied. Enter your postcode manually.");
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
    );
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3 text-sm text-[#5C646D]">
        Loading your postcode…
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <MapPin className="h-5 w-5 shrink-0 text-primary mt-0.5" aria-hidden />
          <div className="min-w-0 space-y-0.5">
            <h2 className="text-sm font-medium text-[#1A1E23]">Your postcode</h2>
            <p className="text-xs text-[#5C646D]">
              Used for nearby listings and local matching within {prefs?.radius_miles ?? 5} miles.
              Your full address is never shown.
            </p>
          </div>
        </div>
        {prefs?.postcode && !editing && (
          <button
            type="button"
            onClick={() => {
              setDraftPostcode(prefs.postcode ?? "");
              setEditing(true);
            }}
            className="inline-flex shrink-0 items-center gap-1 text-xs text-primary underline"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-2">
          <label className="sr-only" htmlFor="marketplace-postcode">
            UK postcode
          </label>
          <input
            id="marketplace-postcode"
            value={draftPostcode}
            onChange={(e) => setDraftPostcode(e.target.value)}
            placeholder="e.g. SL4 2ABC"
            autoComplete="postal-code"
            className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={saving || !draftPostcode.trim()}
              onClick={handleSavePostcode}
              className="inline-flex min-h-[40px] items-center rounded-xl bg-primary px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save postcode"}
            </button>
            <button
              type="button"
              disabled={locating || saving}
              onClick={handleUseLocation}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#1A1E23] disabled:opacity-60"
            >
              <LocateFixed className="h-4 w-4" aria-hidden />
              {locating ? "Finding postcode…" : "Use my location"}
            </button>
            {prefs?.postcode && (
              <button
                type="button"
                onClick={() => {
                  setDraftPostcode(prefs.postcode ?? "");
                  setEditing(false);
                  setError(null);
                }}
                className="inline-flex min-h-[40px] items-center px-2 text-sm text-[#5C646D] underline"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : prefs?.postcode ? (
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-[#1A1E23]">
            {prefs.approximate_area_label ?? "Your area"}
          </p>
          <p className="text-xs text-[#5C646D]">
            Within {prefs.radius_miles ?? 5} miles · Exact addresses are not shown.
          </p>
        </div>
      ) : (
        <p className="text-sm text-[#5C646D]">Add your postcode to see nearby listings.</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </section>
  );
}
