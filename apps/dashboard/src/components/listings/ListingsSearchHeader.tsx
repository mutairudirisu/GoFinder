"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

export type ListingsSearchOption = {
  value: string;
  label?: string;
  subtitle?: string;
  iconClassName?: string;
};

type ListingsSearchHeaderProps = {
  locationValue?: string;
  locationDisplayValue?: string;
  locationPlaceholder?: string;
  locationOptions?: ListingsSearchOption[];
  locationEmptyLabel?: string;
  onLocationInputChange?: (next: string) => void;
  onLocationSelect?: (value: string) => void;
  onLocationSubmit?: (value: string) => void;
  selectedType?: string;
  typeOptions?: ListingsSearchOption[];
  typePlaceholder?: string;
  onTypeChange?: (next: string) => void;
  showType?: boolean;
  availabilityLabel?: string;
  onAvailabilityClick?: () => void;
  showAvailability?: boolean;
  onFilterClick?: () => void;
  onBackClick?: () => void;
  activeFiltersCount?: number;
  browseTab?: "homes" | "experiences" | "services";
  mobileTitle?: string;
  mobileSubtitle?: string;
  className?: string;
  leadingContent?: ReactNode;
};

const iconButtonClass =
  "rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20";

const AMENITIES = [
  { label: "24/7 Electricity", icon: "ph ph-lightning" },
  { label: "Solar Power", icon: "ph ph-sun" },
  { label: "Inverter", icon: "ph ph-lightning" },
  { label: "Generator", icon: "ph ph-lightning" },
  { label: "Borehole Water", icon: "ph ph-sparkles" },
  { label: "Water Tank", icon: "ph ph-sparkles" },
  { label: "Utilities Included", icon: "ph ph-lightbulb" },
  { label: "WiFi", icon: "ph ph-wifi-high" },
  { label: "High-Speed Internet", icon: "ph ph-wifi-high" },
  { label: "Co-working Space", icon: "ph ph-briefcase" },
  { label: "Work Desk", icon: "ph ph-desktop" },
  { label: "Chair", icon: "ph ph-user" },
  { label: "Table", icon: "ph ph-tray" },
  { label: "Air Conditioning", icon: "ph ph-sun" },
  { label: "Fan", icon: "ph ph-sun" },
  { label: "Private Bathroom", icon: "ph ph-user" },
];

