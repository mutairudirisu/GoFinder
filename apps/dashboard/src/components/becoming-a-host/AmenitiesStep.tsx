import { motion } from "framer-motion";

interface AmenitiesStepProps {
  selectedAmenities: string[];
  toggleAmenity: (id: string) => void;
}

const amenities = [
  { id: "wifi", label: "Wifi", icon: "ph-wifi-high", category: "essential" },
  { id: "kitchen", label: "Kitchen", icon: "ph-cooking-pot", category: "essential" },
  { id: "washer", label: "Washer", icon: "ph-washing-machine", category: "essential" },
  { id: "parking", label: "Free parking", icon: "ph-car", category: "essential" },
  { id: "ac", label: "Air conditioning", icon: "ph-snowflake", category: "essential" },
  { id: "workspace", label: "Dedicated workspace", icon: "ph-desktop", category: "essential" },
  // Student specific
  { id: "study_room", label: "Study Room", icon: "ph-books", category: "student" },
  { id: "library", label: "Library Access", icon: "ph-book-open", category: "student" },
  { id: "canteen", label: "Canteen / Mess", icon: "ph-fork-knife", category: "student" },
  // Hostel specific
  { id: "lockers", label: "Secure Lockers", icon: "ph-lock", category: "hostel" },
  { id: "lounge", label: "Shared Lounge", icon: "ph-couch", category: "hostel" },
  { id: "security", label: "24/7 Security", icon: "ph-shield-check", category: "hostel" },
];

export const AmenitiesStep = ({ selectedAmenities, toggleAmenity }: AmenitiesStepProps) => {
  return (
    <motion.div
      key="amenities"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col items-center px-6 py-8 md:p-10 overflow-y-auto"
    >
      <div className="max-w-2xl w-full">
        <h1 className="text-[26px] md:text-4xl font-display font-[600] text-slate-900 leading-tight mb-2">
          Tell guests what your place has to offer
        </h1>
        <p className="text-slate-500 text-lg mb-10">You can add more amenities after you publish your listing.</p>
        
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {amenities.map((amenity) => (
            <button
              key={amenity.id}
              onClick={() => toggleAmenity(amenity.id)}
              className={`flex flex-col p-6 rounded-2xl border-2 transition-all text-left h-full ${
                selectedAmenities.includes(amenity.id)
                  ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                  : "border-slate-100 hover:border-brand-300 hover:bg-brand-50/50"
              }`}
            >
              <i className={`ph-bold ${amenity.icon} text-3xl mb-4 ${selectedAmenities.includes(amenity.id) ? "text-brand-600" : "text-slate-700"}`}></i>
              <span className={`font-bold block text-lg ${selectedAmenities.includes(amenity.id) ? "text-brand-700" : "text-slate-700"}`}>
                {amenity.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

