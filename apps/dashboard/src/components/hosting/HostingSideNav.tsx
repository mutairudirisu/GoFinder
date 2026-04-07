"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSidebarCollapse } from "@/context/SidebarCollapseContext";
import Link from "next/link";

export default function HostingSideNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isCollapsed, setIsCollapsed } = useSidebarCollapse();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  const navItems = [
    { label: "Today", icon: "ph-house-line", href: "/hosting" },
    { label: "Calendar", icon: "ph-calendar", href: "/hosting/calendar" },
    { label: "Listings", icon: "ph-storefront", href: "/hosting/listings" },
    { label: "Bookings", icon: "ph-suitcase", href: "/hosting/bookings" },
    { label: "Messages", icon: "ph-chats", href: "/hosting/messages" },
  ];

  return (
    <aside className={`bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 z-40 transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Logo Section */}
      <div className="px-4 py-6 border-b border-slate-200 flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/hosting" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
              <i className="ph-bold ph-house-line text-white text-lg"></i>
            </div>
            <span className="font-display font-bold text-slate-800">GIGS</span>
          </Link>
        )}
        {isCollapsed && (
          <div className="relative group w-full flex justify-center">
            <Link href="/hosting">
              <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
                <i className="ph-bold ph-house-line text-white text-lg"></i>
              </div>
            </Link>
            <div className="absolute left-full ml-3 px-3 py-2 bg-brand-600 text-white text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
              GIGS
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all flex-shrink-0"
        >
          <i className={`ph-bold ph-caret-left transition-transform ${isCollapsed ? 'rotate-180' : ''}`}></i>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className={`flex-1 px-2 py-6 space-y-2 ${isCollapsed ? 'overflow-visible' : 'overflow-y-auto'}`}>
        {navItems.map((item) => (
          <div key={item.href} className="relative group">
            <Link
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                isActiveLink(item.href)
                  ? "bg-brand-50 text-brand-600 font-medium border-l-4 border-brand-500"
                  : "text-slate-600 hover:bg-slate-50"
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <i className={`ph-bold ${item.icon} text-xl flex-shrink-0`}></i>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
            {isCollapsed && (
              <div className="absolute left-full ml-3 -mt-10 px-3 py-2 bg-brand-600 text-white text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                {item.label}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-200 p-2 space-y-2">
        {/* User Profile */}
        <Link
          href="/hosting/profile"
          className={`px-4 py-3 bg-slate-50 hover:bg-brand-50 rounded-lg flex items-center gap-3 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          } ${isActiveLink('/hosting/profile') ? 'bg-brand-50 border border-brand-200' : ''}`}
        >
          <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            {user?.name?.charAt(0) || "U"}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{user?.name || "User"}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || "email@example.com"}</p>
            </div>
          )}
        </Link>

        {/* Logout */}
        <div className="relative group">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-sm ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <i className="ph-bold ph-sign-out text-xl flex-shrink-0"></i>
            {!isCollapsed && <span>Log out</span>}
          </button>
          {isCollapsed && (
            <div className="absolute left-full ml-3 -mt-10 px-3 py-2 bg-brand-600 text-white text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
              Log out
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
