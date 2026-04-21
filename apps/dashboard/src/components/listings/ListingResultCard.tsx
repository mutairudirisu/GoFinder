"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Listing } from "@/types/listing";

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
    listing.photos?.[0] || "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=2070&auto=format&fit=crop";

  if (variant === "drawer") {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`group rounded-[24px] overflow-hidden transition-all hover:shadow-sm hover:border-brand-200 block ${
          isActive ? "border-brand-300 shadow-xl" : "border-slate-200"
        }`}
      >
        <div className="aspect-[4/3] relative overflow-hidden rounded-[32px]">
          <img src={photo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-lg border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-brand-500"></div>
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Verified</span>
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
              className={`absolute top-3 right-3 w-10 h-10 rounded-full border border-white/50 backdrop-blur-md flex items-center justify-center transition-colors ${
                liked ? "bg-white/90 text-brand-600 hover:bg-white" : "bg-black/20 text-white hover:bg-white/90 hover:text-brand-700"
              }`}
              aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
            >
              <i className={`${liked ? "ph-fill ph-heart" : "ph ph-heart"} text-xl`}></i>
            </button>
          ) : null}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="min-w-0">
              <div className="font-bold text-slate-900 text-md line-clamp-1 group-hover:text-brand-600 transition-colors">
                {listing.title}
              </div>
              <div className="text-sm text-slate-500 line-clamp-1">
                {listing.address.city}, {listing.address.province}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-md font-bold text-slate-900">₦{listing.price.toLocaleString()}</span>
              <span className="text-[12px] text-slate-500">/ {listing.paymentFrequency.toLowerCase()}</span>
            </div>
            <div className="text-[10px] truncate font-bold uppercase tracking-widest text-brand-600 bg-brand-100 px-3 py-2 rounded-full">
              {listing.type.replaceAll("_", " ")}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onMouseEnter={onMouseEnter}
      className={`group rounded-[32px] shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-brand-200 block ${
        isActive ? "border-brand-300 shadow-xl" : "border-slate-200"
      }`}
    >
      <motion.div whileHover={{ y: -4 }}>
        <div className="aspect-[4/3] relative overflow-hidden rounded-[32px]">
          <img src={photo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-lg border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-brand-500"></div>
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Verified</span>
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
              className={`absolute top-4 right-4 w-10 h-10 rounded-full border border-white/50 backdrop-blur-md flex items-center justify-center transition-colors ${
                liked ? "bg-white/90 text-brand-600 hover:bg-white" : "bg-black/20 text-white hover:bg-white/90 hover:text-brand-700"
              }`}
              aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
            >
              <i className={`${liked ? "ph-fill ph-heart" : "ph ph-heart"} text-xl`}></i>
            </button>
          ) : null}
        </div>

        <div className="px-4 pt-2 bg-none">
          <div className="flex items-center justify-between gap-3 mb-1">
            {/* <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-brand-600 transition-colors">
              {listing.title}
            </h3> */}
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-4 py-2 rounded-full">
              {listing.type.replaceAll("_", " ")}
            </span>
          </div>
          <p className="text-slate-500 text-sm line-clamp-2 truncate pb-2">
            {listing.address.street}, {listing.address.city}, {listing.address.province}
          </p>

          <div className="flex items-center justify-between pb-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 pt-2">
              <span className="text-sm font-bold text-slate-900">₦{listing.price.toLocaleString()}</span>
              <span className="text-xs text-slate-500">/ {listing.paymentFrequency.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="flex items-center gap-1">
                <i className="ph-bold ph-bed"></i>
                <span className="text-xs font-bold">{listing.basics.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <i className="ph-bold ph-bathtub"></i>
                <span className="text-xs font-bold">{listing.basics.beds}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

