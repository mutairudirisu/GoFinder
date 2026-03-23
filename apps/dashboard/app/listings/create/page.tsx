"use client";

import { useState, useRef, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

// Property types for Accommodation
const ACCOMMODATION_TYPES = [
  { id: "hostel", title: "Hostel", description: "Shared living space with multiple beds", icon: "ph-bed", color: "purple" },
  { id: "apartment", title: "Apartment", description: "Self-contained flat or unit", icon: "ph-buildings", color: "blue" },
  { id: "house", title: "House", description: "Detached or semi-detached property", icon: "ph-house-line", color: "green" },
  { id: "room", title: "Room", description: "Private room in a shared property", icon: "ph-door", color: "orange" },
];

// Property types for Experience
const EXPERIENCE_TYPES = [
  { id: "tour", title: "Tour", description: "Guided tours of cities or attractions", icon: "ph-map-trifold", color: "pink" },
  { id: "activity", title: "Activity", description: "Workshops, classes, or recreational activities", icon: "ph-person-simple-run", color: "orange" },
  { id: "event", title: "Event", description: "Social events, meetups, or gatherings", icon: "ph-calendar", color: "blue" },
];

// Property types for Services
const SERVICE_TYPES = [
  { id: "cleaning", title: "Cleaning", description: "Professional cleaning services", icon: "ph-broom", color: "teal" },
  { id: "transport", title: "Transport", description: "Transportation or delivery services", icon: "ph-car", color: "blue" },
  { id: "utilities", title: "Utilities", description: "Bill payment or utility management", icon: "ph-lightning", color: "amber" },
];

// Listing Categories
const LISTING_CATEGORIES = [
  { 
    id: "accommodation", 
    title: "Home / Apartment / Hostel", 
    description: "List your property for rent", 
    icon: "ph-house-line", 
    color: "blue",
    comingSoon: false
  },
  { 
    id: "experience", 
    title: "Share Experiences", 
    description: "Host tours, activities & events", 
    icon: "ph-map-trifold", 
    color: "pink",
    comingSoon: true
  },
  { 
    id: "services", 
    title: "Services", 
    description: "Offer cleaning, transport & more", 
    icon: "ph-wrench", 
    color: "teal",
    comingSoon: true
  },
];

// Listing steps - Category Selection is now Step 1 (Location removed - will be added later)
const ACCOMMODATION_STEPS = [
  { id: 1, title: "Category", icon: "ph-squares-four" },
  { id: 2, title: "Property Type", icon: "ph-building" },
  // { id: 3, title: "Location", icon: "ph-map-pin" }, // Removed - will add later
  { id: 3, title: "Details", icon: "ph-sliders" },
  { id: 4, title: "Amenities", icon: "ph-wrench" },
  { id: 5, title: "Photos", icon: "ph-camera" },
  { id: 6, title: "Pricing", icon: "ph-currency-dollar" },
  { id: 7, title: "Preview", icon: "ph-eye" },
];

// Listing steps for Experience/Services (also has category as step 1) (Location removed - will be added later)
const EXPERIENCE_SERVICE_STEPS = [
  { id: 1, title: "Category", icon: "ph-squares-four" },
  { id: 2, title: "Service Type", icon: "ph-tag" },
  // { id: 3, title: "Location", icon: "ph-map-pin" }, // Removed - will add later
  { id: 3, title: "Details", icon: "ph-sliders" },
  { id: 4, title: "Description", icon: "ph-text-aa" },
  { id: 5, title: "Photos", icon: "ph-camera" },
  { id: 6, title: "Pricing", icon: "ph-currency-dollar" },
  { id: 7, title: "Preview", icon: "ph-eye" },
];

const AMENITIES_LIST = [
  { id: "wifi", label: "WiFi", icon: "ph-wifi-high" },
  { id: "furnished", label: "Furnished", icon: "ph-bed" },
  { id: "ac", label: "Air Conditioning", icon: "ph-snowflake" },
  { id: "kitchen", label: "Kitchen", icon: "ph-cooking-pot" },
  { id: "laundry", label: "Laundry", icon: "ph-washing-machine" },
  { id: "parking", label: "Parking", icon: "ph-car" },
  { id: "security", label: "Security", icon: "ph-shield-check" },
  { id: "gym", label: "Gym", icon: "ph-barbell" },
  { id: "study-area", label: "Study Area", icon: "ph-books" },
  { id: "pool", label: "Pool", icon: "ph-swimming-pool" },
  { id: "rooftop", label: "Rooftop", icon: "ph-sun" },
  { id: "garden", label: "Garden", icon: "ph-tree" },
];

// Experience/Services amenities
const SERVICE_AMENITIES_LIST = [
  { id: "professional", label: "Professional Staff", icon: "ph-user" },
  { id: "verified", label: "Verified Provider", icon: "ph-seal-check" },
  { id: "online-booking", label: "Online Booking", icon: "ph-calendar-check" },
  { id: "home-service", label: "Home Service", icon: "ph-house-line" },
  { id: "delivery", label: "Delivery Available", icon: "ph-truck" },
  { id: "24-7", label: "24/7 Available", icon: "ph-clock" },
];

export default function CreateListingPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const router = useRouter();
  const params = use(searchParams);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, switchRole } = useAuth();
  
  // Get category from URL or default to accommodation
  const urlCategory = params?.category || 'accommodation';
  
  // State for selected category (for step 1)
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  
  // State for location error
  const [locationError, setLocationError] = useState<string | null>(null);
  
  // Use selected category for logic (after step 1)
  const category = selectedCategory || urlCategory;
  
  // Get the appropriate property types based on category
  const propertyTypes = category === 'experience' ? EXPERIENCE_TYPES : 
                        category === 'services' ? SERVICE_TYPES : 
                        ACCOMMODATION_TYPES;
  
  // Get the appropriate steps based on category
  const steps = category === 'accommodation' ? ACCOMMODATION_STEPS : EXPERIENCE_SERVICE_STEPS;
  
  // Get the appropriate amenities based on category
  const amenitiesList = category === 'accommodation' ? AMENITIES_LIST : SERVICE_AMENITIES_LIST;
  
  // Category info
  const categoryInfo = {
    accommodation: { title: "List Your Accommodation", subtitle: "Share your property with students" },
    experience: { title: "List Your Experience", subtitle: "Share activities or tours with travelers" },
    services: { title: "List Your Service", subtitle: "Offer services to property owners and tenants" },
  };

  // Check auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("gigs_user");
    if (!storedUser) {
      // Save intended destination
      localStorage.setItem("auth_redirect", "/listings/create");
      router.push("/signup");
    } else {
      const userData = JSON.parse(storedUser);
      if (!userData.isProfileComplete) {
        router.push("/signup/profile");
      }
    }
  }, [router]);
  
  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Property Type
    propertyType: "",
    // Step 2: Location
    country: "Nigeria",
    state: "",
    city: "",
    address: "",
    latitude: 0,
    longitude: 0,
    // Step 3: Details
    bedrooms: 1,
    bathrooms: 1,
    maxOccupants: 1,
    propertyName: "",
    description: "",
    // Student Space & Roommate Options
    isStudentSpace: false,
    needsRoommates: false,
    roommatesNeeded: 1,
    // Step 4: Amenities
    amenities: [] as string[],
    // Step 5: Photos
    photos: [] as string[],
    // Step 6: Pricing
    price: 0,
    priceType: "month" as "month" | "night" | "year",
    deposit: 0,
    includeUtilityBill: false,
    // Step 7: Preview
    isPublished: false,
    // Verification
    status: "draft" as "draft" | "pending" | "approved" | "rejected",
    submittedAt: "",
    rejectionReason: "",
  });

  // Pricing types including Yearly
  const PRICE_TYPES = [
    { id: "month", label: "Per Month", desc: "Best for rentals" },
    { id: "night", label: "Per Night", desc: "Best for short stays" },
    { id: "year", label: "Per Year", desc: "Best for long-term" },
  ] as const;

  type PriceType = typeof PRICE_TYPES[number]["id"];

  // Draft state
  const [hasDraft, setHasDraft] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Publishing state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Check for saved draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("gigs_listing_draft");
    if (savedDraft) {
      setHasDraft(true);
      setShowDraftModal(true);
    }
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (formData.propertyType) {
        saveDraft();
      }
    }, 30000);
    return () => clearInterval(autoSaveInterval);
  }, [formData]);

  // Save draft to localStorage
  const saveDraft = () => {
    const draftData = {
      ...formData,
      savedAt: new Date().toISOString(),
      currentStep,
      category,
    };
    localStorage.setItem("gigs_listing_draft", JSON.stringify(draftData));
    setLastSaved(new Date());
  };

  // Load draft from localStorage
  const loadDraft = () => {
    const savedDraft = localStorage.getItem("gigs_listing_draft");
    if (savedDraft) {
      const draftData = JSON.parse(savedDraft);
      setFormData({
        ...formData,
        propertyType: draftData.propertyType || "",
        country: draftData.country || "Nigeria",
        state: draftData.state || "",
        city: draftData.city || "",
        address: draftData.address || "",
        latitude: draftData.latitude || 0,
        longitude: draftData.longitude || 0,
        bedrooms: draftData.bedrooms || 1,
        bathrooms: draftData.bathrooms || 1,
        maxOccupants: draftData.maxOccupants || 1,
        propertyName: draftData.propertyName || "",
        description: draftData.description || "",
        isStudentSpace: draftData.isStudentSpace || false,
        needsRoommates: draftData.needsRoommates || false,
        roommatesNeeded: draftData.roommatesNeeded || 1,
        amenities: draftData.amenities || [],
        photos: draftData.photos || [],
        price: draftData.price || 0,
        priceType: draftData.priceType || "month",
        deposit: draftData.deposit || 0,
        includeUtilityBill: draftData.includeUtilityBill || false,
        isPublished: draftData.isPublished || false,
      });
      setCurrentStep(draftData.currentStep || 1);
      localStorage.removeItem("gigs_listing_draft");
    }
    setShowDraftModal(false);
    setHasDraft(false);
  };

  // Discard draft
  const discardDraft = () => {
    localStorage.removeItem("gigs_listing_draft");
    setShowDraftModal(false);
    setHasDraft(false);
    // Reset form
    setFormData({
      propertyType: "",
      country: "Nigeria",
      state: "",
      city: "",
      address: "",
      latitude: 0,
      longitude: 0,
      bedrooms: 1,
      bathrooms: 1,
      maxOccupants: 1,
      propertyName: "",
      description: "",
      isStudentSpace: false,
      needsRoommates: false,
      roommatesNeeded: 1,
      amenities: [],
      photos: [],
      price: 0,
      priceType: "month",
      deposit: 0,
      includeUtilityBill: false,
      isPublished: false,
      status: "draft" as const,
      submittedAt: "",
      rejectionReason: "",
    });
    setCurrentStep(1);
  };

  // Save & Exit handler
  const handleSaveAndExit = () => {
    saveDraft();
    router.push("/hosting");
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Create object URLs for preview
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      updateFormData("photos", [...formData.photos, ...newPhotos]);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    
    // Update form data with pending status
    updateFormData("status", "pending");
    updateFormData("submittedAt", new Date().toISOString());
    
    // Simulate publishing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update user role to lister using the switchRole function
    switchRole('lister');
    
    // Save to localStorage for demo (in production, this would be an API call)
    const publishedListing = {
      ...formData,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    
    // Save to host listings in localStorage
    const existingListings = JSON.parse(localStorage.getItem("gigs_host_listings") || "[]");
    const newListing = {
      id: `listing_${Date.now()}`,
      ...publishedListing,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    existingListings.push(newListing);
    localStorage.setItem("gigs_host_listings", JSON.stringify(existingListings));
    
    // Clear draft
    localStorage.removeItem("gigs_listing_draft");
    
    setPublishSuccess(true);
    
    // Navigate to hosting page after short delay
    setTimeout(() => {
      window.location.href = "/hosting";
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!selectedCategory; // Must select a category
      case 2: return !!formData.propertyType;
      // case 3: return !!formData.state && !!formData.city && !!formData.address; // Location removed
      case 3: return !!formData.propertyName && formData.bedrooms > 0;
      case 4: return formData.amenities.length > 0;
      case 5: return true; // Allow proceeding without photos for now
      case 6: return formData.price > 0;
      case 7: return true; // Preview
      default: return true;
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-brand-dark mb-2">
                What would you like to list?
              </h2>
              <p className="text-slate-500">Select a category to get started</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {LISTING_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (!cat.comingSoon) {
                      setSelectedCategory(cat.id);
                      updateFormData("category", cat.id);
                    }
                  }}
                  disabled={cat.comingSoon}
                  className={`
                    p-4 sm:p-6 md:p-8 rounded-2xl border-2 text-left transition-all duration-300 relative overflow-hidden min-h-[120px] sm:min-h-[140px] md:min-h-[160px]
                    ${cat.comingSoon 
                      ? 'border-slate-200 bg-slate-50 opacity-75 cursor-not-allowed' 
                      : selectedCategory === cat.id
                        ? 'border-brand-500 bg-brand-50 shadow-lg shadow-brand-500/20' 
                        : 'border-slate-200 bg-white hover:border-brand-200 hover:shadow-md'
                    }
                  `}
                >
                  {cat.comingSoon && (
                    <span className="absolute top-3 right-3 px-2 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-full">
                      Coming Soon
                    </span>
                  )}
                  <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center mb-4
                    ${cat.color === 'blue' ? 'bg-blue-100 text-blue-600' : ''}
                    ${cat.color === 'pink' ? 'bg-pink-100 text-pink-600' : ''}
                    ${cat.color === 'teal' ? 'bg-teal-100 text-teal-600' : ''}
                  `}>
                    <i className={`ph-bold ${cat.icon} text-2xl`}></i>
                  </div>
                  <h3 className="font-display font-bold text-lg text-brand-dark mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-slate-500">{cat.description}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-brand-dark mb-2">
                What type of property do you have?
              </h2>
              <p className="text-slate-500">Select the property type that best describes your place</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {propertyTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => updateFormData("propertyType", type.id)}
                  className={`
                    p-4 sm:p-6 rounded-2xl border-2 text-left transition-all duration-300
                    ${formData.propertyType === type.id
                      ? 'border-brand-500 bg-brand-50 shadow-lg shadow-brand-500/20' 
                      : 'border-slate-200 bg-white hover:border-brand-200 hover:shadow-md'
                    }
                  `}
                >
                  <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center mb-4
                    ${type.color === 'purple' ? 'bg-purple-100 text-purple-600' : ''}
                    ${type.color === 'blue' ? 'bg-blue-100 text-blue-600' : ''}
                    ${type.color === 'green' ? 'bg-green-100 text-green-600' : ''}
                    ${type.color === 'orange' ? 'bg-orange-100 text-orange-600' : ''}
                    ${type.color === 'pink' ? 'bg-pink-100 text-pink-600' : ''}
                    ${type.color === 'teal' ? 'bg-teal-100 text-teal-600' : ''}
                  `}>
                    <i className={`ph-bold ${type.icon} text-2xl`}></i>
                  </div>
                  <h3 className="font-display font-bold text-lg text-brand-dark mb-1">
                    {type.title}
                  </h3>
                  <p className="text-sm text-slate-500">{type.description}</p>
                </button>
              ))}
            </div>
          </div>
        );

      // case 3: Location step removed - will add back later

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-brand-dark mb-2">
                Tell us about your place
              </h2>
              <p className="text-slate-500">Add some basic details to describe your space</p>
            </div>
            
            <div className="space-y-4 max-w-xl mx-auto">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Property Name</label>
                <input
                  type="text"
                  value={formData.propertyName}
                  onChange={(e) => updateFormData("propertyName", e.target.value)}
                  placeholder="e.g., The Hive Modern Hostel"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-brand-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  placeholder="Describe your property..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-brand-500 focus:outline-none resize-none"
                />
              </div>

              {/* Student Space Toggle */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i className="ph-bold ph-graduation-cap text-purple-600 text-xl"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Student Space / Hostel</p>
                      <p className="text-xs text-slate-500">This is a student accommodation</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateFormData("isStudentSpace", !formData.isStudentSpace)}
                    className={`w-12 h-7 rounded-full transition-colors ${formData.isStudentSpace ? 'bg-purple-600' : 'bg-slate-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${formData.isStudentSpace ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              {/* Roommate Needed Toggle */}
              {formData.isStudentSpace && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className="ph-bold ph-users-three text-blue-600 text-xl"></i>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Need Roommates</p>
                        <p className="text-xs text-slate-500">Looking for roommates to join</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateFormData("needsRoommates", !formData.needsRoommates)}
                      className={`w-12 h-7 rounded-full transition-colors ${formData.needsRoommates ? 'bg-blue-600' : 'bg-slate-300'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${formData.needsRoommates ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  
                  {/* Number of Roommates Needed */}
                  {formData.needsRoommates && (
                    <div className="pt-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Number of Roommates Needed</label>
                      <div className="flex items-center gap-3 bg-white border-2 border-blue-200 rounded-xl p-2 w-fit">
                        <button
                          type="button"
                          onClick={() => updateFormData("roommatesNeeded", Math.max(1, formData.roommatesNeeded - 1))}
                          className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center hover:bg-blue-200"
                        >
                          <i className="ph-bold ph-minus text-blue-600"></i>
                        </button>
                        <span className="flex-1 text-center font-bold text-lg w-12">{formData.roommatesNeeded}</span>
                        <button
                          type="button"
                          onClick={() => updateFormData("roommatesNeeded", formData.roommatesNeeded + 1)}
                          className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center hover:bg-blue-200"
                        >
                          <i className="ph-bold ph-plus text-blue-600"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Bedrooms</label>
                  <div className="flex items-center gap-3 bg-white border-2 border-slate-200 rounded-xl p-2">
                    <button
                      onClick={() => updateFormData("bedrooms", Math.max(1, formData.bedrooms - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                    >
                      <i className="ph-bold ph-minus"></i>
                    </button>
                    <span className="flex-1 text-center font-bold text-lg">{formData.bedrooms}</span>
                    <button
                      onClick={() => updateFormData("bedrooms", formData.bedrooms + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                    >
                      <i className="ph-bold ph-plus"></i>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Bathrooms</label>
                  <div className="flex items-center gap-3 bg-white border-2 border-slate-200 rounded-xl p-2">
                    <button
                      onClick={() => updateFormData("bathrooms", Math.max(1, formData.bathrooms - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                    >
                      <i className="ph-bold ph-minus"></i>
                    </button>
                    <span className="flex-1 text-center font-bold text-lg">{formData.bathrooms}</span>
                    <button
                      onClick={() => updateFormData("bathrooms", formData.bathrooms + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                    >
                      <i className="ph-bold ph-plus"></i>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Max Guests</label>
                  <div className="flex items-center gap-3 bg-white border-2 border-slate-200 rounded-xl p-2">
                    <button
                      onClick={() => updateFormData("maxOccupants", Math.max(1, formData.maxOccupants - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                    >
                      <i className="ph-bold ph-minus"></i>
                    </button>
                    <span className="flex-1 text-center font-bold text-lg">{formData.maxOccupants}</span>
                    <button
                      onClick={() => updateFormData("maxOccupants", formData.maxOccupants + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                    >
                      <i className="ph-bold ph-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-brand-dark mb-2">
                What amenities do you offer?
              </h2>
              <p className="text-slate-500">Select all the amenities available at your property</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AMENITIES_LIST.map((amenity) => (
                <button
                  key={amenity.id}
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`
                    p-4 rounded-xl border-2 flex items-center gap-3 transition-all duration-200
                    ${formData.amenities.includes(amenity.id)
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-slate-200 bg-white hover:border-brand-200'
                    }
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center
                    ${formData.amenities.includes(amenity.id)
                      ? 'bg-brand-500 text-white'
                      : 'bg-slate-100 text-slate-500'
                    }
                  `}>
                    <i className={`ph-bold ${amenity.icon} text-xl`}></i>
                  </div>
                  <span className={`font-medium ${formData.amenities.includes(amenity.id) ? 'text-brand-dark' : 'text-slate-600'}`}>
                    {amenity.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-brand-dark mb-2">
                Add some photos of your place
              </h2>
              <p className="text-slate-500">Great photos help guests visualize their stay</p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const files = e.dataTransfer.files;
                  if (files && files.length > 0) {
                    const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
                    updateFormData("photos", [...formData.photos, ...newPhotos]);
                  }
                }}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                  isDragging 
                    ? 'border-brand-500 bg-brand-50 scale-[1.02]' 
                    : 'border-slate-300 hover:border-brand-400'
                }`}
              >
                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`ph-bold ${isDragging ? 'ph-cloud-arrow-up' : 'ph-upload-simple'} text-2xl text-brand-600`}></i>
                </div>
                <h3 className="font-display font-bold text-lg text-brand-dark mb-1">
                  {isDragging ? 'Drop your photos here' : 'Upload photos'}
                </h3>
                <p className="text-slate-500 text-sm mb-4">
                  Click to browse or drag and drop
                </p>
                <p className="text-xs text-slate-400">
                  Supports: JPG, PNG, WebP (max 10MB each)
                </p>
              </div>

              {formData.photos.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-slate-700">
                      {formData.photos.length} photo{formData.photos.length !== 1 ? 's' : ''} uploaded
                    </p>
                    <button
                      onClick={() => updateFormData("photos", [])}
                      className="text-sm text-red-500 hover:text-red-600"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {formData.photos.map((photo, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                        <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => updateFormData("photos", formData.photos.filter((_, i) => i !== idx))}
                            className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <i className="ph-bold ph-x text-xl"></i>
                          </button>
                        </div>
                        {idx === 0 && (
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-brand-500 text-white text-xs font-bold rounded-lg">
                            Cover
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-brand-dark mb-2">
                Set your price
              </h2>
              <p className="text-slate-500">Choose how you want to price your property</p>
            </div>
            
            <div className="max-w-xl mx-auto space-y-6">
              {/* Price Type Toggle */}
              <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                {PRICE_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => updateFormData("priceType", type.id)}
                    className={`
                      py-3 px-2 rounded-xl font-medium transition-all text-sm
                      ${formData.priceType === type.id 
                        ? 'bg-white text-brand-dark shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                      }
                    `}
                  >
                    <div className="font-semibold">{type.label}</div>
                    <div className="text-xs text-slate-400 hidden sm:block">{type.desc}</div>
                  </button>
                ))}
              </div>

              {/* Price Input */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {formData.priceType === "month" ? "Monthly" : 
                   formData.priceType === "year" ? "Yearly" : "Nightly"} Price
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-400">₦</span>
                  <input
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) => updateFormData("price", parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="text-4xl font-display font-bold text-brand-dark bg-transparent focus:outline-none w-full"
                  />
                  <span className="text-slate-500">/ {formData.priceType === "year" ? "year" : formData.priceType === "month" ? "month" : "night"}</span>
                </div>
              </div>

              {/* Security Deposit - More Prominent */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <i className="ph-bold ph-shield-check text-amber-600"></i>
                    </div>
                    <label className="text-sm font-medium text-slate-700">
                      Security Deposit
                    </label>
                  </div>
                  <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full font-medium">Optional</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-slate-400">₦</span>
                  <input
                    type="number"
                    value={formData.deposit || ""}
                    onChange={(e) => updateFormData("deposit", parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="text-2xl font-display font-bold text-brand-dark bg-transparent focus:outline-none w-full"
                  />
                  <span className="text-slate-500 text-sm">one-time payment</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Refundable deposit to cover potential damages. Collected at check-in.
                </p>
              </div>

              {/* Utility Bills Toggle */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="ph-bold ph-receipt text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Bills Included</p>
                      <p className="text-xs text-slate-500">Price includes utility bills</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateFormData("includeUtilityBill", !formData.includeUtilityBill)}
                    className={`w-12 h-7 rounded-full transition-colors ${formData.includeUtilityBill ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${formData.includeUtilityBill ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              {/* Price Preview */}
              <div className="bg-brand-50 rounded-2xl p-6 text-center">
                <p className="text-slate-600 mb-1">You'll earn approximately</p>
                <p className="font-display font-bold text-3xl text-brand-600">
                  ₦{Math.round(formData.price * 0.9).toLocaleString()}{formData.priceType === "year" ? "/yr" : formData.priceType === "month" ? "/mo" : "/night"}
                </p>
                <p className="text-xs text-slate-500 mt-1">After 10% service fee</p>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-brand-dark mb-2">
                Preview your listing
              </h2>
              <p className="text-slate-500">Make sure everything looks good before publishing</p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              {/* Preview Card */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100">
                {/* Image */}
                <div className="h-56 bg-slate-200 relative">
                  {formData.photos.length > 0 ? (
                    <img src={formData.photos[0]} alt={formData.propertyName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <i className="ph ph-image text-4xl text-slate-400"></i>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-brand-500 text-white text-xs font-bold rounded-full">
                      {propertyTypes.find(t => t.id === formData.propertyType)?.title}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-display font-bold text-xl text-brand-dark">
                        {formData.propertyName || "Property Name"}
                      </h3>
                      <p className="text-slate-500 text-sm">
                        {formData.city ? `${formData.city}, ${formData.state}` : 'Location not set'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-2xl text-brand-600">
                        ${formData.price}
                      </p>
                      <p className="text-slate-500 text-sm">/{formData.priceType}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 text-sm text-slate-600 mb-4">
                    <span><i className="ph-bold ph-bed"></i> {formData.bedrooms} beds</span>
                    <span><i className="ph-bold ph-drop"></i> {formData.bathrooms} baths</span>
                    <span><i className="ph-bold ph-users"></i> {formData.maxOccupants} guests</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.slice(0, 4).map(amenityId => (
                      <span key={amenityId} className="px-2 py-1 bg-slate-100 rounded-lg text-xs text-slate-600">
                        {AMENITIES_LIST.find(a => a.id === amenityId)?.label}
                      </span>
                    ))}
                    {formData.amenities.length > 4 && (
                      <span className="px-2 py-1 bg-brand-50 rounded-lg text-xs text-brand-600">
                        +{formData.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-brand-50/30">
      {/* Floating Publishing Indicator */}
      <AnimatePresence>
        {isPublishing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-sm mx-4"
            >
              {/* Animated Icon */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-full h-full bg-brand-100 rounded-full flex items-center justify-center"
                >
                  <i className="ph-bold ph-rocket-launch text-4xl text-brand-600"></i>
                </motion.div>
                {/* Spinning orbit */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-brand-300 border-t-brand-500 rounded-full"
                />
              </div>
              
              <h3 className="font-display font-bold text-2xl text-brand-dark mb-2">
                {publishSuccess ? 'Submitted for Review!' : 'Publishing Your Listing'}
              </h3>
              <p className="text-slate-500 mb-6">
                {publishSuccess 
                  ? 'Your listing is pending verification. You will be notified once approved.' 
                  : 'Please wait while we prepare your listing for review...'
                }
              </p>
              
              {!publishSuccess && (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              )}
              
              {publishSuccess && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto"
                >
                  <i className="ph-bold ph-clock text-3xl text-amber-600"></i>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Draft Recovery Modal */}
      <AnimatePresence>
        {showDraftModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl text-center max-w-sm w-full"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ph-bold ph-floppy-disk text-3xl text-amber-600"></i>
              </div>
              
              <h3 className="font-display font-bold text-xl md:text-2xl text-brand-dark mb-2">
                Continue where you left off?
              </h3>
              <p className="text-slate-500 mb-6 text-sm md:text-base">
                We found an unfinished listing. Would you like to continue editing it?
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={discardDraft}
                  className="flex-1 px-4 py-3 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Start Fresh
                </button>
                <button
                  onClick={loadDraft}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/listings" 
              className="flex items-center gap-2 text-slate-600 hover:text-brand-600 transition-colors font-medium"
            >
              <i className="ph-bold ph-arrow-left"></i>
              Back
            </Link>
            
            <div className="flex items-center gap-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`
                    w-2 h-2 rounded-full transition-all
                    ${step.id === currentStep ? 'bg-brand-500 w-6' : ''}
                    ${step.id < currentStep ? 'bg-brand-500' : 'bg-slate-200'}
                  `}
                />
              ))}
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              {lastSaved && (
                <span className="hidden sm:inline text-xs text-slate-400">
                  <i className="ph-bold ph-check-circle mr-1 text-green-500"></i>
                  Saved
                </span>
              )}
              <button 
                onClick={handleSaveAndExit}
                className="text-sm font-medium text-slate-500 hover:text-brand-600 flex items-center gap-1"
              >
                <i className="ph-bold ph-floppy-disk"></i>
                <span className="hidden sm:inline">Save & Exit</span>
                <span className="sm:hidden">Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-100">
        <motion.div 
          className="h-full bg-brand-500"
          initial={{ width: `${(1 / steps.length) * 100}%` }}
          animate={{ width: `${(currentStep / steps.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Step Title */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
            <i className={`ph-bold ${steps[currentStep - 1]?.icon || 'ph-building'} text-brand-600 text-xl`}></i>
          </div>
          <span className="text-slate-500 font-medium">Step {currentStep} of {steps.length}</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`
              px-6 py-3 rounded-xl font-medium transition-all
              ${currentStep === 1 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-slate-600 hover:bg-slate-100'
              }
            `}
          >
            <i className="ph-bold ph-arrow-left mr-2"></i>
            Back
          </button>
          
          {currentStep === steps.length ? (
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className={`
                px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2
                ${isPublishing 
                  ? 'bg-brand-400 cursor-wait' 
                  : 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-brutal hover:-translate-y-1'
                }
              `}
            >
              {isPublishing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <i className="ph-bold ph-paper-plane-tilt mr-2"></i>
                  Submit for Review
                </>
              )}
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`
                px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2
                ${canProceed()
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-brutal hover:-translate-y-1'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }
              `}
            >
              Next
              <i className="ph-bold ph-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
