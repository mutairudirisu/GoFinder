"use client";

import { useState } from "react";

export function FAQContent() {
  const [activeTab, setActiveTab] = useState<"landlords" | "tenants">(
    "tenants",
  );
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const landlordFAQs = [
    {
      id: "listing-creation",
      question: "How do I list my property on GIGS Rentals?",
      answer:
        "To list your property, create an account and navigate to the dashboard. Click on 'Add Listing' and fill in the required details including property photos, description, amenities, pricing, and availability. Once submitted, your listing will be reviewed and published within 24-48 hours.",
    },
    {
      id: "listing-fees",
      question: "What are the fees for listing my property?",
      answer:
        "GIGS Rentals offers competitive pricing for landlords. The first listing is free, and subsequent listings start at ₦5,000 per month. We also offer premium packages with additional features like featured placement and analytics. Check our pricing page for details.",
    },
    {
      id: "tenant-screening",
      question: "How do I screen potential tenants?",
      answer:
        "Our platform provides comprehensive tenant screening tools. You can request verified IDs, income verification, academic status, and references from prospective tenants. The dashboard includes a screening checklist to help you evaluate applications efficiently.",
    },
    {
      id: "payment-collection",
      question: "How do I collect rent payments?",
      answer:
        "GIGS Rentals offers secure automated rent collection. Tenants can pay through bank transfer, debit cards, or mobile money. You receive payments directly to your registered bank account with detailed transaction records in your dashboard.",
    },
    {
      id: "lease-agreement",
      question: "Does GIGS provide lease agreement templates?",
      answer:
        "Yes, we provide standard lease agreement templates that comply with Nigerian租房 laws. You can customize these templates for your specific requirements. We also recommend consulting a legal professional for custom agreements.",
    },
    {
      id: "property-management",
      question: "Can I manage multiple properties from one account?",
      answer:
        "Absolutely! Our dashboard allows you to manage unlimited properties. You can track bookings, payments, and tenant information for each property individually or view consolidated reports across all your listings.",
    },
    {
      id: "response-time",
      question: "How quickly should I respond to tenant inquiries?",
      answer:
        "We recommend responding within 24 hours to maintain a good response rate. Properties with faster response times appear higher in search results. Use our messaging templates to respond quickly to common questions.",
    },
    {
      id: "cancellation-policy",
      question: "What is your cancellation policy for landlords?",
      answer:
        "Landlords can cancel a booking with at least 7 days' notice before the check-in date for a full refund. Cancellations made within 7 days may incur a fee. Emergency cancellations are handled case-by-case. Check your dashboard for full details.",
    },
  ];

  const tenantFAQs = [
    {
      id: "account-creation",
      question: "How do I create an account?",
      answer:
        "Click the 'Sign Up' button on the homepage, enter your email address and phone number, then verify through the OTP sent to your phone. Complete your profile with your details and you're ready to start searching for properties.",
    },
    {
      id: "search-listings",
      question: "How do I search for available listings?",
      answer:
        "Use the search bar on the homepage to enter your preferred location. Apply filters for price range, property type, number of bedrooms, and amenities. You can also sort results by price, distance, or ratings.",
    },
    {
      id: "booking-process",
      question: "How do I make a booking?",
      answer:
        "Found a property you like? Click 'Book Now' to select your move-in date and duration. Review the total cost including security deposit and service fees, then confirm your booking. You'll receive a confirmation email with payment instructions.",
    },
    {
      id: "payment-methods",
      question: "What payment methods are accepted?",
      answer:
        "We accept bank transfers, debit/credit cards (Visa, Mastercard), and mobile money (MTN, Airtel). All transactions are secured with industry-standard encryption. You can save your preferred payment method for faster checkout.",
    },
    {
      id: "security-deposit",
      question: "How is the security deposit handled?",
      answer:
        "The security deposit is held in escrow until checkout. Upon moving out and property inspection, the deposit is refunded within 7 business days minus any deductions for damages or outstanding utilities.",
    },
    {
      id: "cancellation",
      question: "Can I cancel my booking?",
      answer:
        "Yes, you can cancel bookings through your dashboard. Cancellations made 14+ days before check-in receive a full refund. Cancellations 7-13 days before receive a 50% refund. Cancellations within 7 days are non-refundable unless due to extenuating circumstances.",
    },
    {
      id: "move-in-process",
      question: "What happens after I book?",
      answer:
        "After booking confirmation, you'll receive move-in instructions including check-in time, location address, and contact person. On move-in day, you'll complete identity verification and receive your keys. The security deposit is collected at this time.",
    },
    {
      id: "maintenance",
      question: "Who do I contact for maintenance issues?",
      answer:
        "Report maintenance issues through your dashboard's 'Support' section. Include photos and a description of the issue. Our team coordinates with landlords to resolve problems. For emergencies, call our 24/7 support line directly.",
    },
    {
      id: "verification",
      question: "Why do I need to verify my identity?",
      answer:
        "Identity verification ensures the safety of both tenants and landlords. It's required before your first booking. Upload a valid government-issued ID (National ID, PVC, or Passport). Verification is usually completed within 24 hours.",
    },
    {
      id: "roommate-matching",
      question: "How does roommate matching work?",
      answer:
        "Create a roommate profile specifying your preferences (budget, location, move-in date). Our algorithm matches you with compatible roommates. You can chat with potential roommates before deciding to book a shared property together.",
    },
  ];

  const currentFAQs = activeTab === "landlords" ? landlordFAQs : tenantFAQs;

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="sticky top-[90px] z-10 bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-dark text-center mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Find answers to common questions about{" "}
            {activeTab === "landlords"
              ? "listing your property"
              : "renting through GIGS Rentals"}
          </p>

          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full p-1 shadow-md border border-gray-200 flex">
              <button
                onClick={() => setActiveTab("tenants")}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${
                  activeTab === "tenants"
                    ? "bg-brand-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-brand-600"
                }`}
              >
                For Tenants
              </button>
              <button
                onClick={() => setActiveTab("landlords")}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${
                  activeTab === "landlords"
                    ? "bg-brand-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-brand-600"
                }`}
              >
                For Landlords
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="space-y-4">
          {currentFAQs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleAccordion(faq.id)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <i
                  className={`ph-bold text-2xl text-brand-500 transition-transform ${
                    openAccordion === faq.id ? "rotate-180" : ""
                  }`}
                >
                  {openAccordion === faq.id ? (
                    <i className="ph-bold ph-caret-up"></i>
                  ) : (
                    <i className="ph-bold ph-caret-down"></i>
                  )}
                </i>
              </button>
              {openAccordion === faq.id && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <div className="flex flex-col items-center">
            <i className="ph-bold ph-question text-4xl text-brand-500 mb-4"></i>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Can't find what you're looking for?
            </h3>
            <p className="text-gray-600 mb-4">
              Contact our support team for personalized assistance
            </p>
            <a
              href="/contact"
              className="px-6 py-2.5 bg-brand-500 text-white rounded-lg font-bold hover:bg-brand-600 transition-colors inline-flex items-center gap-2"
            >
              Contact Support
              <i className="ph-bold ph-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
