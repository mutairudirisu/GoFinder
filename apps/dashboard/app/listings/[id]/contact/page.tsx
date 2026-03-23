"use client";

import { useState, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { mockProperties } from "../../data";
import { Header } from "@/components/layout";

export default function ContactHostPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const property = mockProperties.find(p => p.id === unwrappedParams.id);

  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  if (!property) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-brand-50/30">
        <Header />
        <div className="max-w-2xl mx-auto px-6 pt-24">
          <div className="text-center py-12">
            <h1 className="font-display font-bold text-2xl text-brand-dark mb-4">
              Property Not Found
            </h1>
            <Link href="/listings" className="text-brand-600 hover:text-brand-700 font-medium">
              ← Back to Listings
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Mock contact info
  const phoneNumber = "+234 801 234 5678";
  const email = "prime.properties@example.com";

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-brand-50/30 pb-20 lg:pb-0">
      {/* Header - hidden on mobile */}
      <div className="hidden lg:block">
        <Header />
      </div>

      {/* Mobile Header */}
      <div className="fixed lg:hidden top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-lg border-b border-slate-200 h-14 flex items-center px-4">
        <Link href={`/listings/${property.id}`} className="flex items-center gap-2">
          <i className="ph-bold ph-arrow-left text-xl text-slate-600"></i>
        </Link>
        <span className="ml-3 font-display font-bold text-brand-dark">Contact</span>
      </div>

      {/* Navigation - hidden on mobile */}
      <div className="bg-white border-b border-slate-100 pt-14 sm:pt-16 hidden lg:block">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <Link 
            href={`/listings/${property.id}`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-600 transition-colors font-medium"
          >
            <i className="ph-bold ph-arrow-left"></i>
            Back to Property
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
              <i className="ph-bold ph-phone-dispatch text-purple-600 text-4xl"></i>
            </div>
            <h1 className="font-display font-bold text-3xl text-brand-dark mb-2">
              Contact Host
            </h1>
            <p className="text-slate-500">
              Get in touch with {property.landlord.name}
            </p>
          </div>

          {/* Property Preview */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 mb-6">
            <div className="flex gap-4">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-24 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-brand-dark text-lg">{property.title}</h3>
                <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                  <i className="ph-bold ph-map-pin"></i>
                  {property.location}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold text-brand-600">${property.price}</span>
                  <span className="text-slate-500 text-sm">/ {property.priceType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Landlord Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 mb-6">
            <div className="text-center mb-6">
              <img
                src={property.landlord.image}
                alt={property.landlord.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-green-100 mx-auto mb-4"
              />
              <h2 className="font-bold text-2xl text-brand-dark">{property.landlord.name}</h2>
              {property.landlord.verified && (
                <span className="inline-flex items-center gap-1 text-green-600 mt-2">
                  <i className="ph-fill ph-seal-check"></i>
                  Verified Landlord
                </span>
              )}
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="text-center">
                  <p className="font-bold text-brand-dark text-xl">{property.rating}</p>
                  <p className="text-slate-500 text-sm">Rating</p>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="text-center">
                  <p className="font-bold text-brand-dark text-xl">{property.reviews}</p>
                  <p className="text-slate-500 text-sm">Reviews</p>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="text-center">
                  <p className="font-bold text-brand-dark text-xl">2+</p>
                  <p className="text-slate-500 text-sm">Years</p>
                </div>
              </div>
            </div>

            {/* Contact Options */}
            <div className="space-y-4">
              {/* Phone */}
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <i className="ph-bold ph-phone text-green-600 text-xl"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-brand-dark">Phone Number</p>
                      <p className="text-slate-500 text-sm">
                        {showPhone ? phoneNumber : "Click to reveal"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPhone(!showPhone)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      showPhone
                        ? "bg-green-100 text-green-700"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {showPhone ? (
                      <i className="ph-bold ph-eye-slash"></i>
                    ) : (
                      <>
                        <i className="ph-bold ph-eye"></i>
                        Reveal
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <i className="ph-bold ph-envelope text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-brand-dark">Email Address</p>
                      <p className="text-slate-500 text-sm">
                        {showEmail ? email : "Click to reveal"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowEmail(!showEmail)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      showEmail
                        ? "bg-blue-100 text-blue-700"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {showEmail ? (
                      <i className="ph-bold ph-eye-slash"></i>
                    ) : (
                      <>
                        <i className="ph-bold ph-eye"></i>
                        Reveal
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Response Time */}
              <div className="p-4 bg-amber-50 rounded-2xl flex items-center gap-3">
                <i className="ph-bold ph-clock text-amber-600 text-2xl"></i>
                <div>
                  <p className="font-semibold text-amber-800">Response Time</p>
                  <p className="text-amber-700 text-sm">Usually responds within 2 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Link
              href={`/listings/${property.id}/message`}
              className="py-4 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
            >
              <i className="ph-bold ph-chat-circle-dots"></i>
              Send Message
            </Link>
            <button className="py-4 border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
              <i className="ph-bold ph-video-camera"></i>
              Request Tour
            </button>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
            <h3 className="font-bold text-lg text-brand-dark mb-4 flex items-center gap-2">
              <i className="ph-bold ph-calendar-check text-green-500"></i>
              Availability
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <span className="text-green-700">Status</span>
                <span className="font-semibold text-green-700 flex items-center gap-1">
                  <i className="ph-fill ph-check-circle"></i>
                  Available Now
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Viewing Times</span>
                <span className="text-slate-700">Mon-Sat, 9AM-6PM</span>
              </div>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
            <div className="flex items-start gap-3">
              <i className="ph-bold ph-shield-check text-blue-600 text-2xl mt-0.5"></i>
              <div>
                <h4 className="font-semibold text-blue-800">Safety Notice</h4>
                <p className="text-sm text-blue-700 mt-1">
                  For your safety, we recommend using our in-app messaging and payment systems. 
                  Never share personal information or transfer money outside the platform.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed lg:hidden bottom-4 left-4 right-4 z-40">
        <div className="flex items-center justify-around h-16 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] border border-white/40">
          <Link
            href={`/listings/${property.id}`}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-slate-500 hover:text-brand-600 transition-colors"
          >
            <i className="ph-bold ph-house text-xl"></i>
            <span className="text-xs font-medium">Property</span>
          </Link>
          <Link
            href={`/listings/${property.id}/message`}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <i className="ph-bold ph-chat-circle-dots text-xl"></i>
            <span className="text-xs font-medium">Message</span>
          </Link>
          <Link
            href={`/listings/${property.id}/contact`}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <i className="ph-bold ph-phone text-xl"></i>
            <span className="text-xs font-medium">Contact</span>
          </Link>
          <Link
            href="/listings/saved"
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-slate-500 hover:text-red-500 transition-colors"
          >
            <i className="ph-bold ph-heart text-xl"></i>
            <span className="text-xs font-medium">Saved</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
