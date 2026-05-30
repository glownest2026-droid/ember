/**
 * Privacy-safe map coordinates for marketplace markers.
 * Coordinates are snapped to a coarse (~1km) grid and then offset with
 * deterministic jitter — never exact home pins.
 */

/** Broad UK area centroids (town/sector level, not postcode-level). */
const AREA_CENTROIDS: Record<string, { lat: number; lng: number }> = {
  "sl4 area": { lat: 51.4839, lng: -0.6044 },
  "windsor area": { lat: 51.4839, lng: -0.6044 },
  "your area": { lat: 51.5074, lng: -0.1278 },
};

function normalizeAreaKey(label: string | null | undefined): string {
  return String(label ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function hashListingId(listingId: string): number {
  let hash = 0;
  for (let i = 0; i < listingId.length; i++) {
    hash = (hash * 31 + listingId.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * ~1km grid. The deterministic jitter below is reversible from the public
 * listing id, so we first reduce precision to a coarse cell. Even if the jitter
 * is undone, the recovered point only resolves to this cell — never the exact
 * full-postcode location.
 */
const COARSE_GRID_DEG = 0.01;

export function snapToCoarseGrid(value: number): number {
  return Math.round(value / COARSE_GRID_DEG) * COARSE_GRID_DEG;
}

/** ~0.4–1.2 miles offset — clearly non-exact. */
export function jitterMapMarker(
  listingId: string,
  lat: number,
  lng: number
): { lat: number; lng: number } {
  const hash = hashListingId(listingId);
  const angle = ((hash % 360) * Math.PI) / 180;
  const distance = 0.006 + (hash % 7) * 0.0015;
  const latOffset = distance * Math.cos(angle);
  const lngOffset = (distance * Math.sin(angle)) / Math.cos((lat * Math.PI) / 180);
  return {
    lat: lat + latOffset,
    lng: lng + lngOffset,
  };
}

export function areaCentroidFromLabel(
  approximateAreaLabel: string | null | undefined
): { lat: number; lng: number } | null {
  const key = normalizeAreaKey(approximateAreaLabel);
  if (!key) return null;
  if (AREA_CENTROIDS[key]) return AREA_CENTROIDS[key];
  const outward = key.match(/^([a-z]{1,2}\d[a-z\d]?)\s*area$/i);
  if (outward?.[1]) {
    const outwardKey = `${outward[1].toLowerCase()} area`;
    if (AREA_CENTROIDS[outwardKey]) return AREA_CENTROIDS[outwardKey];
  }
  return null;
}

export function resolveListingMapMarker(input: {
  id: string;
  approximate_lat?: number | null;
  approximate_lng?: number | null;
  approximate_area_label?: string | null;
}): { lat: number; lng: number } | null {
  let lat =
    input.approximate_lat != null && Number.isFinite(Number(input.approximate_lat))
      ? Number(input.approximate_lat)
      : null;
  let lng =
    input.approximate_lng != null && Number.isFinite(Number(input.approximate_lng))
      ? Number(input.approximate_lng)
      : null;

  if (lat == null || lng == null) {
    const centroid = areaCentroidFromLabel(input.approximate_area_label);
    if (!centroid) return null;
    lat = centroid.lat;
    lng = centroid.lng;
  }

  return jitterMapMarker(input.id, snapToCoarseGrid(lat), snapToCoarseGrid(lng));
}

/** GeoJSON ring for an approximate radius circle (miles). */
export function circleRingLngLat(
  lng: number,
  lat: number,
  radiusMiles: number,
  points = 64
): [number, number][] {
  const km = radiusMiles * 1.609344;
  const coords: [number, number][] = [];
  const distanceX = km / (111.32 * Math.cos((lat * Math.PI) / 180));
  const distanceY = km / 110.574;

  for (let i = 0; i <= points; i++) {
    const theta = (i / points) * 2 * Math.PI;
    coords.push([lng + distanceX * Math.cos(theta), lat + distanceY * Math.sin(theta)]);
  }
  return coords;
}

export function getMapboxToken(): string | null {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim();
  return token || null;
}
