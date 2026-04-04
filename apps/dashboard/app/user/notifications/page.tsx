"use client";

import { motion } from "framer-motion";

export default function NotificationsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
        </div>
      </motion.div>
    </div>
  );
}
