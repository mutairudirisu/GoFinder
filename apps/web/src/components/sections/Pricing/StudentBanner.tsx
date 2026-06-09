"use client";

import Link from 'next/link';

export const StudentBanner = () => {

  return (
    <section className="py-12 bg-gradient-to-r from-brand-accent to-brand-500">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl border-2 border-brand-dark flex items-center justify-center shadow-brutal-sm">
              <i className="ph-fill ph-graduation-cap text-3xl text-brand-dark"></i>
            </div>
            <div>
              <h3 className="font-display font-bold text-2xl text-white mb-1">Free for Students</h3>
              <p className="text-white/90">Search, match, and manage payments at zero cost.</p>
            </div>
          </div>
          <Link href="/listings" className="px-8 py-4 bg-white text-brand-dark font-bold rounded-xl border-2 border-brand-dark hover:shadow-brutal transition-all whitespace-nowrap">
            Start Searching Free
          </Link>
        </div>
      </div>
    </section>
  );
};
