"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string, location: string) => void;
  locations: string[];
}

export const SearchBar = ({ onSearch, locations }: SearchBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [showLocations, setShowLocations] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocations(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    onSearch(searchQuery, selectedLocation);
    setIsExpanded(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Main Search Container */}
      <div className={`
        relative bg-white rounded-3xl shadow-lg transition-all duration-500 overflow-hidden
        ${isExpanded 
          ? 'shadow-[0_20px_60px_rgba(34,197,94,0.15)] ring-2 ring-brand-100' 
          : 'shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
        }
      `}>
        {/* Animated Background */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-brand-50/50 via-white to-brand-50/30
          opacity-0 transition-opacity duration-500
          ${isExpanded ? 'opacity-100' : ''}
        `} />

        {/* Large Search Icon (Always Visible) */}
        <div 
          className={`
            flex items-center gap-4 p-4 cursor-pointer transition-all duration-300
            ${isExpanded ? 'border-b border-slate-100' : ''}
          `}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Search Icon Circle */}
          <motion.div 
            className={`
              relative flex items-center justify-center
              bg-gradient-to-br from-brand-500 to-brand-600
              rounded-2xl shadow-lg shadow-brand-500/30
              transition-all duration-300
              ${isExpanded ? 'w-14 h-14' : 'w-20 h-20'}
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="ph-bold ph-magnifying-glass text-white text-2xl"></i>
            
            {/* Animated Ring - Only animate when not expanded */}
            {!isExpanded && (
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-brand-300"
                animate={{ 
                  scale: [1.1, 1.3, 1.1],
                  opacity: [0, 0.5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>

          {/* Search Text */}
          <div className="flex-1">
            <h3 className={`
              font-display font-bold text-brand-dark transition-all duration-300
              ${isExpanded ? 'text-lg' : 'text-xl'}
            `}>
              {isExpanded ? 'Search Properties' : 'Start Searching'}
            </h3>
            <p className={`
              text-slate-500 transition-all duration-300
              ${isExpanded ? 'text-sm' : 'text-base'}
            `}>
              {isExpanded ? 'Find your perfect space' : 'Search by location, property type, or amenities'}
            </p>
          </div>

          {/* Expand Indicator */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="hidden md:flex w-10 h-10 items-center justify-center bg-slate-100 rounded-full"
          >
            <i className="ph-bold ph-caret-down text-slate-600"></i>
          </motion.div>
        </div>

        {/* Expanded Search Fields */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <i className="ph ph-magnifying-glass text-slate-400 text-xl"></i>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search by property name, amenities..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-300 focus:bg-white focus:outline-none transition-all duration-300 text-slate-700 placeholder:text-slate-400 font-medium"
                  />
                </div>

                {/* Location Dropdown */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative" ref={locationRef}>
                    <button
                      onClick={() => setShowLocations(!showLocations)}
                      className="w-full flex items-center justify-between px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl hover:border-brand-200 hover:bg-white transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <i className="ph ph-map-pin text-slate-400 text-xl"></i>
                        <span className="text-slate-600 font-medium">
                          {selectedLocation}
                        </span>
                      </div>
                      <i className={`ph-bold ph-caret-down text-slate-400 transition-transform ${showLocations ? 'rotate-180' : ''}`}></i>
                    </button>

                    {/* Location Dropdown Menu */}
                    <AnimatePresence>
                      {showLocations && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-50 w-full mt-2 bg-white border-2 border-slate-100 rounded-2xl shadow-xl overflow-hidden"
                        >
                          {locations.map((location) => (
                            <button
                              key={location}
                              onClick={() => {
                                setSelectedLocation(location);
                                setShowLocations(false);
                              }}
                              className={`
                                w-full px-4 py-3 text-left flex items-center gap-2 transition-colors
                                ${selectedLocation === location 
                                  ? 'bg-brand-50 text-brand-600 font-medium' 
                                  : 'text-slate-600 hover:bg-slate-50'
                                }
                              `}
                            >
                              <i className="ph ph-map-pin"></i>
                              {location}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Search Button */}
                  <motion.button
                    onClick={handleSearch}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="
                      flex items-center justify-center gap-2
                      bg-gradient-to-r from-brand-500 to-brand-600
                      text-white font-bold text-sm md:text-base
                      px-6 py-4 rounded-2xl
                      shadow-lg
                      hover:shadow-brutal hover:-translate-y-1
                      transition-all duration-300
                    "
                  >
                    <i className="ph-bold ph-magnifying-glass"></i>
                    <span className="hidden sm:inline">Search</span>
                  </motion.button>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs sm:text-sm text-slate-500 font-medium">Quick search:</span>
                  {['Hostels', 'Apartments', 'Campus', 'Pet'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag.toLowerCase())}
                      className="px-3 py-1 sm:py-1.5 bg-gradient-to-r from-brand-50 to-brand-100 hover:from-brand-100 hover:to-brand-200 text-brand-700 text-xs sm:text-sm rounded-full font-medium transition-all duration-200 hover:shadow-md"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SearchBar;
