import { motion } from "framer-motion";

interface ServiceTypeStepProps {
  selectedServiceType: string | null;
  onSelect: (type: string) => void;
}

const serviceTypes = [
  { id: "home_lifestyle", label: "Home & Lifestyle", icon: "ph-house", description: "Cleaning, laundry, and home maintenance" },
  { id: "beauty_personal", label: "Beauty & Personal Care", icon: "ph-sparkles", description: "Hair, makeup, and personal styling" },
  { id: "events_entertainment", label: "Events & Entertainment", icon: "ph-confetti", description: "Planning, DJing, and event services" },
  { id: "professional_business", label: "Professional & Business", icon: "ph-briefcase", description: "Legal, accounting, and consulting" },
  { id: "health_wellness", label: "Health & Wellness", icon: "ph-heartbeat", description: "Fitness, therapy, and health services" },
  { id: "education_tutoring", label: "Education & Tutoring", icon: "ph-graduation-cap", description: "Private lessons and academic support" },
  { id: "logistics_transport", label: "Logistics & Transport", icon: "ph-truck", description: "Moving, delivery, and car services" },
  { id: "tech_digital", label: "Tech & Digital", icon: "ph-cpu", description: "IT support, repairs, and digital services" },
  { id: "other_service", label: "Others", icon: "ph-dots-three-circle", description: "Any other type of professional service" },
];

export const ServiceTypeStep = ({ selectedServiceType, onSelect }: ServiceTypeStepProps) => {
  return (
    <motion.div
      key="service_type"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col items-center px-5 py-8 md:p-10 overflow-y-auto"
    >
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl md:text-3xl font-display font-[500] text-slate-900 mb-10">
          What kind of service do you provide?
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {serviceTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all text-left ${
                selectedServiceType === type.id
                  ? "border-brand-500 bg-brand-50/50 ring-2 ring-brand-50"
                  : "border-slate-100 hover:border-brand-200 hover:bg-brand-50/40"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedServiceType === type.id ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <i className={`ph-bold ${type.icon} text-2xl`}></i>
              </div>
              <div>
                <span className={`font-bold block mb-1 text-lg ${selectedServiceType === type.id ? 'text-brand-700' : 'text-slate-900'}`}>
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

interface ServiceCoverageStepProps {
  serviceCoverage: string[];
  setServiceCoverage: (coverage: string[] | ((prev: string[]) => string[])) => void;
}

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", 
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos State", 
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", 
  "Taraba", "Yobe", "Zamfara"
];

export const ServiceCoverageStep = ({ serviceCoverage, setServiceCoverage }: ServiceCoverageStepProps) => {
  return (
    <motion.div
      key="service_coverage"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col items-center justify-center px-5 py-8 md:p-10"
    >
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl md:text-3xl font-display font-[500] text-slate-900 mb-6">
          Where do you operate?
        </h1>
        <p className="text-slate-500 mb-10">Select all areas where you can provide this service.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {nigerianStates.slice(0, 12).map((state) => (
            <button
              key={state}
              onClick={() => {
                setServiceCoverage(prev => 
                  prev.includes(state) ? prev.filter(s => s !== state) : [...prev, state]
                );
              }}
              className={`p-4 rounded-xl border-2 transition-all font-bold text-center ${
                serviceCoverage.includes(state)
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-slate-100 text-slate-600 hover:border-slate-200"
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

interface ServiceDetailsStepProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  serviceDescriptionFocus: string[];
  toggleServiceDescriptionFocus: (focus: string) => void;
  generateAIDescription: () => void;
  isGeneratingAI: boolean;
}

const serviceDescriptionFocusOptions = [
  "Fast turnaround",
  "Professional quality",
  "Affordable pricing",
  "Friendly support",
  "Trusted expertise",
  "Flexible scheduling",
];

export const ServiceDetailsStep = ({
  title,
  setTitle,
  description,
  setDescription,
  serviceDescriptionFocus,
  toggleServiceDescriptionFocus,
  generateAIDescription,
  isGeneratingAI,
}: ServiceDetailsStepProps) => {
  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;

  return (
    <motion.div
      key="service_details"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col items-center justify-start p-8 md:justify-center md:p-10 overflow-y-auto"
    >
      <div className="max-w-xl w-full">
        <h1 className="text-2xl md:text-3xl font-display font-[500] text-slate-900 mb-8">
          Describe your service
        </h1>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Service Title</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Professional Move-in Cleaning"
              className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-brand-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Service Description</label>
            <div className="mb-4">
              <p className="mb-3 text-sm font-semibold text-slate-600">What is this service all about? Pick up to 3 for AI.</p>
              <div className="flex flex-wrap gap-2">
                {serviceDescriptionFocusOptions.map((focus) => {
                  const isSelected = serviceDescriptionFocus.includes(focus);
                  return (
                    <button
                      key={focus}
                      type="button"
                      onClick={() => toggleServiceDescriptionFocus(focus)}
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
              placeholder="Explain what's included in your service..."
              className="w-full min-h-[180px] resize-none rounded-xl border-2 border-slate-200 bg-white p-4 pb-16 font-medium text-slate-700 outline-none transition-all focus:border-brand-500"
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
