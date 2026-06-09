"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { Listing } from "@/types/listing";

export default function HostingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);

  const openCategoryOverlay = () => {
    localStorage.setItem('gigs_request_category_overlay', 'true');
    window.dispatchEvent(new Event('gigs_open_category_overlay'));
  };

  // Redirect if not authorized (handled by layout, but kept for safety)
  useEffect(() => {
    if (user && user.role === 'renter') {
      router.replace("/");
    }
  }, [user, router]);

  useEffect(() => {
    let isMounted = true;
    void (async () => {
      try {
        const res = await fetch("/api/listings", { cache: "no-store" });
        const data = (await res.json()) as { listings: Listing[] };
        const all = Array.isArray(data.listings) ? data.listings : [];
        const mine = user?.id ? all.filter((l) => String(l?.host?.id ?? "") === String(user.id)) : all;
        if (isMounted) setListings(mine);
      } finally {
        if (isMounted) setLoadingListings(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const emailStatus = user?.verifications?.email?.status ?? "UNVERIFIED";
  const phoneStatus = user?.verifications?.phone?.status ?? "UNVERIFIED";
  const idStatus = user?.verifications?.id?.status ?? "UNVERIFIED";
  const isUserFullyVerified = emailStatus === "VERIFIED" && phoneStatus === "VERIFIED" && idStatus === "VERIFIED";

  const verifiedCount = listings.filter((l) => l.status === "VERIFIED").length;
  const actionRequiredCount = listings.filter((l) => l.status === "ACTION_REQUIRED").length;
  const inProgressCount = listings.filter((l) => l.status === "IN_PROGRESS").length;
  const hasListings = listings.length > 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="md:hidden flex items-center justify-center">
        <div className="bg-slate-100 rounded-full p-1 inline-flex">
          <div className="px-5 py-2 rounded-full bg-slate-900 text-white text-sm font-bold">Today</div>
          <Link
            href="/hosting/bookings"
            className="px-5 py-2 rounded-full text-slate-700 text-sm font-bold hover:text-brand-700"
          >
            Upcoming
          </Link>
        </div>
      </div>

      <div className="hidden md:flex items-start justify-between gap-4 flex-col sm:flex-row">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">Today</h1>
          <div className="text-slate-500 mt-1">
            {user?.name ? `Welcome back, ${user.name.split(" ")[0]}.` : "Welcome back."}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openCategoryOverlay}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
          >
            <i className="ph-bold ph-plus"></i>
            Create listing
          </button>
          <Link
            href="/hosting/listings"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 text-slate-800 font-bold hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            View listings
            <i className="ph-bold ph-caret-right"></i>
          </Link>
        </div>
      </div>

      <div className="md:hidden mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={openCategoryOverlay}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
        >
          <i className="ph-bold ph-plus"></i>
          Create
        </button>
        <Link
          href="/hosting/listings"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 text-slate-800 font-bold hover:bg-brand-50 hover:text-brand-700 transition-colors"
        >
          Listings
          <i className="ph-bold ph-caret-right"></i>
          </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Account</div>
                <div className="mt-2 text-xl font-display font-bold text-slate-900">
                  {isUserFullyVerified ? "Verified" : "Action required"}
                </div>
                <div className="text-sm text-slate-600 mt-2">
                  {isUserFullyVerified ? "Your listings publish instantly." : "Verify email, phone, and ID to publish."}
                </div>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isUserFullyVerified ? "bg-brand-50 text-brand-600" : "bg-amber-50 text-amber-700"}`}>
                <i className={`ph-fill ${isUserFullyVerified ? "ph-seal-check" : "ph-warning-circle"} text-2xl`}></i>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${emailStatus === "VERIFIED" ? "bg-brand-50 text-brand-700 border-brand-200" : "bg-amber-50 text-amber-800 border-amber-200"}`}>
                <i className={`ph-fill ${emailStatus === "VERIFIED" ? "ph-check-circle" : "ph-warning-circle"}`}></i>
                Email
              </span>
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${phoneStatus === "VERIFIED" ? "bg-brand-50 text-brand-700 border-brand-200" : "bg-amber-50 text-amber-800 border-amber-200"}`}>
                <i className={`ph-fill ${phoneStatus === "VERIFIED" ? "ph-check-circle" : "ph-warning-circle"}`}></i>
                Phone
              </span>
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${idStatus === "VERIFIED" ? "bg-brand-50 text-brand-700 border-brand-200" : "bg-amber-50 text-amber-800 border-amber-200"}`}>
                <i className={`ph-fill ${idStatus === "VERIFIED" ? "ph-check-circle" : "ph-warning-circle"}`}></i>
                ID
              </span>
            </div>
            <div className="mt-6">
              <Link
                href="/hosting/settings"
                className={`inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-2xl font-bold transition-colors ${isUserFullyVerified ? "bg-slate-100 text-slate-800 hover:bg-slate-200" : "bg-brand-500 text-white hover:bg-brand-600"}`}
              >
                {isUserFullyVerified ? "Manage verification" : "Complete verification"}
                <i className="ph-bold ph-caret-right"></i>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Listings</div>
                <div className="mt-2 text-xl font-display font-bold text-slate-900">{loadingListings ? "Loading..." : `${listings.length}`}</div>
                <div className="text-sm text-slate-600 mt-2">Total listings in your hosting account.</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <i className="ph-fill ph-house-line text-2xl"></i>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-200 p-3 text-center">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Verified</div>
                <div className="mt-1 font-display font-bold text-slate-900">{verifiedCount}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-3 text-center">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Action</div>
                <div className="mt-1 font-display font-bold text-slate-900">{actionRequiredCount}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-3 text-center">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Draft</div>
                <div className="mt-1 font-display font-bold text-slate-900">{inProgressCount}</div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={openCategoryOverlay}
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-2xl border border-slate-200 text-slate-800 font-bold hover:bg-brand-50 hover:text-brand-700 transition-colors"
              >
                {hasListings ? "Manage listings" : "Create your first listing"}
                <i className="ph-bold ph-caret-right"></i>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Next steps</div>
                <div className="mt-2 text-xl font-display font-bold text-slate-900">
                  {!hasListings ? "Create a listing" : isUserFullyVerified ? "You’re ready" : "Verify to publish"}
                </div>
                <div className="text-sm text-slate-600 mt-2">
                  {!hasListings
                    ? "Start earning by adding your first property."
                    : isUserFullyVerified
                      ? "Keep your listing details up to date."
                      : "Finish verification once and publish everything."}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <i className="ph-fill ph-lightning text-2xl"></i>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {!hasListings ? (
                <button
                  onClick={openCategoryOverlay}
                  className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors"
                >
                  Create listing
                  <i className="ph-bold ph-caret-right"></i>
                </button>
              ) : (
                <Link
                  href={isUserFullyVerified ? "/hosting/listings" : "/hosting/settings"}
                  className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
                >
                  {isUserFullyVerified ? "Preview & edit listings" : "Complete verification"}
                  <i className="ph-bold ph-caret-right"></i>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xl font-display font-bold text-slate-900">Your listings</div>
            <div className="text-sm text-slate-500 mt-1">Quick view for today.</div>
          </div>
          <Link href="/hosting/listings" className="text-sm font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-2">
            View all
            <i className="ph-bold ph-caret-right"></i>
          </Link>
        </div>

        {!hasListings && !loadingListings ? (
          <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="ph-bold ph-house-line text-3xl text-slate-500"></i>
            </div>
            <div className="font-display font-bold text-slate-900 text-xl">No listings yet</div>
            <div className="text-slate-500 mt-2">Create your first listing to start hosting.</div>
            <button 
              onClick={openCategoryOverlay}
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors"
            >
              <i className="ph-bold ph-plus"></i>
              Create listing
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {listings.slice(0, 6).map((l) => {
              const statusBadge =
                l.status === "VERIFIED"
                  ? "bg-brand-50 text-brand-700 border-brand-200"
                  : l.status === "ACTION_REQUIRED"
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-slate-100 text-slate-700 border-slate-200";
              const statusLabel = l.status === "VERIFIED" ? "Verified" : l.status === "ACTION_REQUIRED" ? "Action required" : "In progress";
              return (
                <Link key={l.id} href="/hosting/listings" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-brand-200 hover:shadow-lg transition-all">
                  <div className="aspect-[4/3] relative">
                    <img
                      src={l.photos?.[0] || "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=2070&auto=format&fit=crop"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusBadge}`}>
                        <i className={`ph-fill ${l.status === "VERIFIED" ? "ph-seal-check" : l.status === "ACTION_REQUIRED" ? "ph-warning-circle" : "ph-pencil-simple"}`}></i>
                        {statusLabel}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="font-bold text-slate-900 line-clamp-1">{l.title}</div>
                    <div className="text-sm text-slate-500 line-clamp-1 mt-1">
                      {l.address.street}, {l.address.city}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="text-sm font-bold text-slate-900">₦{Number(l.price).toLocaleString()}</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{l.paymentFrequency}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
