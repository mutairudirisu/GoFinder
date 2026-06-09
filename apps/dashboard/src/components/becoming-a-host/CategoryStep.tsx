"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CategoryStepProps {
  selectedCategory: string | null;
  onSelect: (category: string) => void;
  onClose?: () => void;
}

const categories = [
  { id: "home", label: "Home", icon: "ph-house-line", color: "text-blue-500", bg: "bg-blue-50" },
  { id: "experience", label: "Experience", icon: "ph-balloon", color: "text-rose-500", bg: "bg-rose-50" },
  { id: "service", label: "Service", icon: "ph-wrench", color: "text-amber-500", bg: "bg-amber-50" },
];

/**
 * CategoryStep component for selecting the type of listing (Home, Experience, Service).
 * Acts as a drawer on mobile (drag to close) and a centered modal on large screens.
 * 
 * @param selectedCategory - The currently selected category ID
 * @param onSelect - Callback function when a category is selected
 * @param onClose - Optional callback to handle closing the overlay
 */
export const CategoryStep = ({ selectedCategory, onSelect, onClose }: CategoryStepProps) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push("/hosting");
    }
  };

  // Animation variants for different screens
  const containerVariants = {
    hidden: isMobile 
      ? { y: "100%", opacity: 0.8 } 
      : { opacity: 0, scale: 0.9, y: 30 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 250,
        mass: 0.8
      }
    },
    exit: isMobile 
      ? { y: "100%", opacity: 0, transition: { duration: 0.3 } } 
      : { opacity: 0, scale: 0.9, y: 30, transition: { duration: 0.2 } }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 overflow-hidden">
      {/* Backdrop with Blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
      />

      <motion.div
        key="category-drawer"
        variants={containerVariants as import("framer-motion").Variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        drag={isMobile ? "y" : false}
        dragConstraints={{ top: 0 }}
        dragElastic={0.15}
        onDragEnd={(_, info) => {
          // Drag down to close threshold
          if (isMobile && (info.offset.y > 120 || info.velocity.y > 400)) {
            handleClose();
          }
        }}
        className="relative w-full max-w-2xl bg-white rounded-t-[40px] md:rounded-[40px] shadow-2xl flex flex-col h-auto max-h-[85vh] md:max-h-[90vh] border border-slate-100 overflow-hidden"
      >
        {/* Drag Handle (Mobile only) - Visual indicator for dragging */}
        <div className="w-full pt-4 pb-2 md:hidden cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto"></div>
        </div>

        <div className="px-6 md:px-10 pb-10 flex-1 overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 mt-4">
            <div className="w-10 hidden md:block"></div> {/* Spacer for desktop center alignment */}
            <h2 className="flex-1 text-xl md:text-2xl font-display font-semibold text-slate-900 text-center">
              What would you like to host?
            </h2>
            <button 
              onClick={handleClose}
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all active:scale-90"
              aria-label="Close"
            >
              <i className="ph ph-x text-2xl"></i>
            </button>
          </div>

          {/* Vertical List of Items */}
          <div className="space-y-4 px-2">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-between p-3.5 pl-8 md:pl-10 rounded-full border-2 transition-all group ${
                  selectedCategory === cat.id
                    ? "border-brand-500 bg-brand-50/40 shadow-sm"
                    : "border-slate-100 hover:border-brand-200 hover:bg-slate-50 shadow-sm"
                }`}
              >
                <span className={`text-lg md:text-xl font-display font-medium ${selectedCategory === cat.id ? 'text-brand-700' : 'text-slate-700'}`}>
                  {cat.label}
                </span>
                <div className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full ${cat.bg} group-hover:scale-110 transition-transform shadow-sm`}>
                  <i className={`ph-bold ${cat.icon} text-2xl md:text-3xl ${cat.color}`}></i>
                </div>
              </motion.button>
            ))}
          </div>
          
          <div className="mt-8 text-center px-4">
            <p className="text-sm text-slate-400">
              You can change your selection later in the hosting settings.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
