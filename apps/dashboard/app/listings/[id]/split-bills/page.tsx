"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Listing } from "@/types/listing";

type SplitPlan = {
  id: string;
  listingId: string;
  createdAt: string;
  people: number;
  total: number;
  perPerson: number;
  method: "EQUAL";
};

const PLANS_KEY = "gigs_split_plans";

function readPlans(): SplitPlan[] {
  try {
    const stored = localStorage.getItem(PLANS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as SplitPlan[]) : [];
  } catch {
    return [];
  }
}

function writePlans(plans: SplitPlan[]) {
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
}

export default function SplitBillsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [people, setPeople] = useState(2);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [plans, setPlans] = useState<SplitPlan[]>([]);

  useEffect(() => {
    setPlans(readPlans());
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const normalizedId = decodeURIComponent(String(id)).trim();
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

  const normalizedId = useMemo(() => decodeURIComponent(String(id)).trim(), [id]);
  const requiresRoommates = useMemo(() => {
    if (!listing) return false;
    const type = String(listing.type);
    return listing.spaceType === "shared" || type === "shared_room" || type === "student_accommodation" || type === "hostel";
  }, [listing]);
  const total = useMemo(() => {
    if (!listing) return 0;
    return listing.price + listing.securityCharge + listing.otherCharges;
  }, [listing]);

  const perPerson = useMemo(() => {
    if (!total) return 0;
    return Math.round(total / Math.max(2, people));
  }, [people, total]);

  const listingPlans = useMemo(() => {
    return plans
      .filter((p) => decodeURIComponent(String(p.listingId)).trim() === normalizedId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 5);
  }, [normalizedId, plans]);

  const savePlan = () => {
    if (!listing) return;
    const next: SplitPlan[] = [
      {
        id: `sp_${Math.random().toString(36).slice(2, 10)}`,
        listingId: normalizedId,
        createdAt: new Date().toISOString(),
        people: Math.max(2, people),
        total,
        perPerson,
        method: "EQUAL",
      },
      ...plans,
    ];
    setPlans(next);
    writePlans(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const copyInvite = async () => {
    if (!listing) return;
    const url = `${window.location.origin}/listings/${encodeURIComponent(String(listing.id))}/split-bills?people=${encodeURIComponent(String(Math.max(2, people)))}`;
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
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
          <div className="h-10 w-52 bg-slate-200 rounded-xl animate-pulse" />
          <div className="mt-8 h-56 bg-slate-200 rounded-[32px] animate-pulse" />
        </div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-gray-200">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-600 font-bold">
            <i className="ph ph-arrow-left"></i>
            Back
          </Link>
          <div className="mt-8 bg-white rounded-[32px] border border-slate-200 p-10 text-center">
            <h1 className="text-xl font-bold text-slate-900">Listing not found</h1>
            <p className="text-sm text-slate-500 mt-2">This listing may have been removed or is not available.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-gray-200">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <Link href={`/listings/${encodeURIComponent(String(listing.id))}`} className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-600 font-bold">
            <i className="ph ph-arrow-left"></i>
            Back to listing
          </Link>
          <Link href={`/listings/${encodeURIComponent(String(listing.id))}/roommates`} className="text-sm font-bold text-brand-600 hover:text-brand-700">
            {requiresRoommates ? "Roommates" : "Find roommates"}
          </Link>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-3">
          <h1 className="text-2xl font-display font-bold text-slate-900">Split bills</h1>
          <p className="text-slate-500">
            {listing.title} • {listing.address.city}, {listing.address.province}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${requiresRoommates ? "text-amber-700 bg-amber-50" : "text-blue-700 bg-blue-50"}`}>
              {requiresRoommates ? "Group split" : "Friend split"}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
              Verified listing
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900">Split setup</div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full">Equal split</span>
            </div>

            <div className="rounded-3xl border border-slate-200 p-5 space-y-3 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">People</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPeople(Math.max(2, people - 1))} className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50">
                    <i className="ph ph-minus"></i>
                  </button>
                  <span className="text-sm font-bold text-slate-900 w-8 text-center">{people}</span>
                  <button onClick={() => setPeople(Math.min(8, people + 1))} className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50">
                    <i className="ph ph-plus"></i>
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Rent</span>
                  <span className="font-bold text-slate-900">₦{listing.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Deposit</span>
                  <span className="font-bold text-slate-900">₦{listing.securityCharge.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Other</span>
                  <span className="font-bold text-slate-900">₦{listing.otherCharges.toLocaleString()}</span>
                </div>
                <div className="h-px bg-slate-200 my-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Total</span>
                  <span className="font-bold text-slate-900">₦{total.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Per person</span>
                  <span className="font-bold text-brand-600">₦{perPerson.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button onClick={savePlan} className="w-full py-4 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors flex items-center justify-center gap-2">
              <i className="ph ph-floppy-disk"></i>
              Save split plan
            </button>

            <button onClick={copyInvite} className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
              <i className="ph ph-share-network"></i>
              {copied ? "Invite link copied" : "Copy invite link"}
            </button>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: saved ? 1 : 0, y: saved ? 0 : 10 }} className="bg-brand-50 border border-brand-100 rounded-2xl p-4 text-brand-800 text-sm font-bold">
              Split plan saved.
            </motion.div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900">Recent plans</div>
              <span className="text-xs font-bold text-slate-500">{listingPlans.length}</span>
            </div>

            {listingPlans.length === 0 ? (
              <div className="text-sm text-slate-500">No saved plans yet.</div>
            ) : (
              <div className="space-y-3">
                {listingPlans.map((p) => (
                  <div key={p.id} className="rounded-3xl border border-slate-200 p-5 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-slate-900">{p.people} people</div>
                      <div className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">₦{p.perPerson.toLocaleString()} each</div>
                    </div>
                    <div className="text-xs text-slate-500">Total: ₦{p.total.toLocaleString()}</div>
                    <button className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                      <i className="ph ph-share-network"></i>
                      Share plan
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
