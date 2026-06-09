"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SidebarCollapseProvider, useSidebarCollapse } from "@/context/SidebarCollapseContext";
import { useAuth } from "@/context/AuthContext";
import AdminSideNav from "@/components/admin/AdminSideNav";
import { useAutoHideOnScroll } from "@/hooks/useAutoHideOnScroll";
import { BottomTabNav } from "@/components/mobile/BottomTabNav";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const { isCollapsed } = useSidebarCollapse();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { hidden: mobileNavHidden } = useAutoHideOnScroll({
    mode: "element",
    enabled: !isLoading && isAuthorized,
    elementRef: scrollContainerRef,
  });

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }
    const isAdmin = user.role === "admin" || String(user.email ?? "").toLowerCase() === "admin@gigs.app";
    if (!isAdmin) {
      router.push("/user");
      return;
    }
    if (user.adminStatus === "SUSPENDED") {
      router.push("/auth/login");
      return;
    }
    setIsAuthorized(true);
  }, [isLoading, router, user]);

  const isActiveSection = (baseHref: string) => pathname === baseHref || pathname.startsWith(`${baseHref}/`);

  if (isLoading || !isAuthorized) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-slate-800">Loading Admin</h2>
        </div>
      </main>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="hidden md:block">
        <AdminSideNav />
      </div>

      <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ml-0 ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}>
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1">
            <div>
              <h1 className="font-display font-semibold text-base md:text-lg text-slate-800">Admin dashboard</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Manage listings, users, and platform settings</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                try {
                  // Clear any admin-related data
                  localStorage.removeItem('adminSessionId');
                  localStorage.removeItem('adminToken');
                  sessionStorage.clear();
                } catch (e) {
                  console.error('Error clearing session:', e);
                }
                
                // Navigate to web app
                const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3001';
                window.location.href = webUrl;
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-brand-50 hover:text-brand-700 transition-colors"
            >
              View site
            </button>
          </div>
        </header>

        <div ref={scrollContainerRef} className="flex-1 p-4 md:p-6 overflow-y-auto pb-24 md:pb-6">
          {children}
        </div>
      </main>

      <BottomTabNav
        hidden={mobileNavHidden}
        items={[
          {
            key: "overview",
            href: "/admin",
            label: "Overview",
            iconClassName: "ph-bold ph-chart-pie-slice text-xl",
            isActive: isActiveSection("/admin") && !isActiveSection("/admin/listings") && !isActiveSection("/admin/users") && !isActiveSection("/admin/menu"),
          },
          {
            key: "listings",
            href: "/admin/listings",
            label: "Listings",
            iconClassName: "ph-bold ph-buildings text-xl",
            isActive: isActiveSection("/admin/listings"),
          },
          {
            key: "users",
            href: "/admin/users",
            label: "Users",
            iconClassName: "ph-bold ph-users-three text-xl",
            isActive: isActiveSection("/admin/users"),
          },
          {
            key: "menu",
            href: "/admin/menu",
            label: "Menu",
            iconClassName: "ph-bold ph-list text-xl",
            isActive: isActiveSection("/admin/menu"),
          },
        ]}
      />
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarCollapseProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SidebarCollapseProvider>
  );
}
