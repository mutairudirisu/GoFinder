"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("listings");

  // Mock user data - in real app this would come from auth context
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: null,
    joinedDate: "January 2024",
    listings: 3,
    bookings: 12,
  };

  const myListings = [
    {
      id: "1",
      title: "Modern Student Hostel",
      location: "Lagos, Nigeria",
      price: 450,
      image: "/placeholder-hostel.jpg",
      status: "active",
    },
    {
      id: "2",
      title: "Cozy Studio Apartment",
      location: "Abuja, Nigeria",
      price: 350,
      image: "/placeholder-apartment.jpg",
      status: "active",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-brand-50/30">
      <Header />

      {/* Profile Header */}
      <section className="pt-24 pb-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg p-6 md:p-8"
          >
            {/* Profile Info */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-brand-100 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <i className="ph-bold ph-user text-4xl md:text-5xl text-brand-500"></i>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-brand-600 transition-colors">
                  <i className="ph-bold ph-camera text-sm"></i>
                </button>
              </div>

              {/* User Details */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="font-display font-bold text-2xl md:text-3xl text-brand-dark">
                  {user.name}
                </h1>
                <p className="text-gray-500 mb-2">{user.email}</p>
                <p className="text-sm text-gray-400">Joined {user.joinedDate}</p>
              </div>

              {/* Edit Profile Button */}
              <button className="px-6 py-3 border-2 border-brand-200 rounded-xl font-bold text-brand-600 hover:bg-brand-50 transition-colors">
                Edit Profile
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="text-center p-4 bg-brand-50 rounded-2xl">
                <p className="text-2xl font-bold text-brand-600">{user.listings}</p>
                <p className="text-sm text-gray-500">Listings</p>
              </div>
              <div className="text-center p-4 bg-brand-50 rounded-2xl">
                <p className="text-2xl font-bold text-brand-600">{user.bookings}</p>
                <p className="text-sm text-gray-500">Bookings</p>
              </div>
              <div className="text-center p-4 bg-brand-50 rounded-2xl">
                <p className="text-2xl font-bold text-brand-600">4.8</p>
                <p className="text-sm text-gray-500">Rating</p>
              </div>
              <div className="text-center p-4 bg-brand-50 rounded-2xl">
                <p className="text-2xl font-bold text-brand-600">98%</p>
                <p className="text-sm text-gray-500">Response</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-6 py-3 rounded-full font-bold transition-colors whitespace-nowrap ${
                activeTab === "listings"
                  ? "bg-brand-500 text-white"
                  : "bg-white text-gray-600 hover:bg-brand-50"
              }`}
            >
              My Listings
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-6 py-3 rounded-full font-bold transition-colors whitespace-nowrap ${
                activeTab === "bookings"
                  ? "bg-brand-500 text-white"
                  : "bg-white text-gray-600 hover:bg-brand-50"
              }`}
            >
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`px-6 py-3 rounded-full font-bold transition-colors whitespace-nowrap ${
                activeTab === "favorites"
                  ? "bg-brand-500 text-white"
                  : "bg-white text-gray-600 hover:bg-brand-50"
              }`}
            >
              Favorites
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-6 py-3 rounded-full font-bold transition-colors whitespace-nowrap ${
                activeTab === "settings"
                  ? "bg-brand-500 text-white"
                  : "bg-white text-gray-600 hover:bg-brand-50"
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {activeTab === "listings" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {myListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="h-48 bg-brand-100 flex items-center justify-center">
                    <i className="ph ph-image text-4xl text-brand-300"></i>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-brand-dark">{listing.title}</h3>
                        <p className="text-sm text-gray-500">{listing.location}</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-full">
                        {listing.status}
                      </span>
                    </div>
                    <p className="mt-2 text-lg font-bold text-brand-600">
                      ${listing.price}/month
                    </p>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 py-2 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors">
                        Edit
                      </button>
                      <button className="flex-1 py-2 border-2 border-brand-200 text-brand-600 rounded-xl font-bold hover:bg-brand-50 transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Listing Card */}
              <Link
                href="/listings/create"
                className="border-2 border-dashed border-brand-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-brand-500 hover:bg-brand-50 transition-colors"
              >
                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                  <i className="ph-bold ph-plus text-2xl text-brand-500"></i>
                </div>
                <p className="font-bold text-brand-700">Add New Listing</p>
              </Link>
            </motion.div>
          )}

          {activeTab === "bookings" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ph ph-calendar-check text-3xl text-brand-500"></i>
              </div>
              <h3 className="font-bold text-xl text-brand-dark mb-2">No bookings yet</h3>
              <p className="text-gray-500 mb-6">Start exploring properties to make your first booking</p>
              <Link
                href="/listings"
                className="inline-block px-6 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors"
              >
                Browse Listings
              </Link>
            </motion.div>
          )}

          {activeTab === "favorites" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ph ph-heart text-3xl text-brand-500"></i>
              </div>
              <h3 className="font-bold text-xl text-brand-dark mb-2">No favorites yet</h3>
              <p className="text-gray-500 mb-6">Save your favorite properties to compare them later</p>
              <Link
                href="/listings"
                className="inline-block px-6 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors"
              >
                Browse Listings
              </Link>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-lg text-brand-dark">Account Settings</h3>
              </div>
              <div className="divide-y divide-gray-100">
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <i className="ph ph-user text-xl text-brand-500"></i>
                    <span className="font-medium text-gray-700">Personal Information</span>
                  </div>
                  <i className="ph-bold ph-caret-right text-gray-400"></i>
                </button>
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <i className="ph ph-bell text-xl text-brand-500"></i>
                    <span className="font-medium text-gray-700">Notifications</span>
                  </div>
                  <i className="ph-bold ph-caret-right text-gray-400"></i>
                </button>
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <i className="ph ph-credit-card text-xl text-brand-500"></i>
                    <span className="font-medium text-gray-700">Payment Methods</span>
                  </div>
                  <i className="ph-bold ph-caret-right text-gray-400"></i>
                </button>
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <i className="ph ph-shield-check text-xl text-brand-500"></i>
                    <span className="font-medium text-gray-700">Privacy & Security</span>
                  </div>
                  <i className="ph-bold ph-caret-right text-gray-400"></i>
                </button>
                <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <i className="ph ph-sign-out text-xl text-red-500"></i>
                    <span className="font-medium text-red-600">Log Out</span>
                  </div>
                  <i className="ph-bold ph-caret-right text-gray-400"></i>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
