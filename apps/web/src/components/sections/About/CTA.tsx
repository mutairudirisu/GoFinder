"use client";

import { useRouter } from 'next/navigation';

export const CTA = () => {
  const router = useRouter();

  return (
    <section className="py-20 bg-brand-dark text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">Ready to find your place?</h2>
        <p className="text-gray-300 text-lg mb-10">
          Join thousands of students who've already found their perfect home through HostelFinder.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => router.push('/listings')} className="px-8 py-4 bg-brand-500 text-brand-dark font-bold text-lg rounded-xl border-2 border-brand-dark shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
            Browse Listings
          </button>
          <button onClick={() => router.push('/contact')} className="px-8 py-4 bg-white/10 text-white font-bold text-lg rounded-xl border-2 border-white/20 hover:bg-white/20 transition-all">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};
