"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Listing } from "@/types/listing";
import { Header } from "@/components/layout";

type RoommatePost = {
  id: string;
  listingId: string;
  createdAt: string;
  name: string;
  budget: number;
  moveIn: string;
  bio: string;
  preferences: string[];
};

type RoommateGroup = {
  id: string;
  listingId: string;
  locationKey: string;
  createdAt: string;
  createdBy: { userId: string; name: string };
  note: string;
  desiredRoommates: number;
  status: "OPEN" | "FULL" | "CLOSED";
  members: { userId: string; name: string; joinedAt: string }[];
};

const POSTS_KEY = "gigs_roommate_posts";

function readPosts(): RoommatePost[] {
  try {
    const stored = localStorage.getItem(POSTS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as RoommatePost[]) : [];
  } catch {
    return [];
  }
}

export default function RoommatesMarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [posts, setPosts] = useState<RoommatePost[]>([]);
  const [groups, setGroups] = useState<RoommateGroup[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState<string>("ALL");
  const [type, setType] = useState<string>("ALL");

  useEffect(() => {
    setPosts(readPosts());
  }, []);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/listings?status=VERIFIED", { cache: "no-store" });
      const data = (await res.json()) as { listings: Listing[] };
      setListings(Array.isArray(data.listings) ? data.listings : []);
    };
    void load();
  }, []);

  useEffect(() => {
    const loadGroups = async () => {
      setGroupsLoading(true);
      try {
        const res = await fetch("/api/roommates", { cache: "no-store" });
        const data = (await res.json()) as { groups: RoommateGroup[] };
        setGroups(Array.isArray(data.groups) ? data.groups : []);
      } finally {
        setGroupsLoading(false);
      }
    };
    void loadGroups();
  }, []);

  const listingsById = useMemo(() => {
    const map = new Map<string, Listing>();
    listings.forEach((l) => map.set(String(l.id), l));
    return map;
  }, [listings]);

  const sharedListings = useMemo(() => {
    return listings.filter((l) => l.spaceType === "shared" || String(l.type) === "shared_room" || String(l.type) === "student_accommodation" || String(l.type) === "hostel");
  }, [listings]);

  const cityOptions = useMemo(() => Array.from(new Set(sharedListings.map((l) => l.address.city))).sort(), [sharedListings]);
  const typeOptions = useMemo(() => Array.from(new Set(sharedListings.map((l) => String(l.type)))).sort(), [sharedListings]);

  const filteredListings = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sharedListings.filter((l) => {
      const matchesCity = city === "ALL" ? true : l.address.city === city;
      const matchesType = type === "ALL" ? true : String(l.type) === type;
      const hay = [l.title, l.address.building, l.address.street, l.address.district, l.address.city, l.address.province].filter(Boolean).join(" ").toLowerCase();
      const matchesQuery = q === "" ? true : hay.includes(q);
      return matchesCity && matchesType && matchesQuery;
    });
  }, [city, query, sharedListings, type]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesQuery = q === "" ? true : `${p.name} ${p.bio} ${p.preferences.join(" ")}`.toLowerCase().includes(q);
      return matchesQuery;
    });
  }, [posts, query]);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups
      .filter((g) => g.status === "OPEN")
      .filter((g) => {
        const listing = listingsById.get(String(g.listingId));
        const matchesCity = city === "ALL" ? true : (listing?.address.city ?? "") === city;
        const matchesType = type === "ALL" ? true : String(listing?.type ?? "") === type;
        const hay = [
          listing?.title,
          listing?.address?.building,
          listing?.address?.street,
          listing?.address?.district,
          listing?.address?.city,
          listing?.address?.province,
          g.createdBy?.name,
          g.note,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        const matchesQuery = q === "" ? true : hay.includes(q);
        return matchesCity && matchesType && matchesQuery;
      })
      .slice(0, 12);
  }, [city, groups, listingsById, query, type]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-gray-200">
      <Header />
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-10 space-y-8">

        <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">Find a roommate</h1>
              <p className="text-slate-500">Browse shared rooms, student accommodation, hostels, and people looking to split bills.</p>
            </div>
            <div className="w-full md:w-auto flex items-center gap-3">
              <div className="flex-1 md:w-[360px] bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-2">
                <i className="ph ph-magnifying-glass text-slate-400"></i>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search city, listing, or preferences" className="w-full bg-transparent outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-200 px-4 py-3 flex items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-2 text-slate-600">
                <i className="ph ph-map-pin"></i>
                <span className="text-xs font-bold uppercase tracking-widest">City</span>
              </div>
              <select value={city} onChange={(e) => setCity(e.target.value)} className="bg-transparent outline-none text-sm font-bold text-slate-900 cursor-pointer">
                <option value="ALL">All</option>
                {cityOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-2xl border border-slate-200 px-4 py-3 flex items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-2 text-slate-600">
                <i className="ph ph-house-line"></i>
                <span className="text-xs font-bold uppercase tracking-widest">Type</span>
              </div>
              <select value={type} onChange={(e) => setType(e.target.value)} className="bg-transparent outline-none text-sm font-bold text-slate-900 cursor-pointer">
                <option value="ALL">All</option>
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-2xl border border-slate-200 px-4 py-3 flex items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-2 text-slate-600">
                <i className="ph ph-receipt"></i>
                <span className="text-xs font-bold uppercase tracking-widest">Mode</span>
              </div>
              <span className="text-sm font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full">Roommates</span>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-slate-900">Open roommate invites</h2>
            <span className="text-xs font-bold text-slate-500">{groupsLoading ? "..." : filteredGroups.length}</span>
          </div>

          {groupsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                  <div className="aspect-[4/3] bg-slate-200 rounded-2xl animate-pulse" />
                  <div className="mt-4 h-4 w-2/3 bg-slate-200 rounded-lg animate-pulse" />
                  <div className="mt-2 h-3 w-1/2 bg-slate-200 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="bg-white rounded-[32px] border border-slate-200 p-10 text-center text-slate-500">
              No invite links yet. Create one from a listing’s roommate page.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((g) => {
                const listing = listingsById.get(String(g.listingId));
                const max = Math.max(2, (g.desiredRoommates ?? 1) + 1);
                return (
                  <Link
                    key={g.id}
                    href={`/roommates/join/${encodeURIComponent(g.id)}`}
                    className="group bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-brand-200 transition-all block"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={
                          listing?.photos?.[0] ||
                          "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=2070&auto=format&fit=crop"
                        }
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-bold text-slate-900 line-clamp-1">{listing?.title || "Roommate plan"}</div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
                          OPEN
                        </span>
                      </div>
                      <div className="text-sm text-slate-500 line-clamp-1">
                        {listing ? `${listing.address.city}, ${listing.address.province}` : g.locationKey}
                      </div>
                      {g.note ? <div className="text-sm text-slate-700 line-clamp-2">{g.note}</div> : null}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="text-xs font-bold text-slate-600">
                          {g.members?.length ?? 0}/{max} joined
                        </div>
                        <div className="text-xs font-bold text-brand-600 flex items-center gap-2">
                          <i className="ph ph-link"></i>
                          Join
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-slate-900">Shared spaces available</h2>
            <span className="text-xs font-bold text-slate-500">{filteredListings.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((l) => (
              <Link
                key={l.id}
                href={`/listings/${encodeURIComponent(String(l.id))}/roommates`}
                className="group bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-brand-200 transition-all block"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={l.photos?.[0] || "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=2070&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-6 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-bold text-slate-900 line-clamp-1">{l.title}</div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                      {String(l.type).replaceAll("_", " ")}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 line-clamp-1">
                    {l.address.city}, {l.address.province}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="text-sm font-bold text-slate-900">₦{l.price.toLocaleString()}</div>
                    <div className="text-xs font-bold text-brand-600 flex items-center gap-2">
                      <i className="ph ph-users-three"></i>
                      Match roommates
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-slate-900">People looking for roommates</h2>
            <span className="text-xs font-bold text-slate-500">{filteredPosts.length}</span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-[32px] border border-slate-200 p-10 text-center text-slate-500">
              No roommate profiles yet. Create one from any shared listing’s roommate page.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.slice(0, 12).map((p) => (
                <motion.div key={p.id} whileHover={{ y: -2 }} className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full">₦{Number(p.budget || 0).toLocaleString()}</div>
                  </div>
                  <div className="text-xs text-slate-500">Move-in: {p.moveIn || "Flexible"}</div>
                  <div className="text-sm text-slate-700 line-clamp-3">{p.bio || "No bio provided."}</div>
                  {p.preferences.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {p.preferences.slice(0, 6).map((x) => (
                        <span key={x} className="text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                          {x}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/listings/${encodeURIComponent(String(p.listingId))}/roommates`}
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
                  >
                    <i className="ph ph-house-line"></i>
                    View listing
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
