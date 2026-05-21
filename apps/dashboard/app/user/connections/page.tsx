"use client";

import { motion } from "framer-motion";
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
    </div>
  );
}
