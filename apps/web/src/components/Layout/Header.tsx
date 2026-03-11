"use client";

import Link from "next/link";
const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3001";

export const Header = () => {

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand-500 rounded-lg border-2 border-brand-dark flex items-center justify-center shadow-brutal-sm group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
            <i className="ph-bold ph-house-line text-xl text-white"></i>
          </div>
          <span className="font-display font-bold text-2xl tracking-tight">
            Hostel<span className="text-brand-600">Finder</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 font-sans font-medium">
          <a href="#" className="relative text-brand-dark py-2">
            Home
            <span className="absolute bottom-0 left-0 w-full h-1 bg-brand-500 rounded-full"></span>
          </a>
          <Link
            href="/about-us"
            className="text-slate-500 hover:text-brand-dark transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/pricing"
            className="text-slate-500 hover:text-brand-dark transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className="text-slate-500 hover:text-brand-dark transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link
            href={`${DASHBOARD_URL}/signup`}
            className="hidden md:block text-sm font-bold hover:text-brand-600 transition-colors"
          >
            Log in
          </Link>
          <Link
            href={`${DASHBOARD_URL}/login`}
            className="px-5 py-2.5 bg-black text-white font-bold rounded-lg border-2 border-brand-dark hover:bg-brand-accent hover:border-brand-accent hover:-translate-y-1 hover:shadow-brutal transition-all text-sm"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};
