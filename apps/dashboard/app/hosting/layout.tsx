"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/context/MessageContext";
import { SidebarCollapseProvider, useSidebarCollapse } from "@/context/SidebarCollapseContext";
import HostingSideNav from "@/components/hosting/HostingSideNav";
import HostingMenu from "@/components/hosting/HostingMenu";
import { useAutoHideOnScroll } from "@/hooks/useAutoHideOnScroll";
import { BottomTabNav } from "@/components/mobile/BottomTabNav";

export default function HostingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarCollapseProvider>
      <HostingLayoutContent>{children}</HostingLayoutContent>
    </SidebarCollapseProvider>
  );
}

function HostingLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, switchRole } = useAuth();
  const { unreadCount, refreshConversations } = useMessages();
  const { isCollapsed } = useSidebarCollapse();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [hostingMenuOpen, setHostingMenuOpen] = useState(false);
  const [bookingUnreadCount, setBookingUnreadCount] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { hidden: mobileNavHidden } = useAutoHideOnScroll({
    mode: "element",
    enabled: !isLoading && isAuthorized,
    elementRef: scrollContainerRef,
  });

  useEffect(() => {
    if (isLoading) return;

    if (user && (user.role === 'lister' || user.role === 'both')) {
      setIsAuthorized(true);
      // Set default mode for hosting section
      const currentMode = localStorage.getItem('gigs_current_mode');
      if (!currentMode || currentMode === 'guest') {
        localStorage.setItem('gigs_current_mode', 'host');
      }
      return;
    }

    router.replace("/auth/signup?redirect=/becoming-a-host");
  }, [user, isLoading, router]);

  // Refresh conversations on mount
  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  useEffect(() => {
    if (!user?.id) return;
    const recompute = () => {
      try {
        const raw = localStorage.getItem("gigs_bookings");
        const parsed = raw ? JSON.parse(raw) : [];
        const items = Array.isArray(parsed) ? (parsed as Array<{ hostId?: string; seenByHost?: boolean }>) : [];
        const count = items.filter((b) => String(b?.hostId ?? "") === String(user.id) && !b?.seenByHost).length;
        setBookingUnreadCount(count);
      } catch {
        setBookingUnreadCount(0);
      }
    };
    recompute();
    const handler = () => recompute();
    window.addEventListener("bookingsUpdated", handler as EventListener);
    window.addEventListener("storage", handler as EventListener);
    return () => {
      window.removeEventListener("bookingsUpdated", handler as EventListener);
      window.removeEventListener("storage", handler as EventListener);
    };
  }, [user?.id]);

  if (isLoading || !isAuthorized) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading...</p>
        </div>
      </main>
    );
  }

  const isTodayRoute = pathname === "/hosting" || pathname.startsWith("/hosting/bookings");
  const isActiveSection = (baseHref: string) => pathname === baseHref || pathname.startsWith(`${baseHref}/`);
  const isMessagesPage = pathname.startsWith("/hosting/messages");

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="hidden md:block">
        <HostingSideNav />
      </div>

      {/* Main Content Area */}
      <main
        className={`flex-1 flex flex-col min-h-0 overflow-hidden transition-all duration-300 ml-0 ${
          isCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {/* Top Header - Static */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1">
            <div>
              <h1 className="font-display font-semibold text-base md:text-lg text-slate-800">Welcome back, {user?.name || 'Host'}! 👋</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Manage your listings and bookings</p>
            </div>
          </div>

          <div className="flex items-center gap-2" />

          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative">
              <Link
                href="/hosting/bookings"
                className="w-9 md:w-10 h-9 md:h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors relative flex-shrink-0"
              >
                <i className="ph-bold ph-bell text-slate-500 text-base md:text-lg"></i>
                {unreadCount + bookingUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount + bookingUnreadCount > 9 ? '9+' : unreadCount + bookingUnreadCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Switch to Finder Button */}
            <button 
              onClick={async () => {
                await switchRole('renter');
                localStorage.setItem('gigs_current_mode', 'guest');
                router.push('/');
              }}
              className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-100 text-slate-700 rounded-lg md:rounded-xl font-medium text-xs md:text-sm hover:bg-slate-200 transition-colors flex-shrink-0"
            >
              <i className="ph-bold ph-magnifying-glass"></i>
              <span className="hidden md:inline">Switch to Finder</span>
            </button>

            {/* User Avatar */}
            <Link
              href={user?.role === 'renter' ? '/user/profile' : '/hosting/profile'}
              className="w-9 md:w-10 h-9 md:h-10 bg-brand-500 hover:bg-brand-600 rounded-full flex items-center justify-center text-white text-sm md:text-base font-medium transition-colors cursor-pointer flex-shrink-0"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : <i className="ph-bold ph-user"></i>}
            </Link>

            {/* Hamburger Menu Button */}
            <button 
              onClick={() => setHostingMenuOpen(true)}
              className="w-9 md:w-10 h-9 md:h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors flex-shrink-0"
            >
              <i className="ph-bold ph-list"></i>
            </button>
          </div>
        </header>

        {/* Page Content - Rendered as children */}
        <div 
          ref={scrollContainerRef} 
          className={`flex-1 overflow-y-auto min-h-0 ${isMessagesPage ? "p-0 pb-0" : "p-4 md:p-6 pb-24"} md:pb-6`}
        >
          {children}
        </div>
      </main>

      <BottomTabNav
        hidden={mobileNavHidden || isMessagesPage}
        items={[
          { key: "today", href: "/hosting", label: "Today", iconClassName: "ph-bold ph-bookmark-simple text-xl", isActive: isTodayRoute },
          {
            key: "calendar",
            href: "/hosting/calendar",
            label: "Calendar",
            iconClassName: "ph-bold ph-calendar text-xl",
            isActive: isActiveSection("/hosting/calendar"),
          },
          {
            key: "listings",
            href: "/hosting/listings",
            label: "Listings",
            iconClassName: "ph-bold ph-squares-four text-xl",
            isActive: isActiveSection("/hosting/listings"),
          },
          {
            key: "messages",
            href: "/hosting/messages",
            label: "Messages",
            iconClassName: "ph-bold ph-chats-circle text-xl",
            isActive: isActiveSection("/hosting/messages"),
            badgeCount: unreadCount,
          },
          { key: "menu", href: "/hosting/menu", label: "Menu", iconClassName: "ph-bold ph-list text-xl", isActive: isActiveSection("/hosting/menu") },
        ]}
      />

      {/* Hosting Menu */}
      <HostingMenu 
        isOpen={hostingMenuOpen}
        onClose={() => setHostingMenuOpen(false)}
      />
    </div>
  );
}
