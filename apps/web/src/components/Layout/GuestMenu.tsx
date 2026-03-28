import Link from "next/link";
import { DASHBOARD_URL } from "./header.constants";

export const GuestMenu = ({ onClose }: { onClose: () => void }) => (
  <>
    <div className="px-4 py-3 border-b border-brand-100">
      <p className="text-xs text-brand-600 font-medium mb-2">Sign up or Log in</p>
      <div className="space-y-2">
        <Link href={`${DASHBOARD_URL}/auth/signup`} onClick={onClose}
          className="flex items-center justify-between px-4 py-3 bg-brand-500 text-white rounded-xl font-bold">
          <span>Sign Up</span><i className="ph-bold ph-arrow-right" />
        </Link>
        <Link href={`${DASHBOARD_URL}/auth/login`} onClick={onClose}
          className="flex items-center justify-between px-4 py-3 border-2 border-brand-200 rounded-xl font-bold text-brand-600">
          <span>Log in</span><i className="ph-bold ph-arrow-right" />
        </Link>
      </div>
    </div>
    <div className="py-2">
      <Link
        href={`${DASHBOARD_URL}/listings`}
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
      >
        <i className="ph ph-buildings text-xl text-brand-500"></i>
        <span className="font-medium text-brand-700">Browse Listings</span>
      </Link>
      <Link
        href="/about-us"
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
      >
        <i className="ph ph-users text-xl text-brand-500"></i>
        <span className="font-medium text-brand-700">About Us</span>
      </Link>
      <Link
        href="/pricing"
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
      >
        <i className="ph ph-tag text-xl text-brand-500"></i>
        <span className="font-medium text-brand-700">Pricing</span>
      </Link>
      <div className="border-t border-brand-100 my-2"></div>
      <Link
        href="/contact"
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
      >
        <i className="ph ph-question text-xl text-brand-500"></i>
        <span className="font-medium text-brand-700">Help Center</span>
      </Link>
    </div>
  </>
);