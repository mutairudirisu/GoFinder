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
      className="w-full max-w-4xl mx-auto px-2 sm:px-0"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Main Search Container */}
      <div className={`
        relative bg-white rounded-2xl sm:rounded-3xl shadow-lg transition-all duration-500 overflow-visible
        ${isExpanded 
          ? 'shadow-[0_20px_60px_rgba(34,197,94,0.15)] ring-2 ring-green-100' 
          : 'shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
        }
      `}>
        {/* Animated Background */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-green-50/50 via-white to-green-50/30
          opacity-0 transition-opacity duration-500
          ${isExpanded ? 'opacity-500' : ''}
        `} />

        {/* Large Search Icon (Always Visible) */}
        <div 
          className={`
            flex items-center gap-2 sm:gap-4 p-2 sm:p-4 cursor-pointer transition-all duration-300
            ${isExpanded ? 'border-b border-gray-100' : ''}
          `}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Search Icon Circle */}
          <motion.div 
            className={`
              relative flex items-center justify-center
              bg-gradient-to-br from-green-500 to-green-600
              rounded-xl sm:rounded-2xl shadow-lg shadow-green-500/30
              transition-all duration-300
              ${isExpanded ? 'w-10 h-10 sm:w-14 sm:h-14' : 'w-12 h-12 sm:w-20 sm:h-20'}
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className={`ph-bold ph-magnifying-glass text-white ${isExpanded ? 'text-lg sm:text-2xl' : 'text-xl sm:text-2xl'}`}></i>
            
            {/* Animated Ring - Only animate when not expanded */}
            {!isExpanded && (
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-green-300 hidden sm:block"
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
          <div className="flex-1 min-w-0">
            <h3 className={`
              font-bold text-gray-800 font-display transition-all duration-300 truncate
              ${isExpanded ? 'text-sm sm:text-lg' : 'text-base sm:text-xl'}
            `}>
              {isExpanded ? 'Search Properties' : 'Start Searching'}
            </h3>
            <p className={`
              text-gray-500 transition-all duration-300 truncate hidden sm:block
              ${isExpanded ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}
            `}>
              {isExpanded ? 'Find your perfect space' : 'Search by location, property type, or amenities'}
            </p>
            <p className={`
              text-gray-500 transition-all duration-300 truncate sm:hidden text-xs
            `}>
              {isExpanded ? 'Find your space' : 'Search properties'}
            </p>
          </div>

          {/* Expand Indicator - Clickable */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex w-8 h-8 sm:w-10 sm:h-10 items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            type="button"
          >
            <i className="ph-bold ph-caret-down text-gray-600 text-sm sm:text-base"></i>
          </motion.button>
        </div>

        {/* Expanded Search Fields */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-visible"
            >
              <div className="p-2 sm:p-4 pt-0 space-y-3 sm:space-y-4 bg-white rounded-b-2xl sm:rounded-b-3xl">
                {/* Search Input */}
                <div className="relative">
                  <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">
                    <i className="ph ph-magnifying-glass text-gray-400 text-lg sm:text-xl"></i>
                  </div>
                  <input
                    id="search-query"
                    name="search-query"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search by property name, amenities..."
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl sm:rounded-2xl focus:border-green-300 focus:bg-white focus:outline-none transition-all duration-300 text-sm sm:text-base text-gray-700 placeholder:text-gray-400 font-medium"
                  />
                </div>

                {/* Location Dropdown */}
                <div className="grid md:grid-cols-2 gap-2 sm:gap-4">
                  <div className="relative" ref={locationRef}>
                    <button
                      onClick={() => setShowLocations(!showLocations)}
                      className="w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl sm:rounded-2xl hover:border-green-200 hover:bg-white transition-all duration-300"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <i className="ph ph-map-pin text-gray-400 text-lg sm:text-xl flex-shrink-0"></i>
                        <span className="text-gray-600 font-medium text-sm sm:text-base truncate">
                          {selectedLocation}
                        </span>
                      </div>
                      <i className={`ph-bold ph-caret-down text-gray-400 transition-transform flex-shrink-0 ${showLocations ? 'rotate-180' : ''}`}></i>
                    </button>

                    {/* Location Dropdown Menu */}
                    <AnimatePresence>
                      {showLocations && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-[100] w-full mt-2 bg-white border-2 border-gray-100 rounded-xl sm:rounded-2xl shadow-xl overflow-auto max-h-48 sm:max-h-60 overflow-y-auto"
                        >
                          {locations.map((location) => (
                            <button
                              key={location}
                              onClick={() => {
                                setSelectedLocation(location);
                                setShowLocations(false);
                              }}
                              className={`
                                w-full px-3 sm:px-4 py-2 sm:py-3 text-left flex items-center gap-2 transition-colors text-sm sm:text-base
                                ${selectedLocation === location 
                                  ? 'bg-green-50 text-green-600 font-medium' 
                                  : 'text-gray-600 hover:bg-gray-50'
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
                      flex items-center justify-center gap-1 sm:gap-2
                      bg-green-500 hover:bg-green-600
                      text-white font-bold text-sm sm:text-lg
                      px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl
                      shadow-lg shadow-green-500/30
                      hover:shadow-lg hover:-translate-y-0.5
                      transition-all duration-300
                    "
                  >
                    <i className="ph-bold ph-magnifying-glass"></i>
                    <span className="sm:hidden">Search</span>
                    <span className="hidden sm:inline">Search</span>
                  </motion.button>
                </div>

                {/* Quick Filters */}
                <div className="flex items-center flex-wrap gap-1 sm:gap-2 pt-1 sm:pt-2">
                  <span className="text-xs sm:text-sm text-gray-500">Popular:</span>
                  {['Hostels', 'Apartments', 'Near Campus', 'Pet Friendly'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag.toLowerCase())}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 hover:bg-green-100 hover:text-green-600 text-gray-600 text-xs sm:text-sm rounded-full transition-colors"
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
