import "server-only";

import { normalizeUkPostcode } from "./postcode";

export type GeocodedPostcode = {
  postcode: string;
  lat: number;
  lng: number;
};

async function parsePostcodesIo<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { status?: number; result?: T };
    if (payload.status !== 200 || payload.result == null) return null;
    return payload.result;
  } catch {
    return null;
  }
}

/** Forward geocode a full UK postcode via postcodes.io. */
export async function geocodeUkPostcode(
  postcode: string
): Promise<GeocodedPostcode | null> {
  const normalized = normalizeUkPostcode(postcode);
  if (!normalized) return null;
  const encoded = encodeURIComponent(normalized.replace(/\s+/g, ""));
  const result = await parsePostcodesIo<{
    postcode: string;
    latitude: number;
    longitude: number;
  }>(`https://api.postcodes.io/postcodes/${encoded}`);

  if (!result?.postcode || result.latitude == null || result.longitude == null) {
    return null;
  }

  return {
    postcode: normalizeUkPostcode(result.postcode) ?? normalized,
    lat: Number(result.latitude),
    lng: Number(result.longitude),
  };
}

/** Nearest UK postcode for lat/lng (browser geolocation). */
export async function reverseGeocodeUkLatLng(
  lat: number,
  lng: number
): Promise<GeocodedPostcode | null> {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const result = await parsePostcodesIo<
    Array<{ postcode: string; latitude: number; longitude: number }>
  >(`https://api.postcodes.io/postcodes?lon=${lng}&lat=${lat}&limit=1`);

  const nearest = result?.[0];
  if (!nearest?.postcode) return null;

  const normalized = normalizeUkPostcode(nearest.postcode);
  if (!normalized) return null;

  return {
    postcode: normalized,
    lat: Number(nearest.latitude),
    lng: Number(nearest.longitude),
  };
}
