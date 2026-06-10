"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
<<<<<<< HEAD
import { isRoommateFriendlyListing, type Listing } from "@/types/listing";
=======
import type { Listing } from "@/types/listing";
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
import { Header } from "@/components/layout";
import { useAuth } from "@/context/AuthContext";

type RoommatePost = {
  id: string;
  listingId: string;
  createdAt: string;
  name: string;
  budget: number;
  moveIn: string;
  bio: string;
  preferences: string[];
};

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

const POSTS_KEY = "gigs_roommate_posts";

function readPosts(): RoommatePost[] {
  try {
    const stored = localStorage.getItem(POSTS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as RoommatePost[]) : [];
  } catch {
    return [];
  }
}

function writePosts(posts: RoommatePost[]) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export default function ListingRoommatesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, isAuthenticated } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [posts, setPosts] = useState<RoommatePost[]>([]);

  const [groups, setGroups] = useState<RoommateGroup[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteNote, setInviteNote] = useState("");
  const [desiredRoommates, setDesiredRoommates] = useState(2);
  const [createdGroup, setCreatedGroup] = useState<RoommateGroup | null>(null);
  const [copied, setCopied] = useState(false);

  const [name, setName] = useState("");
  const [budget, setBudget] = useState<number>(0);
  const [moveIn, setMoveIn] = useState("");
  const [bio, setBio] = useState("");
  const [preferenceInput, setPreferenceInput] = useState("");

  useEffect(() => {
    setPosts(readPosts());
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
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
          return;
        }

        const fallbackVerified = await fetch("/api/listings?status=VERIFIED", { cache: "no-store" });
        if (fallbackVerified.ok) {
          const verified = (await fallbackVerified.json()) as { listings: Listing[] };
          const found = (Array.isArray(verified.listings) ? verified.listings : []).find(
            (l) => decodeURIComponent(String(l.id)).trim() === normalizedId
          );
          setListing(found ?? null);
          return;
        }

        const fallback = await fetch("/api/listings", { cache: "no-store" });
        if (fallback.ok) {
          const all = (await fallback.json()) as { listings: Listing[] };
          const found = (Array.isArray(all.listings) ? all.listings : []).find(
            (l) => decodeURIComponent(String(l.id)).trim() === normalizedId
          );
          setListing(found ?? null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [id]);

  useEffect(() => {
    const loadGroups = async () => {
      const normalizedId = decodeURIComponent(String(id ?? "")).trim();
      if (!normalizedId) return;
      setGroupsLoading(true);
      try {
        const res = await fetch(`/api/roommates?listingId=${encodeURIComponent(normalizedId)}`, { cache: "no-store" });
        const data = (await res.json()) as { groups: RoommateGroup[] };
        setGroups(Array.isArray(data.groups) ? data.groups : []);
      } finally {
        setGroupsLoading(false);
      }
    };
    void loadGroups();
  }, [id]);

  const listingPosts = useMemo(() => {
    const normalizedId = decodeURIComponent(String(id)).trim();
    return posts
      .filter((p) => decodeURIComponent(String(p.listingId)).trim() === normalizedId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [id, posts]);

  const requiresRoommates = useMemo(() => {
    if (!listing) return false;
<<<<<<< HEAD
    return isRoommateFriendlyListing(listing);
=======
    const type = String(listing.type);
    return listing.spaceType === "shared" || type === "shared_room" || type === "student_accommodation" || type === "hostel";
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
  }, [listing]);

  const suggested = useMemo(() => {
    if (!listing) return [];
    const normalizedListingId = decodeURIComponent(String(id)).trim();
    const city = listing.address.city;
    return posts
      .filter((p) => decodeURIComponent(String(p.listingId)).trim() !== normalizedListingId)
      .filter((p) => p.bio.toLowerCase().includes(city.toLowerCase()) || p.preferences.some((x) => x.toLowerCase().includes(city.toLowerCase())))
      .slice(0, 6);
  }, [id, listing, posts]);

  const createPost = () => {
    if (!listing) return;
    const normalizedId = decodeURIComponent(String(id)).trim();
    const preferences = preferenceInput
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .slice(0, 6);
    const next: RoommatePost[] = [
      {
        id: `rm_${Math.random().toString(36).slice(2, 10)}`,
        listingId: normalizedId,
        createdAt: new Date().toISOString(),
        name: name.trim() || "Anonymous",
        budget: Number.isFinite(budget) ? budget : 0,
        moveIn,
        bio: bio.trim(),
        preferences,
      },
      ...posts,
    ];
    setPosts(next);
    writePosts(next);
    setCreateOpen(false);
    setName("");
    setBudget(0);
    setMoveIn("");
    setBio("");
    setPreferenceInput("");
  };

  const locationKey = useMemo(() => {
    if (!listing) return "";
    return `${listing.address.city}, ${listing.address.province}`;
  }, [listing]);

  const inviteUrl = useMemo(() => {
    if (!createdGroup) return "";
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/roommates/join/${encodeURIComponent(createdGroup.id)}`;
  }, [createdGroup]);

  const copyInvite = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
    }
  };

  const createInvite = async () => {
    if (!listing) return;
    if (!isAuthenticated || !user?.id) return;

    const normalizedId = decodeURIComponent(String(id)).trim();
    const createdByName = user.name || user.email?.split("@")[0] || "User";
    const safeDesired = Math.max(1, Math.min(8, Number(desiredRoommates) || 1));

    const res = await fetch("/api/roommates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId: normalizedId,
        locationKey,
        createdBy: { userId: user.id, name: createdByName },
        note: inviteNote,
        desiredRoommates: safeDesired,
      }),
    });
    if (!res.ok) return;
    const data = (await res.json()) as { group: RoommateGroup };
    setCreatedGroup(data.group ?? null);
    setInviteOpen(false);

    const reload = await fetch(`/api/roommates?listingId=${encodeURIComponent(normalizedId)}`, { cache: "no-store" });
    if (reload.ok) {
      const next = (await reload.json()) as { groups: RoommateGroup[] };
      setGroups(Array.isArray(next.groups) ? next.groups : []);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-gray-200">
        <Header />
        <div className="max-w-5xl mx-auto px-4 md:px-6 pt-24 pb-10">
          <div className="h-10 w-52 bg-slate-200 rounded-xl animate-pulse" />
          <div className="mt-8 h-44 bg-slate-200 rounded-[32px] animate-pulse" />
          <div className="mt-6 h-72 bg-slate-200 rounded-[32px] animate-pulse" />
        </div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-gray-200">
        <Header />
        <div className="max-w-5xl mx-auto px-4 md:px-6 pt-24 pb-10">
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-gray-200">
      <Header />
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-24 pb-10 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <Link href={`/listings/${encodeURIComponent(String(listing.id))}`} className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-600 font-bold">
            <i className="ph ph-arrow-left"></i>
            Back to listing
          </Link>
          <Link href="/roommates" className="text-sm font-bold text-brand-600 hover:text-brand-700">
            Browse roommate listings
          </Link>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-display font-bold text-slate-900">Roommates & sharing</h1>
              <p className="text-slate-500">
                {listing.title} • {listing.address.city}, {listing.address.province}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {requiresRoommates ? (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                    Shared space
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    Optional roommates
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
                  Verified listing
                </span>
              </div>
              {!requiresRoommates ? (
                <div className="text-sm text-slate-500 max-w-xl">
                  This is not a shared listing, but you can still create a roommate invite to split rent with a friend or a colleague.
                </div>
              ) : null}
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/listings/${encodeURIComponent(String(listing.id))}/split-bills`}
                className="px-6 py-3 rounded-2xl bg-slate-100 text-slate-800 font-bold hover:bg-brand-50 hover:text-brand-700 transition-colors flex items-center gap-2 justify-center"
              >
                <i className="ph ph-calculator"></i>
                Split bills
              </Link>
              <button
                onClick={() => setInviteOpen(true)}
                className="px-6 py-3 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors flex items-center gap-2 justify-center"
              >
                <i className="ph ph-link"></i>
                Create invite link
              </button>
              <button
                onClick={() => setCreateOpen(true)}
                className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors flex items-center gap-2 justify-center"
              >
                <i className="ph ph-user-plus"></i>
                Create profile
              </button>
            </div>
          </div>
        </div>

        {inviteOpen ? (
          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Roommate invite link</h2>
              <button onClick={() => setInviteOpen(false)} className="text-slate-500 hover:text-slate-800">
                <i className="ph ph-x text-xl"></i>
              </button>
            </div>

            {!isAuthenticated ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                  <i className="ph ph-lock text-slate-500"></i>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900">Sign in to create an invite</div>
                  <div className="text-sm text-slate-600 mt-1">
                    Create a shareable link so your friends or colleagues can join your roommate plan.
                  </div>
                  <div className="mt-4">
                    <Link
                      href={`/auth/signup?redirect=${encodeURIComponent(`/listings/${encodeURIComponent(String(listing.id))}/roommates`)}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors"
                    >
                      Continue
                      <i className="ph ph-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Roommates needed
                    </label>
                    <input
                      value={String(desiredRoommates)}
                      onChange={(e) => setDesiredRoommates(Number(e.target.value || 1))}
                      type="number"
                      min={1}
                      max={8}
                      className="w-full bg-transparent outline-none font-bold text-slate-900"
                      placeholder="2"
                    />
                    <div className="text-xs text-slate-500 mt-1">Max 8</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4 sm:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Note (optional)
                    </label>
                    <input
                      value={inviteNote}
                      onChange={(e) => setInviteNote(e.target.value)}
                      className="w-full bg-transparent outline-none font-bold text-slate-900"
                      placeholder="Looking for a tidy roommate, student preferred..."
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setInviteOpen(false)}
                    className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createInvite}
                    className="px-6 py-3 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors"
                  >
                    Create link
                  </button>
                </div>
              </>
            )}
          </div>
        ) : null}

        {createdGroup ? (
          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-bold text-slate-900">Invite created</div>
                <div className="text-sm text-slate-500">
                  Share this link so people can join your roommate plan.
                </div>
              </div>
              <Link
                href={`/roommates/join/${encodeURIComponent(createdGroup.id)}`}
                className="px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
              >
                Preview
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 font-semibold text-slate-800 overflow-hidden text-ellipsis">
                {inviteUrl || `roommates/join/${createdGroup.id}`}
              </div>
              <button
                type="button"
                onClick={() => copyInvite(inviteUrl || `roommates/join/${createdGroup.id}`)}
                className="px-5 py-3 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        ) : null}

        <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Open roommate invites</h2>
            <span className="text-xs font-bold text-slate-500">{groups.length}</span>
          </div>

          {groupsLoading ? (
            <div className="h-24 rounded-3xl bg-slate-100 animate-pulse" />
          ) : groups.length === 0 ? (
            <div className="text-sm text-slate-500">
              No invite links yet. Create one to start sharing this listing with potential roommates.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map((g) => (
                <div key={g.id} className="rounded-3xl border border-slate-200 p-6 bg-white space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-bold text-slate-900">Roommate plan</div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                      g.status === "OPEN" ? "text-brand-700 bg-brand-50" : g.status === "FULL" ? "text-amber-700 bg-amber-50" : "text-slate-700 bg-slate-100"
                    }`}>
                      {g.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600">
                    Created by <span className="font-bold">{g.createdBy?.name || "User"}</span>
                  </div>
                  {g.note ? <div className="text-sm text-slate-700 line-clamp-2">{g.note}</div> : null}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-slate-500 font-bold">
                      {g.members?.length ?? 0}/{Math.max(2, (g.desiredRoommates ?? 1) + 1)} joined
                    </div>
                    <Link
                      href={`/roommates/join/${encodeURIComponent(g.id)}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors text-sm"
                    >
                      View
                      <i className="ph ph-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {createOpen && (
          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Your roommate profile</h2>
              <button onClick={() => setCreateOpen(false)} className="text-slate-500 hover:text-slate-800">
                <i className="ph ph-x text-xl"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 p-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent outline-none font-bold text-slate-900" placeholder="Your name" />
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Budget (₦)</label>
                <input
                  value={budget ? String(budget) : ""}
                  onChange={(e) => setBudget(Number(e.target.value || 0))}
                  type="number"
                  className="w-full bg-transparent outline-none font-bold text-slate-900"
                  placeholder="150000"
                />
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Move-in date</label>
                <input value={moveIn} onChange={(e) => setMoveIn(e.target.value)} type="date" className="w-full bg-transparent outline-none font-bold text-slate-900" />
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-transparent outline-none text-slate-900 min-h-[110px]" placeholder="Tell roommates what you’re like, schedule, and expectations." />
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Preferences (comma separated)</label>
                <input
                  value={preferenceInput}
                  onChange={(e) => setPreferenceInput(e.target.value)}
                  className="w-full bg-transparent outline-none font-bold text-slate-900"
                  placeholder="quiet, tidy, student, non-smoker"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setCreateOpen(false)} className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button onClick={createPost} className="px-6 py-3 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors">
                Save profile
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">People for this listing</h2>
              <span className="text-xs font-bold text-slate-500">{listingPosts.length}</span>
            </div>

            {listingPosts.length === 0 ? (
              <div className="text-sm text-slate-500">No roommate profiles yet. Create yours to start matching.</div>
            ) : (
              <div className="space-y-3">
                {listingPosts.map((p) => (
                  <div key={p.id} className="rounded-3xl border border-slate-200 p-5 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full">₦{Number(p.budget || 0).toLocaleString()}</div>
                    </div>
                    <div className="text-xs text-slate-500">Move-in: {p.moveIn || "Flexible"}</div>
                    <div className="text-sm text-slate-700 line-clamp-3">{p.bio || "No bio provided."}</div>
                    {p.preferences.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {p.preferences.map((x) => (
                          <span key={x} className="text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full">
                            {x}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="pt-3">
                      <button className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                        <i className="ph ph-chat-circle-dots"></i>
                        Message to match
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Suggested matches</h2>
              <span className="text-xs font-bold text-slate-500">{suggested.length}</span>
            </div>

            {suggested.length === 0 ? (
              <div className="text-sm text-slate-500">
                No suggestions yet. Create more roommate profiles or browse the roommate marketplace.
              </div>
            ) : (
              <div className="space-y-3">
                {suggested.map((p) => (
                  <motion.div key={p.id} whileHover={{ y: -2 }} className="rounded-3xl border border-slate-200 p-5 bg-white space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">₦{Number(p.budget || 0).toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-slate-600 line-clamp-2">{p.bio || "No bio provided."}</div>
                    <button className="w-full py-3 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors">
                      Invite to this listing
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
