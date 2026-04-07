"use client";

import { useState } from "react";
import Modal from "@repo/ui/modal";

interface ReferHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userId: string;
}

export const ReferHostModal = ({
  isOpen,
  onClose,
  userName,
  userId,
}: ReferHostModalProps) => {
  const [copied, setCopied] = useState(false);

  // Generate referral link - format: domain/referral?code=username_userid
  const referralCode = `${userName.replace(/\s+/g, "_").toLowerCase()}_${userId.slice(0, 8)}`;
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const referralLink = `${baseUrl}/referral?code=${referralCode}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Refer a Host"
      size="lg"
      showCloseButton={true}
    >
      <div className="space-y-4">
        {/* Benefits Section */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-brand-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-brand-100">
            <h3 className="font-bold text-base sm:text-lg text-brand-900 mb-2 sm:mb-3">
              Share the hosting opportunity!
            </h3>
            <p className="text-slate-700 leading-relaxed mb-3 sm:mb-4 text-xs sm:text-sm">
              Know someone who wants to start earning with GIGS Rentals? Share your unique referral link and both of you get rewarded.
            </p>

            {/* Benefits List - Only Show if not copied */}
            {!copied && (
              <div className="space-y-2">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ph-bold ph-check text-white text-xs"></i>
                  </div>
                  <span className="text-xs sm:text-xs text-slate-700">
                    Your referral gets verified faster
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ph-bold ph-check text-white text-xs"></i>
                  </div>
                  <span className="text-xs sm:text-xs text-slate-700">
                    Earn commission on their first 5 bookings
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ph-bold ph-check text-white text-xs"></i>
                  </div>
                  <span className="text-xs sm:text-xs text-slate-700">
                    No referral limit – refer as many as you want
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Success Message */}
          {copied && (
            <div className="bg-emerald-50 rounded-xl p-3 sm:p-4 border border-emerald-200 flex items-center gap-2 sm:gap-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <i className="ph-fill ph-check text-white text-xs"></i>
              </div>
              <span className="text-xs sm:text-base font-medium text-emerald-700">
                Link copied to clipboard!
              </span>
            </div>
          )}
        </div>

        {/* Invite Link Section */}
        <div className="space-y-2">
          <label className="block text-sm sm:text-base font-semibold text-slate-700">
            Your referral link
          </label>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2 sm:p-3 group hover:border-brand-200 transition-colors">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-base font-mono text-slate-600 truncate">
                {referralLink}
              </p>
            </div>
            <button
              onClick={handleCopyLink}
              className="flex-shrink-0 p-1.5 sm:p-2 hover:bg-brand-50 rounded-lg transition-colors text-slate-600 hover:text-brand-600"
              title="Copy link"
              aria-label="Copy referral link"
            >
              {copied ? (
                <i className="ph-fill ph-check text-base sm:text-lg text-emerald-500"></i>
              ) : (
                <i className="ph-bold ph-copy text-base sm:text-lg"></i>
              )}
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Share this link with someone looking to start hosting
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleCopyLink}
          className="w-full px-4 py-2 sm:py-3 bg-brand-500 text-white font-semibold rounded-lg hover:bg-brand-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <i className="ph-bold ph-share-network text-base sm:text-lg"></i>
          {copied ? "Link Copied!" : "Copy & Share"}
        </button>
      </div>
    </Modal>
  );
};

export default ReferHostModal;
