"use client";

import Link from "next/link";
import { useMessages } from "@/context/MessageContext";

interface MobileBottomNavProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function MobileBottomNav({ 
  mobileMenuOpen, 
  setMobileMenuOpen 
}: MobileBottomNavProps) {
  const { unreadCount } = useMessages();

  return (
    <nav className="fixed lg:hidden bottom-4 left-4 right-4 z-40">
      <div className="flex items-center justify-around h-16 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] border border-white/40">
        <Link
          href="/hosting"
          className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-slate-500 hover:text-brand-600 transition-colors"
        >
          <i className="ph-bold ph-squares-four text-xl"></i>
          <span className="text-xs font-medium">Dashboard</span>
        </Link>
        <Link
          href="/hosting/calendar"
          className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-slate-500 hover:text-brand-600 transition-colors"
        >
          <i className="ph-bold ph-calendar text-xl"></i>
          <span className="text-xs font-medium">Calendar</span>
        </Link>
        <Link
          href="/hosting/listings"
          className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-slate-500 hover:text-brand-600 transition-colors"
        >
          <i className="ph-bold ph-buildings text-xl"></i>
          <span className="text-xs font-medium">Listings</span>
        </Link>
        <Link
          href="/hosting/messages"
          className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-slate-500 hover:text-brand-600 transition-colors relative"
        >
          <i className="ph-bold ph-chat-circle text-xl"></i>
          <span className="text-xs font-medium">Messages</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <i className="ph-bold ph-dots-three-outline-vertical text-xl"></i>
          <span className="text-xs font-medium">More</span>
        </button>
      </div>
    </nav>
  );
}
