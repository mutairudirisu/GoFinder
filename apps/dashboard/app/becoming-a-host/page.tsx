"use client";

<<<<<<< HEAD
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useBecomingAHost } from "@/hooks/useBecomingAHost";
import Link from "next/link";

import { CategoryStep } from "@/components/becoming-a-host/CategoryStep";
import { IntroStep, MainIntroStep } from "@/components/becoming-a-host/IntroStep";
import { TellUsStep } from "@/components/becoming-a-host/TellUsStep";
import { PropertyTypeStep } from "@/components/becoming-a-host/PropertyTypeStep";
import { SpaceTypeStep } from "@/components/becoming-a-host/SpaceTypeStep";
import { BasicsStep } from "@/components/becoming-a-host/BasicsStep";
import { AmenitiesStep } from "@/components/becoming-a-host/AmenitiesStep";
import { PhotosStep } from "@/components/becoming-a-host/PhotosStep";
import { TitleStep } from "@/components/becoming-a-host/TitleStep";
import { HighlightsStep } from "@/components/becoming-a-host/HighlightsStep";
import { DescriptionStep } from "@/components/becoming-a-host/DescriptionStep";
import { PricingStep } from "@/components/becoming-a-host/PricingStep";
import { DiscountsStep } from "@/components/becoming-a-host/DiscountsStep";
import { SafetyStep } from "@/components/becoming-a-host/SafetyStep";
import { CongratsStep } from "@/components/becoming-a-host/CongratsStep";
import { 
  ServiceTypeStep, 
  ServiceCoverageStep, 
  ServiceDetailsStep 
} from "@/components/becoming-a-host/ServiceSteps";
import { 
  ExperienceTypeStep, 
  ExperienceDetailsStep, 
  ExperienceCapacityStep 
} from "@/components/becoming-a-host/ExperienceSteps";

