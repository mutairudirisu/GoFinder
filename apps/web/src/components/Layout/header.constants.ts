export const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3001";

export const NAV_LINKS = [
  { label: "Listings", href: `${DASHBOARD_URL}/` },
  { label: "About Us", href: "/about-us" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];