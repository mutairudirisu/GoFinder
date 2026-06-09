"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { isRoommateFriendlyListing, type Listing } from "@/types/listing";
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

function writePosts(posts: RoommatePost[]) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function formatTimeAgo(dateString: string) {
  const ms = Date.now() - new Date(dateString).getTime();
  const minutes = Math.max(1, Math.floor(ms / 60000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateString).toLocaleDateString();
}

export default function RoommatesMarketplacePage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [posts, setPosts] = useState<RoommatePost[]>([]);
  const [groups, setGroups] = useState<RoommateGroup[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState<string>("ALL");
  const [type, setType] = useState<string>("ALL");
  const [composerText, setComposerText] = useState("");

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
    return listings.filter((l) => isRoommateFriendlyListing(l));
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

  const feedPosts = useMemo(() => {
    return [...filteredPosts]
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 8);
  }, [filteredPosts]);

  const navItems = [
    { label: "Feed", icon: "ph-newspaper", active: true },
    { label: "Discover", icon: "ph-magnifying-glass", active: false },
    { label: "Chat", icon: "ph-chat-circle-dots", active: false },
    { label: "Find Housing", icon: "ph-house-line", active: false },
    { label: "Bill Splits", icon: "ph-receipt", active: false },
    { label: "Notifications", icon: "ph-bell", active: false },
    { label: "Profile", icon: "ph-user", active: false },
  ];

  const createQuickPost = () => {
    const bio = composerText.trim();
    if (!bio) return;
    const fallbackListingId = filteredListings[0]?.id || sharedListings[0]?.id || "general";
    const nextPost: RoommatePost = {
      id: `rm_${Math.random().toString(36).slice(2, 10)}`,
      listingId: String(fallbackListingId),
      createdAt: new Date().toISOString(),
      name: user?.name || "Anonymous",
      budget: 0,
      moveIn: "Flexible",
      bio,
      preferences: [
        city !== "ALL" ? city : "Any city",
        type !== "ALL" ? String(type).replaceAll("_", " ") : "Roommate",
      ],
    };
    const next = [nextPost, ...posts];
    setPosts(next);
    writePosts(next);
    setComposerText("");
  };

  return (
    <main className="min-h-screen bg-[#F5F6E8]">
      <div className="md:hidden">
        <Header hideCenterTabs />
      </div>
      <div className="mx-auto w-full max-w-[1400px] px-4 py-4 md:px-6 md:py-8">
        <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,760px)_300px]">
          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-4 rounded-[28px] border border-brand-100/70 bg-[#EFEFD8] p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 text-white">
                  <i className="ph-fill ph-users-three text-lg"></i>
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-slate-900">Roomie</p>
                  <p className="text-xs font-semibold text-slate-500">Find housing and split bills</p>
                </div>
              </div>

              <div className="rounded-[24px] bg-white/85 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                    {getInitials(user?.name || "Roomie")}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{user?.name || "Guest user"}</p>
                    <p className="truncate text-xs text-slate-500">{user?.preferences?.location || "Set your student city"}</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-1.5">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                      item.active
                        ? "bg-white text-brand-700 shadow-sm"
                        : "text-slate-500 hover:bg-white/70 hover:text-slate-900"
                    }`}
                  >
                    <i className={`ph ${item.icon} text-lg`}></i>
                    <span>{item.label}</span>
                    {item.active ? <span className="ml-auto h-2 w-2 rounded-full bg-brand-500"></span> : null}
                  </button>
                ))}
              </nav>

              <div className="space-y-3 rounded-[24px] bg-white/70 p-4">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Filter feed</div>
                <div className="relative">
                  <i className="ph ph-magnifying-glass pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search feed..."
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10"
                  />
                </div>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-brand-400"
                >
                  <option value="ALL">Every city</option>
                  {cityOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-brand-400"
                >
                  <option value="ALL">Every housing type</option>
                  {typeOptions.map((t) => (
                    <option key={t} value={t}>{t.replaceAll("_", " ")}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          <section className="space-y-4 md:space-y-5">
            <div className="space-y-1 px-1">
              <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Feed</h1>
              <p className="text-sm font-medium text-slate-500 md:text-base">See what students and renters are looking for.</p>
            </div>

            <div className="rounded-[28px] border border-white/80 bg-white p-4 shadow-sm md:p-5">
              <div className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {getInitials(user?.name || "Roomie")}
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                  <textarea
                    value={composerText}
                    onChange={(e) => setComposerText(e.target.value.slice(0, 500))}
                    placeholder="Looking for a roommate? Tell people what you need..."
                    className="min-h-[92px] w-full resize-none rounded-2xl bg-[#F7F8EC] px-4 py-3 text-sm font-medium text-slate-800 outline-none ring-1 ring-transparent transition-all placeholder:text-slate-400 focus:ring-brand-300"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-400">{composerText.length}/500</span>
                    <button
                      onClick={createQuickPost}
                      disabled={!composerText.trim()}
                      className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                        composerText.trim()
                          ? "bg-brand-500 text-white hover:bg-brand-600"
                          : "bg-[#F0E8D0] text-slate-400"
                      }`}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {feedPosts.length === 0 ? (
              <div className="rounded-[28px] border border-white/80 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <i className="ph ph-users-three text-3xl"></i>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">No roommate posts yet</h3>
                <p className="mt-1 text-sm text-slate-500">Start the feed by posting what kind of roommate or shared home you need.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedPosts.map((p) => (
                  <motion.article
                    key={p.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[28px] border border-white/80 bg-white p-4 shadow-sm md:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                          {getInitials(p.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">{p.name}</p>
                          <p className="truncate text-xs text-slate-500">
                            {(p.preferences[0] || cityOptions[0] || "Student housing")} {p.budget > 0 ? `· Budget ₦${p.budget.toLocaleString()}` : ""}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-slate-400">{formatTimeAgo(p.createdAt)}</span>
                    </div>

                    <p className="mt-4 text-[15px] leading-7 text-slate-700">{p.bio || "Looking for a roommate in a clean and affordable space."}</p>

                    {p.preferences.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {p.preferences.slice(0, 4).map((pref) => (
                          <span key={pref} className="rounded-full bg-[#F7F8EC] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-700">
                            {pref}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-5 flex items-center gap-5 border-t border-slate-100 pt-4 text-sm text-slate-400">
                      <button className="flex items-center gap-2 transition-colors hover:text-brand-600">
                        <i className="ph ph-heart"></i>
                        <span>Like</span>
                      </button>
                      <Link
                        href={`/listings/${encodeURIComponent(String(p.listingId))}/roommates`}
                        className="flex items-center gap-2 transition-colors hover:text-brand-600"
                      >
                        <i className="ph ph-chat-circle"></i>
                        <span>Discuss</span>
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className="rounded-[28px] border border-white/80 bg-white p-4 shadow-sm md:p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-slate-900">Open invites</h2>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                  {groupsLoading ? "..." : filteredGroups.length}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {groupsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100"></div>
                    ))}
                  </div>
                ) : filteredGroups.length === 0 ? (
                  <p className="rounded-2xl bg-[#F7F8EC] p-4 text-sm text-slate-500">No open invites yet.</p>
                ) : (
                  filteredGroups.slice(0, 3).map((g) => {
                    const listing = listingsById.get(String(g.listingId));
                    return (
                      <Link
                        key={g.id}
                        href={`/roommates/join/${encodeURIComponent(g.id)}`}
                        className="block rounded-2xl border border-slate-100 p-3 transition-all hover:border-brand-200 hover:bg-brand-50/30"
                      >
                        <p className="line-clamp-1 text-sm font-bold text-slate-900">{listing?.title || "Roommate invite"}</p>
                        <p className="mt-1 text-xs text-slate-500">{listing ? `${listing.address.city}, ${listing.address.province}` : g.locationKey}</p>
                        {g.note ? <p className="mt-2 line-clamp-2 text-xs text-slate-600">{g.note}</p> : null}
                        <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-brand-700">
                          <span>{g.members.length}/{Math.max(2, (g.desiredRoommates ?? 1) + 1)} joined</span>
                          <span>Join</span>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/80 bg-white p-4 shadow-sm md:p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-slate-900">Student-ready spaces</h2>
                <span className="rounded-full bg-[#F7F8EC] px-3 py-1 text-xs font-bold text-slate-600">{filteredListings.length}</span>
              </div>
              <div className="mt-4 space-y-3">
                {filteredListings.slice(0, 3).map((l) => (
                  <Link
                    key={l.id}
                    href={`/listings/${encodeURIComponent(String(l.id))}/roommates`}
                    className="block overflow-hidden rounded-2xl border border-slate-100 transition-all hover:border-brand-200 hover:bg-brand-50/20"
                  >
                    <div className="aspect-[2/1] overflow-hidden">
                      <img
                        src={l.photos?.[0] || "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=2070&auto=format&fit=crop"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="line-clamp-1 text-sm font-bold text-slate-900">{l.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{l.address.city}, {l.address.province}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">₦{l.price.toLocaleString()}</span>
                        <span className="text-[11px] font-bold text-brand-700">View</span>
                      </div>
                    </div>
                  </Link>
                ))}
                {filteredListings.length === 0 ? (
                  <p className="rounded-2xl bg-[#F7F8EC] p-4 text-sm text-slate-500">No shared spaces match the current filters.</p>
                ) : null}
              </div>
            </div>

            <div className="rounded-[28px] border border-brand-100/70 bg-[#E9F7EF] p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Brand note</p>
              <h3 className="mt-2 font-display text-xl font-bold text-slate-900">GIGS student living</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                A cleaner roommate feed with your brand green, focused on students, shared bills, and affordable spaces.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
