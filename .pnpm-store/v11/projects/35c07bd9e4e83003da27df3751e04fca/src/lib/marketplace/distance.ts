const EARTH_RADIUS_MILES = 3958.8;

export function haversineMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(a));
}

export function isWithinRadiusMiles(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
  radiusMiles: number
): boolean {
  return haversineMiles(a.lat, a.lng, b.lat, b.lng) <= radiusMiles;
}

export function samePostcodeOutward(
  outwardA: string | null,
  outwardB: string | null
): boolean {
  if (!outwardA || !outwardB) return false;
  return outwardA.toUpperCase() === outwardB.toUpperCase();
}
