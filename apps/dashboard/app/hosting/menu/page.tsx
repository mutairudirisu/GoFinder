"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function HostingMenuPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="text-3xl font-display font-bold text-slate-900">Menu</div>
        <div className="flex items-center gap-2">
          <Link
            href="/hosting/bookings"
            className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-700"
            aria-label="Notifications"
          >
            <i className="ph-bold ph-bell text-lg"></i>
          </Link>
          <Link
            href="/hosting/profile"
            className="w-11 h-11 rounded-full bg-brand-500 hover:bg-brand-600 transition-colors flex items-center justify-center text-white font-bold"
            aria-label="Profile"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : <i className="ph-bold ph-user text-lg"></i>}
          </Link>
        </div>
      </div>

      <div className="mt-6 bg-[#F4F1EC] rounded-[28px] p-6 border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xl font-display font-bold text-slate-900">New to hosting?</div>
            <div className="text-sm text-slate-600 mt-2 max-w-md">
              Discover tips and best practices shared by top-rated hosts.
            </div>
            <button
              type="button"
              className="mt-5 px-6 py-3 rounded-2xl bg-white text-slate-900 font-bold border border-white/60 hover:bg-white/80 transition-colors"
            >
              Get started
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-20 h-16 rounded-2xl bg-white/70 border border-white/60" />
            <div className="w-20 h-16 rounded-2xl bg-white/70 border border-white/60" />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-[28px] border border-slate-200 overflow-hidden">
        {[
          { label: "Account settings", icon: "ph-bold ph-gear", href: "/hosting/settings" },
          { label: "Calendar", icon: "ph-bold ph-calendar", href: "/hosting/calendar" },
          { label: "Bookings", icon: "ph-bold ph-suitcase", href: "/hosting/bookings" },
          { label: "Listings", icon: "ph-bold ph-storefront", href: "/hosting/listings" },
          { label: "Messages", icon: "ph-bold ph-chats", href: "/hosting/messages" },
          { label: "Profile", icon: "ph-bold ph-user", href: "/hosting/profile" },
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

        <div className="px-6 py-5">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
          >
            <i className="ph-bold ph-magnifying-glass"></i>
            Switch to traveling
          </Link>
        </div>
      </div>
    </div>
  );
}

