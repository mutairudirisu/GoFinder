"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    icon: "ph-users-three",
    title: "For Everyone",
    description: "Whether you're a student, working professional, or family - find your perfect space.",
    color: "bg-brand-100",
    iconColor: "text-brand-600",
  },
  {
    icon: "ph-magnifying-glass",
    title: "Browse Listings",
    description: "Discover verified spaces that match your budget, location, and preferences.",
    color: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: "ph-house-line",
    title: "Publish Your Space",
    description: "List your property and reach thousands of potential renters looking for quality spaces.",
    color: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: "ph-shield-check",
    title: "Verified Spaces",
    description: "Every listing is verified for authenticity. Book with confidence.",
    color: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

export const PlatformShowcase = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden z-40">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px] opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand-700 text-sm font-semibold rounded-full mb-4">
            Platform Features
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-slate-800 mb-4">
            A Platform for Everyone
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Whether you're looking for a place or want to list yours - GIGS Rentals connects you with verified spaces and trusted renters.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 hover:border-brand-200 shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`ph-bold ${feature.icon} ${feature.iconColor} text-2xl`}></i>
              </div>
              
              {/* Content */}
              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-50/0 to-brand-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10 sm:mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link 
            href="/listings"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-brand-600 text-white font-semibold rounded-2xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30"
          >
            <i className="ph-bold ph-magnifying-glass"></i>
            Browse Listings
          </Link>
          <Link 
            href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001'}/auth/signup?redirect=/listings/create`}
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-brand-600 font-semibold rounded-2xl border-2 border-brand-200 hover:border-brand-300 hover:bg-brand-50 transition-colors"
          >
            <i className="ph-bold ph-plus"></i>
            List Your Space
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PlatformShowcase;
