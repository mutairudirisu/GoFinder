"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ReferHostModal } from "./ReferHostModal";

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:8888";

export const Header = ({
  hideCenterTabs = false,
  centerContent,
}: {
  hideCenterTabs?: boolean;
  centerContent?: ReactNode;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'homes' | 'experiences' | 'services'>('homes');
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [currentMode, setCurrentMode] = useState<"guest" | "host">("guest");
  const [hostBookingCount, setHostBookingCount] = useState(0);
  const [tabsCompact, setTabsCompact] = useState(false);

  const isAuthenticated = !!user;
  const isHostingRoute = pathname.startsWith("/hosting");
  const isHostMode = isHostingRoute || user?.role === "lister" || (user?.role === "both" && currentMode === "host");

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

  useEffect(() => {
    try {
      const stored = localStorage.getItem("gigs_current_mode");
      if (stored === "host" || stored === "guest") setCurrentMode(stored);
    } catch {
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const recompute = () => {
      try {
        const raw = localStorage.getItem("gigs_bookings");
        const parsed = raw ? JSON.parse(raw) : [];
        const items = Array.isArray(parsed) ? (parsed as Array<{ hostId?: string; seenByHost?: boolean }>) : [];
        const count = items.filter((b) => String(b?.hostId ?? "") === String(user.id) && !b?.seenByHost).length;
        setHostBookingCount(count);
      } catch {
        setHostBookingCount(0);
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

  useEffect(() => {
    if (pathname !== "/") return;
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const t = params.get("tab");
    if (t === "homes" || t === "experiences" || t === "services") setActiveTab(t);
    else setActiveTab("homes");
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname !== "/") {
      setTabsCompact(false);
      return;
    }

    const onScroll = () => {
      setTabsCompact(window.scrollY > 48);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const selectTab = (tab: "homes" | "experiences" | "services") => {
    setActiveTab(tab);
    if (pathname === "/") {
      const sp = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
      sp.set("tab", tab);
      router.replace(`/?${sp.toString()}`);
    }
  };

  const switchToHost = () => {
    try {
      localStorage.setItem("gigs_current_mode", "host");
    } catch {
    }
    setCurrentMode("host");
    router.push("/hosting");
  };

  const switchToFinder = () => {
    try {
      localStorage.setItem("gigs_current_mode", "guest");
    } catch {
    }
    setCurrentMode("guest");
    router.push("/");
  };

  const handleSwitchMode = () => {
    if (user?.role !== "both") return;
    if (isHostingRoute) {
      switchToFinder();
    } else {
      switchToHost();
    }
  };

  const handleBecomeHost = () => {
    if (isAuthenticated) {
      router.push('/becoming-a-host');
    } else {
      router.push('/auth/signup');
    }
  };

  const logoHref = pathname === "/" ? WEB_URL : "/";

  if (isAuthenticated) {
    // Return authenticated header component
    return (
      <>
      <header className="sticky top-0 z-[100] bg-white border-b border-slate-200 pt-6 md:py-4 md:px-16">
        <div className="max-w-7xl mx-auto md:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href={logoHref} className="hidden md:flex items-center gap-2 group flex-shrink-0">
            <div className=" w-8 h-8 bg-brand-500 rounded-lg border-2 border-brand-dark flex items-center justify-center shadow-brutal-sm group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all flex-shrink-0">
              <i className="ph-bold ph-house-line text-lg text-white"></i>
            </div>
            <span className="font-display font-bold text-lg text-brand-dark hidden sm:inline-block">
              GIGS<span className="text-brand-600">Rentals</span>
            </span>
          </Link>

          {centerContent ? (
            <div className="md:flex flex-1 justify-center px-4">
              <div className="w-full max-w-3xl">{centerContent}</div>
            </div>
          ) : hideCenterTabs ? (
            <div className=" md:block flex-1" />
          ) : (
            <nav className={`flex gap-12 md:gap-12 items-center justify-center mx-auto ${tabsCompact ? "pb-0" : "pb-0"}`}>
              <button
                onClick={() => selectTab('homes')}
                className={`md:flex md:gap-2 ${tabsCompact ? "pb-2 border-b-2" : "pb-2 border-b-4"} md:pb-2 md:border-b-4 rounded-sm transition-colors text-sm ${
                  activeTab === 'homes'
                    ? 'border-brand-500 text-brand-700 font-medium'
                    : 'border-transparent text-slate-600 hover:text-brand-700'
                }`}
              >
                <div className={tabsCompact ? "hidden md:block" : "block"}><i className="ph-bold ph-house-line text-lg"></i></div>
                <span>Homes</span>
              </button>

              <button
                onClick={() => selectTab('experiences')}
                className={`md:flex md:gap-2 ${tabsCompact ? "pb-2 border-b-2" : "pb-2 border-b-4"} md:pb-2 md:border-b-4 rounded-sm transition-colors relative text-sm ${
                  activeTab === "experiences"
                    ? "border-brand-500 text-brand-700 font-medium"
                    : "border-transparent text-slate-600 hover:text-brand-700"
                }`}
              >
                <div className={tabsCompact ? "hidden md:block" : "block"}><i className="ph-bold ph-balloon text-lg"></i></div>
                <span>Experiences</span>
                <span className={`ml-1 px-1.5 py-0.5 bg-slate-900 text-white text-[9px] font-bold rounded-full absolute top-0 -right-5 md:-top-4 md:right-14 ${tabsCompact ? "hidden md:inline-flex" : ""}`}>
                  SOON
                </span>
              </button>

              <button
                onClick={() => selectTab('services')}
                className={`md:flex md:gap-2 ${tabsCompact ? "pb-2 border-b-2" : "pb-2 border-b-4"} md:pb-2 md:border-b-4 rounded-sm transition-colors relative text-sm ${
                  activeTab === "services"
                    ? "border-brand-500 text-brand-700 font-medium"
                    : "border-transparent text-slate-600 hover:text-brand-700"
                }`}
              >
                <div className={tabsCompact ? "hidden md:block" : "block"}><i className="ph-bold ph-wrench text-lg"></i></div>
                <span>Services</span>
                <span className={`ml-1 px-1.5 py-0.5 bg-slate-900 text-white text-[9px] font-bold rounded-full absolute top-0 -right-5 md:-top-4 md:right-8 ${tabsCompact ? "hidden md:inline-flex" : ""}`}>
                  SOON
                </span>
              </button>
            </nav>
          )}

          {/* Right Side - CTA and Menu */}
          <div className="hidden md:flex items-center gap-3">
            {!isHostingRoute ? (
              <Link
                href="/user/favorites"
                className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-brand-50 transition-colors text-slate-700 hover:text-brand-700"
                aria-label="Wishlists"
              >
                <i className="ph-bold ph-heart text-lg"></i>
              </Link>
            ) : null}

            {(user?.role === "both") && (
              <button
                onClick={handleSwitchMode}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-slate-700 font-medium hover:bg-brand-50 hover:text-brand-700 rounded-full transition-colors"
              >
                {isHostingRoute ? "Switch to Finder" : "Switch to host"}
              </button>
            )}

            {/* Hamburger Menu */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="h-11 pl-4 pr-2 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center gap-3"
              >
                <i className="ph-bold ph-list text-lg text-slate-700"></i>
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
                  >
                    {/* Wishlists */}
                    <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                      <button
                        onClick={() => {
                          router.push('/user/favorites');
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 text-left w-full"
                      >
                        <i className="ph-bold ph-heart text-lg text-slate-600"></i>
                        <span className="font-medium text-slate-700">Wishlists</span>
                      </button>
                    </div>

                    {/* Bookings */}
                    <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                      <button
                        onClick={() => {
                          router.push('/user/bookings');
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 text-left w-full"
                      >
                        <i className="ph-bold ph-calendar-check text-lg text-slate-600"></i>
                        <span className="font-medium text-slate-700">Bookings</span>
                      </button>
                    </div>

                    {/* Trips */}
                    <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                      <button
                        onClick={() => {
                          router.push('/user/trips');
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 text-left w-full"
                      >
                        <i className="ph-bold ph-suitcase text-lg text-slate-600"></i>
                        <span className="font-medium text-slate-700">Trips</span>
                      </button>
                    </div>

                    {/* Messages */}
                    <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                      <button
                        onClick={() => {
                          router.push(isHostingRoute ? "/hosting/messages" : "/user/messages");
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 text-left w-full"
                      >
                        <i className="ph-bold ph-chat-circle-dots text-lg text-slate-600"></i>
                        <span className="font-medium text-slate-700">{isHostingRoute ? "Inbox" : "Messages"}</span>
                      </button>
                    </div>

                    {isHostingRoute ? (
                      <>
                        <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                          <button
                            onClick={() => {
                              router.push("/hosting/listings");
                              setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-3 text-left w-full"
                          >
                            <i className="ph-bold ph-storefront text-lg text-slate-600"></i>
                            <span className="font-medium text-slate-700">Listings</span>
                          </button>
                        </div>
                        <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                          <button
                            onClick={() => {
                              router.push("/hosting/bookings");
                              setIsMenuOpen(false);
                            }}
                            className="flex items-center justify-between gap-3 text-left w-full"
                          >
                            <span className="flex items-center gap-3">
                              <i className="ph-bold ph-suitcase text-lg text-slate-600"></i>
                              <span className="font-medium text-slate-700">Bookings</span>
                            </span>
                            {hostBookingCount > 0 ? (
                              <span className="min-w-[26px] h-6 px-2 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">
                                {hostBookingCount > 99 ? "99+" : hostBookingCount}
                              </span>
                            ) : null}
                          </button>
                        </div>
                        <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                          <button
                            onClick={() => {
                              router.push("/hosting/calendar");
                              setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-3 text-left w-full"
                          >
                            <i className="ph-bold ph-calendar text-lg text-slate-600"></i>
                            <span className="font-medium text-slate-700">Calendar</span>
                          </button>
                        </div>
                      </>
                    ) : null}

                    {/* Profile */}
                    <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                      <button
                        onClick={() => {
                          router.push(isHostingRoute ? "/hosting/profile" : "/user/profile");
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 text-left w-full"
                      >
                        <i className="ph-bold ph-user text-lg text-slate-600"></i>
                        <span className="font-medium text-slate-700">Profile</span>
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-200"></div>

                    {/* Switch Mode - Only for users with both roles */}
                    {user?.role === 'both' && (
                      <>
                        <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                          <button
                            onClick={() => {
                              handleSwitchMode();
                              setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-3 text-left w-full"
                          >
                            <i className={`ph-bold ${isHostingRoute ? "ph-magnifying-glass" : "ph-storefront"} text-lg text-slate-600`}></i>
                            <span className="font-medium text-slate-700">
                              {isHostingRoute ? "Switch to Finder" : "Switch to host"}
                            </span>
                          </button>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-slate-200"></div>
                      </>
                    )}

                    {/* Account settings */}
                    <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                      <button
                        onClick={() => {
                          router.push(isHostingRoute ? "/hosting/settings" : "/user/settings");
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 text-left w-full"
                      >
                        <i className="ph-bold ph-gear text-lg text-slate-600"></i>
                        <span className="font-medium text-slate-700">Account settings</span>
                      </button>
                    </div>

                    {/* Languages & currency */}
                    <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                      <button className="flex items-center gap-3 text-left w-full">
                        <i className="ph-bold ph-globe text-lg text-slate-600"></i>
                        <span className="font-medium text-slate-700">Languages & currency</span>
                      </button>
                    </div>

                    {/* Help Center */}
                    <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                      <button 
                        onClick={() => {
                          const helpUrl = `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:8888'}/help-center`;
                          window.open(helpUrl, '_blank');
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 text-left w-full"
                      >
                        <i className="ph-bold ph-question text-lg text-slate-600"></i>
                        <span className="font-medium text-slate-700">Help Center</span>
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-200"></div>

                    {/* Become a Host Section - Show if not already in host mode or if user is renter only */}
                    {!isHostMode && (
                      <>
                        <div className="px-4 py-4 hover:bg-brand-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-slate-900 mb-1">Become a host</h3>
                              <p className="text-sm text-slate-600">It's easy to start hosting and earn extra income.</p>
                            </div>
                            <button
                              onClick={() => {
                                if (user?.role === "both") switchToHost();
                                else router.push("/becoming-a-host");
                                setIsMenuOpen(false);
                              }}
                              className="ml-3"
                            >
                              <i className="ph-fill ph-person text-3xl text-slate-300"></i>
                            </button>
                          </div>
                        </div>

                        {/* Refer a Host */}
                        <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                          <button 
                            onClick={() => {
                              setIsReferralModalOpen(true);
                              setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-3 text-left w-full"
                          >
                            <i className="ph-bold ph-share-network text-lg text-slate-600"></i>
                            <span className="font-medium text-slate-700">Refer a Host</span>
                          </button>
                        </div>

                        {/* Find a co-host */}
                        <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                          <button className="flex items-center gap-3 text-left w-full">
                            <i className="ph-bold ph-users-three text-lg text-slate-600"></i>
                            <span className="font-medium text-slate-700">Find a co-host</span>
                          </button>
                        </div>

                        {/* Gift cards */}
                        <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                          <button className="flex items-center gap-3 text-left w-full">
                            <i className="ph-bold ph-gift text-lg text-slate-600"></i>
                            <span className="font-medium text-slate-700">Gift cards</span>
                          </button>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-slate-200"></div>
                      </>
                    )}

                    {/* Log out */}
                    <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                          router.push('/');
                        }}
                        className="flex items-center gap-3 text-left w-full"
                      >
                        <i className="ph-bold ph-sign-out text-lg text-slate-600"></i>
                        <span className="font-medium text-slate-700">Log out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        </header>
        
        {/* Refer Host Modal */}
        {user && (
          <ReferHostModal
            isOpen={isReferralModalOpen}
            onClose={() => setIsReferralModalOpen(false)}
            userName={user.name || user.email || "User"}
            userId={user.id}
          />
        )}
        
      </>
    );
  }

  // Unauthenticated Header - Airbnb Style
  return (
    <header className="sticky top-0 z-[100] bg-white border-b border-slate-200 pt-6 md:py-4 md:px-16">
      <div className=" mx-auto px-2 md:px-6 h-16 flex items-center justify-between mr-2">
        {/* Logo */}
          <Link href={logoHref} className="hidden md:flex items-center gap-2 group flex-shrink-0">
            <div className=" w-8 h-8 bg-brand-500 rounded-lg border-2 border-brand-dark flex items-center justify-center shadow-brutal-sm group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all flex-shrink-0">
              <i className="ph-bold ph-house-line text-lg text-white"></i>
            </div>
            <span className="font-display font-bold text-lg text-brand-dark hidden sm:inline-block">
              GIGS<span className="text-brand-600">Rentals</span>
            </span>
          </Link>

          {centerContent ? (
            <div className="md:flex flex-1 justify-center px-4">
              <div className="w-full max-w-3xl">{centerContent}</div>
            </div>
          ) : hideCenterTabs ? (
            <div className=" md:block flex-1" />
          ) : (
            <nav className={`flex gap-12 md:gap-12 items-center justify-center mx-auto ${tabsCompact ? "pb-0" : "pb-0"}`}>
              <button
                onClick={() => selectTab('homes')}
                className={`md:flex md:gap-2 ${tabsCompact ? "pb-2 border-b-2" : "pb-2 border-b-4"} md:pb-2 md:border-b-4 rounded-sm transition-colors ${
                  activeTab === 'homes'
                    ? 'border-brand-500 text-brand-700 font-medium'
                    : 'border-transparent text-slate-600 hover:text-brand-700'
                }`}
              >
                <div className={tabsCompact ? "hidden md:block" : "block"}><i className="ph-bold ph-house-line text-xl"></i></div>
                <span>Homes</span>
              </button>

              <button
                onClick={() => selectTab('experiences')}
                className={`md:flex md:gap-2 ${tabsCompact ? "pb-2 border-b-2" : "pb-2 border-b-4"} md:pb-2 md:border-b-4 rounded-sm transition-colors relative ${
                  activeTab === "experiences"
                    ? "border-brand-500 text-brand-700 font-medium"
                    : "border-transparent text-slate-600 hover:text-brand-700"
                }`}
              >
                <div className={tabsCompact ? "hidden md:block" : "block"}><i className="ph-bold ph-balloon text-xl"></i></div>
                <span>Experiences</span>
                <span className={`ml-1 px-2 py-0.5 bg-slate-900 text-white text-xs font-bold rounded-full absolute top-0 -right-5 md:-top-5 md:right-12 ${tabsCompact ? "hidden md:inline-flex" : ""}`}>
                  SOON
                </span>
              </button>

              <button
                onClick={() => selectTab('services')}
                className={`md:flex md:gap-2 ${tabsCompact ? "pb-2 border-b-2" : "pb-2 border-b-4"} md:pb-2 md:border-b-4 rounded-sm transition-colors relative ${
                  activeTab === "services"
                    ? "border-brand-500 text-brand-700 font-medium"
                    : "border-transparent text-slate-600 hover:text-brand-700"
                }`}
              >
                <div className={tabsCompact ? "hidden md:block" : "block"}><i className="ph-bold ph-wrench text-xl"></i></div>
                <span>Services</span>
                <span className={`ml-1 px-2 py-0.5 bg-slate-900 text-white text-xs font-bold rounded-full absolute top-0 -right-8 md:-top-5 md:right-5 ${tabsCompact ? "hidden md:inline-flex" : ""}`}>
                  SOON
                </span>
              </button>
            </nav>
          )}

        {/* Right Side - CTA and Menu */}
        <div className="hidden md:flex items-center gap-3">
          {/* Become a Host Button */}
          <button
            onClick={handleBecomeHost}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-slate-700 font-medium hover:bg-brand-50 hover:text-brand-700 rounded-full transition-colors"
          >
            <i className="ph-bold ph-storefront text-lg"></i>
            Become a host
          </button>

          {/* Language/Menu Icon */}
          <button className="p-2 hover:bg-brand-50 rounded-full transition-colors">
            <i className="ph-bold ph-globe text-lg text-slate-600"></i>
          </button>

          {/* Hamburger Menu */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-brand-50 rounded-full transition-colors"
            >
              <i className="ph-bold ph-list text-lg text-slate-600"></i>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
                >
                  {/* Help Center */}
                  <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                    <button 
                      onClick={() => {
                        const helpUrl = `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:8888'}/help-center`;
                        window.open(helpUrl, '_blank');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 text-left w-full"
                    >
                      <i className="ph-bold ph-question text-lg text-slate-600"></i>
                      <span className="font-medium text-slate-700">Help Center</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-slate-200"></div>

                  {/* Become a Host Section */}
                  <div className="px-4 py-4 hover:bg-brand-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 mb-1">Become a host</h3>
                        <p className="text-sm text-slate-600">It's easy to start hosting and earn extra income.</p>
                      </div>
                      <button
                        onClick={() => {
                          handleBecomeHost();
                          setIsMenuOpen(false);
                        }}
                        className="ml-3"
                      >
                        <i className="ph-fill ph-person text-3xl text-slate-300"></i>
                      </button>
                    </div>
                  </div>

                  {/* Refer a Host */}
                  <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                    <button 
                      onClick={() => {
                        router.push('/auth/login');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 text-left w-full"
                    >
                      <i className="ph-bold ph-share-network text-lg text-slate-600"></i>
                      <span className="font-medium text-slate-700">Refer a Host</span>
                    </button>
                  </div>

                  {/* Find a co-host */}
                  <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                    <button className="flex items-center gap-3 text-left w-full">
                      <i className="ph-bold ph-users-three text-lg text-slate-600"></i>
                      <span className="font-medium text-slate-700">Find a co-host</span>
                    </button>
                  </div>

                  {/* Gift cards */}
                  <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                    <button className="flex items-center gap-3 text-left w-full">
                      <i className="ph-bold ph-gift text-lg text-slate-600"></i>
                      <span className="font-medium text-slate-700">Gift cards</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-slate-200"></div>

                  {/* Log in or sign up */}
                  <div className="px-4 py-3 hover:bg-brand-50 transition-colors">
                    <button
                      onClick={() => {
                        router.push('/auth/login');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 text-left w-full"
                    >
                      <i className="ph-bold ph-sign-in text-lg text-slate-600"></i>
                      <span className="font-medium text-slate-700">Log in or sign up</span>
                    </button>
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
