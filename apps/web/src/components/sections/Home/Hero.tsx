"use client";

import { Button } from "@repo/ui/button";
import Link from "next/link";

// Hero section with decorative backgrounds, text, CTA buttons, and image cards
export const Hero = () => {

  return (
    // Hero Section
    <section className="pt-16 relative min-h-[90vh] flex items-center bg-brand-50 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')] bg-cover bg-center opacity-10 hidden lg:block"></div>
      <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-12 items-center py-20">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 border-brand-dark shadow-brutal-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider">New Listings Added Daily</span>
          </div>

          <h1 className="font-display font-extrabold text-6xl md:text-7xl lg:text-8xl leading-[0.9] text-brand-dark">
            Find your <span className="text-brand-600 italic">tribe.</span><br />
            Find your <span className="relative inline-block">
              stay.
              <svg className="absolute -bottom-2 w-full h-3 text-brand-400 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="text-xl text-slate-600 font-sans max-w-lg leading-relaxed">
            The easiest way for students to discover affordable hostels, match with roommates, and split payments securely. No drama, just dorms.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/listings" className="px-8 py-4 bg-brand-500 text-brand-dark font-bold text-lg rounded-xl border-2 border-brand-dark shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2">
              <i className="ph-bold ph-magnifying-glass"></i>
              Start Searching
            </Link>
            <Link href="/listings" className="px-8 py-4 bg-white text-brand-dark font-bold text-lg rounded-xl border-2 border-brand-dark hover:bg-brand-50 hover:border-brand-500 transition-all flex items-center justify-center gap-2">
              <i className="ph-bold ph-house-simple"></i>
              List a Space
            </Link>
          </div>

          <div className="flex items-center gap-4 pt-6">
            <div className="flex -space-x-3">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&h=64" alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
              <div className="w-10 h-10 rounded-full bg-brand-900 border-2 border-white flex items-center justify-center text-white text-xs font-bold">+2k</div>
            </div>
            <p className="text-sm font-medium text-slate-600">Students joined this week</p>
          </div>
        </div>

        <div className="relative hidden lg:block h-[600px]">
          {/* Hero Image Composition */}
          <div className="absolute top-5 right-10 w-72 h-80 bg-brand-accent rounded-2xl border-2 border-brand-dark shadow-brutal-lg z-10 rotate-3 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1520277739336-7bf67edfa768?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="Student hanging out" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg border-2 border-brand-dark">
              <p className="font-bold text-xs">The Hive, Kano, Danbari</p>
              <p className="text-xs text-brand-600">Starting $350/mo</p>
            </div>
          </div>

          <div className="absolute -bottom-20 right-10 w-72 h-80 bg-brand-accent rounded-2xl border-2 border-brand-dark shadow-brutal-lg z-10 -rotate-6 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1520277739336-7bf67edfa768?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="Student hanging out" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg border-2 border-brand-dark">
              <p className="font-bold text-xs">Campus, Kano, Danbari</p>
              <p className="text-xs text-brand-600">Starting $350/mo</p>
            </div>
          </div>

          <div className="absolute bottom-20 left-10 w-64 h-72 bg-brand-400 rounded-2xl border-2 border-brand-dark shadow-brutal-lg -rotate-6 overflow-hidden z-20">
               <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="Cozy dorm" />
               <div className="absolute top-4 right-4 bg-white rounded-full p-2 border-2 border-brand-dark shadow-sm">
                   <i className="ph-fill ph-heart text-red-500"></i>
               </div>
               <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg border-2 border-brand-dark flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <i className="ph-fill ph-check-circle text-xl"></i>
                    </div>
                    <div>
                        <p className="font-bold text-xs text-slate-900">Verified Listing</p>
                        <p className="text-[0.625rem] text-brand-600 w-50">Inspected by HostelFlow team</p>
                    </div>
                
              </div>
               {/* Floating Cards */}
                {/* <div className="absolute bottom-6 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-white/50 shadow-lg flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <i className="ph-fill ph-check-circle text-2xl"></i>
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">Verified Listing</p>
                        <p className="text-xs text-slate-500">Inspected by HostelFlow team</p>
                    </div>
                    <div className="ml-auto">
                        <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg">$450/mo</span>
                    </div>
                </div> */}
          </div>

          {/* Decorative shapes */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-300 rounded-full blur-[100px] opacity-50 z-0"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
