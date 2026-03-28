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
        <Logo />
        <NavLinks />
        <div className="flex items-center gap-2 md:gap-4" ref={menuRef}>
          <button onClick={() => setIsMenuOpen(v => !v)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-full hover:shadow-lg transition-all">
            <i className="ph-bold ph-list text-xl" />
          </button>
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-brand-100 overflow-hidden"
              >
                {isAuthenticated && user
                  ? <AuthMenu user={user} isListerMode={isListerMode} onClose={closeMenu} onLogout={logout} onSwitchToLister={switchToLister} />
                  : <GuestMenu onClose={closeMenu} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
