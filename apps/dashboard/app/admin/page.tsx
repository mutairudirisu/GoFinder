"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Listing } from "@/types/listing";
import {
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  UserCog,
  Home,
  ShieldOff,
  Loader2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "lister" | "renter" | "both" | "admin";
  adminStatus?: "ACTIVE" | "SUSPENDED";
  createdAt?: string;
};

const COLORS = {
  verified: "#10b981",
  pending: "#f59e0b",
  inactive: "#64748b",
  rejected: "#ef4444",
  inProgress: "#3b82f6",
  booked: "#8b5cf6",
  lister: "#3b82f6",
  renter: "#10b981",
  both: "#f59e0b",
  admin: "#8b5cf6",
};

const STATUS_LABELS: Record<string, string> = {
  VERIFIED: "Verified",
  IN_PROGRESS: "In Progress",
  ACTION_REQUIRED: "Action Required",
  INACTIVE: "Inactive",
  REJECTED: "Rejected",
  BOOKED: "Booked",
};

const ROLE_LABELS: Record<string, string> = {
  lister: "Landlords",
  renter: "Tenants",
  both: "Both",
  admin: "Admin",
};

interface ChartDataPoint {
  name: string;
  value: number;
}

interface MonthlyDataPoint {
  month: string;
  listings: number;
  users: number;
}

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
        const listingsJson = (await listingsRes.json()) as {
          listings?: Listing[];
        };
        const usersJson = (await usersRes.json()) as { users?: AdminUser[] };
        setListings(
          Array.isArray(listingsJson.listings) ? listingsJson.listings : [],
        );
        setUsers(Array.isArray(usersJson.users) ? usersJson.users : []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const metrics = useMemo(() => {
    const totalListings = listings.length;
    const verifiedListings = listings.filter(
      (l) => l.status === "VERIFIED",
    ).length;
    const pendingListings = listings.filter(
      (l) => l.status === "IN_PROGRESS" || l.status === "ACTION_REQUIRED",
    ).length;
    const inactiveListings = listings.filter(
      (l) => l.status === "INACTIVE" || l.status === "REJECTED",
    ).length;
    const bookedListings = listings.filter((l) => l.status === "BOOKED").length;

    const totalUsers = users.length;
    const suspendedUsers = users.filter(
      (u) => u.adminStatus === "SUSPENDED",
    ).length;
    const landlords = users.filter(
      (u) => u.role === "lister" || u.role === "both",
    ).length;
    const tenants = users.filter(
      (u) => u.role === "renter" || u.role === "both",
    ).length;
    const admins = users.filter((u) => u.role === "admin").length;

    return {
      totalListings,
      verifiedListings,
      pendingListings,
      inactiveListings,
      bookedListings,
      totalUsers,
      suspendedUsers,
      landlords,
      tenants,
      admins,
    };
  }, [listings, users]);

  const listingsByStatus = useMemo((): ChartDataPoint[] => {
    const counts: Record<string, number> = {};
    listings.forEach((listing) => {
      const status = STATUS_LABELS[listing.status] || listing.status;
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [listings]);

  const usersByRole = useMemo((): ChartDataPoint[] => {
    const counts: Record<string, number> = {};
    users.forEach((user) => {
      const role = ROLE_LABELS[user.role] || user.role;
      counts[role] = (counts[role] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [users]);

  const monthlyData = useMemo((): MonthlyDataPoint[] => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYear = new Date().getFullYear();

    const listingsByMonth: Record<string, number> = {};
    const usersByMonth: Record<string, number> = {};

    months.forEach((month) => {
      listingsByMonth[month] = 0;
      usersByMonth[month] = 0;
    });

    listings.forEach((listing) => {
      if (listing.createdAt) {
        const date = new Date(listing.createdAt);
        if (date.getFullYear() === currentYear) {
          const monthIndex = date.getMonth();
          if (monthIndex >= 0 && monthIndex < 12) {
            const month = months[monthIndex]!;
            listingsByMonth[month] = (listingsByMonth[month] || 0) + 1;
          }
        }
      }
    });

    users.forEach((user) => {
      if (user.createdAt) {
        const date = new Date(user.createdAt);
        if (date.getFullYear() === currentYear) {
          const monthIndex = date.getMonth();
          if (monthIndex >= 0 && monthIndex < 12) {
            const month = months[monthIndex]!;
            usersByMonth[month] = (usersByMonth[month] || 0) + 1;
          }
        }
      }
    });

    return months.map((month) => ({
      month,
      listings: listingsByMonth[month] || 0,
      users: usersByMonth[month] || 0,
    }));
  }, [listings, users]);

  const getStatusColor = (status: string): string => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("verified")) return COLORS.verified;
    if (statusLower.includes("progress")) return COLORS.inProgress;
    if (statusLower.includes("action")) return COLORS.pending;
    if (statusLower.includes("inactive")) return COLORS.inactive;
    if (statusLower.includes("rejected")) return COLORS.rejected;
    if (statusLower.includes("booked")) return COLORS.booked;
    return COLORS.pending;
  };

  const getRoleColor = (role: string): string => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes("landlord")) return COLORS.lister;
    if (roleLower.includes("tenant")) return COLORS.renter;
    if (roleLower.includes("both")) return COLORS.both;
    if (roleLower.includes("admin")) return COLORS.admin;
    return COLORS.lister;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
        <div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            Overview
          </div>
          <div className="text-xs sm:text-sm text-slate-500 mt-1">
            Platform health and quick actions.
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto flex-col xs:flex-row">
          <Link
            href="/admin/listings"
            className="w-full xs:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm sm:text-base hover:bg-slate-800 transition-colors text-center"
          >
            Review listings
          </Link>
          <Link
            href="/admin/users"
            className="w-full xs:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-slate-200 text-slate-800 font-bold text-sm sm:text-base hover:bg-brand-50 hover:text-brand-700 transition-colors text-center"
          >
            Manage users
          </Link>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-3 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Listings
            </div>
            <div className="p-1.5 sm:p-2 bg-brand-50 rounded-lg">
              <Building2 size={16} className="text-brand-600" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-display font-bold text-slate-900">
            {metrics.totalListings}
          </div>
          <div className="text-xs text-slate-500 mt-1">Total</div>
        </div>
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-3 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Verified
            </div>
            <div className="p-1.5 sm:p-2 bg-emerald-50 rounded-lg">
              <CheckCircle2 size={16} className="text-emerald-600" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-display font-bold text-slate-900">
            {metrics.verifiedListings}
          </div>
          <div className="text-xs text-slate-500 mt-1">Published</div>
        </div>
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-3 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Pending
            </div>
            <div className="p-1.5 sm:p-2 bg-amber-50 rounded-lg">
              <Clock size={16} className="text-amber-600" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-display font-bold text-slate-900">
            {metrics.pendingListings}
          </div>
          <div className="text-xs text-slate-500 mt-1">Needs review</div>
        </div>
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-3 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Booked
            </div>
            <div className="p-1.5 sm:p-2 bg-violet-50 rounded-lg">
              <TrendingDown size={16} className="text-violet-600" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-display font-bold text-slate-900">
            {metrics.bookedListings}
          </div>
          <div className="text-xs text-slate-500 mt-1">Active rentals</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-3 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Users
            </div>
            <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg">
              <Users size={16} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-display font-bold text-slate-900">
            {metrics.totalUsers}
          </div>
          <div className="text-xs text-slate-500 mt-1">Total</div>
        </div>
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-3 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Landlords
            </div>
            <div className="p-1.5 sm:p-2 bg-indigo-50 rounded-lg">
              <Home size={16} className="text-indigo-600" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-display font-bold text-slate-900">
            {metrics.landlords}
          </div>
          <div className="text-xs text-slate-500 mt-1">Lister / both</div>
        </div>
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-3 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Tenants
            </div>
            <div className="p-1.5 sm:p-2 bg-emerald-50 rounded-lg">
              <UserCog size={16} className="text-emerald-600" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-display font-bold text-slate-900">
            {metrics.tenants}
          </div>
          <div className="text-xs text-slate-500 mt-1">Renter / both</div>
        </div>
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-3 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Suspended
            </div>
            <div className="p-1.5 sm:p-2 bg-red-50 rounded-lg">
              <ShieldOff size={16} className="text-red-600" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-display font-bold text-slate-900">
            {metrics.suspendedUsers}
          </div>
          <div className="text-xs text-slate-500 mt-1">Users</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Monthly Growth
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Listings and users by month
              </p>
            </div>
            <div className="p-1.5 sm:p-2 bg-brand-50 rounded-lg">
              <TrendingUp size={18} className="text-brand-600" />
            </div>
          </div>
          <div className="h-48 sm:h-64">
            {monthlyData.some((d) => d.listings > 0 || d.users > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11 }}
                    stroke="#64748b"
                  />
                  <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="listings"
                    name="Listings"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="users"
                    name="Users"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No data available for this year
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                User Distribution
              </h3>
              <p className="text-xs text-slate-500 mt-1">Users by role</p>
            </div>
            <div className="p-1.5 sm:p-2 bg-violet-50 rounded-lg">
              <Users size={18} className="text-violet-600" />
            </div>
          </div>
          <div className="h-48 sm:h-64">
            {usersByRole.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usersByRole}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {usersByRole.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getRoleColor(entry.name)}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No user data available
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Listings Trend
              </h3>
              <p className="text-xs text-slate-500 mt-1">Listings over time</p>
            </div>
            <div className="p-1.5 sm:p-2 bg-emerald-50 rounded-lg">
              <TrendingUp size={18} className="text-emerald-600" />
            </div>
          </div>
          <div className="h-48 sm:h-64">
            {monthlyData.some((d) => d.listings > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11 }}
                    stroke="#64748b"
                  />
                  <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="listings"
                    name="Listings"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No listing data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Listing Status
              </h3>
              <p className="text-xs text-slate-500 mt-1">Breakdown by status</p>
            </div>
            <div className="p-1.5 sm:p-2 bg-amber-50 rounded-lg">
              <Building2 size={18} className="text-amber-600" />
            </div>
          </div>
          <div className="h-48 sm:h-64">
            {listingsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={listingsByStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {listingsByStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getStatusColor(entry.name)}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No listing data available
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/listings"
          className="bg-white rounded-2xl border border-slate-200 p-6 hover:bg-brand-50 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-bold text-slate-900">
                Listing moderation
              </div>
              <div className="text-sm text-slate-600 mt-1">
                Approve, reject, and manage listing status.
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <i className="ph-bold ph-buildings text-xl"></i>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/users"
          className="bg-white rounded-2xl border border-slate-200 p-6 hover:bg-brand-50 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-bold text-slate-900">
                User management
              </div>
              <div className="text-sm text-slate-600 mt-1">
                Suspend accounts and review verification status.
              </div>
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
