"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminMenuPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="text-3xl font-display font-bold text-slate-900">Menu</div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-700"
            aria-label="View site"
          >
            <i className="ph-bold ph-globe text-lg"></i>
          </Link>
          <div className="w-11 h-11 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-[28px] border border-slate-200 overflow-hidden">
        {[
          { label: "Overview", icon: "ph-bold ph-chart-pie-slice", href: "/admin" },
          { label: "Listings", icon: "ph-bold ph-buildings", href: "/admin/listings" },
          { label: "Users", icon: "ph-bold ph-users-three", href: "/admin/users" },
          { label: "Locations", icon: "ph-bold ph-map-pin", href: "/admin/locations" },
          { label: "Reports", icon: "ph-bold ph-warning-circle", href: "/admin/reports" },
          { label: "Settings", icon: "ph-bold ph-gear", href: "/admin/settings" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between gap-4 px-6 py-5 border-b border-slate-100 hover:bg-brand-50/60 transition-colors"
          >
            <span className="flex items-center gap-4">
              <span className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <i className={item.icon}></i>
              </span>
              <span className="font-bold text-slate-900">{item.label}</span>
            </span>
            <i className="ph ph-caret-right text-slate-400"></i>
          </Link>
        ))}
      </div>
    </div>
  );
}

