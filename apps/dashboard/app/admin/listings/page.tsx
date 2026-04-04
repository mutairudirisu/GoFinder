"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Listing } from "@/types/listing";

type ListingStatus = Listing["status"];

const statusOptions: Array<{ label: string; value: "ALL" | ListingStatus | "PENDING" }> = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Verified", value: "VERIFIED" },
  { label: "Action required", value: "ACTION_REQUIRED" },
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Booked", value: "BOOKED" },
];

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]["value"]>("PENDING");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("ALL");
  const [category, setCategory] = useState<"ALL" | "home" | "experience" | "service">("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/listings", { cache: "no-store" });
      const json = (await res.json()) as { listings?: Listing[] };
      setListings(Array.isArray(json.listings) ? json.listings : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cityOptions = useMemo(() => {
    const set = new Set<string>();
    for (const l of listings) set.add(String(l.address?.city ?? "").trim());
    return ["ALL", ...Array.from(set).filter(Boolean).sort()];
  }, [listings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((l) => {
      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "PENDING"
            ? l.status === "IN_PROGRESS" || l.status === "ACTION_REQUIRED"
            : l.status === statusFilter;
      const matchesCity = city === "ALL" ? true : String(l.address?.city ?? "") === city;
      const matchesCategory =
        category === "ALL"
          ? true
          : String(l.category ?? "").toLowerCase() === category;
      const matchesQuery =
        q === ""
          ? true
          : String(l.title ?? "").toLowerCase().includes(q) ||
            String(l.id ?? "").toLowerCase().includes(q) ||
            String(l.address?.street ?? "").toLowerCase().includes(q) ||
            String(l.address?.district ?? "").toLowerCase().includes(q);
      return matchesStatus && matchesCity && matchesCategory && matchesQuery;
    });
  }, [category, city, listings, query, statusFilter]);

  const setStatus = async (id: string, status: ListingStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/listings/${encodeURIComponent(String(id))}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) return;
      await load();
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteListing = async (id: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/listings/${encodeURIComponent(String(id))}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Admin removal" }),
      });
      if (!res.ok) return;
      await load();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
        <div>
          <div className="text-3xl font-display font-bold text-slate-900">Listings</div>
          <div className="text-sm text-slate-500 mt-1">Approve, reject, and manage status.</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={load}
            className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-800 font-bold hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Search</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, id, street..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900"
            />
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Status</div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white font-semibold text-slate-900"
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">City</div>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white font-semibold text-slate-900"
            >
              {cityOptions.map((c) => (
                <option key={c} value={c}>
                  {c === "ALL" ? "All cities" : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { label: "All", value: "ALL" as const },
            { label: "Homes", value: "home" as const },
            { label: "Experiences", value: "experience" as const },
            { label: "Services", value: "service" as const },
          ].map((t) => {
            const active = category === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setCategory(t.value)}
                className={`shrink-0 px-4 py-2 rounded-full border font-bold text-sm transition-colors ${
                  active
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-500">{loading ? "Loading..." : `${filtered.length} result(s)`}</div>

      <div className="mt-4 space-y-3">
        {filtered.map((l) => {
          const updating = updatingId === String(l.id);
          const locationLabel = `${l.address?.city ?? ""}, ${l.address?.province ?? ""}`.trim();
          return (
            <div key={l.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    {String(l.category ?? "home").toUpperCase()}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-white text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                    {l.status}
                  </span>
                </div>
                <div className="mt-2 font-bold text-slate-900 line-clamp-1">{l.title}</div>
                <div className="text-xs text-slate-500 mt-1 line-clamp-1">{locationLabel}</div>
                <div className="text-xs text-slate-500 mt-1">ID: {String(l.id)}</div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/listings/${encodeURIComponent(String(l.id))}`}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                >
                  View
                </Link>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => setStatus(String(l.id), "VERIFIED")}
                  className="px-4 py-2 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => setStatus(String(l.id), "REJECTED")}
                  className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => setStatus(String(l.id), "INACTIVE")}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Inactive
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => deleteListing(String(l.id))}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

