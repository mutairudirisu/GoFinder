"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useSidebarCollapse } from "@/context/SidebarCollapseContext";

export default function AdminSideNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isCollapsed, setIsCollapsed } = useSidebarCollapse();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const isActiveLink = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const navItems = [
    { label: "Overview", icon: "ph-chart-pie-slice", href: "/admin" },
    { label: "Listings", icon: "ph-buildings", href: "/admin/listings" },
    { label: "Users", icon: "ph-users-three", href: "/admin/users" },
    { label: "Newsletters", icon: "ph-envelope", href: "/admin/newsletters" },
    { label: "Locations", icon: "ph-map-pin", href: "/admin/locations" },
    { label: "Reports", icon: "ph-warning-circle", href: "/admin/reports" },
    { label: "Settings", icon: "ph-gear", href: "/admin/settings" },
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 z-40 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="px-4 py-6 border-b border-slate-200 flex items-center justify-between">
        {!isCollapsed ? (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
              <i className="ph-bold ph-shield-check text-white text-lg"></i>
            </div>
            <span className="font-display font-bold text-slate-800">GIGS Admin</span>
          </Link>
        ) : (
          <div className="relative group w-full flex justify-center">
            <Link href="/admin">
              <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                <i className="ph-bold ph-shield-check text-white text-lg"></i>
              </div>
            </Link>
            <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
              Admin
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all flex-shrink-0"
        >
          <i className={`ph-bold ph-caret-left transition-transform ${isCollapsed ? "rotate-180" : ""}`}></i>
        </button>
      </div>

      <nav className={`flex-1 px-2 py-6 space-y-2 ${isCollapsed ? "overflow-visible" : "overflow-y-auto"}`}>
        {navItems.map((item) => (
          <div key={item.href} className="relative group">
            <Link
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                isActiveLink(item.href)
                  ? "bg-brand-50 text-brand-600 font-medium border-l-4 border-brand-500"
                  : "text-slate-600 hover:bg-slate-50"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <i className={`ph-bold ${item.icon} text-xl flex-shrink-0`}></i>
              {!isCollapsed ? <span>{item.label}</span> : null}
            </Link>
            {isCollapsed ? (
              <div className="absolute left-full ml-3 -mt-10 px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                {item.label}
              </div>
            ) : null}
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-2 space-y-2">
        <Link
          href="/admin"
          className={`px-4 py-3 bg-slate-50 hover:bg-brand-50 rounded-lg flex items-center gap-3 transition-colors cursor-pointer ${
            isCollapsed ? "justify-center" : ""
          } ${isActiveLink("/admin") ? "bg-brand-50 border border-brand-200" : ""}`}
        >
          <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            {user?.name?.charAt(0) || "A"}
          </div>
          {!isCollapsed ? (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{user?.name || "Admin"}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || ""}</p>
            </div>
          ) : null}
        </Link>

        <div className="relative group">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-sm ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <i className="ph-bold ph-sign-out text-xl flex-shrink-0"></i>
            {!isCollapsed ? <span>Log out</span> : null}
          </button>
          {isCollapsed ? (
            <div className="absolute left-full ml-3 -mt-10 px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
              Log out
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

