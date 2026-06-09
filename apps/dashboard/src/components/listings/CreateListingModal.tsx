"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Listing Categories
const LISTING_CATEGORIES = [
  { 
<<<<<<< HEAD
    id: "home", 
=======
    id: "accommodation", 
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
    title: "Home / Apartment / Hostel", 
    description: "List your property for rent", 
    icon: "ph-house-line", 
    color: "blue",
    comingSoon: false
  },
  { 
    id: "experience", 
    title: "Share Experiences", 
    description: "Host tours, activities & events", 
    icon: "ph-map-trifold", 
    color: "pink",
    comingSoon: true
  },
  { 
<<<<<<< HEAD
    id: "service", 
=======
    id: "services", 
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
    title: "Services", 
    description: "Offer cleaning, transport & more", 
    icon: "ph-wrench", 
    color: "teal",
    comingSoon: true
  },
];

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateListingModal({ isOpen, onClose }: CreateListingModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleClose = () => {
    onClose();
  };

  const handleNext = () => {
    if (selectedCategory) {
<<<<<<< HEAD
      window.location.href = `/becoming-a-host/address?category=${selectedCategory}`;
=======
      // Navigate to create page with selected category
      window.location.href = `/listings/create?category=${selectedCategory}`;
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl text-center max-w-6xl w-full relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <i className="ph-bold ph-x text-slate-600"></i>
            </button>

            {/* Header */}
            <div className="mb-8">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ph-bold ph-plus-circle text-3xl text-brand-600"></i>
              </div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-brand-dark mb-2">
                Create a New Listing
              </h2>
              <p className="text-slate-500">Choose what you want to list to get started</p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {LISTING_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => !cat.comingSoon && setSelectedCategory(cat.id)}
                  disabled={cat.comingSoon}
                  className={`
                    p-4 sm:p-6 rounded-2xl border-2 text-left transition-all duration-300 relative overflow-hidden min-h-[160px] flex flex-col w-full
                    ${cat.comingSoon 
                      ? 'border-slate-200 bg-slate-50 opacity-75 cursor-not-allowed' 
                      : selectedCategory === cat.id
                        ? 'border-brand-500 bg-brand-50 shadow-lg shadow-brand-500/20'
                        : 'border-slate-200 bg-white hover:border-brand-500 hover:shadow-lg hover:-translate-y-1'
                    }
                  `}
                >
                  {cat.comingSoon && (
                    <span className="absolute top-3 right-3 px-2 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-full">
                      Coming Soon
                    </span>
                  )}
                  <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center mb-4
                    ${cat.color === 'blue' ? 'bg-blue-100 text-blue-600' : ''}
                    ${cat.color === 'pink' ? 'bg-pink-100 text-pink-600' : ''}
                    ${cat.color === 'teal' ? 'bg-teal-100 text-teal-600' : ''}
                  `}>
                    <i className={`ph-bold ${cat.icon} text-2xl`}></i>
                  </div>
                  <h3 className="font-display font-bold text-lg text-brand-dark mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-slate-500">{cat.description}</p>
                  
                  {!cat.comingSoon && (
                    <div className="mt-auto pt-4 flex items-center justify-end text-brand-600 font-medium text-sm">
                      {selectedCategory === cat.id ? (
                        <>
                          <i className="ph-bold ph-check-circle mr-1"></i>
                          Selected
                        </>
                      ) : (
                        <>
                          Select
                          <i className="ph-bold ph-arrow-right ml-1"></i>
                        </>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Footer Note */}
            <div className="bg-slate-50 rounded-xl p-4 text-center mb-6">
              <p className="text-sm text-slate-600">
                <i className="ph-bold ph-info text-brand-600 mr-2"></i>
                Already have a listing?{" "}
                <Link href="/hosting" className="text-brand-600 font-semibold hover:underline">
                  View your listings
                </Link>
              </p>
            </div>

            {/* Next Button */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedCategory}
                className={`
                  px-6 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm min-w-[120px]
                  ${selectedCategory
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-brutal hover:-translate-y-1'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }
                `}
              >
                Next
                <i className="ph-bold ph-arrow-right"></i>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
