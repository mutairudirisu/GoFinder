"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/user/profile", label: "About me", icon: "ph-user" },
  { href: "/user/bookings", label: "Past trips", icon: "ph-suitcase-rolling" },
  { href: "/user/connections", label: "Connections", icon: "ph-users-three" },
];

export default function UserProfileSidebar() {
  const pathname = usePathname();

  return (
    <div className="py-2">
      {/* Navigation Items */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                isActive
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 font-normal"
              }`}
            >
              <i className={`ph-bold ${item.icon} text-xl`}></i>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
