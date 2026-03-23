"use client";

import { useState, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { mockProperties } from "../../data";
import { Header } from "@/components/layout";

export default function FindRoommatesPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const property = mockProperties.find(p => p.id === unwrappedParams.id);

  const [roommatePreferences, setRoommatePreferences] = useState({
    budgetMin: 200,
    budgetMax: 500,
    moveInDate: "",
    duration: "6 months",
    gender: "any",
    smoking: "no",
    pets: "no",
    sleepSchedule: "any",
    guests: "occasionally"
  });

  const [matches, setMatches] = useState<number>(0);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  if (!property) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-brand-50/30">
        <Header />
        <div className="max-w-4xl mx-auto px-6 pt-24">
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

  const handleSearch = async () => {
    setSearching(true);
    setSearched(false);
    
    // Simulate search
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate random matches (3-12)
    setMatches(Math.floor(Math.random() * 10) + 3);
    setSearching(false);
    setSearched(true);
  };

  const mockRoommateMatches = [
    {
      id: 1,
      name: "Alex Chen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100",
      age: 22,
      university: "Lagos State University",
      budget: 350,
      bio: "Computer Science student looking for quiet roommates. I love gaming but keep it low-key.",
      interests: ["gaming", "coding", "music"],
      compatibility: 92
    },
    {
      id: 2,
      name: "Jordan Williams",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100",
      age: 21,
      university: "University of Lagos",
      budget: 400,
      bio: "Medical student with early morning classes. Looking for similar schedule roommates.",
      interests: ["studying", "fitness", "cooking"],
      compatibility: 87
    },
    {
      id: 3,
      name: "Sam Taylor",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100",
      age: 23,
      university: "Bayero University",
      budget: 300,
      bio: "Final year engineering student. Neat and organized. Love weekend hangouts!",
      interests: ["basketball", "music", "photography"],
      compatibility: 81
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50/30 pb-20 lg:pb-0">
      {/* Header - hidden on mobile */}
      <div className="hidden lg:block">
        <Header />
      </div>

      {/* Mobile Header */}
      <div className="fixed lg:hidden top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-lg border-b border-slate-200 h-14 flex items-center px-4">
        <Link href={`/listings/${property.id}`} className="flex items-center gap-2">
          <i className="ph-bold ph-arrow-left text-xl text-slate-600"></i>
        </Link>
        <span className="ml-3 font-display font-bold text-brand-dark">Roommates</span>
      </div>

      {/* Navigation - hidden on mobile */}
      <div className="bg-white border-b border-slate-100 pt-14 sm:pt-16 hidden lg:block">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link 
            href={`/listings/${property.id}`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-600 transition-colors font-medium"
          >
            <i className="ph-bold ph-arrow-left"></i>
            Back to Property
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-4">
              <i className="ph-bold ph-users-three text-amber-600 text-4xl"></i>
            </div>
            <h1 className="font-display font-bold text-3xl text-brand-dark mb-2">
              Find Roommates
            </h1>
            <p className="text-slate-500">
              Find compatible roommates for {property.title}
            </p>
          </div>

          {/* Property Info */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 mb-8">
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
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg flex items-center gap-1">
                    <i className="ph-bold ph-users-three"></i>
                    Needs {property.roommatesNeeded || 2} roommates
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Preferences Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 sticky top-24">
                <h3 className="font-bold text-lg text-brand-dark mb-4 flex items-center gap-2">
                  <i className="ph-bold ph-sliders-horizontal"></i>
                  Your Preferences
                </h3>

                <div className="space-y-4">
                  {/* Budget Range */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Budget Range (₦)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={roommatePreferences.budgetMin}
                        onChange={(e) => setRoommatePreferences({...roommatePreferences, budgetMin: Number(e.target.value)})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-300 focus:outline-none"
                      />
                      <span className="text-slate-400">-</span>
                      <input
                        type="number"
                        value={roommatePreferences.budgetMax}
                        onChange={(e) => setRoommatePreferences({...roommatePreferences, budgetMax: Number(e.target.value)})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-300 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Move in Date */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Preferred Move-in Date
                    </label>
                    <input
                      type="date"
                      value={roommatePreferences.moveInDate}
                      onChange={(e) => setRoommatePreferences({...roommatePreferences, moveInDate: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-300 focus:outline-none"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Lease Duration
                    </label>
                    <select
                      value={roommatePreferences.duration}
                      onChange={(e) => setRoommatePreferences({...roommatePreferences, duration: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-300 focus:outline-none"
                    >
                      <option>3 months</option>
                      <option>6 months</option>
                      <option>9 months</option>
                      <option>1 year</option>
                    </select>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Preferred Gender
                    </label>
                    <div className="flex gap-2">
                      {["any", "male", "female"].map((g) => (
                        <button
                          key={g}
                          onClick={() => setRoommatePreferences({...roommatePreferences, gender: g})}
                          className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                            roommatePreferences.gender === g
                              ? "bg-amber-100 text-amber-700 border-2 border-amber-300"
                              : "bg-slate-50 text-slate-600 border-2 border-transparent"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Smoking */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Smoking Preference
                    </label>
                    <div className="flex gap-2">
                      {["no", "yes", "occasionally"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setRoommatePreferences({...roommatePreferences, smoking: s})}
                          className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                            roommatePreferences.smoking === s
                              ? "bg-amber-100 text-amber-700 border-2 border-amber-300"
                              : "bg-slate-50 text-slate-600 border-2 border-transparent"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    disabled={searching}
                    className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                      searching
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/30 hover:shadow-brutal hover:-translate-y-1"
                    }`}
                  >
                    {searching ? (
                      <>
                        <i className="ph-bold ph-spinner animate-spin"></i>
                        Searching...
                      </>
                    ) : (
                      <>
                        <i className="ph-bold ph-magnifying-glass"></i>
                        Find Roommates
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-2">
              {!searched ? (
                /* Empty State */
                <div className="bg-white rounded-3xl p-12 shadow-lg border border-slate-100 text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full mb-4">
                    <i className="ph-bold ph-users text-slate-400 text-5xl"></i>
                  </div>
                  <h3 className="font-bold text-xl text-brand-dark mb-2">
                    Ready to Find Roommates?
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Set your preferences and click "Find Roommates" to discover people who match your lifestyle and budget.
                  </p>
                </div>
              ) : (
                /* Results */
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-brand-dark">
                      {matches} Potential Roommates Found
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">Sort by:</span>
                      <select className="text-sm bg-white border border-slate-200 rounded-lg px-2 py-1">
                        <option>Best Match</option>
                        <option>Budget</option>
                        <option>University</option>
                      </select>
                    </div>
                  </div>

                  {mockRoommateMatches.map((roommate) => (
                    <motion.div
                      key={roommate.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all"
                    >
                      <div className="flex gap-4">
                        <div className="relative">
                          <img
                            src={roommate.image}
                            alt={roommate.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-green-100"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {roommate.compatibility}%
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-brand-dark text-lg">{roommate.name}</h4>
                              <p className="text-slate-500 text-sm">{roommate.age} years old • {roommate.university}</p>
                            </div>
                            <span className="font-bold text-green-600">₦{roommate.budget}/mo</span>
                          </div>
                          
                          <p className="text-slate-600 text-sm mt-2">{roommate.bio}</p>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {roommate.interests.map((interest) => (
                              <span key={interest} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg capitalize">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                        <button className="flex-1 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                          <i className="ph-bold ph-chat-circle-dots"></i>
                          Message
                        </button>
                        <button className="px-4 py-2.5 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:border-green-300 hover:bg-green-50 transition-colors">
                          <i className="ph-bold ph-user-plus"></i>
                        </button>
                        <button className="px-4 py-2.5 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors">
                          <i className="ph-bold ph-share-network"></i>
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {/* Create Group Chat */}
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-6 shadow-lg text-white text-center mt-6">
                    <i className="ph-bold ph-users-three text-4xl mb-3"></i>
                    <h3 className="font-bold text-xl mb-2">Create a Roommate Group</h3>
                    <p className="text-white/80 mb-4">
                      Start a group chat with your potential roommates to discuss and decide together.
                    </p>
                    <button className="px-6 py-3 bg-white text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-colors">
                      Create Group Chat
                    </button>
                  </div>
                </div>
              )}
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
