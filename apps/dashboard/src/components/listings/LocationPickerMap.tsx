"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Map, { Marker, NavigationControl, FullscreenControl, Source, Layer } from 'react-map-gl/mapbox';
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
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const [mapStyle, setMapStyle] = useState<"streets" | "satellite">("streets");
  
  const [viewState, setViewState] = useState({
    latitude: latitude || DEFAULT_CENTER.latitude,
    longitude: longitude || DEFAULT_CENTER.longitude,
    zoom: 15,
    pitch: 45,
    bearing: 0
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

  if (!token) {
    return (
      <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 rounded-[32px]">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
          <i className="ph-bold ph-warning-circle text-rose-500 text-2xl"></i>
        </div>
        <h3 className="text-slate-900 font-bold text-lg mb-2">Mapbox Token Missing</h3>
        <p className="text-slate-500 max-w-xs">Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env file to see the map.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onClick={handleMapClick}
        style={{ width: '100%', height: '100%' }}
        mapStyle={
          mapStyle === "satellite" 
            ? "mapbox://styles/mapbox/satellite-streets-v12" 
            : showSpecificLocation 
              ? "mapbox://styles/mapbox/streets-v12" 
              : "mapbox://styles/mapbox/light-v11"
        }
        mapboxAccessToken={token}
        interactive={interactive}
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
        antialias={true}
      >
        <Source
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          maxzoom={14}
        />
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
              <div className="relative flex flex-col items-center group/marker cursor-grab active:cursor-grabbing">
                {/* Custom Premium Marker */}
                <div className="w-12 h-12 bg-slate-900 rounded-full border-4 border-white shadow-[0_8px_30px_rgb(0,0,0,0.3)] flex items-center justify-center transition-all group-hover/marker:scale-110 group-hover/marker:bg-brand-500">
                  <i className="ph-fill ph-map-pin text-white text-xl"></i>
                </div>
                {/* Pointer Tip */}
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white -mt-1 shadow-sm"></div>
                
                {/* Pulsing Aura */}
                <div className="absolute -inset-4 bg-slate-900/10 rounded-full -z-10 animate-ping opacity-20"></div>
              </div>
            ) : (
              <div className="relative flex items-center justify-center">
                <div className="w-32 h-32 bg-brand-500/10 rounded-full border-2 border-brand-500/20 animate-pulse" />
                <div className="absolute w-8 h-8 bg-slate-900 rounded-full border-4 border-white shadow-2xl" />
              </div>
            )}
          </Marker>
        )}
      </Map>
      
      {/* Map Hint */}
      <div className="absolute bottom-6 right-20 pointer-events-none transition-opacity opacity-0 group-hover:opacity-100">
        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2">
          <i className="ph-bold ph-hand-grabbing text-slate-400"></i>
          <span className="text-xs font-bold text-slate-600">Drag to adjust position</span>
        </div>
      </div>

      {/* Style Switcher */}
      <div className="absolute top-6 right-20 flex items-center bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white p-1 z-10">
        <button
          onClick={() => setMapStyle("streets")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mapStyle === "streets" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:text-slate-900"}`}
        >
          Streets
        </button>
        <button
          onClick={() => setMapStyle("satellite")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mapStyle === "satellite" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:text-slate-900"}`}
        >
          Satellite
        </button>
      </div>
    </div>
  );
}