export default function BecomingAHostPage() {
  const router = useRouter();
  const {
    currentStep,
    selectedCategory, setSelectedCategory,
    selectedType, setSelectedType,
    selectedSpaceType, setSelectedSpaceType,
    selectedServiceType, setSelectedServiceType,
    serviceCoverage, setServiceCoverage,
    serviceDescriptionFocus, toggleServiceDescriptionFocus,
    selectedExperienceType, setSelectedExperienceType,
    experienceDescriptionFocus, toggleExperienceDescriptionFocus,
    experienceCapacity, setExperienceCapacity,
    photos, setPhotos,
    isUploadModalOpen, setIsUploadModalOpen,
    selectedFiles, setSelectedFiles,
    activeMenuIndex, setActiveMenuIndex,
    fileInputRef,
    menuRef,
    selectedHighlights, toggleHighlight,
    selectedAmenities, toggleAmenity,
    selectedDiscounts, toggleDiscount,
    safetyDetails, setSafetyDetails,
    title, setTitle,
    description, setDescription,
    price, setPrice,
    securityCharge, setSecurityCharge,
    otherCharges, setOtherCharges,
    paymentFrequency, setPaymentFrequency,
    isGeneratingAI, generateAIDescription,
    publishingProgress, isPublished,
    basics, setBasics,
    studentHousing, setStudentHousing,
    handleNext, handleBack,
    handleFileChange,
    removeSelectedFile,
    handleUpload,
    removePhoto,
    makeCoverPhoto,
    movePhoto,
    canContinue,
    stepGroups,
    currentGroupIndex,
    currentGroupProgress,
    user
  } = useBecomingAHost();

  const safeGroupIndex = Math.max(0, currentGroupIndex);
  const groupCount = stepGroups.length || 1;
  const currentGroupLabel = stepGroups[safeGroupIndex]?.label ?? "";
  const isShellStep = currentStep !== "CATEGORY" && currentStep !== "CONGRATS";
  const sectionMeta: Record<string, { icon: string; hint: string }> = {
    Start: { icon: "ph-sparkle", hint: "Quick overview before you begin" },
    Property: { icon: "ph-house-line", hint: "Type, layout and guest capacity" },
    Features: { icon: "ph-images-square", hint: "Amenities, media and listing story" },
    Finish: { icon: "ph-shield-check", hint: "Pricing, discounts and safety" },
    Service: { icon: "ph-briefcase", hint: "Service setup and coverage" },
    Media: { icon: "ph-camera", hint: "Photos your guests will see first" },
    Overview: { icon: "ph-sparkle", hint: "Quick overview before you begin" },
    Basics: { icon: "ph-house-line", hint: "Type, layout and guest capacity" },
    Details: { icon: "ph-images-square", hint: "Amenities, media and listing story" },
    Pricing: { icon: "ph-currency-ngn", hint: "Pricing and final setup" },
    Safety: { icon: "ph-shield-check", hint: "Important property safety details" },
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">


      <header className="h-20 px-6 md:px-12 flex items-center justify-between border-b border-transparent shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <i className="ph-bold ph-house-line text-lg text-white"></i>
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-900 hidden md:block">
            GIGS<span className="text-brand-600">Rentals</span>
          </span>
        </Link>

        {currentStep !== "CONGRATS" && (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push("/hosting")}
              className="px-4 py-2 rounded-full border border-slate-200 text-sm font-bold hover:bg-slate-50 transition-colors"
            >
              Save & Exit
            </button>
            <button className="px-4 py-2 rounded-full border border-slate-200 text-sm font-bold hover:bg-slate-50 transition-colors">
              Questions?
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto bg-slate-50 px-4 py-4 pb-48 md:px-8 md:py-6 md:pb-56">
        <div className={`mx-auto ${isShellStep ? "grid max-w-7xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]" : "max-w-full"}`}>
          {isShellStep && (
            <aside className="hidden space-y-4 lg:block">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Create listing</p>
                <h2 className="mt-2 text-2xl font-display font-semibold text-slate-900">Simple, guided setup</h2>
                <div className="mt-5 space-y-3">
                  {stepGroups.map((group, index) => {
                    const meta = sectionMeta[group.label] ?? { icon: "ph-circle", hint: "" };
                    const isActive = index === safeGroupIndex;
                    const isDone = index < safeGroupIndex;
                    return (
                      <div key={group.id} className={`rounded-2xl border p-4 transition-all ${isActive ? "border-brand-500 bg-brand-500 text-white" : "border-slate-200 bg-white text-slate-900 hover:border-brand-200 hover:bg-brand-50/40"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isActive ? "bg-white/14" : isDone ? "bg-brand-50 text-brand-600" : "bg-slate-100 text-slate-500"}`}>
                            <i className={`ph ${isDone && !isActive ? "ph-check" : meta.icon} text-lg`} />
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${isActive ? "text-white" : "text-slate-900"}`}>{group.label}</p>
                            <p className={`text-xs ${isActive ? "text-white/70" : "text-slate-500"}`}>{meta.hint}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>
          )}
          <section className={isShellStep ? "rounded-[32px] border border-slate-200 bg-white shadow-sm min-h-[720px] overflow-hidden" : ""}>
            {isShellStep && (
              <div className="border-b border-slate-100 px-6 py-5 md:px-8">
                <p className="text-sm font-semibold text-slate-500">Step {Math.min(groupCount, safeGroupIndex + 1)} of {groupCount}</p>
                <h1 className="mt-1 text-2xl md:text-3xl font-display font-semibold text-slate-900">{currentGroupLabel}</h1>
              </div>
            )}
            <AnimatePresence mode="wait">
              {currentStep === "CATEGORY" && (
            <CategoryStep 
              selectedCategory={selectedCategory} 
              onSelect={(cat) => {
                setSelectedCategory(cat);
                router.push(`/becoming-a-host/address?category=${cat}`);
              }} 
              onClose={() => router.push("/hosting")}
            />
          )}

              {currentStep === "INTRO" && <MainIntroStep category={selectedCategory} />}

          {currentStep === "TELL_US" && <TellUsStep />}

          {currentStep === "TYPE" && (
            <PropertyTypeStep selectedType={selectedType} onSelect={setSelectedType} />
          )}

          {currentStep === "SPACE_TYPE" && (
            <SpaceTypeStep selectedSpaceType={selectedSpaceType} onSelect={setSelectedSpaceType} />
          )}

          {currentStep === "SERVICE_TYPE" && (
            <ServiceTypeStep selectedServiceType={selectedServiceType} onSelect={setSelectedServiceType} />
          )}

          {currentStep === "SERVICE_COVERAGE" && (
            <ServiceCoverageStep serviceCoverage={serviceCoverage} setServiceCoverage={setServiceCoverage} />
          )}

          {currentStep === "SERVICE_DETAILS" && (
            <ServiceDetailsStep 
              title={title} setTitle={setTitle} 
              description={description} setDescription={setDescription} 
              serviceDescriptionFocus={serviceDescriptionFocus}
              toggleServiceDescriptionFocus={toggleServiceDescriptionFocus}
              generateAIDescription={generateAIDescription}
              isGeneratingAI={isGeneratingAI}
            />
          )}

          {currentStep === "EXPERIENCE_TYPE" && (
            <ExperienceTypeStep selectedExperienceType={selectedExperienceType} onSelect={setSelectedExperienceType} />
          )}

          {currentStep === "EXPERIENCE_DETAILS" && (
            <ExperienceDetailsStep 
              title={title} setTitle={setTitle} 
              description={description} setDescription={setDescription} 
              experienceDescriptionFocus={experienceDescriptionFocus}
              toggleExperienceDescriptionFocus={toggleExperienceDescriptionFocus}
              generateAIDescription={generateAIDescription}
              isGeneratingAI={isGeneratingAI}
            />
          )}

          {currentStep === "EXPERIENCE_CAPACITY" && (
            <ExperienceCapacityStep 
              experienceCapacity={experienceCapacity} 
              setExperienceCapacity={setExperienceCapacity} 
            />
          )}

          {currentStep === "BASICS" && (
            <BasicsStep
              basics={basics}
              setBasics={setBasics}
              studentHousing={studentHousing}
              setStudentHousing={setStudentHousing}
            />
          )}

          {currentStep === "STAND_OUT_INTRO" && (
            <IntroStep 
              stepNumber={2} 
              title="Make your place stand out" 
              description="In this step, you'll add some of the amenities your place offers, plus 5 or more photos. Then, you'll create a title and description."
              videoUrl="https://stream.media.muscache.com/mp4/SshL4eW3k76eU3R301Xw87M9v6u8R01p35uU7p6E02Xz7M.mp4?v_res=1440p"
              posterUrl="https://a0.muscache.com/im/pictures/media/media-1.jpg"
            />
          )}

          {currentStep === "AMENITIES" && (
            <AmenitiesStep selectedAmenities={selectedAmenities} toggleAmenity={toggleAmenity} />
          )}

          {currentStep === "PHOTOS" && (
            <PhotosStep 
              photos={photos} setPhotos={setPhotos} 
              selectedCategory={selectedCategory}
              isUploadModalOpen={isUploadModalOpen}
              setIsUploadModalOpen={setIsUploadModalOpen}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              activeMenuIndex={activeMenuIndex}
              setActiveMenuIndex={setActiveMenuIndex}
              handleFileChange={handleFileChange}
              removeSelectedFile={removeSelectedFile}
              handleUpload={handleUpload}
              removePhoto={removePhoto}
              makeCoverPhoto={makeCoverPhoto}
              movePhoto={movePhoto}
              menuRef={menuRef as React.RefObject<HTMLDivElement>}
              fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
            />
          )}

          {currentStep === "TITLE" && (
            <TitleStep title={title} setTitle={setTitle} selectedType={selectedType} />
          )}

          {currentStep === "HIGHLIGHTS" && (
            <HighlightsStep 
              selectedHighlights={selectedHighlights} 
              toggleHighlight={toggleHighlight} 
              selectedType={selectedType} 
            />
          )}

          {currentStep === "DESCRIPTION" && (
            <DescriptionStep 
              description={description} 
              setDescription={setDescription} 
              generateAIDescription={generateAIDescription}
              isGeneratingAI={isGeneratingAI}
              selectedHighlights={selectedHighlights}
            />
          )}

          {currentStep === "FINISH_INTRO" && (
            <IntroStep 
              stepNumber={3} 
              title="Finish up and publish" 
              description="Finally, you'll choose booking settings, set up pricing, and publish your listing."
              videoUrl="https://stream.media.muscache.com/mp4/L68Vf02p02K8Cid00C9L6p01u87YhYh026Z7Wp8m6m0200X8.mp4?v_res=1440p"
              posterUrl="https://a0.muscache.com/im/pictures/media/media-3.jpg"
            />
          )}

          {currentStep === "PRICING" && (
            <PricingStep 
                  selectedCategory={selectedCategory}
                  experienceCapacity={experienceCapacity}
              price={price} setPrice={setPrice}
              securityCharge={securityCharge} setSecurityCharge={setSecurityCharge}
              otherCharges={otherCharges} setOtherCharges={setOtherCharges}
              paymentFrequency={paymentFrequency} setPaymentFrequency={setPaymentFrequency}
            />
          )}

          {currentStep === "DISCOUNTS" && (
            <DiscountsStep selectedDiscounts={selectedDiscounts} toggleDiscount={toggleDiscount} />
          )}

          {currentStep === "SAFETY" && (
            <SafetyStep safetyDetails={safetyDetails} setSafetyDetails={setSafetyDetails} />
          )}

          {currentStep === "CONGRATS" && (
            <CongratsStep 
              user={user} 
              publishingProgress={publishingProgress} 
              isPublished={isPublished} 
            />
          )}
            </AnimatePresence>
          </section>
        </div>
      </main>

      {isShellStep && (
        <footer className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 backdrop-blur px-4 py-4 md:px-8 z-[60]">
          <div className="mx-auto max-w-7xl">
            <div className="mb-4 flex gap-2">
              {stepGroups.map((group, idx) => {
                const fill = idx < safeGroupIndex ? 100 : idx === safeGroupIndex ? Math.max(0, Math.min(100, Math.round(currentGroupProgress * 100))) : 0;
                return <div key={group.id} className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-brand-500 transition-[width] duration-500" style={{ width: `${fill}%` }} /></div>;
              })}
            </div>
            <div className="flex items-center gap-3 md:gap-6">
              <button onClick={handleBack} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm md:text-base font-semibold text-slate-900 hover:bg-slate-50 transition-colors">Back</button>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{currentGroupLabel}</p>
                <p className="truncate text-xs md:text-sm text-slate-500">Complete this section to keep your listing moving.</p>
              </div>
              <button
                onClick={handleNext}
                disabled={!canContinue}
                className={`rounded-2xl px-6 md:px-10 py-3.5 font-semibold md:text-lg transition-all active:scale-95 ${!canContinue ? "bg-slate-100 text-slate-300 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-slate-800 shadow-md"}`}
              >
                {currentStep === "INTRO" ? "Start section" : "Save & continue"}
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
=======
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import confetti from "canvas-confetti";
import { Listing } from "@/types/listing";
import { LocationPickerMap } from "@/components/listings/LocationPickerMap";

type Step = 
  | "ONBOARDING_START"
  | "INTRO"
  | "CATEGORY" 
  | "TELL_US" 
  | "TYPE" 
  | "SPACE_TYPE"
  | "BASICS"
  | "STAND_OUT_INTRO"
  | "AMENITIES"
  | "PHOTOS"
  | "TITLE"
  | "HIGHLIGHTS"
  | "DESCRIPTION"
  | "FINISH_INTRO"
  | "PRICING"
  | "DISCOUNTS"
  | "SAFETY"
  | "CONGRATS"
  // Service Specific Steps
  | "SERVICE_TYPE"
  | "SERVICE_DETAILS"
  | "SERVICE_COVERAGE"
  // Experience Specific Steps
  | "EXPERIENCE_TYPE"
  | "EXPERIENCE_DETAILS"
  | "EXPERIENCE_CAPACITY";

export default function BecomingAHostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("ONBOARDING_START");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSpaceType, setSelectedSpaceType] = useState<string | null>(null);
  
  // New State for Services and Experiences
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
  const [serviceCoverage, setServiceCoverage] = useState<string[]>([]);
  const [selectedExperienceType, setSelectedExperienceType] = useState<string | null>(null);
  const [experienceCapacity, setExperienceCapacity] = useState(10);
  
  // New State for remaining steps
  const [photos, setPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1555854811-82242b5126f7?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071&auto=format&fit=crop",
  ]);

  const addPhoto = () => {
    const mockPhotos = [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2074&auto=format&fit=crop",
    ];
    const nextPhoto = mockPhotos[photos.length % mockPhotos.length];
    if (nextPhoto) setPhotos([...photos, nextPhoto]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>(["new_listing", "weekly", "monthly"]);
  const [safetyDetails, setSafetyDetails] = useState({
    hasCamera: false,
    cameraDescription: "",
    hasNoiseMonitor: false,
    hasWeapon: false
  });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(150000);
  const [securityCharge, setSecurityCharge] = useState(50000);
  const [otherCharges, setOtherCharges] = useState(0);
  const [paymentFrequency, setPaymentFrequency] = useState<"MONTHLY" | "QUARTERLY" | "YEARLY">("MONTHLY");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [publishingProgress, setPublishingProgress] = useState(0);
  const [isPublished, setIsPublished] = useState(false);

  // Basics state
  const [basics, setBasics] = useState({
    guests: 2,
    bedrooms: 1,
    beds: 1,
    hasLock: null as boolean | null
  });

  // Address state - kept minimal as it's now handled in /address route
  // but needed for the final submission logic below
  const [address, setAddress] = useState({
    country: "Nigeria - NG",
    building: "",
    unit: "",
    street: "",
    district: "",
    city: "Lagos",
    province: "Lagos State",
    postalCode: "",
    latitude: 6.5244,
    longitude: 3.3792
  });
  const [showSpecificLocation, setShowSpecificLocation] = useState(true);

  // Redirect to /address if we are at the start
  useEffect(() => {
    if (currentStep === "ONBOARDING_START") {
      router.replace("/becoming-a-host/address");
    }
  }, [currentStep, router]);

  const isUserFullyVerified =
    (user?.verifications?.email?.status ?? "UNVERIFIED") === "VERIFIED" &&
    (user?.verifications?.phone?.status ?? "UNVERIFIED") === "VERIFIED" &&
    (user?.verifications?.id?.status ?? "UNVERIFIED") === "VERIFIED";

  // Trigger publishing simulation when reaching CONGRATS step
  useEffect(() => {
    if (currentStep === "CONGRATS" && !isPublished) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25;
        if (progress >= 100) {
          progress = 100;
          setPublishingProgress(100);
          setIsPublished(true);
          clearInterval(interval);
          
          // Save listing data
          const newListing: Listing = {
            id: `list_${Math.random().toString(36).substr(2, 9)}`,
            category: selectedCategory || "home",
            type: selectedCategory === "home" ? (selectedType || "house") : 
                  selectedCategory === "service" ? (selectedServiceType || "cleaning") : 
                  (selectedExperienceType || "tour"),
            spaceType: selectedSpaceType || undefined,
            host: {
              id: user?.id,
              name: user?.name || user?.email?.split("@")[0] || "Host",
              email: user?.email,
              phone: user?.phone,
              avatar: user?.avatar,
            },
            address: selectedCategory === "service" ? { ...address, city: serviceCoverage.join(", ") } : address,
            basics: selectedCategory === "home" ? basics : 
                    selectedCategory === "experience" ? { guests: experienceCapacity } : undefined,
            amenities: selectedCategory === "home" ? selectedAmenities : [],
            photos,
            title,
            highlights: selectedHighlights,
            description,
            price,
            securityCharge: selectedCategory === "home" ? securityCharge : 0,
            otherCharges: selectedCategory === "home" ? otherCharges : 0,
            paymentFrequency: selectedCategory === "home" ? paymentFrequency : "MONTHLY",
            status: isUserFullyVerified ? "VERIFIED" : "ACTION_REQUIRED",
            createdAt: new Date().toISOString(),
          };
          void fetch("/api/listings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newListing),
          });

          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            zIndex: 1000
          });
        } else {
          setPublishingProgress(progress);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [currentStep, isPublished, selectedCategory, selectedType, selectedServiceType, selectedExperienceType, selectedSpaceType, user, address, serviceCoverage, basics, experienceCapacity, selectedAmenities, photos, title, selectedHighlights, description, price, securityCharge, otherCharges, paymentFrequency, isUserFullyVerified]);

  const generateAIDescription = () => {
    setIsGeneratingAI(true);
    // Simulate AI generation delay
    setTimeout(() => {
      const highlightText = selectedHighlights.map(h => h.toLowerCase()).join(" and ");
      const typeText = selectedType?.replace('_', ' ') || "place";
      const generated = `Welcome to our ${highlightText} ${typeText} in the heart of ${address.city}. This space is designed for comfort and style, perfect for those looking for a ${selectedHighlights[0] || 'unique'} experience. Enjoy easy access to local amenities while staying in a ${selectedHighlights[1] || 'peaceful'} environment. We can't wait to host you!`;
      setDescription(generated);
      setIsGeneratingAI(false);
    }, 1500);
  };

  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", 
    "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos State", 
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", 
    "Taraba", "Yobe", "Zamfara"
  ];

  const categories = [
    { id: "home", label: "Home", icon: "ph-house-line", color: "text-blue-500", bg: "bg-blue-50" },
    { id: "experience", label: "Experience", icon: "ph-balloon", color: "text-rose-500", bg: "bg-rose-50" },
    { id: "service", label: "Service", icon: "ph-wrench", color: "text-amber-500", bg: "bg-amber-50" },
  ];

  const propertyTypes = [
    { id: "student_accommodation", label: "Student Accommodation", icon: "ph-graduation-cap", description: "Purpose-built student housing and dorms" },
    { id: "hostel", label: "Hostel", icon: "ph-buildings", description: "Social shared living with shared amenities" },
    { id: "apartment", label: "Apartment", icon: "ph-building-apartment", description: "Self-contained units in a larger building" },
    { id: "house", label: "House", icon: "ph-house", description: "Single-family homes or townhouses" },
    { id: "guesthouse", label: "Guesthouse", icon: "ph-house-line", description: "Private guest units on a shared property" },
    { id: "hotel", label: "Hotel", icon: "ph-office-chair", description: "Professional rooms in a boutique or chain hotel" },
    { id: "shared_room", label: "Shared Room", icon: "ph-users", description: "A shared sleeping space like a dorm bed" },
    { id: "private_room", label: "Private Room", icon: "ph-door", description: "Your own private bedroom in a shared space" },
    { id: "cabin", label: "Cabin", icon: "ph-tree", description: "Rustic retreats in nature" },
    { id: "boat", label: "Boat", icon: "ph-boat", description: "Floating stays on the water" },
  ];

  const serviceTypes = [
    { id: "home_lifestyle", label: "Home & Lifestyle", icon: "ph-house", description: "Cleaning, laundry, and home maintenance" },
    { id: "beauty_personal", label: "Beauty & Personal Care", icon: "ph-sparkles", description: "Hair, makeup, and personal styling" },
    { id: "events_entertainment", label: "Events & Entertainment", icon: "ph-confetti", description: "Planning, DJing, and event services" },
    { id: "professional_business", label: "Professional & Business", icon: "ph-briefcase", description: "Legal, accounting, and consulting" },
    { id: "health_wellness", label: "Health & Wellness", icon: "ph-heartbeat", description: "Fitness, therapy, and health services" },
    { id: "education_tutoring", label: "Education & Tutoring", icon: "ph-graduation-cap", description: "Private lessons and academic support" },
    { id: "logistics_transport", label: "Logistics & Transport", icon: "ph-truck", description: "Moving, delivery, and car services" },
    { id: "tech_digital", label: "Tech & Digital", icon: "ph-cpu", description: "IT support, repairs, and digital services" },
    { id: "other_service", label: "Others", icon: "ph-dots-three-circle", description: "Any other type of professional service" },
  ];

  const experienceTypes = [
    { id: "cultural_heritage", label: "Cultural & Heritage", icon: "ph-bank", description: "History, traditions, and local culture" },
    { id: "food_drink", label: "Food & Drink", icon: "ph-fork-knife", description: "Tours, tastings, and cooking classes" },
    { id: "outdoor_adventure", label: "Outdoor & Adventure", icon: "ph-mountains", description: "Hiking, sports, and nature activities" },
    { id: "arts_nightlife", label: "Arts, Entertainment & Nightlife", icon: "ph-music-notes", description: "Concerts, bar crawls, and gallery visits" },
    { id: "wellness_lifestyle", label: "Wellness & Lifestyle", icon: "ph-leaf", description: "Yoga, meditation, and self-care" },
    { id: "learning_education", label: "Learning & Education", icon: "ph-book-open", description: "Skill-sharing and educational tours" },
    { id: "other_experience", label: "Others", icon: "ph-dots-three-circle", description: "Any other type of unique experience" },
  ];

  const spaceTypes = [
    { id: "entire", label: "An entire place", description: "Guests have the whole place to themselves.", icon: "ph-house" },
    { id: "room", label: "A room", description: "Guests have their own room in a home, plus access to shared spaces.", icon: "ph-door" },
    { id: "shared", label: "A shared room in a hostel", description: "Guests sleep in a shared room in a professionally managed hostel with staff onsite 24/7.", icon: "ph-users-three" },
  ];

  const highlights = [
    { id: "peaceful", label: "Peaceful", icon: "ph-park" },
    { id: "unique", label: "Unique", icon: "ph-sparkle" },
    { id: "family", label: "Family-friendly", icon: "ph-baby" },
    { id: "stylish", label: "Stylish", icon: "ph-palette" },
    { id: "central", label: "Central", icon: "ph-map-pin" },
    { id: "spacious", label: "Spacious", icon: "ph-arrows-out" },
  ];

  const amenities = [
    { id: "wifi", label: "Wifi", icon: "ph-wifi-high", category: "essential" },
    { id: "kitchen", label: "Kitchen", icon: "ph-cooking-pot", category: "essential" },
    { id: "washer", label: "Washer", icon: "ph-washing-machine", category: "essential" },
    { id: "parking", label: "Free parking", icon: "ph-car", category: "essential" },
    { id: "ac", label: "Air conditioning", icon: "ph-snowflake", category: "essential" },
    { id: "workspace", label: "Dedicated workspace", icon: "ph-desktop", category: "essential" },
    // Student specific
    { id: "study_room", label: "Study Room", icon: "ph-books", category: "student" },
    { id: "library", label: "Library Access", icon: "ph-book-open", category: "student" },
    { id: "canteen", label: "Canteen / Mess", icon: "ph-fork-knife", category: "student" },
    // Hostel specific
    { id: "lockers", label: "Secure Lockers", icon: "ph-lock", category: "hostel" },
    { id: "lounge", label: "Shared Lounge", icon: "ph-couch", category: "hostel" },
    { id: "security", label: "24/7 Security", icon: "ph-shield-check", category: "hostel" },
  ];

  const discountOptions = [
    { id: "new_listing", label: "New listing promotion", description: "Offer 20% off your first 3 bookings", percentage: 20 },
    { id: "last_minute", label: "Last-minute discount", description: "For stays booked 14 days or less before arrival", percentage: 6 },
    { id: "weekly", label: "Weekly discount", description: "For stays of 7 nights or more", percentage: 10 },
    { id: "monthly", label: "Monthly discount", description: "For stays of 28 nights or more", percentage: 25 },
  ];

  const stepsOrder = useMemo((): Step[] => {
    const startFlow: Step[] = ["ONBOARDING_START", "INTRO", "TELL_US", "CATEGORY"];
    
    if (selectedCategory === "home") {
      return [
        ...startFlow,
        "TYPE",
        "SPACE_TYPE",
        "BASICS",
        "STAND_OUT_INTRO",
        "AMENITIES",
        "PHOTOS",
        "TITLE",
        "HIGHLIGHTS",
        "DESCRIPTION",
        "FINISH_INTRO",
        "PRICING",
        "DISCOUNTS",
        "SAFETY",
        "CONGRATS"
      ];
    }
    if (selectedCategory === "service") {
      return [
        ...startFlow,
        "SERVICE_TYPE",
        "SERVICE_COVERAGE",
        "SERVICE_DETAILS",
        "PHOTOS",
        "PRICING",
        "CONGRATS"
      ];
    }
    if (selectedCategory === "experience") {
      return [
        ...startFlow,
        "EXPERIENCE_TYPE",
        "EXPERIENCE_DETAILS",
        "EXPERIENCE_CAPACITY",
        "PHOTOS",
        "PRICING",
        "CONGRATS"
      ];
    }
    return startFlow;
  }, [selectedCategory]);

  const handleNext = () => {
    const currentIndex = stepsOrder.indexOf(currentStep);
    const nextStep = stepsOrder[currentIndex + 1];
    if (nextStep) {
      setCurrentStep(nextStep);
    } else {
      // Final submission logic here
      router.push("/hosting/listings");
    }
  };

  const handleBack = () => {
    const currentIndex = stepsOrder.indexOf(currentStep);
    const prevStep = stepsOrder[currentIndex - 1];
    if (prevStep) {
      setCurrentStep(prevStep);
    }
  };

  const getProgress = () => {
    const currentIndex = stepsOrder.indexOf(currentStep);
    // Exclude Start and Congrats from progress bar logic
    if (currentStep === "ONBOARDING_START" || currentStep === "CONGRATS") return 0;
    return ((currentIndex) / (stepsOrder.length - 1)) * 100;
  };

  const toggleHighlight = (id: string) => {
    setSelectedHighlights(prev => 
      prev.includes(id) 
        ? prev.filter(h => h !== id) 
        : prev.length < 2 ? [...prev, id] : prev
    );
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => 
      prev.includes(id) 
        ? prev.filter(a => a !== id) 
        : [...prev, id]
    );
  };

  const toggleDiscount = (id: string) => {
    setSelectedDiscounts(prev => 
      prev.includes(id) 
        ? prev.filter(d => d !== id) 
        : [...prev, id]
    );
  };

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden">
      <AnimatePresence mode="wait">
        {currentStep === "CATEGORY" && (
            <motion.div
              key="category"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center bg-white"
            >
              <div className="w-full md:max-w-4xl rounded-t-[32px] md:rounded-[32px] p-8 md:p-12 ">
                <h1 className="text-2xl md:text-3xl font-display font-medium text-slate-900 text-center mb-10">
                  What would you like to host?
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:py-6">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        // Find the next step manually since stepsOrder updates asynchronously
                        if (cat.id === "home") setCurrentStep("TYPE");
                        else if (cat.id === "service") setCurrentStep("SERVICE_TYPE");
                        else if (cat.id === "experience") setCurrentStep("EXPERIENCE_TYPE");
                      }}
                      className={`flex justify-between flex-row-reverse md:flex-col items-center p-6 md:p-12
                         rounded-3xl border-2 transition-all group ${
                        selectedCategory === cat.id
                          ? "border-brand-500 bg-brand-50/50 ring-4 ring-brand-50"
                          : "border-slate-100 hover:border-brand-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`w-20 h-20 mb-4 flex items-center justify-center rounded-2xl ${cat.bg} group-hover:scale-110 transition-transform`}>
                        <i className={`ph-bold ${cat.icon} text-4xl ${cat.color}`}></i>
                      </div>
                      <span className={`text-xl font-display font-medium ${selectedCategory === cat.id ? 'text-brand-700' : 'text-slate-700'}`}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "INTRO" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 grid grid-cols-1 lg:grid-cols-2"
            >
              <div className="flex flex-col justify-center px-8 md:px-20 py-8 bg-white">
                <h1 className="text-2xl md:text-4xl font-display font-[500] text-slate-900 leading-tight mb-6">
                  It's easy to get started on GIGS
                </h1>
              </div>
              <div className="flex flex-col justify-center px-8 md:px-20 py-4 space-y-10">
                <div className="flex gap-5">
                  <span className="text-xl font-bold text-slate-900">1</span>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-900 mb-1">
                      {selectedCategory === "home" ? "Tell us about your place" : 
                       selectedCategory === "service" ? "Tell us about your service" : 
                       "Tell us about your experience"}
                    </h2>
                    <p className="text-slate-500 leading-relaxed text-[16px]">
                      {selectedCategory === "home" ? "Share some basic info, like where it is and how many guests can stay." : 
                       selectedCategory === "service" ? "Share what kind of service you provide and your coverage area." : 
                       "Share what makes your experience unique and where it takes place."}
                    </p>
                  </div>
                  <div className={`w-16 h-16 flex-shrink-0 rounded-2xl flex items-center justify-center ${
                    selectedCategory === "home" ? "bg-blue-50" : 
                    selectedCategory === "service" ? "bg-amber-50" : "bg-rose-50"
                  }`}>
                    <i className={`ph-bold text-2xl ${
                      selectedCategory === "home" ? "ph-house-line text-blue-500" : 
                      selectedCategory === "service" ? "ph-wrench text-amber-500" : "ph-balloon text-rose-500"
                    }`}></i>
                  </div>
                </div>
                <div className="flex gap-5 border-y border-slate-100 py-10">
                  <span className="text-xl font-bold text-slate-900">2</span>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Make it stand out</h2>
                    <p className="text-slate-500 leading-relaxed text-[16px]">Add 5 or more photos plus a title and description—we'll help you out.</p>
                  </div>
                  <div className="w-16 h-16 flex-shrink-0 bg-rose-50 rounded-2xl flex items-center justify-center">
                    <i className="ph-bold ph-sparkle text-2xl text-rose-500"></i>
                  </div>
                </div>
                <div className="flex gap-5">
                  <span className="text-xl font-bold text-slate-900">3</span>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Finish up and publish</h2>
                    <p className="text-slate-500 leading-relaxed text-[16px]">Choose a starting price, verify a few details, then publish your listing.</p>
                  </div>
                  <div className="w-16 h-16 flex-shrink-0 bg-amber-50 rounded-2xl flex items-center justify-center">
                    <i className="ph-bold ph-check-circle text-2xl text-amber-500"></i>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "TELL_US" && (
            <motion.div
              key="tell_us"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 grid grid-cols-1 lg:grid-cols-2 h-full bg-white"
            >
              <div className="flex flex-col justify-center px-8 md:px-24 py-10 space-y-6">
                <span className="text-lg font-bold text-slate-900">Step 1</span>
                <h1 className="text-4xl md:text-5xl font-display font-[600] text-slate-900 leading-tight">
                  Tell us about your place
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                  In this step, we'll ask you which type of property you have and if guests will book the entire place or just a room. Then let us know the location and how many guests can stay.
                </p>
              </div>
              <div className="bg-white flex items-center justify-center p-10">
                <div className="w-full max-w-2xl aspect-[1.4/1] relative flex items-center justify-center">
                  <motion.img 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" 
                    className="w-full h-full object-cover rounded-[32px] shadow-2xl"
                    alt="Place Intro"
                  />
                  {/* Isometric Overlay Simulation */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none rounded-[32px]" />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "TYPE" && (
            <motion.div
              key="type"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col items-center px-5 py-8 md:p-10 overflow-y-auto"
            >
              <div className="max-w-3xl w-full">
                <h1 className="text-2xl md:text-3xl font-display font-[500] text-slate-900 mb-10">
                  Which of these best describes your place?
                </h1>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`flex flex-col p-4 rounded-2xl border-2 transition-all text-left h-full ${
                        selectedType === type.id
                          ? "border-brand-500 bg-brand-50/50 ring-2 ring-brand-50"
                          : "border-slate-100 hover:border-brand-200 hover:bg-slate-50"
                      }`}
                    >
                      <i className={`ph-bold ${type.icon} text-4xl mb-3 ${selectedType === type.id ? 'text-brand-600' : 'text-slate-700'}`}></i>
                      <span className={`font-bold block mb-1 text-[18px] ${selectedType === type.id ? 'text-brand-700' : 'text-slate-900'}`}>
                        {type.label}
                      </span>
                      <span className="text-[16px] text-slate-500 leading-relaxed">
                        {type.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "SPACE_TYPE" && (
            <motion.div
              key="space_type"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col items-center justify-center px-5 py-8 md:p-10"
            >
              <div className="max-w-2xl w-full">
                <h1 className="text-2xl md:text-3xl font-display font-[500] text-slate-900 mb-10 ">
                  What type of place will guests have?
                </h1>
                <div className="space-y-3">
                  {spaceTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedSpaceType(type.id)}
                      className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left ${
                        selectedSpaceType === type.id
                          ? "border-brand-500 bg-brand-50/50 ring-2 ring-brand-50"
                          : "border-slate-100 hover:border-brand-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex-1 pr-4">
                        <h3 className={`text-[20px] font-bold mb-1 ${selectedSpaceType === type.id ? 'text-brand-700' : 'text-slate-900'}`}>
                          {type.label}
                        </h3>
                        <p className="text-lg text-slate-500 leading-relaxed">{type.description}</p>
                      </div>
                      <i className={`ph-bold ${type.icon} text-2xl ${selectedSpaceType === type.id ? 'text-brand-600' : 'text-slate-400'}`}></i>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "SERVICE_TYPE" && (
            <motion.div
              key="service_type"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col items-center px-5 py-8 md:p-10 overflow-y-auto"
            >
              <div className="max-w-3xl w-full">
                <h1 className="text-2xl md:text-3xl font-display font-[500] text-slate-900 mb-10">
                  What kind of service do you provide?
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serviceTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedServiceType(type.id)}
                      className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all text-left ${
                        selectedServiceType === type.id
                          ? "border-brand-500 bg-brand-50/50 ring-2 ring-brand-50"
                          : "border-slate-100 hover:border-brand-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedServiceType === type.id ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <i className={`ph-bold ${type.icon} text-2xl`}></i>
                      </div>
                      <div>
                        <span className={`font-bold block mb-1 text-lg ${selectedServiceType === type.id ? 'text-brand-700' : 'text-slate-900'}`}>
                          {type.label}
                        </span>
                        <span className="text-sm text-slate-500 leading-relaxed">
                          {type.description}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "SERVICE_COVERAGE" && (
            <motion.div
              key="service_coverage"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col items-center justify-center px-5 py-8 md:p-10"
            >
              <div className="max-w-2xl w-full">
                <h1 className="text-2xl md:text-3xl font-display font-[500] text-slate-900 mb-6">
                  Where do you operate?
                </h1>
                <p className="text-slate-500 mb-10">Select all areas where you can provide this service.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {nigerianStates.slice(0, 12).map((state) => (
                    <button
                      key={state}
                      onClick={() => {
                        setServiceCoverage(prev => 
                          prev.includes(state) ? prev.filter(s => s !== state) : [...prev, state]
                        );
                      }}
                      className={`p-4 rounded-xl border-2 transition-all font-bold text-center ${
                        serviceCoverage.includes(state)
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-slate-100 text-slate-600 hover:border-slate-200"
                      }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "SERVICE_DETAILS" && (
            <motion.div
              key="service_details"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col items-center justify-center p-8 md:p-10"
            >
              <div className="max-w-xl w-full">
                <h1 className="text-2xl md:text-3xl font-display font-[500] text-slate-900 mb-8">
                  Describe your service
                </h1>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Service Title</label>
                    <input 
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Professional Move-in Cleaning"
                      className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-brand-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Service Description</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Explain what's included in your service..."
                      className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl min-h-[160px] font-medium text-slate-700 outline-none focus:border-brand-500 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "EXPERIENCE_TYPE" && (
            <motion.div
              key="experience_type"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col items-center px-5 py-8 md:p-10 overflow-y-auto"
            >
              <div className="max-w-3xl w-full">
                <h1 className="text-2xl md:text-3xl font-display font-[500] text-slate-900 mb-10">
                  What kind of experience is it?
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {experienceTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedExperienceType(type.id)}
                      className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all text-left ${
                        selectedExperienceType === type.id
                          ? "border-brand-500 bg-brand-50/50 ring-2 ring-brand-50"
                          : "border-slate-100 hover:border-brand-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedExperienceType === type.id ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <i className={`ph-bold ${type.icon} text-2xl`}></i>
                      </div>
                      <div>
                        <span className={`font-bold block mb-1 text-lg ${selectedExperienceType === type.id ? 'text-rose-700' : 'text-slate-900'}`}>
                          {type.label}
                        </span>
                        <span className="text-sm text-slate-500 leading-relaxed">
                          {type.description}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "EXPERIENCE_DETAILS" && (
            <motion.div
              key="experience_details"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col items-center justify-center p-8 md:p-10"
            >
              <div className="max-w-xl w-full">
                <h1 className="text-2xl md:text-3xl font-display font-[500] text-slate-900 mb-8">
                  Experience details
                </h1>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Title</label>
                    <input 
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Lagos Island Street Food Tour"
                      className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-brand-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Description</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what guests will do, see, and eat..."
                      className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl min-h-[160px] font-medium text-slate-700 outline-none focus:border-brand-500 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "EXPERIENCE_CAPACITY" && (
            <motion.div
              key="experience_capacity"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 overflow-y-auto"
            >
              <div className="max-w-xl w-full">
                <h1 className="text-2xl md:text-3xl font-display font-[600] text-slate-900 mb-12">
                  Group Size
                </h1>
                
                <div className="flex items-center justify-between p-8 bg-slate-50 rounded-3xl border-2 border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-slate-900">Maximum guests</span>
                    <span className="text-slate-500">How many people can join at once?</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => setExperienceCapacity(Math.max(1, experienceCapacity - 1))}
                      className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-brand-500 hover:text-brand-500 transition-all"
                    >
                      <i className="ph-bold ph-minus"></i>
                    </button>
                    <span className="w-8 text-center font-bold text-2xl text-slate-900">{experienceCapacity}</span>
                    <button 
                      onClick={() => setExperienceCapacity(experienceCapacity + 1)}
                      className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-brand-500 hover:text-brand-500 transition-all"
                    >
                      <i className="ph-bold ph-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "BASICS" && (
            <motion.div
              key="basics"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col items-center p-8 md:p-12 overflow-y-auto"
            >
              <div className="max-w-xl w-full">
                <h1 className="text-2xl md:text-3xl font-display font-[600] text-slate-900 mb-12">
                  Let's start with the basics
                </h1>
                
                <div className="space-y-8">
                  <div className="flex items-center justify-between pb-8 border-b border-slate-100">
                    <span className="text-lg font-medium text-slate-700">Guests</span>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setBasics({...basics, guests: Math.max(1, basics.guests - 1)})}
                        className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all"
                      >
                        <i className="ph-bold ph-minus text-xs"></i>
                      </button>
                      <span className="w-6 text-center font-bold text-slate-900 text-sm">{basics.guests}</span>
                      <button 
                        onClick={() => setBasics({...basics, guests: basics.guests + 1})}
                        className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all"
                      >
                        <i className="ph-bold ph-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pb-8 border-b border-slate-100">
                    <span className="text-lg font-medium text-slate-700">Bedrooms</span>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setBasics({...basics, bedrooms: Math.max(0, basics.bedrooms - 1)})}
                        className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all"
                      >
                        <i className="ph-bold ph-minus text-xs"></i>
                      </button>
                      <span className="w-6 text-center font-bold text-slate-900 text-sm">{basics.bedrooms}</span>
                      <button 
                        onClick={() => setBasics({...basics, bedrooms: basics.bedrooms + 1})}
                        className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all"
                      >
                        <i className="ph-bold ph-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pb-8 border-b border-slate-100">
                    <span className="text-lg font-medium text-slate-700">Beds</span>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setBasics({...basics, beds: Math.max(1, basics.beds - 1)})}
                        className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all"
                      >
                        <i className="ph-bold ph-minus text-xs"></i>
                      </button>
                      <span className="w-6 text-center font-bold text-slate-900 text-sm">{basics.beds}</span>
                      <button 
                        onClick={() => setBasics({...basics, beds: basics.beds + 1})}
                        className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all"
                      >
                        <i className="ph-bold ph-plus text-xs"></i>
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Does every bedroom have a lock?</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setBasics({...basics, hasLock: true})}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          basics.hasLock === true ? "border-brand-500 bg-brand-50" : "border-slate-100 hover:border-slate-200"
                        }`}
                      >
                        <span className="font-bold text-slate-700 text-sm">Yes</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${basics.hasLock === true ? "border-brand-500 bg-brand-500" : "border-slate-200"}`}>
                          {basics.hasLock === true && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                        </div>
                      </button>
                      <button 
                        onClick={() => setBasics({...basics, hasLock: false})}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          basics.hasLock === false ? "border-brand-500 bg-brand-50" : "border-slate-100 hover:border-slate-200"
                        }`}
                      >
                        <span className="font-bold text-slate-700 text-sm">No</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${basics.hasLock === false ? "border-brand-500 bg-brand-500" : "border-slate-200"}`}>
                          {basics.hasLock === false && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "STAND_OUT_INTRO" && (
            <motion.div
              key="stand_out_intro"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 grid grid-cols-1 lg:grid-cols-2 h-full"
            >
              <div className="flex flex-col justify-center px-8 md:px-20 py-10 space-y-5">
                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Step 2</span>
                <h1 className="text-2xl md:text-4xl font-display font-[600] text-slate-900 leading-tight">
                  Make your place stand out
                </h1>
                <p className="text-base text-slate-600 leading-relaxed max-w-lg">
                  In this step, you'll add some of the amenities your place offers, plus 5 or more photos. Then, you'll create a title and description.
                </p>
              </div>
              <div className="bg-white flex items-center justify-center p-10">
                <div className="w-full max-w-xl aspect-square relative bg-rose-50 rounded-[40px] flex items-center justify-center shadow-brutal border-2 border-slate-900">
                  <i className="ph-bold ph-sparkle text-[100px] text-rose-500"></i>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "AMENITIES" && (
            <motion.div
              key="amenities"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col items-center px-5 py-10 md:p-10 overflow-y-auto"
            >
              <div className="max-w-3xl w-full">
                <h1 className="text-2xl md:text-4xl font-display font-[600] text-slate-900 mb-2">
                  Tell guests what your place has to offer
                </h1>
                <p className="text-slate-500 mb-10">You can add more amenities after you publish your listing.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenities.map((amenity) => (
                    <button
                      key={amenity.id}
                      onClick={() => toggleAmenity(amenity.id)}
                      className={`flex flex-col p-5 rounded-2xl border-2 transition-all text-left h-full ${
                        selectedAmenities.includes(amenity.id)
                          ? "border-brand-500 bg-brand-50/50 ring-2 ring-brand-50"
                          : "border-slate-100 hover:border-brand-200 hover:bg-slate-50"
                      }`}
                    >
                      <i className={`ph-bold ${amenity.icon} text-3xl mb-3 ${selectedAmenities.includes(amenity.id) ? 'text-brand-600' : 'text-slate-700'}`}></i>
                      <span className={`font-bold block text-[18px] ${selectedAmenities.includes(amenity.id) ? 'text-brand-700' : 'text-slate-900'}`}>
                        {amenity.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "PHOTOS" && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col items-center p-8 md:p-10 overflow-y-auto"
            >
              <div className="max-w-4xl w-full">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl md:text-4xl font-display font-[600] text-slate-900">
                    Choose at least 5 photos
                  </h1>
                  <button 
                    onClick={addPhoto}
                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    <i className="ph-bold ph-plus text-xs"></i>
                  </button>
                </div>
                <p className="text-slate-500 mb-10">Drag to reorder</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {photos.length > 0 ? (
                    <>
                      {/* Main Cover Photo */}
                      <div className="md:col-span-2 aspect-[16/10] bg-slate-100 rounded-3xl overflow-hidden relative group border-2 border-slate-200">
                        <img src={photos[0]} className="w-full h-full object-cover" alt="Cover" />
                        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-md text-[9px] font-bold shadow-sm z-10">Cover Photo</div>
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => removePhoto(0)}
                            className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-red-500 hover:bg-red-50"
                          >
                            <i className="ph-bold ph-trash text-xs"></i>
                          </button>
                        </div>
                      </div>
                      {/* Secondary Photos */}
                      {photos.slice(1).map((photo, index) => (
                        <div key={index} className="aspect-square bg-slate-50 rounded-3xl overflow-hidden relative group border-2 border-slate-200">
                          <img src={photo} className="w-full h-full object-cover" alt={`Listing ${index + 1}`} />
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => removePhoto(index + 1)}
                              className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-red-500 hover:bg-red-50"
                            >
                              <i className="ph-bold ph-trash text-xs"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                      {/* Empty Placeholder for adding more */}
                      <div 
                        onClick={addPhoto}
                        className="aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative group cursor-pointer hover:border-brand-500 transition-all"
                      >
                        <i className="ph-bold ph-plus text-xl text-slate-300 group-hover:text-brand-500 transition-colors"></i>
                        <span className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-wider">Add more</span>
                      </div>
                    </>
                  ) : (
                    <div 
                      onClick={addPhoto}
                      className="md:col-span-2 aspect-[16/10] bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center relative group cursor-pointer hover:border-brand-500 transition-all"
                    >
                      <i className="ph-bold ph-image text-4xl text-slate-300 mb-3 group-hover:text-brand-500 transition-colors"></i>
                      <p className="text-sm font-bold text-slate-700">Upload your cover photo</p>
                      <p className="text-[11px] text-slate-400">Click or drag images here</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "TITLE" && (
            <motion.div
              key="title"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col items-center justify-center p-8 md:p-10"
            >
              <div className="max-w-xl w-full">
                <h1 className="text-2xl md:text-4xl font-display font-[600] text-slate-900 mb-2">
                  Now, let's give your {selectedType?.replace('_', ' ') || 'place'} a title
                </h1>
                <p className="text-slate-500 mb-10">Short titles work best. You can always change it later.</p>
                
                <div className="relative">
                  <textarea 
                    value={title}
                    onChange={(e) => setTitle(e.target.value.slice(0, 32))}
                    placeholder="e.g. Cozy Student Loft near UI"
                    className="w-full p-6 bg-white border-2 border-slate-200 rounded-[24px] min-h-[140px] text-lg font-bold text-slate-700 outline-none focus:border-brand-500 transition-all resize-none shadow-sm"
                  />
                  <div className="absolute bottom-5 left-6 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    {title.length}/32 characters
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "HIGHLIGHTS" && (
            <motion.div
              key="highlights"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col items-center justify-center p-8 md:p-10"
            >
              <div className="max-w-2xl w-full">
                <h1 className="text-2xl md:text-4xl font-display font-[600] text-slate-900 mb-2 text-center">
                  Next, let's describe your {selectedType?.replace('_', ' ') || 'place'}
                </h1>
                <p className="text-slate-500 mb-10 text-center">Choose up to 2 highlights. We'll use these to get your description started.</p>
                
                <div className="flex flex-wrap justify-center gap-2.5">
                  {highlights.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => toggleHighlight(h.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all font-bold text-base ${
                        selectedHighlights.includes(h.id)
                          ? " bg-brand-600 text-white hover:shadow-brutal-sm"
                          : "border-slate-200  text-slate-600 hover:border-brand-600"
                      }`}
                    >
                      <i className={`ph-bold ${h.icon} text-base`}></i>
                      <span>{h.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "DESCRIPTION" && (
            <motion.div
              key="description"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col items-center justify-center p-8 md:p-10"
            >
              <div className="max-w-xl w-full">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl md:text-4xl font-display font-[600] text-slate-900">
                    Create your description
                  </h1>
                  
                </div>
                <p className="text-slate-500 mb-10">Share what makes your place special.</p>
                
                <div className="relative">
                  <button 
                    onClick={generateAIDescription}
                    disabled={isGeneratingAI}
                    className={`flex absolute bottom-4 right-4 items-center gap-2 px-3 py-1.5 rounded-full border-2 border-brand-500 text-brand-600 font-bold text-[10px] transition-all hover:bg-brand-50 ${isGeneratingAI ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <i className={`ph-bold ${isGeneratingAI ? 'ph-spinner animate-spin' : 'ph-sparkle'}`}></i>
                    {isGeneratingAI ? 'Generating...' : 'Generate with AI'}
                  </button>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                    placeholder="Write something fun and punchy..."
                    className="w-full p-6 bg-white border-2 border-slate-200 rounded-[24px] min-h-[260px] text-base text-slate-700 outline-none focus:border-brand-500 transition-all resize-none shadow-sm"
                  />
                  <div className="absolute bottom-5 left-6 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    {description.length}/500 characters
                  </div>
                </div>
                {selectedHighlights.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider w-full mb-1">Using highlights:</span>
                    {selectedHighlights.map(h => (
                      <div key={h} className="px-2.5 py-1 bg-slate-100 rounded-full text-[16px] font-bold text-slate-600 flex items-center gap-1">
                        <i className="ph-fill ph-check-circle text-brand-500"></i>
                        {h}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === "FINISH_INTRO" && (
            <motion.div
              key="finish_intro"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 grid grid-cols-1 lg:grid-cols-2 h-full"
            >
              <div className="flex flex-col justify-center px-8 md:px-20 py-10 space-y-5">
                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Step 3</span>
                <h1 className="text-2xl md:text-4xl font-display font-[600] text-slate-900 leading-tight">
                  Finish up and publish
                </h1>
                <p className="text-base text-slate-600 leading-relaxed max-w-lg">
                  Finally, you'll choose booking settings, set up pricing, and publish your listing.
                </p>
              </div>
              <div className="bg-white flex items-center justify-center p-10">
                <div className="w-full max-w-xl aspect-square relative bg-amber-50 rounded-[40px] flex items-center justify-center shadow-brutal border-2 border-slate-900">
                  <i className="ph-bold ph-check-circle text-[100px] text-amber-500"></i>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "PRICING" && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col items-center p-8 md:p-10 overflow-y-auto"
            >
              <div className="max-w-xl w-full">
                <h1 className="text-2xl md:text-4xl font-display font-[600] text-slate-900 mb-2">
                  Set your base price and charges
                </h1>
                <p className="text-slate-500 mb-10">Configure how much guests will pay and how often.</p>
                
                <div className="space-y-6">
                  {/* Base Price */}
                  <div className="p-5 bg-white border-2 border-slate-100 rounded-[20px] shadow-sm">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Base Price</label>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl md:text-4xl font-display font-bold text-slate-900">₦</span>
                      <input 
                        type="number" 
                        value={price}
                        onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                        className="w-full text-3xl md:text-4xl font-display font-bold text-slate-900 outline-none border-none bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Payment Frequency */}
                  <div>
                    <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Payment Frequency</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["MONTHLY", "QUARTERLY", "YEARLY"] as const).map((freq) => (
                        <button
                          key={freq}
                          onClick={() => setPaymentFrequency(freq)}
                          className={`py-2.5 rounded-xl font-bold text-base transition-all border-2 ${
                            paymentFrequency === freq
                              ? "border-brand-500 bg-brand-50 text-brand-700 shadow-brutal-sm"
                              : "border-slate-100 text-slate-500 hover:border-slate-200"
                          }`}
                        >
                          {freq.charAt(0) + freq.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Additional Charges */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-slate-50 rounded-[20px] border border-slate-100">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Security Deposit</label>
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
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Other Charges</label>
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
                      <span className="text-slate-500 text-base">Total per {paymentFrequency.toLowerCase()}</span>
                      <span className="text-xl font-bold text-slate-900">₦{(price + securityCharge + otherCharges).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-400">Includes security deposit and other additional fees.</p>
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
          )}

          {currentStep === "DISCOUNTS" && (
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
          )}

          {currentStep === "SAFETY" && (
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
          )}

          {currentStep === "CONGRATS" && (
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
          )}
        </AnimatePresence>
      </main>
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
  );
}
