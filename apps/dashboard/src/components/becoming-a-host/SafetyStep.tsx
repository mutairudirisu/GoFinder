import { motion } from "framer-motion";
import Link from "next/link";

interface SafetyStepProps {
  safetyDetails: {
    hasCamera: boolean;
    cameraDescription: string;
    hasNoiseMonitor: boolean;
    hasWeapon: boolean;
  };
  setSafetyDetails: (details: any) => void;
}

export const SafetyStep = ({ safetyDetails, setSafetyDetails }: SafetyStepProps) => {
  return (
    <motion.div
      key="safety"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col items-center p-8 md:p-10 overflow-y-auto"
    >
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl md:text-2xl font-display font-[600] text-slate-900 mb-2">
          Share safety details
        </h1>
        <p className="text-slate-500 mb-10 text-base">Does your place have any of these? <i className="ph ph-info text-slate-400"></i></p>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base text-slate-700">Exterior security camera present</span>
              <button 
                onClick={() => setSafetyDetails({...safetyDetails, hasCamera: !safetyDetails.hasCamera})}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  safetyDetails.hasCamera ? "bg-slate-900 border-slate-900" : "border-slate-200"
                }`}
              >
                {safetyDetails.hasCamera && <i className="ph-bold ph-check text-white text-[10px]"></i>}
              </button>
            </div>
            {safetyDetails.hasCamera && (
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <textarea 
                  value={safetyDetails.cameraDescription}
                  onChange={(e) => setSafetyDetails({...safetyDetails, cameraDescription: e.target.value})}
                  placeholder='"security cameras cover the front yard and the street. everyone accessing the house is visible"'
                  className="w-full bg-transparent border-none outline-none text-sm text-slate-600 placeholder:text-slate-400 resize-none min-h-[70px]"
                />
                <button className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold hover:bg-white transition-all">Edit</button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-base text-slate-700">Noise decibel monitor present</span>
            <button 
              onClick={() => setSafetyDetails({...safetyDetails, hasNoiseMonitor: !safetyDetails.hasNoiseMonitor})}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                safetyDetails.hasNoiseMonitor ? "bg-slate-900 border-slate-900" : "border-slate-200"
              }`}
            >
              {safetyDetails.hasNoiseMonitor && <i className="ph-bold ph-check text-white text-[10px]"></i>}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-base text-slate-700">Weapon(s) on the property</span>
            <button 
              onClick={() => setSafetyDetails({...safetyDetails, hasWeapon: !safetyDetails.hasWeapon})}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                safetyDetails.hasWeapon ? "bg-slate-900 border-slate-900" : "border-slate-200"
              }`}
            >
              {safetyDetails.hasWeapon && <i className="ph-bold ph-check text-white text-[10px]"></i>}
            </button>
          </div>
        </div>

        <div className="mt-10 pt-10 border-t border-slate-100 space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Important things to know</h3>
            <p className="text-base text-slate-500 leading-relaxed">
              Security cameras that monitor indoor spaces are not allowed even if they're turned off. All exterior security cameras must be disclosed.
            </p>
          </div>
          <p className="text-sm text-slate-400">
            Be sure to comply with your <Link href="#" className="underline hover:text-brand-500 font-bold">local laws</Link> and review GIG's <Link href="#" className="underline hover:text-brand-500 font-bold">anti-discrimination policy</Link> and <Link href="#" className="underline hover:text-brand-500 font-bold">guest and Host fees</Link>.  
          </p>
        </div>
      </div>
    </motion.div>
  );
};
