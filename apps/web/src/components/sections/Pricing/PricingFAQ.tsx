"use client";

export const PricingFAQ = () => {
  return (
    <section className="py-20 bg-brand-50">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-display font-bold text-4xl text-center mb-12">Pricing FAQ</h2>

        <div className="space-y-4">
          <details className="group bg-white rounded-xl border-2 border-brand-dark overflow-hidden transition-all duration-300 open:shadow-brutal">
            <summary className="flex justify-between items-center p-6 cursor-pointer font-bold text-lg list-none text-brand-dark">
              Can I change plans anytime?
              <span className="transition-transform group-open:rotate-180"><i className="ph-bold ph-caret-down"></i></span>
            </summary>
            <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t-2 border-transparent group-open:border-brand-dark/10">
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate the difference.
            </div>
          </details>

          <details className="group bg-white rounded-xl border-2 border-brand-dark overflow-hidden transition-all duration-300 open:shadow-brutal">
            <summary className="flex justify-between items-center p-6 cursor-pointer font-bold text-lg list-none text-brand-dark">
              What payment methods do you accept?
              <span className="transition-transform group-open:rotate-180"><i className="ph-bold ph-caret-down"></i></span>
            </summary>
            <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t-2 border-transparent group-open:border-brand-dark/10">
              We accept all major credit cards (Visa, Mastercard, Amex) and ACH bank transfers. All payments are processed securely through Stripe.
            </div>
          </details>

          <details className="group bg-white rounded-xl border-2 border-brand-dark overflow-hidden transition-all duration-300 open:shadow-brutal">
            <summary className="flex justify-between items-center p-6 cursor-pointer font-bold text-lg list-none text-brand-dark">
              Is there a contract or commitment?
              <span className="transition-transform group-open:rotate-180"><i className="ph-bold ph-caret-down"></i></span>
            </summary>
            <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t-2 border-transparent group-open:border-brand-dark/10">
              No long-term contracts! All plans are month-to-month and you can cancel anytime. Your listings stay active until the end of your billing period.
            </div>
          </details>

          <details className="group bg-white rounded-xl border-2 border-brand-dark overflow-hidden transition-all duration-300 open:shadow-brutal">
            <summary className="flex justify-between items-center p-6 cursor-pointer font-bold text-lg list-none text-brand-dark">
              Do you take a commission on bookings?
              <span className="transition-transform group-open:rotate-180"><i className="ph-bold ph-caret-down"></i></span>
            </summary>
            <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t-2 border-transparent group-open:border-brand-dark/10">
              Nope! We don't take any commission or percentage from your bookings. The monthly subscription fee is all you pay.
            </div>
          </details>
        </div>
      </div>
    </section>
  );
};
