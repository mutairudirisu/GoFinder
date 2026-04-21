"use client";

import Link from "next/link";
export const WEB_URL =
  process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:8888";
export const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3001";

export const Footer = () => {
  return (
    <footer className="bg-white relative border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-dark rounded-lg flex items-center justify-center">
                <i className="ph-bold ph-house-line text-white"></i>
              </div>
              <span className="font-display font-bold text-xl">GIGSRental</span>
            </a>
            <p className="text-sm text-gray-500 mb-6">
              Making student living simple, affordable, and actually fun.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-brand-dark transition-colors"
              >
                <i className="ph-fill ph-twitter-logo text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-brand-dark transition-colors"
              >
                <i className="ph-fill ph-instagram-logo text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-brand-dark transition-colors"
              >
                <i className="ph-fill ph-tiktok-logo text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link
                  href={`${DASHBOARD_URL}/listings`}
                  className="hover:text-brand-dark"
                >
                  Search Listings
                </Link>
              </li>
              <li>
                <Link
                  href={`${WEB_URL}/roommate-match`}
                  className="hover:text-brand-dark"
                >
                  Roommate Match
                </Link>
              </li>
              <li>
                <Link
                  href={`${WEB_URL}/for-landlords`}
                  className="hover:text-brand-dark"
                >
                  For Landlords
                </Link>
              </li>
              <li>
                <Link
                  href={`${WEB_URL}/pricing`}
                  className="hover:text-brand-dark"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link
                  href={`${WEB_URL}/about-us`}
                  className="hover:text-brand-dark"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href={`${WEB_URL}/careers`}
                  className="hover:text-brand-dark"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href={`${WEB_URL}/blog`}
                  className="hover:text-brand-dark"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href={`${WEB_URL}/contact`}
                  className="hover:text-brand-dark"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href={`${WEB_URL}/faq`} className="hover:text-brand-dark">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href={`${WEB_URL}/help-center`}
                  className="hover:text-brand-dark"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href={`${WEB_URL}/safety-guidelines`}
                  className="hover:text-brand-dark"
                >
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href={`${WEB_URL}/terms`}
                  className="hover:text-brand-dark"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href={`${WEB_URL}/privacy`}
                  className="hover:text-brand-dark"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            &copy; 2023 GIGSRental Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <li>
              <Link
                href={`${WEB_URL}/privacy`}
                className="hover:text-brand-dark"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link href={`${WEB_URL}/terms`} className="hover:text-brand-dark">
                Terms
              </Link>
            </li>
            <li>
              <Link
                href={`${WEB_URL}/cookies`}
                className="hover:text-brand-dark"
              >
                Cookies
              </Link>
            </li>
          </div>
        </div>
      </div>
    </footer>
  );
};
