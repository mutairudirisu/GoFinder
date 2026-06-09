import { motion } from "framer-motion";

export const TellUsStep = () => {
  return (
    <motion.div
      key="tell_us"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 grid grid-cols-1 lg:grid-cols-2 h-full bg-white relative"
    >
      <div className="flex flex-col justify-center px-8 md:px-24 py-10 space-y-10 order-2 lg:order-1">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-display font-semibold text-slate-900 leading-[1.1] tracking-[-0.02em]">
            Set up your <br /> Airbnb listing
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 leading-relaxed max-w-lg font-light">
            It's easy to create a great listing—let's start with your address.
          </p>
        </div>

        <div className="relative max-w-md w-full group cursor-text">
          <div className="absolute left-6 top-1/2 -translate-y-1/2">
            <i className="ph ph-magnifying-glass text-2xl text-slate-900"></i>
          </div>
          <div className="w-full h-[72px] bg-white border border-slate-300 rounded-full flex items-center pl-16 pr-6 text-slate-500 text-lg shadow-sm group-hover:border-slate-400 transition-all duration-300">
            Enter your address
          </div>
        </div>
      </div>

      <div className="bg-white flex items-center justify-center p-4 md:p-12 order-1 lg:order-2">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl aspect-[1.1] relative rounded-[32px] md:rounded-[40px] overflow-hidden bg-[#F7F7F7] shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
        >
          <div className="absolute inset-0 w-full h-full">
            <video 
              autoPlay 
              muted 
              playsInline 
              loop 
              className="w-full h-full object-cover scale-105"
              poster="https://a0.muscache.com/im/mux/BS9QgsDQIFvRdMk00NihVJ4awIr4gQqKanLfnWOiM4I8/thumbnail.jpg?time=0.0"
            >
              <source src="https://stream.media.muscache.com/mp4/BS9QgsDQIFvRdMk00NihVJ4awIr4gQqKanLfnWOiM4I8.mp4?v_res=1440p" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
