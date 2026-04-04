"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Listing } from "@/types/listing";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "lister" | "renter" | "both" | "admin";
  adminStatus?: "ACTIVE" | "SUSPENDED";
  createdAt?: string;
};

export default function AdminOverviewPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [listingsRes, usersRes] = await Promise.all([
          fetch("/api/listings", { cache: "no-store" }),
          fetch("/api/users", { cache: "no-store" }),
        ]);
        const listingsJson = (await listingsRes.json()) as { listings?: Listing[] };
        const usersJson = (await usersRes.json()) as { users?: AdminUser[] };
        setListings(Array.isArray(listingsJson.listings) ? listingsJson.listings : []);
        setUsers(Array.isArray(usersJson.users) ? usersJson.users : []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const metrics = useMemo(() => {
    const totalListings = listings.length;
    const verifiedListings = listings.filter((l) => l.status === "VERIFIED").length;
    const pendingListings = listings.filter((l) => l.status !== "VERIFIED").length;
    const inactiveListings = listings.filter((l) => l.status === "INACTIVE" || l.status === "REJECTED").length;

    const totalUsers = users.length;
    const suspendedUsers = users.filter((u) => u.adminStatus === "SUSPENDED").length;
    const landlords = users.filter((u) => u.role === "lister" || u.role === "both").length;
    const tenants = users.filter((u) => u.role === "renter" || u.role === "both").length;

    return {
      totalListings,
      verifiedListings,
      pendingListings,
      inactiveListings,
      totalUsers,
      suspendedUsers,
      landlords,
      tenants,
    };
  }, [listings, users]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
        <div>
          <div className="text-3xl font-display font-bold text-slate-900">Overview</div>
          <div className="text-sm text-slate-500 mt-1">Platform health and quick actions.</div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/listings" className="px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors">
            Review listings
          </Link>
          <Link href="/admin/users" className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-800 font-bold hover:bg-brand-50 hover:text-brand-700 transition-colors">
            Manage users
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Listings</div>
          <div className="mt-2 text-2xl font-display font-bold text-slate-900">{loading ? "—" : metrics.totalListings}</div>
          <div className="text-xs text-slate-500 mt-1">Total</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Verified</div>
          <div className="mt-2 text-2xl font-display font-bold text-slate-900">{loading ? "—" : metrics.verifiedListings}</div>
          <div className="text-xs text-slate-500 mt-1">Published</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Pending</div>
          <div className="mt-2 text-2xl font-display font-bold text-slate-900">{loading ? "—" : metrics.pendingListings}</div>
          <div className="text-xs text-slate-500 mt-1">Needs review</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Inactive</div>
          <div className="mt-2 text-2xl font-display font-bold text-slate-900">{loading ? "—" : metrics.inactiveListings}</div>
          <div className="text-xs text-slate-500 mt-1">Rejected / inactive</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Users</div>
          <div className="mt-2 text-2xl font-display font-bold text-slate-900">{loading ? "—" : metrics.totalUsers}</div>
          <div className="text-xs text-slate-500 mt-1">Total</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Landlords</div>
          <div className="mt-2 text-2xl font-display font-bold text-slate-900">{loading ? "—" : metrics.landlords}</div>
          <div className="text-xs text-slate-500 mt-1">Lister / both</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Tenants</div>
          <div className="mt-2 text-2xl font-display font-bold text-slate-900">{loading ? "—" : metrics.tenants}</div>
          <div className="text-xs text-slate-500 mt-1">Renter / both</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Suspended</div>
          <div className="mt-2 text-2xl font-display font-bold text-slate-900">{loading ? "—" : metrics.suspendedUsers}</div>
          <div className="text-xs text-slate-500 mt-1">Users</div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/listings" className="bg-white rounded-2xl border border-slate-200 p-6 hover:bg-brand-50 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-bold text-slate-900">Listing moderation</div>
              <div className="text-sm text-slate-600 mt-1">Approve, reject, and manage listing status.</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <i className="ph-bold ph-buildings text-xl"></i>
            </div>
          </div>
        </Link>
        <Link href="/admin/users" className="bg-white rounded-2xl border border-slate-200 p-6 hover:bg-brand-50 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-bold text-slate-900">User management</div>
              <div className="text-sm text-slate-600 mt-1">Suspend accounts and review verification status.</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <i className="ph-bold ph-users-three text-xl"></i>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

