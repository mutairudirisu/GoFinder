"use client";

import React, { useState, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl/mapbox';
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
}

export function MapComponent({ listings, activeId, onMarkerClick, likedIds, onToggleLike }: MapComponentProps) {
  const [popupInfo, setPopupInfo] = useState<Listing | null>(null);

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

  const activeListing = useMemo(() => {
    if (!activeId) return null;
    return listingsWithCoords.find(l => l.id === activeId) || null;
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
          <Marker
            key={listing.id}
            latitude={listing.address.latitude!}
            longitude={listing.address.longitude!}
            anchor="bottom"
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              onMarkerClick(listing.id);
              setPopupInfo(listing);
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
        ))}

        {popupInfo && (
          <Popup
            anchor="top"
            latitude={popupInfo.address.latitude!}
            longitude={popupInfo.address.longitude!}
            onClose={() => setPopupInfo(null)}
            closeButton={false}
            className="z-50"
            maxWidth="240px"
          >
            <div className="w-52 bg-white rounded-[24px] border border-slate-200 shadow-2xl overflow-hidden">
              <div className="aspect-[16/10] relative">
                <img
                  src={
                    popupInfo.photos[0] ||
                    "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=960&auto=format&fit=crop"
                  }
                  className="w-full h-full object-cover"
                  alt={popupInfo.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="text-white font-bold text-sm line-clamp-1">{popupInfo.title}</div>
                  <div className="text-white font-bold text-sm">₦{popupInfo.price.toLocaleString()}</div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleLike(String(popupInfo.id));
                  }}
                  className={`absolute top-3 right-3 w-9 h-9 rounded-full border border-white/50 backdrop-blur-md flex items-center justify-center transition-colors ${
                    likedIds.has(String(popupInfo.id))
                      ? "bg-white/90 text-brand-600 hover:bg-white"
                      : "bg-black/20 text-white hover:bg-white/90 hover:text-brand-700"
                  }`}
                  aria-label={likedIds.has(String(popupInfo.id)) ? "Remove from wishlist" : "Save to wishlist"}
                >
                  <i className={`${likedIds.has(String(popupInfo.id)) ? "ph-fill ph-heart" : "ph ph-heart"} text-lg`}></i>
                </button>
              </div>
              <div className="p-4">
                <div className="text-xs text-slate-500 line-clamp-1">
                  {popupInfo.address.city}, {popupInfo.address.province}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                    {popupInfo.type.replaceAll("_", " ")}
                  </div>
                  <Link
                    href={`/listings/${encodeURIComponent(String(popupInfo.id))}`}
                    className="text-sm font-bold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1"
                  >
                    View
                    <i className="ph ph-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
