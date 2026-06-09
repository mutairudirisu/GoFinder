"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { LocationPickerMap } from "@/components/listings/LocationPickerMap";

type SubStep = "LANDING" | "SEARCH" | "FORM" | "CONFIRM";

export default function AddressPage() {
  const router = useRouter();
  const [subStep, setSubStep] = useState<SubStep>("LANDING");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isFormValid = useMemo(() => {
    return !!(
      address.houseNumber && 
      address.street && 
      address.city && 
      address.province && 
      address.postalCode
    );
  }, [address]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!address.houseNumber) newErrors.houseNumber = "House number is required";
    if (!address.street) newErrors.street = "Street is required";
    if (!address.city) newErrors.city = "City is required";
    if (!address.province) newErrors.province = "State is required";
    if (!address.postalCode) newErrors.postalCode = "Postal code is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Geocoding suggestions logic
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            searchQuery
          )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&limit=5&proximity=3.3792,6.5244`
        );
        const data = await response.json();
        setSuggestions(data.features || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelectSuggestion = (suggestion: any) => {
    const [lng, lat] = suggestion.center;
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
    setSubStep("FORM");
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&limit=1`
            );
            const data = await response.json();
            if (data.features && data.features.length > 0) {
              handleSelectSuggestion(data.features[0]);
            } else {
              setAddress(prev => ({ ...prev, latitude, longitude }));
              setSubStep("FORM");
            }
          } catch (error) {
            setAddress(prev => ({ ...prev, latitude, longitude }));
            setSubStep("FORM");
          } finally {
            setIsLocating(false);
          }
        },
        () => {
          setIsLocating(false);
          alert("Could not get your location.");
        }
      );
    }
  };

  const handleLocationChange = async (lat: number, lng: number) => {
    setAddress(prev => ({ ...prev, latitude: lat, longitude: lng }));
    if (subStep === "CONFIRM") {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&limit=1`
        );
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const suggestion = data.features[0];
          const context = suggestion.context || [];
          setAddress(prev => ({
            ...prev,
            street: suggestion.text || prev.street,
            city: context.find((c: any) => c.id.startsWith('place'))?.text || prev.city,
            province: context.find((c: any) => c.id.startsWith('region'))?.text || prev.province,
            postalCode: context.find((c: any) => c.id.startsWith('postcode'))?.text || prev.postalCode,
          }));
        }
      } catch (error) {
        console.error("Error reverse geocoding:", error);
      }
    }
  };

  const handleFinishAddress = () => {
<<<<<<< HEAD
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category") || "home";
    
    // Save address to localStorage
    localStorage.setItem("temp_listing_address", JSON.stringify(address));
    
    // Redirect back to main flow at INTRO step
    router.push(`/becoming-a-host?step=INTRO&category=${category}`);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
=======
    // In a real app, we would create a draft listing here
    const listingId = Date.now().toString();
    router.push(`/becoming-a-host/${listingId}/about-your-place`);
  };

  return (
    <div className="flex-1 flex flex-col relative">
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
      {/* Landing Background - Visible for LANDING, SEARCH, and FORM sub-steps */}
      {subStep !== "CONFIRM" && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
<<<<<<< HEAD
          className="flex-1 grid grid-cols-1 lg:grid-cols-2 bg-white overflow-y-auto"
        >
          <div className="flex flex-col md:justify-center px-8 md:px-20 py-8 pt-20 items-center">
            <div className="w-full max-w-4xl flex justify-end mb-8 lg:absolute lg:top-8 lg:right-8 lg:z-20 lg:mb-0 lg:max-w-none">
              <button
                onClick={() => router.push("/becoming-a-host")}
                className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all"
              >
                <i className="ph ph-x text-xl"></i>
              </button>
            </div>

=======
          className="flex-1 grid grid-cols-1 lg:grid-cols-2 bg-white"
        >
          <div className="flex flex-col md:justify-center px-8 md:px-20 py-8 pt-20 items-center">
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
            <h1 className="text-4xl md:text-5xl text-center font-display font-[500] text-slate-900 leading-wide mb-8">
              Set up your <br></br> <span className="text-brand-500">GIGRental</span> listing
            </h1>
            <p className="text-lg text-center justify-center text-slate-500 mb-10 max-w-md leading-relaxed">
              It's easy to create a great listing—let's start with your address.
            </p>
            <button
              onClick={() => setSubStep("SEARCH")}
              className="w-full max-w-md p-5 rounded-full border border-slate-300 flex items-center gap-4 hover:border-brand-500 transition-all shadow-sm"
            >
              <i className="ph ph-magnifying-glass text-2xl text-brand-500"></i>
              <span className="text-lg text-slate-400">Enter your address</span>
            </button>
          </div>

<<<<<<< HEAD
          <div className="hidden xl:flex items-center justify-center bg-slate-50 relative overflow-hidden">
=======
          <div className="hidden lg:flex items-center justify-center bg-slate-50 relative overflow-hidden">
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
            <motion.div 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-[80%] aspect-square relative"
            >
              <motion.div
                animate={{ 
                  scale: [1, 0.95, 0.95],
                  borderRadius: ["0px", "40px", "40px"],
                  backgroundColor: ["rgba(255,255,255,0)", "rgba(236,253,245,1)", "rgba(236,253,245,1)"]
                }}
                transition={{ duration: 2, delay: 1, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 flex flex-col items-center justify-center p-8"
              >
                <motion.div
                  animate={{ 
                    width: ["100%", "90%", "90%"],
                    aspectRatio: ["1/1", "1/1", "1/1"],
                    borderRadius: ["0px", "32px", "32px"]
                  }}
                  transition={{ duration: 2, delay: 1, repeat: Infinity, repeatType: "reverse" }}
                  className="overflow-hidden shadow-2xl bg-white"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" 
                    alt="Villa" 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: [0, 1, 1],
                    y: [20, 0, 0]
                  }}
                  transition={{ duration: 2, delay: 1, repeat: Infinity, repeatType: "reverse" }}
                  className="w-full mt-6 bg-white rounded-3xl p-6 shadow-lg border border-emerald-50"
                >
                  <h3 className="font-display font-[600] text-xl text-slate-900 mb-2">Entire villa in Wilton Manors, Florida</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop" alt="Nicole" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">Hosted by Nicole</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Modals Overlay */}
      <AnimatePresence>
        {subStep === "SEARCH" && (
          <motion.div
            key="search-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-0 md:p-8"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 150 || info.velocity.y > 500) {
                  setSubStep("LANDING");
                }
              }}
              className="w-full max-w-2xl bg-white rounded-t-[40px] md:rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col h-[72vh] md:h-auto md:max-h-[85vh]"
            >
              {/* Drag Handle Area - Makes it easier to grab */}
              <div className="w-full pt-4 pb-2 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto"></div>
              </div>

              <div className="p-6 md:p-12 pt-0 md:pt-4">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-10"></div> {/* Spacer */}
                  <h2 className="text-lg mt-2 md:text-2xl font-display font-medium text-slate-900 text-center">
                    Enter your address
                  </h2>
                  <button 
                    onClick={() => setSubStep("LANDING")}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors"
                  >
                    <i className="ph ph-x text-xl text-slate-400"></i>
                  </button>
                </div>

                <div className="relative mb-6">
                  <div className="flex items-center gap-4 px-6 py-4 rounded-full border-2 border-brand-200 bg-white shadow-sm focus-within:shadow-md transition-all">
                    <i className={`ph-bold ${isSearching ? "ph-spinner animate-spin" : "ph-magnifying-glass"} text-slate-900 text-xl`}></i>
                    <input
                      type="text"
                      placeholder="Enter your address"
                      autoFocus
                      className="flex-1 bg-transparent outline-none text-lg font-medium text-slate-900 placeholder:text-slate-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                      >
                        <i className="ph ph-x text-xs text-slate-600"></i>
                      </button>
                    )}
                  </div>
                </div>

                {/* Suggestions List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2 max-h-[400px]">
                  <AnimatePresence>
                    {suggestions.length > 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-1"
                      >
                        <p className="text-sm font-bold text-slate-400 mb-4 px-2 uppercase tracking-wider">Suggested</p>
                        {suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => handleSelectSuggestion(s)}
                            className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-all rounded-2xl text-left group"
                          >
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-colors">
                              <i className="ph-bold ph-map-pin text-slate-900 text-xl"></i>
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-slate-900 text-lg leading-tight">{s.text}</p>
                              <p className="text-slate-500 text-sm mt-0.5">{s.place_name.split(', ').slice(1).join(', ')}</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    ) : !searchQuery && (
                      <button 
                        onClick={handleUseCurrentLocation}
                        disabled={isLocating}
                        className="w-full flex items-center gap-6 p-4 rounded-full bg-brand-100/50 hover:bg-brand-400 transition-all group"
                      >
                        <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                          <i className={`ph-bold ${isLocating ? "ph-spinner animate-spin" : "ph-navigation-arrow"} text-slate-900 text-xl`}></i>
                        </div>
                        <span className="font-bold text-slate-900 text-base">Use my current location</span>
                      </button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {subStep === "FORM" && (
          <motion.div
            key="form-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-0 md:p-8"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 150 || info.velocity.y > 500) {
                  setSubStep("LANDING");
                }
              }}
              className="w-full max-w-2xl bg-white rounded-t-[40px] md:rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col h-[92vh] md:h-auto md:max-h-[90vh]"
            >
              {/* Drag Handle Area */}
              <div className="w-full pt-4 pb-0 cursor-grab active:cursor-grabbing flex-shrink-0">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto"></div>
              </div>

              {/* Header - Static */}
              <div className="flex items-center justify-between p-6 md:p-8 pt-2 md:pt-4 border-b border-slate-100 flex-shrink-0">
                <button 
                  onClick={() => setSubStep("SEARCH")} 
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"
                >
                  <i className="ph ph-arrow-left text-xl text-slate-900"></i>
                </button>
                <h2 className="text-lg md:text-2xl font-display font-medium text-slate-900">Confirm your address</h2>
                <button 
                  onClick={() => setSubStep("LANDING")} 
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors"
                >
                  <i className="ph ph-x text-xl text-slate-400"></i>
                </button>
              </div>

              {/* Form Content - Scrollable */}
              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar flex-1 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                  {/* House Number */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">House Number <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g., 123"
                      className={`w-full p-4 md:p-5 rounded-2xl border transition-all outline-none bg-slate-50/30 text-lg ${errors.houseNumber ? 'border-rose-500 bg-rose-50/50' : 'border-slate-100 focus:border-slate-900 focus:bg-white'}`}
                      value={address.houseNumber} 
                      onChange={e => {
                        setAddress({...address, houseNumber: e.target.value});
                        if (errors.houseNumber) setErrors(prev => { const n = {...prev}; delete n.houseNumber; return n; });
                      }} 
                    />
                    {errors.houseNumber && <p className="text-xs text-rose-500 font-medium ml-1">{errors.houseNumber}</p>}
                  </div>

                  {/* Street */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">Street <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g., Mississippi Street"
                      className={`w-full p-4 md:p-5 rounded-2xl border transition-all outline-none bg-slate-50/30 text-lg ${errors.street ? 'border-rose-500 bg-rose-50/50' : 'border-slate-100 focus:border-slate-900 focus:bg-white'}`}
                      value={address.street} 
                      onChange={e => {
                        setAddress({...address, street: e.target.value});
                        if (errors.street) setErrors(prev => { const n = {...prev}; delete n.street; return n; });
                      }} 
                    />
                    {errors.street && <p className="text-xs text-rose-500 font-medium ml-1">{errors.street}</p>}
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">City <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g., Abuja Municipal"
                      className={`w-full p-4 md:p-5 rounded-2xl border transition-all outline-none bg-slate-50/30 text-lg ${errors.city ? 'border-rose-500 bg-rose-50/50' : 'border-slate-100 focus:border-slate-900 focus:bg-white'}`}
                      value={address.city} 
                      onChange={e => {
                        setAddress({...address, city: e.target.value});
                        if (errors.city) setErrors(prev => { const n = {...prev}; delete n.city; return n; });
                      }} 
                    />
                    {errors.city && <p className="text-xs text-rose-500 font-medium ml-1">{errors.city}</p>}
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">State <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g., Federal Capital Territory"
                      className={`w-full p-4 md:p-5 rounded-2xl border transition-all outline-none bg-slate-50/30 text-lg ${errors.province ? 'border-rose-500 bg-rose-50/50' : 'border-slate-100 focus:border-slate-900 focus:bg-white'}`}
                      value={address.province} 
                      onChange={e => {
                        setAddress({...address, province: e.target.value});
                        if (errors.province) setErrors(prev => { const n = {...prev}; delete n.province; return n; });
                      }} 
                    />
                    {errors.province && <p className="text-xs text-rose-500 font-medium ml-1">{errors.province}</p>}
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">Postal Code <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g., 10101"
                      className={`w-full p-4 md:p-5 rounded-2xl border transition-all outline-none bg-slate-50/30 text-lg ${errors.postalCode ? 'border-rose-500 bg-rose-50/50' : 'border-slate-100 focus:border-slate-900 focus:bg-white'}`}
                      value={address.postalCode} 
                      onChange={e => {
                        setAddress({...address, postalCode: e.target.value});
                        if (errors.postalCode) setErrors(prev => { const n = {...prev}; delete n.postalCode; return n; });
                      }} 
                    />
                    {errors.postalCode && <p className="text-xs text-rose-500 font-medium ml-1">{errors.postalCode}</p>}
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">Country <span className="text-rose-500">*</span></label>
                    <div className="w-full p-4 md:p-5 rounded-2xl border border-slate-100 bg-slate-50 text-slate-500 font-medium text-lg">
                      Nigeria
                    </div>
                  </div>

                  {/* Landmark */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-400">Landmark <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g., Near Lagos Island Mall, Opposite Church"
                      className="w-full p-4 md:p-5 rounded-2xl border border-slate-100 focus:border-slate-900 focus:bg-white transition-all outline-none bg-slate-50/30 text-lg"
                      value={address.landmark} 
                      onChange={e => setAddress({...address, landmark: e.target.value})} 
                    />
                    <p className="text-[11px] text-slate-400 ml-1">A well-known place near your property to help guests find it easily.</p>
                  </div>
                </div>
              </div>

              {/* Footer Action - Static/Sticky */}
              <div className="p-6 md:p-8 border-t border-slate-100 bg-white flex-shrink-0">
                <button 
                  onClick={() => {
                    if (validate()) setSubStep("CONFIRM");
                  }}
<<<<<<< HEAD
                  disabled={!isFormValid}
                  className={`w-full font-bold py-4 rounded-full transition-all text-lg shadow-xl active:scale-[0.98] ${
                    !isFormValid 
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none" 
                      : "bg-brand-600 shadow-brutal text-white hover:bg-brand-500"
                  }`}
=======
                  className="w-full bg-brand-600 shadow-brutal text-white font-bold py-4 rounded-full hover:bg-brand-500 transition-all text-lg shadow-xl active:scale-[0.98]"
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
                >
                  Accept and continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {subStep === "CONFIRM" && (
          <motion.div
            key="confirm-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col h-full bg-white overflow-hidden"
          >
<<<<<<< HEAD
            {/* Custom Header for Location Step */}
            <header className="px-6 py-4 flex items-center gap-4 bg-white border-b border-slate-50 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                G
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-slate-900">GIGS</span>
            </header>

            <div className="flex-1 overflow-y-auto flex flex-col pb-32">
              <div className="px-6 md:px-12 py-8 bg-white flex-shrink-0">
                <p className="text-slate-500 text-[15px] leading-relaxed font-medium">
=======
            <div className="flex-1 overflow-y-auto flex flex-col">
              <div className="px-6 md:px-12 py-8 bg-white flex-shrink-0">
                <h1 className="text-2xl md:text-3xl font-display font-medium text-slate-900 mb-4">Location</h1>
                <p className="text-slate-500 text-sm leading-relaxed">
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
                  Place the pin near your property's street location. Street-level accuracy is sufficient and helps your property be found in search results. Your precise address is NOT shared until a booking is confirmed.
                </p>
              </div>
              
<<<<<<< HEAD
              <div className="flex-1 relative min-h-[450px] bg-slate-50 mx-4 md:mx-12 rounded-[40px] overflow-hidden border-2 border-slate-100 shadow-inner">
=======
              <div className="flex-1 relative min-h-[400px] bg-slate-50 mx-6 md:mx-12 rounded-[32px] overflow-hidden border-2 border-slate-100 mb-8">
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
                <LocationPickerMap 
                  latitude={address.latitude}
                  longitude={address.longitude}
                  onLocationChange={handleLocationChange}
                  showSpecificLocation={true}
                  interactive={true}
<<<<<<< HEAD
                  price={150000}
                />

                {/* Map Type Toggle */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-2xl p-1 shadow-xl flex items-center gap-1 border border-white/50">
                  <button className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm">Streets</button>
                  <button className="px-5 py-2 rounded-xl text-slate-500 text-xs font-bold hover:bg-slate-100">Satellite</button>
                </div>
                
                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                  <button 
                    onClick={handleUseCurrentLocation}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-white rounded-full shadow-xl border border-white font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98]"
                  >
                    <i className="ph-bold ph-crosshair text-lg"></i>
                    <span>Use my device location</span>
                  </button>
                  <button 
                    onClick={() => setSubStep("SEARCH")}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-white rounded-full shadow-xl border border-white font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98]"
                  >
                    <i className="ph-bold ph-arrow-counter-clockwise text-lg"></i>
=======
                />
                
                {/* Floating Address Card */}
                <div className="absolute top-20 md:top-6 left-6 right-6 md:w-[400px]">
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
                      <i className="ph-fill ph-map-pin text-white text-lg"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">
                        {address.street || "Select location"}
                      </p>
                      <p className="text-slate-500 text-xs truncate">
                        {address.city}, {address.province}
                      </p>
                    </div>
                    <button onClick={() => setSubStep("FORM")} className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors">
                      <i className="ph-bold ph-pencil-simple text-slate-600"></i>
                    </button>
                  </div>
                </div>

                {/* Map Controls */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 space-y-2 justify-center md:flex items-center md:gap-3 w-full px-6 md:w-auto">
                  <button 
                    onClick={handleUseCurrentLocation}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg border border-slate-100 font-bold text-slate-700 hover:bg-slate-50 transition-all whitespace-nowrap"
                  >
                    <i className="ph-bold ph-crosshair"></i>
                    <span>Use my device location</span>
                  </button>
                  <button 
                    onClick={() => {
                      // Logic to reset to original geocoded address
                      setSubStep("SEARCH");
                    }}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg border border-slate-100 font-bold text-slate-700 hover:bg-slate-50 transition-all whitespace-nowrap"
                  >
                    <i className="ph-bold ph-arrow-counter-clockwise"></i>
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
                    <span>Reset to address</span>
                  </button>
                </div>
              </div>
            </div>
            
<<<<<<< HEAD
            {/* Fixed Footer for Confirm View */}
            <div className="fixed bottom-0 left-0 right-0 h-28 bg-white border-t border-slate-100 flex items-center justify-between px-8 md:px-12 z-[60] shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
              <button 
                onClick={() => setSubStep("FORM")} 
                className="text-[17px] font-bold text-slate-900 underline underline-offset-8 decoration-2 hover:text-slate-600 transition-colors"
=======
            {/* Static Footer */}
            <div className="h-24 bg-white border-t border-slate-100 flex items-center justify-between px-6 md:px-12 flex-shrink-0 z-50">
              <button 
                onClick={() => setSubStep("FORM")} 
                className="text-lg font-bold text-slate-900 underline underline-offset-8 decoration-2"
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
              >
                Back
              </button>
              <button 
                onClick={handleFinishAddress} 
<<<<<<< HEAD
                className="px-12 py-4 rounded-[20px] bg-[#1A1A1A] text-white font-bold text-lg hover:bg-black transition-all shadow-xl active:scale-[0.98]"
=======
                className="px-10 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-black transition-all shadow-xl active:scale-[0.98]"
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
