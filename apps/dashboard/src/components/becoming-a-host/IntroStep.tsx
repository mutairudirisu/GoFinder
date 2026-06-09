import { motion } from "framer-motion";

interface IntroStepProps {
  stepNumber: number;
  title: string;
  description: string;
  videoUrl?: string;
  posterUrl?: string;
}

export const IntroStep = ({ stepNumber, title, description, videoUrl, posterUrl }: IntroStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 grid grid-cols-1 lg:grid-cols-2 h-full bg-white"
    >
      <div className="flex flex-col justify-center px-8 md:px-24 py-10 space-y-8 order-2 lg:order-1">
        <div className="space-y-6">
          <span className="text-lg font-bold text-slate-900">Step {stepNumber}</span>
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-display font-semibold text-slate-900 leading-[1.1] tracking-[-0.02em]">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 leading-relaxed max-w-lg font-light">
            {description}
          </p>
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
            {videoUrl ? (
              <video 
                autoPlay 
                muted 
                playsInline 
                loop 
                className="w-full h-full object-cover scale-105"
                poster={posterUrl}
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50">
                <i className="ph-bold ph-sparkle text-[100px] text-slate-200"></i>
              </div>
            )}
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

type MainIntroStepProps = {
  category?: string | null;
};

type IntroCategory = "home" | "service" | "experience";
type IntroContent = {
  title: string;
  steps: Array<{ title: string; description: string; image: string }>;
};

const introContent: Record<IntroCategory, IntroContent> = {
  home: {
    title: "It's easy to get started on GIGS",
    steps: [
      {
        title: "Tell us about your place",
        description: "Share some basic info, like where it is and how many guests can stay.",
        image: "https://img.viva.com.vn/2023/12/01/airbnb-room.png",
      },
      {
        title: "Make it stand out",
        description: "Add photos, title and description that make your listing feel complete.",
        image: "https://img.viva.com.vn/2023/12/01/airbnb-standout.png",
      },
      {
        title: "Finish up and publish",
        description: "Choose a starting price, verify a few details, then publish your listing.",
        image: "https://img.viva.com.vn/2023/12/01/airbnb-publish.png",
      },
    ],
  },
  service: {
    title: "Launch your service in a few simple steps",
    steps: [
      {
        title: "Tell us what you offer",
        description: "Choose your service type and where you currently operate.",
        image: "https://img.viva.com.vn/2023/12/01/airbnb-room.png",
      },
      {
        title: "Show clients what to expect",
        description: "Add photos, a service title, and a clear description of what is included.",
        image: "https://img.viva.com.vn/2023/12/01/airbnb-standout.png",
      },
      {
        title: "Set your rate and go live",
        description: "Choose how clients pay, add any extra fees, and publish your service.",
        image: "https://img.viva.com.vn/2023/12/01/airbnb-publish.png",
      },
    ],
  },
  experience: {
    title: "Share your experience with confidence",
    steps: [
      {
        title: "Choose your experience type",
        description: "Help guests understand the kind of activity or event you are offering.",
        image: "https://img.viva.com.vn/2023/12/01/airbnb-room.png",
      },
      {
        title: "Describe the experience",
        description: "Explain what guests will do, what makes it special, and how many can join.",
        image: "https://img.viva.com.vn/2023/12/01/airbnb-standout.png",
      },
      {
        title: "Set pricing and publish",
        description: "Choose your pricing style, review the details, and make it bookable.",
        image: "https://img.viva.com.vn/2023/12/01/airbnb-publish.png",
      },
    ],
  },
};

export const MainIntroStep = ({ category }: MainIntroStepProps) => {
  const safeCategory: IntroCategory =
    category === "service" || category === "experience" || category === "home"
      ? category
      : "home";
  const content = introContent[safeCategory];

  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col items-center justify-center bg-white overflow-y-auto"
    >
      <div className="w-full max-w-3xl px-5 py-10 md:px-6 md:py-20 space-y-10 md:space-y-12">
        <h1 className="text-3xl md:text-[48px] font-display font-semibold text-slate-900 leading-[1.1] tracking-[-0.02em]">{content.title}</h1>

        <div className="space-y-8 md:space-y-12">
          {content.steps.map((step, index) => (
          <div
            key={step.title}
            className={`grid grid-cols-[32px_minmax(0,1fr)] md:grid-cols-[32px_minmax(0,1fr)_96px] gap-4 md:gap-8 items-start group ${index === 1 ? "border-y border-slate-100 py-8 md:py-12" : ""}`}
          >
            <span className="text-2xl font-bold text-slate-900 pt-1">{index + 1}</span>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">{step.title}</h2>
              <p className="text-base md:text-lg text-slate-500 leading-relaxed font-light">{step.description}</p>
            </div>
            <div className="hidden md:flex w-24 h-24 shrink-0 bg-slate-50 rounded-2xl items-center justify-center overflow-hidden border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
              <img src={step.image} alt={step.title} className="w-full h-full object-cover scale-110" />
            </div>
          </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
