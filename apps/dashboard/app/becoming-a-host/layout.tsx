"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function BecomingAHostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isLocationStep = pathname.includes("/address") || pathname === "/becoming-a-host";
  const isListingFlow = pathname.includes("/about-your-place");

  // Determine if we should show the full header (Save & Exit)
  const showFullHeader = !isLocationStep && isListingFlow;

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-white flex-col">
      {/* Header */}
      <header className="h-20 px-6 md:px-12 flex flex-col justify-center sticky top-0 bg-white z-50 hidden">
=======
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="h-20 px-6 md:px-12 flex flex-col justify-center sticky top-0 bg-white z-50">
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg border-2 border-brand-dark flex items-center justify-center shadow-brutal-sm">
              <i className="ph-bold ph-house-line text-white"></i>
            </div>
            <span className="font-display font-bold text-xl text-brand-dark">GIGS</span>
          </Link>
          
          {showFullHeader && (
            <div className="flex justify-between md:justify-end gap-4 w-full md:w-auto">
              <button className="px-5 py-2.5 text-base font-bold border border-slate-200 rounded-full hover:bg-slate-50 transition-all flex items-center gap-2">
                Questions?
              </button>
              <button 
                onClick={() => router.push("/hosting")}
                className="px-5 py-2.5 text-base font-bold border border-slate-200 rounded-full hover:bg-slate-50 transition-all"
              >
                Save & exit
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {children}
      </main>
    </div>
  );
}
