"use client";

export const ContactInfo = () => {
  return (
    <section className="py-24 bg-brand-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl mb-4 text-brand-dark">Get in touch</h2>
          <p className="text-slate-600">Multiple ways to reach us</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Email */}
          <div className="bg-white rounded-2xl p-8 border-2 border-brand-dark hover:shadow-brutal transition-all text-center">
            <div className="w-14 h-14 bg-blue-500 rounded-xl border-2 border-brand-dark flex items-center justify-center mb-6 mx-auto text-white">
              <i className="ph-bold ph-envelope text-2xl"></i>
            </div>
            <h3 className="font-display font-bold text-2xl mb-3 text-brand-dark">Email</h3>
            <p className="text-slate-600 mb-4">Our team responds within 24 hours</p>
            <a href="mailto:hello@hostelfinder.com" className="text-brand-600 font-bold hover:text-brand-700">
              hello@hostelfinder.com
            </a>
          </div>

          {/* Phone */}
          <div className="bg-white rounded-2xl p-8 border-2 border-brand-dark hover:shadow-brutal transition-all text-center">
            <div className="w-14 h-14 bg-brand-accent rounded-xl border-2 border-brand-dark flex items-center justify-center mb-6 mx-auto text-white">
              <i className="ph-bold ph-phone text-2xl"></i>
            </div>
            <h3 className="font-display font-bold text-2xl mb-3 text-brand-dark">Phone</h3>
            <p className="text-slate-600 mb-4">Mon-Fri, 9AM-6PM EST</p>
            <a href="tel:+18005551234" className="text-brand-600 font-bold hover:text-brand-700">
              +1 (800) 555-1234
            </a>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl p-8 border-2 border-brand-dark hover:shadow-brutal transition-all text-center">
            <div className="w-14 h-14 bg-brand-400 rounded-xl border-2 border-brand-dark flex items-center justify-center mb-6 mx-auto text-brand-dark">
              <i className="ph-bold ph-map-pin text-2xl"></i>
            </div>
            <h3 className="font-display font-bold text-2xl mb-3 text-brand-dark">Office</h3>
            <p className="text-slate-600">123 Student Ave<br />New York, NY 10001</p>
          </div>
        </div>

        {/* Office Locations */}
        <div className="mt-16">
          <h3 className="font-display font-bold text-3xl text-center mb-12 text-brand-dark">Office Locations</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border-2 border-brand-dark">
              <h4 className="font-display font-bold text-2xl mb-4 text-brand-dark">New York HQ</h4>
              <p className="text-slate-600 mb-2">123 Student Ave, Floor 10</p>
              <p className="text-slate-600 mb-4">New York, NY 10001</p>
              <a href="mailto:ny@hostelfinder.com" className="text-brand-600 font-bold hover:text-brand-700 block mb-2">
                ny@hostelfinder.com
              </a>
              <a href="tel:+12125551234" className="text-brand-600 font-bold hover:text-brand-700">
                +1 (212) 555-1234
              </a>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-brand-dark">
              <h4 className="font-display font-bold text-2xl mb-4 text-brand-dark">California Office</h4>
              <p className="text-slate-600 mb-2">456 Campus Blvd, Suite 200</p>
              <p className="text-slate-600 mb-4">Los Angeles, CA 90001</p>
              <a href="mailto:ca@hostelfinder.com" className="text-brand-600 font-bold hover:text-brand-700 block mb-2">
                ca@hostelfinder.com
              </a>
              <a href="tel:+13105551234" className="text-brand-600 font-bold hover:text-brand-700">
                +1 (310) 555-1234
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
