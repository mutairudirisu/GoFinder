import Link from "next/link";
import { NAV_LINKS } from "./header.constants";

export const NavLinks = () => (
  <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-sans font-medium">
    <Link href="/" className="relative text-brand-dark py-2 text-sm lg:text-base">
      Home
      <span className="absolute bottom-0 left-0 w-full h-1 bg-brand-500 rounded-full" />
    </Link>
    {NAV_LINKS.map(({ label, href }) => (
      <Link key={href} href={href}
        className="text-slate-500 hover:text-brand-dark transition-colors text-sm lg:text-base">
        {label}
      </Link>
    ))}
  </nav>
);