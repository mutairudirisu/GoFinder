"use client";

import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout";
import { Footer } from "@repo/ui";
import type { Listing } from "@/types/listing";
import { ExploreLocationSearch } from "@/components/listings/ExploreLocationSearch";
import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/context/MessageContext";
import { useAutoHideOnScroll } from "@/hooks/useAutoHideOnScroll";
import { BottomTabNav } from "@/components/mobile/BottomTabNav";

function LocationRow({
  locationKey,
  listings,
  browseTab,
  likedIds,
  onToggleLike,
}: {
  locationKey: string;
  listings: Listing[];
  browseTab: "homes" | "experiences" | "services";
  likedIds: Set<string>;
  onToggleLike: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const cityShort = locationKey.split(",")[0]?.trim() || locationKey;
  const href =
    browseTab === "homes"
      ? `/locations/${encodeURIComponent(locationKey)}`
      : `/locations/${encodeURIComponent(locationKey)}?tab=${encodeURIComponent(browseTab)}`;
  const visibleListings = listings.slice(0, 8);
  const hasMore = listings.length > 8;
  const sectionTitle =
    browseTab === "homes"
      ? `Available in ${cityShort}`
      : browseTab === "experiences"
        ? `Experiences in ${cityShort}`
        : `Services in ${cityShort}`;
  const itemLabel = browseTab === "homes" ? "listing" : browseTab === "experiences" ? "experience" : "service";

  const syncScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    syncScrollState();
  }, [listings.length]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.max(320, Math.floor(el.clientWidth * 0.9));
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };
  //The 3 circle buttons (view-all + scroll left/right):
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="">
            <Link href={href} className="flex items-center md:justify-start md:gap-6 justify-between">
              <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 truncate">
                {/* <span className="md:hidden">{sectionTitleMobile}</span> */}
                <span className="font-display tracking-wide text-lg">{sectionTitle}</span>
              </h2>
              <span className="flex justify-center items-center w-8 h-8 rounded-full bg-white border border-slate-200 items-center justify-center shadow-sm hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 transition-colors">
                <i className="ph ph-arrow-right"></i>
              </span>
            </Link>  
          </div>
          <p className="text-sm sm:text-sm text-slate-500">
            {listings.length} verified {itemLabel}
            {listings.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            disabled={!canScrollLeft}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 transition-colors"
            aria-label="Scroll left"
          >
            <i className="ph ph-caret-left"></i>
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            disabled={!canScrollRight}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 transition-colors"
            aria-label="Scroll right"
          >
            <i className="ph ph-caret-right"></i>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={syncScrollState}
        className="flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth no-scrollbar"
      >
        {visibleListings.map((listing) => (
          <Link
            key={listing.id}
            href={`/listings/${encodeURIComponent(listing.id)}`}
            className="snap-start shrink-0 w-[280px] sm:w-[300px] group rounded-[32px] transition-all hover:shadow-sm hover:border-brand-200 block"
          >
            <motion.div whileHover={{ y: -4 }}>
              <div className="aspect-[4/3] relative overflow-hidden rounded-[32px]">
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
                    onToggleLike(String(listing.id));
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
              <div className="px-4 pt-2 bg-none">
                <div className="flex items-center justify-between gap-3 mb-1">
                  {/* <h3 className="font-bold text-slate-900 text-lg line-clamp-1 group-hover:text-brand-600 transition-colors">
                    {listing.title}
                  </h3> */}
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600 bg-brand-100 px-4 py-2 rounded-full">
                    {listing.type.replaceAll("_", " ")}
                  </span>
                </div>
                <p className="text-slate-500 text-sm line-clamp-2 pb-1">
                  {listing.address.city}, {listing.address.province}
                </p>
                <div className="flex items-center justify-between border-t pb-4 border-slate-100">
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

        {hasMore ? (
          <Link
            href={href}
            className="snap-start shrink-0 w-[220px] sm:w-[240px] md:w-[330px] bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-brand-200 transition-all flex items-center justify-center"
          >
            <div className="p-6 w-full h-full flex flex-col items-center justify-center gap-4 text-center">
              <div className="relative w-24 h-20">
                <div className="absolute left-0 top-2 w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden">
                  <img
                    src={visibleListings[0]?.photos?.[0] || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=960&auto=format&fit=crop"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute right-0 top-0 w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
                  <img
                    src={visibleListings[1]?.photos?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=960&auto=format&fit=crop"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute right-0 top-0 w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
                  <img
                    src={visibleListings[1]?.photos?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=960&auto=format&fit=crop"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="font-display font-bold text-slate-900">See all</div>
              <div className="text-xs text-slate-500">
                Browse {listings.length} listings in {locationKey}
              </div>
            </div>
          </Link>
        ) : null}
      </div>
    </section>
  );
}



function ListingsPageContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { unreadCount } = useMessages();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [browseTab, setBrowseTab] = useState<"homes" | "experiences" | "services">("homes");
  const { hidden: mobileNavHidden } = useAutoHideOnScroll({ mode: "window", enabled: !authLoading && isAuthenticated });
  const [mobileTabsCompact, setMobileTabsCompact] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileWhereOpen, setMobileWhereOpen] = useState(false);
  const [mobileWhereQuery, setMobileWhereQuery] = useState("");

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "homes" || t === "experiences" || t === "services") {
      setBrowseTab(t);
    } else {
      setBrowseTab("homes");
    }
  }, [searchParams]);

  const updateTab = (next: "homes" | "experiences" | "services") => {
    setBrowseTab(next);
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("tab", next);
    router.replace(`/?${sp.toString()}`);
  };

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/listings?status=VERIFIED", { cache: "no-store" });
      const data = (await res.json()) as { listings: Listing[] };
      setListings(Array.isArray(data.listings) ? data.listings : []);
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
    const onScroll = () => {
      setMobileTabsCompact(window.scrollY > 48);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileSearchOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileSearchOpen]);

  useEffect(() => {
    if (mobileSearchOpen) return;
    setMobileWhereOpen(false);
    setMobileWhereQuery("");
  }, [mobileSearchOpen]);

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

  const listingsForTab = useMemo(() => {
    const desiredCategory = browseTab === "homes" ? "home" : browseTab === "experiences" ? "experience" : "service";
    return listings.filter((l) => {
      const category = String(l.category ?? "").toLowerCase();
      if (!category) return desiredCategory === "home";
      return category === desiredCategory;
    });
  }, [browseTab, listings]);

  const groupedByLocation = useMemo(() => {
    return listingsForTab.reduce<Record<string, Listing[]>>((acc, listing) => {
      const key = `${listing.address.city}, ${listing.address.province}`;
      acc[key] = acc[key] ? [...acc[key], listing] : [listing];
      return acc;
    }, {});
  }, [listingsForTab]);

  const searchLocationOptions = useMemo(() => {
    const unique = new Set<string>();
    for (const listing of listings) {
      const city = listing.address?.city ?? "";
      const province = listing.address?.province ?? "";
      const key = `${city}, ${province}`.trim();
      if (key && key !== ",") unique.add(key);
    }
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [listings]);


  const emptyTitle =
    browseTab === "homes" ? "No Listings Yet" : browseTab === "experiences" ? "No experiences yet" : "No services yet";
  const emptySubtitle =
    browseTab === "homes"
      ? "There are no verified listings available for your current filters. Try changing location or type."
      : "There are no verified listings available for this category yet.";

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-gray-200">
      {/* sm:screen header */}
      <div className="fixed right-0 top-0 z-50 gap-16 w-full">
        <div className="md:hidden bg-white py-3 px-3">
            <ExploreLocationSearch browseTab={browseTab} locationOptions={searchLocationOptions} />
        </div>
        <div className="md:block shadow-md md:shadow-sm">
          <Header />
        </div>
      </div>

      {/* Hero Section for Listings */}
      <section className="hidden md:block relative mt-16 md:mt-4 pt-2 md:pt-28 pb-6 md:pb-12 overflow-visible z-10 bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px] opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-400/10 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto mt-16 md:mt-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:block text-center mb-8"
          >
            <h1 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-brand-dark mb-3">
              Find Your <span className="text-brand-500">Perfect Space</span>
            </h1>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
              Discover verified hostels, apartments, and rooms from trusted landlords across Nigeria
            </p>
          </motion.div>

          <div className="hidden md:block w-full max-w-4xl mx-auto sm:px-16">
            <ExploreLocationSearch browseTab={browseTab} locationOptions={searchLocationOptions} />
          </div>
        </div>
      </section>
      
      {/* Results Section */}
      <section className="pb-24 pt-[60px] mt-[160px] md:mt-4 md:p-16 md:pt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {Object.keys(groupedByLocation).length > 0 ? (
            <div className="space-y-6 md:space-y-8">
              {Object.entries(groupedByLocation).map(([locationKey, locationListings]) => (
                <LocationRow
                  key={locationKey}
                  locationKey={locationKey}
                  listings={locationListings}
                  browseTab={browseTab}
                  likedIds={likedIds}
                  onToggleLike={toggleLike}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i
                  className={`ph ${
                    browseTab === "homes"
                      ? "ph-house-line"
                      : browseTab === "experiences"
                        ? "ph-balloon"
                        : "ph-wrench"
                  } text-3xl text-slate-400`}
                ></i>
              </div>
              <h3 className="font-display font-bold text-xl text-brand-dark mb-2">{emptyTitle}</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">{emptySubtitle}</p>
            </motion.div>
          )}
        </div>
      </section>
      {/* Footer */}
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

export default function ListingsPage() {
  return (
    <Suspense>
      <ListingsPageContent />
    </Suspense>
  );
}
