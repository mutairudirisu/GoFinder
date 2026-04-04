"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface HostingMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HostingMenu({ isOpen, onClose }: HostingMenuProps) {
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
    onClose();
  };

  const menuItems = [
    {
      icon: "ph-gear",
      label: "Account settings",
      href: "/hosting/profile",
    },
    {
      icon: "ph-globe",
      label: "Languages & currency",
      href: null,
    },
    {
      icon: "ph-books",
      label: "Hosting resources",
      href: null,
    },
    {
      icon: "ph-question",
      label: "Get help",
      href: null,
    },
    {
      icon: "ph-users-three",
      label: "Find a co-host",
      href: null,
    },
    {
      icon: "ph-plus",
      label: "Create a new listing",
      href: "/becoming-a-host",
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
      icon: "ph-hand-fist",
      label: "Refer a host",
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
              <h2 className="text-lg font-semibold text-slate-800">Menu</h2>
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
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="flex gap-3 mb-3">
                  <div className="w-20 h-16 bg-slate-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <i className="ph-bold ph-house text-slate-400 text-2xl"></i>
                  </div>
                  <div className="w-20 h-16 bg-slate-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <i className="ph-bold ph-star text-slate-400 text-2xl"></i>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-800 text-sm mb-1">New to hosting?</h3>
                <p className="text-xs text-slate-600 mb-3">Discover tips and best practices shared by top-rated hosts.</p>
                <button className="w-full py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors">
                  Get started
                </button>
              </div>

              {/* Menu Items */}
              <div className="space-y-1">
                {menuItems.map((item, index) => (
                  <div key={index}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-800 hover:bg-slate-50 transition-colors text-sm"
                      >
                        <i className={`ph-bold ${item.icon} text-base text-slate-600`}></i>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ) : (
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-800 hover:bg-slate-50 transition-colors text-sm cursor-not-allowed"
                      >
                        <i className={`ph-bold ${item.icon} text-base text-slate-600`}></i>
                        <span className="font-medium">{item.label}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Logout - Sticky at bottom */}
            <div className="border-t border-slate-200 p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-slate-800 hover:bg-slate-50 transition-colors text-sm rounded-lg"
              >
                <i className="ph-bold ph-sign-out text-base text-slate-600"></i>
                <span className="font-medium">Log out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
