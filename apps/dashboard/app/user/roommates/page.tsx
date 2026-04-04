"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Listing } from "@/types/listing";
import { useAuth } from "@/context/AuthContext";

type RoommateGroup = {
  id: string;
  listingId: string;
  locationKey: string;
  createdAt: string;
  createdBy: { userId: string; name: string };
  note: string;
  desiredRoommates: number;
  status: "OPEN" | "FULL" | "CLOSED";
  members: { userId: string; name: string; joinedAt: string }[];
};

export default function UserRoommatesPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<RoommateGroup[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const [groupsRes, listingsRes] = await Promise.all([
          fetch(`/api/roommates?userId=${encodeURIComponent(String(user.id))}`, { cache: "no-store" }),
          fetch("/api/listings", { cache: "no-store" }),
        ]);

        if (groupsRes.ok) {
          const data = (await groupsRes.json()) as { groups: RoommateGroup[] };
          setGroups(Array.isArray(data.groups) ? data.groups : []);
        }
        if (listingsRes.ok) {
          const data = (await listingsRes.json()) as { listings: Listing[] };
          setListings(Array.isArray(data.listings) ? data.listings : []);
        }
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [user?.id]);

  const listingsById = useMemo(() => {
    const map = new Map<string, Listing>();
    listings.forEach((l) => map.set(String(l.id), l));
    return map;
  }, [listings]);

  const copyInvite = async (groupId: string) => {
    try {
      const url = `${window.location.origin}/roommates/join/${encodeURIComponent(groupId)}`;
      await navigator.clipboard.writeText(url);
      setCopiedId(groupId);
      window.setTimeout(() => setCopiedId(null), 1400);
    } catch {
    }
  };

  const closeGroup = async (groupId: string) => {
    const res = await fetch(`/api/roommates/${encodeURIComponent(groupId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "close" }),
    });
    if (!res.ok) return;
    const data = (await res.json()) as { group: RoommateGroup };
    setGroups((prev) => prev.map((g) => (g.id === groupId ? data.group : g)));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 mb-2">Roommates</h1>
          <p className="text-slate-500">Invite roommates, share links, and track who joined.</p>
        </div>
        <Link
          href="/roommates"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
        >
          Browse marketplace
          <i className="ph ph-arrow-right"></i>
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="h-5 w-48 bg-slate-200 rounded-lg animate-pulse" />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 p-6">
                <div className="h-4 w-2/3 bg-slate-200 rounded-lg animate-pulse" />
                <div className="mt-3 h-3 w-1/2 bg-slate-200 rounded-lg animate-pulse" />
                <div className="mt-6 h-10 w-full bg-slate-200 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ph ph-link text-3xl text-slate-300"></i>
          </div>
          <h2 className="text-xl font-bold text-slate-900">No roommate plans yet</h2>
          <p className="text-sm text-slate-500 mt-2">
            Create an invite link from any listing to start sharing with colleagues.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
            >
              Browse listings
            </Link>
            <Link
              href="/roommates"
              className="px-6 py-3 rounded-2xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
            >
              Roommates marketplace
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groups.map((g) => {
            const listing = listingsById.get(String(g.listingId));
            const max = Math.max(2, (g.desiredRoommates ?? 1) + 1);
            const isCreator = String(g.createdBy?.userId) === String(user?.id);
            return (
              <motion.div key={g.id} whileHover={{ y: -2 }} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 line-clamp-1">{listing?.title || "Roommate plan"}</div>
                    <div className="text-sm text-slate-500 line-clamp-1">
                      {listing ? `${listing.address.city}, ${listing.address.province}` : g.locationKey}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                    g.status === "OPEN" ? "text-brand-700 bg-brand-50" : g.status === "FULL" ? "text-amber-700 bg-amber-50" : "text-slate-700 bg-slate-100"
                  }`}>
                    {g.status}
                  </span>
                </div>

                {g.note ? <div className="text-sm text-slate-700 line-clamp-2">{g.note}</div> : null}

                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <div>{g.members?.length ?? 0}/{max} joined</div>
                  <div>{isCreator ? "Created by you" : `Created by ${g.createdBy?.name || "User"}`}</div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/roommates/join/${encodeURIComponent(g.id)}`}
                    className="flex-1 text-center py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => copyInvite(g.id)}
                    className="flex-1 py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors"
                  >
                    {copiedId === g.id ? "Copied" : "Copy link"}
                  </button>
                </div>

                {isCreator ? (
                  <button
                    type="button"
                    onClick={() => closeGroup(g.id)}
                    className="w-full py-3 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                  >
                    Close plan
                  </button>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

