import Link from "next/link";

interface LogoProps {
  showWordmark?: boolean;
  className?: string;
}

export const Logo = ({ showWordmark = true, className = "" }: LogoProps) => (
  <Link href="/" className={`flex items-center gap-2 group flex-shrink-0 ${className}`}>
    <div className="w-9 h-9 bg-brand-500 rounded-full border-2 border-brand-dark flex items-center justify-center shadow-sm group-hover:scale-105 transition-all flex-shrink-0">
      <i className="ph-bold ph-house-line text-lg text-white"></i>
    </div>
    {showWordmark && (
      <>
        <span className="font-display font-bold text-xl sm:text-2xl md:text-3xl tracking-tight hidden sm:inline-block">
          GIGS<span className="text-brand-600">Rentals</span>
        </span>
        <span className="font-display font-bold text-lg sm:hidden">
          <span className="text-brand-500">GR</span>
        </span>
      </>
    )}
  </Link>
);