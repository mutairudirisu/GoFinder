"use client";

export const Values = () => {
  return (
    <section className="py-20 bg-brand-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl mb-4">What we stand for</h2>
          <p className="text-slate-600">The principles that guide everything we do</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Trust & Safety Card */}
          <div className="group flex flex-col h-full bg-gradient-to-br from-emerald-100 border border-emerald-100 via-brand-50 to-cyan-50 rounded-3xl p-8">
            <div className="flex items-center gap-2 mb-8 pl-2">
              <h3 className="font-display font-bold text-xl text-emerald-800">Trust & Safety</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 40 40">
                <path d="m16.073 3.99 13.68 13.68H3v4.5h26.707L16.073 35.805 19.245 39 36.75 21.495V18.3L19.245.795 16.073 3.99Z" fill="#10B981"></path>
              </svg>
            </div>

            {/* Illustration */}
            <div className="mb-8 h-48 flex items-center justify-center relative">
              <svg viewBox="0 0 200 200" className="w-40 h-40">
                <defs>
                  <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#A7F3D0", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#6EE7B7", stopOpacity: 1 }} />
                  </linearGradient>
                </defs>

                {/* Outer circle */}
                <circle cx="100" cy="100" r="95" fill="url(#trustGradient)" opacity="0.3" />

                {/* Middle circle */}
                <circle cx="100" cy="100" r="85" fill="url(#trustGradient)" opacity="0.5" stroke="#10B981" strokeWidth="2" />

                {/* Protective hand base */}
                <path
                  d="M 50 120 Q 40 100 50 80 Q 60 70 80 75 L 80 140 Q 60 145 40 135 Z"
                  fill="#34D399"
                  opacity="0.7"
                />
                <path
                  d="M 150 120 Q 160 100 150 80 Q 140 70 120 75 L 120 140 Q 140 145 160 135 Z"
                  fill="#34D399"
                  opacity="0.7"
                />

                {/* House structure */}
                <g transform="translate(70, 75)">
                  <rect x="15" y="20" width="30" height="28" fill="#F3F4F6" stroke="#1F2937" strokeWidth="1.5" rx="2" />
                  <polygon points="15,20 30,5 45,20" fill="#059669" stroke="#047857" strokeWidth="1.5" />
                  <rect x="26" y="35" width="8" height="13" fill="#10B981" stroke="#059669" strokeWidth="1" />
                  <circle cx="33" cy="41" r="1" fill="#059669" />
                  <rect x="19" y="27" width="6" height="6" fill="#DBEAFE" stroke="#059669" strokeWidth="0.8" />
                  <rect x="39" y="27" width="6" height="6" fill="#DBEAFE" stroke="#059669" strokeWidth="0.8" />
                  <rect x="42" y="12" width="3" height="8" fill="#6B7280" stroke="#1F2937" strokeWidth="0.8" />
                </g>

                {/* Checkmark */}
                <g transform="translate(140, 140)">
                  <circle cx="0" cy="0" r="12" fill="#10B981" stroke="#059669" strokeWidth="1.5" />
                  <path d="M -5 0 L -2 3 L 4 -3" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                </g>

                {/* Decorative dots */}
                <circle cx="40" cy="50" r="2" fill="#10B981" opacity="0.4" />
                <circle cx="160" cy="60" r="2" fill="#10B981" opacity="0.4" />
              </svg>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-3xl p-6 flex gap-4 flex-1 border-2 border-brand-dark shadow-lg group-hover:shadow-brutal group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-slate-600 text-sm">Every listing is verified. Every landlord is screened. Every transaction is secure. No compromises.</p>
            </div>
          </div>

          {/* Innovation Card */}
          <div className="group flex flex-col h-full bg-gradient-to-br from-yellow-100 border-yellow-100 via-brand-50 to-orange-50 rounded-3xl p-8">
            <div className="flex items-center gap-2 mb-8 pl-2">
              <h3 className="font-display font-bold text-xl text-yellow-800">Innovation</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 40 40">
                <path d="m16.073 3.99 13.68 13.68H3v4.5h26.707L16.073 35.805 19.245 39 36.75 21.495V18.3L19.245.795 16.073 3.99Z" fill="#F59E0B"></path>
              </svg>
            </div>

            {/* Illustration */}
            <div className="mb-8 h-48 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-40 h-40">
                <defs>
                  <linearGradient id="innovationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#FCD34D", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#FBBF24", stopOpacity: 1 }} />
                  </linearGradient>
                </defs>

                {/* Outer circle */}
                <circle cx="100" cy="100" r="95" fill="url(#innovationGradient)" opacity="0.3" />

                {/* Middle circle */}
                <circle cx="100" cy="100" r="85" fill="url(#innovationGradient)" opacity="0.5" stroke="#F59E0B" strokeWidth="2" />

                {/* Light bulb glow */}
                <circle cx="100" cy="85" r="22" fill="#FCD34D" opacity="0.4" />

                {/* Light bulb */}
                <g transform="translate(100, 85)">
                  {/* Bulb */}
                  <circle cx="0" cy="0" r="18" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" />
                  {/* Filament */}
                  <path d="M -5 5 Q 0 -5 5 5" stroke="#F59E0B" strokeWidth="2" fill="none" />
                  {/* Base */}
                  <rect x="-6" y="18" width="12" height="8" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
                  {/* Spark 1 */}
                  <line x1="-25" y1="-15" x2="-35" y2="-25" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
                  {/* Spark 2 */}
                  <line x1="25" y1="-15" x2="35" y2="-25" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
                  {/* Spark 3 */}
                  <line x1="0" y1="-35" x2="0" y2="-48" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
                </g>
              </svg>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-3xl p-6 flex gap-4 flex-1 border-2 border-brand-dark shadow-lg group-hover:shadow-brutal group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.343a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM16.364 15.364a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707zM11 15a1 1 0 100 2v-2a1 1 0 000 2zM5.343 15.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1-1V8a1 1 0 112 0v1a1 1 0 01-1 1zM7.757 5.343a1 1 0 00-1.414-1.414L5.636 5.636a1 1 0 001.414 1.414l.707-.707z" />
                  </svg>
                </div>
              </div>
              <p className="text-slate-600 text-sm">We're constantly building new features based on real student feedback. Your ideas shape our roadmap.</p>
            </div>
          </div>

          {/* Community Card */}
          <div className="group flex flex-col h-full bg-gradient-to-br from-purple-200 via-brand-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-100">
            <div className="flex items-center gap-2 mb-8 pl-2">
              <h3 className="font-display font-bold text-xl text-purple-800">Community</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 40 40">
                <path d="m16.073 3.99 13.68 13.68H3v4.5h26.707L16.073 35.805 19.245 39 36.75 21.495V18.3L19.245.795 16.073 3.99Z" fill="#D946EF"></path>
              </svg>
            </div>

            {/* Illustration */}
            <div className="mb-8 h-48 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-40 h-40">
                <defs>
                  <linearGradient id="communityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#A78BFA", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#D946EF", stopOpacity: 1 }} />
                  </linearGradient>
                </defs>

                {/* Outer circle */}
                <circle cx="100" cy="100" r="95" fill="url(#communityGradient)" opacity="0.3" />

                {/* Middle circle */}
                <circle cx="100" cy="100" r="85" fill="url(#communityGradient)" opacity="0.5" stroke="#D946EF" strokeWidth="2" />

                {/* Connected hearts */}
                <g transform="translate(100, 100)">
                  {/* Center heart */}
                  <path
                    d="M 0,-5 C -8,-12 -18,-12 -18,-2 C -18,8 0,20 0,20 C 0,20 18,8 18,-2 C 18,-12 8,-12 0,-5 Z"
                    fill="#D946EF"
                    stroke="#A855F7"
                    strokeWidth="1.5"
                  />

                  {/* Left heart */}
                  <path
                    d="M -25,-8 C -30,-13 -38,-13 -38,-5 C -38,3 -25,12 -25,12 C -25,12 -12,3 -12,-5 C -12,-13 -20,-13 -25,-8 Z"
                    fill="#C084FC"
                    opacity="0.7"
                    stroke="#A855F7"
                    strokeWidth="1.5"
                  />

                  {/* Right heart */}
                  <path
                    d="M 25,-8 C 30,-13 38,-13 38,-5 C 38,3 25,12 25,12 C 25,12 12,3 12,-5 C 12,-13 20,-13 25,-8 Z"
                    fill="#C084FC"
                    opacity="0.7"
                    stroke="#A855F7"
                    strokeWidth="1.5"
                  />

                  {/* Connection lines */}
                  <line x1="-12" y1="0" x2="0" y2="-5" stroke="#A855F7" strokeWidth="1.5" opacity="0.6" />
                  <line x1="12" y1="0" x2="0" y2="-5" stroke="#A855F7" strokeWidth="1.5" opacity="0.6" />
                </g>
              </svg>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-3xl p-6 flex gap-4 flex-1 border-2 border-brand-dark shadow-lg group-hover:shadow-brutal group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-brand-lime flex items-center justify-center text-brand-dark">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                </div>
              </div>
              <p className="text-slate-600 text-sm">We're more than a platform. We're building a community of students helping students live better.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
