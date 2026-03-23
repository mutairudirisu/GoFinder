"use client";

import Link from "next/link";
import { useMessages } from "@/context/MessageContext";
import { useAuth } from "@/context/AuthContext";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const { conversations } = useMessages();
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="notification-dropdown absolute right-0 top-12 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.1)] border border-white/40 overflow-hidden z-50">
      <div className="p-4 border-b border-slate-100/50">
        <h3 className="font-bold text-slate-800">Notifications</h3>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {conversations.length > 0 ? (
          conversations.slice(0, 5).map((conv) => (
            <Link
              key={conv.id}
              href={`/hosting/messages?conversation=${conv.id}`}
              onClick={onClose}
              className="flex items-start gap-3 p-4 hover:bg-slate-100/50 border-b border-slate-50/50 transition-colors"
            >
              <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                <i className="ph-bold ph-chat-circle text-brand-600"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-800">
                  New message from {conv.participantNames[conv.participants.find(p => p !== user?.id) || ''] || 'Guest'}
                </p>
                <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="w-2 h-2 bg-brand-500 rounded-full"></span>
              )}
            </Link>
          ))
        ) : (
          <div className="p-8 text-center">
            <i className="ph ph-bell-slash text-3xl text-slate-300 mb-2"></i>
            <p className="text-slate-500 text-sm">No new notifications</p>
          </div>
        )}
      </div>
      <Link
        href="/hosting/messages"
        onClick={onClose}
        className="block p-3 text-center text-sm font-medium text-brand-600 hover:bg-slate-100/50 transition-colors border-t border-slate-100/50"
      >
        View all messages
      </Link>
    </div>
  );
}
