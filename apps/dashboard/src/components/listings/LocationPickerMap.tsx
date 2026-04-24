"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Map, { Marker, NavigationControl, FullscreenControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

// Default center (Lagos, Nigeria)
const DEFAULT_CENTER = {
  latitude: 6.5244,
  longitude: 3.3792
};

interface LocationPickerMapProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
  interactive?: boolean;
  showSpecificLocation?: boolean;
}

export function LocationPickerMap({ 
  latitude, 
  longitude, 
  onLocationChange, 
  interactive = true,
  showSpecificLocation = true
}: LocationPickerMapProps) {
  const [viewState, setViewState] = useState({
    latitude: latitude || DEFAULT_CENTER.latitude,
    longitude: longitude || DEFAULT_CENTER.longitude,
    zoom: 13
  });

  // Update viewState when latitude/longitude props change (e.g., from parent state)
  useEffect(() => {
    if (latitude && longitude) {
      setViewState(prev => ({
        ...prev,
        latitude,
        longitude
      }));
    }
  }, [latitude, longitude]);

  const handleMapClick = useCallback((e: any) => {
    if (!interactive) return;
    const { lng, lat } = e.lngLat;
    onLocationChange(lat, lng);
  }, [interactive, onLocationChange]);

  const handleMarkerDragEnd = useCallback((e: any) => {
    const { lng, lat } = e.lngLat;
    onLocationChange(lat, lng);
  }, [onLocationChange]);

  return (
    <div className="w-full h-full relative">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onClick={handleMapClick}
        style={{ width: '100%', height: '100%' }}
        mapStyle={showSpecificLocation ? "mapbox://styles/mapbox/streets-v12" : "mapbox://styles/mapbox/light-v11"}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        interactive={interactive}
      >
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />

        {(latitude || DEFAULT_CENTER.latitude) && (longitude || DEFAULT_CENTER.longitude) && (
          <Marker
            latitude={latitude || DEFAULT_CENTER.latitude}
            longitude={longitude || DEFAULT_CENTER.longitude}
            anchor="bottom"
            draggable={interactive}
            onDragEnd={handleMarkerDragEnd}
          >
            {showSpecificLocation ? (
              <div className="w-10 h-10 bg-brand-500 rounded-full border-4 border-white shadow-2xl flex items-center justify-center transition-transform hover:scale-110">
                <i className="ph-bold ph-map-pin text-white text-base"></i>
              </div>
            ) : (
              <div className="relative flex items-center justify-center">
                <div className="w-24 h-24 bg-brand-500/10 rounded-full border-2 border-brand-500/20 animate-pulse" />
                <div className="absolute w-6 h-6 bg-slate-900 rounded-full border-4 border-white shadow-lg" />
              </div>
            )}
          </Marker>
        )}
      </Map>
    </div>
  );
}
