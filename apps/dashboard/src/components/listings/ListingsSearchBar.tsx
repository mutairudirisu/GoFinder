"use client";

import { useMemo, useState } from "react";

type Option = { label: string; value: string };

export function ListingsSearchBar({
  query,
  onQueryChange,
  placeholder = "Search destinations, titles, streets...",
  selectedCity,
  onCityChange,
  cityOptions,
  selectedType,
  onTypeChange,
  typeOptions,
  showCity = true,
  showType = true,
  showSearchButton = true,
  variant = "hero",
}: {
  query: string;
  onQueryChange: (next: string) => void;
  placeholder?: string;
  selectedCity?: string;
  onCityChange?: (next: string) => void;
  cityOptions?: Option[];
  selectedType?: string;
  onTypeChange?: (next: string) => void;
  typeOptions?: Option[];
  showCity?: boolean;
  showType?: boolean;
  showSearchButton?: boolean;
  variant?: "hero" | "compact";
}) {
  const options = useMemo(() => {
    return {
      cities: cityOptions ?? [],
      types: typeOptions ?? [],
    };
  }, [cityOptions, typeOptions]);

  const containerClass =
    variant === "compact"
      ? "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex items-center"
      : "bg-white rounded-full border border-slate-200 shadow-sm overflow-hidden flex items-center";

  const inputPadding = variant === "compact" ? "px-4 py-3" : "px-5 py-6";
  const dividerHeight = variant === "compact" ? "h-8" : "h-10";
  const [cityOpen, setCityOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);

  const cityLabel =
    options.cities.find((c) => c.value === (selectedCity ?? "ALL"))?.label ??
    options.cities.find((c) => c.value === "ALL")?.label ??
    "Anywhere";

  const typeLabel =
    options.types.find((t) => t.value === (selectedType ?? "ALL"))?.label ??
    options.types.find((t) => t.value === "ALL")?.label ??
    "Any type";

  return (
    <>
      <div className={containerClass}>
        <div className={`flex-1 flex items-center gap-3 ${inputPadding}`}>
        <i className="ph ph-magnifying-glass text-slate-400 text-lg"></i>
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
        />
        {query.trim() !== "" ? (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
            aria-label="Clear search"
          >
            <i className="ph ph-x text-sm"></i>
          </button>
        ) : null}
        </div>

      {(showCity || showType) && <div className={`${dividerHeight} w-px bg-slate-200`} />}

      {(showCity || showType || showSearchButton) && (
        <div className={`flex items-center gap-2 ${variant === "compact" ? "px-3 py-2" : "px-4 py-2"}`}>
          {showCity ? (
            <div className="hidden sm:flex items-center gap-2">
              <i className="ph ph-map-pin text-slate-400"></i>
              <button
                type="button"
                onClick={() => setCityOpen(true)}
                className="text-sm font-bold text-slate-700 hover:text-brand-700 transition-colors"
              >
                {cityLabel}
              </button>
            </div>
          ) : null}

          {showCity && showType ? <div className="h-8 w-px bg-slate-200 hidden sm:block" /> : null}

          {showType ? (
            <div className="flex items-center gap-2">
              <i className="ph ph-faders text-slate-400"></i>
              <button
                type="button"
                onClick={() => setTypeOpen(true)}
                className="text-sm font-bold text-slate-700 hover:text-brand-700 transition-colors"
              >
                {typeLabel}
              </button>
            </div>
          ) : null}

          {showSearchButton ? (
            <button
              type="button"
              className={`${variant === "compact" ? "w-9 h-9" : "w-10 h-10"} rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-colors`}
              aria-label="Search"
            >
              <i className="ph ph-magnifying-glass text-lg"></i>
            </button>
          ) : null}
        </div>
      )}
      </div>

      {cityOpen ? (
        <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-[28px] border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="font-bold text-slate-900">Select location</div>
              <button
                type="button"
                onClick={() => setCityOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-brand-50 hover:text-brand-700 transition-colors"
                aria-label="Close"
              >
                <i className="ph ph-x text-lg"></i>
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                {options.cities.map((c) => {
                  const active = (selectedCity ?? "ALL") === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => {
                        onCityChange?.(c.value);
                        setCityOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-colors ${
                        active ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:bg-brand-50 hover:border-brand-200"
                      }`}
                    >
                      <span className="font-bold text-slate-900">{c.label}</span>
                      {active ? <i className="ph-bold ph-check text-slate-900"></i> : <span className="w-5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {typeOpen ? (
        <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-[28px] border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="font-bold text-slate-900">Select filters</div>
              <button
                type="button"
                onClick={() => setTypeOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-brand-50 hover:text-brand-700 transition-colors"
                aria-label="Close"
              >
                <i className="ph ph-x text-lg"></i>
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                {options.types.map((t) => {
                  const active = (selectedType ?? "ALL") === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => {
                        onTypeChange?.(t.value);
                        setTypeOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-colors ${
                        active ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:bg-brand-50 hover:border-brand-200"
                      }`}
                    >
                      <span className="font-bold text-slate-900">{t.label}</span>
                      {active ? <i className="ph-bold ph-check text-slate-900"></i> : <span className="w-5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ListingsSearchBar;
