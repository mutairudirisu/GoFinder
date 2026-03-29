"use client";
import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useHeaderAuth } from "./useHeaderAuth";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { AuthMenu } from "./AuthMenu";
import { GuestMenu } from "./GuestMenu";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, isListerMode, logout, switchToLister } = useHeaderAuth();

  const closeMenu = () => setIsMenuOpen(false);

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

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-8 sm:w-10 h-8 sm:h-10 bg-brand-500 rounded-lg border-2 border-brand-dark flex items-center justify-center shadow-brutal-sm group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all flex-shrink-0">
            <i className="ph-bold ph-house-line text-lg sm:text-xl text-white"></i>
          </div>
          <span className="font-display font-bold text-xl sm:text-2xl md:text-3xl tracking-tight hidden sm:inline-block">
            Hostel<span className="text-brand-600">Finder</span>
          </span>
          <span className="font-display font-bold text-lg sm:hidden">
            <span className="text-brand-500">HF</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-sans font-medium">
          <Link href="/" className="relative text-brand-dark py-2 text-sm lg:text-base">
            Home
            <span className="absolute bottom-0 left-0 w-full h-1 bg-brand-500 rounded-full"></span>
          </Link>
          <Link
            href={`${DASHBOARD_URL}/listings`}
            className="text-slate-500 hover:text-brand-dark transition-colors text-sm lg:text-base"
          >
            Listings
          </Link>
          <Link
            href="/about-us"
            className="text-slate-500 hover:text-brand-dark transition-colors text-sm lg:text-base"
          >
            About Us
          </Link>
          <Link
            href="/pricing"
            className="text-slate-500 hover:text-brand-dark transition-colors text-sm lg:text-base"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className="text-slate-500 hover:text-brand-dark transition-colors text-sm lg:text-base"
          >
            Contact
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2 md:gap-4 lg:gap-6 flex-shrink-0">
          {/* Mobile: Menu Button */}
          <div className="relative md:hidden" ref={menuRef}>
            {/* Hamburger Button - Different based on auth */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-full hover:shadow-lg transition-all"
            >
              <i className="ph-bold ph-list text-xl"></i>
              {isAuthenticated ? (
                /* Authenticated: Show avatar */
                <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
              ) : (
                /* Guest: Show user icon */
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <i className="ph-bold ph-user text-lg"></i>
                </div>
              )}
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
                  {/* Authenticated User Menu */}
                  {isAuthenticated ? (
                    <>
                      {/* User Info */}
                      <div className="px-4 py-3 bg-brand-50 border-b border-brand-100">
                        <p className="font-bold text-brand-dark">{user?.name}</p>
                        <p className="text-sm text-brand-600">{user?.email}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href={`${DASHBOARD_URL}/listings/saved`}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                        >
                          <i className="ph ph-heart text-xl text-brand-500"></i>
                          <span className="font-medium text-brand-700">Saved Listings</span>
                        </Link>
                        <Link
                          href={`${DASHBOARD_URL}/messages`}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                        >
                          <i className="ph ph-chat-circle text-xl text-brand-500"></i>
                          <span className="font-medium text-brand-700">Messages</span>
                        </Link>
                        <Link
                          href={`${DASHBOARD_URL}/profile`}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                        >
                          <i className="ph ph-user-circle text-xl text-brand-500"></i>
                          <span className="font-medium text-brand-700">Profile</span>
                        </Link>

                        {/* Divider */}
                        <div className="border-t border-brand-100 my-2"></div>

                        {/* Lister Actions */}
                        <p className="px-4 py-2 text-xs text-brand-600 font-medium uppercase">Hosting</p>
                        <Link
                          href={`${DASHBOARD_URL}/listings/create`}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                        >
                          <i className="ph ph-plus-circle text-xl text-brand-500"></i>
                          <span className="font-medium text-brand-700">Create Listing</span>
                        </Link>
                        <Link
                          href={`${DASHBOARD_URL}/hosting`}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                        >
                          <i className="ph ph-building text-xl text-brand-500"></i>
                          <span className="font-medium text-brand-700">Host Dashboard</span>
                        </Link>

                        {/* Switch Role Toggle */}
                        {!isListerMode && (
                          <button
                            onClick={() => {
                              // Switch to lister role
                              const updatedUser = { ...user, role: "both" as const };
                              localStorage.setItem("gigs_user", JSON.stringify(updatedUser));
                              setUser(updatedUser);
                              setIsMenuOpen(false);
                              window.dispatchEvent(new Event("gigsAuthChange"));
                            }}
                            className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-brand-50 transition-colors"
                          >
                            <i className="ph ph-arrows-left-right text-xl text-brand-500"></i>
                            <span className="font-medium text-brand-700">Switch to Lister</span>
                          </button>
                        )}

                        {/* Divider */}
                        <div className="border-t border-brand-100 my-2"></div>

                        {/* Logout */}
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-red-50 transition-colors"
                        >
                          <i className="ph ph-sign-out text-xl text-red-500"></i>
                          <span className="font-medium text-red-600">Log out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Guest Menu */
                    <>
                      {/* Not Logged In Section */}
                      <div className="px-4 py-3 border-b border-brand-100">
                        <p className="text-xs text-brand-600 font-medium mb-2">Sign up or Log in</p>
                        <div className="space-y-2">
                          <Link
                            href={`${DASHBOARD_URL}/auth/signup`}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-between px-4 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors"
                          >
                            <span>Sign Up</span>
                            <i className="ph-bold ph-arrow-right"></i>
                          </Link>
                          <Link
                            href={`${DASHBOARD_URL}/auth/login`}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-between px-4 py-3 border-2 border-brand-200 rounded-xl font-bold text-brand-600 hover:bg-brand-50 transition-colors"
                          >
                            <span>Log in</span>
                            <i className="ph-bold ph-arrow-right"></i>
                          </Link>
                        </div>
                      </div>

                      {/* Menu Items - Limited for guests */}
                      <div className="py-2">
                        <Link
                          href={`${DASHBOARD_URL}/listings`}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                        >
                          <i className="ph ph-buildings text-xl text-brand-500"></i>
                          <span className="font-medium text-brand-700">Browse Listings</span>
                        </Link>
                        <Link
                          href="/about-us"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                        >
                          <i className="ph ph-users text-xl text-brand-500"></i>
                          <span className="font-medium text-brand-700">About Us</span>
                        </Link>
                        <Link
                          href="/pricing"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                        >
                          <i className="ph ph-tag text-xl text-brand-500"></i>
                          <span className="font-medium text-brand-700">Pricing</span>
                        </Link>

                        {/* Divider */}
                        <div className="border-t border-brand-100 my-2"></div>

                        <Link
                          href="/contact"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                        >
                          <i className="ph ph-question text-xl text-brand-500"></i>
                          <span className="font-medium text-brand-700">Help Center</span>
                        </Link>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop: Auth-aware CTA */}
          <div className="hidden md:flex items-center gap-2 md:gap-4 lg:gap-6 flex-shrink-0">
            {isAuthenticated ? (
              /* Authenticated Desktop Menu */
              <>
                {/* Saved Listings */}
                <Link
                  href={`${DASHBOARD_URL}/listings/saved`}
                  className="p-2 text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-full transition-colors"
                  title="Saved Listings"
                >
                  <i className="ph-bold ph-heart text-xl"></i>
                </Link>

                {/* Messages */}
                <Link
                  href={`${DASHBOARD_URL}/messages`}
                  className="p-2 text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-full transition-colors"
                  title="Messages"
                >
                  <i className="ph-bold ph-chat-circle text-xl"></i>
                </Link>

                {/* User Menu Dropdown */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 px-1 py-1 border-2 border-gray-200 rounded-full hover:border-brand-300 transition-colors"
                  >
                    <i className="ph-bold ph-list text-lg text-gray-600"></i>
                    <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user?.name?.charAt(0).toUpperCase() || "U"
                      )}
                    </div>
                  </button>

                  {/* Desktop Dropdown */}
                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-brand-100 overflow-hidden"
                      >
                        <div className="py-2">
                          {/* User Info */}
                          <div className="px-4 py-3 bg-brand-50 border-b border-brand-100">
                            <p className="font-bold text-brand-dark text-sm">{user?.name}</p>
                            <p className="text-xs text-brand-600">{user?.email}</p>
                          </div>

                          {/* Menu Items */}
                          <Link
                            href={`${DASHBOARD_URL}/profile`}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 transition-colors"
                          >
                            <i className="ph ph-user-circle text-lg text-brand-500"></i>
                            <span className="font-medium text-brand-700 text-sm">Profile</span>
                          </Link>
                          <Link
                            href={`${DASHBOARD_URL}/listings/saved`}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 transition-colors"
                          >
                            <i className="ph ph-heart text-lg text-brand-500"></i>
                            <span className="font-medium text-brand-700 text-sm">Saved Listings</span>
                          </Link>
                          <Link
                            href={`${DASHBOARD_URL}/messages`}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 transition-colors"
                          >
                            <i className="ph ph-chat-circle text-lg text-brand-500"></i>
                            <span className="font-medium text-brand-700 text-sm">Messages</span>
                          </Link>

                          {/* Divider */}
                          <div className="border-t border-brand-100 my-2"></div>

                          {/* Lister Section */}
                          <p className="px-4 py-1 text-xs text-brand-600 font-medium uppercase">Hosting</p>
                          <Link
                            href={`${DASHBOARD_URL}/listings/create`}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 transition-colors"
                          >
                            <i className="ph ph-plus-circle text-lg text-brand-500"></i>
                            <span className="font-medium text-brand-700 text-sm">Create Listing</span>
                          </Link>
                          <Link
                            href={`${DASHBOARD_URL}/hosting`}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 transition-colors"
                          >
                            <i className="ph ph-building text-lg text-brand-500"></i>
                            <span className="font-medium text-brand-700 text-sm">Host Dashboard</span>
                          </Link>

                          {/* Switch Role */}
                          {!isListerMode && (
                            <button
                              onClick={() => {
                                const updatedUser = { ...user, role: "both" as const };
                                localStorage.setItem("gigs_user", JSON.stringify(updatedUser));
                                setUser(updatedUser);
                                setIsMenuOpen(false);
                                window.dispatchEvent(new Event("gigsAuthChange"));
                              }}
                              className="flex items-center gap-3 px-4 py-2.5 w-full text-left hover:bg-brand-50 transition-colors"
                            >
                              <i className="ph ph-arrows-left-right text-lg text-brand-500"></i>
                              <span className="font-medium text-brand-700 text-sm">Switch to Lister</span>
                            </button>
                          )}

                          {/* Divider */}
                          <div className="border-t border-brand-100 my-2"></div>

                          {/* Logout */}
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 w-full text-left hover:bg-red-50 transition-colors"
                          >
                            <i className="ph ph-sign-out text-lg text-red-500"></i>
                            <span className="font-medium text-red-600 text-sm">Log out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              /* Guest Desktop CTA */
              <>
                <Link
                  href={`${DASHBOARD_URL}/auth/signup?redirect=/listings/create`}
                  className="hidden md:flex items-center gap-2 px-4 py-2 font-bold rounded-lg hover:border-orange-700 transition-all text-sm hover:text-brand-500"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Become a Lister
                </Link>
                <Link
                  href={`${DASHBOARD_URL}/auth/login`}
                  className="hidden md:block text-sm font-bold hover:text-brand-600 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href={`${DASHBOARD_URL}/auth/signup`}
                  className="px-5 py-2.5 bg-black text-white font-bold rounded-lg border-2 border-brand-dark hover:bg-brand-accent hover:border-brand-accent hover:-translate-y-1 hover:shadow-brutal transition-all text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
