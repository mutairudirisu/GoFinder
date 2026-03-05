"use client";

export const LandlordPricing = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-white via-brand-50 to-brand-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl mb-4">Plans for landlords</h2>
          <p className="text-slate-600">Choose the plan that matches your portfolio size</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Basic Plan */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-brand-dark transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-2xl">Basic</h3>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">STARTER</span>
            </div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-5xl font-bold">$0</span>
              <span className="text-gray-500">/mo</span>
            </div>
            <p className="text-gray-500 text-sm mb-8 h-12">Perfect for single room rentals, sublets, or trying out the platform.</p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg flex-shrink-0 mt-0.5"></i>
                <span>1 Active Listing</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg flex-shrink-0 mt-0.5"></i>
                <span>Up to 10 Photos</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg flex-shrink-0 mt-0.5"></i>
                <span>Basic Analytics</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg flex-shrink-0 mt-0.5"></i>
                <span>Email Support</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg flex-shrink-0 mt-0.5"></i>
                <span>Standard Visibility</span>
              </li>
            </ul>

            <button className="w-full py-3 rounded-xl border-2 border-brand-dark font-bold hover:bg-gray-50 transition-colors">Start Free</button>
          </div>

          {/* Standard Plan - Featured */}
          <div className="bg-brand-dark text-white rounded-2xl p-8 border-2 border-brand-dark shadow-brutal transform md:-translate-y-4 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-400 text-brand-dark px-4 py-1.5 rounded-full text-xs font-bold border-2 border-brand-dark">MOST POPULAR</div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-2xl">Standard</h3>
              <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold">PRO</span>
            </div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-5xl font-bold">$29</span>
              <span className="text-gray-400">/mo</span>
            </div>
            <p className="text-gray-400 text-sm mb-8 h-12">For professional landlords managing multiple student properties.</p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-400 text-lg flex-shrink-0 mt-0.5"></i>
                <span>Up to 5 Active Listings</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-400 text-lg flex-shrink-0 mt-0.5"></i>
                <span>Unlimited Photos</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-400 text-lg flex-shrink-0 mt-0.5"></i>
                <span>Advanced Analytics & Insights</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-400 text-lg flex-shrink-0 mt-0.5"></i>
                <span>Priority Support (24hr response)</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-400 text-lg flex-shrink-0 mt-0.5"></i>
                <span>Verified Landlord Badge</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-400 text-lg flex-shrink-0 mt-0.5"></i>
                <span>Basic Tenant Screening</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-400 text-lg flex-shrink-0 mt-0.5"></i>
                <span>Boosted Search Visibility</span>
              </li>
            </ul>

            <button className="w-full py-3 rounded-xl bg-brand-400 text-brand-dark border-2 border-brand-400 font-bold hover:bg-brand-300 hover:border-brand-300 transition-colors">Get Standard</button>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-brand-dark transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-2xl">Premium</h3>
              <span className="px-3 py-1 bg-gradient-to-r from-brand-accent to-brand-500 text-white rounded-full text-xs font-bold">ENTERPRISE</span>
            </div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-5xl font-bold">$59</span>
              <span className="text-gray-500">/mo</span>
            </div>
            <p className="text-gray-500 text-sm mb-8 h-12">For agencies and property management companies with large portfolios.</p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg flex-shrink-0 mt-0.5"></i>
                <span><strong>Unlimited</strong> Active Listings</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg flex-shrink-0 mt-0.5"></i>
                <span>Unlimited Photos + 360° Tours</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg flex-shrink-0 mt-0.5"></i>
                <span>Full Analytics Dashboard</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg flex-shrink-0 mt-0.5"></i>
                <span>24/7 Phone + Chat Support</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg flex-shrink-0 mt-0.5"></i>
                <span>Premium Verified Badge</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg flex-shrink-0 mt-0.5"></i>
                <span>Advanced Tenant Screening</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg flex-shrink-0 mt-0.5"></i>
                <span>Featured Homepage Placement</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg flex-shrink-0 mt-0.5"></i>
                <span>Legal Document Templates</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <i className="ph-fill ph-check-circle text-brand-500 text-lg flex-shrink-0 mt-0.5"></i>
                <span>Dedicated Account Manager</span>
              </li>
            </ul>

            <button className="w-full py-3 rounded-xl border-2 border-brand-dark font-bold hover:bg-gray-50 transition-colors">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>
  );
};
    