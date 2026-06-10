"use client";

import { motion } from "framer-motion";
<<<<<<< HEAD
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
=======
import UserProfileSidebar from "@/components/user/UserProfileSidebar";

export default function ConnectionsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-8 px-4">Profile</h1>
          <UserProfileSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-8">Connections</h2>

            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ph-bold ph-users-three text-4xl text-slate-300"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No connections yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-8">
                Connect with other guests and hosts to build your network and find roommate opportunities.
              </p>
              <button className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
                Find connections
              </button>
            </div>
          </motion.div>
        </div>
      </div>
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
    </div>
  );
}
