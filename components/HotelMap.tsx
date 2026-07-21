"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export type HotelPin = {
  name: string;
  address: string;
  lat?: number | null;
  lng?: number | null;
};

export type VenuePin = {
  name: string;
  note?: string | null;
  lat?: number | null;
  lng?: number | null;
};

type Props = {
  hotels: HotelPin[];
  venue?: VenuePin | null;
  airport?: VenuePin | null;
};

const PIN_FILL = "#B5574D"; // --color-heading-rose
const VENUE_FILL = "#97973F"; // --color-heading-olive
const AIRPORT_FILL = "#856F45"; // --color-body
const PIN_TEXT = "#F6EFEA"; // --color-nav-text

function pinSvg(label: string, fill: string) {
  return `
    <svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 1C8.2 1 1 8.2 1 17c0 11.9 16 26 16 26s16-14.1 16-26C33 8.2 25.8 1 17 1z"
        fill="${fill}" stroke="${PIN_TEXT}" stroke-width="1.5"/>
      <circle cx="17" cy="16.5" r="10" fill="${PIN_TEXT}"/>
      <text x="17" y="21" text-anchor="middle" font-size="12.5" font-weight="700"
        font-family="Georgia, serif" fill="${fill}">${label}</text>
    </svg>`;
}

function hasCoords<T extends { lat?: number | null; lng?: number | null }>(
  p: T,
): p is T & { lat: number; lng: number } {
  return (
    typeof p.lat === "number" &&
    typeof p.lng === "number" &&
    !(p.lat === 0 && p.lng === 0)
  );
}

export default function HotelMap({ hotels, venue, airport }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const pins = hotels.filter(hasCoords);
  const venuePin = venue && venue.name && hasCoords(venue) ? venue : null;
  const airportPin = airport && airport.name && hasCoords(airport) ? airport : null;
  const hasAnyPin = pins.length > 0 || venuePin !== null || airportPin !== null;

  useEffect(() => {
    if (!containerRef.current || !hasAnyPin) return;

    let cancelled = false;
    let map: import("leaflet").Map | null = null;
    let resizeObserver: ResizeObserver | null = null;

    // Leaflet touches `window` at import time, so load it client-side only.
    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        attributionControl: true,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
        },
      ).addTo(map);

      const bounds = L.latLngBounds([]);

      const addPin = (
        lat: number,
        lng: number,
        label: string,
        fill: string,
        title: string,
        subtitle: string,
      ) => {
        const icon = L.divIcon({
          className: "hotel-map-pin",
          html: pinSvg(label, fill),
          iconSize: [34, 44],
          iconAnchor: [17, 44],
          popupAnchor: [0, -40],
        });

        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

        L.marker([lat, lng], { icon, title })
          .addTo(map!)
          .bindPopup(
            `<strong style="color:${fill};font-size:0.95rem;">${title}</strong>
             <br/><span style="font-size:0.8rem;">${subtitle}</span>
             <br/><a href="${mapsUrl}" target="_blank" rel="noopener noreferrer"
               style="font-size:0.8rem;text-decoration:underline;">Open in Google Maps</a>`,
          );

        bounds.extend([lat, lng]);
      };

      pins.forEach((hotel, i) => {
        addPin(hotel.lat, hotel.lng, `${i + 1}`, PIN_FILL, hotel.name, hotel.address);
      });

      if (venuePin) {
        addPin(
          venuePin.lat,
          venuePin.lng,
          "&#9829;",
          VENUE_FILL,
          venuePin.name,
          venuePin.note || "Wedding venue",
        );
      }

      if (airportPin) {
        addPin(
          airportPin.lat,
          airportPin.lng,
          "&#9992;",
          AIRPORT_FILL,
          airportPin.name,
          airportPin.note || "Airport",
        );
      }

      const fitAll = () =>
        map?.fitBounds(bounds, { padding: [56, 56], maxZoom: 15 });
      fitAll();

      // Re-frame the pins when the container width changes (rotation,
      // window resize). Width-only so mobile URL-bar height changes
      // don't snap the map back while a guest is panning.
      let lastWidth = containerRef.current.clientWidth;
      resizeObserver = new ResizeObserver(() => {
        if (!map || !containerRef.current) return;
        map.invalidateSize();
        const width = containerRef.current.clientWidth;
        if (width !== lastWidth) {
          lastWidth = width;
          fitAll();
        }
      });
      resizeObserver.observe(containerRef.current);
    });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      resizeObserver = null;
      map?.remove();
      map = null;
    };
    // pins derive from props; content is static JSON so identity churn is not a concern
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotels, venue, airport]);

  if (!hasAnyPin) return null;

  return (
    <div
      className="hotel-map overflow-hidden rounded-sm border"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div
        ref={containerRef}
        className="z-0 h-[340px] w-full sm:h-[420px]"
        aria-label="Map of recommended hotels"
        role="region"
      />
    </div>
  );
}
