"use client";

import { motion, Variants } from "framer-motion";

export const Pricing = () => {
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
    <section className="py-24 bg-brand-50 relative overflow-hidden z-40">
      <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-30"></div>
      
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-brand-200/50 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-brand-200/50 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-brand-600 font-bold uppercase tracking-wider text-sm mb-2 block">For Landlords</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-brand-dark">List your property today.</h2>
          <p className="mt-4 text-slate-600">Choose the plan that fits your portfolio size.</p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Basic Plan */}
          <motion.div 
            className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white hover:border-brand-200 shadow-sm hover:shadow-xl hover:shadow-brand-100/50 transition-all duration-300"
            variants={itemVariants}
          >
            <h3 className="font-display font-bold text-2xl mb-2">Basic</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-brand-dark">$0</span>
              <span className="text-gray-500">/mo</span>
            </div>
            <p className="text-gray-500 text-sm mb-8 h-10">Perfect for single room rentals or sublets.</p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-slate-700">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg"></i> 1 Listing
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-700">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg"></i> Basic Support
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-700">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg"></i> Standard Visibility
              </li>
            </ul>

            <button className="w-full py-3 rounded-xl border-2 border-brand-dark font-bold hover:bg-gray-50 transition-colors">Start Free</button>
          </motion.div>

          {/* Standard Plan */}
          <motion.div 
            className="bg-brand-dark/95 backdrop-blur-md text-white rounded-2xl p-8 border border-white/10 shadow-lg transform md:-translate-y-4 relative"
            variants={itemVariants}
            whileHover={{ y: -20, transition: { duration: 0.3 } }}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-400 text-brand-dark px-3 py-1 rounded-full text-xs font-bold border-2 border-brand-dark">MOST POPULAR</div>
            <h3 className="font-display font-bold text-2xl mb-2">Standard</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">$29</span>
              <span className="text-gray-400">/mo</span>
            </div>
            <p className="text-gray-400 text-sm mb-8 h-10">For professional landlords with a few units.</p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-400 text-lg"></i> Up to 5 Listings
              </li>
              <li className="flex items-center gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-400 text-lg"></i> Priority Support
              </li>
              <li className="flex items-center gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-400 text-lg"></i> Verified Badge
              </li>
              <li className="flex items-center gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-400 text-lg"></i> Tenant Screening
              </li>
            </ul>

            <button className="w-full py-3 rounded-xl bg-brand-400 text-brand-dark border-2 border-brand-400 font-bold hover:bg-brand-300 hover:border-brand-300 transition-colors">Get Standard</button>
          </motion.div>

          {/* Premium Plan */}
          <motion.div 
            className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white hover:border-brand-200 shadow-sm hover:shadow-xl hover:shadow-brand-100/50 transition-all duration-300"
            variants={itemVariants}
          >
            <h3 className="font-display font-bold text-2xl mb-2">Premium</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-brand-dark">$59</span>
              <span className="text-gray-500">/mo</span>
            </div>
            <p className="text-gray-500 text-sm mb-8 h-10">For agencies and property management.</p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-slate-700">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg"></i> Unlimited Listings
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-700">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg"></i> 24/7 Phone Support
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-700">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg"></i> Featured Listings
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-700">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg"></i> Legal Templates
              </li>
            </ul>

            <button className="w-full py-3 rounded-xl border-2 border-brand-dark font-bold hover:bg-gray-50 transition-colors">Contact Sales</button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};