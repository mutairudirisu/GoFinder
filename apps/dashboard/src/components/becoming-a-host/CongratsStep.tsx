import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface CongratsStepProps {
  user: any;
  publishingProgress: number;
  isPublished: boolean;
}

export const CongratsStep = ({ user, publishingProgress, isPublished }: CongratsStepProps) => {
  const router = useRouter();

  return (
    <motion.div
      key="congrats"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex-1 flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="max-w-xl w-full bg-white rounded-[32px] border border-slate-200 shadow-2xl p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-500"></div>
        
        {/* Animated Circular Progress Icon */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-100"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray="251.2"
              animate={{ strokeDashoffset: 251.2 - (251.2 * publishingProgress) / 100 }}
              transition={{ duration: 0.3, ease: "linear" }}
              className="text-brand-500"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isPublished ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center"
                >
                  <i className="ph-bold ph-check text-2xl text-white"></i>
                </motion.div>
              ) : (
                <motion.span 
                  key="progress"
                  exit={{ scale: 0, opacity: 0 }}
                  className="text-xs font-bold text-slate-400 uppercase tracking-widest"
                >
                  {Math.round(publishingProgress)}%
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
          {isPublished ? `Congratulations, ${user?.name?.split(' ')[0] || 'Host'}!` : "Publishing your listing..."}
        </h1>
        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
          {isPublished 
            ? "Your listing is being reviewed. From one host to another—welcome aboard. We're excited to have you in the GIGS community!"
            : "We're finalizing your details and setting up your listing page. This will only take a moment."}
        </p>
        
        {isPublished && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <button 
              onClick={() => router.push("/hosting/listings")}
              className="px-6 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-brutal-sm"
            >
              View your listing
            </button>
            <button 
              onClick={() => router.push("/hosting")}
              className="px-6 py-3.5 bg-white border-2 border-slate-200 text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
            >
              Go to dashboard
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
