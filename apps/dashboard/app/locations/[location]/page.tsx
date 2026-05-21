"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@repo/ui";
import type { Listing } from "@/types/listing";
import { ListingResultCard } from "@/components/listings/ListingResultCard";
import { MapComponent } from "@/components/listings/MapComponent";
import {
  ListingsSearchHeader,
  type ListingsSearchOption,
} from "@/components/listings/ListingsSearchHeader";
import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/context/MessageContext";
import { useAutoHideOnScroll } from "@/hooks/useAutoHideOnScroll";
import { BottomTabNav } from "@/components/mobile/BottomTabNav";

export default function LocationListingsPage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = use(params);
  const locationKey = decodeURIComponent(String(location ?? "")).trim();
  const locationCity = locationKey.split(",")[0]?.trim() || locationKey;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceMin, setPriceMin] = useState<number | "">("");
  const [priceMax, setPriceMax] = useState<number | "">("");
  const [bedroomsMin, setBedroomsMin] = useState(0);
  const [bedsMin, setBedsMin] = useState(0);
  const [guestsMin, setGuestsMin] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);
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
  const headerMaxHRef = useRef(0);
  const fullBleedHRef = useRef(0);
  const peekHRef = useRef(0);
  const isDraggingRef = useRef(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { hidden: mobileNavHidden } = useAutoHideOnScroll({
    mode: "element",
    enabled: !authLoading && isAuthenticated,
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

  useEffect(() => {
    if (!filtersOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [filtersOpen]);

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

  const querySuggestions = useMemo(() => {
    const seen = new Set<string>();
    const out: { value: string; kind: "location" | "district" | "street" | "building" | "listing"; subtitle: string }[] = [];

    const add = (value: unknown, kind: "location" | "district" | "street" | "building" | "listing", subtitle: string) => {
      const v = String(value ?? "").trim();
      if (!v) return;
      const key = `${kind}:${v.toLowerCase()}`;
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ value: v, kind, subtitle });
    };

    add(locationCity, "location", "City");
    for (const l of locationListings) {
      add(l.address?.district, "district", "District");
      add(l.address?.street, "street", "Street");
      add(l.address?.building, "building", "Building");
      add(l.title, "listing", itemLabel);
    }
    return out;
  }, [itemLabel, locationCity, locationListings]);

  const visibleQuerySuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q ? querySuggestions.filter((s) => s.value.toLowerCase().includes(q)) : querySuggestions;
    return base.slice(0, 10);
  }, [query, querySuggestions]);

  const searchSuggestionOptions = useMemo<ListingsSearchOption[]>(() => {
    return visibleQuerySuggestions.map((suggestion) => {
      const iconClassName =
        suggestion.kind === "location"
          ? "ph-bold ph-map-pin"
          : suggestion.kind === "district"
            ? "ph-bold ph-compass"
            : suggestion.kind === "street"
              ? "ph-bold ph-road-horizon"
              : suggestion.kind === "building"
                ? "ph-bold ph-buildings"
                : "ph-bold ph-house-line";

      return {
        value: suggestion.value,
        label: suggestion.value,
        subtitle: suggestion.subtitle,
        iconClassName,
      };
    });
  }, [visibleQuerySuggestions]);

  const searchTypeOptions = useMemo<ListingsSearchOption[]>(() => {
    return typeOptions.map((type) => ({
      value: type,
      label: type === "ALL" ? "Any type" : type.replaceAll("_", " "),
    }));
  }, [typeOptions]);

  const selectedTypeLabel =
    selectedType === "ALL"
      ? "Any type"
      : searchTypeOptions.find((option) => option.value === selectedType)?.label ?? selectedType.replaceAll("_", " ");

  useEffect(() => {
    if (selectedType !== "ALL" && !typeOptions.includes(selectedType)) setSelectedType("ALL");
  }, [selectedType, typeOptions]);

  const filteredListings = useMemo(() => {
    const byType = selectedType === "ALL" ? locationListings : locationListings.filter((l) => l.type === selectedType);
    const q = query.trim().toLowerCase();
    const base = q
      ? byType.filter((l) => {
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
        })
      : byType;

    const min = priceMin === "" ? null : Number(priceMin);
    const max = priceMax === "" ? null : Number(priceMax);

    return base.filter((l) => {
      if (min !== null && Number.isFinite(min) && l.price < min) return false;
      if (max !== null && Number.isFinite(max) && l.price > max) return false;
      if (bedroomsMin > 0 && Number(l.basics?.bedrooms ?? 0) < bedroomsMin) return false;
      if (bedsMin > 0 && Number(l.basics?.beds ?? 0) < bedsMin) return false;
      if (guestsMin > 1 && Number(l.basics?.guests ?? 0) < guestsMin) return false;
      return true;
    });
  }, [locationListings, selectedType, query, priceMin, priceMax, bedroomsMin, bedsMin, guestsMin]);

  const activeFiltersCount =
    (selectedType !== "ALL" ? 1 : 0) +
    (priceMin !== "" ? 1 : 0) +
    (priceMax !== "" ? 1 : 0) +
    (bedroomsMin > 0 ? 1 : 0) +
    (bedsMin > 0 ? 1 : 0) +
    (guestsMin > 1 ? 1 : 0);

  const clearFilters = () => {
    setSelectedType("ALL");
    setPriceMin("");
    setPriceMax("");
    setBedroomsMin(0);
    setBedsMin(0);
    setGuestsMin(1);
  };

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

  const topLimit = topBarBottom ? topBarBottom - 40 : 0;
  const bottomNavH = 64;
  const availableH = viewportH ? Math.max(280, viewportH - bottomNavH) : 680;
  const headerMaxH = viewportH ? Math.max(280, viewportH - (topBarBottom ? topBarBottom - 12 : 0) - bottomNavH) : 680;
  const fullBleedH = viewportH ? Math.max(280, viewportH - (topBarBottom ? topBarBottom - 60 : 0) - bottomNavH) : 680;
  const peekH = viewportH ? Math.min(Math.round(availableH * 0.82), headerMaxH) : 620;
  const midH = viewportH ? Math.min(Math.round(availableH * 0.92), headerMaxH) : 750;
  const collapsedH = 24;
  const sheetCurrentH = sheetH || peekH;
  const isCollapsed = sheetCurrentH <= collapsedH + 10;

  useEffect(() => {
    headerMaxHRef.current = headerMaxH;
    fullBleedHRef.current = fullBleedH;
    peekHRef.current = peekH;
    isDraggingRef.current = isDragging;
  }, [fullBleedH, headerMaxH, isDragging, peekH]);

  useEffect(() => {
    if (!viewportH) return;
    setSheetH((prev) => (prev > 0 ? Math.min(Math.max(prev, peekH), headerMaxH) : peekH));
  }, [headerMaxH, peekH, viewportH]);

  const snapSheet = (next: number) => {
    let target = peekH;
    const options = [collapsedH, peekH, midH, headerMaxH];
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
    const next = Math.min(headerMaxH, Math.max(collapsedH, dragStartHRef.current + delta));
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
        
        // Update scrolled state for desktop header
        setIsScrolled(top > 80);

        const prevTop = lastDrawerScrollTopRef.current;
        const delta = top - prevTop;
        lastDrawerScrollTopRef.current = top;

        if (isDraggingRef.current) return;

        if (delta > 0) {
          setSheetH((prev) => {
            const base = prev > 0 ? prev : peekHRef.current;
            // Increase height more responsively while scrolling
            const next = Math.min(
              fullBleedHRef.current,
              base + Math.min(40, delta * 1.5)
            );
            return next;
          });
          return;
        }

        if (delta < 0 && top <= 6) {
          setSheetH(peekHRef.current);
        }
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
      <div ref={topBarRef} className="fixed top-0 z-50 w-full flex flex-col bg-white shadow-sm transition-all duration-300">
        <div className="hidden md:block">
          <Header
            hideCenterTabs
            centerContent={
              <AnimatePresence>
                {isScrolled && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center justify-center gap-3"
                  >
                    <Link
                      href="/"
                      className="shrink-0 w-11 h-11 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-800 hover:bg-slate-50 transition-colors"
                      aria-label="Back to dashboard"
                    >
                      <i className="ph-bold ph-arrow-left text-lg" />
                    </Link>
                    <div className="flex min-w-0 items-center gap-2 text-sm font-bold text-slate-800">
                      <i className={`ph ${headerIcon} text-slate-600`}></i>
                      <span className="truncate max-w-[280px]">
                        {browseTab === "homes" ? "Homes" : browseTab === "experiences" ? "Experiences" : "Services"} in {locationCity}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            }
          />
        </div>
        
        <motion.div
          animate={{ 
            height: isScrolled ? 0 : "auto",
            opacity: isScrolled ? 0 : 1
          }}
          style={{
            pointerEvents: isScrolled ? "none" : "auto"
          }}
          transition={{ duration: 0.2 }}
          className="hidden md:block overflow-hidden"
        >
          <ListingsSearchHeader
            className="shadow-sm"
            locationValue={query}
            locationPlaceholder={`Search in ${locationCity}...`}
            locationOptions={searchSuggestionOptions}
            locationEmptyLabel="No suggestions found"
            onLocationInputChange={setQuery}
            onLocationSelect={setQuery}
            onLocationSubmit={setQuery}
            selectedType={selectedType}
            typeOptions={searchTypeOptions}
            typePlaceholder="Property type"
            onTypeChange={setSelectedType}
            onFilterClick={() => setFiltersOpen(true)}
            onAvailabilityClick={() => setFiltersOpen(true)}
            activeFiltersCount={activeFiltersCount}
            mobileTitle={`Search ${itemLabel.toLowerCase()}s`}
            mobileSubtitle={`${locationCity} / Anytime / ${selectedType === "ALL" ? "Any type" : selectedTypeLabel}`}
          />
        </motion.div>

        <div className="md:hidden">
          <ListingsSearchHeader
            className="shadow-sm"
            locationValue={query}
            locationPlaceholder={`Search in ${locationCity}...`}
            locationOptions={searchSuggestionOptions}
            locationEmptyLabel="No suggestions found"
            onLocationInputChange={setQuery}
            onLocationSelect={setQuery}
            onLocationSubmit={setQuery}
            selectedType={selectedType}
            typeOptions={searchTypeOptions}
            typePlaceholder="Property type"
            onTypeChange={setSelectedType}
            onFilterClick={() => setFiltersOpen(true)}
            onAvailabilityClick={() => setFiltersOpen(true)}
            onBackClick={() => router.back()}
            activeFiltersCount={activeFiltersCount}
            mobileTitle={`Search ${itemLabel.toLowerCase()}s`}
            mobileSubtitle={`${locationCity} / Anytime / ${selectedType === "ALL" ? "Any type" : selectedTypeLabel}`}
          />
        </div>
      </div>

        {/* Listings Section */}
      <section className="mt-0 md:pt-12 pb-0 md:mt-56 md:pb-16">
        <div className="mx-auto px-0 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:items-start">
            {/* Card grid area */}
            <div className="hidden md:flex lg:h-[calc(100vh-9rem)] flex-col gap-4">
              <div className=" items-center justify-between gap-4">
                <div className="text-xl text-slate-900 font-medium font-display">
                  {filteredListings.length} {itemLabel.toLowerCase()}
                  {filteredListings.length === 1 ? "" : "s"} within map area
                </div>
              </div>
                {/* Filter buttons */}
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
                      const id = String(listing.id);
                      const isActive = id === activeId;
                      return (
                        <ListingResultCard
                          key={listing.id}
                          listing={listing}
                          variant="grid"
                          isActive={isActive}
                          liked={likedIds.has(id)}
                          onToggleLike={() => toggleLike(id)}
                          onMouseEnter={() => setActiveId(id)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Map area */}

            <div className="h-[100dvh] md:h-[calc(100vh-9rem)] lg:h-[calc(100vh-9rem)]">
              <div className="relative w-full h-full bg-white rounded-none border-0 overflow-hidden shadow-none md:rounded-[32px] md:border md:border-slate-200 md:shadow-sm">
                <MapComponent
                  listings={filteredListings}
                  activeId={activeId}
                  onMarkerClick={(id) => setActiveId(id)}
                  likedIds={likedIds}
                  onToggleLike={toggleLike}
                />

                {activeListing ? (
                  <div className="absolute left-6 right-6 bottom-6 hidden">
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

      {/* Mobile Drawer */}

      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
        <div
          className="w-full bg-white rounded-t-[28px] border border-slate-200 shadow-2xl overflow-hidden flex flex-col relative"
          style={{ height: sheetCurrentH }}
        >
          {/* Floating Toggle Button (Map/List) */}
          <motion.div
            initial={false}
            className="fixed bottom-24 left-1/2 z-50 pointer-events-auto"
            style={{ x: "-50%" }}
          >
            <button
              onClick={() => {
                if (isCollapsed) {
                  setSheetH(peekH);
                } else {
                  setSheetH(collapsedH);
                  if (drawerScrollRef.current) {
                    drawerScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#222222] text-white font-bold text-sm shadow-xl active:scale-95 transition-all duration-300"
            >
              <span>{isCollapsed ? "Results" : "Map"}</span>
              <i className={`ph-bold ${isCollapsed ? "ph-list-bullets" : "ph-map"} text-base`} />
            </button>
          </motion.div>

          <div
            className="px-4 pt-3 pb-2 touch-none"
            onPointerDown={onHandlePointerDown}
            onPointerMove={onHandlePointerMove}
            onPointerUp={onHandlePointerUp}
            onPointerCancel={onHandlePointerUp}
          >
            <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-300" />
          </div>

          <div ref={drawerScrollRef} className="flex-1 overflow-y-auto px-6 pb-40">
            <div className="flex items-center justify-between gap-4 py-2">
              <div className="text-sm font-bold text-slate-900 ">
                {filteredListings.length} {itemLabel.toLowerCase()}
                {filteredListings.length === 1 ? "" : "s"}
              </div>
              <button
                type="button"
                onClick={() => snapSheet(isCollapsed ? midH : collapsedH)}
                className="text-xs font-bold text-slate-700 underline underline-offset-4"
              >
                {isCollapsed ? "Expand" : "Collapse"}
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-6 no-scrollbar">
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

            {isLoading ? (
              <div className="py-12 text-center text-sm text-slate-500">Loading...</div>
            ) : filteredListings.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500">No listings found</div>
            ) : (
              <div className="grid grid-cols-1 gap-10">
                {filteredListings.map((listing) => {
                  const id = String(listing.id);
                  const isActive = id === activeId;
                  return (
                    <ListingResultCard
                      key={listing.id}
                      listing={listing}
                      variant="drawer"
                      isActive={isActive}
                      liked={likedIds.has(id)}
                      onToggleLike={() => toggleLike(id)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-[80]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center">
            <div className="w-full md:max-w-2xl bg-white rounded-t-[28px] md:rounded-[28px] border border-slate-200 shadow-2xl overflow-hidden max-h-[88dvh] md:max-h-[80vh] flex flex-col">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
                <div className="font-display font-bold text-slate-900 text-lg">Filters</div>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors"
                  aria-label="Close"
                >
                  <i className="ph ph-x text-xl" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                <div className="space-y-3">
                  <div className="font-bold text-slate-900">Type of place</div>
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
                          {t === "ALL" ? "Any type" : t.replaceAll("_", " ")}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="font-bold text-slate-900">Price range</div>
                    <div className="text-sm text-slate-500">Trip price, includes all fees</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 px-4 py-3 bg-white">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Min</div>
                      <input
                        type="number"
                        value={priceMin}
                        min={0}
                        step={5000}
                        onChange={(e) => {
                          const v = e.target.value;
                          setPriceMin(v === "" ? "" : Number(v));
                        }}
                        placeholder="0"
                        className="w-full bg-transparent outline-none font-bold text-slate-900"
                      />
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-4 py-3 bg-white">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Max</div>
                      <input
                        type="number"
                        value={priceMax}
                        min={0}
                        step={5000}
                        onChange={(e) => {
                          const v = e.target.value;
                          setPriceMax(v === "" ? "" : Number(v));
                        }}
                        placeholder="0"
                        className="w-full bg-transparent outline-none font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="font-bold text-slate-900">Rooms and guests</div>
                  {[
                    { label: "Guests", value: guestsMin, setValue: setGuestsMin, min: 1 },
                    { label: "Bedrooms", value: bedroomsMin, setValue: setBedroomsMin, min: 0 },
                    { label: "Beds", value: bedsMin, setValue: setBedsMin, min: 0 },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-4">
                      <div className="font-bold text-slate-700">{row.label}</div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => row.setValue((v: number) => Math.max(row.min, Number(v) - 1))}
                          className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center font-bold text-slate-900"
                          aria-label={`Decrease ${row.label}`}
                        >
                          -
                        </button>
                        <div className="w-10 text-center font-bold text-slate-900">{row.value}</div>
                        <button
                          type="button"
                          onClick={() => row.setValue((v: number) => Number(v) + 1)}
                          className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center font-bold text-slate-900"
                          aria-label={`Increase ${row.label}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 py-5 border-t border-slate-100 flex items-center justify-between gap-4 bg-white">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-bold text-slate-700 underline underline-offset-4"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold shadow-lg"
                >
                  Show {filteredListings.length}+
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="hidden md:block">
        <Footer />
      </div>

      {!authLoading ? (
        <BottomTabNav
          hidden={isAuthenticated ? mobileNavHidden : false}
          items={
            isAuthenticated
              ? [
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
                ]
              : [
                  { key: "explore", href: "/", label: "Explore", iconClassName: "ph-bold ph-magnifying-glass text-xl", isActive: true },
                  { key: "wishlists", href: "/user/favorites", label: "Wishlists", iconClassName: "ph-bold ph-heart text-xl" },
                  { key: "login", href: "/auth/login", label: "Log in", iconClassName: "ph-bold ph-user text-xl" },
                ]
          }
        />
      ) : null}
    </main>
  );
}
