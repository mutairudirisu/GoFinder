"use client";

export const PricingAddOns = () => {
  return (
    <div className="mt-16 bg-brand-50 rounded-3xl border-2 border-brand-dark p-8">
      <h3 className="font-display font-bold text-2xl mb-6 text-center">Optional Add-ons</h3>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold">Virtual Tours</h4>
            <span className="text-xl font-bold text-brand-600">$10</span>
          </div>
          <p className="text-sm text-slate-600">Professional 360° virtual tour creation service</p>
        </div>
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold">Featured Boost</h4>
            <span className="text-xl font-bold text-brand-600">$15</span>
          </div>
          <p className="text-sm text-slate-600">Promote your listing to the top for 7 days</p>
        </div>
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold">Background Checks</h4>
            <span className="text-xl font-bold text-brand-600">$25</span>
          </div>
          <p className="text-sm text-slate-600">Comprehensive tenant background screening</p>
        </div>
      </div>
    </div>
  );
};
