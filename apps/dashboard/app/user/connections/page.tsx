"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ConnectionsPage() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <i className="ph ph-arrow-left text-lg"></i>
          </button>
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-slate-900">Connections</h2>
        </div>

        <div className="flex flex-col items-center text-center space-y-8">
          <div className="relative w-64 h-48 md:w-80 md:h-60">
            <img 
              src="https://img.viva.com.vn/2023/12/01/airbnb-connections.png" 
              alt="Connections" 
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback if the image link doesn't work
                (e.target as any).src = "https://cdn-icons-png.flaticon.com/512/3482/3482488.png";
              }}
            />
          </div>

          <div className="space-y-2 max-w-sm">
            <p className="text-slate-600 font-medium">
              When you join an experience or invite someone on a trip, you'll find the profiles of other guests here. <button className="font-bold underline">Learn more</button>
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="px-10 py-3.5 bg-brand-500 text-white font-bold rounded-xl active:scale-95 transition-all shadow-md hover:bg-brand-600"
          >
            Book a trip
          </button>
        </div>
      </motion.div>
    </div>
  );
}
