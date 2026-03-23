"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { mockProperties } from "../../data";
import { Header } from "@/components/layout";
import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/context/MessageContext";

export default function MessageHostPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const property = mockProperties.find(p => p.id === unwrappedParams.id);
  const router = useRouter();
  const { user } = useAuth();
  const { startConversation, sendMessage } = useMessages();

  const [message, setMessage] = useState(
    `Hi! I'm interested in ${property?.title || 'your property'}. Is it still available?`
  );
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

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

  const handleSendMessage = async () => {
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setIsSending(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const landlordId = `landlord_${property.landlord.name.replace(/\s+/g, '_').toLowerCase()}`;
    
    const conversationId = startConversation(
      property.id,
      property.title,
      property.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400',
      landlordId,
      property.landlord.name,
      user.id,
      user.name
    );

    // Send the initial message
    sendMessage(conversationId, user.id, message);

    setIsSending(false);
    setSent(true);
  };

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
        <span className="ml-3 font-display font-bold text-brand-dark">Message</span>
      </div>

      {/* Navigation - hidden on mobile */}
      <div className="bg-white border-b border-slate-100 pt-14 sm:pt-16 hidden lg:block">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link 
            href={`/listings/${property.id}`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-600 transition-colors font-medium"
          >
            <i className="ph-bold ph-arrow-left"></i>
            Back to Property
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <i className="ph-bold ph-chat-circle-dots text-green-600 text-4xl"></i>
            </div>
            <h1 className="font-display font-bold text-3xl text-brand-dark mb-2">
              Message Host
            </h1>
            <p className="text-slate-500">
              Send a message to {property.landlord.name} about {property.title}
            </p>
          </div>

          {/* Property Preview Card */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 mb-6">
            <div className="flex gap-4">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-32 h-24 rounded-xl object-cover"
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

          {sent ? (
            /* Success State */
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <i className="ph-bold ph-check text-green-600 text-4xl"></i>
              </div>
              <h2 className="font-display font-bold text-2xl text-brand-dark mb-2">
                Message Sent!
              </h2>
              <p className="text-slate-500 mb-6">
                Your message has been sent to {property.landlord.name}. They'll get back to you soon.
              </p>
              <div className="flex gap-3 justify-center">
                <Link
                  href={`/listings/${property.id}`}
                  className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Back to Property
                </Link>
                <Link
                  href="/messages"
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <i className="ph-bold ph-chat-circle-dots"></i>
                  View Messages
                </Link>
              </div>
            </div>
          ) : (
            /* Message Form */
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
              {/* Landlord Info */}
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100 mb-6">
                <img
                  src={property.landlord.image}
                  alt={property.landlord.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-green-100"
                />
                <div>
                  <h3 className="font-bold text-brand-dark text-lg">{property.landlord.name}</h3>
                  {property.landlord.verified && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600">
                      <i className="ph-fill ph-seal-check"></i>
                      Verified Landlord
                    </span>
                  )}
                  <p className="text-slate-500 text-sm mt-1">Usually responds within 2 hours</p>
                </div>
              </div>

              {/* Quick Messages */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Quick Messages
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Is this still available?",
                    "Can I schedule a viewing?",
                    "What's included in the price?",
                    "Are there any move-in specials?"
                  ].map((quickMsg) => (
                    <button
                      key={quickMsg}
                      onClick={() => setMessage(quickMsg)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        message === quickMsg
                          ? "bg-green-100 text-green-700 border-2 border-green-300"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-2 border-transparent"
                      }`}
                    >
                      {quickMsg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Your Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-green-300 focus:outline-none transition-colors resize-none"
                  placeholder="Write your message here..."
                />
              </div>

              {/* Contact Options */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button className="py-3 bg-green-50 text-green-700 font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-green-100 transition-colors">
                  <i className="ph-bold ph-phone"></i>
                  Request Call
                </button>
                <button className="py-3 bg-purple-50 text-purple-700 font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-purple-100 transition-colors">
                  <i className="ph-bold ph-video-camera"></i>
                  Request Video Tour
                </button>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={isSending || !message.trim()}
                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  isSending || !message.trim()
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/30 hover:shadow-brutal hover:-translate-y-1"
                }`}
              >
                {isSending ? (
                  <>
                    <i className="ph-bold ph-spinner animate-spin"></i>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="ph-bold ph-paper-plane-tilt"></i>
                    Send Message
                  </>
                )}
              </button>
            </div>
          )}

          {/* Safety Tips */}
          <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
            <div className="flex items-start gap-3">
              <i className="ph-bold ph-shield-check text-blue-600 text-2xl mt-0.5"></i>
              <div>
                <h4 className="font-semibold text-blue-800">Safety Tips</h4>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Never pay before viewing the property</li>
                  <li>• Use our messaging system for all communication</li>
                  <li>• Report any suspicious requests to our support team</li>
                </ul>
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
