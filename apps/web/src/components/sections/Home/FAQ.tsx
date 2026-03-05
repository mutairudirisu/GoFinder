"use client";

export const FAQ = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-display font-bold text-4xl text-center mb-12">Frequently Asked Questions</h2>

        <div className="space-y-4">
          <details className="group bg-brand-50 rounded-xl border-2 border-brand-dark overflow-hidden transition-all duration-300 open:shadow-brutal">
            <summary className="flex justify-between items-center p-6 cursor-pointer font-bold text-lg list-none text-brand-dark">
              How does the roommate matching work?
              <span className="transition-transform group-open:rotate-180"><i className="ph-bold ph-caret-down"></i></span>
            </summary>
            <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t-2 border-transparent group-open:border-brand-dark/10">
              Our algorithm uses a 15-point compatibility quiz covering sleep habits, cleanliness, social preferences, and study schedules to find your ideal living match.
            </div>
          </details>

          <details className="group bg-brand-50 rounded-xl border-2 border-brand-dark overflow-hidden transition-all duration-300 open:shadow-brutal">
            <summary className="flex justify-between items-center p-6 cursor-pointer font-bold text-lg list-none text-brand-dark">
              Is payment splitting secure?
              <span className="transition-transform group-open:rotate-180"><i className="ph-bold ph-caret-down"></i></span>
            </summary>
            <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t-2 border-transparent group-open:border-brand-dark/10">
              Yes! We use Stripe for all payment processing. Rent is collected from each roommate individually and deposited to the landlord as a single lump sum.
            </div>
          </details>

          <details className="group bg-brand-50 rounded-xl border-2 border-brand-dark overflow-hidden transition-all duration-300 open:shadow-brutal">
            <summary className="flex justify-between items-center p-6 cursor-pointer font-bold text-lg list-none text-brand-dark">
              Are the listings verified?
              <span className="transition-transform group-open:rotate-180"><i className="ph-bold ph-caret-down"></i></span>
            </summary>
            <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t-2 border-transparent group-open:border-brand-dark/10">
              Absolutely. We require landlord identity verification and proof of ownership. We also have a community flagging system to keep the platform safe.
            </div>
          </details>

          <details className="group bg-brand-50 rounded-xl border-2 border-brand-dark overflow-hidden transition-all duration-300 open:shadow-brutal">
            <summary className="flex justify-between items-center p-6 cursor-pointer font-bold text-lg list-none text-brand-dark">
              Can I list a sublet?
              <span className="transition-transform group-open:rotate-180"><i className="ph-bold ph-caret-down"></i></span>
            </summary>
            <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t-2 border-transparent group-open:border-brand-dark/10">
              Yes, students can list their rooms for subletting for free on our Basic plan, perfect for summer breaks or semesters abroad.
            </div>
          </details>
        </div>
      </div>
    </section>
  );
};