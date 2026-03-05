"use client";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 bg-brand-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 border-brand-dark shadow-brutal-sm mb-8">
          <i className="ph-fill ph-envelope text-brand-600"></i>
          <span className="text-xs font-bold uppercase tracking-wider">Get in Touch</span>
        </div>

        <h1 className="font-display font-bold text-5xl md:text-7xl leading-tight text-brand-dark mb-6">
          We'd love to<br />
          <span className="text-brand-600 italic">hear from you.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Have questions about HostelFinder? Want to partner with us? Or just want to say hi? Reach out and we'll get back to you as soon as possible.
        </p>
      </div>
      <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px]"></div>
    </section>
  );
};
