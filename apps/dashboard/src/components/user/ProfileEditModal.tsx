"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileEditModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  placeholder: string;
  currentValue: string;
  maxLength?: number;
  onSave: (value: string) => void;
  onClose: () => void;
}

export function ProfileEditModal({
  isOpen,
  title,
  description,
  placeholder,
  currentValue,
  maxLength = 40,
  onSave,
  onClose,
}: ProfileEditModalProps) {
  const [value, setValue] = useState(currentValue);

  // Update internal state when currentValue changes
  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-[32px] shadow-2xl max-w-lg w-full overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 pb-0">
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-50 text-brand-600 transition-colors mb-4"
              >
                <i className="ph-bold ph-x text-lg"></i>
              </button>
              
              <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2 leading-tight">
                {title}
              </h2>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-6">
                {description}
              </p>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              <div className="relative">
                <textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value.slice(0, maxLength))}
                  placeholder={placeholder}
                  className="w-full px-5 py-4 bg-white border border-brand-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent min-h-[120px] text-slate-900 text-lg placeholder:text-slate-300 resize-none transition-all"
                  autoFocus
                />
                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-brand-400 uppercase tracking-wider">
                  {maxLength - value.length} characters available
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 flex justify-end">
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
