"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { OpportunityMapCard } from "@/components/marketplace/OpportunityMapCard";
import {
  circleRingLngLat,
  getMapboxToken,
} from "@/lib/marketplace/marketplace-map-coordinates";

export type MarketplaceMapListing = {
  id: string;
  title: string;
  priceLabel: string | null;
  conditionLabel: string | null;
  approximateAreaLabel: string | null;
  map_marker_lat: number;
  map_marker_lng: number;
};

export type MarketplaceMapProps = {
  viewerAreaLabel: string;
  viewerLat: number | null;
  viewerLng: number | null;
  radiusMiles: number;
  listings: MarketplaceMapListing[];
  nearbyListingCount: number;
  selectedListingId: string | null;
  onSelectListing: (listingId: string | null) => void;
};

const UK_FALLBACK_CENTER: [number, number] = [-0.6, 51.48];

export function MarketplaceMap(props: MarketplaceMapProps) {
  const token = getMapboxToken();
  if (!token) {
    return <MarketplaceMapFallback {...props} />;
  }
  return <MarketplaceMapbox {...props} token={token} />;
}

function MarketplaceMapFallback({
  viewerAreaLabel,
  radiusMiles,
  nearbyListingCount,
}: MarketplaceMapProps) {
  return (
    <OpportunityMapCard
      mode="marketplace"
      title="Nearby marketplace"
      approximateAreaLabel={viewerAreaLabel}
      radiusMiles={radiusMiles}
      totalMayBeInterestedCount={0}
      nearbyListingCount={nearbyListingCount}
    />
  );
}

function MarketplaceMapbox({
  viewerAreaLabel,
  viewerLat,
  viewerLng,
  radiusMiles,
  listings,
  nearbyListingCount,
  selectedListingId,
  onSelectListing,
  token,
}: MarketplaceMapProps & { token: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("mapbox-gl").Map | null>(null);
  const markersRef = useRef<Map<string, import("mapbox-gl").Marker>>(new Map());
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  const mappableListings = useMemo(
    () =>
      listings.filter(
        (l) => Number.isFinite(l.map_marker_lat) && Number.isFinite(l.map_marker_lng)
      ),
    [listings]
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;
    let mapInstance: import("mapbox-gl").Map | null = null;

    void (async () => {
      try {
        const mapboxgl = (await import("mapbox-gl")).default;

        if (cancelled || !containerRef.current) return;

        mapboxgl.accessToken = token;

        const center: [number, number] =
          viewerLng != null && viewerLat != null
            ? [viewerLng, viewerLat]
            : mappableListings.length > 0
              ? [mappableListings[0].map_marker_lng, mappableListings[0].map_marker_lat]
              : UK_FALLBACK_CENTER;

        mapInstance = new mapboxgl.Map({
          container: containerRef.current,
          style: "mapbox://styles/mapbox/light-v11",
          center,
          zoom: 11,
          attributionControl: true,
        });

        mapRef.current = mapInstance;

        mapInstance.on("load", () => {
          if (cancelled || !mapInstance) return;

          if (viewerLng != null && viewerLat != null) {
            const ring = circleRingLngLat(viewerLng, viewerLat, radiusMiles);
            mapInstance.addSource("viewer-radius", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: { type: "Polygon", coordinates: [ring] },
              },
            });
            mapInstance.addLayer({
              id: "viewer-radius-fill",
              type: "fill",
              source: "viewer-radius",
              paint: {
                "fill-color": "#FF6B4A",
                "fill-opacity": 0.08,
              },
            });
            mapInstance.addLayer({
              id: "viewer-radius-line",
              type: "line",
              source: "viewer-radius",
              paint: {
                "line-color": "#FF6B4A",
                "line-width": 2,
                "line-opacity": 0.45,
                "line-dasharray": [2, 2],
              },
            });
          }

          setMapReady(true);
        });

        mapInstance.on("error", () => {
          if (!cancelled) setMapError(true);
        });
      } catch {
        if (!cancelled) setMapError(true);
      }
    })();

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
      mapInstance?.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [token, viewerLat, viewerLng, radiusMiles]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || mapError) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    void (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;

      for (const listing of mappableListings) {
        const el = document.createElement("button");
        el.type = "button";
        el.className =
          "flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary shadow-md transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary";
        el.setAttribute("aria-label", `${listing.title}, approximate area`);
        if (listing.id === selectedListingId) {
          el.className += " ring-2 ring-[#1A1E23] scale-110";
        }

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([listing.map_marker_lng, listing.map_marker_lat])
          .addTo(map);

        const popup = new mapboxgl.Popup({
          offset: 20,
          closeButton: true,
          maxWidth: "240px",
        }).setHTML(
          `<div class="space-y-1 p-1 text-sm">
            <p class="font-medium text-[#1A1E23]">${escapeHtml(listing.title)}</p>
            ${listing.priceLabel ? `<p class="text-[#5C646D]">${escapeHtml(listing.priceLabel)}</p>` : ""}
            <p class="text-xs text-[#5C646D]">Approximate area · exact address not shown</p>
          </div>`
        );

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onSelectListing(listing.id);
          popup.setLngLat([listing.map_marker_lng, listing.map_marker_lat]).addTo(map);
        });

        markersRef.current.set(listing.id, marker);
      }

      if (mappableListings.length > 1) {
        const bounds = new mapboxgl.LngLatBounds();
        mappableListings.forEach((l) => bounds.extend([l.map_marker_lng, l.map_marker_lat]));
        if (viewerLng != null && viewerLat != null) {
          bounds.extend([viewerLng, viewerLat]);
        }
        map.fitBounds(bounds, { padding: 48, maxZoom: 13, duration: 0 });
      }
    })();
  }, [mapReady, mapError, mappableListings, selectedListingId, onSelectListing, viewerLat, viewerLng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !selectedListingId) return;
    const listing = mappableListings.find((l) => l.id === selectedListingId);
    if (!listing) return;
    map.flyTo({
      center: [listing.map_marker_lng, listing.map_marker_lat],
      zoom: Math.max(map.getZoom(), 12),
      duration: 600,
    });
  }, [selectedListingId, mapReady, mappableListings]);

  if (mapError) {
    return (
      <MarketplaceMapFallback
        viewerAreaLabel={viewerAreaLabel}
        viewerLat={viewerLat}
        viewerLng={viewerLng}
        radiusMiles={radiusMiles}
        listings={listings}
        nearbyListingCount={nearbyListingCount}
        selectedListingId={selectedListingId}
        onSelectListing={onSelectListing}
      />
    );
  }

  return (
    <div className="space-y-2" data-testid="marketplace-mapbox-map">
      <div
        ref={containerRef}
        className="h-[min(52vh,420px)] w-full overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F8FAFC]"
        role="region"
        aria-label="Nearby listings map"
      />
      {!mapReady && (
        <p className="text-xs text-[#5C646D]" aria-live="polite">
          Loading map…
        </p>
      )}
      <p className="text-xs text-[#5C646D]">
        Markers show approximate areas only. Exact addresses are not shown.
      </p>
    </div>
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
