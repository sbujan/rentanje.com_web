"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

const MAPS_API_KEY = "AIzaSyCLNz1nlO6Q1Qyb_kLoxgwYVKzsDcYfB_c";
const COORDS = { lat: 45.77584998301192, lng: 15.954651579762267 };

const QUICK_BUILDER_CONFIG = {
  locations: [
    {
      title: "rentanje.com — Naserov trg 4",
      address1: "Naserov trg 4",
      address2: "10000 Zagreb, Hrvatska",
      coords: COORDS,
      placeId: "ChIJbR0j6N3VZUcR32yzwIXFO3Q",
    },
  ],
  mapOptions: {
    center: COORDS,
    fullscreenControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    zoom: 15,
    zoomControl: true,
    maxZoom: 17,
    mapId: "",
  },
  mapsApiKey: MAPS_API_KEY,
  capabilities: {
    input: false,
    autocomplete: false,
    directions: true,
    distanceMatrix: false,
    details: false,
    actions: false,
  },
};

type MapLocatorProps = {
  height?: number;
  className?: string;
};

export default function MapLocator({ height = 360, className }: MapLocatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || el.childElementCount > 0) return;

    const loader = document.createElement("gmpx-api-loader");
    loader.setAttribute("key", MAPS_API_KEY);
    loader.setAttribute("solution-channel", "GMP_QB_locatorplus_v11_c");

    const locator = document.createElement("gmpx-store-locator");
    locator.setAttribute("map-id", "DEMO_MAP_ID");
    (locator as HTMLElement).style.width = "100%";
    (locator as HTMLElement).style.height = "100%";

    el.append(loader, locator);

    customElements.whenDefined("gmpx-store-locator").then(() => {
      const locatorEl = locator as HTMLElement & {
        configureFromQuickBuilder?: (config: typeof QUICK_BUILDER_CONFIG) => void;
      };
      locatorEl.configureFromQuickBuilder?.(QUICK_BUILDER_CONFIG);
    });
  }, []);

  return (
    <>
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js"
        strategy="afterInteractive"
      />
      <div
        ref={containerRef}
        className={className ?? "rounded-xl overflow-hidden border border-gray-100"}
        style={{ height }}
      />
    </>
  );
}
