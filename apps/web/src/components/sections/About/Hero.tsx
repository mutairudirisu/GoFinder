"use client";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 bg-brand-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 border-brand-dark shadow-brutal-sm mb-8">
          <i className="ph-fill ph-users-three text-brand-600"></i>
          <span className="text-xs font-bold uppercase tracking-wider">Our Story</span>
        </div>

        <h1 className="font-display font-bold text-5xl md:text-7xl leading-tight text-brand-dark mb-6">
          Built by students,<br />
          <span className="text-brand-600 italic">for students.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          We've been there. The stress of finding housing, splitting bills with roommates, and dealing with landlords. So we built something better.
        </p>
      </div>
      <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px]"></div>

    </section>
  );
};
