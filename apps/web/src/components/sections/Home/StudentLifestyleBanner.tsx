"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3001";

export function StudentLifestyleBanner() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 py-16 md:py-24">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full"
      >
        <div className="relative overflow-hidden rounded-[56px] bg-[#E2F1A7] flex flex-col md:flex-row items-stretch min-h-[440px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-4 border-white">
          {/* Abstract Background Elements */}
          <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-white/20 to-transparent pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Image Section */}
          <div className="w-full md:w-1/2 relative min-h-[340px] md:min-h-auto overflow-hidden">
            <motion.img 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" 
              alt="Students lifestyle"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/5" />
            
            {/* Floating Badge for Mobile */}
            <div className="absolute top-10 left-10 md:hidden">
               <div className="bg-white/95 backdrop-blur-xl px-6 py-2.5 rounded-full shadow-2xl border border-white/50">
                 <span className="text-slate-900 font-display font-black text-sm uppercase tracking-widest">Student Life</span>
               </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/2 p-12 md:p-20 lg:p-24 flex flex-col justify-center relative z-10">
            <div className="mb-10">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/60 backdrop-blur-xl rounded-full border border-white/80 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
                <span className="text-slate-900 font-display font-black text-xs tracking-[0.2em] uppercase">Student Exclusive</span>
              </div>
            </div>

            <h3 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-slate-900 mb-10 leading-[0.95] tracking-tight">
              Premium spaces for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-800">modern students</span>
            </h3>
            
            <p className="text-slate-700/80 text-xl md:text-2xl mb-14 max-w-xl font-medium leading-relaxed tracking-tight">
              Connect with your tribe. Find students who share your vibe, academic focus, and lifestyle in verified premium homes.
            </p>

            <Link 
              href={`${DASHBOARD_URL}/roommates`}
              className="group relative flex items-center gap-6 bg-slate-900 hover:bg-slate-800 text-white px-14 py-7 rounded-[32px] font-black text-xl transition-all w-fit shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.25)] hover:-translate-y-1.5 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Find Your Tribe</span>
              <div className="relative z-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-brand-500 transition-all duration-300">
                <i className="ph-bold ph-arrow-right text-2xl"></i>
              </div>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
