"use client";

export const Pricing = () => {
  return (
    <section className="py-24 bg-brand-50 relative">
      <div className="absolute inset-0 bg-grid-pattern bg-[length:20px_20px] opacity-50"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-brand-600 font-bold uppercase tracking-wider text-sm mb-2 block">For Landlords</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-brand-dark">List your property today.</h2>
          <p className="mt-4 text-slate-600">Choose the plan that fits your portfolio size.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Basic Plan */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-brand-dark transition-all">
            <h3 className="font-display font-bold text-2xl mb-2">Basic</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-500">/mo</span>
            </div>
            <p className="text-gray-500 text-sm mb-8 h-10">Perfect for single room rentals or sublets.</p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg"></i> 1 Listing
              </li>
              <li className="flex items-center gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg"></i> Basic Support
              </li>
              <li className="flex items-center gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg"></i> Standard Visibility
              </li>
            </ul>

            <button className="w-full py-3 rounded-xl border-2 border-brand-dark font-bold hover:bg-gray-50 transition-colors">Start Free</button>
          </div>

          {/* Standard Plan */}
          <div className="bg-brand-dark text-white rounded-2xl p-8 border-2 border-brand-dark shadow-brutal transform md:-translate-y-4 relative">
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
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-brand-dark transition-all">
            <h3 className="font-display font-bold text-2xl mb-2">Premium</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">$59</span>
              <span className="text-gray-500">/mo</span>
            </div>
            <p className="text-gray-500 text-sm mb-8 h-10">For agencies and property management.</p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg"></i> Unlimited Listings
              </li>
              <li className="flex items-center gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg"></i> 24/7 Phone Support
              </li>
              <li className="flex items-center gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg"></i> Featured Listings
              </li>
              <li className="flex items-center gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg"></i> Legal Templates
              </li>
            </ul>

            <button className="w-full py-3 rounded-xl border-2 border-brand-dark font-bold hover:bg-gray-50 transition-colors">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>
  );
};