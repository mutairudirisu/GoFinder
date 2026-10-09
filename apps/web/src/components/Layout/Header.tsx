"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { DASHBOARD_URL, NAV_LINKS } from "./header.constants";
import { useHeaderAuth } from "./useHeaderAuth";
import { useAutoHideOnScroll } from "@/hooks/useAutoHideOnScroll";

const allNavLinks = [
  { label: "Home", href: "/" },
  ...NAV_LINKS,
];

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout } = useHeaderAuth();
  const { hidden } = useAutoHideOnScroll({
    enabled: true,
    deltaThreshold: 8,
    topReset: 40,
  });

  useEffect(() => {
    if (hidden) {
      setMobileOpen(false);
      setIsUserMenuOpen(false);
    }
  }, [hidden]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header
      animate={{
        y: hidden ? "-110%" : "0%",
        scaleX: hidden ? 0.84 : 1,
        opacity: hidden ? 0 : 1,
      }}
      transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-x-0 top-0 z-50 origin-top transform-gpu px-4 pt-4 sm:px-6"
    >
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex w-full max-w-max items-center justify-between rounded-full bg-black/90 p-1.5 text-white shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-md md:w-fit md:justify-center md:bg-transparent md:p-0 md:shadow-none md:gap-2.5"
      >
        {/* Mascot-Only Logo Badge (Desktop & Mobile) */}
        <div className="relative z-20 flex items-center justify-center rounded-full bg-[#F4F4F0] p-1.5 shadow-md backdrop-blur-sm transition-transform hover:scale-105">
          <Logo showWordmark={false} />
        </div>

        {/* Center Navigation Links Capsule (Roomie style) */}
        <div className="relative z-10 hidden items-center rounded-full bg-black/90 px-4 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.2)] backdrop-blur-md before:pointer-events-none before:absolute before:inset-1.5 before:rounded-full before:border before:border-white/20 md:flex">
          {allNavLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative z-10 px-4 lg:px-5 py-2 text-sm font-medium text-white/90 transition-colors hover:text-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                index > 0 ? "border-l border-white/20" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right CTA / Auth Button - Adjacent to Nav Links */}
        <div className="hidden items-center md:flex">
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="relative z-10 flex items-center gap-2 rounded-full bg-black/90 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-md transition-all hover:bg-slate-900 before:pointer-events-none before:absolute before:inset-1.5 before:rounded-full before:border before:border-white/20"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 font-bold text-white text-xs">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="max-w-[100px] truncate">{user?.name || "Account"}</span>
                <i className="ph-bold ph-caret-down text-xs text-white/70"></i>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-black/95 p-1 text-white shadow-2xl backdrop-blur-xl"
                  >
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="font-bold text-white truncate">{user?.name}</p>
                      <p className="text-xs text-white/60 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href={DASHBOARD_URL}
                        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <i className="ph-bold ph-squares-four text-brand-400"></i>
                        Dashboard
                      </Link>
                      <Link
                        href={`${DASHBOARD_URL}/user/profile`}
                        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <i className="ph-bold ph-user text-brand-400"></i>
                        Profile
                      </Link>
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <i className="ph-bold ph-sign-out text-red-400"></i>
                        Log out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href={`${DASHBOARD_URL}/auth/signup`}
              className="relative z-10 inline-flex items-center justify-center rounded-full bg-black/90 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-transform hover:scale-105 before:pointer-events-none before:absolute before:inset-1.5 before:rounded-full before:border before:border-white/30"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline-none md:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <i className="ph-bold ph-x text-xl"></i>
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <i className="ph-bold ph-list text-xl"></i>
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </nav>

      {/* Mobile Dropdown Popover */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="mx-auto mt-2 max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-black/95 text-white shadow-[0_12px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {allNavLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {isAuthenticated ? (
                <div className="mt-2 border-t border-white/10 pt-3">
                  <div className="px-4 pb-2">
                    <p className="font-bold text-white text-sm">{user?.name}</p>
                    <p className="text-xs text-white/60">{user?.email}</p>
                  </div>
                  <Link
                    href={DASHBOARD_URL}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/10"
                  >
                    <i className="ph-bold ph-squares-four text-brand-400"></i>
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-red-400 hover:bg-red-500/20"
                  >
                    <i className="ph-bold ph-sign-out text-red-400"></i>
                    Log out
                  </button>
                </div>
              ) : (
                <Link
                  href={`${DASHBOARD_URL}/auth/signup`}
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 block rounded-2xl border border-white/30 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
                >
                  Get Started
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
