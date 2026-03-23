"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/context/MessageContext";
import { MobileBottomNav, MobileMenuDrawer, NotificationDropdown } from "@/components/mobile";

export default function HostingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { unreadCount, conversations, refreshConversations } = useMessages();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (user && (user.role === 'lister' || user.role === 'both')) {
      setIsAuthorized(true);
      return;
    }

    if (user && user.role === 'renter') {
      router.replace("/auth/signup?redirect=/listings/create");
      return;
    }

    router.replace("/auth/signup?redirect=/listings/create");
  }, [user, isLoading, router]);

  // Refresh conversations on mount
  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-dropdown') && !target.closest('.notification-button')) {
        setNotificationsOpen(false);
      }
    };

    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [notificationsOpen]);

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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar - Hidden on Mobile, Visible on Larger Screens */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-white/95 backdrop-blur-md border-r border-slate-200/50 transition-all duration-300 z-40 flex-col hidden lg:flex ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100/50">
          {sidebarOpen && (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/30">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="font-display font-bold text-lg text-brand-dark">GIGS</span>
            </Link>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
          >
            <i className={`ph-bold ph-caret-left transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`}></i>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 flex-1">
          <Link
            href="/hosting"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-brand-50 text-brand-600 transition-all"
          >
            <i className="ph-bold ph-squares-four text-xl"></i>
            {sidebarOpen && <span className="font-semibold text-sm">Dashboard</span>}
          </Link>
          <Link
            href="/hosting/calendar"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-brand-600 transition-all"
          >
            <i className="ph-bold ph-calendar text-xl"></i>
            {sidebarOpen && <span className="font-medium text-sm">Calendar</span>}
          </Link>
          <Link
            href="/hosting/listings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-brand-600 transition-all"
          >
            <i className="ph-bold ph-buildings text-xl"></i>
            {sidebarOpen && <span className="font-medium text-sm">My Listings</span>}
          </Link>
          <Link
            href="/hosting/messages"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-brand-600 transition-all"
          >
            <i className="ph-bold ph-chat-circle text-xl"></i>
            {sidebarOpen && <span className="font-medium text-sm">Messages</span>}
          </Link>
          <Link
            href="/hosting/reviews"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-brand-600 transition-all"
          >
            <i className="ph-bold ph-star text-xl"></i>
            {sidebarOpen && <span className="font-medium text-sm">Reviews</span>}
          </Link>
          <Link
            href="/hosting/earnings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-brand-600 transition-all"
          >
            <i className="ph-bold ph-currency-dollar text-xl"></i>
            {sidebarOpen && <span className="font-medium text-sm">Earnings</span>}
          </Link>
          <Link
            href="/hosting/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-brand-600 transition-all"
          >
            <i className="ph-bold ph-gear text-xl"></i>
            {sidebarOpen && <span className="font-medium text-sm">Settings</span>}
          </Link>
        </nav>

        {/* User Profile at Bottom */}
        <div className="p-3 border-t border-slate-100/50">
          <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 transition-all cursor-pointer ${!sidebarOpen ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-brand-500/30">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-700 truncate">{user?.name || 'Host'}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col transition-all duration-300 mb-20 lg:mb-0 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Header - Static */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1">
            <div>
              <h1 className="font-display font-semibold text-base md:text-lg text-slate-800">Host Dashboard</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Manage your rentals and bookings</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="notification-button w-9 md:w-10 h-9 md:h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors relative flex-shrink-0"
              >
                <i className="ph-bold ph-bell text-slate-500 text-base md:text-lg"></i>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              <NotificationDropdown 
                isOpen={notificationsOpen} 
                onClose={() => setNotificationsOpen(false)} 
              />
            </div>

            {/* Switch to Finder Button */}
            <button 
              onClick={() => {
                router.push('/listings');
              }}
              className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-100 text-slate-700 rounded-lg md:rounded-xl font-medium text-xs md:text-sm hover:bg-slate-200 transition-colors flex-shrink-0"
            >
              <i className="ph-bold ph-magnifying-glass"></i>
              <span className="hidden md:inline">Switch to Finder</span>
            </button>

            <Link 
              href="/listings/create"
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-brand-500 text-white rounded-lg md:rounded-xl font-medium text-xs md:text-sm hover:bg-brand-600 transition-colors flex-shrink-0"
            >
              <i className="ph-bold ph-plus"></i>
              <span className="hidden sm:inline">Add Listing</span>
            </Link>
          </div>
        </header>

        {/* Page Content - Rendered as children */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Navigation */}
      <MobileBottomNav 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />

      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </div>
  );
}
