"use client";

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
  );
}
