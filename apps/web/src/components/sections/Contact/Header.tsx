"use client";

import { useRouter } from 'next/navigation';

export const Header = () => {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b-2 border-brand-dark">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand-500 rounded-lg border-2 border-brand-dark flex items-center justify-center shadow-brutal-sm group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
            <i className="ph-bold ph-house-line text-xl text-white"></i>
          </div>
          <span className="font-display font-bold text-2xl tracking-tight">Hostel<span className="text-brand-600">Finder</span></span>
        </button>

        <nav className="hidden md:flex items-center gap-8 font-sans font-medium">
          <button onClick={() => router.push('/')} className="text-slate-500 hover:text-brand-dark transition-colors">Home</button>
          <button onClick={() => router.push('/about-us')} className="text-slate-500 hover:text-brand-dark transition-colors">About Us</button>
          <button onClick={() => router.push('/pricing')} className="text-slate-500 hover:text-brand-dark transition-colors">Pricing</button>
          <button onClick={() => router.push('/contact')} className="relative text-brand-dark py-2">
            Contact
            <span className="absolute bottom-0 left-0 w-full h-1 bg-brand-500 rounded-full"></span>
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <button className="hidden md:block text-sm font-bold hover:text-brand-600 transition-colors">Log in</button>
          <button className="px-5 py-2.5 bg-brand-dark text-white font-bold rounded-lg border-2 border-brand-dark hover:bg-brand-accent hover:border-brand-accent hover:-translate-y-1 hover:shadow-brutal transition-all text-sm">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};
