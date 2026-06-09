import { motion } from "framer-motion";
import Link from "next/link";

interface DiscountsStepProps {
  selectedDiscounts: string[];
  toggleDiscount: (id: string) => void;
}

const discountOptions = [
  { id: "new_listing", label: "New listing promotion", description: "Offer 20% off your first 3 bookings", percentage: 20 },
  { id: "last_minute", label: "Last-minute discount", description: "For stays booked 14 days or less before arrival", percentage: 6 },
  { id: "weekly", label: "Weekly discount", description: "For stays of 7 nights or more", percentage: 10 },
  { id: "monthly", label: "Monthly discount", description: "For stays of 28 nights or more", percentage: 25 },
];

export const DiscountsStep = ({ selectedDiscounts, toggleDiscount }: DiscountsStepProps) => {
  return (
    <motion.div
      key="discounts"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col items-center p-8 md:p-10 overflow-y-auto"
    >
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl md:text-2xl font-display font-[600] text-slate-900 mb-2">
          Add discounts
        </h1>
        <p className="text-slate-500 mb-10 text-base">Help your place stand out to get booked faster and earn your first reviews.</p>
        
        <div className="space-y-3">
          {discountOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => toggleDiscount(opt.id)}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left ${
                selectedDiscounts.includes(opt.id)
                  ? "border-brand-500 bg-brand-50/50"
                  : "border-slate-100 hover:border-brand-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-10 rounded-lg border flex items-center justify-center font-bold text-base ${
                  selectedDiscounts.includes(opt.id) ? "bg-white border-brand-200 text-brand-700" : "bg-slate-50 border-slate-200 text-slate-500"
                }`}>
                  {opt.percentage}%
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${selectedDiscounts.includes(opt.id) ? "text-brand-900" : "text-slate-900"}`}>{opt.label}</h3>
                  <p className="text-[11px] text-slate-500">{opt.description}</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                selectedDiscounts.includes(opt.id) ? "bg-slate-900 border-slate-900" : "border-slate-200"
              }`}>
                {selectedDiscounts.includes(opt.id) && <i className="ph-bold ph-check text-white text-[10px]"></i>}
              </div>
            </button>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-slate-400">
          Only one discount will be applied per stay. <Link href="#" className="underline hover:text-brand-500">Learn more</Link>
        </p>
      </div>
    </motion.div>
  );
};
