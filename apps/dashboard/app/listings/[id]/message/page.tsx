"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/context/MessageContext";
import type { Listing } from "@/types/listing";

export default function ListingMessagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const listingId = decodeURIComponent(String(id ?? "")).trim();

  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { startConversation, sendMessage, markAsRead } = useMessages();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loadingListing, setLoadingListing] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

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
    const hostId = String(h?.id ?? `host_${listingId}`);
    const hostName = String(h?.name ?? "Host");
    const hostAvatar = h?.avatar || "";
    return { id: hostId, name: hostName, avatar: hostAvatar, phone: String(h?.phone ?? "") };
  }, [listing?.host, listingId]);

  const cover = listing?.photos?.[0] || "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=2070&auto=format&fit=crop";

  const handleSend = async () => {
    if (!listing) return;
    const content = message.trim();
    if (!content) return;
    if (!isAuthenticated || !user?.id) {
      router.push(`/auth/signup?redirect=${encodeURIComponent(`/listings/${encodeURIComponent(listingId)}/message`)}`);
      return;
    }

    setSending(true);
    try {
      const conversationId = startConversation(
        String(listing.id),
        listing.title,
        cover,
        host.id,
        host.name,
        user.id,
        user.name
      );
      sendMessage(conversationId, user.id, content);
      markAsRead(conversationId, user.id);
      router.push(`/user/messages?c=${encodeURIComponent(conversationId)}`);
    } finally {
      setSending(false);
    }
  };

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
              href="/user/messages"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
            >
              <i className="ph-bold ph-chats"></i>
              Messages
            </Link>
          </div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-100">
                  <div className="text-2xl font-display font-bold text-slate-900">Message host</div>
                  <div className="text-slate-500 mt-2">Ask about availability, rules, and anything you need before booking.</div>

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
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center">
                              {host.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 line-clamp-1">{host.name}</div>
                              <div className="text-xs text-slate-500 line-clamp-1">
                                {listing.address.city}, {listing.address.province}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center gap-2">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-brand-50 text-brand-700 border border-brand-200">
                              <i className="ph-fill ph-seal-check"></i>
                              Verified listing
                            </span>
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-700 border border-slate-200">
                              {listing.type.replaceAll("_", " ")}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-slate-500">Listing not found.</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your message</div>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write a message..."
                      rows={8}
                      className="mt-3 w-full bg-transparent outline-none resize-none text-sm text-slate-900 placeholder:text-slate-400"
                      disabled={sending || loadingListing || !listing}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-500">
                      {isLoading ? "Checking account..." : isAuthenticated ? "Signed in" : "You’ll be asked to sign up to send"}
                    </div>
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={sending || !message.trim() || loadingListing || !listing}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <i className="ph-bold ph-arrow-right"></i>
                      {sending ? "Sending..." : "Send"}
                    </button>
                  </div>

                  <div className="mt-6 rounded-3xl border border-slate-200 p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
                        <i className="ph-bold ph-shield-check"></i>
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Keep it on GIGS</div>
                        <div className="text-sm text-slate-600 mt-1">
                          Messaging inside GIGS keeps you protected and helps us support you if anything goes wrong.
                        </div>
                      </div>
                    </div>
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

