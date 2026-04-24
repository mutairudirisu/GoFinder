"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import confetti from "canvas-confetti";
import { Listing } from "@/types/listing";
import { LocationPickerMap } from "@/components/listings/LocationPickerMap";

type Step = 
  | "CATEGORY" 
  | "INTRO" 
  | "TELL_US" 
  | "TYPE" 
  | "SPACE_TYPE"
  | "LOCATION_SEARCH"
  | "ADDRESS"
  | "LOCATION_CONFIRM"
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
  | "CONGRATS";

export default function BecomingAHostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isUserFullyVerified =
    (user?.verifications?.email?.status ?? "UNVERIFIED") === "VERIFIED" &&
    (user?.verifications?.phone?.status ?? "UNVERIFIED") === "VERIFIED" &&
    (user?.verifications?.id?.status ?? "UNVERIFIED") === "VERIFIED";
  const [currentStep, setCurrentStep] = useState<Step>("CATEGORY");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSpaceType, setSelectedSpaceType] = useState<string | null>(null);
  
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
            type: selectedType || "house",
            spaceType: selectedSpaceType || "entire_place",
            host: {
              id: user?.id,
              name: user?.name || user?.email?.split("@")[0] || "Host",
              email: user?.email,
              phone: user?.phone,
              avatar: user?.avatar,
            },
            address,
            basics,
            amenities: selectedAmenities,
            photos,
            title,
            highlights: selectedHighlights,
            description,
            price,
            securityCharge,
            otherCharges,
            paymentFrequency,
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
  }, [currentStep, isPublished]);

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

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLocating, setIsLocating] = useState(false);

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setAddress(prev => ({ ...prev, latitude, longitude }));
          setIsLocating(false);
          // Automatically move to next step or update map
          setCurrentStep("ADDRESS");
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
          alert("Could not get your location. Please enter it manually.");
        }
      );
    } else {
      setIsLocating(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            searchQuery
          )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&limit=5&proximity=${address.longitude},${address.latitude}`
        );
        const data = await response.json();
        setSuggestions(data.features || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelectSuggestion = (suggestion: any) => {
    const [lng, lat] = suggestion.center;
    const placeName = suggestion.place_name;
    
    // Parse the place name to fill address fields
    const context = suggestion.context || [];
    const street = suggestion.text || "";
    const city = context.find((c: any) => c.id.startsWith('place'))?.text || "";
    const province = context.find((c: any) => c.id.startsWith('region'))?.text || "";
    const country = context.find((c: any) => c.id.startsWith('country'))?.text || "Nigeria";
    const postalCode = context.find((c: any) => c.id.startsWith('postcode'))?.text || "";

    setAddress(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      street: street,
      city: city,
      province: province,
      postalCode: postalCode,
      country: country === "Nigeria" ? "Nigeria - NG" : country
    }));
    
    setSuggestions([]);
    setSearchQuery(placeName);
    setCurrentStep("ADDRESS");
  };

  const handleSearchAddress = async (query: string) => {
    if (!query) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&limit=1`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        handleSelectSuggestion(data.features[0]);
      }
    } catch (error) {
      console.error("Error searching address:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Basics state
  const [basics, setBasics] = useState({
    guests: 2,
    bedrooms: 1,
    beds: 1,
    hasLock: null as boolean | null
  });

  // Address state
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

  const stepsOrder: Step[] = [
    "CATEGORY", 
    "INTRO", 
    "TELL_US", 
    "TYPE", 
    "SPACE_TYPE",
    "LOCATION_SEARCH",
    "ADDRESS",
    "LOCATION_CONFIRM",
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

  const isAddressValid = 
    address.street.length > 0 && 
    address.city.length > 0 && 
    address.province.length > 0 && 
    address.country.length > 0;

  const handleLocationChange = async (lat: number, lng: number) => {
    setAddress(prev => ({ ...prev, latitude: lat, longitude: lng }));
    
    // Reverse geocode if we are in the confirm step to keep address in sync
    if (currentStep === "LOCATION_CONFIRM") {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&limit=1`
        );
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const suggestion = data.features[0];
          const context = suggestion.context || [];
          const street = suggestion.text || "";
          const city = context.find((c: any) => c.id.startsWith('place'))?.text || "";
          const province = context.find((c: any) => c.id.startsWith('region'))?.text || "";
          const postalCode = context.find((c: any) => c.id.startsWith('postcode'))?.text || "";

          setAddress(prev => ({
            ...prev,
            street: street || prev.street,
            city: city || prev.city,
            province: province || prev.province,
            postalCode: postalCode || prev.postalCode,
          }));
        }
      } catch (error) {
        console.error("Error reverse geocoding:", error);
      }
    }
  };

  const handleNext = () => {
    const currentIndex = stepsOrder.indexOf(currentStep);
    if (currentIndex < stepsOrder.length - 1) {
      const nextStep = stepsOrder[currentIndex + 1];
      if (nextStep) setCurrentStep(nextStep);
    } else {
      // Final submission logic here
      router.push("/hosting/listings");
    }
  };

  const handleBack = () => {
    const currentIndex = stepsOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      const prevStep = stepsOrder[currentIndex - 1];
      if (prevStep) setCurrentStep(prevStep);
    }
  };

  const getProgress = () => {
    const currentIndex = stepsOrder.indexOf(currentStep);
    // Exclude Category and Congrats from progress bar logic
    if (currentStep === "CATEGORY" || currentStep === "CONGRATS") return 0;
    return ((currentIndex) / (stepsOrder.length - 2)) * 100;
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="h-20 px-6 md:px-12 flex flex-col justify-center sticky top-0 bg-white z-50">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2 hidden md:inline-flex">
            <div className="w-8 h-8 bg-brand-500 rounded-lg border-2 border-brand-dark flex items-center justify-center shadow-brutal-sm">
              <i className="ph-bold ph-house-line text-white"></i>
            </div>
            <span className="font-display font-bold text-xl text-brand-dark hidden sm:inline-block">GIGS</span>
          </Link>
          <div className="flex justify-between md:justify-end gap-4 w-full">
            <button className="px-5 py-2.5 text-base font-bold border border-slate-200 rounded-full hover:bg-slate-50 transition-all flex items-center gap-2">
              Questions?
            </button>
            <button 
              onClick={() => router.push("/hosting")}
              className="px-5 py-2.5 text-base font-bold border border-slate-200 rounded-full hover:bg-slate-50 transition-all"
            >
              Save & exit
            </button>
          </div>
        </div>
        {/* Progressive Bar below header */}
        {currentStep !== "CATEGORY" && currentStep !== "CONGRATS" && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
            <motion.div 
              className="h-full bg-slate-900"
              initial={{ width: "0%" }}
              animate={{ width: `${getProgress()}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          {currentStep === "CATEGORY" && (
            <motion.div
              key="category"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <div className="w-full md:max-w-4xl rounded-t-[32px] md:rounded-[32px] border border-slate-200 shadow-t-2xl p-8 md:p-12 ">
                <h1 className="text-2xl md:text-3xl font-display font-medium text-text-slate-900 text-center mb-10">
                  What would you like to host?
                </h1>
                {/* Close Button matching the first image */}
                {/* <button 
                  onClick={() => router.push("/hosting")}
                  className="absolute top-6 right-6 md:top-8 md:right-8 p-2 hover:bg-slate-50 rounded-full transition-colors z-10"
                >
                  <i className="ph-bold ph-x text-xl text-slate-900"></i>
                </button> */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:py-6">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
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
                <div className="mt-10 flex justify-end">
                  <button
                    disabled={!selectedCategory}
                    onClick={handleNext}
                    className={`w-full md:w-[120px] px-8 py-4 rounded-xl font-bold text-base transition-all shadow-brutal ${
                      selectedCategory
                        ? "bg-brand-500 text-white hover:bg-brand-600"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    Next
                  </button>
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
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Tell us about your place</h2>
                    <p className="text-slate-500 leading-relaxed text-[16px]">Share some basic info, like where it is and how many guests can stay.</p>
                  </div>
                  <div className="w-16 h-16 flex-shrink-0 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <i className="ph-bold ph-house-line text-2xl text-blue-500"></i>
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
              className="flex-1 grid grid-cols-1 lg:grid-cols-2 h-full"
            >
              <div className="flex flex-col justify-center px-5 md:px-20 py-10 space-y-5">
                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Step 1</span>
                <h1 className="text-2xl md:text-4xl font-display font-[500] text-slate-900 leading-tight">
                  Tell us about your place
                </h1>
                <p className="text-[18px] text-slate-600 leading-relaxed max-w-lg">
                  In this step, we'll ask you which type of property you have and if guests will book the entire place or just a room. Then let us know the location and how many guests can stay.
                </p>
              </div>
              <div className="bg-white flex items-center justify-center p-10">
                <div className="w-full md:max-w-lg aspect-square relative bg-blue-50 rounded-[40px] flex items-center justify-center shadow-brutal border-2 border-slate-900">
                  <i className="ph-bold ph-house-line text-[100px] text-blue-500"></i>
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

          {currentStep === "LOCATION_SEARCH" && (
            <motion.div
              key="location_search"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col mx-auto overflow-y-auto pb-10"
            >
              <div className="px-6 md:px-12 py-10 bg-white flex-shrink-0">
                <div className="max-w-2xl">
                  <h1 className="text-2xl md:text-4xl font-display font-[500] text-slate-900 mb-4">
                    Where's your place located?
                  </h1>
                  <p className="text-slate-600 text-lg">
                    Your address is only shared with guests after they've made a reservation.
                  </p>
                </div>
              </div>

              <div className="flex-1 relative min-h-[400px] h-full">
                <LocationPickerMap 
                  latitude={address.latitude}
                  longitude={address.longitude}
                  onLocationChange={handleLocationChange}
                  showSpecificLocation={false}
                  interactive={true}
                />
                
                {/* Floating Search Area */}
                <div className="absolute top-10 left-6 right-6 md:left-12 md:right-auto md:w-[480px] space-y-6">
                  {/* Search Bar - Airbnb Style (Image 2) */}
                  <div className="bg-white rounded-full shadow-2xl border-2 border-transparent p-1.5 flex items-center gap-3 transition-all ring-2 ring-slate-200 focus-within:ring-4 focus-within:ring-brand-500/20 focus-within:border-brand-500">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center">
                      <i className={`ph-bold ${isSearching ? "ph-spinner animate-spin" : "ph-map-pin"} text-slate-900 text-xl`}></i>
                    </div>
                    <input 
                      type="text"
                      placeholder="Enter your address"
                      className="flex-1 bg-transparent outline-none font-medium text-slate-900 placeholder:text-slate-500 text-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearchAddress(searchQuery);
                        }
                      }}
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => {
                          setSearchQuery("");
                          setSuggestions([]);
                        }}
                        className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 mr-1"
                      >
                        <i className="ph-bold ph-x"></i>
                      </button>
                    )}
                  </div>

                  {/* Search Suggestions Dropdown */}
                  <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden overflow-y-auto"
                      >
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={suggestion.id}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className={`w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-all text-left ${
                              index !== suggestions.length - 1 ? "border-b border-slate-100" : ""
                            }`}
                          >
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                              <i className="ph-bold ph-map-pin text-slate-900"></i>
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-base leading-tight">
                                {suggestion.text}
                              </p>
                              <p className="text-slate-500 text-sm">
                                {suggestion.place_name.split(', ').slice(1).join(', ')}
                              </p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Use Current Location Button (Image 2) */}
                  <button 
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className="w-full bg-white rounded-full shadow-lg border border-slate-200 p-4 flex items-center gap-4 hover:bg-slate-50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
                      <i className={`ph-bold ${isLocating ? "ph-spinner animate-spin" : "ph-navigation-arrow"} text-brand-600 text-xl`}></i>
                    </div>
                    <span className="font-bold text-slate-900 text-lg">Use my current location</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "ADDRESS" && (
            <motion.div
              key="address"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col items-center px-5 py-8 md:p-12 overflow-y-auto bg-white"
            >
              <div className="max-w-2xl w-full">
                <div className="items-center gap-4 mb-8">
                  <button 
                    onClick={handleBack}
                    className="w-10 h-10 mb-4 bg-slate-100 rounded-full hover:bg-brand-100 flex items-center justify-center transition-colors"
                  >
                    <i className="ph ph-arrow-left text-xl "></i>
                  </button>
                  <h1 className="text-2xl font-display font-[600] text-slate-900">
                    Confirm your address
                  </h1>
                </div>
                
                <div className="space-y-0 border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b-2 border-slate-200 bg-white group hover:bg-slate-50 transition-colors">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Country / region</label>
                    <select 
                      className="w-full text-slate-900 outline-none bg-transparent font-medium cursor-pointer appearance-none text-lg"
                      value={address.country}
                      onChange={(e) => setAddress({...address, country: e.target.value})}
                    >
                      <option value="Nigeria - NG">Nigeria</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>
                  
                  <div className="p-4 border-b-2 border-slate-200 bg-white">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Street address</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 1226 University Drive" 
                      className="w-full text-slate-900 outline-none placeholder:text-slate-300 font-medium text-lg"
                      value={address.street}
                      onChange={(e) => setAddress({...address, street: e.target.value})}
                    />
                  </div>
                  
                  <div className="p-4 border-b-2 border-slate-200 bg-white">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Apt, suite, unit (if applicable)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Apt 4B" 
                      className="w-full text-slate-900 outline-none placeholder:text-slate-300 font-medium text-lg"
                      value={address.unit}
                      onChange={(e) => setAddress({...address, unit: e.target.value})}
                    />
                  </div>
                  
                  <div className="p-4 border-b-2 border-slate-200 bg-white">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">City / town</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Lagos" 
                      className="w-full text-slate-900 outline-none placeholder:text-slate-300 font-medium text-lg"
                      value={address.city}
                      onChange={(e) => setAddress({...address, city: e.target.value})}
                    />
                  </div>
                  
                  <div className="p-4 border-b-2 border-slate-200 bg-white">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">State / territory</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Lagos State" 
                      className="w-full text-slate-900 outline-none placeholder:text-slate-300 font-medium text-lg"
                      value={address.province}
                      onChange={(e) => setAddress({...address, province: e.target.value})}
                    />
                  </div>
                  
                  <div className="p-4 bg-white">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">ZIP code</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 100001" 
                      className="w-full text-slate-900 outline-none placeholder:text-slate-300 font-medium text-lg"
                      value={address.postalCode}
                      onChange={(e) => setAddress({...address, postalCode: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <button 
                    onClick={handleNext}
                    disabled={!isAddressValid}
                    className="w-full bg-brand-500 text-white font-bold py-4 rounded-xl hover:bg-brand-600 transition-all disabled:bg-slate-200 disabled:text-slate-400 shadow-brutal active:scale-[0.98]"
                  >
                    Looks good
                  </button>
                </div>

                <hr className="my-10 border-slate-100" />

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Show your specific location</h3>

                      <button 
                    onClick={() => setShowSpecificLocation(!showSpecificLocation)}
                    className={`w-14 h-8 rounded-full relative transition-all duration-300 ${showSpecificLocation ? "bg-slate-900" : "bg-slate-200"}`}
                  >
                    <motion.div 
                      animate={{ x: showSpecificLocation ? 26 : 4 }}
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                    />
                  </button>
                    </div>
                    <p className="text-slate-500 text-base max-w-md leading-relaxed">
                      Make it clear to guests where your place is located. We'll only share your address after they've made a reservation. <button className="text-slate-900 font-bold underline">Learn more</button>
                    </p>
                  </div>
                  
                </div>

                <div className="relative w-full aspect-[2/1] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group">
                  <LocationPickerMap 
                    latitude={address.latitude}
                    longitude={address.longitude}
                    onLocationChange={handleLocationChange}
                    showSpecificLocation={showSpecificLocation}
                    interactive={false}
                  />
                  {!showSpecificLocation && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-white px-6 py-3 rounded-full shadow-xl border border-slate-100 font-bold text-slate-900 text-sm">
                        We'll share your approximate location.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "LOCATION_CONFIRM" && (
            <motion.div
              key="location_confirm"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col mx-auto"
            >
              <div className="px-6 md:px-12 py-10 bg-white flex-shrink-0">
                <div className="max-w-2xl">
                  <h1 className="text-2xl md:text-4xl font-display font-[600] text-slate-900 mb-4">
                    Is the pin in the right spot?
                  </h1>
                  <p className="text-slate-600 text-lg">
                    Your address is only shared with guests after they've made a reservation.
                  </p>
                </div>
              </div>

              <div className="flex-1 relative min-h-[400px] h-full">
                <LocationPickerMap 
                  latitude={address.latitude}
                  longitude={address.longitude}
                  onLocationChange={handleLocationChange}
                  showSpecificLocation={true}
                  interactive={true}
                />
                
                {/* Floating Address Box (Image 5) */}
                <div className="absolute top-10 left-6 right-6 md:left-12 md:right-auto md:w-[480px]">
                  <div className="bg-white rounded-[24px] shadow-2xl border border-slate-200 p-6 flex items-start gap-4 transition-all hover:border-brand-300">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <i className="ph-bold ph-map-pin text-slate-900 text-xl"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-lg leading-tight">
                        {address.street}{address.unit ? `, ${address.unit}` : ""}, {address.city}, {address.province} {address.postalCode}, {address.country.split(' - ')[0]}
                      </p>
                    </div>
                    <button 
                      onClick={() => setCurrentStep("ADDRESS")}
                      className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                    >
                      <i className="ph-bold ph-pencil-simple text-slate-600"></i>
                    </button>
                  </div>
                </div>

                {/* Animated Tooltip (Image 5) */}
                <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-slate-900 text-white px-6 py-4 rounded-3xl text-base font-bold shadow-2xl flex items-center gap-3 pointer-events-auto"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <i className="ph-bold ph-hand-grabbing animate-pulse"></i>
                    </div>
                    Drag the map to reposition the pin
                  </motion.div>
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
                        <img src={photos[0]} className="w-full h-full object-cover" />
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
                          <img src={photo} className="w-full h-full object-cover" />
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

      {/* Footer */}
      {currentStep !== "CATEGORY" && currentStep !== "CONGRATS" && (
        <footer className="h-24 bg-white border-t border-slate-100 flex items-center justify-between px-6 md:px-12 sticky bottom-0 z-50">
          <button
            onClick={handleBack}
            className="text-[16px] font-bold text-slate-900 underline decoration-2 underline-offset-8 hover:text-brand-600 transition-colors"
          >
            Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={
              (currentStep === "TYPE" && !selectedType) || 
              (currentStep === "SPACE_TYPE" && !selectedSpaceType) ||
              (currentStep === "BASICS" && basics.hasLock === null) ||
              (currentStep === "AMENITIES" && selectedAmenities.length === 0) ||
              (currentStep === "TITLE" && title.length < 5) ||
              (currentStep === "HIGHLIGHTS" && selectedHighlights.length === 0) ||
              (currentStep === "DESCRIPTION" && description.length < 10) ||
              (currentStep === "LOCATION_SEARCH" && !address.street && !searchQuery)
            }
            className={`px-8 py-2 rounded-xl font-bold text-lg transition-all shadow-brutal ${
              // Special case: ADDRESS step has its own "Looks good" button in the form
              currentStep === "ADDRESS" ? "hidden" : ""
            } ${
              ((currentStep === "TYPE" && !selectedType) || 
               (currentStep === "SPACE_TYPE" && !selectedSpaceType) || 
               (currentStep === "BASICS" && basics.hasLock === null) || 
               (currentStep === "AMENITIES" && selectedAmenities.length === 0) || 
               (currentStep === "TITLE" && title.length < 5) || 
               (currentStep === "HIGHLIGHTS" && selectedHighlights.length === 0) || 
               (currentStep === "DESCRIPTION" && description.length < 10) ||
               (currentStep === "LOCATION_SEARCH" && !address.street && !searchQuery))
                ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                : "bg-brand-500 text-white hover:bg-brand-600 hover:shadow-none"
            }`}
          >
            {currentStep === "SAFETY" ? "Create listing" : 
             currentStep === "PRICING" ? "Publish Listing" : 
             currentStep === "LOCATION_SEARCH" ? "Next" : "Next"}
          </button>
        </footer>
      )}
    </div>
  );
}
