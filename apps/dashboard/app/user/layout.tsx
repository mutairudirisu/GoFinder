"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/context/MessageContext";
import { SidebarCollapseProvider, useSidebarCollapse } from "@/context/SidebarCollapseContext";
import UserSideNav from "@/components/user/UserSideNav";
import UserMenu from "@/components/user/UserMenu";
import { useAutoHideOnScroll } from "@/hooks/useAutoHideOnScroll";
import { BottomTabNav } from "@/components/mobile/BottomTabNav";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarCollapseProvider>
      <UserDashboardLayoutContent>{children}</UserDashboardLayoutContent>
    </SidebarCollapseProvider>
  );
}

function UserDashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated, switchRole } = useAuth();
  const { unreadCount, refreshConversations } = useMessages();
  const { isCollapsed } = useSidebarCollapse();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isEditProfilePage = pathname === "/user/profile/edit";
  const { hidden: mobileNavHidden } = useAutoHideOnScroll({
    mode: "element",
    enabled: !isLoading && isAuthenticated && !isEditProfilePage,
    elementRef: scrollContainerRef,
  });

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/auth/login?redirect=/user/profile");
    } else {
      // Set default mode for user section
      const currentMode = localStorage.getItem('gigs_current_mode');
      if (!currentMode || currentMode === 'host') {
        localStorage.setItem('gigs_current_mode', 'guest');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Refresh conversations on mount
  useEffect(() => {
    if (isAuthenticated) {
      refreshConversations();
    }
  }, [refreshConversations, isAuthenticated]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) return null;

  // For full-page edit experience, skip the dashboard layout
  if (isEditProfilePage) {
    return <>{children}</>;
  }

  const isActiveSection = (baseHref: string) => pathname === baseHref || pathname.startsWith(`${baseHref}/`);
  const isProfileRoute =
    pathname === "/user" ||
    pathname.startsWith("/user/profile") ||
    pathname.startsWith("/user/settings") ||
    pathname.startsWith("/user/notifications") ||
    pathname.startsWith("/user/messages");

  const isMessagesPage = pathname.startsWith("/user/messages");

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="hidden md:block">
        <UserSideNav />
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
              <h1 className="font-display font-semibold text-base md:text-lg text-slate-800">Hi, {user?.name || 'there'}! 👋</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Manage your profile and bookings</p>
            </div>
          </div>

          <div className="flex items-center gap-2" />

          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative">
              <Link
                href="/user/notifications"
                className="w-9 md:w-10 h-9 md:h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors relative flex-shrink-0"
              >
                <i className="ph-bold ph-bell text-slate-500 text-base md:text-lg"></i>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Switch to Host Button */}
            <button 
              onClick={async () => {
                await switchRole('lister');
                localStorage.setItem('gigs_current_mode', 'host');
                router.push('/hosting');
              }}
              className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-100 text-slate-700 rounded-lg md:rounded-xl font-medium text-xs md:text-sm hover:bg-slate-200 transition-colors flex-shrink-0"
            >
              <i className="ph-bold ph-storefront"></i>
              <span className="hidden md:inline">Switch to host</span>
            </button>

            {/* User Avatar */}
            <Link
              href="/user/profile"
              className="w-9 md:w-10 h-9 md:h-10 bg-brand-500 hover:bg-brand-600 rounded-full flex items-center justify-center text-white text-sm md:text-base font-medium transition-colors cursor-pointer flex-shrink-0"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : <i className="ph-bold ph-user"></i>}
            </Link>

            {/* Hamburger Menu Button */}
            <button 
              onClick={() => setUserMenuOpen(true)}
              className="w-9 md:w-10 h-9 md:h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors flex-shrink-0"
            >
              <i className="ph-bold ph-list"></i>
            </button>
          </div>
        </header>

        {/* Page Content - Rendered as children */}
        <div 
          ref={scrollContainerRef} 
          className={`flex-1 overflow-y-auto min-h-0 ${isMessagesPage ? "pb-0" : "pb-24"} md:pb-6 ${isProfileRoute ? "p-0 md:p-6 lg:p-8" : "p-4 md:p-6"}`}
        >
          {children}
        </div>
      </main>

      <BottomTabNav
        zIndexClassName="z-[70]"
        hidden={mobileNavHidden || isMessagesPage}
        items={[
          { key: "explore", href: "/", label: "Explore", iconClassName: "ph-bold ph-magnifying-glass text-xl" },
          {
            key: "wishlists",
            href: "/user/favorites",
            label: "Wishlists",
            iconClassName: "ph-bold ph-heart text-xl",
            isActive: isActiveSection("/user/favorites"),
          },
          {
<<<<<<< HEAD
            key: "experiences",
            href: "/user/experiences",
            label: "Experiences",
            iconClassName: "ph-bold ph-suitcase text-xl",
            isActive: isActiveSection("/user/experiences"),
=======
            key: "trips",
            href: "/user/bookings",
            label: "Trips",
            iconClassName: "ph-bold ph-suitcase text-xl",
            isActive: isActiveSection("/user/bookings"),
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
          },
          {
            key: "messages",
            href: "/user/messages",
            label: "Messages",
            iconClassName: "ph-bold ph-chats-circle text-xl",
            isActive: isActiveSection("/user/messages"),
            badgeCount: unreadCount,
          },
          {
            key: "profile",
            href: "/user/profile",
            label: "Profile",
            iconClassName: "ph-bold ph-user text-xl",
            isActive: isProfileRoute,
          },
        ]}
      />

      {/* Mobile Bottom Tab Navigation */}
      {/* User Menu */}
      <UserMenu 
        isOpen={userMenuOpen}
        onClose={() => setUserMenuOpen(false)}
      />
    </div>
  );
}
