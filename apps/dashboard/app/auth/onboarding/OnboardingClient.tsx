"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthInput } from "@/components/auth/AuthInput";

interface OnboardingClientProps {
  email: string;
}

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const housingImages = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
];

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Profile Information",
    description: "Tell us about yourself",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Location & Search",
    description: "Set your preferences",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function OnboardingClient({ email }: OnboardingClientProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
  });
  const [preferences, setPreferences] = useState({
    location: "",
    budget: "1000-5000",
    roommates: "1",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-rotate carousel - only when mounted
  useEffect(() => {
    let isMounted = true;
    const timer = setInterval(() => {
      if (isMounted) {
        setSelectedImage((prev) => (prev + 1) % housingImages.length);
      }
    }, 5000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [])

  const currentStepData = onboardingSteps[currentStep - 1];

  const handleNext = async () => {
    setErrors({});

    if (currentStep === 1) {
      if (!profileData.firstName.trim()) {
        setErrors((prev) => ({ ...prev, firstName: "First name is required" }));
        return;
      }
      if (!profileData.lastName.trim()) {
        setErrors((prev) => ({ ...prev, lastName: "Last name is required" }));
        return;
      }
      if (!profileData.username.trim()) {
        setErrors((prev) => ({ ...prev, username: "Username is required" }));
        return;
      }
      if (!profileData.phone.trim()) {
        setErrors((prev) => ({ ...prev, phone: "Phone number is required" }));
        return;
      }
    }

    if (currentStep === 2) {
      setIsLoading(true);
      try {
        const completeData = {
          email,
          ...profileData,
          ...preferences,
        };
        console.log("Onboarding complete:", completeData);

        // Update user in localStorage
        const storedUser = localStorage.getItem("gigs_user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          user.name = `${profileData.firstName} ${profileData.lastName}`;
          user.isProfileComplete = true;
          localStorage.setItem("gigs_user", JSON.stringify(user));
        }

        await new Promise((resolve) => setTimeout(resolve, 500));

        // Check for redirect destination
        const redirectParam = sessionStorage.getItem("auth_redirect") || "/listings";
        sessionStorage.removeItem("auth_redirect");

        // If user came from listing creation flow, redirect to hosting
        const finalRedirect = redirectParam.includes("create") ? "/hosting" : redirectParam;

        // Navigate to the redirect destination
        router.push(finalRedirect);
      } catch (error) {
        console.error("Onboarding failed:", error);
        setErrors({ submit: "An error occurred. Please try again." });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  return (
    <div className="h-screen flex items-stretch bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 sm:px-12 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-green-500 rounded-lg border-2 border-green-900 flex items-center justify-center" style={{ boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="font-bold text-2xl tracking-tight text-green-900">
                GIGS<span className="text-green-600">Rentals</span>
              </span>
            </Link>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2">
            {onboardingSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-9 h-9 rounded-full font-bold text-xs transition-all ${currentStep >= step.id ? "bg-green-600 text-white" : "bg-green-200 text-green-600"}`}>
                  {step.id}
                </div>
                {index < onboardingSteps.length - 1 && (
                  <div className={`w-12 h-1 mx-1 rounded-full transition-all ${currentStep > step.id ? "bg-green-600" : "bg-green-200"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Title */}
          <div className="text-center space-y-2">
            {currentStepData && (
              <>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full text-green-600">
                  {currentStepData.icon}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-green-900">{currentStepData.title}</h2>
                <p className="text-green-700 text-sm md:text-base">{currentStepData.description}</p>
              </>
            )}
          </div>

          {/* Step Content */}
          <div className="space-y-5">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <AuthInput
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    error={errors.firstName}
                  />
                  <AuthInput
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    error={errors.lastName}
                  />
                </div>
                <AuthInput
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                  error={errors.username}
                />
                <AuthInput
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Phone number"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  error={errors.phone}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <AuthInput
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Your location/city"
                  value={preferences.location}
                  onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  }
                />
                <div>
                  <label htmlFor="budget" className="block text-sm font-semibold text-green-800 mb-2">Budget Range (Monthly)</label>
                  <select
                    id="budget"
                    name="budget"
                    value={preferences.budget}
                    onChange={(e) => setPreferences({ ...preferences, budget: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-green-200 focus:border-green-600 focus:ring-2 focus:ring-green-200 font-semibold focus:outline-none transition-all"
                  >
                    <option value="1000-5000">$1,000 - $5,000</option>
                    <option value="5000-10000">$5,000 - $10,000</option>
                    <option value="10000+">$10,000+</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="roommates" className="block text-sm font-semibold text-green-800 mb-2">Number of Roommates</label>
                  <select
                    id="roommates"
                    name="roommates"
                    value={preferences.roommates}
                    onChange={(e) => setPreferences({ ...preferences, roommates: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-green-200 focus:border-green-600 focus:ring-2 focus:ring-green-200 font-semibold focus:outline-none transition-all"
                  >
                    <option value="1">1 (Private)</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4+">4+</option>
                  </select>
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-sm font-semibold text-red-600">{errors.submit}</p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              onClick={handleBack}
              disabled={currentStep === 1 || isLoading}
              className="px-6 py-3 border-2 border-green-300 text-green-600 font-bold rounded-xl hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold rounded-xl border-2 border-green-700 transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Setup Complete...
                </>
              ) : currentStep === 2 ? (
                "Finish Setup"
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Image Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-green-100 via-green-50 to-green-50">
        <div className="w-full h-full relative z-10 flex flex-col items-center justify-center p-8">
          <div className="relative w-full max-w-lg h-[500px]">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={housingImages[selectedImage]}
                alt={`Housing ${selectedImage + 1}`}
                className="w-full h-full object-cover transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 via-transparent to-transparent"></div>
            </div>

            <button
              onClick={() => setSelectedImage((prev) => (prev - 1 + housingImages.length) % housingImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedImage((prev) => (prev + 1) % housingImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {housingImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${index === selectedImage ? "bg-white w-6" : "bg-white/50"}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 text-center max-w-md space-y-4">
            <h2 className="text-4xl font-bold text-green-900 italic">Find Your Tribe</h2>
            <p className="text-green-700">Connect with students, find affordable co-living spaces, and split rent securely.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