export function ListingsSearchHeader({
  
  locationValue,
  locationDisplayValue,
  locationPlaceholder = "Search States/Cities/Neighborhoods",
  locationOptions = [],
  locationEmptyLabel = "No matches found",
  onLocationInputChange,
  onLocationSelect,
  onLocationSubmit,
  selectedType = "ALL",
  typeOptions = [],
  typePlaceholder = "Property type",
  onTypeChange,
  showType = true,
  availabilityLabel = "Availability",
  onAvailabilityClick,
  showAvailability = true,
  onFilterClick,
  onBackClick,
  activeFiltersCount = 0,
  browseTab = "homes",
  mobileTitle = "Search Properties",
  mobileSubtitle = "Anywhere / Anytime / Any type",
  className = "",
  leadingContent,
}: ListingsSearchHeaderProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [internalLocationValue, setInternalLocationValue] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Recommended");
  const [priceRange, setPriceRange] = useState({ min: 30000, max: 2000000 });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const dragY = useMotionValue(0);

  const currentLocationValue = locationValue ?? internalLocationValue;
  const typeLabel = useMemo(() => {
    if (selectedType === "ALL") return typePlaceholder;
    return typeOptions.find((option) => option.value === selectedType)?.label ?? typePlaceholder;
  }, [selectedType, typeOptions, typePlaceholder]);

  const locationButtonLabel = locationDisplayValue || currentLocationValue || locationPlaceholder;
  const isLocationPlaceholder = !locationDisplayValue && !currentLocationValue;
  const hasTypeOptions = typeOptions.length > 0;

  useEffect(() => {
    if (!locationOpen && !typeOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setLocationOpen(false);
        setTypeOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [locationOpen, typeOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const setLocationValue = (next: string) => {
    if (onLocationInputChange) {
      onLocationInputChange(next);
      return;
    }
    setInternalLocationValue(next);
  };

  const submitLocation = () => {
    onLocationSubmit?.(currentLocationValue);
    setLocationOpen(false);
    setMobileOpen(false);
  };

  const selectLocation = (value: string) => {
    setLocationValue(value);
    onLocationSelect?.(value);
    setLocationOpen(false);
    setMobileOpen(false);
  };

  const selectType = (value: string) => {
    onTypeChange?.(value);
    setTypeOpen(false);
  };

  const openFilters = () => {
    if (onFilterClick) {
      onFilterClick();
      return;
    }
    if (showType && hasTypeOptions) setTypeOpen(true);
  };

  const renderLocationOptions = (compact = false) => (
    <div className={compact ? "divide-y divide-slate-50" : "max-h-[45vh] overflow-y-auto px-2 pb-4"}>
      {locationOptions.length > 0 ? (
        locationOptions.map((option) => (
          <button
            key={`${option.value}:${option.label ?? ""}`}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => selectLocation(option.value)}
            className={`w-full flex items-center gap-4 text-left transition-colors hover:bg-slate-50 ${
              compact ? "px-5 py-4" : "px-4 py-4 rounded-2xl"
            }`}
          >
            <div className={compact ? "shrink-0" : "w-11 h-11 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0"}>
              <i className={`${option.iconClassName ?? "ph-bold ph-map-pin"} ${compact ? "text-lg text-slate-400" : "text-xl text-brand-600"}`} />
            </div>
            <div className="min-w-0">
              <div className={`text-slate-900 truncate ${compact ? "text-[15px] font-medium" : "font-bold"}`}>{option.label ?? option.value}</div>
              {option.subtitle && !compact ? <div className="text-sm text-slate-500 truncate">{option.subtitle}</div> : null}
            </div>
          </button>
        ))
      ) : (
        <div className="px-5 py-6 text-sm text-slate-500">{locationEmptyLabel}</div>
      )}
    </div>
  );

  const renderTypeOptions = (compact = false) => (
    <div className={compact ? "flex flex-wrap gap-2 pt-2" : "p-2"}>
      {typeOptions.map((option) => {
        const active = option.value === selectedType;
        const iconClassName = option.iconClassName || "ph ph-house";
        
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => selectType(option.value)}
            className={`${
              compact 
                ? "px-4 py-2 rounded-full border text-[13px] flex items-center gap-2 transition-all" 
                : "w-full px-4 py-3 rounded-2xl flex items-center justify-between gap-4 text-sm font-bold transition-colors"
            } ${
              active
                ? compact ? "bg-slate-900 text-white border-slate-900" : "bg-slate-900 text-white"
                : compact ? "bg-white text-slate-600 border-slate-200 hover:border-slate-300" : "bg-white text-slate-700 hover:bg-brand-50 hover:text-brand-700"
            }`}
          >
            {compact && <i className={`${iconClassName} text-sm`} />}
            <span className={compact ? "font-medium" : "truncate"}>{option.label ?? option.value}</span>
            {!compact && active ? <i className="ph-bold ph-check text-sm" /> : null}
          </button>
        );
      })}
    </div>
  );

  return (
    <header className={`w-full z-40 bg-white border-b border-slate-100`}>
      <div
        ref={rootRef}
        className="relative w-full"
        tabIndex={0}
      >
        <div className="hidden md:block pointer-events-none">
          <div
            className="absolute left-0 top-0 h-full w-[20%] opacity-80 mix-blend-multiply"
            style={{
              backgroundImage:
                "radial-gradient(circle at 12px 12px, rgba(34,197,94,0.16) 0 2px, transparent 2px)",
              backgroundPosition: "left center",
              backgroundRepeat: "repeat",
              backgroundSize: "24px 24px",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-white" />
          </div>
          <div
            className="absolute right-0 top-0 h-full w-[20%] opacity-80 mix-blend-multiply"
            style={{
              backgroundImage:
                "radial-gradient(circle at 12px 12px, rgba(34,197,94,0.16) 0 2px, transparent 2px)",
              backgroundPosition: "right center",
              backgroundRepeat: "repeat",
              backgroundSize: "24px 24px",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/80 to-white" />
          </div>
        </div>

        <div className="relative z-10 flex w-full max-w-5xl items-center justify-center gap-3 px-2 md:px-4 py-0 mx-auto transition-all duration-300 ease-in-out md:py-6">
          {leadingContent ? <div className="hidden md:block shrink-0">{leadingContent}</div> : null}

          <div className="hidden w-full max-w-5xl rounded-full bg-slate-100 p-2.5 mx-auto transition-all duration-300 ease-in-out md:block">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openFilters}
                className={`${iconButtonClass} relative flex h-12 w-12 shrink-0 items-center justify-center`}
                aria-label="Filters"
              >
                <i className="ph-bold ph-sliders-horizontal text-lg text-zinc-600" />
                {activeFiltersCount > 0 ? (
                  <span className="absolute -right-1 -top-1 min-w-5 h-5 px-1 rounded-full bg-slate-900 text-white text-[10px] font-bold inline-flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                ) : null}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex w-full items-center gap-2 pl-2">
                  <div className="relative flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => {
                        setLocationOpen((open) => !open);
                        setTypeOpen(false);
                      }}
                      className="flex h-[52px] w-full cursor-pointer items-center justify-between gap-2 rounded-full bg-white px-5 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      aria-haspopup="dialog"
                      aria-expanded={locationOpen}
                    >
                      <span className="flex min-w-0 flex-1 items-center gap-2">
                        <i className="ph-bold ph-map-pin text-xl text-brand-600 shrink-0" />
                        <span
                          className={`block truncate text-left text-sm ${
                            isLocationPlaceholder ? "text-zinc-500" : "text-zinc-800 font-medium"
                          }`}
                        >
                          {locationButtonLabel}
                        </span>
                      </span>
                      <i className="ph ph-caret-down text-zinc-400 shrink-0" />
                    </button>

                    {locationOpen ? (
                      <div className="absolute left-0 top-full z-[80] mt-3 w-full min-w-[340px] overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-2xl">
                        <div className="p-4 border-b border-slate-100">
                          <label className="flex h-12 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 focus-within:border-brand-300 focus-within:bg-white">
                            <i className="ph ph-magnifying-glass text-slate-400" />
                            <input
                              value={currentLocationValue}
                              onChange={(event) => setLocationValue(event.target.value)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  submitLocation();
                                }
                              }}
                              placeholder={locationPlaceholder}
                              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                              autoFocus
                            />
                          </label>
                        </div>
                        {renderLocationOptions()}
                      </div>
                    ) : null}
                  </div>

                  {showAvailability ? (
                    <div
                      className="flex h-[52px] w-full flex-1 min-w-0 items-center justify-between rounded-full bg-white px-5 text-sm font-normal text-zinc-700 transition-colors opacity-70 cursor-not-allowed"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <i className="ph-bold ph-calendar-blank text-xl text-brand-600 shrink-0" />
                        <span className="truncate">{availabilityLabel}</span>
                      </span>
                      <i className="ph ph-caret-down ml-2 text-zinc-400 shrink-0" />
                    </div>
                  ) : null}

                  {showType ? (
                    <div className="relative flex h-[52px] flex-1 min-w-0 items-center gap-2 rounded-full bg-white px-5">
                      <button
                        type="button"
                        onClick={() => {
                          setTypeOpen((open) => !open);
                          setLocationOpen(false);
                        }}
                        className="flex w-full min-w-0 items-center justify-between gap-2 bg-transparent text-left text-sm text-zinc-700 outline-none"
                        aria-haspopup="listbox"
                        aria-expanded={typeOpen}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <i className="ph-bold ph-house-line text-lg text-brand-600 shrink-0" />
                          <span className="truncate">{typeLabel}</span>
                        </span>
                        <i className="ph ph-caret-down text-zinc-400 shrink-0" />
                      </button>

                      {typeOpen ? (
                        <div className="absolute left-0 top-full z-[80] mt-3 w-full min-w-[240px] overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-2xl">
                          {hasTypeOptions ? renderTypeOptions() : <div className="p-4 text-sm text-slate-500">No property types yet</div>}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={submitLocation}
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition-all hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    aria-label="Search"
                  >
                    <i className="ph-bold ph-magnifying-glass text-lg" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:hidden px-1 pt-2 pb-3 flex items-center gap-1.5">
            {onBackClick && (
              <button
                type="button"
                onClick={onBackClick}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm text-slate-700 active:scale-95 transition-transform"
                aria-label="Go back"
              >
                <i className="ph ph-arrow-left text-lg" />
              </button>
            )}
            <button
              className="flex-1 flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition-all hover:border-brand-500/30 hover:shadow-md"
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={mobileOpen}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 border border-slate-100 shrink-0">
                <i className="ph ph-magnifying-glass text-lg text-slate-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-slate-900">{mobileTitle}</p>
                <p className="truncate text-xs text-slate-500 font-medium">{mobileSubtitle}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[9999] md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              style={{ y: dragY }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 150) setMobileOpen(false);
                else dragY.set(0);
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-hidden rounded-t-[32px] bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 z-30 bg-white">
                <div className="flex justify-center py-3 touch-none">
                  <div className="h-1.5 w-12 rounded-full bg-slate-200" />
                </div>

                <div className="px-6 pb-4 border-b border-slate-50 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 shrink-0">
                      <i className="ph ph-sliders-horizontal text-xl text-slate-900" />
                    </div>
                    <div className="font-display text-xl font-bold text-slate-900">Search & Filters</div>
                  </div>

                  {/* Categories inside modal to avoid overlapping */}
                  <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
                    <button 
                      onClick={() => onBackClick?.()}
                      className={`flex flex-col items-center gap-1.5 min-w-fit transition-all ${browseTab === 'homes' ? 'text-slate-900' : 'text-slate-400'}`}
                    >
                      <div className="flex items-center gap-2">
                        <i className={`ph ph-house-line text-lg ${browseTab === 'homes' ? 'text-brand-600' : ''}`} />
                        <span className="text-[13px] font-bold">Homes</span>
                      </div>
                      <div className={`h-0.5 w-full rounded-full bg-brand-500 transition-all ${browseTab === 'homes' ? 'opacity-100' : 'opacity-0'}`} />
                    </button>

                    <button 
                      className="flex flex-col items-center gap-1.5 min-w-fit text-slate-400 opacity-70 cursor-not-allowed"
                      disabled
                    >
                      <div className="flex items-center gap-2">
                        <i className="ph ph-planet text-lg" />
                        <span className="text-[13px] font-bold">Experiences</span>
                        <span className="text-[9px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">Soon</span>
                      </div>
                      <div className="h-0.5 w-full rounded-full bg-transparent" />
                    </button>

                    <button 
                      className="flex flex-col items-center gap-1.5 min-w-fit text-slate-400 opacity-70 cursor-not-allowed"
                      disabled
                    >
                      <div className="flex items-center gap-2">
                        <i className="ph ph-wrench text-lg" />
                        <span className="text-[13px] font-bold">Services</span>
                        <span className="text-[9px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">Soon</span>
                      </div>
                      <div className="h-0.5 w-full rounded-full bg-transparent" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="max-h-[calc(92dvh-140px)] overflow-y-auto px-6 py-6 space-y-8 pb-28">
                {/* Search Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Search</h3>
                  
                  <div className="space-y-3">
                    {/* Location Field */}
                    <div className="relative group">
                      <label className={`flex h-[60px] items-center gap-4 border border-slate-100 bg-white px-5 shadow-sm focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all rounded-2xl`}>
                        <i className="ph ph-map-pin text-xl text-brand-600" />
                        <input
                          value={currentLocationValue}
                          onChange={(event) => setLocationValue(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              submitLocation();
                            }
                          }}
                          placeholder={locationPlaceholder}
                          className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                        />
                        {currentLocationValue.trim() ? (
                          <button 
                            type="button"
                            onClick={() => setLocationValue("")}
                            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                          >
                            <i className="ph ph-x text-slate-400" />
                          </button>
                        ) : (
                          <i className="ph ph-caret-down text-slate-400" />
                        )}
                      </label>
                      
                      {currentLocationValue.trim() && (
                        <div className="mt-2 border border-slate-100 bg-white rounded-2xl shadow-xl overflow-hidden">
                          {renderLocationOptions(true)}
                        </div>
                      )}
                    </div>

                    {/* Availability Field */}
                    <div
                      className="flex h-[60px] w-full items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 shadow-sm opacity-60 cursor-not-allowed"
                    >
                      <span className="flex items-center gap-4">
                        <i className="ph ph-calendar-blank text-xl text-brand-600" />
                        <span className="text-sm font-semibold text-slate-900">{availabilityLabel}</span>
                      </span>
                      <i className="ph ph-caret-down text-slate-400" />
                    </div>

                    {/* Property Type Field */}
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => setTypeOpen(!typeOpen)}
                        className="flex h-[64px] w-full items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 shadow-sm transition-all hover:bg-slate-50"
                      >
                        <span className="flex items-center gap-4">
                          <i className="ph ph-house-line text-xl text-[#0B7A3E]" />
                          <span className="text-sm font-bold text-slate-900">{typeLabel}</span>
                        </span>
                        <i className={`ph ph-caret-down text-slate-400 transition-transform duration-300 ${typeOpen ? "rotate-180" : ""}`} />
                      </button>
                      
                      <AnimatePresence>
                        {typeOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="pb-2">
                              {renderTypeOptions(true)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Advanced Filters Button */}
                    <div className="space-y-6">
                      <button
                        type="button"
                        onClick={() => setAdvancedOpen(!advancedOpen)}
                        className="flex h-[72px] w-full items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 shadow-sm transition-all hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100">
                            <i className="ph ph-sliders-horizontal text-xl text-slate-500" />
                          </div>
                          <span className="text-sm font-bold text-slate-900">Advanced Filters</span>
                        </div>
                        <i className={`ph ph-caret-down text-slate-400 transition-transform duration-300 ${advancedOpen ? "rotate-180" : ""}`} />
                      </button>

                      <AnimatePresence>
                        {advancedOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                              {/* Price Range */}
                              <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900">Price range</h3>
                                <div className="flex items-center gap-4">
                                  <div className="flex-1 space-y-1.5">
                                    <span className="text-[11px] font-bold text-slate-400">Min</span>
                                    <div className="h-[56px] flex items-center justify-center rounded-2xl border border-slate-100 bg-white px-4 text-[15px] font-bold text-slate-900 shadow-sm">
                                      {priceRange.min.toLocaleString()}
                                    </div>
                                  </div>
                                  <span className="mt-6 text-slate-300">—</span>
                                  <div className="flex-1 space-y-1.5">
                                    <span className="text-[11px] font-bold text-slate-400">Max</span>
                                    <div className="h-[56px] flex items-center justify-center rounded-2xl border border-slate-100 bg-white px-4 text-[15px] font-bold text-slate-900 shadow-sm">
                                      {priceRange.max.toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                                <div className="relative pt-10 pb-2 px-4">
                                  <div className="h-1.5 w-full bg-slate-100 rounded-full relative">
                                    <div 
                                      className="absolute h-full bg-[#0B7A3E] rounded-full" 
                                      style={{ 
                                        left: `${((priceRange.min - 30000) / 2970000) * 100}%`,
                                        right: `${100 - ((priceRange.max - 30000) / 2970000) * 100}%`
                                      }}
                                    />
                                    <div 
                                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-[#0B7A3E] shadow-md cursor-pointer z-10"
                                      style={{ left: `${((priceRange.min - 30000) / 2970000) * 100}%` }}
                                    />
                                    <div 
                                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-[#0B7A3E] shadow-md cursor-pointer z-10"
                                      style={{ left: `${((priceRange.max - 30000) / 2970000) * 100}%` }}
                                    />
                                  </div>
                                  <div className="flex items-center justify-between mt-8">
                                    <span className="text-[12px] font-bold text-slate-400">₦30k</span>
                                    <span className="text-[12px] font-bold text-slate-400">₦2.0M</span>
                                  </div>
                                </div>
                              </div>

                              {/* Sort By */}
                              <div className="space-y-4 pt-4">
                                <h3 className="text-sm font-bold text-slate-900">Sort results by</h3>
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => setSortOpen(!sortOpen)}
                                    className="flex h-[60px] w-full items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 shadow-sm"
                                  >
                                    <span className="text-sm font-medium text-slate-600">{sortBy}</span>
                                    <i className={`ph ph-caret-down text-slate-400 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`} />
                                  </button>
                                  
                                  <AnimatePresence>
                                    {sortOpen && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        className="absolute left-0 top-full z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl"
                                      >
                                        {["Recommended", "Closest", "Price: Low to High", "Price: High to Low"].map((option) => {
                                          const isActive = sortBy === option;
                                          return (
                                            <button
                                              key={option}
                                              type="button"
                                              onClick={() => {
                                                setSortBy(option);
                                                setSortOpen(false);
                                              }}
                                              className={`flex w-full items-center justify-between px-5 py-4 text-left text-sm transition-colors ${
                                                isActive ? "bg-brand-50/50 text-[#0B7A3E] font-semibold" : "text-slate-600 hover:bg-slate-50"
                                              }`}
                                            >
                                              {option}
                                              {isActive && <i className="ph ph-check text-lg" />}
                                            </button>
                                          );
                                        })}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>

                              {/* Amenities */}
                              <div className="space-y-4 pt-6">
                                <h3 className="text-sm font-bold text-slate-900">Amenities</h3>
                                <div className="grid grid-cols-2 gap-3">
                                  {AMENITIES.map((amenity) => {
                                    const isSelected = selectedAmenities.includes(amenity.label);
                                    return (
                                      <button
                                        key={amenity.label}
                                        onClick={() => {
                                          setSelectedAmenities(prev => 
                                            isSelected ? prev.filter(a => a !== amenity.label) : [...prev, amenity.label]
                                          );
                                        }}
                                        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all text-left ${
                                          isSelected 
                                            ? "border-[#0B7A3E] bg-brand-50/50" 
                                            : "border-slate-100 bg-white hover:bg-slate-50"
                                        }`}
                                      >
                                        <i className={`${amenity.icon} text-lg ${isSelected ? "text-[#0B7A3E]" : "text-slate-400"}`} />
                                        <span className={`text-[12px] font-medium truncate ${isSelected ? "text-[#0B7A3E]" : "text-slate-600"}`}>
                                          {amenity.label}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="sticky bottom-0 z-30 bg-white border-t border-slate-100 px-6 py-5 pb-4 flex items-center justify-between gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <button
                  type="button"
                  onClick={() => {
                    setInternalLocationValue("");
                    onTypeChange?.("ALL");
                    setSelectedAmenities([]);
                    setPriceRange({ min: 30000, max: 2000000 });
                  }}
                  className="text-sm font-bold text-slate-500 underline underline-offset-4"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={submitLocation}
                  className="px-10 py-4 rounded-2xl bg-[#0B7A3E] text-white font-bold shadow-sm hover:bg-[#096332] transition-all active:scale-95 flex items-center gap-2"
                >
                  Search & Go
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default ListingsSearchHeader;