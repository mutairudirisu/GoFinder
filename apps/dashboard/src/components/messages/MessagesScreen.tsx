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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
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
    
    // Only auto-select the first conversation on desktop
    // On mobile, we want to show the list if no ID is selected
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

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
    const otherName = activeConversation.participantNames?.[otherId] || activeConversation.listingTitle.split(' ')[0] || "Host";
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

  const startRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = (shouldSend = true) => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    if (shouldSend && activeConversation && user?.id) {
      // For demo, we send a "Voice Message" placeholder
      // In a real app, this would be an audio blob
      sendMessage(activeConversation.id, user.id, `🎤 Voice message (${formatRecordingTime(recordingDuration)})`);
      markAsRead(activeConversation.id, user.id);
    }
    
    setIsRecording(false);
    setRecordingDuration(0);
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="h-full">
      <div className="h-full bg-white md:rounded-[32px] md:border md:border-slate-200 md:shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] lg:grid-cols-[360px_1fr_360px] h-full">
          <aside className={`border-r border-slate-200 flex flex-col min-h-0 ${showListOnMobile ? "" : "hidden md:flex"}`}>
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => router.push(mode === "host" ? "/hosting" : "/")}
                    className="md:hidden w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                    aria-label="Back to dashboard"
                  >
                    <i className="ph-bold ph-caret-left"></i>
                  </button>
                  <div className="text-xl font-display font-bold text-slate-900 tracking-tight">{emptyTitle}</div>
                </div>
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
                    const otherName = c.participantNames?.[otherId] || c.listingTitle.split(' ')[0] || "Host";
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
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                            <img 
                              src={`https://ui-avatars.com/api/?name=${otherName}&background=random&color=fff`} 
                              className="w-full h-full object-cover" 
                              alt={otherName}
                            />
                            <div className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-brand-500 border-2 border-white" />
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

          <section className={`flex flex-col min-h-0 bg-white ${showListOnMobile ? "hidden md:flex" : ""}`}>
            <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between gap-4 sticky top-0 bg-white/80 backdrop-blur-xl z-10">
              {activeConversation ? (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={goBackToList}
                      className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                      aria-label="Back"
                    >
                      <i className="ph-bold ph-caret-left"></i>
                    </button>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm md:text-base border-2 border-white shadow-sm overflow-hidden">
                          {(activeOtherParticipant as any).image ? (
                            <img src={(activeOtherParticipant as any).image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            activeOtherParticipant.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                          )}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 line-clamp-1 text-sm md:text-base tracking-tight">
                          {activeOtherParticipant.name}
                        </div>
                        <div className="text-[11px] md:text-xs text-slate-500 font-medium line-clamp-1 flex items-center gap-1.5">
                          {activeConversation.listingTitle}
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            Offline
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors shrink-0"
                      aria-label="More options"
                    >
                      <i className="ph-bold ph-dots-three"></i>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-slate-600 font-semibold tracking-tight">Select a conversation</div>
              )}
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F8F9FB] no-scrollbar">
              {activeConversation ? (
                activeMessages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <div className="max-w-md">
                      <div className="w-16 h-16 bg-white rounded-[24px] border border-slate-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <i className="ph-bold ph-chat-circle-dots text-3xl text-slate-500"></i>
                      </div>
                      <div className="text-xl font-display font-semibold text-slate-900 tracking-tight">Say hi</div>
                      <div className="text-slate-500 mt-2 text-sm">Send a message to start the conversation.</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {activeMessages.map((m, idx) => {
                      const mine = m.senderId === user?.id;
                      const prev = activeMessages[idx - 1];
                      const showDay = !prev || formatDay(prev.timestamp) !== formatDay(m.timestamp);
                      return (
                        <div key={m.id} className="space-y-4">
                          {showDay ? (
                            <div className="flex items-center justify-center py-2">
                              <div className="text-[10px] font-semibold text-slate-400 bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-100 shadow-sm">
                                {formatDay(m.timestamp)} {formatTime(m.timestamp)}
                              </div>
                            </div>
                          ) : null}
                          <div className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}>
                            {!mine && (
                              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
                                <img 
                                  src={`https://ui-avatars.com/api/?name=${activeOtherParticipant.name}&background=random&color=fff`} 
                                  className="w-full h-full object-cover"
                                  alt=""
                                />
                              </div>
                            )}
                            <div
                              className={`max-w-[85%] md:max-w-[70%] rounded-[24px] px-5 py-3.5 shadow-sm ${
                                mine
                                  ? "bg-slate-900 text-white rounded-tr-[4px]"
                                  : "bg-white text-slate-900 rounded-tl-[4px] border border-slate-100"
                              }`}
                            >
                              <div className="text-[14px] md:text-[15px] leading-relaxed whitespace-pre-wrap">{m.content}</div>
                            </div>
                            {mine && (
                              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
                                <img 
                                  src={`https://ui-avatars.com/api/?name=${user?.name || "Me"}&background=0F172A&color=fff`} 
                                  className="w-full h-full object-cover"
                                  alt=""
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div className="max-w-md">
                    <div className="w-16 h-16 bg-white rounded-[24px] border border-slate-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <i className="ph-bold ph-chats text-3xl text-slate-500"></i>
                    </div>
                    <div className="text-xl font-display font-semibold text-slate-900 tracking-tight">No conversation selected</div>
                    <div className="text-slate-500 mt-2 text-sm">Choose a chat from the left to start.</div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 md:p-6 border-t border-slate-100 bg-white">
              <div className="max-w-4xl mx-auto flex items-center gap-3">
                {!isRecording && (
                  <button
                    type="button"
                    disabled={!activeConversation}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors shrink-0"
                    aria-label="Attach"
                  >
                    <i className="ph-bold ph-image text-lg md:text-xl"></i>
                  </button>
                )}
                
                <div className="flex-1 relative">
                  {isRecording ? (
                    <div className="h-12 flex items-center justify-between px-6 bg-red-50 rounded-[28px] border-2 border-red-100 shadow-sm animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                        <span className="text-sm font-bold text-red-600 tracking-tight">
                          Recording... {formatRecordingTime(recordingDuration)}
                        </span>
                      </div>
                      <button 
                        onClick={() => stopRecording(false)}
                        className="text-xs font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-[28px] border-2 border-brand-500/20 bg-white focus-within:border-brand-500/50 transition-all duration-200 px-5 shadow-sm flex items-center">
                      <textarea
                        value={composer}
                        onChange={(e) => setComposer(e.target.value)}
                        placeholder="Nice to meet you"
                        className="w-full bg-transparent outline-none resize-none text-[15px] text-slate-900 placeholder:text-slate-400 min-h-[20px] max-h-40 py-1 block"
                        disabled={!activeConversation}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                {composer.trim() || isRecording ? (
                  <button
                    type="button"
                    onClick={() => isRecording ? stopRecording(true) : handleSend()}
                    disabled={!activeConversation}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg ${
                      isRecording 
                        ? "bg-red-500 shadow-red-500/20 text-white" 
                        : "bg-brand-500 shadow-brand-500/20 text-white hover:bg-brand-600"
                    }`}
                    aria-label="Send"
                  >
                    <i className={`ph-bold ${isRecording ? "ph-check" : "ph-arrow-up"} text-lg md:text-xl`}></i>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={!activeConversation}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50 shrink-0"
                    aria-label="Voice Message"
                  >
                    <i className="ph-bold ph-microphone text-lg md:text-xl"></i>
                  </button>
                )}
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
