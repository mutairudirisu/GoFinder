"use client";

/**
 * Features Grid component displaying a bento-style layout of app features.
 * Includes main feature card with image, roommate matching, bill splitting, and smaller feature cards.
 */
export const FeaturesGrid = () => {
  return (
    <section className="py-24 bg-white relative">
      <div className="absolute inset-0 bg-grid-pattern bg-[length:200px_200px]"></div>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className=" font-display font-extrabold text-4xl md:text-5xl mb-6 text-brand-dark">
            Everything you need to survive{" "}
            <span className="bg-brand-200 px-2 rounded-lg inline-block rotate-3 border border-brand-dark">
              uni life
            </span>
          </h2>
          <p className="text-slate-600 text-lg">
            We&apos;ve built the ultimate toolkit for student living. From finding the spot to splitting the bill.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-auto md:h-[600px]">
          {/* Feature 1: Main (Large) - Affordable Listings */}
          <div className="md:col-span-2 row-span-2 bg-brand-50 rounded-3xl border-2 border-brand-dark p-8 relative overflow-hidden group hover:shadow-brutal transition-all">
            <div className="relative z-10 max-w-sm">
              <div className="w-12 h-12 bg-blue-500 rounded-xl border-2 border-brand-dark flex items-center justify-center mb-4 text-white">
                <i className="ph-bold ph-house text-2xl"></i>
              </div>
              <h3 className="font-roc font-bold text-3xl mb-3">Affordable Listings</h3>
              <p className="text-slate-600">
                Discover verified hostels and student apartments that fit your budget. Filter by
                distance to campus, amenities, and price.
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Apartment"
              className="absolute bottom-4 right-4 w-2/3 h-2/3 object-cover rounded-2xl border-2 border-brand-dark shadow-sm group-hover:scale-[1.02] transition-transform origin-bottom-right"
            />
          </div>

          {/* Feature 2: Roommate Matching */}
          <div className="bg-blue-600 text-white rounded-3xl border-2 border-brand-dark p-6 relative overflow-hidden group hover:shadow-brutal transition-all">
            <div className="relative z-10">
              <div className="w-10 h-10 bg-white text-blue-600 rounded-lg flex items-center justify-center mb-3">
                <i className="ph-bold ph-users text-xl"></i>
              </div>
              <h3 className="font-display font-bold text-2xl mb-2">Roommate Match</h3>
              <p className="text-white/80 text-sm">
                Find people with your vibe. Filter by habits, major, and sleep schedule.
              </p>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white/20 p-4 rounded-full w-32 h-32 blur-2xl"></div>
          </div>

          {/* Feature 3: Payment Splitting */}
          <div className="bg-brand-300 rounded-3xl border-2 border-brand-dark p-6 relative overflow-hidden group hover:shadow-brutal transition-all">
            <div className="relative z-10">
              <div className="w-10 h-10 bg-brand-900 text-brand-300 rounded-lg flex items-center justify-center mb-3">
                <i className="ph-bold ph-receipt text-xl"></i>
              </div>
              <h3 className="font-display font-bold text-2xl mb-2">Split Bills</h3>
              <p className="text-slate-800 text-sm">
                Automated rent and utility splitting. Never awkwardly ask for money again.
              </p>
            </div>
          </div>
        </div>

        {/* Lower Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Feature 4: Landlord Chat */}
          <div className="bg-white rounded-3xl border-2 border-brand-dark p-6 hover:shadow-brutal transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-pink-400 rounded-lg border-2 border-brand-dark flex items-center justify-center text-white">
                <i className="ph-bold ph-chat-teardrop-text"></i>
              </div>
              <h3 className="font-display font-bold text-xl">Landlord Chat</h3>
            </div>
            <p className="text-slate-600 text-sm">
              Direct, documented communication channels with property managers.
            </p>
          </div>

          {/* Feature 5: User Reviews */}
          <div className="bg-white rounded-3xl border-2 border-brand-dark p-6 hover:shadow-brutal transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg border-2 border-brand-dark flex items-center justify-center text-brand-dark">
                <i className="ph-bold ph-star"></i>
              </div>
              <h3 className="font-display font-bold text-xl">User Reviews</h3>
            </div>
            <p className="text-slate-600 text-sm">
              Honest feedback from previous tenants. Know before you go.
            </p>
          </div>

          {/* Feature 6: Saved Favorites */}
          <div className="bg-white rounded-3xl border-2 border-brand-dark p-6 hover:shadow-brutal transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-brand-dark rounded-lg border-2 border-brand-dark flex items-center justify-center text-white">
                <i className="ph-bold ph-heart"></i>
              </div>
              <h3 className="font-display font-bold text-xl">Saved Favorites</h3>
            </div>
            <p className="text-slate-600 text-sm">
              Curate your top picks and share lists with potential roommates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
