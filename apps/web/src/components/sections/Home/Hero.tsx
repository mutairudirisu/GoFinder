"use client";

import { Button } from "@repo/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Hero section with decorative backgrounds, text, CTA buttons, and image cards
export const Hero = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleListSpace = () => {
    if (!isAuthenticated) {
      // Store intended destination for redirect after login
      localStorage.setItem("redirectAfterLogin", "/listings/create");
      // Redirect to dashboard auth
      const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3001";
      window.location.href = `${DASHBOARD_URL}/auth/login?redirect=/listings/create`;
    } else {
      router.push("/listings/create");
    }
  };

  return (
    // Hero Section
    <section className="pt-16 relative min-h-[90vh] flex items-center bg-brand-50 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')] bg-cover bg-center opacity-10 hidden lg:block"></div>
      <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 sm:py-20">
        <motion.div
          className="space-y-6 sm:space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 backdrop-blur-md rounded-full border border-2 border-brand-dark shadow-brutal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">New Listings Added Daily</span>
          </motion.div>

          <motion.h1
            className="font-display font-extrabold text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] text-brand-dark"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Find your <span className="text-brand-600 italic font-light inline-flex min-w-[200px] sm:min-w-[280px] md:min-w-[350px]">
              <TypeAnimation
                sequence={[
                  'tribe.',
                  2000,
                  'space.',
                  2000,
                  'home.',
                  2000,
                  'spot.',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="text-brand-600 italic font-light"
              />
            </span><br className="leading-[0]" />
            <span>
              Find your <span className="text-brand-500">stay.</span>
            </span>
          </motion.h1>

          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 font-sans max-w-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            The easiest way for students to discover affordable hostels, match with roommates, and split payments securely. No drama, just dorms.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Link href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001'}/`} className="interactive-hover px-6 sm:px-8 py-3 sm:py-4 bg-brand-600 text-white font-semibold text-sm sm:text-base md:text-lg rounded-2xl shadow-lg shadow-brand-500/30 hover:shadow-brutal hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 border-2">
              <i className="ph-bold ph-magnifying-glass"></i>
              Start Searching
            </Link>
            <button onClick={handleListSpace} className="shadow-brutal interactive-hover px-6 sm:px-8 py-3 sm:py-4 bg-white/60 backdrop-blur-md text-brand-dark font-semibold text-sm sm:text-base md:text-lg rounded-2xl border border-dark hover:bg-white/90 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
              <i className="ph-bold ph-house-simple"></i>
              List a Space
            </button>
          </motion.div>

          <motion.div
            className="flex items-center gap-4 pt-4 sm:pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <div className="flex -space-x-3">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" alt="User" className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 border-white object-cover shadow-sm" />
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" alt="User" className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 border-white object-cover shadow-sm" />
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&h=64" alt="User" className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 border-white object-cover shadow-sm" />
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-brand-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">+2k</div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-600">Students joined this week</p>
          </motion.div>
        </motion.div>

        <div className="relative hidden lg:block h-[600px] perspective-1000">
          {/* Hero Image Composition with Smooth Floating Animation */}
          <motion.div
            className="absolute top-5 right-10 w-72 h-80 bg-brand-100 rounded-3xl border border-white shadow-xl z-10 overflow-hidden"
            animate={{ y: [0, -15, 0], rotate: [3, 4, 3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Student hang out" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/70 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/50 shadow-lg">
              <p className="font-bold text-sm text-slate-800">The Hive, Kano</p>
              <p className="text-xs text-brand-600 font-medium mt-1">Starting $350/mo</p>
            </div>
          </motion.div>

          <motion.div
            className="absolute -bottom-10 right-20 w-72 h-80 bg-brand-50 rounded-3xl border border-white shadow-xl z-20 overflow-hidden"
            animate={{ y: [0, 15, 0], rotate: [-6, -4, -6] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Student studying" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/70 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/50 shadow-lg">
              <p className="font-bold text-sm text-slate-800">Campus Residence</p>
              <p className="text-xs text-brand-600 font-medium mt-1">Starting $350/mo</p>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-32 left-0 w-64 h-72 bg-brand-200 rounded-3xl border border-white shadow-2xl overflow-hidden z-30"
            animate={{ y: [0, -10, 0], rotate: [-2, -3, -2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Cozy dorm" />
            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md rounded-full p-2.5 border border-white shadow-sm hover:scale-110 transition-transform cursor-pointer interactive-hover">
              <i className="ph-fill ph-heart text-red-500 text-lg"></i>
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/60 shadow-lg flex items-center gap-3">
              <div className="w-8 h-8 flex-shrink-0 bg-green-100/80 rounded-full flex items-center justify-center text-green-600 border border-green-200">
                <i className="ph-fill ph-check-circle text-xl"></i>
              </div>
              <div>
                <p className="font-bold text-xs text-slate-800">Verified Listing</p>
                <p className="text-[0.65rem] text-slate-500 mt-0.5">Inspected by HostelFlow</p>
              </div>
            </div>
          </motion.div>

          {/* Decorative Glow */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-400/20 rounded-full blur-[100px] pointer-events-none z-0"></div>
          <div className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-400/20 rounded-full blur-[80px] pointer-events-none z-0"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

