import { motion } from "framer-motion";

interface HighlightsStepProps {
  selectedHighlights: string[];
  toggleHighlight: (id: string) => void;
  selectedType: string | null;
}

const highlights = [
  { id: "peaceful", label: "Peaceful", icon: "ph-park" },
  { id: "unique", label: "Unique", icon: "ph-sparkle" },
  { id: "family", label: "Family-friendly", icon: "ph-baby" },
  { id: "stylish", label: "Stylish", icon: "ph-palette" },
  { id: "central", label: "Central", icon: "ph-map-pin" },
  { id: "spacious", label: "Spacious", icon: "ph-arrows-out" },
];

export const HighlightsStep = ({ selectedHighlights, toggleHighlight, selectedType }: HighlightsStepProps) => {

  return (
    <motion.div
      key="highlights"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col items-center px-6 py-8 md:p-10 overflow-y-auto"
    >
      <div className="max-w-2xl w-full">
<h1 className="text-[26px] md:text-4xl font-display font-[600] text-slate-900 leading-tight mb-2">
          Next, let's describe your {selectedType?.replace('_', ' ') || 'place'}
        </h1>
        <p className="text-slate-500 text-lg mb-10">Choose up to 2 highlights. We'll use these to get your description started.</p>
        
        <div className="flex flex-wrap gap-3">
          {highlights.map((h) => (
            <button
              key={h.id}
              onClick={() => toggleHighlight(h.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all font-bold text-lg ${
                selectedHighlights.includes(h.id)
                  ? "border-slate-900 bg-white ring-1 ring-slate-900"
                  : "border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <i className={`ph-bold ${h.icon} text-xl`}></i>
              <span>{h.label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

