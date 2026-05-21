"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Listing } from "@/types/listing";
import { ListingResultCard } from "@/components/listings/ListingResultCard";

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
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-slate-900 tracking-tight">Favorites</h2>
            <p className="text-slate-500 mt-1">Saved places you can come back to anytime.</p>
          </div>
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors shadow-sm"
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
            {favorites.map((listing) => {
              const id = String(listing.id);
              return (
                <ListingResultCard
                  key={listing.id}
                  listing={listing}
                  variant="grid"
                  liked={likedIds.has(id)}
                  onToggleLike={() => toggleLike(id)}
                />
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
