"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Interest {
  id: string;
  label: string;
  icon: string;
}

const ALL_INTERESTS: Interest[] = [
  { id: "movies", label: "Movies", icon: "ph-film-strip" },
  { id: "art", label: "Art", icon: "ph-palette" },
  { id: "tech", label: "Technology", icon: "ph-cpu" },
  { id: "cooking", label: "Cooking", icon: "ph-cooking-pot" },
  { id: "music", label: "Live music", icon: "ph-music-notes" },
  { id: "playing_music", label: "Playing music", icon: "ph-guitar" },
  { id: "food", label: "Food scenes", icon: "ph-fork-knife" },
  { id: "comedy", label: "Comedy", icon: "ph-mask-happy" },
  { id: "reading", label: "Reading", icon: "ph-book-open" },
  { id: "outdoors", label: "Outdoors", icon: "ph-mountain" },
  { id: "photography", label: "Photography", icon: "ph-camera" },
  { id: "video_games", label: "Video games", icon: "ph-game-controller" },
  { id: "museums", label: "Museums", icon: "ph-bank" },
  { id: "wine", label: "Wine", icon: "ph-wine" },
  { id: "fitness", label: "Fitness", icon: "ph-barbell" },
  { id: "shopping", label: "Shopping", icon: "ph-shopping-bag" },
  { id: "sports", label: "Adrenaline sports", icon: "ph-speedometer" },
  { id: "football", label: "American football", icon: "ph-football" },
  { id: "animals", label: "Animals", icon: "ph-paw-print" },
  { id: "anime", label: "Anime", icon: "ph-magic-wand" },
  { id: "archery", label: "Archery", icon: "ph-target" },
];

interface InterestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInterests: string[];
  onSave: (interests: string[]) => void;
  initialShowAll?: boolean;
}

export function InterestsModal({
  isOpen,
  onClose,
  selectedInterests: initialSelected,
  onSave,
  initialShowAll = false,
}: InterestsModalProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [showAllView, setShowAllView] = useState(initialShowAll);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleInterest = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id].slice(0, 20)
    );
  };

  const filteredInterests = ALL_INTERESTS.filter((interest) =>
    interest.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-[32px] shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-50 text-brand-600 transition-colors"
              >
                <i className="ph-bold ph-x text-lg"></i>
              </button>
              <h2 className="text-lg font-bold text-slate-900">
                {showAllView ? "Interests" : "What are you into?"}
              </h2>
              <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {!showAllView ? (
                /* Initial Tag View */
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">
                      What are you into?
                    </h3>
                    <p className="text-slate-500 text-sm">
                      Pick some interests you enjoy that you want to show on your profile.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {ALL_INTERESTS.slice(0, 16).map((interest) => {
                      const isSelected = selected.includes(interest.id);
                      return (
                        <button
                          key={interest.id}
                          onClick={() => toggleInterest(interest.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                            isSelected
                              ? "border-brand-500 bg-brand-50 text-brand-700 font-bold shadow-sm"
                              : "border-slate-200 text-slate-600 hover:border-brand-300"
                          }`}
                        >
                          <i className={`ph-bold ${interest.icon} ${isSelected ? 'text-brand-600' : 'text-slate-400'}`}></i>
                          <span className="text-sm font-medium">{interest.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setShowAllView(true)}
                    className="text-brand-600 font-bold underline text-sm hover:text-brand-700"
                  >
                    Show all
                  </button>
                </div>
              ) : (
                /* Show All Searchable List View */
                <div className="space-y-6">
                  <div className="relative">
                    <i className="ph-bold ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-brand-400"></i>
                    <input
                      type="text"
                      placeholder="Search for interests"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-brand-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    {filteredInterests.map((interest) => {
                      const isSelected = selected.includes(interest.id);
                      return (
                        <button
                          key={interest.id}
                          onClick={() => toggleInterest(interest.id)}
                          className="w-full flex items-center gap-4 p-4 hover:bg-brand-50 rounded-2xl transition-colors group"
                        >
                          <div
                            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-brand-500 border-brand-500"
                                : "border-slate-200 group-hover:border-brand-400"
                            }`}
                          >
                            {isSelected && <i className="ph-bold ph-check text-white text-xs"></i>}
                          </div>
                          <i className={`ph-bold ${interest.icon} text-2xl ${isSelected ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-400'}`}></i>
                          <span className={`font-medium ${isSelected ? 'text-brand-700' : 'text-slate-700'}`}>{interest.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-between sticky bottom-0 z-10">
              <span className="text-sm font-bold text-brand-600">
                {selected.length}/20 selected
              </span>
              <button
                onClick={() => {
                  onSave(selected);
                  onClose();
                }}
                className="px-10 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
              >
                {showAllView ? "Done" : "Save"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
