"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout";
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

export default function JoinRoommatesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const groupId = decodeURIComponent(String(id ?? "")).trim();
  const { user, isAuthenticated } = useAuth();

  const [group, setGroup] = useState<RoommateGroup | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/roommates/${encodeURIComponent(groupId)}`, { cache: "no-store" });
        if (!res.ok) {
          setGroup(null);
          return;
        }
        const data = (await res.json()) as { group: RoommateGroup };
        setGroup(data.group ?? null);
      } finally {
        setIsLoading(false);
      }
    };
    if (groupId) void load();
  }, [groupId]);

  useEffect(() => {
    const loadListing = async () => {
      if (!group?.listingId) return;
      const res = await fetch(`/api/listings/${encodeURIComponent(String(group.listingId))}`, { cache: "no-store" });
      if (!res.ok) {
        setListing(null);
        return;
      }
      const data = (await res.json()) as { listing: Listing };
      setListing(data.listing ?? null);
    };
    void loadListing();
  }, [group?.listingId]);

  const maxMembers = useMemo(() => {
    const desired = Number.isFinite(Number(group?.desiredRoommates)) ? Number(group?.desiredRoommates) : 1;
    return Math.max(2, desired + 1);
  }, [group?.desiredRoommates]);

  const isMember = useMemo(() => {
    if (!group || !user?.id) return false;
    return (group.members ?? []).some((m) => String(m.userId) === String(user.id));
  }, [group, user?.id]);

  const inviteLink = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/roommates/join/${encodeURIComponent(groupId)}`;
  }, [groupId]);

  const handleJoin = async () => {
    if (!group) return;
    if (!isAuthenticated || !user?.id) return;

    setJoining(true);
    setError("");
    try {
      const res = await fetch(`/api/roommates/${encodeURIComponent(group.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "join",
          user: { userId: user.id, name: user.name || user.email?.split("@")[0] || "User" },
        }),
      });
      const data = (await res.json()) as { group?: RoommateGroup; error?: string };
      if (!res.ok) {
        setError(data.error || "Could not join this roommate plan.");
        return;
      }
      if (data.group) setGroup(data.group);
    } finally {
      setJoining(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
    } catch {
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-gray-200">
      <Header />

      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-24 pb-16 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/roommates" className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-600 font-bold">
            <i className="ph ph-arrow-left"></i>
            Back to roommates
          </Link>
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 rounded-2xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            Copy invite link
          </button>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-[32px] border border-slate-200 p-10 shadow-sm">
            <div className="h-6 w-48 bg-slate-200 rounded-lg animate-pulse" />
            <div className="mt-4 h-4 w-72 bg-slate-200 rounded-lg animate-pulse" />
            <div className="mt-8 h-32 bg-slate-200 rounded-2xl animate-pulse" />
          </div>
        ) : !group ? (
          <div className="bg-white rounded-[32px] border border-slate-200 p-10 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ph ph-link text-3xl text-slate-300"></i>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Invite not found</h1>
            <p className="text-sm text-slate-500 mt-2">This roommate invite link may have expired or been removed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-5">
              <div className="space-y-1">
                <h1 className="text-2xl font-display font-bold text-slate-900">Join roommate plan</h1>
                <p className="text-slate-500">
                  {listing ? `${listing.title} • ${listing.address.city}, ${listing.address.province}` : group.locationKey}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
                  {group.status}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                  {group.members?.length ?? 0}/{maxMembers} joined
                </span>
              </div>

              {group.note ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Note</div>
                  {group.note}
                </div>
              ) : null}

              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Members</div>
                <div className="space-y-2">
                  {(group.members ?? []).slice(0, 6).map((m) => (
                    <div key={m.userId} className="flex items-center justify-between">
                      <div className="font-bold text-slate-900">{m.name}</div>
                      <div className="text-xs text-slate-500">Joined</div>
                    </div>
                  ))}
                  {(group.members ?? []).length > 6 ? (
                    <div className="text-xs text-slate-500">+{(group.members ?? []).length - 6} more</div>
                  ) : null}
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 font-bold">
                  {error}
                </div>
              ) : null}

              {!isAuthenticated ? (
                <div className="space-y-3">
                  <div className="text-sm text-slate-600">
                    Create an account to join this plan and chat with the person who shared it.
                  </div>
                  <Link
                    href={`/auth/signup?redirect=${encodeURIComponent(`/roommates/join/${encodeURIComponent(groupId)}`)}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors"
                  >
                    Continue
                    <i className="ph ph-arrow-right"></i>
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleJoin}
                  disabled={joining || isMember || group.status !== "OPEN"}
                  className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isMember ? "You’re already in this plan" : group.status !== "OPEN" ? "This plan is not open" : joining ? "Joining..." : "Join plan"}
                </button>
              )}

              <div className="flex items-center gap-3">
                {listing ? (
                  <Link
                    href={`/listings/${encodeURIComponent(String(listing.id))}`}
                    className="flex-1 text-center py-3 rounded-2xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                  >
                    View listing
                  </Link>
                ) : null}
                <Link
                  href="/user/profile"
                  className="flex-1 text-center py-3 rounded-2xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                >
                  Your dashboard
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
              <div className="aspect-[4/3] rounded-[24px] overflow-hidden bg-slate-100">
                <img
                  src={
                    listing?.photos?.[0] ||
                    "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=2070&auto=format&fit=crop"
                  }
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-6 space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Shared by</div>
                <div className="font-bold text-slate-900">{group.createdBy?.name || "User"}</div>
                <div className="text-sm text-slate-600">{group.locationKey}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

