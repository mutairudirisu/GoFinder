"use client";

import { motion } from "framer-motion";

export default function CalendarPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 mb-2">
          Calendar
        </h1>
        <p className="text-slate-500">Manage your availability and bookings</p>
      </div>

      {/* Calendar Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
        <div className="flex items-center justify-center min-h-72 sm:min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ph-bold ph-calendar text-3xl text-brand-600"></i>
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Calendar Coming Soon
            </h2>
            <p className="text-slate-500 max-w-sm">
              Manage your property availability and view all your bookings in one place.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
