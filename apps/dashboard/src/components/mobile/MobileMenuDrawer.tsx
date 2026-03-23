"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed bottom-20 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.1)] border border-white/40 z-50 max-h-80 overflow-y-auto">
        <div className="p-2 space-y-1">
          <Link
            href="/hosting/reviews"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100/50 transition-colors"
          >
            <i className="ph-bold ph-star text-xl"></i>
            <span className="font-medium">Reviews</span>
          </Link>
          <Link
            href="/hosting/earnings"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100/50 transition-colors"
          >
            <i className="ph-bold ph-currency-dollar text-xl"></i>
            <span className="font-medium">Earnings</span>
          </Link>
          <Link
            href="/hosting/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100/50 transition-colors"
          >
            <i className="ph-bold ph-gear text-xl"></i>
            <span className="font-medium">Settings</span>
          </Link>
          <div className="border-t border-slate-100/50 pt-2 mt-2">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl">
              <div className="w-9 h-9 bg-brand-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-medium text-sm text-slate-700">{user?.name || 'Host'}</p>
                <p className="text-xs text-slate-400">{user?.email || ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
