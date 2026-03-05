"use client";

import { useRouter } from "next/navigation";

export const Footer = () => {
  const router = useRouter();

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-dark rounded-lg flex items-center justify-center">
                <i className="ph-bold ph-house-line text-white"></i>
              </div>
              <span className="font-display font-bold text-xl">HostelFinder</span>
            </a>
            <p className="text-sm text-gray-500 mb-6">Making student living simple, affordable, and actually fun.</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-brand-dark transition-colors"><i className="ph-fill ph-twitter-logo text-xl"></i></a>
              <a href="#" className="text-gray-400 hover:text-brand-dark transition-colors"><i className="ph-fill ph-instagram-logo text-xl"></i></a>
              <a href="#" className="text-gray-400 hover:text-brand-dark transition-colors"><i className="ph-fill ph-tiktok-logo text-xl"></i></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-brand-dark">Search Listings</a></li>
              <li><a href="#" className="hover:text-brand-dark">Roommate Match</a></li>
              <li><a href="#" className="hover:text-brand-dark">For Landlords</a></li>
              <li><button onClick={() => router.push('/pricing')} className="hover:text-brand-dark">Pricing</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><button onClick={() => router.push('/about-us')} className="hover:text-brand-dark">About Us</button></li>
              <li><a href="#" className="hover:text-brand-dark">Careers</a></li>
              <li><a href="#" className="hover:text-brand-dark">Blog</a></li>
              <li><button onClick={() => router.push('/contact')} className="hover:text-brand-dark">Contact</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-brand-dark">Help Center</a></li>
              <li><a href="#" className="hover:text-brand-dark">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-brand-dark">Terms of Service</a></li>
              <li><a href="#" className="hover:text-brand-dark">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">&copy; 2023 HostelFinder Inc. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-brand-dark">Privacy</a>
            <a href="#" className="hover:text-brand-dark">Terms</a>
            <a href="#" className="hover:text-brand-dark">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};