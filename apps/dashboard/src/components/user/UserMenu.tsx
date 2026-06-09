"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserMenu({ isOpen, onClose }: UserMenuProps) {
  const router = useRouter();
  const { logout, user, switchRole } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
    onClose();
  };

  const handleSwitchToHosting = async () => {
    await switchRole("lister");
    localStorage.setItem("gigs_current_mode", "host");
    router.push("/hosting");
    onClose();
  };

  const menuItems = [
    {
      icon: "ph-user",
      label: "Personal info",
      href: "/user/profile",
    },
    {
      icon: "ph-storefront",
      label: "Switch to hosting",
      onClick: handleSwitchToHosting,
    },
    {
      icon: "ph-house-line",
      label: "Become a Host",
      href: "/becoming-a-host",
    },
    {
      icon: "ph-calendar",
      label: "My Bookings",
      href: "/user/bookings",
    },
    {
      icon: "ph-heart",
      label: "Favorites",
      href: "/user/favorites",
    },
    {
      icon: "ph-chat-circle-dots",
      label: "Messages",
      href: "/user/messages",
    },
    {
      icon: "ph-bell",
      label: "Notifications",
      href: "/user/notifications",
    },
    {
      icon: "ph-gear",
      label: "Account settings",
      href: "/user/settings",
    },
    ...(user?.role === "admin" || String(user?.email ?? "").toLowerCase() === "admin@gigs.app"
      ? [
          {
            icon: "ph-shield-check",
            label: "Admin dashboard",
            href: "/admin",
          },
        ]
      : []),
    {
      icon: "ph-question",
      label: "Get help",
      href: null,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />

          {/* Menu Panel - Slides in from right */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 max-w-[90vw] bg-white z-50 flex flex-col overflow-y-auto rounded-l-3xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-slate-800">Account Menu</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <i className="ph-bold ph-x text-lg"></i>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 space-y-2">
              {/* Tips Card */}
              <div className="bg-brand-50 rounded-xl p-4 mb-6 border border-brand-100">
                <div className="flex gap-3 mb-3">
                  <div className="w-20 h-16 bg-brand-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <i className="ph-bold ph-house-line text-brand-500 text-2xl"></i>
                  </div>
                  <div className="w-20 h-16 bg-brand-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <i className="ph-bold ph-users text-brand-500 text-2xl"></i>
                  </div>
                </div>
                <h3 className="font-semibold text-brand-800 text-sm mb-1">Looking for a place?</h3>
                <p className="text-xs text-brand-600 mb-3">Explore our curated listings and find your perfect home away from home.</p>
                <Link 
                  href="/"
                  onClick={onClose}
                  className="block w-full py-2 bg-white border border-brand-200 rounded-lg text-sm font-medium text-brand-800 hover:bg-brand-50 transition-colors text-center"
                >
                  Browse Listings
                </Link>
              </div>

              <div className="space-y-1">
                {menuItems.map((item, index) => {
                  const content = (
                    <>
                      <i className={`ph-bold ${item.icon} text-base text-slate-600`}></i>
                      <span className="font-medium">{item.label}</span>
                    </>
                  );

                  return (
                    <div key={index}>
                      {item.onClick ? (
                        <button
                          onClick={item.onClick}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-800 hover:bg-slate-50 transition-colors text-sm"
                        >
                          {content}
                        </button>
                      ) : item.href ? (
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-800 hover:bg-slate-50 transition-colors text-sm"
                        >
                          {content}
                        </Link>
                      ) : (
                        <button
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-800 hover:bg-slate-50 transition-colors text-sm cursor-not-allowed opacity-60"
                        >
                          {content}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Logout - Sticky at bottom */}
            <div className="border-t border-slate-200 p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-sm rounded-lg"
              >
                <i className="ph-bold ph-sign-out text-base"></i>
                <span className="font-medium">Log out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
