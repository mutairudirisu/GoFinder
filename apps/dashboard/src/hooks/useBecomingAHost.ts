"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import confetti from "canvas-confetti";
import { Listing } from "@/types/listing";

export type Step = 
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
  | "SERVICE_TYPE"
  | "SERVICE_DETAILS"
  | "SERVICE_COVERAGE"
  | "EXPERIENCE_TYPE"
  | "EXPERIENCE_DETAILS"
  | "EXPERIENCE_CAPACITY";

export type StepGroup = {
  id: string;
  label: string;
  steps: Step[];
};

export const useBecomingAHost = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<Step>("CATEGORY");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSpaceType, setSelectedSpaceType] = useState<string | null>(null);
  
  // State for Services and Experiences
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
  const [serviceCoverage, setServiceCoverage] = useState<string[]>([]);
  const [serviceDescriptionFocus, setServiceDescriptionFocus] = useState<string[]>([]);
  const [selectedExperienceType, setSelectedExperienceType] = useState<string | null>(null);
  const [experienceDescriptionFocus, setExperienceDescriptionFocus] = useState<string[]>([]);
  const [experienceCapacity, setExperienceCapacity] = useState(10);
  
  // Photos state
  const [photos, setPhotos] = useState<string[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Listing Details
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
  const [studentHousing, setStudentHousing] = useState({
    forStudents: false,
    needsRoommate: false,
    roommateSlots: 1,
  });

  // Address state
  const [address, setAddress] = useState({
    country: "Nigeria - NG",
    houseNumber: "",
    street: "",
    city: "Lagos",
    province: "Lagos State",
    postalCode: "",
    landmark: "",
    latitude: 6.5244,
    longitude: 3.3792
  });

  // Initial Load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get("step") as Step | null;
    const catParam = params.get("category");
    
    if (stepParam) setCurrentStep(stepParam);
    if (catParam) setSelectedCategory(catParam);

    const savedAddress = localStorage.getItem("temp_listing_address");
    if (savedAddress) {
      setAddress(JSON.parse(savedAddress));
    }
  }, []);

  // Menu Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Photos Logic
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos: string[] = [];
    Array.from(files).forEach(file => {
      if (file.type.startsWith("image/")) {
        newPhotos.push(URL.createObjectURL(file));
      }
    });
    setSelectedFiles(prev => [...prev, ...newPhotos]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeSelectedFile = (index: number) => {
    const fileToRemove = selectedFiles[index];
    if (fileToRemove?.startsWith("blob:")) URL.revokeObjectURL(fileToRemove);
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    setPhotos(prev => [...prev, ...selectedFiles]);
    setSelectedFiles([]);
    setIsUploadModalOpen(false);
  };

  const removePhoto = (index: number) => {
    const photoToRemove = photos[index];
    if (photoToRemove?.startsWith("blob:")) URL.revokeObjectURL(photoToRemove);
    setPhotos(photos.filter((_, i) => i !== index));
    setActiveMenuIndex(null);
  };

  const makeCoverPhoto = (index: number) => {
    const newPhotos = [...photos];
    const item = newPhotos.splice(index, 1)[0];
    if (item) {
      newPhotos.unshift(item);
      setPhotos(newPhotos);
    }
    setActiveMenuIndex(null);
  };

  const movePhoto = (index: number, direction: 'forward' | 'backward') => {
    const newPhotos = [...photos];
    const newIndex = direction === 'forward' ? index + 1 : index - 1;
    if (newIndex >= 0 && newIndex < newPhotos.length) {
      const item = newPhotos.splice(index, 1)[0];
      if (item) {
        newPhotos.splice(newIndex, 0, item);
        setPhotos(newPhotos);
      }
    }
    setActiveMenuIndex(null);
  };

  useEffect(() => {
    return () => {
      photos.forEach(photo => {
        if (photo.startsWith("blob:")) URL.revokeObjectURL(photo);
      });
    };
  }, [photos]);

  const isUserFullyVerified =
    (user?.verifications?.email?.status ?? "UNVERIFIED") === "VERIFIED" &&
    (user?.verifications?.phone?.status ?? "UNVERIFIED") === "VERIFIED" &&
    (user?.verifications?.id?.status ?? "UNVERIFIED") === "VERIFIED";

  // Publishing Simulation
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
            studentHousing: selectedCategory === "home" ? studentHousing : undefined,
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
  }, [currentStep, isPublished, selectedCategory, selectedType, selectedServiceType, selectedExperienceType, selectedSpaceType, user, address, serviceCoverage, basics, experienceCapacity, selectedAmenities, photos, title, selectedHighlights, description, price, securityCharge, otherCharges, paymentFrequency, studentHousing, isUserFullyVerified]);

  const generateAIDescription = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      const highlightText = selectedHighlights.map(h => h.toLowerCase()).join(" and ");
      const typeText = selectedType?.replace("_", " ") || "place";
      let generated = `Welcome to our ${highlightText} ${typeText} in the heart of ${address.city}. This space is designed for comfort and style, perfect for those looking for a ${selectedHighlights[0] || "unique"} experience. Enjoy easy access to local amenities while staying in a ${selectedHighlights[1] || "peaceful"} environment. We can't wait to host you!`;

      if (selectedCategory === "service") {
        const serviceText = selectedServiceType?.replace(/_/g, " ") || "service";
        const serviceAreas = serviceCoverage.slice(0, 2).join(" and ") || address.city;
        const serviceFocus = serviceDescriptionFocus.length
          ? serviceDescriptionFocus.slice(0, 3).join(", ").toLowerCase()
          : "quality, speed, and peace of mind";
        generated = `I offer a reliable ${serviceText} service designed for clients who want ${serviceFocus}. I currently serve ${serviceAreas} and focus on clear communication, punctual delivery, and a professional finish. Every booking is handled with care so clients know exactly what to expect from start to finish.`;
      }

      if (selectedCategory === "experience") {
        const experienceText = selectedExperienceType?.replace(/_/g, " ") || "experience";
        const experienceFocus = experienceDescriptionFocus.length
          ? experienceDescriptionFocus.slice(0, 3).join(", ").toLowerCase()
          : "connection, learning, and memorable moments";
        generated = `Join a ${experienceText} experience built to give guests ${experienceFocus}. Guests can expect a well-organized session with clear guidance, a welcoming atmosphere, and local insight throughout the experience. It is ideal for travelers, friends, and small groups looking for something meaningful and easy to book.`;
      }

      setDescription(generated);
      setIsGeneratingAI(false);
    }, 1500);
  };

  const stepsOrder = useMemo((): Step[] => {
    const startFlow: Step[] = ["CATEGORY", "INTRO"];
    if (selectedCategory === "home") {
      return [...startFlow, "TYPE", "SPACE_TYPE", "BASICS", "AMENITIES", "PHOTOS", "TITLE", "HIGHLIGHTS", "DESCRIPTION", "PRICING", "DISCOUNTS", "SAFETY", "CONGRATS"];
    }
    if (selectedCategory === "service") {
      return [...startFlow, "SERVICE_TYPE", "SERVICE_COVERAGE", "SERVICE_DETAILS", "PHOTOS", "PRICING", "CONGRATS"];
    }
    if (selectedCategory === "experience") {
      return [...startFlow, "EXPERIENCE_TYPE", "EXPERIENCE_DETAILS", "EXPERIENCE_CAPACITY", "PHOTOS", "PRICING", "CONGRATS"];
    }
    return startFlow;
  }, [selectedCategory]);

  const stepGroups = useMemo((): StepGroup[] => {
    if (selectedCategory === "home") {
      return [
        { id: "overview", label: "Start", steps: ["INTRO"] },
        { id: "property", label: "Property", steps: ["TYPE", "SPACE_TYPE", "BASICS"] },
        { id: "features", label: "Features", steps: ["AMENITIES", "PHOTOS", "TITLE", "HIGHLIGHTS", "DESCRIPTION"] },
        { id: "finish", label: "Finish", steps: ["PRICING", "DISCOUNTS", "SAFETY"] },
      ];
    }
    if (selectedCategory === "service") {
      return [
        { id: "overview", label: "Overview", steps: ["INTRO"] },
        { id: "service", label: "Service", steps: ["SERVICE_TYPE", "SERVICE_COVERAGE", "SERVICE_DETAILS"] },
        { id: "media", label: "Media", steps: ["PHOTOS"] },
        { id: "pricing", label: "Pricing", steps: ["PRICING"] },
      ];
    }
    if (selectedCategory === "experience") {
      return [
        { id: "overview", label: "Overview", steps: ["INTRO"] },
        { id: "details", label: "Details", steps: ["EXPERIENCE_TYPE", "EXPERIENCE_DETAILS", "EXPERIENCE_CAPACITY"] },
        { id: "media", label: "Media", steps: ["PHOTOS"] },
        { id: "pricing", label: "Pricing", steps: ["PRICING"] },
      ];
    }
    return [{ id: "overview", label: "Overview", steps: ["INTRO"] }];
  }, [selectedCategory]);

  const currentGroupIndex = useMemo(() => {
    return stepGroups.findIndex((g) => g.steps.includes(currentStep));
  }, [currentStep, stepGroups]);

  const currentGroup = useMemo(() => {
    return currentGroupIndex >= 0 ? stepGroups[currentGroupIndex] : null;
  }, [currentGroupIndex, stepGroups]);

  const currentGroupStepIndex = useMemo(() => {
    if (!currentGroup) return -1;
    return currentGroup.steps.indexOf(currentStep);
  }, [currentGroup, currentStep]);

  const currentGroupProgress = useMemo(() => {
    if (!currentGroup || currentGroupStepIndex < 0) return 0;
    return (currentGroupStepIndex + 1) / currentGroup.steps.length;
  }, [currentGroup, currentGroupStepIndex]);

  const handleNext = () => {
    const currentIndex = stepsOrder.indexOf(currentStep);
    const nextStep = stepsOrder[currentIndex + 1];
    if (nextStep) setCurrentStep(nextStep);
    else router.push("/hosting/listings");
  };

  const handleBack = () => {
    if (currentStep === "INTRO") {
      router.push(`/becoming-a-host/address?category=${selectedCategory || 'home'}`);
      return;
    }
    const currentIndex = stepsOrder.indexOf(currentStep);
    const prevStep = stepsOrder[currentIndex - 1];
    if (prevStep) setCurrentStep(prevStep);
  };

  const toggleHighlight = (id: string) => {
    setSelectedHighlights(prev => prev.includes(id) ? prev.filter(h => h !== id) : prev.length < 2 ? [...prev, id] : prev);
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const toggleDiscount = (id: string) => {
    setSelectedDiscounts(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  const toggleServiceDescriptionFocus = (focus: string) => {
    setServiceDescriptionFocus((prev) =>
      prev.includes(focus) ? prev.filter((item) => item !== focus) : prev.length < 3 ? [...prev, focus] : prev
    );
  };

  const toggleExperienceDescriptionFocus = (focus: string) => {
    setExperienceDescriptionFocus((prev) =>
      prev.includes(focus) ? prev.filter((item) => item !== focus) : prev.length < 3 ? [...prev, focus] : prev
    );
  };

  const canContinue = useMemo(() => {
    const descriptionWordCount = description.trim() ? description.trim().split(/\s+/).length : 0;

    switch (currentStep) {
      case "CATEGORY": return !!selectedCategory;
      case "INTRO":
      case "TELL_US":
      case "STAND_OUT_INTRO":
      case "FINISH_INTRO":
      case "CONGRATS": return true;
      case "TYPE": return !!selectedType;
      case "SPACE_TYPE": return !!selectedSpaceType;
      case "SERVICE_TYPE": return !!selectedServiceType;
      case "SERVICE_COVERAGE": return serviceCoverage.length > 0;
      case "SERVICE_DETAILS": return title.length >= 5 && descriptionWordCount >= 10;
      case "EXPERIENCE_TYPE": return !!selectedExperienceType;
      case "EXPERIENCE_DETAILS": return title.length >= 5 && descriptionWordCount >= 10;
      case "EXPERIENCE_CAPACITY": return experienceCapacity > 0;
      case "BASICS": return basics.hasLock !== null;
      case "AMENITIES": return selectedAmenities.length > 0;
      case "PHOTOS": return photos.length >= 5;
      case "TITLE": return title.length >= 5 && title.length <= 32;
      case "HIGHLIGHTS": return selectedHighlights.length > 0;
      case "DESCRIPTION": return descriptionWordCount >= 10 && description.length <= 500;
      case "PRICING": return price > 0;
      case "DISCOUNTS":
      case "SAFETY": return true;
      default: return true;
    }
  }, [currentStep, selectedCategory, selectedType, selectedSpaceType, selectedServiceType, serviceCoverage, selectedExperienceType, experienceCapacity, title, description, basics, selectedAmenities, photos, selectedHighlights, price]);

  return {
    currentStep, setCurrentStep,
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
    handleFileChange,
    removeSelectedFile,
    handleUpload,
    removePhoto,
    makeCoverPhoto,
    movePhoto,
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
    address, setAddress,
    handleNext, handleBack,
    canContinue, stepsOrder,
    stepGroups,
    currentGroupIndex,
    currentGroupProgress,
    user
  };
};
