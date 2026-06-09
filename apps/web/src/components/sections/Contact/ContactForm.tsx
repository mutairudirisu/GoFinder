"use client";

import { useState } from "react";
import Link from 'next/link';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userType: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ firstName: "", lastName: "", email: "", userType: "", message: "" });
  };

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl border-2 border-brand-dark p-8 shadow-brutal">
            <h2 className="font-display font-bold text-3xl mb-6">Send us a message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Alex"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-brand-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Smith"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-brand-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@university.edu"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-brand-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">I am a...</label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-brand-500 focus:outline-none transition-colors"
                >
                  <option value="">Select an option</option>
                  <option value="student">Student looking for housing</option>
                  <option value="landlord">Landlord/Property Manager</option>
                  <option value="support">Current User (Support)</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell us how we can help..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-brand-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-brand-500 text-brand-dark font-bold text-lg rounded-xl border-2 border-brand-dark shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <i className="ph-bold ph-paper-plane-tilt"></i>
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-display font-bold text-2xl mb-6">Other ways to reach us</h3>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-start gap-4 p-6 bg-brand-50 rounded-2xl border-2 border-brand-dark hover:shadow-brutal transition-all">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg border-2 border-brand-dark flex items-center justify-center text-white flex-shrink-0">
                    <i className="ph-bold ph-envelope text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Email Us</h4>
                    <p className="text-sm text-slate-600 mb-2">For general inquiries and support</p>
                    <a href="mailto:hello@hostelfinder.com" className="text-brand-600 font-bold text-sm hover:underline">
                      hello@gigsrentals.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-6 bg-brand-50 rounded-2xl border-2 border-brand-dark hover:shadow-brutal transition-all">
                  <div className="w-12 h-12 bg-brand-accent rounded-lg border-2 border-brand-dark flex items-center justify-center text-white flex-shrink-0">
                    <i className="ph-bold ph-phone text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Call Us</h4>
                    <p className="text-sm text-slate-600 mb-2">Mon-Fri, 9AM-6PM EST</p>
                    <a href="tel:+2340811234567" className="text-brand-600 font-bold text-sm hover:underline">
                      +234 (081) 123-45678
                    </a>
                  </div>
                </div>

                {/* Office */}
                <div className="flex items-start gap-4 p-6 bg-brand-50 rounded-2xl border-2 border-brand-dark hover:shadow-brutal transition-all">
                  <div className="w-12 h-12 bg-brand-lime rounded-lg border-2 border-brand-dark flex items-center justify-center text-brand-dark flex-shrink-0">
                    <i className="ph-bold ph-map-pin text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Visit Us</h4>
                    <p className="text-sm text-slate-600">
                      123 Campus Drive, Suite 200<br />
                      Lagos, Nigeria 100001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-brand-dark text-white rounded-2xl p-8 border-2 border-brand-dark">
              <div className="flex items-start gap-4">
                <i className="ph-fill ph-question text-4xl text-brand-400"></i>
                <div>
                  <h4 className="font-display font-bold text-xl mb-2">Check our FAQ</h4>
                  <p className="text-gray-300 text-sm mb-4">Most questions are already answered in our help center.</p>
                  <Link
                    href="/faq"
                    className="text-brand-400 font-bold text-sm hover:underline flex items-center gap-2"
                  >
                    Browse FAQ <i className="ph-bold ph-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-bold mb-4">Follow us on socials</h4>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-white rounded-lg border-2 border-brand-dark flex items-center justify-center hover:bg-brand-50 hover:shadow-brutal transition-all">
                  <i className="ph-fill ph-twitter-logo text-xl text-brand-dark"></i>
                </a>
                <a href="#" className="w-12 h-12 bg-white rounded-lg border-2 border-brand-dark flex items-center justify-center hover:bg-brand-50 hover:shadow-brutal transition-all">
                  <i className="ph-fill ph-instagram-logo text-xl text-brand-dark"></i>
                </a>
                <a href="#" className="w-12 h-12 bg-white rounded-lg border-2 border-brand-dark flex items-center justify-center hover:bg-brand-50 hover:shadow-brutal transition-all">
                  <i className="ph-fill ph-tiktok-logo text-xl text-brand-dark"></i>
                </a>
                <a href="#" className="w-12 h-12 bg-white rounded-lg border-2 border-brand-dark flex items-center justify-center hover:bg-brand-50 hover:shadow-brutal transition-all">
                  <i className="ph-fill ph-linkedin-logo text-xl text-brand-dark"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
