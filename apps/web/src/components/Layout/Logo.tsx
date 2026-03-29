import Link from "next/link";

export const Logo = () => (
  <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-brand-500 rounded-lg border-2 border-brand-dark flex items-center justify-center shadow-brutal-sm group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all flex-shrink-0">
      <i className="ph-bold ph-house-line text-lg sm:text-xl text-white"></i>
    </div>
    <span className="font-display font-bold text-xl sm:text-2xl md:text-3xl tracking-tight hidden sm:inline-block">
      GIGS<span className="text-brand-600">Rentals</span>
    </span>
    <span className="font-display font-bold text-lg sm:hidden">
      <span className="text-brand-500">GR</span>
    </span>
  </Link>
);