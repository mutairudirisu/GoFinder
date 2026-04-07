import { Pricing } from "@/components/sections/Home";

export default function ForLandlords() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/2 left-0 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl"></div>
        </div>

        {/* Grid pattern background */}
        <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-10"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-24">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 w-fit mx-auto">
              <i className="ph-fill ph-house text-brand-400 text-lg"></i>
              <span className="text-sm font-semibold text-white">Build your student housing empire</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-display font-bold text-white leading-tight">
                Manage Properties<br />
                <span className="bg-gradient-to-r from-brand-400 to-brand-500 bg-clip-text text-transparent">
                  With Confidence
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
                List properties, screen tenants, manage payments, and grow your business. Connect with thousands of quality student renters.
              </p>
            </div>

            {/* CTA Form */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-8">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30 transition-all"
              />
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold hover:from-brand-600 hover:to-brand-700 transition-all shadow-lg hover:shadow-brand-500/25 hover:-translate-y-1 whitespace-nowrap">
                Get Started
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400 pt-8">
              <div className="flex items-center gap-2">
                <i className="ph-fill ph-check-circle text-green-400"></i>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="ph-fill ph-check-circle text-green-400"></i>
                <span>Free for first property</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="ph-fill ph-check-circle text-green-400"></i>
                <span>30-day free trial</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section before Pricing */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-brand-400/30 hover:bg-white/10 transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
              <i className="ph-bold ph-buildings text-brand-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-white">List Multiple Properties</h3>
            <p className="text-slate-400">Upload unlimited listings with professional photos, virtual tours, and detailed descriptions.</p>
          </div>

          <div className="space-y-4 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-brand-400/30 hover:bg-white/10 transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
              <i className="ph-bold ph-shield-check text-brand-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-white">Tenant Screening</h3>
            <p className="text-slate-400">Verify income, credit scores, and background checks to find reliable tenants.</p>
          </div>

          <div className="space-y-4 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-brand-400/30 hover:bg-white/10 transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
              <i className="ph-bold ph-credit-card text-brand-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-white">Payment Management</h3>
            <p className="text-slate-400">Automated rent collection, lease signing, and financial dashboards.</p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="relative z-10">
        <Pricing />
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="p-12 bg-gradient-to-r from-brand-500/20 to-brand-600/20 backdrop-blur-md rounded-3xl border border-brand-400/30 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to get started?</h2>
          <p className="text-lg text-slate-300">Join hundreds of landlords managing student housing on GIGS Rentals.</p>
          <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold hover:from-brand-600 hover:to-brand-700 transition-all shadow-lg hover:shadow-brand-500/25">
            Launch Your First Listing
          </button>
        </div>
      </div>
    </div>
  );
}
