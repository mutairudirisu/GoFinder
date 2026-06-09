import { motion } from "framer-motion";

interface DescriptionStepProps {
  description: string;
  setDescription: (description: string) => void;
  generateAIDescription: () => void;
  isGeneratingAI: boolean;
  selectedHighlights: string[];
}

export const DescriptionStep = ({
  description,
  setDescription,
  generateAIDescription,
  isGeneratingAI,
  selectedHighlights,
}: DescriptionStepProps) => {
  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;

  return (
    <motion.div
      key="description"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col items-center px-6 py-8 md:p-10 overflow-y-auto"
    >
      <div className="max-w-2xl w-full">
<div className="flex items-center justify-between mb-2">
          <h1 className="text-[26px] md:text-4xl font-display font-[600] text-slate-900 leading-tight">
            Create your description
          </h1>
        </div>
        <p className="text-slate-500 text-lg mb-10">Share what makes your place special. You need at least 10 words before continuing.</p>
        
        <div className="relative">
          <button 
            onClick={generateAIDescription}
            disabled={isGeneratingAI}
            className={`flex absolute bottom-6 right-8 items-center gap-2 px-4 py-2 rounded-full border-2 border-slate-900 bg-white text-slate-900 font-bold text-xs transition-all hover:bg-slate-50 ${isGeneratingAI ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <i className={`ph-bold ${isGeneratingAI ? 'ph-spinner animate-spin' : 'ph-sparkle'}`}></i>
            {isGeneratingAI ? 'Generating...' : 'Generate with AI'}
          </button>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 500))}
            placeholder="Write something fun and punchy..."
            className="w-full p-8 bg-white border-2 border-slate-200 rounded-[32px] min-h-[300px] text-lg text-slate-700 outline-none focus:border-slate-900 transition-all resize-none shadow-sm"
          />
          <div className="absolute bottom-6 left-8 text-xs font-bold text-slate-400 uppercase tracking-wider">
            {wordCount}/10 words · {description.length}/500 characters
          </div>
        </div>
        {selectedHighlights.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider w-full mb-1">Using highlights:</span>
            {selectedHighlights.map(h => (
              <div key={h} className="px-4 py-2 bg-slate-100 rounded-full text-sm font-bold text-slate-600 flex items-center gap-2">
                <i className="ph-fill ph-check-circle text-slate-900"></i>
                {h}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

