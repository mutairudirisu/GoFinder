"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/context/MessageContext";
import { mockProperties } from "@/app/listings/data";

type ListingType = "experience" | "accommodation" | "services";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout, switchRole } = useAuth();
  const { unreadCount } = useMessages();
  const router = useRouter();

  // Determine user role state
  const isAuthenticated = !!user;
  const isLister = user?.role === 'lister' || user?.role === 'both';
  const isRenter = user?.role === 'renter' || user?.role === 'both';

  // Handle role switching
  const handleSwitchToLister = () => {
    if (user?.role === 'both') {
      switchRole('lister');
      router.push('/hosting');
    } else if (user?.role === 'renter') {
      switchRole('lister');
      router.push('/listings/create');
    }
  };

  const handleSwitchToViewer = () => {
    if (user?.role === 'both') {
      switchRole('renter');
      router.push('/listings');
    } else if (user?.role === 'lister') {
      switchRole('renter');
      router.push('/listings');
    }
  };

  // Load saved count from localStorage
  useEffect(() => {
    const updateSavedCount = () => {
      const savedLikes = localStorage.getItem('gigs_liked_properties');
      if (savedLikes) {
        const likedIds = JSON.parse(savedLikes);
        setSavedCount(likedIds.length);
      } else {
        setSavedCount(0);
      }
    };

    updateSavedCount();

    // Listen for updates to likes
    window.addEventListener('likesUpdated', updateSavedCount);
    return () => window.removeEventListener('likesUpdated', updateSavedCount);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleListProperty = (type: ListingType) => {
    // Navigate based on category type
    if (type === 'experience') {
      if (user) {
        window.location.href = `/listings/create?category=experience`;
      } else {
        window.location.href = `/auth/signup?redirect=/listings/create?category=experience`;
      }
    } else if (type === 'services') {
      if (user) {
        window.location.href = `/listings/create?category=services`;
      } else {
        window.location.href = `/auth/signup?redirect=/listings/create?category=services`;
      }
    } else {
      // Default to accommodation
      if (user) {
        window.location.href = `/listings/create`;
      } else {
        window.location.href = `/auth/signup?redirect=/listings/create`;
      }
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push("/listings");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/listings" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-8 sm:w-9 h-8 sm:h-9 bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="ph-bold ph-house-line text-base sm:text-lg text-white"></i>
          </div>
          <span className="font-display font-bold text-lg sm:text-xl text-brand-dark hidden sm:inline-block">
            GIGS<span className="text-brand-500">Rentals</span>
          </span>
        </Link>

        {/* User Menu */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* === GUEST STATE === */}
          {!isAuthenticated && (
            /* No additional buttons - just hamburger menu */
            null
          )}

          {/* === AUTHENTICATED STATE === */}
          {isAuthenticated && (
            <>
              {/* Hosting Dashboard Button - visible when authenticated */}
              <button 
                onClick={() => router.push('/hosting')}
                className="hidden md:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-brand-500 text-brand-600 font-semibold hover:bg-brand-50 transition-all duration-200 text-xs sm:text-sm"
              >
                <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full flex items-center justify-center bg-brand-100">
                  <i className="ph-bold ph-house-line text-brand-600 text-xs sm:text-sm"></i>
                </div>
                <span>Hosting</span>
              </button>

              {/* Saved/Favorites Button - shown when authenticated */}
              <Link href="/listings/saved" className="relative flex items-center justify-center w-7 sm:w-9 h-7 sm:h-9 rounded-full hover:bg-slate-100 transition-colors flex-shrink-0">
                <i className="ph ph-heart text-lg sm:text-xl text-slate-600"></i>
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 sm:w-5 h-4 sm:h-5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {savedCount > 9 ? '9+' : savedCount}
                  </span>
                )}
              </Link>

              {/* Profile Avatar */}
              <Link href="/profile" className="flex items-center flex-shrink-0">
                <div className="w-7 sm:w-9 h-7 sm:h-9 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold hover:bg-brand-600 transition-colors text-xs sm:text-sm">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
              </Link>
            </>
          )}

          {/* Hamburger Menu - Always visible */}

          {/* Hamburger Menu with Dropdown */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-1 py-1 rounded-full hover:bg-slate-100 transition-colors flex-shrink-0"
            >
              <i className="ph-bold ph-list text-lg sm:text-xl text-slate-600"></i>
            </button>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-brand-100 overflow-hidden"
                >
                  {/* Menu Sections */}
                  <div className="py-2">
                    {isAuthenticated ? (
                      // === AUTHENTICATED USER MENU ===
                      <>
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-brand-100 bg-brand-50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold">
                              {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-brand-dark">{user?.name || 'User'}</p>
                              <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* === VIEWER/RENTER STATE === */}
                        {isRenter && !isLister && (
                          <div className="py-2">
                            <Link
                              href="/listings/saved"
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                            >
                              <i className="ph ph-heart text-xl text-brand-500"></i>
                              <span className="font-medium text-brand-700">Saved Listings</span>
                            </Link>
                            <Link
                              href="/messages"
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                            >
                              <i className="ph ph-chat-circle-dots text-xl text-brand-500"></i>
                              <span className="font-medium text-brand-700">Messages</span>
                              {unreadCount > 0 && (
                                <span className="ml-auto bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                  {unreadCount}
                                </span>
                              )}
                            </Link>
                            <Link
                              href="/profile"
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                            >
                              <i className="ph ph-user text-xl text-brand-500"></i>
                              <span className="font-medium text-brand-700">Profile</span>
                            </Link>
                            
                            {/* Switch to Lister */}
                            <button
                              onClick={() => {
                                handleSwitchToLister();
                                setIsMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                            >
                              <i className="ph ph-house-line text-xl text-brand-500"></i>
                              <span className="font-medium text-brand-700">Switch to Lister</span>
                            </button>
                          </div>
                        )}

                        {/* === LISTER/HOST STATE === */}
                        {isLister && (
                          <div className="py-2">
                            <Link
                              href="/hosting/listings"
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                            >
                              <i className="ph ph-buildings text-xl text-brand-500"></i>
                              <span className="font-medium text-brand-700">My Properties</span>
                            </Link>
                            <Link
                              href="/hosting"
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                            >
                              <i className="ph ph-calendar-check text-xl text-brand-500"></i>
                              <span className="font-medium text-brand-700">Reservations</span>
                            </Link>
                            <Link
                              href="/hosting/messages"
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                            >
                              <i className="ph ph-chat-circle-dots text-xl text-brand-500"></i>
                              <span className="font-medium text-brand-700">Messages</span>
                              {unreadCount > 0 && (
                                <span className="ml-auto bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                  {unreadCount}
                                </span>
                              )}
                            </Link>
                            <Link
                              href="/hosting/earnings"
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                            >
                              <i className="ph ph-currency-dollar text-xl text-brand-500"></i>
                              <span className="font-medium text-brand-700">Earnings</span>
                            </Link>
                            <Link
                              href="/hosting/settings"
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                            >
                              <i className="ph ph-user-gear text-xl text-brand-500"></i>
                              <span className="font-medium text-brand-700">Settings</span>
                            </Link>
                            
                            {/* Switch to Viewer (only if user has both roles) */}
                            {user?.role === 'both' && (
                              <button
                                onClick={() => {
                                  handleSwitchToViewer();
                                  setIsMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                              >
                                <i className="ph ph-eye text-xl text-brand-500"></i>
                                <span className="font-medium text-brand-700">Switch to Viewer</span>
                              </button>
                            )}
                          </div>
                        )}

                        {/* Divider */}
                        <div className="border-t border-brand-100 my-2"></div>

                        {/* Logout */}
                        <div className="py-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                          >
                            <i className="ph ph-sign-out text-xl text-red-500"></i>
                            <span className="font-medium text-red-600">Log out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      // === GUEST STATE ===
                      <>
                        {/* Sign Up / Log in */}
                        <div className="px-4 py-3 border-b border-brand-100">
                          <div className="space-y-2">
                            <Link
                              href="/auth/signup"
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center justify-between px-4 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors"
                            >
                              <span>Sign Up</span>
                              <i className="ph-bold ph-arrow-right"></i>
                            </Link>
                            <Link
                              href="/auth/login"
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center justify-between px-4 py-3 border-2 border-brand-200 rounded-xl font-bold text-brand-600 hover:bg-brand-50 transition-colors"
                            >
                              <span>Log in</span>
                              <i className="ph-bold ph-arrow-right"></i>
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
