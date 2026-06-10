"use client";

import { motion } from "framer-motion";
<<<<<<< HEAD
import Link from "next/link";
import { useRouter } from "next/navigation";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "We'd like to use your information to help fight discrimination. Visit your Privacy settings to learn more or opt...",
    date: "May 24, 2026",
    icon: "ph ph-shield-check",
    iconBg: "bg-black",
    iconColor: "text-white",
  },
  {
    id: 2,
    title: "Please confirm your email address by clicking on the link we just emailed you. If you cannot find the email, yo...",
    date: "May 21, 2026",
    icon: "ph ph-envelope-simple",
    iconBg: "bg-[#008489]",
    iconColor: "text-white",
  },
  {
    id: 3,
    title: "Welcome to GIGS Rentals! Start exploring verified hostels and apartments near you.",
    date: "May 15, 2026",
    icon: "ph ph-sparkle",
    iconBg: "bg-brand-500",
    iconColor: "text-white",
  }
];

export default function NotificationsPage() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
=======

export default function NotificationsPage() {
  return (
    <div className="max-w-6xl mx-auto">
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
<<<<<<< HEAD
        className="space-y-8"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <i className="ph ph-arrow-left text-lg"></i>
          </button>
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-display font-semibold text-slate-900">Notifications</h2>
        </div>

        <div className="space-y-4">
          {MOCK_NOTIFICATIONS.length > 0 ? (
            MOCK_NOTIFICATIONS.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0,04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0,08)] transition-all cursor-pointer group"
              >
                <div className="flex gap-4 items-start">
                  <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center ${notification.iconBg} ${notification.iconColor} shadow-inner`}>
                    <i className={`${notification.icon} text-xl`}></i>
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-[15px] md:text-base text-slate-700 font-medium leading-relaxed group-hover:text-slate-900 transition-colors">
                      {notification.title}
                    </p>
                    <p className="text-xs md:text-sm text-slate-400 font-medium">
                      {notification.date}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ph-bold ph-bell text-4xl text-slate-300"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No new notifications</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Stay tuned for updates on your bookings and account activity.
              </p>
            </div>
          )}
=======
      >
        <h2 className="text-3xl font-display font-bold text-slate-900 mb-8">Notifications</h2>

        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ph-bold ph-bell text-4xl text-slate-300"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No new notifications</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-8">
            Stay tuned for updates on your bookings and account activity.
          </p>
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
        </div>
      </motion.div>
    </div>
  );
}
