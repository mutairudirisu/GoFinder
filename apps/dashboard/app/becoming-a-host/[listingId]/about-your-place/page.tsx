"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import confetti from "canvas-confetti";

type Step = 
  | "INTRO"
  | "TELL_US" 
  | "TYPE" 
  | "SPACE_TYPE"
  | "BASICS"
  | "AMENITIES"
  | "IMAGES"
  | "TITLE"
  | "DESCRIPTION"
  | "PRICING_DURATION"
  | "CHECK_IN_OUT"
  | "HOUSE_RULES"
  | "VERIFICATION"
  | "CONGRATS";

export default function AboutYourPlacePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const listingId = params.listingId as string;

  const [currentStep, setCurrentStep] = useState<Step>("INTRO");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSpaceType, setSelectedSpaceType] = useState<string | null>(null);
  
  // State for all steps
  const [basics, setBasics] = useState({ guests: 2, bedrooms: 1, beds: 1 });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  // Pricing and Duration State
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [paymentFrequency, setPaymentFrequency] = useState<"MONTHLY" | "QUARTERLY" | "YEARLY">("MONTHLY");
  const [minStayNights, setMinStayNights] = useState(1);
  const [checkInTime, setCheckInTime] = useState("2:00 PM");
  const [checkOutTime, setCheckOutTime] = useState("12:00 PM");
  
  const [houseRules, setHouseRules] = useState<string[]>([]);
  const [verificationDocs, setVerificationDocs] = useState({
    cOfO: null as File | null,
    deed: null as File | null,
    video: null as File | null
  });
  const [publishingProgress, setPublishingProgress] = useState(0);
  const [isPublished, setIsPublished] = useState(false);

  const stepsOrder: Step[] = [
    "INTRO", "TELL_US", "TYPE", "SPACE_TYPE", "BASICS", 
    "AMENITIES", "IMAGES", "TITLE", "DESCRIPTION", 
    "PRICING_DURATION", "CHECK_IN_OUT", "HOUSE_RULES", 
    "VERIFICATION", "CONGRATS"
  ];

  const handleNext = () => {
    const currentIndex = stepsOrder.indexOf(currentStep);
    const nextStep = stepsOrder[currentIndex + 1];
    if (nextStep) {
      setCurrentStep(nextStep as Step);
    } else {
      router.push("/hosting/listings");
    }
  };

  const handleBack = () => {
    const currentIndex = stepsOrder.indexOf(currentStep);
    const prevStep = stepsOrder[currentIndex - 1];
    if (prevStep) {
      setCurrentStep(prevStep as Step);
    } else {
      router.back();
    }
  };

  const progress = ((stepsOrder.indexOf(currentStep) + 1) / stepsOrder.length) * 100;

  // Components for each step
  const StepWrapper = ({ children, title, subtitle, tips }: { children: React.ReactNode, title: string, subtitle?: string, tips?: string[] }) => (
    <div className="flex-1 flex flex-col md:flex-row gap-10">
      <div className="flex-1 space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-2">{title}</h1>
          {subtitle && <p className="text-slate-500 text-lg">{subtitle}</p>}
        </div>
        {children}
      </div>
      {tips && (
        <div className="md:w-80 space-y-6 flex-shrink-0">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-2xl shadow-sm">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <i className="ph-fill ph-lightbulb text-xl text-blue-500"></i>
              Tips
            </h3>
            <ul className="space-y-4">
              {tips.map((tip, i) => (
                <li key={i} className="text-sm text-blue-800 leading-relaxed flex gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  const propertyTypes = [
    { id: "apartment", label: "Apartment", icon: "ph-building-apartment" },
    { id: "house", label: "House", icon: "ph-house" },
    { id: "studio", label: "Studio", icon: "ph-layout" },
    { id: "shared_room", label: "Shared Room", icon: "ph-users" },
    { id: "hostel", label: "Hostel", icon: "ph-buildings" },
  ];

  const spaceTypes = [
    { id: "entire", label: "An entire place", description: "Guests have the whole place to themselves.", icon: "ph-house" },
    { id: "room", label: "A room", description: "Guests have their own room in a home, plus access to shared spaces.", icon: "ph-door" },
    { id: "shared", label: "A shared room", description: "Guests sleep in a shared room or common area.", icon: "ph-users-three" },
  ];

  const amenities = [
    { id: "wifi", label: "High-Speed Internet", icon: "ph-wifi-high" },
    { id: "ac", label: "Air Conditioning", icon: "ph-snowflake" },
    { id: "kitchen", label: "Private Kitchen", icon: "ph-cooking-pot" },
    { id: "parking", label: "Parking Space", icon: "ph-car" },
    { id: "security", label: "24/7 Security Guard", icon: "ph-shield-check" },
    { id: "tv", label: "Smart TV", icon: "ph-monitor" },
    { id: "washer", label: "Washing Machine", icon: "ph-washing-machine" },
    { id: "pool", label: "Swimming Pool", icon: "ph-swimming-pool" },
  ];

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setVerificationDocs(prev => ({ ...prev, [id as keyof typeof verificationDocs]: file }));
    }
  };

  // Trigger publishing simulation
  useEffect(() => {
    if (currentStep === "CONGRATS" && !isPublished) {
      let p = 0;
      const interval = setInterval(() => {
        p += 5;
        if (p >= 100) {
          setIsPublished(true);
          setPublishingProgress(100);
          clearInterval(interval);
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        } else {
          setPublishingProgress(p);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [currentStep, isPublished]);

  return (
    <div className="flex-1 flex flex-col relative bg-white overflow-hidden">
      {/* Progress Bar */}
      <div className="h-1.5 bg-slate-100 w-full sticky top-0 z-50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-slate-900 transition-all duration-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-10 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-6xl mx-auto min-h-full flex flex-co "
          >
            {currentStep === "INTRO" && (
              <StepWrapper title="It's easy to get started on GIGS">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-lg items-center">
                  <div className="space-y-10">
                    {[
                      { num: 1, t: "Tell us about your place", d: "Share some basic info, like where it is and how many guests can stay." },
                      { num: 2, t: "Make it stand out", d: "Add 5 or more photos plus a title and description—we’ll help you out." },
                      { num: 3, t: "Finish and publish", d: "Set your pricing, rules, and documents, then publish your listing." }
                    ].map(s => (
                      <div key={s.num} className="flex gap-6">
                        <span className="text-lg font-bold text-slate-900">{s.num}</span>
                        <div>
                          <h2 className="text-lg font-bold text-slate-900 mb-1">{s.t}</h2>
                          <p className="text-slate-500 leading-relaxed">{s.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" className="rounded-3xl shadow-2xl object-cover aspect-[4/3]" />
                </div>
              </StepWrapper>
            )}

            {currentStep === "TELL_US" && (
              <StepWrapper title="Tell us about your place" subtitle="In this step, we'll ask you which type of property you have.">
                <div className="bg-slate-50 rounded-[32px] p-10 flex items-center justify-center min-h-[400px]">
                  <div className="text-center space-y-6 max-w-md">
                    <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto shadow-xl">
                      <i className="ph-bold ph-house-line text-white text-3xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Step 1</h2>
                    <p className="text-slate-500 text-lg">We'll ask which type of property you have and if guests will book the entire place or just a room.</p>
                  </div>
                </div>
              </StepWrapper>
            )}

            {currentStep === "TYPE" && (
              <StepWrapper title="Which of these best describes your place?">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`flex flex-col p-6 rounded-2xl border-2 transition-all text-left gap-4 ${
                        selectedType === type.id
                          ? "border-slate-900 bg-slate-50 ring-2 ring-slate-900/5"
                          : "border-slate-100 hover:border-slate-300"
                      }`}
                    >
                      <i className={`ph ph-bold ${type.icon} text-3xl text-slate-900`}></i>
                      <span className="font-bold text-slate-900 text-lg">{type.label}</span>
                    </button>
                  ))}
                </div>
              </StepWrapper>
            )}

            {currentStep === "SPACE_TYPE" && (
              <StepWrapper title="What type of place will guests have?">
                <div className="space-y-4">
                  {spaceTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedSpaceType(type.id)}
                      className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all text-left ${
                        selectedSpaceType === type.id
                          ? "border-slate-900 bg-slate-50 ring-2 ring-slate-900/5"
                          : "border-slate-100 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex-1 pr-4">
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{type.label}</h3>
                        <p className="text-slate-500">{type.description}</p>
                      </div>
                      <i className={`ph-bold ${type.icon} text-2xl text-slate-900`}></i>
                    </button>
                  ))}
                </div>
              </StepWrapper>
            )}

            {currentStep === "BASICS" && (
              <StepWrapper title="Let's start with the basics" subtitle="How many guests can your place accommodate?">
                <div className="space-y-8 bg-slate-50 p-10 rounded-[32px]">
                  {[
                    { key: "guests", label: "Guests" },
                    { key: "bedrooms", label: "Bedrooms" },
                    { key: "beds", label: "Beds" }
                  ].map((b) => {
                    const key = b.key as keyof typeof basics;
                    return (
                      <div key={b.key} className="flex items-center justify-between pb-8 border-b border-slate-200 last:border-0 last:pb-0">
                        <span className="text-xl font-bold text-slate-900">{b.label}</span>
                        <div className="flex items-center gap-6">
                          <button 
                            onClick={() => setBasics(prev => ({...prev, [key]: Math.max(1, prev[key] - 1)}))}
                            className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all"
                          >
                            <i className="ph-bold ph-minus"></i>
                          </button>
                          <span className="w-6 text-center font-bold text-slate-900 text-2xl">{basics[key]}</span>
                          <button 
                            onClick={() => setBasics(prev => ({...prev, [key]: prev[key] + 1}))}
                            className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all"
                          >
                            <i className="ph-bold ph-plus"></i>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </StepWrapper>
            )}

            {currentStep === "AMENITIES" && (
              <StepWrapper 
                title="Tell guests what your place has to offer"
                tips={[
                  "Misleading listings lead to bad reviews. Only list what is actually available.",
                  "The more amenities you list, the more likely you are to attract tenants."
                ]}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {amenities.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => toggleAmenity(a.id)}
                      className={`flex flex-col p-6 rounded-2xl border-2 transition-all text-left gap-4 ${
                        selectedAmenities.includes(a.id)
                          ? "border-slate-900 bg-slate-50 ring-2 ring-slate-900/5"
                          : "border-slate-100 hover:border-slate-300"
                      }`}
                    >
                      <i className={`ph-bold ${a.icon} text-3xl text-slate-900`}></i>
                      <span className="font-bold text-slate-900 text-lg">{a.label}</span>
                    </button>
                  ))}
                </div>
              </StepWrapper>
            )}

            {currentStep === "IMAGES" && (
              <StepWrapper 
                title="Images" 
                subtitle="Upload high-quality photos to showcase your property."
                tips={[
                  "Use natural daylight for brighter rooms",
                  "Keep rooms clean and tidy for photos"
                ]}
              >
                <div className="space-y-10">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-4 border-l-4 border-green-500 pl-4">Cover Photo</h3>
                    <label className="aspect-video bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-slate-900 transition-all group overflow-hidden relative">
                      {photos[0] ? (
                        <img src={photos[0]} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <i className="ph-bold ph-image text-5xl text-slate-300 group-hover:text-slate-900 transition-colors mb-4"></i>
                          <p className="text-lg font-bold text-slate-900">Click to upload cover</p>
                          <p className="text-slate-400">This will be the main image</p>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </label>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-4 border-l-4 border-slate-200 pl-4">
                      <h3 className="font-bold text-slate-900">Gallery Photos & Videos</h3>
                      <span className="text-sm font-bold text-orange-500">{photos.length} / 15 (Min 3)</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <label className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-slate-900 transition-all">
                        <i className="ph-bold ph-plus text-slate-300"></i>
                        <span className="text-xs font-bold text-slate-400 mt-2">Add Photos</span>
                        <input type="file" className="hidden" accept="image/*" multiple onChange={handlePhotoUpload} />
                      </label>
                      {photos.slice(1).map((p, i) => (
                        <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-100 group relative">
                          <img src={p} className="w-full h-full object-cover" />
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              setPhotos(photos.filter((_, idx) => idx !== i + 1));
                            }}
                            className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                          >
                            <i className="ph-bold ph-trash text-red-500"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </StepWrapper>
            )}

            {currentStep === "TITLE" && (
              <StepWrapper 
                title="Now, let's give your place a title" 
                subtitle="Short titles work best. You can always change it later."
                tips={[
                  "Focus on what makes your place special",
                  "Keep it concise and professional"
                ]}
              >
                <div className="space-y-6">
                  <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value.slice(0, 50))}
                    placeholder="e.g. Modern 2-bedroom apartment in Lekki"
                    className="w-full p-8 bg-slate-50 border-2 border-slate-100 rounded-3xl text-2xl font-bold outline-none focus:border-slate-900 transition-all min-h-[200px] resize-none"
                  />
                  <div className="text-right text-slate-400 font-bold">
                    {title.length} / 50
                  </div>
                </div>
              </StepWrapper>
            )}

            {currentStep === "DESCRIPTION" && (
              <StepWrapper 
                title="Create your description" 
                subtitle="Share what makes your place special."
                tips={[
                  "Mention any unique features like a great view or high-speed wifi",
                  "Keep it clear and welcoming"
                ]}
              >
                <div className="space-y-6">
                  <div className="flex justify-end">
                    <button 
                      onClick={() => setDescription("This stunning modern apartment offers a perfect blend of luxury and comfort. Featuring spacious rooms, high-end finishes, and plenty of natural light, it's an ideal home for anyone looking for a premium living experience in a prime location.")}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-all border border-blue-100"
                    >
                      <i className="ph-fill ph-sparkle"></i>
                      Generate with AI
                    </button>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                    placeholder="Describe your place..."
                    className="w-full p-8 bg-slate-50 border-2 border-slate-100 rounded-3xl text-lg leading-relaxed outline-none focus:border-slate-900 transition-all min-h-[300px] resize-none"
                  />
                  <div className="text-right text-slate-400 font-bold">
                    {description.length} / 500
                  </div>
                </div>
              </StepWrapper>
            )}

            {currentStep === "PRICING_DURATION" && (
              <StepWrapper 
                title="Pricing and Duration" 
                subtitle="Set your monthly rental rate and minimum stay requirements."
                tips={[
                  "Most renters search for flexible stays — a lower minimum gets more enquiries",
                  "Pricing is based on your monthly rate, so shorter stays are automatically prorated"
                ]}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-white border-2 border-slate-100 rounded-[32px] space-y-6 shadow-sm">
                    <div className="flex items-center gap-3 text-green-600 font-bold">
                      <i className="ph-bold ph-money"></i>
                      <span>Monthly Rent</span>
                    </div>
                    <p className="text-sm text-slate-500">We use this base monthly rate to average out pricing for any stay duration.</p>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {(["MONTHLY", "QUARTERLY", "YEARLY"] as const).map(f => (
                        <button 
                          key={f} 
                          onClick={() => setPaymentFrequency(f)}
                          className={`py-2 text-xs font-bold rounded-lg border-2 transition-all ${paymentFrequency === f ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-slate-900 transition-all">
                      <span className="text-3xl font-bold text-slate-900">₦</span>
                      <input 
                        type="number" 
                        value={monthlyPrice}
                        onChange={e => setMonthlyPrice(Number(e.target.value))}
                        className="flex-1 bg-transparent text-3xl font-bold outline-none"
                        placeholder="0"
                      />
                      <span className="text-slate-400 font-bold">/ {paymentFrequency.toLowerCase().replace('ly', '')}</span>
                    </div>
                  </div>

                  <div className="p-8 bg-white border-2 border-slate-100 rounded-[32px] space-y-6 shadow-sm">
                    <div className="flex items-center gap-3 text-purple-600 font-bold">
                      <i className="ph-bold ph-moon"></i>
                      <span>Minimum Stay</span>
                    </div>
                    <p className="text-sm text-slate-500">What is the minimum allowed duration for each booking?</p>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { l: "1 night", v: 1 }, { l: "1 week", v: 7 },
                        { l: "1 month", v: 30 }, { l: "3 months", v: 90 },
                        { l: "6 months", v: 180 }, { l: "1 year", v: 365 }
                      ].map(stay => (
                        <button key={stay.l} onClick={() => setMinStayNights(stay.v)} className={`p-3 text-xs font-bold rounded-lg transition-all flex justify-between ${minStayNights === stay.v ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                          <span>{stay.l}</span>
                          <span className={minStayNights === stay.v ? 'text-white/60' : 'text-slate-900'}>{stay.v} nights</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <input 
                        type="number" 
                        value={minStayNights}
                        onChange={e => setMinStayNights(Number(e.target.value))}
                        className="flex-1 bg-transparent text-xl font-bold outline-none"
                      />
                      <span className="text-slate-400 font-bold">nights</span>
                    </div>
                  </div>
                </div>
              </StepWrapper>
            )}

            {currentStep === "CHECK_IN_OUT" && (
              <StepWrapper 
                title="Check-in/out" 
                subtitle="Define your preferred arrival and departure times for guests."
                tips={[
                  "Most check-ins happen between 10 AM - 6 PM",
                  "Standard check-out is between 10 AM - 12 PM",
                  "Leave buffer time for cleaning between guests"
                ]}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-white border-2 border-slate-100 rounded-[32px] space-y-4 shadow-sm">
                    <div className="flex items-center gap-3 text-orange-500 font-bold">
                      <i className="ph-bold ph-sun-horizon text-2xl"></i>
                      <span>Check-in time</span>
                    </div>
                    <p className="text-slate-400 text-sm">When guests can arrive</p>
                    <select value={checkInTime} onChange={e => setCheckInTime(e.target.value)} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-slate-900 text-lg appearance-none">
                      {["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="p-8 bg-white border-2 border-slate-100 rounded-[32px] space-y-4 shadow-sm">
                    <div className="flex items-center gap-3 text-blue-500 font-bold">
                      <i className="ph-bold ph-cloud-snow text-2xl"></i>
                      <span>Check-out time</span>
                    </div>
                    <p className="text-slate-400 text-sm">When guests must leave</p>
                    <select value={checkOutTime} onChange={e => setCheckOutTime(e.target.value)} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-slate-900 text-lg appearance-none">
                      {["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </StepWrapper>
            )}

            {currentStep === "HOUSE_RULES" && (
              <StepWrapper 
                title="House Rules" 
                subtitle="Set expectations for your guests."
                tips={[
                  "Clear rules lead to better guests and fewer issues",
                  "You can always update these rules after publishing"
                ]}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: "no_smoking", label: "No Smoking", icon: "ph-prohibit" },
                    { id: "no_pets", label: "No Pets", icon: "ph-dog" },
                    { id: "no_parties", label: "No Parties", icon: "ph-confetti" },
                    { id: "quiet_hours", label: "Quiet Hours (10 PM - 7 AM)", icon: "ph-moon" }
                  ].map(rule => (
                    <button
                      key={rule.id}
                      onClick={() => setHouseRules(prev => prev.includes(rule.id) ? prev.filter(r => r !== rule.id) : [...prev, rule.id])}
                      className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all text-left ${houseRules.includes(rule.id) ? 'border-slate-900 bg-slate-50' : 'border-slate-100 hover:border-slate-300'}`}
                    >
                      <i className={`ph-bold ${rule.icon} text-2xl text-slate-900`}></i>
                      <span className="font-bold text-slate-900">{rule.label}</span>
                    </button>
                  ))}
                </div>
              </StepWrapper>
            )}

            {currentStep === "VERIFICATION" && (
              <StepWrapper 
                title="Property Verification" 
                subtitle="Upload documents to verify ownership and increase trust."
                tips={[
                  "Verified properties get 3x more bookings",
                  "Documents are kept private and only used for internal verification"
                ]}
              >
                <div className="space-y-6">
                  {[
                    { id: "cOfO", label: "C of O (Certificate of Occupancy)" },
                    { id: "deed", label: "Deed of Assignment" },
                    { id: "video", label: "Video Walkthrough" }
                  ].map(doc => {
                    const key = doc.id as keyof typeof verificationDocs;
                    const isUploaded = !!verificationDocs[key];
                    return (
                      <label key={doc.id} className={`p-8 border-2 border-dashed rounded-3xl transition-all cursor-pointer flex items-center justify-between group ${isUploaded ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-slate-900'}`}>
                        <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${isUploaded ? 'bg-green-100' : 'bg-slate-50 group-hover:bg-slate-100'}`}>
                            <i className={`ph-bold ${isUploaded ? 'ph-check-circle text-green-600' : 'ph-file-arrow-up text-slate-400 group-hover:text-slate-900'} text-2xl`}></i>
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-lg block">{doc.label}</span>
                            <span className={`text-sm ${isUploaded ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
                              {isUploaded ? (verificationDocs[key] as File).name : "PDF, JPG or PNG (Max 10MB)"}
                            </span>
                          </div>
                        </div>
                        <div className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg active:scale-95 transition-transform ${isUploaded ? 'bg-green-600 text-white' : 'bg-slate-900 text-white'}`}>
                          {isUploaded ? "Change" : "Upload"}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept={doc.id === "video" ? "video/*" : ".pdf,image/*"} 
                          onChange={(e) => handleDocUpload(e, doc.id)} 
                        />
                      </label>
                    );
                  })}
                </div>
              </StepWrapper>
            )}

            {currentStep === "CONGRATS" && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-xl w-full bg-white rounded-[40px] border border-slate-200 shadow-2xl p-12 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-slate-900"></div>
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-100" />
                      <motion.circle cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="251.2" animate={{ strokeDashoffset: 251.2 - (251.2 * publishingProgress) / 100 }} className="text-slate-900" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isPublished ? <i className="ph-bold ph-check text-3xl text-slate-900"></i> : <span className="text-lg font-bold">{Math.round(publishingProgress)}%</span>}
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                    {isPublished ? "Congratulations!" : "Publishing..."}
                  </h1>
                  <p className="text-lg text-slate-600 mb-12">
                    {isPublished ? "Your listing is now live! We're excited to have you in the GIGS community." : "We're finalizing your details and setting up your listing page."}
                  </p>
                  {isPublished && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button onClick={() => router.push("/hosting/listings")} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl">View listing</button>
                      <button onClick={() => router.push("/hosting")} className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">Go to dashboard</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Static Footer */}
      <footer className="h-24 bg-white border-t border-slate-100 flex items-center justify-between px-6 md:px-12 flex-shrink-0 z-50">
        <button onClick={handleBack} className="text-lg font-bold text-slate-900 underline underline-offset-8 decoration-2">Back</button>
        <button 
          onClick={handleNext} 
          className="px-10 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-black transition-all shadow-xl active:scale-[0.98]"
        >
          {currentStep === "VERIFICATION" ? "Submit Listing" : "Next"}
        </button>
      </footer>
    </div>
  );
}
