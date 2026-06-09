"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { isRoommateFriendlyListing, isStudentFriendlyListing, type Listing } from "@/types/listing";

type Variant = "grid" | "drawer";

type Props = {
  listing: Listing;
  variant: Variant;
  isActive?: boolean;
  liked?: boolean;
  onToggleLike?: () => void;
  onMouseEnter?: () => void;
  onClick?: () => void;
};

export function ListingResultCard({ listing, variant, isActive, liked, onToggleLike, onMouseEnter, onClick }: Props) {
  const href = `/listings/${encodeURIComponent(String(listing.id))}`;
  const photo =
    listing.photos && listing.photos.length > 0
      ? listing.photos[0]
      : "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=2070&auto=format&fit=crop";
  const showStudentBadge = isStudentFriendlyListing(listing);
  const showRoommateBadge = isRoommateFriendlyListing(listing);

  if (variant === "drawer") {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`group block transition-all ${
          isActive ? "opacity-100" : ""
        }`}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="font-bold text-slate-900 text-[16px] truncate">
                {listing.title}
              </div>
              <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                <i className="ph-fill ph-star text-[11px] text-slate-900"></i>
                <span className="text-xs text-slate-900 font-bold">4.91</span>
              </div>
            </div>
            <div className="text-[14px] text-slate-500 truncate leading-tight">
              {listing.address.city}, {listing.address.province}
            </div>
            {/* Amenities Preview */}
            <div className="flex items-center gap-3 pt-1">
              {listing.amenities.slice(0, 3).map((a, i) => (
                <div key={i} className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="capitalize">{a.replaceAll("_", " ")}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`aspect-[4/3] relative overflow-hidden rounded-[24px] border-2 transition-all ${
            isActive ? "border-brand-500 shadow-xl" : "border-transparent"
          }`}>
            <img 
              src={photo} 
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=2070&auto=format&fit=crop";
              }}
            />
            
            {(showStudentBadge || showRoommateBadge) && (
              <div className="absolute bottom-3 left-3 right-3">
                <div className="bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 flex items-center justify-between gap-2 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
                      <i className="ph-fill ph-users text-[12px] text-white"></i>
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                      {showRoommateBadge ? "Needs roommate" : "Student stay"}
                    </span>
                  </div>
                  <i className="ph ph-arrow-right text-white/60 text-xs"></i>
                </div>
              </div>
            )}

            <div className="absolute top-3 left-3">
              <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm border border-slate-200/50">
                <span className="text-[11px] font-bold text-slate-900">Guest favorite</span>
              </div>
            </div>
            {onToggleLike ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleLike();
                }}
                className="absolute top-3 right-3 text-white drop-shadow-md hover:scale-110 transition-transform"
                aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
              >
                <i className={`${liked ? "ph-fill ph-heart text-brand-500" : "ph ph-heart"} text-xl`}></i>
              </button>
            ) : null}
          </div>

          <div className="pt-0.5">
            <span className="text-[15px] font-bold text-slate-900">₦{listing.price.toLocaleString()}</span>
            <span className="text-[15px] text-slate-500"> / {listing.paymentFrequency.toLowerCase()}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onMouseEnter={onMouseEnter}
      className="group block"
    >
      <motion.div whileHover={{ y: -4 }} className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-[18px] truncate tracking-tight">
              {listing.title}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
              <i className="ph-fill ph-star text-[12px] text-slate-900"></i>
              <span className="text-sm text-slate-900 font-bold">4.91</span>
            </div>
          </div>
          <p className="text-slate-500 text-[15px] leading-tight">
            {listing.address.city}, {listing.address.province}
          </p>
          {/* Amenities Preview */}
          <div className="flex items-center gap-4 pt-1.5">
            {listing.amenities.slice(0, 3).map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-[13px] text-slate-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                <span className="capitalize">{a.replaceAll("_", " ")}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`aspect-[4/3] relative overflow-hidden rounded-[28px] border-2 transition-all duration-300 ${
          isActive ? "border-brand-500 shadow-2xl scale-[1.02]" : "border-transparent"
        }`}>
          <img 
            src={photo} 
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=2070&auto=format&fit=crop";
            }}
          />

          {(showStudentBadge || showRoommateBadge) && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 flex items-center justify-between gap-2 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
                    <i className="ph-fill ph-users text-sm text-white"></i>
                  </div>
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                    {showRoommateBadge ? "Needs roommate" : "Student stay"}
                  </span>
                </div>
                <i className="ph ph-arrow-right text-white/60 text-sm"></i>
              </div>
            </div>
          )}

          <div className="absolute top-4 left-4">
            <div className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-slate-200/50">
              <span className="text-[12px] font-bold text-slate-900">Guest favorite</span>
            </div>
          </div>
          {onToggleLike ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleLike();
              }}
              className="absolute top-4 right-4 text-white drop-shadow-md hover:scale-110 transition-transform"
              aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
            >
              <i className={`${liked ? "ph-fill ph-heart text-brand-500" : "ph ph-heart"} text-2xl`}></i>
            </button>
          ) : null}
        </div>

        <div className="pt-1 flex items-baseline gap-1">
          <span className="text-slate-900 font-bold text-[18px]">₦{listing.price.toLocaleString()}</span>
          <span className="text-slate-500 text-[15px] font-medium"> / {listing.paymentFrequency.toLowerCase()}</span>
        </div>
      </motion.div>
    </Link>
  );
}

