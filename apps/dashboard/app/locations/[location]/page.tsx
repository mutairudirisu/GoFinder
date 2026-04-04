"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/components/layout";
import { Footer } from "@repo/ui";
import type { Listing } from "@/types/listing";
import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/context/MessageContext";
import { useAutoHideOnScroll } from "@/hooks/useAutoHideOnScroll";
import { BottomTabNav } from "@/components/mobile/BottomTabNav";

function hashUnit(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  const n = Math.abs(h) % 1000;
  return n / 1000;
}

function toMarkerPosition(listing: Listing) {
  const base = String(listing.id ?? "");
  const x = 10 + hashUnit(`${base}:x`) * 80;
  const y = 12 + hashUnit(`${base}:y`) * 70;
  return { x, y };
}

export default function LocationListingsPage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = use(params);
  const locationKey = decodeURIComponent(String(location ?? "")).trim();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { unreadCount } = useMessages();

  const browseTab = useMemo(() => {
    const t = searchParams.get("tab");
    if (t === "homes" || t === "experiences" || t === "services") return t;
    return "homes";
  }, [searchParams]);

  const desiredCategory = browseTab === "homes" ? "home" : browseTab === "experiences" ? "experience" : "service";
  const itemLabel = browseTab === "homes" ? "Home" : browseTab === "experiences" ? "Experience" : "Service";
  const headerIcon = browseTab === "homes" ? "ph-house-line" : browseTab === "experiences" ? "ph-balloon" : "ph-wrench";

  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [viewportH, setViewportH] = useState(0);
  const [sheetH, setSheetH] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartYRef = useRef(0);
  const dragStartHRef = useRef(0);
  const topBarRef = useRef<HTMLDivElement | null>(null);
  const [topBarBottom, setTopBarBottom] = useState(0);
  const drawerScrollRef = useRef<HTMLDivElement | null>(null);
  const lastDrawerScrollTopRef = useRef(0);
  const [drawerScrollTop, setDrawerScrollTop] = useState(0);
  const [mapButtonDismissed, setMapButtonDismissed] = useState(false);
  const { hidden: mobileNavHidden } = useAutoHideOnScroll({
    mode: "element",
    enabled: !!user,
    elementRef: drawerScrollRef,
  });

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/listings?status=VERIFIED", { cache: "no-store" });
        const data = (await res.json()) as { listings: Listing[] };
        setAllListings(Array.isArray(data.listings) ? data.listings : []);
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

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

  const locationListings = useMemo(() => {
    const target = locationKey;
    return allListings.filter((l) => {
      const isInLocation = `${l.address.city}, ${l.address.province}` === target;
      if (!isInLocation) return false;
      const category = String(l.category ?? "").toLowerCase();
      if (!category) return desiredCategory === "home";
      return category === desiredCategory;
    });
  }, [allListings, desiredCategory, locationKey]);

  const typeOptions = useMemo(() => {
    const unique = new Set(locationListings.map((l) => l.type));
    return ["ALL", ...Array.from(unique).sort()];
  }, [locationListings]);

  useEffect(() => {
    if (selectedType !== "ALL" && !typeOptions.includes(selectedType)) setSelectedType("ALL");
  }, [selectedType, typeOptions]);

  const filteredListings = useMemo(() => {
    const byType = selectedType === "ALL" ? locationListings : locationListings.filter((l) => l.type === selectedType);
    const q = query.trim().toLowerCase();
    if (!q) return byType;
    return byType.filter((l) => {
      const hay = [
        l.title,
        l.address.building,
        l.address.street,
        l.address.district,
        l.address.city,
        l.address.province,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [locationListings, selectedType, query]);

  const activeListing = useMemo(() => {
    if (!activeId) return null;
    return filteredListings.find((l) => String(l.id) === activeId) || null;
  }, [activeId, filteredListings]);

  useEffect(() => {
    if (!activeId && filteredListings.length > 0) {
      setActiveId(String(filteredListings[0]?.id));
    }
  }, [activeId, filteredListings]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setViewportH(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const measure = () => {
      const rect = topBarRef.current?.getBoundingClientRect();
      setTopBarBottom(rect ? rect.bottom : 0);
    };
    const raf = window.requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [locationKey]);

  const topLimit = topBarBottom ? topBarBottom + 12 : 0;
  const fullH = viewportH ? Math.max(280, viewportH - topLimit) : 680;
  const peekH = viewportH ? Math.min(Math.round(viewportH * 0.42), fullH) : 320;
  const midH = viewportH ? Math.min(Math.round(viewportH * 0.6), fullH) : 520;
  const topBarElevated = (sheetH || peekH) > midH - 24;
  const collapsedH = Math.min(124, peekH);
  const sheetCurrentH = sheetH || peekH;
  const isCollapsed = sheetCurrentH <= collapsedH + 8;
  const mapButtonVisible = !isCollapsed && !mapButtonDismissed && drawerScrollTop > 80;

  useEffect(() => {
    if (!viewportH) return;
    setSheetH((prev) => (prev > 0 ? Math.min(Math.max(prev, peekH), fullH) : peekH));
  }, [fullH, peekH, viewportH]);

  useEffect(() => {
    if (!isCollapsed) setMapButtonDismissed(false);
  }, [isCollapsed]);

  const snapSheet = (next: number) => {
    let target = peekH;
    const options = [collapsedH, peekH, midH, fullH];
    for (const v of options) {
      if (Math.abs(v - next) < Math.abs(target - next)) target = v;
    }
    setSheetH(target);
  };

  const onHandlePointerDown = (e: React.PointerEvent) => {
    dragStartYRef.current = e.clientY;
    dragStartHRef.current = sheetH || peekH;
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onHandlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = dragStartYRef.current - e.clientY;
    const next = Math.min(fullH, Math.max(collapsedH, dragStartHRef.current + delta));
    setSheetH(next);
  };

  const onHandlePointerUp = () => {
    setIsDragging(false);
    snapSheet(sheetH);
  };

  useEffect(() => {
    const el = drawerScrollRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const top = el.scrollTop;
        lastDrawerScrollTopRef.current = top;
        setDrawerScrollTop(top);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-gray-200">
      <div className="hidden md:block">
        <Header
          hideCenterTabs
          centerContent={
            <div className="w-full bg-white border border-slate-200 rounded-full shadow-sm overflow-hidden flex items-center">
              <div className="flex items-center gap-2 px-4 py-3 font-bold text-slate-800 shrink-0">
                <i className={`ph ${headerIcon} text-slate-600`}></i>
                <span className="truncate max-w-[220px]">
                  {browseTab === "homes" ? "Homes" : browseTab === "experiences" ? "Experiences" : "Services"} in {locationKey}
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="flex-1 flex items-center gap-3 px-4 py-3">
                <i className="ph ph-magnifying-glass text-slate-400"></i>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search in ${locationKey}...`}
                  className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
                />
                {query.trim() !== "" ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-brand-50 hover:text-brand-700 transition-colors"
                    aria-label="Clear search"
                  >
                    <i className="ph ph-x text-sm"></i>
                  </button>
                ) : null}
              </div>
            </div>
          }
        />
      </div>

      <div className="md:hidden fixed inset-0 bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
        <div className="absolute inset-0 bg-grid-pattern bg-[length:32px_32px] opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/10 via-transparent to-brand-accent/10" />

        <div ref={topBarRef} className="absolute left-4 right-4 top-4 z-40 flex items-center gap-3">
          <Link
            href={`/${browseTab === "homes" ? "" : `?tab=${encodeURIComponent(browseTab)}`}`}
            className="w-11 h-11 rounded-full bg-white/90 backdrop-blur border border-slate-200 shadow-sm flex items-center justify-center text-slate-700"
            aria-label="Back"
          >
            <i className="ph-bold ph-caret-left text-lg"></i>
          </Link>
          <div
            className={`flex-1 bg-white/90 backdrop-blur border border-slate-200 rounded-full px-4 py-3 flex items-center justify-between gap-3 ${
              topBarElevated ? "shadow-[0_12px_30px_rgba(0,0,0,0.14)]" : "shadow-sm"
            }`}
          >
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-900 truncate">
                {browseTab === "homes" ? "Homes" : browseTab === "experiences" ? "Experiences" : "Services"} in {locationKey}
              </div>
              <div className="text-[11px] text-slate-500 truncate">{query.trim() ? query : "Tap a pin to preview"}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
              <i className="ph-bold ph-sliders-horizontal"></i>
            </div>
          </div>
        </div>

        {filteredListings.map((listing) => {
          const pos = toMarkerPosition(listing);
          const isActive = String(listing.id) === activeId;
          return (
            <div
              key={listing.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveId(String(listing.id));
                  snapSheet(midH);
                }}
                className={`px-3 py-2 rounded-full border font-bold text-xs shadow-lg transition-all ${
                  isActive
                    ? "bg-slate-900 text-white border-slate-900 scale-105"
                    : "bg-white text-slate-900 border-slate-200 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                ₦{listing.price.toLocaleString()}
              </button>
            </div>
          );
        })}

        <div
          className={`fixed left-0 right-0 bottom-0 z-50 bg-white rounded-t-[28px] border-t border-slate-200 shadow-[0_-12px_40px_rgba(0,0,0,0.12)] ${
            isDragging ? "" : "transition-[height] duration-200"
          }`}
          style={{ height: sheetH || peekH }}
        >
          <div
            className="w-full pt-3 pb-2 flex flex-col items-center gap-2 touch-none"
            onPointerDown={onHandlePointerDown}
            onPointerMove={onHandlePointerMove}
            onPointerUp={onHandlePointerUp}
            onPointerCancel={onHandlePointerUp}
          >
            <div className="w-12 h-1.5 rounded-full bg-slate-300" />
            <div className="flex items-center justify-between w-full px-4">
              <div className="font-bold text-slate-900">
                {filteredListings.length} {itemLabel.toLowerCase()}
                {filteredListings.length === 1 ? "" : "s"}
              </div>
              <button
                type="button"
                onClick={() => snapSheet(sheetH > midH ? peekH : fullH)}
                className="text-sm font-bold text-brand-700"
              >
                {sheetH > midH ? "Collapse" : "Expand"}
              </button>
            </div>
          </div>

          <div ref={drawerScrollRef} className="px-4 pb-24 h-[calc(100%-56px)] overflow-y-auto">
            {isCollapsed ? (
              <div className="h-2" />
            ) : isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-[22px] border border-slate-200 overflow-hidden shadow-sm">
                    <div className="h-32 bg-slate-200 animate-pulse" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 w-2/3 bg-slate-200 rounded-lg animate-pulse" />
                      <div className="h-3 w-1/2 bg-slate-200 rounded-lg animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="bg-white rounded-[22px] border border-slate-200 p-8 text-center">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <i className={`ph ${headerIcon} text-2xl text-slate-300`}></i>
                </div>
                <div className="text-lg font-bold text-slate-900">No results</div>
                <div className="text-sm text-slate-500 mt-1">Try changing filters.</div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredListings.map((listing) => {
                  const isActive = String(listing.id) === activeId;
                  return (
                    <Link
                      key={listing.id}
                      href={`/listings/${encodeURIComponent(String(listing.id))}`}
                      onClick={() => setActiveId(String(listing.id))}
                      className={`group bg-white rounded-[24px] border shadow-sm overflow-hidden transition-all hover:shadow-xl hover:border-brand-200 block ${
                        isActive ? "border-brand-300 shadow-xl" : "border-slate-200"
                      }`}
                    >
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img
                          src={
                            listing.photos[0] ||
                            "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=960&auto=format&fit=crop"
                          }
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-3 left-3">
                          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-lg border border-slate-100">
                            <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Verified</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleLike(String(listing.id));
                          }}
                          className={`absolute top-3 right-3 w-10 h-10 rounded-full border border-white/50 backdrop-blur-md flex items-center justify-center transition-colors ${
                            likedIds.has(String(listing.id))
                              ? "bg-white/90 text-brand-600 hover:bg-white"
                              : "bg-black/20 text-white hover:bg-white/90 hover:text-brand-700"
                          }`}
                          aria-label={likedIds.has(String(listing.id)) ? "Remove from wishlist" : "Save to wishlist"}
                        >
                          <i className={`${likedIds.has(String(listing.id)) ? "ph-fill ph-heart" : "ph ph-heart"} text-xl`}></i>
                        </button>
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-brand-600 transition-colors">
                              {listing.title}
                            </div>
                            <div className="text-xs text-slate-500 line-clamp-1">
                              {listing.address.city}, {listing.address.province}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-slate-900">₦{listing.price.toLocaleString()}</span>
                            <span className="text-[10px] text-slate-500">/ {listing.paymentFrequency.toLowerCase()}</span>
                          </div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                            {listing.type.replaceAll("_", " ")}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {mapButtonVisible ? (
          <div className={`fixed left-1/2 -translate-x-1/2 z-[55] ${mobileNavHidden ? "bottom-6" : "bottom-24"}`}>
            <button
              type="button"
              onClick={() => {
                setSheetH(collapsedH);
                setMapButtonDismissed(true);
                drawerScrollRef.current?.scrollTo({ top: 0 });
                setDrawerScrollTop(0);
              }}
              className="px-5 py-3 rounded-full bg-slate-900 text-white font-bold shadow-xl border border-white/10 flex items-center gap-2"
            >
              <i className="ph-bold ph-map-trifold text-lg"></i>
              Map
            </button>
          </div>
        ) : null}

        {user ? (
          <BottomTabNav
            zIndexClassName="z-[60]"
            hidden={mobileNavHidden}
            items={[
              { key: "explore", href: "/", label: "Explore", iconClassName: "ph-bold ph-magnifying-glass text-xl", isActive: true },
              { key: "wishlists", href: "/user/favorites", label: "Wishlists", iconClassName: "ph-bold ph-heart text-xl" },
              { key: "trips", href: "/user/bookings", label: "Trips", iconClassName: "ph-bold ph-suitcase text-xl" },
              {
                key: "messages",
                href: "/user/messages",
                label: "Messages",
                iconClassName: "ph-bold ph-chats-circle text-xl",
                badgeCount: unreadCount,
              },
              { key: "profile", href: "/user/profile", label: "Profile", iconClassName: "ph-bold ph-user text-xl" },
            ]}
          />
        ) : null}
      </div>

      <section className="hidden md:block pt-20 md:pt-22 pb-16">
        <div className=" mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:items-start">
            <div className="lg:h-[calc(100vh-9rem)] flex flex-col gap-4">
              <div className=" items-center justify-between gap-4">
                <div className="text-xl text-slate-900 font-medium font-display">
                  {filteredListings.length} {itemLabel.toLowerCase()}
                  {filteredListings.length === 1 ? "" : "s"} within map area
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {typeOptions.map((t) => {
                  const isActive = selectedType === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedType(t)}
                      className={`shrink-0 px-4 py-2 rounded-full border font-bold text-sm transition-colors ${
                        isActive
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-200 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                      }`}
                    >
                      {t === "ALL" ? "All" : t.replaceAll("_", " ")}
                    </button>
                  );
                })}
              </div>

              <div className="flex-1 overflow-y-auto pr-2">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                ) : filteredListings.length === 0 ? (
                  <div className="bg-white rounded-[32px] border border-slate-200 p-10 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className={`ph ${headerIcon} text-3xl text-slate-300`}></i>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">No listings found</h2>
                    <p className="text-sm text-slate-500 mt-2">Try changing filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredListings.map((listing) => {
                      const isActive = String(listing.id) === activeId;
                      return (
                        <Link
                          key={listing.id}
                          href={`/listings/${encodeURIComponent(String(listing.id))}`}
                          onMouseEnter={() => setActiveId(String(listing.id))}
                          className={`group bg-white rounded-[32px] border shadow-sm overflow-hidden transition-all hover:shadow-xl hover:border-brand-200 block ${
                            isActive ? "border-brand-300 shadow-xl" : "border-slate-200"
                          }`}
                        >
                          <motion.div whileHover={{ y: -4 }}>
                            <div className="aspect-[4/3] relative overflow-hidden">
                              <img
                                src={
                                  listing.photos[0] ||
                                  "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=2070&auto=format&fit=crop"
                                }
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute top-4 left-4">
                                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-lg border border-slate-100">
                                  <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                                    Verified
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleLike(String(listing.id));
                                }}
                                className={`absolute top-4 right-4 w-10 h-10 rounded-full border border-white/50 backdrop-blur-md flex items-center justify-center transition-colors ${
                                  likedIds.has(String(listing.id))
                                    ? "bg-white/90 text-brand-600 hover:bg-white"
                                    : "bg-black/20 text-white hover:bg-white/90 hover:text-brand-700"
                                }`}
                                aria-label={likedIds.has(String(listing.id)) ? "Remove from wishlist" : "Save to wishlist"}
                              >
                                <i className={`${likedIds.has(String(listing.id)) ? "ph-fill ph-heart" : "ph ph-heart"} text-xl`}></i>
                              </button>
                            </div>

                            <div className="p-6">
                              <div className="flex items-center justify-between gap-3 mb-1">
                                <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-brand-600 transition-colors">
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
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="h-[520px] lg:h-[calc(100vh-9rem)]">
              <div className="relative w-full h-full bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
                <div className="absolute inset-0 bg-grid-pattern bg-[length:32px_32px] opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/10 via-transparent to-brand-accent/10" />

                {filteredListings.map((listing) => {
                  const pos = toMarkerPosition(listing);
                  const isActive = String(listing.id) === activeId;
                  const isHovered = String(listing.id) === hoveredId;
                  const anchorLeft = pos.x > 60;
                  return (
                    <div
                      key={listing.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveId(String(listing.id))}
                        onMouseEnter={() => setHoveredId(String(listing.id))}
                        onMouseLeave={() => setHoveredId((prev) => (prev === String(listing.id) ? null : prev))}
                        onFocus={() => setHoveredId(String(listing.id))}
                        onBlur={() => setHoveredId((prev) => (prev === String(listing.id) ? null : prev))}
                        className={`px-3 py-2 rounded-full border font-bold text-xs shadow-lg transition-all ${
                          isActive
                            ? "bg-slate-900 text-white border-slate-900 scale-105"
                            : "bg-white text-slate-900 border-slate-200 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                        }`}
                        aria-label={`Select ${listing.title}`}
                      >
                        ₦{listing.price.toLocaleString()}
                      </button>

                      {isHovered ? (
                        <div
                          className={`absolute top-1/2 ${anchorLeft ? "right-full pr-3" : "left-full pl-3"} -translate-y-1/2 z-30`}
                        >
                          <div className="w-72 bg-white rounded-[24px] border border-slate-200 shadow-2xl overflow-hidden">
                            <div className="aspect-[16/10] relative">
                              <img
                                src={
                                  listing.photos[0] ||
                                  "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=960&auto=format&fit=crop"
                                }
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                <div className="text-white font-bold text-sm line-clamp-1">{listing.title}</div>
                                <div className="text-white font-bold text-sm">₦{listing.price.toLocaleString()}</div>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleLike(String(listing.id));
                                }}
                                className={`absolute top-3 right-3 w-9 h-9 rounded-full border border-white/50 backdrop-blur-md flex items-center justify-center transition-colors ${
                                  likedIds.has(String(listing.id))
                                    ? "bg-white/90 text-brand-600 hover:bg-white"
                                    : "bg-black/20 text-white hover:bg-white/90 hover:text-brand-700"
                                }`}
                                aria-label={likedIds.has(String(listing.id)) ? "Remove from wishlist" : "Save to wishlist"}
                              >
                                <i className={`${likedIds.has(String(listing.id)) ? "ph-fill ph-heart" : "ph ph-heart"} text-lg`}></i>
                              </button>
                            </div>
                            <div className="p-4">
                              <div className="text-xs text-slate-500 line-clamp-1">
                                {listing.address.city}, {listing.address.province}
                              </div>
                              <div className="mt-3 flex items-center justify-between">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                                  {listing.type.replaceAll("_", " ")}
                                </div>
                                <Link
                                  href={`/listings/${encodeURIComponent(String(listing.id))}`}
                                  className="text-sm font-bold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1"
                                >
                                  View
                                  <i className="ph ph-arrow-right"></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}

                {activeListing ? (
                  <div className="absolute left-6 right-6 bottom-6">
                    <div className="bg-white rounded-[28px] border border-slate-200 shadow-xl overflow-hidden">
                      <div className="flex gap-4 p-4">
                        <div className="w-24 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                          <img
                            src={
                              activeListing.photos[0] ||
                              "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=960&auto=format&fit=crop"
                            }
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 line-clamp-1">{activeListing.title}</div>
                              <div className="text-xs text-slate-500 line-clamp-1">
                                {activeListing.address.city}, {activeListing.address.province}
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleLike(String(activeListing.id));
                                }}
                                className={`w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center transition-colors ${
                                  likedIds.has(String(activeListing.id))
                                    ? "bg-brand-50 text-brand-700 hover:bg-brand-100"
                                    : "bg-white text-slate-700 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200"
                                }`}
                                aria-label={likedIds.has(String(activeListing.id)) ? "Remove from wishlist" : "Save to wishlist"}
                              >
                                <i className={`${likedIds.has(String(activeListing.id)) ? "ph-fill ph-heart" : "ph ph-heart"} text-xl`}></i>
                              </button>
                              <div className="text-right">
                                <div className="text-sm font-bold text-slate-900">₦{activeListing.price.toLocaleString()}</div>
                                <div className="text-[10px] text-slate-500">/ {activeListing.paymentFrequency.toLowerCase()}</div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                              {activeListing.type.replaceAll("_", " ")}
                            </div>
                            <Link
                              href={`/listings/${encodeURIComponent(String(activeListing.id))}`}
                              className="text-sm font-bold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1"
                            >
                              View
                              <i className="ph ph-arrow-right"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="hidden md:block">
        <Footer />
      </div>
    </main>
  );
}
