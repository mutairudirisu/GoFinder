"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/context/MessageContext";
import type { Listing } from "@/types/listing";

type Mode = "guest" | "host";

function formatTime(ts: number) {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function formatDay(ts: number) {
  try {
    const d = new Date(ts);
    return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export function MessagesScreen({ mode }: { mode: Mode }) {
  const { user } = useAuth();
  const { conversations, getMessages, sendMessage, markAsRead } = useMessages();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");
  const [query, setQuery] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [composer, setComposer] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const c = searchParams.get("c");
    if (c) setActiveConversationId(c);
  }, [searchParams]);

  useEffect(() => {
    if (!user?.id) return;
    if (activeConversationId) return;
    const preferred = conversations.find((c) => c.participants.includes(user.id));
    if (preferred) setActiveConversationId(preferred.id);
  }, [activeConversationId, conversations, user?.id]);

  useEffect(() => {
    let isMounted = true;
    void (async () => {
      setLoadingListings(true);
      try {
        const res = await fetch("/api/listings", { cache: "no-store" });
        const data = (await res.json()) as { listings: Listing[] };
        if (!isMounted) return;
        setListings(Array.isArray(data.listings) ? data.listings : []);
      } finally {
        if (isMounted) setLoadingListings(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const listingById = useMemo(() => {
    const map = new Map<string, Listing>();
    for (const l of listings) {
      map.set(String(l.id), l);
    }
    return map;
  }, [listings]);

  const myConversations = useMemo(() => {
    if (!user?.id) return [];
    return conversations.filter((c) => c.participants.includes(user.id));
  }, [conversations, user?.id]);

  const filteredConversations = useMemo(() => {
    const q = query.trim().toLowerCase();
    return myConversations
      .filter((c) => {
        const unread = c.unreadBy?.[String(user?.id ?? "")] ?? c.unreadCount ?? 0;
        return filter === "UNREAD" ? unread > 0 : true;
      })
      .filter((c) => {
        if (!q) return true;
        const otherId = c.participants.find((p) => p !== user?.id) ?? "";
        const otherName = c.participantNames?.[otherId] ?? "Conversation";
        const hay = `${otherName} ${c.listingTitle} ${c.lastMessage}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => b.lastMessageTime - a.lastMessageTime);
  }, [filter, myConversations, query, user?.id]);

  const activeConversation = useMemo(() => {
    if (!activeConversationId) return null;
    return myConversations.find((c) => c.id === activeConversationId) ?? null;
  }, [activeConversationId, myConversations]);

  const activeMessages = useMemo(() => {
    if (!activeConversation) return [];
    return getMessages(activeConversation.id).slice().sort((a, b) => a.timestamp - b.timestamp);
  }, [activeConversation, getMessages]);

  const activeOtherParticipant = useMemo(() => {
    if (!activeConversation || !user?.id) return { id: "", name: "" };
    const otherId = activeConversation.participants.find((p) => p !== user.id) ?? "";
    const otherName = activeConversation.participantNames?.[otherId] ?? "User";
    return { id: otherId, name: otherName };
  }, [activeConversation, user?.id]);

  const activeListing = useMemo(() => {
    if (!activeConversation) return null;
    return listingById.get(String(activeConversation.listingId)) ?? null;
  }, [activeConversation, listingById]);

  useEffect(() => {
    if (!activeConversationId || !user?.id) return;
    markAsRead(activeConversationId, user.id);
    const next = new URLSearchParams(searchParams.toString());
    if (next.get("c") !== activeConversationId) {
      next.set("c", activeConversationId);
      router.replace(`${pathname}?${next.toString()}`);
    }
  }, [activeConversationId, markAsRead, pathname, router, searchParams, user?.id]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [activeConversation?.id, activeMessages.length]);

  const handleSend = () => {
    if (!activeConversation || !user?.id) return;
    const content = composer.trim();
    if (!content) return;
    sendMessage(activeConversation.id, user.id, content);
    markAsRead(activeConversation.id, user.id);
    setComposer("");
  };

  const emptyTitle = mode === "host" ? "Host inbox" : "Messages";
  const emptySubtitle =
    mode === "host"
      ? "When guests contact you, conversations appear here."
      : "When you message hosts, conversations appear here.";

  const showListOnMobile = !activeConversationId;

  const goBackToList = () => {
    setActiveConversationId(null);
    const next = new URLSearchParams(searchParams.toString());
    next.delete("c");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="h-[calc(100vh-10.5rem)] md:h-[calc(100vh-8.5rem)]">
      <div className="h-full bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] lg:grid-cols-[360px_1fr_360px] h-full">
          <aside className={`border-r border-slate-200 flex flex-col min-h-0 ${showListOnMobile ? "" : "hidden md:flex"}`}>
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xl font-display font-bold text-slate-900">{emptyTitle}</div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-colors"
                    aria-label="Search"
                  >
                    <i className="ph-bold ph-magnifying-glass"></i>
                  </button>
                  <button
                    type="button"
                    disabled
                    className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 opacity-60 cursor-not-allowed"
                    aria-label="Settings"
                  >
                    <i className="ph-bold ph-gear-six"></i>
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilter("ALL")}
                  className={`px-4 py-2 rounded-full border font-bold text-sm transition-colors ${
                    filter === "ALL"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("UNREAD")}
                  className={`px-4 py-2 rounded-full border font-bold text-sm transition-colors ${
                    filter === "UNREAD"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                  }`}
                >
                  Unread
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 px-4 py-3 flex items-center gap-3">
                <i className="ph ph-magnifying-glass text-slate-400"></i>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search messages"
                  className="flex-1 bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
                />
                {query.trim() ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-brand-50 hover:text-brand-700 transition-colors"
                    aria-label="Clear"
                  >
                    <i className="ph ph-x"></i>
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i className="ph-bold ph-chats text-2xl text-slate-500"></i>
                  </div>
                  <div className="font-display font-bold text-slate-900">{emptySubtitle}</div>
                  <div className="text-sm text-slate-500 mt-2">Start by messaging a host from a listing.</div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredConversations.map((c) => {
                    const isActive = c.id === activeConversationId;
                    const otherId = c.participants.find((p) => p !== user?.id) ?? "";
                    const otherName = c.participantNames?.[otherId] ?? "User";
                    const unread = c.unreadBy?.[String(user?.id ?? "")] ?? c.unreadCount ?? 0;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActiveConversationId(c.id)}
                        className={`w-full text-left p-4 transition-colors ${
                          isActive ? "bg-brand-50" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                            <img src={c.listingImage} className="w-full h-full object-cover" />
                            <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-brand-500 border-2 border-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 line-clamp-1">{otherName}</div>
                                <div className="text-xs text-slate-500 line-clamp-1">{c.listingTitle}</div>
                              </div>
                              <div className="text-[10px] font-bold text-slate-400 shrink-0">{formatTime(c.lastMessageTime)}</div>
                            </div>
                            <div className="mt-2 flex items-center justify-between gap-3">
                              <div className="text-sm text-slate-600 line-clamp-1">{c.lastMessage || "Tap to start chatting"}</div>
                              {unread > 0 ? (
                                <span className="shrink-0 inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-brand-500 text-white text-xs font-bold">
                                  {unread > 9 ? "9+" : unread}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          <section className={`flex flex-col min-h-0 ${showListOnMobile ? "hidden md:flex" : ""}`}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
              {activeConversation ? (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={goBackToList}
                      className="md:hidden w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-colors"
                      aria-label="Back"
                    >
                      <i className="ph-bold ph-caret-left"></i>
                    </button>
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center">
                      {activeOtherParticipant.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                      <div className="font-display font-bold text-slate-900 line-clamp-1">{activeOtherParticipant.name}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">
                        {activeConversation.listingTitle}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled
                      className="px-4 py-2 rounded-full border border-slate-200 text-slate-400 font-bold text-sm opacity-60 cursor-not-allowed"
                    >
                      Translation on
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-slate-600 font-bold">Select a conversation</div>
              )}
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 bg-slate-50">
              {activeConversation ? (
                activeMessages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <div className="max-w-md">
                      <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 flex items-center justify-center mx-auto mb-4">
                        <i className="ph-bold ph-chat-circle-dots text-3xl text-slate-500"></i>
                      </div>
                      <div className="text-xl font-display font-bold text-slate-900">Say hi</div>
                      <div className="text-slate-500 mt-2">Send a message to start the conversation.</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeMessages.map((m, idx) => {
                      const mine = m.senderId === user?.id;
                      const prev = activeMessages[idx - 1];
                      const showDay = !prev || formatDay(prev.timestamp) !== formatDay(m.timestamp);
                      return (
                        <div key={m.id} className="space-y-3">
                          {showDay ? (
                            <div className="flex items-center justify-center">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
                                {formatDay(m.timestamp)}
                              </div>
                            </div>
                          ) : null}
                          <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-[78%] rounded-[22px] px-4 py-3 shadow-sm border ${
                                mine
                                  ? "bg-slate-900 text-white border-slate-900"
                                  : "bg-white text-slate-900 border-slate-200"
                              }`}
                            >
                              <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</div>
                              <div className={`mt-2 text-[10px] font-bold ${mine ? "text-white/70" : "text-slate-400"}`}>
                                {formatTime(m.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div className="max-w-md">
                    <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 flex items-center justify-center mx-auto mb-4">
                      <i className="ph-bold ph-chats text-3xl text-slate-500"></i>
                    </div>
                    <div className="text-xl font-display font-bold text-slate-900">No conversation selected</div>
                    <div className="text-slate-500 mt-2">Choose a chat from the left to start.</div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-slate-200 bg-white">
              <div className="flex items-end gap-3">
                <button
                  type="button"
                  disabled={!activeConversation}
                  className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-colors"
                  aria-label="Attach"
                >
                  <i className="ph-bold ph-image-square"></i>
                </button>
                <div className="flex-1 rounded-3xl border border-slate-200 bg-slate-50 p-3">
                  <textarea
                    value={composer}
                    onChange={(e) => setComposer(e.target.value)}
                    placeholder="Write a message..."
                    className="w-full bg-transparent outline-none resize-none text-sm text-slate-900 placeholder:text-slate-400 min-h-10 max-h-40"
                    disabled={!activeConversation}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!activeConversation || !composer.trim()}
                  className="w-12 h-12 rounded-2xl bg-brand-500 text-white font-bold flex items-center justify-center hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send"
                >
                  <i className="ph-bold ph-arrow-up"></i>
                </button>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <i className="ph-bold ph-clock"></i>
                Typical response time: 30 minutes
              </div>
            </div>
          </section>

          <aside className="border-l border-slate-200 hidden lg:flex flex-col min-h-0">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3">
              <div className="font-display font-bold text-slate-900">Reservation</div>
              <button
                type="button"
                disabled
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 opacity-60 cursor-not-allowed"
                aria-label="Close"
              >
                <i className="ph-bold ph-x"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeConversation ? (
                <>
                  <div className="rounded-[28px] border border-slate-200 overflow-hidden shadow-sm bg-white">
                    <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                      <img
                        src={activeConversation.listingImage || "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=960&auto=format&fit=crop"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/90 border border-white/50 backdrop-blur-md text-slate-800">
                          {loadingListings ? "Loading" : activeListing?.status === "VERIFIED" ? "Verified" : "Listed"}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="font-display font-bold text-slate-900 text-xl line-clamp-1">{activeConversation.listingTitle}</div>
                      <div className="text-sm text-slate-500 mt-1">Hosted by {activeOtherParticipant.name}</div>
                      <div className="mt-4 rounded-2xl border border-slate-200 p-4 space-y-2">
                        <div className="text-sm font-bold text-slate-900">Reservation confirmed</div>
                        <div className="text-sm text-slate-600">You can ask any questions about your stay here.</div>
                        <button
                          type="button"
                          disabled
                          className="w-full mt-3 px-4 py-3 rounded-2xl border border-slate-200 font-bold text-slate-400 opacity-60 cursor-not-allowed"
                        >
                          Show itinerary
                        </button>
                        <button
                          type="button"
                          disabled
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 font-bold text-slate-400 opacity-60 cursor-not-allowed"
                        >
                          Change reservation
                        </button>
                      </div>
                      <div className="mt-4">
                        <Link
                          href={`/listings/${encodeURIComponent(String(activeConversation.listingId))}`}
                          className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-800"
                        >
                          View listing
                          <i className="ph ph-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-bold text-slate-900">Reservation details</div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Demo</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-slate-200 p-4">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Check-in</div>
                        <div className="mt-2 font-bold text-slate-900">Fri</div>
                        <div className="text-xs text-slate-500">3:00 PM</div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 p-4">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Checkout</div>
                        <div className="mt-2 font-bold text-slate-900">Sun</div>
                        <div className="text-xs text-slate-500">11:00 AM</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i className="ph-bold ph-house-line text-2xl text-slate-500"></i>
                  </div>
                  <div className="font-display font-bold text-slate-900">No reservation selected</div>
                  <div className="text-sm text-slate-500 mt-2">Select a message thread to see details.</div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
}

export default MessagesScreen;
