"use client";

import { useState } from "react";
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

  const formatPrice = (price: number, type: string) => {
    return type === 'month' ? `$${price}/mo` : `$${price}/night`;
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
          ${isHovered ? 'shadow-[0_20px_50px_rgba(34,197,94,0.15)] border-brand-100' : 'shadow-lg'}
        `}>
          {/* Background Glow Effect */}
          <div className={`
            absolute inset-0 bg-gradient-to-br from-brand-50/50 via-transparent to-brand-500/5
            opacity-0 transition-opacity duration-500
            ${isHovered ? 'opacity-100' : ''}
          `} />

          {/* Image Section */}
          <div className="relative h-56 overflow-hidden">
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

            {/* Image Navigation Dots */}
            {property.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
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

            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <div className="flex gap-2">
                {property.featured && (
                  <span className="px-3 py-1 bg-brand-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                    FEATURED
                  </span>
                )}
                {property.verified && (
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-brand-600 text-xs font-bold rounded-full flex items-center gap-1">
                    <i className="ph-fill ph-seal-check"></i>
                    VERIFIED
                  </span>
                )}
              </div>

              {/* Favorite Button */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className={`
                w-10 h-10 rounded-full flex items-center justify-center
                bg-white/20 backdrop-blur-md border border-white/30
                transition-all duration-300 hover:scale-110
                ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
              `}>
                <i className="ph ph-heart text-white text-lg"></i>
              </button>
            </div>

            {/* Price Tag */}
            <div className="absolute bottom-4 right-4">
              <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/50 shadow-lg">
                <span className="text-xl font-display font-bold text-brand-dark">
                  {formatPrice(property.price, property.priceType)}
                </span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="relative p-5 pb-16">
            {/* Property Type Badge */}
            <div className="mb-3">
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
            </div>

            {/* Title & Location */}
            <h3 className="font-display font-bold text-lg text-brand-dark mb-1 line-clamp-1 group-hover:text-brand-600 transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-4">
              <i className="ph ph-map-pin"></i>
              <span>{property.location}</span>
            </div>

            {/* Property Features */}
            <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <i className="ph ph-bed"></i>
                <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <i className="ph ph-drop"></i>
                <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
              </div>
            </div>

            {/* Amenities Preview */}
            <div className="flex flex-wrap gap-2 mb-4">
              {property.amenities.slice(0, 4).map((amenity) => (
                <span 
                  key={amenity}
                  className="px-2 py-1 bg-slate-100 rounded-lg text-xs text-slate-600 flex items-center gap-1"
                >
                  <i className={`ph ${amenityIcons[amenity] || 'ph-check'}`}></i>
                  {amenity.replace('-', ' ')}
                </span>
              ))}
              {property.amenities.length > 4 && (
                <span className="px-2 py-1 bg-brand-50 rounded-lg text-xs text-brand-600 font-medium">
                  +{property.amenities.length - 4} more
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-4" />

            {/* Landlord & Rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src={property.landlord.image} 
                  alt={property.landlord.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-brand-100"
                />
                <div>
                  <p className="text-sm font-medium text-slate-700">{property.landlord.name}</p>
                  {property.landlord.verified && (
                    <p className="text-[10px] text-brand-600 flex items-center gap-0.5">
                      <i className="ph-fill ph-seal-check"></i>
                      Verified Landlord
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-brand-50 px-2.5 py-1.5 rounded-xl">
                <i className="ph-fill ph-star text-amber-400"></i>
                <span className="font-bold text-sm text-brand-dark">{property.rating}</span>
                <span className="text-xs text-slate-500">({property.reviews})</span>
              </div>
            </div>
          </div>

          {/* View Details Button - Inside the card, at bottom */}
          <div 
            className={`
              absolute bottom-4 left-1/2 -translate-x-1/2
              transition-all duration-300 w-auto
              ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
            `}
          >
            <div 
              onClick={(e) => e.preventDefault()}
              className="
              px-5 py-2 bg-brand-600 text-white font-semibold text-sm
              rounded-full shadow-lg
              hover:shadow-brutal hover:bg-brand-700 hover:-translate-y-1
              flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 whitespace-nowrap
            ">
              <i className="ph-bold ph-arrow-right"></i>
              View Details
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div className={`
          absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 pointer-events-none
          bg-gradient-to-r from-brand-400/20 via-brand-500/10 to-brand-400/20
          ${isHovered ? 'opacity-100' : ''}
        `} />
        </div>
      </Link>
    </motion.div>
  );
};

export default ListingCard;
