"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SearchBar, ListingCard } from "@/components/listings";
import { Header } from "@/components/layout";
import { mockProperties, locations, propertyTypes, propertyCategories, priceRanges, type PriceRange } from "./data";

const defaultPriceRange: PriceRange = { label: 'Any Price', min: 0, max: Infinity };

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedPrice, setSelectedPrice] = useState<PriceRange>(defaultPriceRange);
  const [showFilters, setShowFilters] = useState(false);

  // Filter properties based on search criteria
  const filteredProperties = useMemo(() => {
    return mockProperties.filter((property) => {
      // Search query filter
      const matchesSearch = 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.amenities.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));

      // Location filter
      const matchesLocation = 
        selectedLocation === "All Locations" || 
        property.location.toLowerCase().includes(selectedLocation.toLowerCase());

      // Property type filter
      const matchesType = 
        selectedType === "All Types" || 
        property.type.toLowerCase() === selectedType.toLowerCase();

      // Price filter
      const matchesPrice = 
        property.price >= selectedPrice.min && 
        property.price <= selectedPrice.max;

      // Category filter
      const matchesCategory = 
        selectedCategory === "All Categories" || 
        property.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesLocation && matchesCategory && matchesType && matchesPrice;
    });
  }, [searchQuery, selectedLocation, selectedCategory, selectedType, selectedPrice]);

  const handleSearch = (query: string, location: string) => {
    setSearchQuery(query);
    if (location !== "All Locations") {
      setSelectedLocation(location);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("All Locations");
    setSelectedCategory("All Categories");
    setSelectedType("All Types");
    setSelectedPrice(defaultPriceRange);
  };

  const activeFiltersCount = [
    selectedLocation !== "All Locations",
    selectedCategory !== "All Categories",
    selectedType !== "All Types",
    selectedPrice.label !== "Any Price"
  ].filter(Boolean).length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-brand-50/30">
      {/* Header */}
      <Header />

      {/* Hero Section for Listings */}
      <section className="relative pt-20 md:pt-24 pb-12 overflow-visible z-10 bg-gradient-to-b from-brand-50 via-white to-white">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px] opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-400/10 rounded-full blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-brand-dark mb-3">
              Find Your <span className="text-brand-500">Perfect Space</span>
            </h1>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
              Discover verified hostels, apartments, and rooms from trusted landlords across Nigeria
            </p>
          </motion.div>

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} locations={locations} />
        </div>
      </section>

      {/* Results Section */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-between gap-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <h2 className="font-display font-bold text-lg md:text-xl text-brand-dark">
                {filteredProperties.length} Properties
              </h2>
              
              {/* Active Filters Pills */}
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedLocation !== "All Locations" && (
                    <span className="px-3 py-1 bg-brand-100 text-brand-700 text-xs md:text-sm rounded-full flex items-center gap-1">
                      <i className="ph ph-map-pin"></i>
                      {selectedLocation}
                      <button onClick={() => setSelectedLocation("All Locations")}>
                        <i className="ph ph-x"></i>
                      </button>
                    </span>
                  )}
                  {selectedCategory !== "All Categories" && (
                    <span className="px-3 py-1 bg-brand-100 text-brand-700 text-xs md:text-sm rounded-full flex items-center gap-1">
                      <i className="ph ph-folder"></i>
                      {selectedCategory}
                      <button onClick={() => setSelectedCategory("All Categories")}>
                        <i className="ph ph-x"></i>
                      </button>
                    </span>
                  )}
                  {selectedType !== "All Types" && (
                    <span className="px-3 py-1 bg-brand-100 text-brand-700 text-xs md:text-sm rounded-full flex items-center gap-1">
                      <i className="ph ph-building"></i>
                      {selectedType}
                      <button onClick={() => setSelectedType("All Types")}>
                        <i className="ph ph-x"></i>
                      </button>
                    </span>
                  )}
                  {selectedPrice.label !== "Any Price" && (
                    <span className="px-3 py-1 bg-brand-100 text-brand-700 text-xs md:text-sm rounded-full flex items-center gap-1">
                      <i className="ph ph-currency-dollar"></i>
                      {selectedPrice.label}
                      <button onClick={() => setSelectedPrice(defaultPriceRange)}>
                        <i className="ph ph-x"></i>
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-slate-600 font-medium text-sm"
              >
                <i className="ph-bold ph-funnel"></i>
                Filters
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 bg-brand-500 text-white text-xs rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-xl">
                <span className="text-slate-500 text-sm">Sort by:</span>
                <select className="bg-transparent font-medium text-slate-700 focus:outline-none text-sm">
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Mobile Filters - Horizontal Scroll Wheel */}
          <div className="lg:hidden mb-6 space-y-4">
            {/* Category - Scrollable Wheel */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <i className="ph ph-folder text-brand-500"></i>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Category</p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {propertyCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      px-4 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 flex items-center gap-1.5
                      ${selectedCategory === category 
                        ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30' 
                        : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-brand-300 hover:bg-brand-50'
                      }
                    `}
                  >
                    <i className={`ph ${selectedCategory === category ? 'ph-check' : 'ph-folder'}`}></i>
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type - Scrollable Wheel */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <i className="ph ph-building text-brand-500"></i>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Type</p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {propertyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`
                      px-4 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 flex items-center gap-1.5
                      ${selectedType === type 
                        ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30' 
                        : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-brand-300 hover:bg-brand-50'
                      }
                    `}
                  >
                    <i className={`ph ${selectedType === type ? 'ph-check' : 'ph-house'}`}></i>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range - Scrollable Wheel */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <i className="ph ph-currency-dollar text-brand-500"></i>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Price</p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {priceRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => setSelectedPrice(range)}
                    className={`
                      px-4 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 flex items-center gap-1.5
                      ${selectedPrice.label === range.label 
                        ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30' 
                        : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-brand-300 hover:bg-brand-50'
                      }
                    `}
                  >
                    <i className={`ph ${selectedPrice.label === range.label ? 'ph-check' : 'ph-tag'}`}></i>
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location - Scrollable Wheel */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <i className="ph ph-map-pin text-brand-500"></i>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Location</p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {locations.map((location) => (
                  <button
                    key={location}
                    onClick={() => setSelectedLocation(location)}
                    className={`
                      px-4 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 flex items-center gap-1.5
                      ${selectedLocation === location 
                        ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30' 
                        : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-brand-300 hover:bg-brand-50'
                      }
                    `}
                  >
                    <i className={`ph ${selectedLocation === location ? 'ph-check' : 'ph-map-pin'}`}></i>
                    {location}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Filters (Desktop) - Dropdowns */}
          <div className="hidden lg:flex gap-4 mb-10">
            {/* Category Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="
                  w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl
                  text-slate-700 font-medium text-sm
                  focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none
                  cursor-pointer transition-all duration-200
                  appearance-none pr-10
                  hover:border-brand-300
                "
              >
                {propertyCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <i className="ph-bold ph-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
            </div>

            {/* Property Type Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="
                  w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl
                  text-slate-700 font-medium text-sm
                  focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none
                  cursor-pointer transition-all duration-200
                  appearance-none pr-10
                  hover:border-brand-300
                "
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <i className="ph-bold ph-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
            </div>

            {/* Price Range Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedPrice.label}
                onChange={(e) => {
                  const range = priceRanges.find(r => r.label === e.target.value);
                  if (range) setSelectedPrice(range);
                }}
                className="
                  w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl
                  text-slate-700 font-medium text-sm
                  focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none
                  cursor-pointer transition-all duration-200
                  appearance-none pr-10
                  hover:border-brand-300
                "
              >
                {priceRanges.map((range) => (
                  <option key={range.label} value={range.label}>{range.label}</option>
                ))}
              </select>
              <i className="ph-bold ph-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
            </div>

            {/* Location Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="
                  w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl
                  text-slate-700 font-medium text-sm
                  focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none
                  cursor-pointer transition-all duration-200
                  appearance-none pr-10
                  hover:border-brand-300
                "
              >
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              <i className="ph-bold ph-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={clearFilters}
              className="mb-6 text-brand-600 font-medium hover:text-brand-700 flex items-center gap-2 text-sm"
            >
              <i className="ph-bold ph-x-circle"></i>
              Clear all filters
            </motion.button>
          )}

          {/* Listings Grid */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-6">
              {filteredProperties.map((property, index) => (
                <ListingCard key={property.id} property={property} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ph ph-house-line text-3xl text-slate-400"></i>
              </div>
              <h3 className="font-display font-bold text-xl text-brand-dark mb-2">
                No Properties Found
              </h3>
              <p className="text-slate-500 mb-6">
                Try adjusting your search filters to find more properties
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-brand-500 text-white font-medium rounded-xl hover:bg-brand-600 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}

          {/* Load More Button */}
          {filteredProperties.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-10"
            >
              <button className="px-6 py-3 md:px-8 md:py-4 bg-white border-2 border-slate-200 text-brand-dark font-semibold rounded-2xl hover:border-brand-300 hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto text-sm md:text-base">
                <i className="ph-bold ph-arrow-down"></i>
                Load More Properties
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-brand-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-brand-300 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative z-10">
          <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-white mb-4">
            Create a New Listing
          </h2>
          <p className="text-brand-100 text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">
            Add another property to your portfolio and start reaching more students today
          </p>
          <a 
            href="/listings/create" 
            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-white text-brand-600 font-bold text-base md:text-lg rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <i className="ph-bold ph-plus-circle"></i>
            Create Listing
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/listings" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                  <i className="ph-bold ph-house-line text-white"></i>
                </div>
                <span className="font-display font-bold text-xl text-brand-dark">GIGS<span className="text-brand-500">Rentals</span></span>
              </Link>
              <p className="text-sm text-gray-500 mb-6">Making student living simple, affordable, and actually fun.</p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-brand-600 transition-colors"><i className="ph-fill ph-twitter-logo text-xl"></i></a>
                <a href="#" className="text-gray-400 hover:text-brand-600 transition-colors"><i className="ph-fill ph-instagram-logo text-xl"></i></a>
                <a href="#" className="text-gray-400 hover:text-brand-600 transition-colors"><i className="ph-fill ph-tiktok-logo text-xl"></i></a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-brand-dark">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/listings" className="hover:text-brand-600">Search Listings</Link></li>
                <li><a href="#" className="hover:text-brand-600">Roommate Match</a></li>
                <li><a href="#" className="hover:text-brand-600">For Landlords</a></li>
                <li><Link href="/pricing" className="hover:text-brand-600">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-brand-dark">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/about-us" className="hover:text-brand-600">About Us</Link></li>
                <li><a href="#" className="hover:text-brand-600">Careers</a></li>
                <li><a href="#" className="hover:text-brand-600">Blog</a></li>
                <li><Link href="/contact" className="hover:text-brand-600">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-brand-dark">Support</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-brand-600">Help Center</a></li>
                <li><a href="#" className="hover:text-brand-600">Safety Guidelines</a></li>
                <li><Link href="/terms" className="hover:text-brand-600">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-brand-600">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400">&copy; 2024 GIGS Rentals. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-gray-400">
              <Link href="/privacy" className="hover:text-brand-600">Privacy</Link>
              <Link href="/terms" className="hover:text-brand-600">Terms</Link>
              <Link href="/cookies" className="hover:text-brand-600">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
