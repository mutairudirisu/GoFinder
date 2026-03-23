"use client";

import { useState } from "react";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("getting-started");

  const categories = [
    { id: "using-platform", label: "Using HostelFinder", icon: "ph-house-line" },
    { id: "accounts-login", label: "Accounts & Login", icon: "ph-user-circle" },
    { id: "bookings-payments", label: "Bookings & Payments", icon: "ph-credit-card" },
    { id: "property-management", label: "Property Management", icon: "ph-building" },
    { id: "privacy-safety", label: "Privacy & Safety", icon: "ph-shield-check" },
    { id: "policies", label: "Policies", icon: "ph-scroll" },
  ];

  const popularTopics = [
    {
      title: "How do I create an account?",
      description: "Learn how to sign up and get your account verified on HostelFinder.",
      icon: "ph-user-plus",
    },
    {
      title: "How do I search for listings?",
      description: "Find the perfect student housing with our advanced search and filters.",
      icon: "ph-magnifying-glass",
    },
    {
      title: "How do I make a booking?",
      description: "Complete your booking process and secure your accommodation.",
      icon: "ph-calendar-check",
    },
    {
      title: "Payment methods & security",
      description: "Understand our secure payment options and how your data is protected.",
      icon: "ph-lock",
    },
    {
      title: "How can I list my property?",
      description: "Post your student housing property and reach thousands of potential tenants.",
      icon: "ph-plus-circle",
    },
    {
      title: "How do I cancel a booking?",
      description: "Learn about our cancellation policies and how to cancel your booking.",
      icon: "ph-x-circle",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-display font-bold mb-6">Help Centre</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-dark focus:bg-white transition-colors"
            />
            <i className="ph-magnifying-glass absolute left-4 top-3.5 text-gray-400 text-xl"></i>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <nav className="space-y-1 p-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                      selectedCategory === category.id
                        ? "bg-brand-dark text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <i className={`ph-bold ${category.icon} text-lg`}></i>
                    <span className="font-medium">{category.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Hero Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-2">How can we help you?</h2>
              <p className="text-gray-600">Browse popular topics or search for answers to your questions.</p>
            </div>

            {/* Popular Topics */}
            <div>
              <h3 className="text-xl font-bold mb-6">Popular topics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                        <i className={`ph-bold ${topic.icon} text-blue-600 text-xl`}></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 group-hover:text-brand-dark transition-colors">
                          {topic.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Section - FAQ by Category */}
            <div className="mt-12 bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-bold mb-6">Frequently Asked Questions</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-lg mb-2">Getting Started</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <i className="ph-check text-green-600"></i>
                      What do I need to create an account?
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ph-check text-green-600"></i>
                      How do I verify my identity?
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ph-check text-green-600"></i>
                      Can I change my username?
                    </li>
                  </ul>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-bold text-lg mb-2">Bookings & Payments</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <i className="ph-check text-green-600"></i>
                      What payment methods do you accept?
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ph-check text-green-600"></i>
                      Is my payment information secure?
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ph-check text-green-600"></i>
                      What is your refund policy?
                    </li>
                  </ul>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-bold text-lg mb-2">For Landlords</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <i className="ph-check text-green-600"></i>
                      How do I list my property?
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ph-check text-green-600"></i>
                      What are the listing fees?
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ph-check text-green-600"></i>
                      How do I manage tenant inquiries?
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <h3 className="text-lg font-bold mb-2">Can't find what you're looking for?</h3>
              <p className="text-gray-600 mb-4">Contact our support team for personalized assistance.</p>
              <button className="px-6 py-2 bg-brand-dark text-white rounded-lg font-bold hover:bg-opacity-90 transition-all">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
