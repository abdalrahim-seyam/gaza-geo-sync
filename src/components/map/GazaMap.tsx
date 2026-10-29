'use client';

import React, { useEffect, useState } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl/maplibre';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export const GAZA_CENTER = { lng: 34.44, lat: 31.42 };
export const GAZA_ZOOM = 11;

const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
const RTL_PLUGIN_URL = 'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.js';

let rtlPluginLoaded = false;

interface GazaMapProps {
  children?: React.ReactNode;
  origin?: { lat: number; lng: number; name?: string };
  destination?: { lat: number; lng: number; name?: string };
  routeCoordinates?: [number, number][]; // [lng, lat][]
  className?: string;
  onMapClick?: (coords: { lat: number; lng: number }) => void;
}

export function GazaMap({
  children,
  origin,
  destination,
  routeCoordinates,
  className = 'w-full h-full',
  onMapClick,
}: GazaMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!rtlPluginLoaded && typeof window !== 'undefined') {
      try {
        maplibregl.setRTLTextPlugin(RTL_PLUGIN_URL, true);
        rtlPluginLoaded = true;
      } catch (err) {
        // Plugin already set
      }
    }
  }, []);

  if (!mounted) {
    return (
      <div className={`${className} bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-xs text-slate-400`}>
        جاري تحميل الخريطة...
      </div>
    );
  }

  // GeoJSON line for route polyline
  const geojsonLine = routeCoordinates && routeCoordinates.length > 1 ? {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates: routeCoordinates,
    },
  } : null;

  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden' }}>
      <Map
        initialViewState={{
          longitude: origin?.lng ?? GAZA_CENTER.lng,
          latitude: origin?.lat ?? GAZA_CENTER.lat,
          zoom: GAZA_ZOOM,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={STYLE_URL}
        attributionControl={false}
        onClick={(e) => {
          if (onMapClick) {
            onMapClick({ lat: e.lngLat.lat, lng: e.lngLat.lng });
          }
        }}
      >
        {/* Origin Marker (Green) */}
        {origin && (
          <Marker longitude={origin.lng} latitude={origin.lat} anchor="bottom">
            <div className="flex flex-col items-center">
              <div className="px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[10px] font-bold shadow-md whitespace-nowrap">
                {origin.name || 'الانطلاق'}
              </div>
              <div className="w-3 h-3 bg-emerald-600 rounded-full border-2 border-white shadow-lg mt-0.5" />
            </div>
          </Marker>
        )}

        {/* Destination Marker (Red) */}
        {destination && (
          <Marker longitude={destination.lng} latitude={destination.lat} anchor="bottom">
            <div className="flex flex-col items-center">
              <div className="px-2 py-0.5 rounded-md bg-red-700 text-white text-[10px] font-bold shadow-md whitespace-nowrap">
                {destination.name || 'الوجهة'}
              </div>
              <div className="w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-lg mt-0.5" />
            </div>
          </Marker>
        )}

        {/* Route Line Layer */}
        {geojsonLine && (
          <Source id="route-source" type="geojson" data={geojsonLine}>
            <Layer
              id="route-casing"
              type="line"
              paint={{
                'line-color': '#064E3B',
                'line-width': 7,
                'line-opacity': 0.8,
              }}
            />
            <Layer
              id="route-line"
              type="line"
              paint={{
                'line-color': '#10B981',
                'line-width': 5,
              }}
            />
          </Source>
        )}

        {children}
      </Map>
    </div>
  );
}
