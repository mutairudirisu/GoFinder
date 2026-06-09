import { motion } from "framer-motion";

interface PropertyTypeStepProps {
  selectedType: string | null;
  onSelect: (type: string) => void;
}

const propertyTypes = [
  { id: "house", label: "House", icon: "ph-house" },
  { id: "apartment", label: "Apartment", icon: "ph-building-apartment" },
  { id: "barn", label: "Barn", icon: "ph-farm" },
  { id: "bed_breakfast", label: "Bed & breakfast", icon: "ph-coffee" },
  { id: "boat", label: "Boat", icon: "ph-boat" },
  { id: "cabin", label: "Cabin", icon: "ph-house-line" },
  { id: "camper", label: "Camper/RV", icon: "ph-car-profile" },
  { id: "casa_particular", label: "Casa particular", icon: "ph-buildings" },
  { id: "castle", label: "Castle", icon: "ph-castle-turret" },
  { id: "cave", label: "Cave", icon: "ph-mountains" },
  { id: "container", label: "Container", icon: "ph-package" },
  { id: "cycladic_home", label: "Cycladic home", icon: "ph-house-simple" },
  { id: "dammuso", label: "Dammuso", icon: "ph-tent" },
  { id: "dome", label: "Dome", icon: "ph-sphere" },
  { id: "earth_house", label: "Earth house", icon: "ph-globe" },
  { id: "farm", label: "Farm", icon: "ph-tree-evergreen" },
];

export const PropertyTypeStep = ({ selectedType, onSelect }: PropertyTypeStepProps) => {
  return (
    <motion.div
      key="type"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col items-center px-5 py-6 md:px-8 md:py-8 overflow-y-auto"
    >
      <div className="w-full max-w-5xl">
        <h1 className="mb-8 max-w-2xl text-[26px] font-display font-semibold leading-tight text-slate-900 md:mb-10 md:text-4xl">
          Which of these best describes your place?
        </h1>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
          {propertyTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={`flex min-h-[150px] flex-col justify-between rounded-3xl border p-5 text-left transition-all md:min-h-[170px] md:p-6 ${
                selectedType === type.id
                  ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100 shadow-sm"
                  : "border-slate-200 hover:border-brand-300 hover:bg-brand-50/50"
              }`}
            >
              <i className={`ph-bold ${type.icon} mb-5 text-4xl ${selectedType === type.id ? "text-brand-600" : "text-slate-700"}`}></i>
              <span className={`block text-base font-semibold md:text-lg ${selectedType === type.id ? "text-brand-700" : "text-slate-800"}`}>
                {type.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

