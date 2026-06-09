import { motion } from "framer-motion";

interface TitleStepProps {
  title: string;
  setTitle: (title: string) => void;
  selectedType: string | null;
}

export const TitleStep = ({ title, setTitle, selectedType }: TitleStepProps) => {

  return (
    <motion.div
      key="title"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col items-center px-6 py-8 md:p-10 overflow-y-auto"
    >
      <div className="max-w-2xl w-full">
<h1 className="text-[26px] md:text-4xl font-display font-[600] text-slate-900 leading-tight mb-2">
          Now, let's give your {selectedType?.replace('_', ' ') || 'place'} a title
        </h1>
        <p className="text-slate-500 text-lg mb-10">Short titles work best. You can always change it later.</p>
        
        <div className="relative">
          <textarea 
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 32))}
            placeholder="e.g. Cozy Student Loft near UI"
            className="w-full p-8 bg-white border-2 border-slate-200 rounded-[32px] min-h-[180px] text-xl font-bold text-slate-700 outline-none focus:border-slate-900 transition-all resize-none shadow-sm"
          />
          <div className="absolute bottom-6 left-8 text-xs font-bold text-slate-400 uppercase tracking-wider">
            {title.length}/32 characters
          </div>
        </div>
      </div>
    </motion.div>
  );
};

