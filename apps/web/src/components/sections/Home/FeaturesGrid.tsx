"use client";

import { motion, Variants } from "framer-motion";

/**
 * Features Grid component displaying a bento-style layout of app features.
 * Includes main feature card with image, roommate matching, bill splitting, and smaller feature cards.
 */
export const FeaturesGrid = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <section className="py-24 bg-brand-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent mix-blend-overlay"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display font-extrabold text-4xl md:text-5xl mb-6 text-brand-dark">
            Everything you need to survive{" "}
            <span className="bg-brand-200/50 backdrop-blur-sm px-3 rounded-xl inline-block rotate-2 border border-brand-300 shadow-sm">
              uni life
            </span>
          </h2>
          <p className="text-slate-600 text-lg font-medium">
            We&apos;ve built the ultimate toolkit for student living. From finding the spot to splitting the bill.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-auto md:h-[600px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Feature 1: Main (Large) - Affordable Listings */}
          <motion.div 
            variants={itemVariants}
            className="interactive-hover md:col-span-2 row-span-2 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/80 p-10 relative overflow-hidden group hover:shadow-2xl hover:bg-white/80 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-slate-200/50"
          >
            <div className="relative z-10 max-w-sm">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <i className="ph-bold ph-house text-3xl"></i>
              </div>
              <h3 className="font-display font-bold text-3xl mb-4 text-slate-800 group-hover:text-blue-600 transition-colors">Affordable Listings</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Discover verified hostels and student apartments that fit your budget. Filter by
                distance to campus, amenities, and price.
              </p>
            </div>
            
            {/* Soft decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -z-10 group-hover:bg-blue-200/50 transition-colors duration-500"></div>

            <img
              src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Apartment"
              className="absolute -bottom-6 -right-6 w-2/3 h-2/3 object-cover rounded-tl-3xl border-l-[6px] border-t-[6px] border-white/50 shadow-2xl group-hover:scale-[1.03] group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all duration-500"
            />
          </motion.div>

          {/* Feature 2: Roommate Matching */}
          <motion.div 
            variants={itemVariants}
            className="interactive-hover bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[2rem] border border-white/20 p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-xl flex items-center justify-center mb-4 border border-white/30 group-hover:scale-110 transition-transform duration-300">
                <i className="ph-bold ph-users text-2xl"></i>
              </div>
              <h3 className="font-display font-bold text-2xl mb-3">Roommate Match</h3>
              <p className="text-white/80 text-base leading-relaxed">
                Find people with your vibe. Filter by habits, major, and sleep schedule.
              </p>
            </div>
            <div className="absolute -top-10 -right-10 bg-white/10 p-4 rounded-full w-40 h-40 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
          </motion.div>

          {/* Feature 3: Payment Splitting */}
          <motion.div 
            variants={itemVariants}
            className="interactive-hover bg-gradient-to-br from-brand-300 to-brand-400 rounded-[2rem] border border-white/50 p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-brand-400/30 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="w-12 h-12 bg-white/40 backdrop-blur-md text-brand-900 rounded-xl flex items-center justify-center mb-4 border border-white/50 group-hover:scale-110 transition-transform duration-300">
                <i className="ph-bold ph-receipt text-2xl"></i>
              </div>
              <h3 className="font-display font-bold text-2xl mb-3 text-brand-900">Split Bills</h3>
              <p className="text-brand-900/80 text-base leading-relaxed">
                Automated rent and utility splitting. Never awkwardly ask for money again.
              </p>
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white/30 p-4 rounded-full w-40 h-40 blur-2xl group-hover:bg-white/50 transition-all duration-500"></div>
          </motion.div>
        </motion.div>

        {/* Lower Features Row */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Feature 4: Landlord Chat */}
          <motion.div 
            variants={itemVariants}
            className="interactive-hover bg-white/60 backdrop-blur-md rounded-3xl border border-white/80 p-8 hover:bg-white/90 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-slate-200/40 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl shadow-inner flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <i className="ph-bold ph-chat-teardrop-text text-xl"></i>
              </div>
              <h3 className="font-display font-bold text-xl text-slate-800">Landlord Chat</h3>
            </div>
            <p className="text-slate-600 text-base relative z-10">
              Direct, documented communication channels with property managers.
            </p>
          </motion.div>

          {/* Feature 5: User Reviews */}
          <motion.div 
            variants={itemVariants}
            className="interactive-hover bg-white/60 backdrop-blur-md rounded-3xl border border-white/80 p-8 hover:bg-white/90 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-slate-200/40 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-inner flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <i className="ph-bold ph-star text-xl"></i>
              </div>
              <h3 className="font-display font-bold text-xl text-slate-800">User Reviews</h3>
            </div>
            <p className="text-slate-600 text-base relative z-10">
              Honest feedback from previous tenants. Know before you go.
            </p>
          </motion.div>

          {/* Feature 6: Saved Favorites */}
          <motion.div 
            variants={itemVariants}
            className="interactive-hover bg-white/60 backdrop-blur-md rounded-3xl border border-white/80 p-8 hover:bg-white/90 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-slate-200/40 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-200 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl shadow-inner flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <i className="ph-bold ph-heart text-xl"></i>
              </div>
              <h3 className="font-display font-bold text-xl text-slate-800">Saved Favorites</h3>
            </div>
            <p className="text-slate-600 text-base relative z-10">
              Curate your top picks and share lists with potential roommates.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
