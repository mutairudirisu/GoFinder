"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Listing } from "@/types/listing";
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
    const type = String(listing.type);
    const isStudent = type === "student_accommodation";
    const isShared = listing.spaceType === "shared" || type === "shared_room";
    const isHostel = type === "hostel";
    const requiresRoommates = isShared || isStudent || isHostel;
    return {
      isShared,
      isStudent,
      isHostel,
      requiresRoommates,
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
    <main className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="flex items-center justify-between gap-4 mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
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

            <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-4">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">{listing.title}</h1>
              <p className="text-slate-500">
                {listing.address.street}, {listing.address.district}, {listing.address.city}, {listing.address.province}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 bg-slate-50 rounded-full text-xs font-bold text-slate-700 flex items-center gap-2">
                  <i className="ph ph-users"></i>
                  {listing.basics.guests} guests
                </span>
                <span className="px-3 py-1 bg-slate-50 rounded-full text-xs font-bold text-slate-700 flex items-center gap-2">
                  <i className="ph ph-bed"></i>
                  {listing.basics.bedrooms} bedroom{listing.basics.bedrooms === 1 ? "" : "s"}
                </span>
                <span className="px-3 py-1 bg-slate-50 rounded-full text-xs font-bold text-slate-700 flex items-center gap-2">
                  <i className="ph ph-bathtub"></i>
                  {listing.basics.beds} bed{listing.basics.beds === 1 ? "" : "s"}
                </span>
                <span className="px-3 py-1 bg-brand-50 rounded-full text-xs font-bold text-brand-700 flex items-center gap-2">
                  ₦{listing.price.toLocaleString()} / {listing.paymentFrequency.toLowerCase()}
                </span>
                {meta.isStudent && (
                  <span className="px-3 py-1 bg-purple-50 rounded-full text-xs font-bold text-purple-700 flex items-center gap-2">
                    <i className="ph ph-graduation-cap"></i>
                    Student space
                  </span>
                )}
                {meta.isShared && (
                  <span className="px-3 py-1 bg-amber-50 rounded-full text-xs font-bold text-amber-700 flex items-center gap-2">
                    <i className="ph ph-users-three"></i>
                    Shared room
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">About this place</h2>
              <p className="text-slate-600 leading-relaxed">{listing.description}</p>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {listing.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                      <i className={`ph ${amenityIcons[a] || "ph-check"}`}></i>
                    </div>
                    <span className="text-sm font-bold text-slate-800">{a.replaceAll("_", " ").replaceAll("-", " ")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">₦{listing.price.toLocaleString()}</span>
                  <span className="text-xs text-slate-500">/ {listing.paymentFrequency.toLowerCase()}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-2xl border border-slate-200 p-3">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Check-in</label>
                    <input
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      type="date"
                      className="w-full bg-transparent outline-none text-sm font-bold text-slate-900"
                    />
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-3">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Check-out</label>
                    <input
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      type="date"
                      className="w-full bg-transparent outline-none text-sm font-bold text-slate-900"
                    />
                  </div>
                  <div className="col-span-2 rounded-2xl border border-slate-200 p-3 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Guests</div>
                      <div className="text-sm font-bold text-slate-900">{guests}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-9 h-9 rounded-full border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50"
                      >
                        <i className="ph ph-minus"></i>
                      </button>
                      <button
                        onClick={() => setGuests(Math.min(10, guests + 1))}
                        className="w-9 h-9 rounded-full border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50"
                      >
                        <i className="ph ph-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={reserve}
                  className="w-full py-4 bg-brand-500 text-white rounded-2xl font-bold hover:bg-brand-600 transition-all"
                >
                  {meta.actionLabel}
                </button>

                <div className="text-xs text-slate-500">
                  {meta.requiresRoommates
                    ? "This is a shared space. We'll match you with roommates and confirm availability before you move in."
                    : "You won’t be charged yet. Reserve to notify the host and lock in availability."}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: reserved ? 1 : 0, y: reserved ? 0 : 10 }}
                  className="bg-brand-50 border border-brand-100 rounded-2xl p-4 text-brand-800 text-sm font-bold"
                >
                  {meta.requiresRoommates ? "Request sent. Check your messages for updates." : "Reservation request sent. Check your messages for updates."}
                </motion.div>
              </div>

              <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900">Bills & Payments</div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Secure</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentItem("TOTAL")}
                    className={`px-3 py-2 rounded-2xl border text-xs font-bold transition-all ${
                      paymentItem === "TOTAL" ? "border-brand-500 bg-brand-50 text-brand-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Total
                  </button>
                  <button
                    onClick={() => setPaymentItem("RENT")}
                    className={`px-3 py-2 rounded-2xl border text-xs font-bold transition-all ${
                      paymentItem === "RENT" ? "border-brand-500 bg-brand-50 text-brand-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Rent
                  </button>
                  <button
                    onClick={() => setPaymentItem("DEPOSIT")}
                    className={`px-3 py-2 rounded-2xl border text-xs font-bold transition-all ${
                      paymentItem === "DEPOSIT" ? "border-brand-500 bg-brand-50 text-brand-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Deposit
                  </button>
                  <button
                    onClick={() => setPaymentItem("OTHER")}
                    className={`px-3 py-2 rounded-2xl border text-xs font-bold transition-all ${
                      paymentItem === "OTHER" ? "border-brand-500 bg-brand-50 text-brand-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Other
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod("CARD")}
                    className={`px-3 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      paymentMethod === "CARD" ? "border-brand-500 bg-brand-50 text-brand-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <i className="ph ph-credit-card"></i>
                    Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod("TRANSFER")}
                    className={`px-3 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      paymentMethod === "TRANSFER" ? "border-brand-500 bg-brand-50 text-brand-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <i className="ph ph-bank"></i>
                    Transfer
                  </button>
                </div>

                <button
                  onClick={pay}
                  className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <i className="ph ph-lock-key"></i>
                  Pay now
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={shareListing}
                    className="py-3 rounded-2xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <i className="ph ph-share-network"></i>
                    {copied ? "Copied" : "Share"}
                  </button>
                  <Link
                    href={`/listings/${encodeURIComponent(String(listing.id))}/split-bills`}
                    className="py-3 rounded-2xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <i className="ph ph-calculator"></i>
                    {meta.requiresRoommates ? "Split bills" : "Share & split"}
                  </Link>
                </div>

                {meta.requiresRoommates ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/listings/${encodeURIComponent(String(listing.id))}/roommates`}
                      className="py-3 rounded-2xl bg-amber-50 text-amber-700 font-bold hover:bg-amber-100 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <i className="ph ph-users-three"></i>
                      Roommates
                    </Link>
                    <Link
                      href={`/listings/${encodeURIComponent(String(listing.id))}/split-bills`}
                      className="py-3 rounded-2xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <i className="ph ph-calculator"></i>
                      Split bills
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={`/listings/${encodeURIComponent(String(listing.id))}/roommates`}
                    className="w-full py-3 rounded-2xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <i className="ph ph-magnifying-glass"></i>
                    Find a roommate
                  </Link>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: paymentDone ? 1 : 0, y: paymentDone ? 0 : 10 }}
                  className="bg-brand-50 border border-brand-100 rounded-2xl p-4 text-brand-800 text-sm font-bold"
                >
                  Payment initiated. Check your billing history for updates.
                </motion.div>
              </div>

              <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={hostAvatarSrc}
                    className="w-12 h-12 rounded-2xl border border-slate-200 object-cover"
                  />
                  <div>
                    <div className="font-bold text-slate-900">Hosted by {hostName}</div>
                    {listing.status === "VERIFIED" ? (
                      <div className="text-xs text-brand-600 font-bold flex items-center gap-1.5">
                        <i className="ph-fill ph-seal-check"></i>
                        Verified
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/listings/${encodeURIComponent(String(listing.id))}/message`}
                    className="py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="ph ph-chat-circle-dots"></i>
                    Message
                  </Link>
                  <Link
                    href={`/listings/${encodeURIComponent(String(listing.id))}/contact`}
                    className="py-3 rounded-2xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="ph ph-phone"></i>
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
