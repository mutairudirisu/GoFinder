"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ListingCard } from "@/components/listings";
import { Header } from "@/components/layout";
import { mockProperties, type Property } from "../data";

export default function SavedListingsPage() {
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved properties from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLikes = localStorage.getItem('gigs_liked_properties');
      if (savedLikes) {
        const likedIds = JSON.parse(savedLikes);
        const saved = mockProperties.filter(p => likedIds.includes(p.id));
        setSavedProperties(saved);
      }
      setIsLoading(false);
    }

    // Listen for updates to likes
    const handleLikesUpdated = () => {
      const savedLikes = localStorage.getItem('gigs_liked_properties');
      if (savedLikes) {
        const likedIds = JSON.parse(savedLikes);
        const saved = mockProperties.filter(p => likedIds.includes(p.id));
        setSavedProperties(saved);
      } else {
        setSavedProperties([]);
      }
    };

    window.addEventListener('likesUpdated', handleLikesUpdated);
    return () => window.removeEventListener('likesUpdated', handleLikesUpdated);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-brand-50/30">
      {/* Header */}
      <Header />

      {/* Hero Section */}
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
              Your <span className="text-brand-500">Saved Properties</span>
            </h1>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
              Properties you've liked will appear here. Keep track of your favorite places!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent"></div>
          </div>
        ) : savedProperties.length > 0 ? (
          <>
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 md:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <span className="font-display text-3xl md:text-4xl font-bold text-gray-900">{savedProperties.length}</span>
                <span className="text-gray-500 text-base">
                  {savedProperties.length === 1 ? 'property saved' : 'properties saved'}
                </span>
              </div>
              <Link
                href="/listings"
                className="text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-2 transition-colors"
              >
                <i className="ph-bold ph-plus-circle"></i>
                Browse more
              </Link>
            </motion.div>

            {/* Properties Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {savedProperties.map((property, index) => (
                <ListingCard key={property.id} property={property} index={index} />
              ))}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 md:py-24"
          >
            <div className="w-28 h-28 mx-auto mb-8 bg-brand-50 rounded-full flex items-center justify-center">
              <i className="ph ph-heart text-5xl text-brand-300"></i>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              No saved properties yet
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-base leading-relaxed">
              Start browsing and click the heart icon on properties you like to save them here for later.
            </p>
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <i className="ph-bold ph-magnifying-glass"></i>
              Browse Properties
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
}
