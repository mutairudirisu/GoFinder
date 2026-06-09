import { motion } from "framer-motion";

interface PricingStepProps {
  selectedCategory: string | null;
  experienceCapacity: number;
  price: number;
  setPrice: (price: number) => void;
  securityCharge: number;
  setSecurityCharge: (charge: number) => void;
  otherCharges: number;
  setOtherCharges: (charge: number) => void;
  paymentFrequency: "MONTHLY" | "QUARTERLY" | "YEARLY";
  setPaymentFrequency: (freq: "MONTHLY" | "QUARTERLY" | "YEARLY") => void;
}

export const PricingStep = ({
  selectedCategory,
  experienceCapacity,
  price,
  setPrice,
  securityCharge,
  setSecurityCharge,
  otherCharges,
  setOtherCharges,
  paymentFrequency,
  setPaymentFrequency,
}: PricingStepProps) => {
  const isHome = selectedCategory === "home";
  const isService = selectedCategory === "service";
  const frequencyOptions = isHome
    ? [
        { value: "MONTHLY" as const, label: "Monthly" },
        { value: "QUARTERLY" as const, label: "Quarterly" },
        { value: "YEARLY" as const, label: "Yearly" },
      ]
    : isService
      ? [
          { value: "MONTHLY" as const, label: "Hourly" },
          { value: "QUARTERLY" as const, label: "Per visit" },
          { value: "YEARLY" as const, label: "Per project" },
        ]
      : [
          { value: "MONTHLY" as const, label: "Per guest" },
          { value: "QUARTERLY" as const, label: "Private group" },
          { value: "YEARLY" as const, label: "Per session" },
        ];

  const pricingCopy = isHome
    ? {
        title: "Set your base price and charges",
        subtitle: "Configure how much guests will pay and how often.",
        baseLabel: "Base Price",
        extraOne: "Security Deposit",
        extraTwo: "Other Charges",
        totalLabel: `Total per ${paymentFrequency.toLowerCase()}`,
        totalNote: "Includes security deposit and other additional fees.",
      }
    : isService
      ? {
          title: "Set your service price",
          subtitle: "Choose what a client pays when booking your service.",
          baseLabel: "Service Rate",
          extraOne: "Call-out Fee",
          extraTwo: "Materials Fee",
          totalLabel: "Estimated service total",
          totalNote: "This gives clients a clear idea of your base service cost.",
        }
      : {
          title: "Set your experience price",
          subtitle: "Choose what guests pay to join your experience.",
          baseLabel: "Guest Price",
          extraOne: "Equipment Fee",
          extraTwo: "Add-on Fee",
          totalLabel: `Estimated total for ${Math.max(1, experienceCapacity)} guests`,
          totalNote: "Use a simple price that works for solo guests and small groups.",
        };

  return (
    <motion.div
      key="pricing"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col items-center px-6 py-8 md:p-10 overflow-y-auto"
    >
      <div className="max-w-2xl w-full">
<h1 className="text-[26px] md:text-4xl font-display font-[600] text-slate-900 leading-tight mb-2">
          {pricingCopy.title}
        </h1>
        <p className="text-slate-500 text-lg mb-10">{pricingCopy.subtitle}</p>
        
        <div className="space-y-8">
          {/* Base Price */}
          <div className="p-8 bg-white border-2 border-slate-200 rounded-[32px] shadow-sm">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4">{pricingCopy.baseLabel}</label>
            <div className="flex items-center gap-4">
              <span className="text-4xl md:text-5xl font-display font-bold text-slate-900">₦</span>
              <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                className="w-full text-4xl md:text-5xl font-display font-bold text-slate-900 outline-none border-none bg-transparent"
              />
            </div>
          </div>

          {/* Payment Frequency */}
          <div>
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider block mb-4">Payment Frequency</label>
            <div className="grid grid-cols-3 gap-3">
              {frequencyOptions.map((freq) => (
                <button
                  key={freq.value}
                  onClick={() => setPaymentFrequency(freq.value)}
                  className={`py-4 rounded-2xl font-bold text-lg transition-all border-2 ${
                    paymentFrequency === freq.value
                      ? "border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-200 shadow-md"
                      : "border-slate-100 text-slate-500 hover:border-brand-300"
                  }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Charges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50 rounded-[20px] border border-slate-100">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">{pricingCopy.extraOne}</label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900">₦</span>
                <input 
                  type="number" 
                  value={securityCharge}
                  onChange={(e) => setSecurityCharge(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent text-lg font-bold text-slate-900 outline-none"
                />
              </div>
            </div>
            <div className="p-5 bg-slate-50 rounded-[20px] border border-slate-100">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">{pricingCopy.extraTwo}</label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900">₦</span>
                <input 
                  type="number" 
                  value={otherCharges}
                  onChange={(e) => setOtherCharges(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent text-lg font-bold text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-500 text-base">{pricingCopy.totalLabel}</span>
              <span className="text-xl font-bold text-slate-900">₦{(price + securityCharge + otherCharges).toLocaleString()}</span>
            </div>
            <p className="text-sm text-slate-400">{pricingCopy.totalNote}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-full font-bold text-base text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <i className="ph-bold ph-chart-line-up text-brand-500"></i>
            View pricing trends in Nigeria
          </button>
        </div>
      </div>
    </motion.div>
  );
};

