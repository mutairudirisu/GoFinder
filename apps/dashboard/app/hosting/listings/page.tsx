"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Listing } from "@/types/listing";
import { useAuth } from "@/context/AuthContext";

export default function ListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [previewListing, setPreviewListing] = useState<Listing | null>(null);
  const [activeTab, setActiveTab] = useState<"ALL" | "HOMES" | "SERVICES" | "EXPERIENCES">("ALL");

  const loadListings = async () => {
    const res = await fetch("/api/listings", { cache: "no-store" });
    const data = (await res.json()) as { listings: Listing[] };
    setListings(Array.isArray(data.listings) ? data.listings : []);
  };

  useEffect(() => {
    void loadListings();
  }, []);

  const isUserFullyVerified = useMemo(() => {
    const email = user?.verifications?.email?.status ?? "UNVERIFIED";
    const phone = user?.verifications?.phone?.status ?? "UNVERIFIED";
    const id = user?.verifications?.id?.status ?? "UNVERIFIED";
    return email === "VERIFIED" && phone === "VERIFIED" && id === "VERIFIED";
  }, [user]);

  const hostListings = useMemo(() => {
    const list = Array.isArray(listings) ? listings : [];
    if (!user?.id) return list;
    return list.filter((l) => String(l?.host?.id ?? "") === String(user.id));
  }, [listings, user?.id]);

  const filteredHostListings = useMemo(() => {
    if (activeTab === "ALL") return hostListings;
    if (activeTab === "HOMES") return hostListings.filter((l) => String(l.category ?? "") === "home");
    if (activeTab === "SERVICES") return hostListings.filter((l) => String(l.category ?? "") === "service");
    return hostListings.filter((l) => String(l.category ?? "") === "experience");
  }, [activeTab, hostListings]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-display font-semibold text-slate-800 mb-1 tracking-tight">
            Your listings
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all">
            <i className="ph-bold ph-layout"></i>
          </button>
          <Link 
            href="/becoming-a-host"
            className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white hover:bg-slate-800 transition-all"
          >
            <i className="ph-bold ph-plus"></i>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: "ALL" as const, label: "All" },
          { id: "HOMES" as const, label: "Homes" },
          { id: "SERVICES" as const, label: "Services", soon: true },
          { id: "EXPERIENCES" as const, label: "Experiences", soon: true },
        ].map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`shrink-0 px-4 py-2 rounded-full border font-bold text-sm transition-colors ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                {t.label}
                {t.soon ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white">
                    SOON
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      {/* Listings Grid */}
      {activeTab === "SERVICES" || activeTab === "EXPERIENCES" ? (
        <div className="bg-white rounded-[32px] border border-slate-200 p-10 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <i className="ph-bold ph-sparkle text-3xl text-slate-500"></i>
          </div>
          <div className="text-xl font-display font-bold text-slate-900">Coming soon</div>
          <div className="text-sm text-slate-500 mt-2">
            {activeTab === "SERVICES" ? "Services hosting is coming soon." : "Experiences hosting is coming soon."}
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("HOMES")}
              className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
            >
              View homes
            </button>
            <Link
              href="/becoming-a-host"
              className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-800 font-bold hover:bg-brand-50 hover:text-brand-700 transition-colors"
            >
              Create listing
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {filteredHostListings.length > 0 ? (
          filteredHostListings.map((listing) => {
            const derivedStatus =
              listing.status === "ACTION_REQUIRED" && isUserFullyVerified ? "VERIFIED" : listing.status;
            return (
            <motion.div
              key={listing.id}
              whileHover={{ y: -4 }}
              className="group cursor-pointer bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-xl hover:border-brand-200"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={listing.photos[0] || "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=2070&auto=format&fit=crop"} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-lg border border-slate-100">
                    <div className={`w-2 h-2 rounded-full ${derivedStatus === 'ACTION_REQUIRED' ? 'bg-red-500 animate-pulse' : 'bg-brand-500'}`}></div>
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      {derivedStatus === 'ACTION_REQUIRED' ? 'Action required' : 'Verified'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-brand-600 transition-colors">{listing.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                  {listing.address.street}, {listing.address.city}, {listing.address.province}
                </p>
                {derivedStatus === "ACTION_REQUIRED" ? (
                  <button
                    type="button"
                    onClick={() => setVerificationModalOpen(true)}
                    className="w-full mb-4 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-bold hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="ph-bold ph-warning-circle"></i>
                    Finish verification to publish
                  </button>
                ) : null}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900">₦{listing.price.toLocaleString()}</span>
                    <span className="text-xs text-slate-500">/ {listing.paymentFrequency.toLowerCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewListing(listing)}
                      className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                      aria-label="Preview"
                    >
                      <i className="ph-bold ph-eye"></i>
                    </button>
                    <Link
                      href={`/hosting/listings/${encodeURIComponent(String(listing.id))}/edit`}
                      className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                      aria-label="Edit"
                    >
                      <i className="ph-bold ph-pencil-simple"></i>
                    </Link>
                    <Link
                      href={`/listings/${encodeURIComponent(String(listing.id))}`}
                      className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                      aria-label="Open"
                    >
                      <i className="ph-bold ph-arrow-square-out"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )})
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ph-bold ph-house-line text-3xl text-slate-300"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {activeTab === "ALL" ? "No listings yet" : `No ${activeTab.toLowerCase()} yet`}
            </h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              {activeTab === "ALL"
                ? "Create your first listing and start earning with GIGS Rentals."
                : "This category is disabled for now."}
            </p>
            <Link
              href="/becoming-a-host"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
            >
              <i className="ph-bold ph-plus"></i>
              Create a listing
            </Link>
          </div>
        )}
      </div>
      )}

      {verificationModalOpen ? (
        <div className="fixed inset-0 z-[70] bg-black/40 p-4 flex items-center justify-center">
          <div className="w-full max-w-lg bg-white rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-lg font-bold text-slate-900">Complete account verification</div>
                <div className="text-sm text-slate-500">Once verified, all your listings publish instantly.</div>
              </div>
              <button
                type="button"
                onClick={() => setVerificationModalOpen(false)}
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-brand-50 hover:text-brand-700 transition-colors"
                aria-label="Close"
              >
                <i className="ph ph-x text-xl"></i>
              </button>
            </div>
            <div className="p-6 md:p-8 space-y-3">
              {[
                {
                  label: "Verify email",
                  done: (user?.verifications?.email?.status ?? "UNVERIFIED") === "VERIFIED",
                  hint: user?.email ? String(user.email) : "Not set",
                },
                {
                  label: "Verify phone number",
                  done: (user?.verifications?.phone?.status ?? "UNVERIFIED") === "VERIFIED",
                  hint: user?.phone ? String(user.phone) : "Not set",
                },
                {
                  label: "Upload government ID",
                  done: (user?.verifications?.id?.status ?? "UNVERIFIED") === "VERIFIED",
                  hint: user?.verifications?.id?.idType ? String(user.verifications.id.idType).toUpperCase() : "Not added",
                },
              ].map((step) => (
                <div key={step.label} className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-900">{step.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{step.hint}</div>
                  </div>
                  {step.done ? (
                    <div className="inline-flex items-center gap-2 text-brand-700 font-bold text-sm">
                      <i className="ph-fill ph-check-circle text-lg"></i>
                      Done
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 text-amber-800 font-bold text-sm">
                      <i className="ph-fill ph-warning-circle text-lg"></i>
                      Required
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-6 md:p-8 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setVerificationModalOpen(false)}
                className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
              <Link
                href="/hosting/settings"
                className="px-6 py-3 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors"
              >
                Go to settings
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {previewListing ? (
        <div className="fixed inset-0 z-[70] bg-black/40 p-4 flex items-center justify-center">
          <div className="w-full max-w-3xl bg-white rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-lg font-bold text-slate-900">Preview</div>
                <div className="text-sm text-slate-500">This is what guests see.</div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewListing(null)}
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-brand-50 hover:text-brand-700 transition-colors"
                aria-label="Close"
              >
                <i className="ph ph-x text-xl"></i>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="aspect-[4/3] md:aspect-auto">
                <img
                  src={previewListing.photos?.[0] || "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=2070&auto=format&fit=crop"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:p-8 space-y-4">
                <div className="text-2xl font-display font-bold text-slate-900">{previewListing.title}</div>
                <div className="text-slate-600">
                  {previewListing.address.street}, {previewListing.address.city}, {previewListing.address.province}
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-sm font-bold text-slate-900 mb-1">Pricing</div>
                  <div className="text-slate-700 font-semibold">
                    ₦{Number(previewListing.price).toLocaleString()} / {previewListing.paymentFrequency.toLowerCase()}
                  </div>
                </div>
                <div className="text-sm text-slate-600 line-clamp-5">{previewListing.description}</div>
                <Link
                  href={`/listings/${encodeURIComponent(String(previewListing.id))}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
                >
                  Open full preview
                  <i className="ph-bold ph-arrow-square-out"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}
