"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Property } from "@/app/listings/data";

interface ListingDetailActionsProps {
  property: Property;
}

export const ListingDetailActions = ({ property }: ListingDetailActionsProps) => {
  const [activeTab, setActiveTab] = useState<"message" | "roommates" | "bills" | "contact">("message");

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 overflow-hidden w-full">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-gray-100 scrollbar-hide">
        <button
          onClick={() => setActiveTab("message")}
          className={`
            flex-1 py-2.5 sm:py-3 px-2 sm:px-3 text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1
            transition-all duration-300 min-w-[70px] sm:min-w-[80px]
            whitespace-nowrap
            ${activeTab === "message" 
              ? "bg-green-50 text-green-700 border-b-2 border-green-500" 
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}
          `}
        >
          <i className="ph-bold ph-chat-circle-dots text-sm sm:text-base"></i>
          <span className="hidden xs:inline">Message</span>
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`
            flex-1 py-2.5 sm:py-3 px-2 sm:px-3 text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1
            transition-all duration-300 min-w-[70px] sm:min-w-[80px]
            whitespace-nowrap
            ${activeTab === "contact" 
              ? "bg-purple-50 text-purple-700 border-b-2 border-purple-500" 
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}
          `}
        >
          <i className="ph-bold ph-phone text-sm sm:text-base"></i>
          <span className="hidden xs:inline">Contact</span>
        </button>
        {property.needsRoommates && (
          <button
            onClick={() => setActiveTab("roommates")}
            className={`
              flex-1 py-2.5 sm:py-3 px-2 sm:px-3 text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1
              transition-all duration-300 min-w-[70px] sm:min-w-[80px]
              whitespace-nowrap
              ${activeTab === "roommates" 
                ? "bg-amber-50 text-amber-700 border-b-2 border-amber-500" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}
            `}
          >
            <i className="ph-bold ph-users-three text-sm sm:text-base"></i>
            <span className="hidden sm:inline">Roommates</span>
          </button>
        )}
        <button
          onClick={() => setActiveTab("bills")}
          className={`
            flex-1 py-2.5 sm:py-3 px-2 sm:px-3 text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1
            transition-all duration-300 min-w-[70px] sm:min-w-[80px]
            whitespace-nowrap
            ${activeTab === "bills" 
              ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500" 
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}
          `}
        >
          <i className="ph-bold ph-receipt text-sm sm:text-base"></i>
          {property.needsRoommates ? <span className="hidden md:inline">Split Bills</span> : <span className="hidden md:inline">Pay Bills</span>}
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {/* Message Host Tab */}
          {activeTab === "message" && (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="text-center mb-4">
                <div className="w-14 h-14 mx-auto mb-2 rounded-full overflow-hidden border-3 border-green-100">
                  <img
                    src={property.landlord.image}
                    alt={property.landlord.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{property.landlord.name}</h3>
                {property.landlord.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-green-600">
                    <i className="ph-fill ph-seal-check"></i>
                    Verified
                  </span>
                )}
              </div>

              <Link 
                href={`/listings/${property.id}/message`}
                className="w-full py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <i className="ph-bold ph-chat-circle-dots"></i>
                Open Message Page
              </Link>

              <p className="text-[10px] text-gray-500 text-center">
                Send a message to discuss availability and details
              </p>

              {property.isStudentSpace && (
                <div className="p-2 bg-purple-50 rounded-xl flex items-start gap-2">
                  <i className="ph-fill ph-graduation-cap text-purple-600 text-lg"></i>
                  <div>
                    <p className="text-xs font-semibold text-purple-700">Student Space</p>
                    <p className="text-[10px] text-purple-600">Ask about student discounts!</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="text-center mb-4">
                <div className="w-14 h-14 mx-auto mb-2 rounded-full overflow-hidden border-3 border-purple-100">
                  <img
                    src={property.landlord.image}
                    alt={property.landlord.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{property.landlord.name}</h3>
                <p className="text-xs text-gray-500">Landlord</p>
              </div>

              <Link 
                href={`/listings/${property.id}/contact`}
                className="w-full py-2.5 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <i className="ph-bold ph-phone-dispatch"></i>
                View Contact Info
              </Link>

              <div className="grid grid-cols-2 gap-2">
                <button className="py-2 bg-green-50 text-green-700 font-medium rounded-xl hover:bg-green-100 transition-colors flex items-center justify-center gap-1 text-xs">
                  <i className="ph-bold ph-chat-circle-dots"></i>
                  Chat
                </button>
                <button className="py-2 bg-blue-50 text-blue-700 font-medium rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 text-xs">
                  <i className="ph-bold ph-video-camera"></i>
                  Video Call
                </button>
              </div>

              <p className="text-[10px] text-gray-500 text-center">
                Available Mon-Sat, 9AM-6PM
              </p>
            </motion.div>
          )}

          {/* Find Roommates Tab */}
          {activeTab === "roommates" && property.needsRoommates && (
            <motion.div
              key="roommates"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-2">
                  <i className="ph-fill ph-users-three text-amber-600 text-2xl"></i>
                </div>
                <p className="text-xs text-gray-500">
                  Needs {property.roommatesNeeded || 2} more roommate{property.roommatesNeeded !== 1 ? 's' : ''}
                </p>
              </div>

              <Link 
                href={`/listings/${property.id}/roommates`}
                className="w-full py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
              >
                <i className="ph-bold ph-magnifying-glass"></i>
                Find Roommates
              </Link>

              <div className="flex gap-2">
                <button className="flex-1 py-2 border-2 border-amber-300 text-amber-700 font-medium rounded-xl hover:bg-amber-50 transition-colors flex items-center justify-center gap-1 text-xs">
                  <i className="ph-bold ph-user-plus"></i>
                  Invite
                </button>
                <button className="flex-1 py-2 border-2 border-amber-300 text-amber-700 font-medium rounded-xl hover:bg-amber-50 transition-colors flex items-center justify-center gap-1 text-xs">
                  <i className="ph-bold ph-share-network"></i>
                  Share
                </button>
              </div>
            </motion.div>
          )}

          {/* Split Bills / Pay Bills Tab */}
          {activeTab === "bills" && (
            <motion.div
              key="bills"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {property.needsRoommates ? (
                // Split Bills for roommate properties
                <>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2">
                      <i className="ph-fill ph-receipt text-blue-600 text-2xl"></i>
                    </div>
                    <p className="text-xs text-gray-500">
                      Split bills with roommates
                    </p>
                  </div>

                  <Link 
                    href={`/listings/${property.id}/split-bills`}
                    className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="ph-bold ph-calculator"></i>
                    Calculate Split
                  </Link>

                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs text-gray-600 mb-2">Quick Estimate:</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Monthly Total:</span>
                      <span className="font-bold text-gray-800">₦{(property.price + 150).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Per Person:</span>
                      <span className="font-bold text-green-600">₦{Math.round((property.price + 150) / 2).toLocaleString()}</span>
                    </div>
                  </div>
                </>
              ) : (
                // Pay Bills for regular properties
                <>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
                      <i className="ph-fill ph-credit-card text-green-600 text-2xl"></i>
                    </div>
                    <p className="text-xs text-gray-500">
                      Pay your rent and bills
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Monthly Rent</span>
                      <span className="font-bold text-green-600">₦{property.price.toLocaleString()}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Security Deposit</span>
                      <span className="font-bold text-gray-800">₦{Math.round(property.price * 0.5).toLocaleString()}</span>
                    </div>
                  </div>

                  <button className="w-full py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    <i className="ph-bold ph-credit-card"></i>
                    Pay Now
                  </button>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-1 text-xs">
                      <i className="ph-bold ph-bank"></i>
                      Bank Transfer
                    </button>
                    <button className="flex-1 py-2 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-1 text-xs">
                      <i className="ph-bold ph-credit-card"></i>
                      Card
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ListingDetailActions;
