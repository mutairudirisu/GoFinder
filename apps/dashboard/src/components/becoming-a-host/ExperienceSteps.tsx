import { motion } from "framer-motion";

interface ExperienceTypeStepProps {
  selectedExperienceType: string | null;
  onSelect: (type: string) => void;
}

const experienceTypes = [
  { id: "cultural_heritage", label: "Cultural & Heritage", icon: "ph-bank", description: "History, traditions, and local culture" },
  { id: "food_drink", label: "Food & Drink", icon: "ph-fork-knife", description: "Tours, tastings, and cooking classes" },
  { id: "outdoor_adventure", label: "Outdoor & Adventure", icon: "ph-mountains", description: "Hiking, sports, and nature activities" },
  { id: "arts_nightlife", label: "Arts, Entertainment & Nightlife", icon: "ph-music-notes", description: "Concerts, bar crawls, and gallery visits" },
  { id: "wellness_lifestyle", label: "Wellness & Lifestyle", icon: "ph-leaf", description: "Yoga, meditation, and self-care" },
  { id: "learning_education", label: "Learning & Education", icon: "ph-book-open", description: "Skill-sharing and educational tours" },
  { id: "other_experience", label: "Others", icon: "ph-dots-three-circle", description: "Any other type of unique experience" },
];

export const ExperienceTypeStep = ({ selectedExperienceType, onSelect }: ExperienceTypeStepProps) => {
  return (
    <motion.div
      key="experience_type"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col items-center px-5 py-8 md:p-10 overflow-y-auto"
    >
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl md:text-3xl font-display font-[500] text-slate-900 mb-10">
          What kind of experience is it?
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {experienceTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all text-left ${
                selectedExperienceType === type.id
                  ? "border-brand-500 bg-brand-50/50 ring-2 ring-brand-50"
                  : "border-slate-100 hover:border-brand-200 hover:bg-brand-50/40"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedExperienceType === type.id ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                <i className={`ph-bold ${type.icon} text-2xl`}></i>
              </div>
              <div>
                <span className={`font-bold block mb-1 text-lg ${selectedExperienceType === type.id ? "text-brand-700" : "text-slate-900"}`}>
                  {type.label}
                </span>
                <span className="text-sm text-slate-500 leading-relaxed">
                  {type.description}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

interface ExperienceDetailsStepProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  experienceDescriptionFocus: string[];
  toggleExperienceDescriptionFocus: (focus: string) => void;
  generateAIDescription: () => void;
  isGeneratingAI: boolean;
}

const experienceDescriptionFocusOptions = [
  "Hands-on activity",
  "Local culture",
  "Learning something new",
  "Relaxed atmosphere",
  "Memorable group time",
  "Hidden gems",
];

export const ExperienceDetailsStep = ({
  title,
  setTitle,
  description,
  setDescription,
  experienceDescriptionFocus,
  toggleExperienceDescriptionFocus,
  generateAIDescription,
  isGeneratingAI,
}: ExperienceDetailsStepProps) => {
  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;

  return (
    <motion.div
      key="experience_details"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col items-center justify-start p-8 md:justify-center md:p-10 overflow-y-auto"
    >
      <div className="max-w-xl w-full">
        <h1 className="text-2xl md:text-3xl font-display font-[500] text-slate-900 mb-8">
          Experience details
        </h1>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Title</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lagos Island Street Food Tour"
              className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-brand-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Description</label>
            <div className="mb-4">
              <p className="mb-3 text-sm font-semibold text-slate-600">What is this experience all about? Pick up to 3 for AI.</p>
              <div className="flex flex-wrap gap-2">
                {experienceDescriptionFocusOptions.map((focus) => {
                  const isSelected = experienceDescriptionFocus.includes(focus);
                  return (
                    <button
                      key={focus}
                      type="button"
                      onClick={() => toggleExperienceDescriptionFocus(focus)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                        isSelected
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
                      }`}
                    >
                      {focus}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="relative">
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              placeholder="Describe what guests will do, see, and eat..."
              className="w-full p-4 pb-16 bg-white border-2 border-slate-200 rounded-xl min-h-[180px] font-medium text-slate-700 outline-none focus:border-brand-500 transition-all resize-none"
            />
              <div className="absolute bottom-4 left-4 text-xs font-semibold text-slate-400">
                Minimum 10 words before continuing. {wordCount}/10 words
              </div>
              <button
                type="button"
                onClick={generateAIDescription}
                disabled={isGeneratingAI}
                className={`absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-xs font-bold text-brand-700 transition-all hover:bg-brand-50 ${isGeneratingAI ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <i className={`ph-bold ${isGeneratingAI ? "ph-spinner animate-spin" : "ph-sparkle"}`}></i>
                {isGeneratingAI ? "Generating..." : "Use AI"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface ExperienceCapacityStepProps {
  experienceCapacity: number;
  setExperienceCapacity: (capacity: number) => void;
}

export const ExperienceCapacityStep = ({ experienceCapacity, setExperienceCapacity }: ExperienceCapacityStepProps) => {
  return (
    <motion.div
      key="experience_capacity"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col items-center justify-start px-5 py-8 md:justify-center md:p-12 overflow-y-auto"
    >
      <div className="max-w-xl w-full">
        <h1 className="text-2xl md:text-3xl font-display font-[600] text-slate-900 mb-12">
          Group Size
        </h1>
        
        <div className="flex flex-col gap-6 rounded-3xl border-2 border-slate-100 bg-slate-50 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-900">Maximum guests</span>
            <span className="text-slate-500">How many people can join at once?</span>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 md:justify-start md:gap-6">
            <button 
              onClick={() => setExperienceCapacity(Math.max(1, experienceCapacity - 1))}
              className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-brand-500 hover:text-brand-500 transition-all"
            >
              <i className="ph-bold ph-minus"></i>
            </button>
            <span className="w-8 text-center font-bold text-2xl text-slate-900">{experienceCapacity}</span>
            <button 
              onClick={() => setExperienceCapacity(experienceCapacity + 1)}
              className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-brand-500 hover:text-brand-500 transition-all"
            >
              <i className="ph-bold ph-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
