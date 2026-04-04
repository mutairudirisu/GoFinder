"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Listing } from "@/types/listing";

export default function FavoritesPage() {
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => {
      try {
        const raw = localStorage.getItem("gigs_liked_properties");
        const parsed = raw ? JSON.parse(raw) : [];
        const next = Array.isArray(parsed) ? parsed.map((v) => String(v)) : [];
        setLikedIds(new Set(next));
      } catch {
        setLikedIds(new Set());
      }
    };
    sync();
    window.addEventListener("likesUpdated", sync);
    return () => window.removeEventListener("likesUpdated", sync);
  }, []);

  useEffect(() => {
    let isMounted = true;
    void (async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/listings?status=VERIFIED", { cache: "no-store" });
        const data = (await res.json()) as { listings: Listing[] };
        if (!isMounted) return;
        setListings(Array.isArray(data.listings) ? data.listings : []);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const favorites = useMemo(() => {
    const set = likedIds;
    return listings.filter((l) => set.has(String(l.id)));
  }, [likedIds, listings]);

  const toggleLike = (id: string) => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("gigs_liked_properties");
      const parsed = raw ? JSON.parse(raw) : [];
      const current = Array.isArray(parsed) ? parsed.map((v) => String(v)) : [];
      const set = new Set(current);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      const next = Array.from(set);
      localStorage.setItem("gigs_liked_properties", JSON.stringify(next));
      setLikedIds(new Set(next));
      window.dispatchEvent(new Event("likesUpdated"));
    } catch {
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900">Favorites</h2>
            <p className="text-slate-500 mt-2">Saved places you can come back to anytime.</p>
          </div>
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            <i className="ph-bold ph-magnifying-glass"></i>
            Browse
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                <div className="aspect-[4/3] bg-slate-200 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-4 w-2/3 bg-slate-200 rounded-lg animate-pulse" />
                  <div className="h-3 w-1/2 bg-slate-200 rounded-lg animate-pulse" />
                  <div className="h-10 w-full bg-slate-200 rounded-2xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ph-bold ph-heart text-4xl text-slate-300"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No favorites yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8">
              As you explore, click the heart icon to save your favorite places.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
            >
              <i className="ph-bold ph-magnifying-glass"></i>
              Start browsing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${encodeURIComponent(String(listing.id))}`}
                className="group bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-xl hover:border-brand-200 block"
              >
                <motion.div whileHover={{ y: -4 }}>
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={
                        listing.photos?.[0] ||
                        "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=2070&auto=format&fit=crop"
                      }
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleLike(String(listing.id));
                      }}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 border border-white/50 backdrop-blur-md flex items-center justify-center text-brand-600 hover:bg-white transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <i className="ph-fill ph-heart text-xl"></i>
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <h3 className="font-bold text-slate-900 text-lg line-clamp-1 group-hover:text-brand-600 transition-colors">
                        {listing.title}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                        {listing.type.replaceAll("_", " ")}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                      {listing.address.street}, {listing.address.city}, {listing.address.province}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
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
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
