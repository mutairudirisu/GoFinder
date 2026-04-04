"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Listing } from "@/types/listing";

export default function ListingContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const listingId = decodeURIComponent(String(id ?? "")).trim();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loadingListing, setLoadingListing] = useState(true);

  useEffect(() => {
    let isMounted = true;
    void (async () => {
      setLoadingListing(true);
      try {
        const res = await fetch(`/api/listings/${encodeURIComponent(listingId)}`, { cache: "no-store" });
        const data = (await res.json()) as { listing?: Listing; error?: string };
        if (!isMounted) return;
        setListing(data.listing ?? null);
      } finally {
        if (isMounted) setLoadingListing(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [listingId]);

  const host = useMemo(() => {
    const h = listing?.host;
    return {
      name: String(h?.name ?? "Host"),
      phone: String(h?.phone ?? ""),
      email: String(h?.email ?? ""),
    };
  }, [listing?.host]);

  const cover =
    listing?.photos?.[0] || "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=2070&auto=format&fit=crop";

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-gray-200">
      <section className="pt-20 pb-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link
              href={`/listings/${encodeURIComponent(listingId)}`}
              className="inline-flex items-center gap-2 text-slate-700 font-bold hover:text-brand-700"
            >
              <i className="ph-bold ph-arrow-left"></i>
              Back
            </Link>
            <Link
              href={`/listings/${encodeURIComponent(listingId)}/message`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors"
            >
              <i className="ph-bold ph-chat-circle-dots"></i>
              Message host
            </Link>
          </div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-100">
                  <div className="text-2xl font-display font-bold text-slate-900">Contact</div>
                  <div className="text-slate-500 mt-2">Reach out to the host. For best support, message inside GIGS.</div>

                  <div className="mt-6 rounded-[28px] border border-slate-200 overflow-hidden">
                    <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                      <img src={cover} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <div className="text-white font-bold text-sm line-clamp-1">{listing?.title ?? "Listing"}</div>
                        {listing ? (
                          <div className="text-white font-bold text-sm">₦{Number(listing.price).toLocaleString()}</div>
                        ) : null}
                      </div>
                    </div>
                    <div className="p-5">
                      {loadingListing ? (
                        <div className="text-sm text-slate-500">Loading listing...</div>
                      ) : listing ? (
                        <>
                          <div className="font-bold text-slate-900">{host.name}</div>
                          <div className="text-sm text-slate-500 mt-1">
                            {listing.address.city}, {listing.address.province}
                          </div>
                          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-brand-50 text-brand-700 border border-brand-200">
                            <i className="ph-fill ph-seal-check"></i>
                            Verified listing
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-slate-500">Listing not found.</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-4">
                  <div className="rounded-3xl border border-slate-200 p-6">
                    <div className="font-display font-bold text-slate-900 text-xl">Host info</div>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone</div>
                          <div className="mt-1 font-bold text-slate-900">{host.phone || "Not provided"}</div>
                        </div>
                        {host.phone ? (
                          <a
                            href={`tel:${host.phone}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                          >
                            <i className="ph-bold ph-phone"></i>
                            Call
                          </a>
                        ) : null}
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</div>
                          <div className="mt-1 font-bold text-slate-900 break-all">{host.email || "Not provided"}</div>
                        </div>
                        {host.email ? (
                          <a
                            href={`mailto:${host.email}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                          >
                            <i className="ph-bold ph-envelope-simple"></i>
                            Email
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 p-6">
                    <div className="font-bold text-slate-900">Recommended</div>
                    <div className="text-sm text-slate-600 mt-2">
                      Use in-app messaging to keep everything in one place and make testing easier.
                    </div>
                    <Link
                      href={`/listings/${encodeURIComponent(listingId)}/message`}
                      className="mt-4 inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
                    >
                      <i className="ph-bold ph-chat-circle-dots"></i>
                      Message host
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

