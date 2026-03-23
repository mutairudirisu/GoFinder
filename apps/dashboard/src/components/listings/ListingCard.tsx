"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Property } from "@/app/listings/data";

interface ListingCardProps {
  property: Property;
  index: number;
}

export const ListingCard = ({ property, index }: ListingCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Load liked status from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLikes = localStorage.getItem('gigs_liked_properties');
      if (savedLikes) {
        const likedIds = JSON.parse(savedLikes);
        setIsLiked(likedIds.includes(property.id));
      }
    }
  }, [property.id]);

  // Toggle like status
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    // Toggle liked state
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      const savedLikes = localStorage.getItem('gigs_liked_properties');
      let likedIds: string[] = savedLikes ? JSON.parse(savedLikes) : [];
      
      if (newLikedState) {
        if (!likedIds.includes(property.id)) {
          likedIds.push(property.id);
        }
      } else {
        likedIds = likedIds.filter(id => id !== property.id);
      }
      
      localStorage.setItem('gigs_liked_properties', JSON.stringify(likedIds));
      
      // Dispatch custom event for other components to update
      window.dispatchEvent(new Event('likesUpdated'));
    }
  };

  const formatPrice = (price: number, type?: string) => {
    if (type === 'hour') return `${price}/hr`;
    return type === 'month' ? `${price}/mo` : `${price}/night`;
  };

  const amenityIcons: Record<string, string> = {
    wifi: "ph-wifi-high",
    furnished: "ph-bed",
    kitchen: "ph-cooking-pot",
    laundry: "ph-washing-machine",
    "study-area": "ph-books",
    security: "ph-shield-check",
    ac: "ph-snowflake",
    gym: "ph-barbell",
    parking: "ph-car",
    pool: "ph-swimming-pool",
    rooftop: "ph-buildings"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      <Link href={`/listings/${property.id}`} className="block h-full">
        {/* Card Container */}
        <div className={`
          relative bg-white rounded-3xl overflow-hidden
          border-2 border-transparent
          shadow-[0_0_0_1px_rgba(0,0,0,0.05)]
          transition-all duration-500 ease-out h-full
          ${isHovered ? 'shadow-[0_20px_50px_rgba(34,197,94,0.15)] border-green-100' : 'shadow-lg'}
        `}>
          {/* Background Glow Effect */}
          <div className={`
            absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-green-500/5
            opacity-0 transition-opacity duration-500
            ${isHovered ? 'opacity-100' : ''}
          `} />

          {/* Image Section - Compact on mobile */}
          <div className="relative h-32 sm:h-48 md:h-56 overflow-hidden">
            {/* Main Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={property.images[currentImageIndex]}
                alt={property.title}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Image Navigation Dots - Hide on mobile */}
            {property.images.length > 1 && (
              <div className="hidden sm:flex absolute bottom-3 left-1/2 -translate-x-1/2 gap-1.5">
                {property.images.map((_, idx) => (
                  <button
                    key={idx}
                    onMouseEnter={() => setCurrentImageIndex(idx)}
                    className={`
                    w-1.5 h-1.5 rounded-full transition-all duration-300
                    ${idx === currentImageIndex 
                      ? 'bg-white w-4' 
                      : 'bg-white/50 hover:bg-white/80'}
                  `}
                  />
                ))}
              </div>
            )}

            {/* Top Badges - Show only FEATURED on mobile */}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex justify-between items-start">
              <div className="flex gap-1 sm:gap-2 flex-wrap">
                {property.featured && (
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-500 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                    FEATURED
                  </span>
                )}
                {/* Hide other badges on mobile - show on tablet+ */}
                <span className="hidden sm:flex gap-1 sm:gap-2 flex-wrap">
                  {property.isStudentSpace && (
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-purple-500 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg backdrop-blur-sm flex items-center gap-0.5 sm:gap-1">
                      <i className="ph-fill ph-graduation-cap"></i>
                      <span>STUDENT SPACE</span>
                    </span>
                  )}
                  {property.needsRoommates && (
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-amber-500 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg backdrop-blur-sm flex items-center gap-0.5 sm:gap-1">
                      <i className="ph-fill ph-users-three"></i>
                      <span>NEEDS ROOMMATES{property.roommatesNeeded ? ` (${property.roommatesNeeded})` : ''}</span>
                    </span>
                  )}
                  {property.verified && (
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/90 backdrop-blur-md text-green-600 text-[10px] sm:text-xs font-bold rounded-full flex items-center gap-0.5 sm:gap-1">
                      <i className="ph-fill ph-seal-check"></i>
                      <span>VERIFIED</span>
                    </span>
                  )}
                </span>
              </div>

              {/* Favorite Button */}
              <motion.button 
                onClick={handleLike}
                whileTap={{ scale: 0.8 }}
                className={`
                w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                backdrop-blur-md border transition-all duration-300
                ${isLiked 
                  ? 'bg-red-500 border-red-400' 
                  : 'bg-white/20 border-white/30 hover:bg-white/30'
                }
                ${isAnimating ? 'scale-125' : 'hover:scale-110'}
              `}>
                <motion.i 
                  className={`text-lg transition-colors ${isLiked ? 'ph-fill ph-heart text-white' : 'ph ph-heart text-white'}`}
                  animate={isAnimating ? {
                    scale: [1, 1.3, 1]
                  } : {}}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>

            {/* Price Tag */}
            <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
              <div className="bg-white/95 backdrop-blur-md px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-white/50 shadow-lg">
                <span className="text-base sm:text-xl font-bold text-gray-800">
                  {formatPrice(property.price, property.priceType)}
                </span>
              </div>
            </div>
          </div>

          {/* Content Section - Compact on mobile */}
          <div className="relative p-2 sm:p-4 md:p-5 pb-4 sm:pb-16">
            {/* Property Type Badge - Hide on mobile */}
            <div className="hidden sm:mb-3 sm:flex items-center gap-2">
              <span className={`
              inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider
              ${property.type === 'hostel' ? 'bg-purple-100 text-purple-700' : ''}
              ${property.type === 'apartment' ? 'bg-blue-100 text-blue-700' : ''}
              ${property.type === 'house' ? 'bg-green-100 text-green-700' : ''}
              ${property.type === 'room' ? 'bg-orange-100 text-orange-700' : ''}
            `}>
                <i className={`ph ph-building-${property.type === 'hostel' || property.type === 'house' ? 'house' : 'apartment'}`}></i>
                {property.type}
              </span>
              {/* Category Badge */}
              {property.category && (
                <span className={`
                inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider
                ${property.category === 'accommodation' ? 'bg-teal-100 text-teal-700' : ''}
                ${property.category === 'experience' ? 'bg-pink-100 text-pink-700' : ''}
                ${property.category === 'services' ? 'bg-amber-100 text-amber-700' : ''}
              `}>
                  <i className={`ph ${property.category === 'accommodation' ? 'ph-house-line' : property.category === 'experience' ? 'ph-sparkle' : 'ph-wrench'}`}></i>
                  {property.category}
                </span>
              )}
            </div>

            {/* Title - 2 lines max on mobile */}
            <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-800 line-clamp-2 sm:line-clamp-1 group-hover:text-green-600 transition-colors">
              {property.title}
            </h3>
            {/* Location - 1 line */}
            <div className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm mb-2">
              <i className="ph ph-map-pin"></i>
              <span className="truncate">{property.location}</span>
            </div>

            {/* Property Features - Show only 2 key specs on mobile */}
            {(property.category === 'accommodation' || !property.category) && (
              <div className="flex items-center gap-3 mb-2 sm:mb-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <i className="ph ph-bed"></i>
                  <span>{property.bedrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <i className="ph ph-drop"></i>
                  <span>{property.bathrooms}</span>
                </div>
              </div>
            )}

            {/* Amenities & Rating Row - Show on mobile */}
            <div className="flex items-center justify-between gap-2">
              {/* Amenities - Show compact on mobile */}
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 2).map((amenity) => (
                  <span 
                    key={amenity}
                    className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600 flex items-center gap-0.5"
                  >
                    <i className={`ph ${amenityIcons[amenity] || 'ph-check'}`}></i>
                  </span>
                ))}
                {property.amenities.length > 2 && (
                  <span className="px-1.5 py-0.5 bg-green-50 rounded text-[10px] text-green-600 font-medium">
                    +{property.amenities.length - 2}
                  </span>
                )}
              </div>
              {/* Rating */}
              <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded-lg">
                <i className="ph-fill ph-star text-amber-400 text-xs"></i>
                <span className="font-bold text-xs text-gray-800">{property.rating}</span>
              </div>
            </div>

            {/* Amenities Preview - Show on tablet+ */}
            <div className="hidden sm:flex flex-wrap gap-2 mb-4">
              {property.amenities.slice(0, 4).map((amenity) => (
                <span 
                  key={amenity}
                  className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600 flex items-center gap-1"
                >
                  <i className={`ph ${amenityIcons[amenity] || 'ph-check'}`}></i>
                  {amenity.replace('-', ' ')}
                </span>
              ))}
              {property.amenities.length > 4 && (
                <span className="px-2 py-1 bg-green-50 rounded-lg text-xs text-green-600 font-medium">
                  +{property.amenities.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* View Details Button - Hide on mobile, show on tablet+ */}
          <div 
            className={`
              hidden sm:absolute sm:bottom-4 left-1/2 -translate-x-1/2
              transition-all duration-300 w-auto shadow-brutal
              ${isHovered ? 'opacity-100 translate-y-0 shadow-brutal' : 'opacity-0 translate-y-2'}
            `}
          >
            <div 
              onClick={(e) => e.preventDefault()}
              className="
              px-5 py-2 bg-green-600 text-white font-semibold text-sm
              rounded-full shadow-lg
              hover:shadow-brutal hover:bg-green-700 hover:-translate-y-1
              flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 whitespace-nowrap
            ">
              <i className="ph-bold ph-arrow-right"></i>
              View Details
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div className={`
          absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 pointer-events-none
          bg-gradient-to-r from-green-400/20 via-green-500/10 to-green-400/20
          ${isHovered ? 'opacity-100' : ''}
        `} />
        </div>
      </Link>
    </motion.div>
  );
};

export default ListingCard;
