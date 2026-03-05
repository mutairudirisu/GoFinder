"use client";

export const Mission = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-white via-brand-50 to-brand-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display font-bold text-4xl mb-6">Our mission is simple</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Student housing shouldn't be stressful, expensive, or full of hidden surprises. We're on a mission to make finding and managing student accommodation as easy as ordering a pizza.
            </p>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Since launching in 2022, we've helped over 10,000 students find their perfect living situation. From cozy studio apartments to shared houses with awesome roommates.
            </p>
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-4xl font-display font-bold text-brand-600">10k+</div>
                <div className="text-sm text-slate-500 mt-1">Students Housed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-display font-bold text-brand-600">500+</div>
                <div className="text-sm text-slate-500 mt-1">Active Listings</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-display font-bold text-brand-600">50+</div>
                <div className="text-sm text-slate-500 mt-1">Cities</div>
              </div>
            </div>
          </div>

          <div className="relative h-[500px]">
            <div className="absolute top-0 right-0 w-72 h-80 bg-brand-accent rounded-2xl border-2 border-brand-dark shadow-brutal-lg rotate-3 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Team working" />
            </div>
            <div className="absolute bottom-0 left-0 w-64 h-72 bg-brand-400 rounded-2xl border-2 border-brand-dark shadow-brutal-lg -rotate-6 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Team meeting" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
