"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { isRoommateFriendlyListing, isStudentFriendlyListing, type Listing } from "@/types/listing";
import { useAuth } from "@/context/AuthContext";

export default function ListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [reserved, setReserved] = useState(false);
  const [paymentItem, setPaymentItem] = useState<"RENT" | "DEPOSIT" | "OTHER" | "TOTAL">("TOTAL");
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "TRANSFER">("CARD");
  const [paymentDone, setPaymentDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !listing?.id) return;
    const sync = () => {
      const savedLikes = localStorage.getItem("gigs_liked_properties");
      if (savedLikes) {
        const likedIds = JSON.parse(savedLikes);
        setIsLiked(likedIds.includes(String(listing.id)));
      }
    };
    sync();
    window.addEventListener("likesUpdated", sync);
    return () => window.removeEventListener("likesUpdated", sync);
  }, [listing?.id]);

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!listing?.id) return;

    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    if (typeof window !== "undefined") {
      const savedLikes = localStorage.getItem("gigs_liked_properties");
      let likedIds: string[] = savedLikes ? JSON.parse(savedLikes) : [];

      if (newLikedState) {
        if (!likedIds.includes(String(listing.id))) {
          likedIds.push(String(listing.id));
        }
      } else {
        likedIds = likedIds.filter((id) => id !== String(listing.id));
      }

      localStorage.setItem("gigs_liked_properties", JSON.stringify(likedIds));
      window.dispatchEvent(new Event("likesUpdated"));
    }
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const normalizedId = decodeURIComponent(String(id ?? "")).trim();
        if (!normalizedId) {
          setListing(null);
          return;
        }
        const res = await fetch(`/api/listings/${encodeURIComponent(normalizedId)}`, { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as { listing: Listing };
          setListing(data.listing ?? null);
          setActiveImage(0);
          return;
        }

        if (res.status !== 404) {
          setLoadError("We couldn't load this listing right now. Please try again.");
          return;
        }

        const fallbackVerified = await fetch("/api/listings?status=VERIFIED", { cache: "no-store" });
        if (fallbackVerified.ok) {
          const verified = (await fallbackVerified.json()) as { listings: Listing[] };
          const foundVerified = (Array.isArray(verified.listings) ? verified.listings : []).find(
            (l) => decodeURIComponent(String(l.id)).trim() === normalizedId
          );
          if (foundVerified) {
            setListing(foundVerified);
            setActiveImage(0);
            return;
          }
        }

        const fallback = await fetch("/api/listings", { cache: "no-store" });
        if (!fallback.ok) {
          setListing(null);
          return;
        }
        const all = (await fallback.json()) as { listings: Listing[] };
        const found = (Array.isArray(all.listings) ? all.listings : []).find(
          (l) => decodeURIComponent(String(l.id)).trim() === normalizedId
        );
        setListing(found ?? null);
        if (found) setActiveImage(0);
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [id]);

  const meta = useMemo(() => {
    if (!listing) return null;
    const type = String(listing.type).toLowerCase();
    const isStudent = isStudentFriendlyListing(listing);
    const isShared =
      listing.spaceType === "shared" ||
      listing.spaceType === "shared_student" ||
      listing.spaceType === "shared_hotel_guesthouse" ||
      type === "shared_room" ||
      Boolean(listing.studentHousing?.needsRoommate);
    const isHostel = type === "hostel";
    const isHotel = type === "hotel";
    const requiresRoommates = isRoommateFriendlyListing(listing);
    
    // Hide guest selection for per-person bookings (student, shared, hostel)
    // Only show it for standard homes or hotels
    const showGuestSelection = !requiresRoommates || isHotel;

    return {
      isShared,
      isStudent,
      isHostel,
      isHotel,
      requiresRoommates,
      showGuestSelection,
      canHaveRoommates: isHotel || isStudent,
      actionLabel: requiresRoommates ? "Request to Join" : "Reserve",
    };
  }, [listing]);

  const hostName = listing?.host?.name?.trim() || "Property owner";
  const hostAvatarSrc =
    listing?.host?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(hostName)}&background=random`;

  const amenityIcons: Record<string, string> = {
    wifi: "ph-wifi-high",
    kitchen: "ph-cooking-pot",
    washer: "ph-washing-machine",
    parking: "ph-car",
    ac: "ph-snowflake",
    security: "ph-shield-check",
    workspace: "ph-desktop",
    study_room: "ph-books",
    lounge: "ph-couch",
    lockers: "ph-lock",
  };

  const reserve = () => {
    if (!listing) return;
    const storageKey = "gigs_bookings";
    const stored = localStorage.getItem(storageKey);
    const parsed = stored ? JSON.parse(stored) : [];
    const next = Array.isArray(parsed) ? parsed : [];
    const hostId = listing.host?.id ? String(listing.host.id) : "";
    const guestId = user?.id ? String(user.id) : "";
    next.unshift({
      id: `bk_${Math.random().toString(36).slice(2, 10)}`,
      listingId: listing.id,
      listingTitle: listing.title,
      hostId,
      guestId,
      guestName: user?.name ?? "",
      createdAt: new Date().toISOString(),
      guests,
      checkIn,
      checkOut,
      kind: meta?.requiresRoommates ? "JOIN_REQUEST" : "RESERVATION",
      status: "PENDING",
      seenByHost: false,
    });
    localStorage.setItem(storageKey, JSON.stringify(next));
    window.dispatchEvent(new Event("bookingsUpdated"));
    setReserved(true);
    setTimeout(() => setReserved(false), 2500);
  };

  const submitReview = async () => {
    if (!reviewComment.trim()) return;
    setIsSubmittingReview(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowReviewForm(false);
    setReviewComment("");
    setReviewRating(5);
    setIsSubmittingReview(false);
    alert("Review submitted successfully!");
  };

  const pay = () => {
    if (!listing) return;
    const storageKey = "gigs_payments";
    const stored = localStorage.getItem(storageKey);
    const parsed = stored ? JSON.parse(stored) : [];
    const next: unknown[] = Array.isArray(parsed) ? parsed : [];

    const amount =
      paymentItem === "RENT"
        ? listing.price
        : paymentItem === "DEPOSIT"
          ? listing.securityCharge
          : paymentItem === "OTHER"
            ? listing.otherCharges
            : listing.price + listing.securityCharge + listing.otherCharges;

    next.unshift({
      id: `pay_${Math.random().toString(36).slice(2, 10)}`,
      listingId: listing.id,
      listingTitle: listing.title,
      hostId: listing.host?.id ? String(listing.host.id) : "",
      guestId: user?.id ? String(user.id) : "",
      createdAt: new Date().toISOString(),
      item: paymentItem,
      method: paymentMethod,
      amount,
      currency: "NGN",
      status: "COMPLETED",
    });

    localStorage.setItem(storageKey, JSON.stringify(next));
    window.dispatchEvent(new Event("paymentsUpdated"));
    setPaymentDone(true);
    setTimeout(() => setPaymentDone(false), 2500);
  };

  const shareListing = async () => {
    if (!listing) return;
    const url = `${window.location.origin}/listings/${encodeURIComponent(String(listing.id))}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <div className="h-10 w-48 bg-slate-200 rounded-xl animate-pulse" />
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <div className="aspect-[16/10] bg-slate-200 rounded-[32px] animate-pulse" />
              <div className="h-44 bg-slate-200 rounded-[32px] animate-pulse" />
              <div className="h-44 bg-slate-200 rounded-[32px] animate-pulse" />
            </div>
            <div className="lg:col-span-1">
              <div className="h-80 bg-slate-200 rounded-[32px] animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-600 font-bold">
            <i className="ph ph-arrow-left"></i>
            Back
          </Link>
          <div className="mt-8 bg-white rounded-[32px] border border-slate-200 p-10 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ph ph-warning-circle text-3xl text-slate-400"></i>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Something went wrong</h1>
            <p className="text-sm text-slate-500 mt-2">{loadError}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!listing || !meta) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-600 font-bold">
            <i className="ph ph-arrow-left"></i>
            Back
          </Link>
          <div className="mt-8 bg-white rounded-[32px] border border-slate-200 p-10 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ph ph-house-line text-3xl text-slate-300"></i>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Listing not found</h1>
            <p className="text-sm text-slate-500 mt-2">This listing may have been removed or is not available.</p>
          </div>
        </div>
      </main>
    );
  }

  const photos = listing.photos?.length ? listing.photos : [];
  const hero = photos[activeImage] || photos[0] || "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=2070&auto=format&fit=crop";

  return (
    <main className="min-h-screen bg-white md:bg-gradient-to-b md:from-gray-100 md:via-gray-50 md:to-gray-200">
      {/* Mobile Sticky Header */}
      <div className="fixed top-0 inset-x-0 z-[100] md:hidden px-4 py-4 flex items-center justify-between pointer-events-none">
        <Link 
          href="/" 
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-lg pointer-events-auto active:scale-90 transition-transform"
        >
          <i className="ph ph-caret-left text-xl"></i>
        </Link>
        <div className="flex items-center gap-3 pointer-events-auto">
          <button 
            onClick={toggleLike}
            className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg active:scale-90 transition-all ${
              isLiked ? "bg-red-500 text-white" : "bg-white/90 text-slate-900"
            }`}
          >
            <i className={`${isLiked ? "ph-fill" : "ph"} ph-heart text-xl`}></i>
          </button>
          <button 
            onClick={() => setShowAllPhotos(true)}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-lg active:scale-90 transition-transform"
          >
            <i className="ph ph-dots-three text-xl"></i>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto md:px-6 md:py-10 pb-20 md:pb-10">
        {/* Mobile Gallery Section */}
        <div className="md:hidden relative aspect-[4/5] overflow-hidden">
          <div className="flex h-full w-full snap-x snap-mandatory overflow-x-auto no-scrollbar"
            onScroll={(e) => {
              const scrollLeft = (e.target as HTMLDivElement).scrollLeft;
              const width = (e.target as HTMLDivElement).clientWidth;
              setActiveImage(Math.round(scrollLeft / width));
            }}
          >
            {photos.map((p, idx) => (
              <div key={idx} className="h-full w-full shrink-0 snap-center">
                <img src={p} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          
          {/* Gallery Indicators Overlay */}
          <div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-4 px-6">
            <div className="flex gap-1.5">
              {photos.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeImage ? "w-6 bg-white" : "w-1.5 bg-white/40"
                  }`} 
                />
              ))}
            </div>
            
            <div className="w-full flex justify-end">
              <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <i className="ph-fill ph-star text-amber-400 text-xs"></i>
                <span className="text-xs font-bold text-slate-900">5 (15)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-between gap-4 mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-600 font-bold">
            <i className="ph ph-arrow-left"></i>
            Back
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              {String(listing.type).replaceAll("_", " ")}
            </span>
            {listing.status === "VERIFIED" && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Mobile Property Info Header */}
        <div className="md:hidden p-6 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <i className="ph ph-map-pin text-sm"></i>
              <span className="text-[13px] font-medium truncate">{listing.address.street}, {listing.address.city}</span>
              <span className="text-slate-300 mx-1">|</span>
              <i className="ph ph-train text-sm"></i>
              <span className="text-[13px] font-medium">5 min</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
              ₦{listing.price.toLocaleString()} / Month
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {listing.basics && (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100 text-[11px] font-bold text-slate-600">
                  <i className="ph ph-users"></i> {listing.basics.guests} RM
                </div>
                {listing.basics.bedrooms !== undefined && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100 text-[11px] font-bold text-slate-600">
                    <i className="ph ph-bed"></i> {listing.basics.bedrooms} room
                  </div>
                )}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100 text-[11px] font-bold text-slate-600">
                  <i className="ph ph-bounding-box"></i> 25 m
                </div>
                {listing.basics.beds !== undefined && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100 text-[11px] font-bold text-slate-600">
                    <i className="ph ph-door"></i> {listing.basics.beds} BR
                  </div>
                )}
              </>
            )}
            {listing.studentHousing?.forStudents && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 rounded-full border border-brand-100 text-[11px] font-bold text-brand-700">
                <i className="ph ph-student"></i> Student ready
              </div>
            )}
            {listing.studentHousing?.needsRoommate && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 rounded-full border border-brand-100 text-[11px] font-bold text-brand-700">
                <i className="ph ph-users-three"></i> Needs roommate
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100 text-[11px] font-bold text-slate-600">
              <i className="ph ph-paw-print"></i>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {[
              listing.studentHousing?.forStudents ? "Student housing" : null,
              listing.studentHousing?.needsRoommate ? "Roommate friendly" : null,
              listing.studentHousing?.needsRoommate && listing.studentHousing?.roommateSlots
                ? `${listing.studentHousing.roommateSlots} roommate spot${listing.studentHousing.roommateSlots > 1 ? "s" : ""}`
                : null,
            ]
              .filter(Boolean)
              .map((tag) => (
              <span key={tag} className="px-5 py-2.5 bg-slate-100 rounded-full text-[13px] font-medium text-slate-700">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Desktop Header (Already exists in current code) */}
        <div className="hidden md:block bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6 mb-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">{listing.title}</h1>
            <div className="flex flex-col items-end shrink-0">
              <div className="flex items-center gap-1">
                <i className="ph-fill ph-star text-slate-900 text-xl"></i>
                <span className="font-bold text-slate-900 text-lg">4.91</span>
              </div>
              <span className="text-xs text-slate-500 underline">12 reviews</span>
            </div>
          </div>
          {/* ... existing desktop header content ... */}
        </div>

        {/* Re-using the existing grid for main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Desktop Gallery (Hidden on mobile) */}
            <div className="hidden md:block bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm relative group">
              <div className="grid grid-cols-2 gap-2 p-2">
                <button
                  onClick={() => setActiveImage(0)}
                  className="col-span-2 md:col-span-1 rounded-[28px] overflow-hidden relative aspect-[4/3] md:aspect-auto md:h-[420px]"
                >
                  <img src={hero} className="w-full h-full object-cover" />
                </button>

                <div className="hidden md:grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((idx) => {
                    const src = photos[idx] || hero;
                    const isActive = activeImage === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`rounded-[22px] overflow-hidden border-2 transition-all ${isActive ? "border-brand-500" : "border-transparent hover:border-brand-200"}`}
                      >
                        <img src={src} className="w-full h-[204px] object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Show All Photos Button (Desktop) */}
              <button 
                onClick={() => setShowAllPhotos(true)}
                className="absolute bottom-6 right-6 px-4 py-2.5 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg flex items-center gap-2 hover:bg-white transition-all active:scale-95 group/btn"
              >
                <i className="ph ph-grid-four text-lg text-slate-900 group-hover/btn:rotate-90 transition-transform duration-300"></i>
                <span className="text-sm font-bold text-slate-900">Show all photos</span>
              </button>

              {photos.length > 1 && (
                <div className="p-4 border-t border-slate-100 md:hidden">
                  <div className="flex gap-3 overflow-x-auto">
                    {photos.map((p, idx) => (
                      <button
                        key={`${p}_${idx}`}
                        onClick={() => setActiveImage(idx)}
                        className={`shrink-0 w-20 h-14 rounded-2xl overflow-hidden border-2 transition-all ${
                          idx === activeImage ? "border-brand-500" : "border-slate-200 hover:border-brand-200"
                        }`}
                      >
                        <img src={p} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Student Lifestyle Actions */}
            <div className={`grid gap-4 ${meta.canHaveRoommates ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
              {meta.canHaveRoommates && (
                <Link 
                  href="/roommates"
                  className="flex items-center justify-between p-5 bg-amber-50 border border-amber-100 rounded-[24px] group active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-amber-600 shadow-sm">
                      <i className="ph-fill ph-users-three text-2xl"></i>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-base">Find Roommates</div>
                      <div className="text-[11px] text-amber-700 font-bold uppercase tracking-wider">Split the bill</div>
                    </div>
                  </div>
                  <i className="ph ph-caret-right text-amber-400 group-hover:translate-x-1 transition-transform"></i>
                </Link>
              )}

              <Link 
                href={`/listings/${encodeURIComponent(String(listing.id))}/split-bills`}
                className="flex items-center justify-between p-5 bg-blue-50 border border-blue-100 rounded-[24px] group active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                    <i className="ph-fill ph-calculator text-2xl"></i>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-base">Split Bills</div>
                    <div className="text-[11px] text-blue-700 font-bold uppercase tracking-wider">Manage expenses</div>
                  </div>
                </div>
                <i className="ph ph-caret-right text-blue-400 group-hover:translate-x-1 transition-transform"></i>
              </Link>
            </div>

            <div id="amenities-section" className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
              <h2 className="text-xl font-display font-semibold text-slate-900 tracking-tight">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                {listing.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-brand-200 transition-colors">
                    <i className={`ph ${amenityIcons[a] || "ph-check"} text-xl text-slate-400 group-hover:text-brand-600`}></i>
                    <span className="text-sm font-medium text-slate-700 capitalize">{a.replaceAll("_", " ")}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
              <h2 className="text-xl font-display font-semibold text-slate-900 tracking-tight">About this place</h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{listing.description}</p>
            </div>



            <div className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-semibold text-slate-900 tracking-tight">Location</h2>
                <Link href={`https://www.google.com/maps?q=${listing.address.latitude},${listing.address.longitude}`} target="_blank" className="text-xs sm:text-sm font-bold text-brand-700 underline underline-offset-4">
                  Open in Maps
                </Link>
              </div>
              <div className="aspect-[16/9] w-full rounded-[24px] bg-slate-100 border border-slate-200 overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000&auto=format&fit=crop" 
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                  alt="Map preview"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center text-white shadow-2xl animate-bounce">
                    <i className="ph-fill ph-map-pin text-2xl"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-display font-semibold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  { q: "Is the security deposit refundable?", a: "Yes, the security deposit is fully refundable at the end of your stay, provided there are no damages to the property." },
                  { q: "Are utilities included in the rent?", a: "Utility coverage varies. Please check the amenities section or contact the landlord for specific details on electricity and water bills." },
                  { q: "Can I bring a roommate later?", a: "If you've booked a private room, you can use our 'Find Roommate' feature to split bills with someone else, subject to landlord approval." }
                ].map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="font-bold text-slate-900 text-sm mb-1">{faq.q}</div>
                    <p className="text-xs text-slate-500 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Help & Support Section */}
            <div className="bg-slate-900 rounded-[32px] p-6 md:p-8 text-white shadow-xl space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-xl">Need Help?</h3>
                  <p className="text-slate-400 text-sm">Our support team is available 24/7 to help you with your booking or any student lifestyle queries.</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
                  <i className="ph ph-headset text-2xl"></i>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-all text-left group">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="ph ph-chat-circle-text text-lg"></i>
                  </div>
                  <div>
                    <div className="font-bold text-sm">Live Chat</div>
                    <div className="text-[10px] text-slate-400">Average response: 2m</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-all text-left group">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="ph ph-envelope text-lg"></i>
                  </div>
                  <div>
                    <div className="font-bold text-sm">Email Support</div>
                    <div className="text-[10px] text-slate-400">Response within 24h</div>
                  </div>
                </button>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Support" />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-brand-500 flex items-center justify-center text-[10px] font-bold">
                    +5
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-medium">8 agents online now</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-display font-bold text-slate-900">₦{listing.price.toLocaleString()}</span>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-tighter">/ mo</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-900">
                    <i className="ph-fill ph-star text-sm"></i>
                    <span className="text-sm font-bold">4.91</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-0 border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="p-3 border-r border-b border-slate-200">
                      <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">Check-in</label>
                      <input 
                        type="date" 
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full text-sm bg-transparent outline-none text-slate-600"
                      />
                    </div>
                    <div className="p-3 border-b border-slate-200">
                      <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">Check-out</label>
                      <input 
                        type="date" 
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full text-sm bg-transparent outline-none text-slate-600"
                      />
                    </div>
                    {meta.showGuestSelection && (
                      <div className="col-span-2 p-3">
                        <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">Guests</label>
                        <select 
                          value={guests}
                          onChange={(e) => setGuests(parseInt(e.target.value))}
                          className="w-full text-sm bg-transparent outline-none text-slate-600"
                        >
                          {[1, 2, 3, 4, 5, 6].map(n => (
                            <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={reserve}
                    disabled={reserved}
                    className={`w-full py-4 rounded-[20px] font-bold text-base shadow-xl transition-all flex items-center justify-center gap-2 ${
                      reserved 
                        ? "bg-emerald-500 text-white shadow-emerald-500/10" 
                        : "bg-slate-900 text-white shadow-slate-900/10 hover:bg-black active:scale-[0.98]"
                    }`}
                  >
                    {reserved ? (
                      <>
                        <i className="ph ph-check-circle"></i>
                        Request Sent
                      </>
                    ) : (
                      <>
                        {meta.actionLabel}
                        <i className="ph ph-caret-right text-sm"></i>
                      </>
                    )}
                  </button>
                  
                  <p className="text-center text-xs text-slate-400 font-medium">You won't be charged yet</p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span className="underline">₦{listing.price.toLocaleString()} x 1 month</span>
                    <span>₦{listing.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span className="underline">Service fee</span>
                    <span>₦0</span>
                  </div>
                  <div className="pt-3 flex justify-between font-bold text-slate-900">
                    <span>Total</span>
                    <span>₦{listing.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Booking Footer */}
      <div className="fixed bottom-0 inset-x-0 z-[100] md:hidden bg-white/80 backdrop-blur-xl border-t border-slate-100 p-4 pb-8 flex items-center justify-between gap-6 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-display font-bold text-slate-900 tracking-tight">₦{listing.price.toLocaleString()}</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">/ mo</span>
          </div>
          <button className="text-[11px] font-bold text-brand-600 underline underline-offset-2">View details</button>
        </div>
        <button
          onClick={reserve}
          className="flex-1 max-w-[200px] py-4 bg-slate-900 text-white rounded-[20px] font-bold text-base shadow-xl shadow-slate-900/10 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {meta.actionLabel}
          <i className="ph ph-caret-right text-sm"></i>
        </button>
      </div>

      {/* Photo Gallery Modal */}
      <AnimatePresence>
        {showAllPhotos && (
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-[200] bg-white overflow-y-auto"
          >
            <div className="sticky top-0 inset-x-0 z-10 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-100">
              <button 
                onClick={() => setShowAllPhotos(false)}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 hover:bg-slate-200 transition-colors"
              >
                <i className="ph ph-x text-xl"></i>
              </button>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors">
                  <i className="ph ph-share-network text-lg"></i>
                  <span className="text-sm font-bold">Share</span>
                </button>
                <button 
                  onClick={toggleLike}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <i className={`${isLiked ? "ph-fill text-red-500" : "ph"} ph-heart text-lg`}></i>
                  <span className="text-sm font-bold">{isLiked ? "Saved" : "Save"}</span>
                </button>
              </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12 space-y-4">
              {photos.map((p, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-[32px] overflow-hidden border border-slate-100 shadow-sm"
                >
                  <img src={p} className="w-full h-auto object-cover" alt={`Photo ${idx + 1}`} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
