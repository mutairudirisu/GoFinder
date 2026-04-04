"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProfileEditModal } from "@/components/user/ProfileEditModal";
import { InterestsModal } from "@/components/user/InterestsModal";

export default function ProfileEditPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showAllInterests, setShowAllInterests] = useState(false);
  const [intro, setIntro] = useState("");
  
  // State for profile fields
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({
    school: "",
    work: "",
    travel_wish: "",
    pets: "",
    birth_decade: "",
    high_school_song: "",
    too_much_time: "",
    fun_fact: "",
    useless_skill: "",
    bio_title: "",
    languages: "",
    obsession: "",
    location: "",
  });

  const [editingField, setEditingField] = useState<string | null>(null);

  const profileFields = [
    { id: "school", label: "Where I went to school", icon: "ph-graduation-cap", question: "Where did you go to school?", description: "Whether it's home school, high school, or trade school, name the school that made you who you are." },
    { id: "work", label: "My work", icon: "ph-briefcase", question: "What do you do for work?", description: "Tell us about your profession or what keeps you busy during the day." },
    { id: "travel_wish", label: "Where I've always wanted to go", icon: "ph-globe-hemisphere-west", question: "Where's your dream destination?", description: "Is there a place you've always dreamed of visiting? Share your wanderlust!" },
    { id: "pets", label: "Pets", icon: "ph-paw-print", question: "Do you have any pets?", description: "Tell us about your furry, feathered, or scaled friends." },
    { id: "birth_decade", label: "Decade I was born", icon: "ph-calendar-blank", question: "Which decade were you born in?", description: "Share the era you grew up in to find common ground with others." },
    { id: "high_school_song", label: "My favorite song in high school", icon: "ph-music-notes", question: "What was your high school anthem?", description: "The song that takes you right back to those teenage years." },
    { id: "too_much_time", label: "I spend too much time", icon: "ph-clock", question: "What's your time-sink?", description: "What's that one thing you can spend hours doing without even noticing?" },
    { id: "fun_fact", label: "My fun fact", icon: "ph-lightbulb", question: "What's a fun fact about you?", description: "Share something surprising or unique that most people don't know." },
    { id: "useless_skill", label: "My most useless skill", icon: "ph-magic-wand", question: "What's your most useless skill?", description: "We all have one! Whether it's bird calls or pen spinning, let's hear it." },
    { id: "bio_title", label: "My biography title would be", icon: "ph-book-open", question: "What's your life's title?", description: "If your life was a book, what would be the catchy title on the cover?" },
    { id: "languages", label: "Languages I speak", icon: "ph-translate", question: "What languages do you speak?", description: "List the languages you're fluent in or currently learning." },
    { id: "obsession", label: "I'm obsessed with", icon: "ph-heart", question: "What are you obsessed with?", description: "That one thing you just can't get enough of lately." },
    { id: "location", label: "Where I live", icon: "ph-map-pin", question: "Where do you call home?", description: "Tell us the city or neighborhood you live in now." },
  ];

  const travelStamps = [
    { icon: "ph-globe", label: "Next destination" },
    { icon: "ph-sun", label: "Next destination" },
    { icon: "ph-airplane", label: "Next destination" },
    { icon: "ph-suitcase", label: "Next destination" },
  ];

  const handleFieldSave = (value: string) => {
    if (editingField) {
      setFieldValues(prev => ({ ...prev, [editingField]: value }));
    }
  };

  const currentField = profileFields.find(f => f.id === editingField);

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Custom Header */}
      <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-12 sticky top-0 z-40">
        <Link href="/user/profile" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg border-2 border-brand-dark flex items-center justify-center shadow-brutal-sm">
            <i className="ph-bold ph-house-line text-white"></i>
          </div>
          <span className="font-display font-bold text-xl text-brand-dark">GIGS</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/hosting" className="text-sm font-semibold text-slate-700 hover:underline">
            Switch to hosting
          </Link>
          <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 border border-slate-200">
            <i className="ph-bold ph-list text-lg"></i>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          {/* Left Column - Avatar (Fixed/Sticky on large screens) */}
          <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start lg:sticky lg:top-32">
            <div className="relative group cursor-pointer">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-brand-500 rounded-full flex items-center justify-center text-white text-8xl font-bold shadow-xl overflow-hidden">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <button className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white border border-brand-200 px-6 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-brand-50 transition-all font-bold text-sm text-brand-600">
                <i className="ph-bold ph-camera"></i>
                Add
              </button>
            </div>
          </div>

          {/* Right Column - Form Sections (Scrollable) */}
          <div className="flex-1 space-y-16">
            {/* My Profile Section */}
            <section>
              <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">My profile</h1>
              <p className="text-slate-500 mb-8 max-w-xl">
                Hosts and guests can see your profile and it may appear across GIGS to help us build trust in our community.{" "}
                <Link href="#" className="text-brand-600 font-bold underline">Learn more</Link>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {profileFields.map((field) => (
                  <button
                    key={field.id}
                    onClick={() => setEditingField(field.id)}
                    className="flex items-center gap-4 py-4 border-b border-slate-100 hover:bg-brand-50 transition-all text-left group"
                  >
                    <i className={`ph-bold ${field.icon} text-2xl text-slate-400 group-hover:text-brand-500`}></i>
                    <div className="flex-1">
                      <span className={`block font-medium ${fieldValues[field.id] ? 'text-slate-900' : 'text-slate-600'}`}>
                        {fieldValues[field.id] || field.label}
                      </span>
                      {fieldValues[field.id] && (
                        <span className="text-xs text-brand-500 font-bold uppercase tracking-wider">{field.label}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* About Me Section */}
            <section>
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">About me</h2>
              <div 
                onClick={() => setEditingField('intro')}
                className="p-8 border-2 border-dashed border-brand-200 rounded-3xl bg-brand-50/30 cursor-pointer hover:border-brand-400 transition-all"
              >
                <p className="text-slate-500 mb-4 italic">
                  {intro || "Write something fun and punchy."}
                </p>
                <button className="text-brand-600 font-bold underline decoration-2 underline-offset-4">
                  {intro ? "Edit intro" : "Add intro"}
                </button>
              </div>
            </section>

            {/* Where I've been Section */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-display font-bold text-slate-900">Where I've been</h2>
                <div className="w-12 h-6 bg-brand-200 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-brand-500 rounded-full shadow-sm"></div>
                </div>
              </div>
              <p className="text-slate-500 mb-8">Pick the stamps you want other people to see on your profile.</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {travelStamps.map((stamp, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-4">
                    <div className={`w-full aspect-[4/3] border-2 border-brand-100 rounded-2xl flex items-center justify-center bg-white ${idx === 1 ? 'rounded-[40px]' : idx === 3 ? 'rounded-r-[60px] rounded-l-lg' : ''} hover:border-brand-300 transition-colors`}>
                      <i className={`ph-bold ${stamp.icon} text-4xl text-brand-200 group-hover:text-brand-400`}></i>
                    </div>
                    <span className="text-xs font-medium text-slate-400">{stamp.label}</span>
                  </div>
                ))}
              </div>
              <button className="px-6 py-3 border border-brand-200 rounded-xl font-bold text-brand-700 hover:bg-brand-50 transition-all">
                Edit travel stamps
              </button>
            </section>

            {/* My Interests Section */}
            <section>
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">My interests</h2>
              <p className="text-slate-500 mb-8">Find common ground with other guests and hosts by adding interests to your profile.</p>

              <div className="flex flex-wrap gap-4 mb-8">
                {selectedInterests.length > 0 ? (
                  selectedInterests.map((interestId) => (
                    <div key={interestId} className="px-4 py-2 border border-brand-200 rounded-full bg-brand-50 text-brand-700 text-sm font-medium flex items-center gap-2">
                      <span>{interestId.charAt(0).toUpperCase() + interestId.slice(1).replace('_', ' ')}</span>
                    </div>
                  ))
                ) : (
                  [1, 2, 3].map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setEditingField('interests')}
                      className="w-16 h-10 border-2 border-dashed border-brand-200 rounded-full flex items-center justify-center hover:border-brand-400 transition-all"
                    >
                      <i className="ph-bold ph-plus text-brand-400"></i>
                    </button>
                  ))
                )}
              </div>
              <button 
                onClick={() => setEditingField('interests')}
                className="px-6 py-3 border border-brand-200 rounded-xl font-bold text-brand-700 hover:bg-brand-50 transition-all"
              >
                {selectedInterests.length > 0 ? "Edit interests" : "Add interests"}
              </button>
            </section>
          </div>
        </div>
      </main>

      {/* Profile Field Modal */}
      <ProfileEditModal
        isOpen={editingField !== null && !['intro', 'interests'].includes(editingField)}
        onClose={() => setEditingField(null)}
        title={currentField?.question || ""}
        description={currentField?.description || ""}
        placeholder={currentField?.label || ""}
        currentValue={editingField ? fieldValues[editingField] ?? "" : ""}
        onSave={handleFieldSave}
        maxLength={50}
      />

      {/* Intro Modal */}
      <ProfileEditModal
        isOpen={editingField === 'intro'}
        onClose={() => setEditingField(null)}
        title="About you"
        description="Tell others about yourself, what you like, or anything else you'd like to share."
        placeholder="Write something fun and punchy..."
        currentValue={intro}
        onSave={(val) => setIntro(val)}
        maxLength={250}
      />

      {/* Interests Modal */}
      <InterestsModal
        isOpen={editingField === 'interests'}
        onClose={() => setEditingField(null)}
        selectedInterests={selectedInterests}
        onSave={(interests) => setSelectedInterests(interests)}
      />

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 h-24 bg-white border-t border-slate-200 flex items-center justify-end px-12 z-40">
        <button
          onClick={() => router.push("/user/profile")}
          className="px-10 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
        >
          Done
        </button>
      </footer>
    </div>
  );
}
