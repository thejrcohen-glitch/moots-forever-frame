/**
 * GOOGLE MAPS FRONTEND INTEGRATION - ESSENTIAL GUIDE
 *
 * USAGE FROM PARENT COMPONENT:
 * ======
 *
 * const mapRef = useRef<google.maps.Map | null>(null);
 *
 * <MapView
 *   initialCenter={{ lat: 40.7128, lng: -74.0060 }}
 *   initialZoom={15}
 *   onMapReady={(map) => {
 *     mapRef.current = map; // Store to control map from parent anytime, google map itself is in charge of the re-rendering, not react state.
 * </MapView>
 *
 * ======
 * Available Libraries and Core Features:
 * -------------------------------
 * 📍 MARKER (from `marker` library)
 * - Attaches to map using { map, position }
 * new google.maps.marker.AdvancedMarkerElement({
 *   map,
 *   position: { lat: 37.7749, lng: -122.4194 },
 *   title: "San Francisco",
 * });
 *
 * -------------------------------
 * 🏢 PLACES (from `places` library)
 * - Does not attach directly to map; use data with your map manually.
 * const place = new google.maps.places.Place({ id: PLACE_ID });
 * await place.fetchFields({ fields: ["displayName", "location"] });
 * map.setCenter(place.location);
 * new google.maps.marker.AdvancedMarkerElement({ map, position: place.location });
 *
 * -------------------------------
 * 🧭 GEOCODER (from `geocoding` library)
 * - Standalone service; manually apply results to map.
 * const geocoder = new google.maps.Geocoder();
 * geocoder.geocode({ address: "New York" }, (results, status) => {
 *   if (status === "OK" && results[0]) {
 *     map.setCenter(results[0].geometry.location);
 *     new google.maps.marker.AdvancedMarkerElement({
 *       map,
 *       position: results[0].geometry.location,
 *     });
 *   }
 * });
 *
 * -------------------------------
 * 📐 GEOMETRY (from `geometry` library)
 * - Pure utility functions; not attached to map.
 * const dist = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
 *
 * -------------------------------
 * 🛣️ ROUTES (from `routes` library)
 * - Combines DirectionsService (standalone) + DirectionsRenderer (map-attached)
 * const directionsService = new google.maps.DirectionsService();
 * const directionsRenderer = new google.maps.DirectionsRenderer({ map });
 * directionsService.route(
 *   { origin, destination, travelMode: "DRIVING" },
 *   (res, status) => status === "OK" && directionsRenderer.setDirections(res)
 * );
 *
 * -------------------------------
 * 🌦️ MAP LAYERS (attach directly to map)
 * - new google.maps.TrafficLayer().setMap(map);
 * - new google.maps.TransitLayer().setMap(map);
 * - new google.maps.BicyclingLayer().setMap(map);
 *
 * -------------------------------
 * ✅ SUMMARY
 * - “map-attached” → AdvancedMarkerElement, DirectionsRenderer, Layers.
 * - “standalone” → Geocoder, DirectionsService, DistanceMatrixService, ElevationService.
 * - “data-only” → Place, Geometry utilities.
 */

/// <reference types="@types/google.maps" />

import { useEffect, useRef, useState, type ReactNode } from "react";
import { IS_STATIC_SITE } from "@/const";
import { appendUrlPath, normalizeOptionalEnvVar, parseAllowedHosts, parseTrustedUrl } from "@/lib/urlSafety";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: typeof google;
  }
}

const NORMALIZED_API_KEY = normalizeOptionalEnvVar(import.meta.env.VITE_FRONTEND_FORGE_API_KEY);
const FORGE_ALLOWED_HOSTS = parseAllowedHosts(import.meta.env.VITE_FRONTEND_FORGE_API_ALLOWED_HOSTS);
const FORGE_BASE_URL = parseTrustedUrl(import.meta.env.VITE_FRONTEND_FORGE_API_URL, {
  allowedHosts: FORGE_ALLOWED_HOSTS,
  allowHttpLocalhost: import.meta.env.DEV,
});
const MAPS_PROXY_URL = FORGE_BASE_URL ? appendUrlPath(FORGE_BASE_URL, "v1/maps/proxy") : null;
export const MAPS_INTERACTIVE_ENABLED =
  !IS_STATIC_SITE && NORMALIZED_API_KEY.length > 0 && Boolean(MAPS_PROXY_URL);

function loadMapScript() {
  return new Promise<boolean>(resolve => {
    if (!MAPS_INTERACTIVE_ENABLED) {
      resolve(false);
      return;
    }
    if (window.google?.maps) {
      resolve(true);
      return;
    }
    if (!MAPS_PROXY_URL) {
      resolve(false);
      return;
    }
    const script = document.createElement("script");
    const scriptUrl = appendUrlPath(MAPS_PROXY_URL, "maps/api/js");
    scriptUrl.searchParams.set("key", NORMALIZED_API_KEY);
    scriptUrl.searchParams.set("v", "weekly");
    scriptUrl.searchParams.set("libraries", "marker,places,geocoding,geometry");
    script.src = scriptUrl.toString();
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      resolve(Boolean(window.google?.maps));
      script.remove(); // Clean up immediately
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
      script.remove();
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

interface MapViewProps {
  className?: string;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  onMapReady?: (map: google.maps.Map) => void;
  fallback?: ReactNode;
}

export function MapView({
  className,
  initialCenter = { lat: 37.7749, lng: -122.4194 },
  initialZoom = 12,
  onMapReady,
  fallback,
}: MapViewProps) {
  if (!MAPS_INTERACTIVE_ENABLED) {
    return (
      <div
        className={cn(
          "w-full h-[500px] flex flex-col items-center justify-center gap-2 text-center",
          className,
        )}
      >
        {fallback ?? (
          <>
            <p className="text-sm font-medium">Map unavailable</p>
            <p className="text-xs opacity-75 max-w-md">
              {IS_STATIC_SITE
                ? "This site is running in static mode, so the interactive map is disabled."
                : "Map configuration is missing, so the interactive map is disabled."}
            </p>
          </>
        )}
      </div>
    );
  }

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const [mapLoadFailed, setMapLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setMapLoadFailed(false);
      const mapReady = await loadMapScript();
      if (cancelled) return;
      if (!mapReady || !window.google?.maps) {
        setMapLoadFailed(true);
        return;
      }
      if (!mapContainer.current) {
        console.error("Map container not found");
        setMapLoadFailed(true);
        return;
      }
      map.current = new window.google.maps.Map(mapContainer.current, {
        zoom: initialZoom,
        center: initialCenter,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
        streetViewControl: true,
        mapId: "DEMO_MAP_ID",
      });
      if (onMapReady) {
        onMapReady(map.current);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialCenter, initialZoom, onMapReady]);

  if (mapLoadFailed) {
    return (
      <div
        className={cn(
          "w-full h-[500px] flex flex-col items-center justify-center gap-2 text-center",
          className,
        )}
      >
        {fallback ?? (
          <>
            <p className="text-sm font-medium">Map unavailable</p>
            <p className="text-xs opacity-75 max-w-md">
              Failed to load the interactive map. Please try again later.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div ref={mapContainer} className={cn("w-full h-[500px]", className)} />
  );
}
