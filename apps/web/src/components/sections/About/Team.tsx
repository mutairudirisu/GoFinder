"use client";

export const Team = () => {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl mb-4">Meet the team</h2>
          <p className="text-slate-600">A small but mighty crew of ex-students and housing nerds</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="relative mb-4 overflow-hidden rounded-2xl border-2 border-brand-dark">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" className="w-full aspect-square object-cover group-hover:scale-110 transition-transform" alt="Team member" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                <div className="flex gap-3">
                  <a href="#" className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                    <i className="ph-fill ph-linkedin-logo text-brand-dark"></i>
                  </a>
                  <a href="#" className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                    <i className="ph-fill ph-twitter-logo text-brand-dark"></i>
                  </a>
                </div>
              </div>
            </div>
            <h4 className="font-bold text-lg">Alex Martinez</h4>
            <p className="text-sm text-brand-600 font-medium">CEO & Co-Founder</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4 overflow-hidden rounded-2xl border-2 border-brand-dark">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" className="w-full aspect-square object-cover group-hover:scale-110 transition-transform" alt="Team member" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                <div className="flex gap-3">
                  <a href="#" className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                    <i className="ph-fill ph-linkedin-logo text-brand-dark"></i>
                  </a>
                  <a href="#" className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                    <i className="ph-fill ph-twitter-logo text-brand-dark"></i>
                  </a>
                </div>
              </div>
            </div>
            <h4 className="font-bold text-lg">Sarah Chen</h4>
            <p className="text-sm text-brand-600 font-medium">CTO & Co-Founder</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4 overflow-hidden rounded-2xl border-2 border-brand-dark">
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80" className="w-full aspect-square object-cover group-hover:scale-110 transition-transform" alt="Team member" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                <div className="flex gap-3">
                  <a href="#" className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                    <i className="ph-fill ph-linkedin-logo text-brand-dark"></i>
                  </a>
                  <a href="#" className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                    <i className="ph-fill ph-twitter-logo text-brand-dark"></i>
                  </a>
                </div>
              </div>
            </div>
            <h4 className="font-bold text-lg">Jordan Davis</h4>
            <p className="text-sm text-brand-600 font-medium">Head of Product</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4 overflow-hidden rounded-2xl border-2 border-brand-dark">
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" className="w-full aspect-square object-cover group-hover:scale-110 transition-transform" alt="Team member" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                <div className="flex gap-3">
                  <a href="#" className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                    <i className="ph-fill ph-linkedin-logo text-brand-dark"></i>
                  </a>
                  <a href="#" className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                    <i className="ph-fill ph-twitter-logo text-brand-dark"></i>
                  </a>
                </div>
              </div>
            </div>
            <h4 className="font-bold text-lg">Maya Patel</h4>
            <p className="text-sm text-brand-600 font-medium">Head of Growth</p>
          </div>
        </div>
      </div>
    </section>
  );
};
