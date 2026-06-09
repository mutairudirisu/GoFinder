"use client";

import React, { useState, useMemo } from 'react';
import Map, { Marker, NavigationControl, FullscreenControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Listing } from '@/types/listing';
import Link from 'next/link';

// Default center (Lagos, Nigeria)
const DEFAULT_CENTER = {
  latitude: 6.5244,
  longitude: 3.3792
};

interface MapComponentProps {
  listings: Listing[];
  activeId: string | null;
  onMarkerClick: (id: string) => void;
  likedIds: Set<string>;
  onToggleLike: (id: string) => void;
  hidePopup?: boolean;
}

export function MapComponent({ listings, activeId, onMarkerClick, likedIds, onToggleLike }: MapComponentProps) {
  // Generate mock coordinates if missing for the map display
  const listingsWithCoords = useMemo(() => {
    return listings.map(l => {
      if (l.address.latitude && l.address.longitude) return l;
      
      // Seeded random for consistent positions based on ID
      const seed = l.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const latOffset = (Math.sin(seed) * 0.05);
      const lngOffset = (Math.cos(seed) * 0.05);
      
      return {
        ...l,
        address: {
          ...l.address,
          latitude: DEFAULT_CENTER.latitude + latOffset,
          longitude: DEFAULT_CENTER.longitude + lngOffset
        }
      };
    });
  }, [listings]);

  // Update selection when activeId changes from outside
  React.useEffect(() => {
    // No-op for now as we don't have internal popup state anymore
  }, [activeId, listingsWithCoords]);

  return (
    <div className="w-full h-full relative">
      <Map
        initialViewState={{
          latitude: DEFAULT_CENTER.latitude,
          longitude: DEFAULT_CENTER.longitude,
          zoom: 11
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      >
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />

        {listingsWithCoords.map((listing) => (
          listing.address.latitude && listing.address.longitude && (
            <Marker
              key={listing.id}
              latitude={listing.address.latitude}
              longitude={listing.address.longitude}
              anchor="bottom"
              onClick={(e: any) => {
                e.originalEvent.stopPropagation();
                onMarkerClick(listing.id);
              }}
            >
              <button
                className={`px-3 py-2 rounded-full border font-bold text-xs shadow-lg transition-all z-30 ${
                  activeId === listing.id
                    ? "bg-slate-900 text-white border-slate-900 scale-105"
                    : "bg-white text-slate-900 border-slate-200 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                ₦{listing.price.toLocaleString()}
              </button>
            </Marker>
          )
        ))}
      </Map>
    </div>
  );
}
