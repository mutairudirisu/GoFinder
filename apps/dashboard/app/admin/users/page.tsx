"use client";

import { useEffect, useMemo, useState } from "react";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "lister" | "renter" | "both" | "admin";
  phone?: string;
  adminStatus?: "ACTIVE" | "SUSPENDED";
  verifications?: {
    email?: { status?: string };
    phone?: { status?: string };
    id?: { status?: string };
  };
  createdAt?: string;
  updatedAt?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"ALL" | AdminUser["role"]>("ALL");
  const [status, setStatus] = useState<"ALL" | "ACTIVE" | "SUSPENDED">("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", { cache: "no-store" });
      const json = (await res.json()) as { users?: AdminUser[] };
      setUsers(Array.isArray(json.users) ? json.users : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchesQuery =
        q === ""
          ? true
          : String(u.name ?? "").toLowerCase().includes(q) ||
            String(u.email ?? "").toLowerCase().includes(q) ||
            String(u.id ?? "").toLowerCase().includes(q);
      const matchesRole = role === "ALL" ? true : u.role === role;
      const uStatus = u.adminStatus ?? "ACTIVE";
      const matchesStatus = status === "ALL" ? true : uStatus === status;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [query, role, status, users]);

  const toggleSuspend = async (u: AdminUser) => {
    const nextStatus: "ACTIVE" | "SUSPENDED" = (u.adminStatus ?? "ACTIVE") === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    setUpdatingId(u.id);
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(String(u.id))}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminStatus: nextStatus }),
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
          <div className="text-3xl font-display font-bold text-slate-900">Users</div>
          <div className="text-sm text-slate-500 mt-1">View users, verify status, and suspend accounts.</div>
        </div>
        <button
          type="button"
          onClick={load}
          className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-800 font-bold hover:bg-brand-50 hover:text-brand-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Search</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, id..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-300 font-semibold text-slate-900"
            />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Role</div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white font-semibold text-slate-900"
            >
              <option value="ALL">All roles</option>
              <option value="admin">Admin</option>
              <option value="lister">Lister</option>
              <option value="renter">Renter</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Status</div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white font-semibold text-slate-900"
            >
              <option value="ALL">All</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-500">{loading ? "Loading..." : `${filtered.length} result(s)`}</div>

      <div className="mt-4 space-y-3">
        {filtered.map((u) => {
          const emailStatus = u.verifications?.email?.status ?? "UNVERIFIED";
          const phoneStatus = u.verifications?.phone?.status ?? "UNVERIFIED";
          const idStatus = u.verifications?.id?.status ?? "UNVERIFIED";
          const uStatus = u.adminStatus ?? "ACTIVE";
          const updating = updatingId === u.id;
          return (
            <div key={u.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    {u.role.toUpperCase()}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                      uStatus === "SUSPENDED"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    {uStatus}
                  </span>
                </div>
                <div className="mt-2 font-bold text-slate-900 line-clamp-1">{u.name}</div>
                <div className="text-xs text-slate-500 mt-1 line-clamp-1">{u.email}</div>
                <div className="text-xs text-slate-500 mt-1">ID: {u.id}</div>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    Email {emailStatus}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    Phone {phoneStatus}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    ID {idStatus}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  disabled={updating || u.role === "admin"}
                  onClick={() => toggleSuspend(u)}
                  className={`px-4 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 ${
                    (u.adminStatus ?? "ACTIVE") === "SUSPENDED"
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                  }`}
                >
                  {(u.adminStatus ?? "ACTIVE") === "SUSPENDED" ? "Unsuspend" : "Suspend"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

