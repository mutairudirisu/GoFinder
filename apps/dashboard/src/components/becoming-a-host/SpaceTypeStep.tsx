import { motion } from "framer-motion";

interface SpaceTypeStepProps {
  selectedSpaceType: string | null;
  onSelect: (type: string) => void;
}

const spaceTypes = [
  { id: "entire", label: "An entire place", description: "Guests have the whole place to themselves.", icon: "ph-house" },
  { id: "room", label: "A room", description: "Guests have their own room in a home, plus access to shared spaces.", icon: "ph-door" },
  {
    id: "shared_student",
    label: "A shared space for students",
    description: "Best for off-campus student housing or a university hostel where students share the same living space.",
    icon: "ph-student",
    note: "Recommended for students looking for roommates.",
  },
  {
    id: "shared_hotel_guesthouse",
    label: "A shared room in a hotel or guest house",
    description: "Guests share a room in a hotel or guest house with onsite staff and flexible short stays.",
    icon: "ph-bed",
  },
];

export const SpaceTypeStep = ({ selectedSpaceType, onSelect }: SpaceTypeStepProps) => {
  return (
    <motion.div
      key="space_type"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col items-center px-6 py-8 md:p-10 overflow-y-auto"
    >
      <div className="max-w-2xl w-full">
        <h1 className="text-[26px] md:text-4xl font-display font-[600] text-slate-900 leading-tight mb-10">
          What type of place will guests have?
        </h1>
        
        <div className="space-y-4">
          {spaceTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all text-left ${
                selectedSpaceType === type.id
                  ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                  : "border-slate-100 hover:border-brand-300 hover:bg-brand-50/50"
              }`}
            >
              <div className="flex-1 pr-4">
                <h3 className={`text-xl font-bold mb-1 ${selectedSpaceType === type.id ? "text-brand-700" : "text-slate-700"}`}>
                  {type.label}
                </h3>
                <p className="text-base text-slate-500 leading-relaxed">{type.description}</p>
                {"note" in type && type.note ? (
                  <p className="mt-2 text-xs font-semibold text-brand-700">{type.note}</p>
                ) : null}
              </div>
              <i className={`ph-bold ${type.icon} text-3xl ${selectedSpaceType === type.id ? "text-brand-600" : "text-slate-400"}`}></i>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
