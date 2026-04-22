"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type BrowseTab = "homes" | "experiences" | "services";

type Props = {
  browseTab: BrowseTab;
  locationOptions: string[];
  countryLabel?: string;
  placeholder?: string;
};

export function ExploreLocationSearch({
  browseTab,
  locationOptions,
  countryLabel = "Nigeria",
  placeholder = "Search location to stay",
}: Props) {
  const router = useRouter();
  const [whereQuery, setWhereQuery] = useState("");
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  const getLocationMeta = (key: string) => {
    const parts = String(key || "").split(",");
    const city = parts[0]?.trim() || String(key || "").trim();
    const state = parts[1]?.trim() || city;
    return { city, state, stateCountry: `${state}, ${countryLabel}` };
  };

  const filteredOptions = useMemo(() => {
    const q = whereQuery.trim().toLowerCase();
    if (!q) return locationOptions.slice(0, 12);
    return locationOptions.filter((k) => k.toLowerCase().includes(q)).slice(0, 12);
  }, [locationOptions, whereQuery]);

  const resolveLocation = (input: string) => {
    const raw = input.trim();
    if (!raw) return null;
    const normalized = raw.toLowerCase();
    return (
      locationOptions.find((k) => k.toLowerCase() === normalized) ||
      locationOptions.find((k) => k.split(",")[0]?.trim().toLowerCase() === normalized) ||
      locationOptions.find((k) => k.toLowerCase().includes(normalized)) ||
      null
    );
  };

  const navigateToWhere = (input: string) => {
    const match = resolveLocation(input);
    if (!match) return;
    const href =
      browseTab === "homes"
        ? `/locations/${encodeURIComponent(match)}`
        : `/locations/${encodeURIComponent(match)}?tab=${encodeURIComponent(browseTab)}`;
    setOpen(false);
    router.push(href);
  };

  return (
    <div className="relative z-50">
      <div className="bg-white shadow-xl rounded-full border border-slate-200 shadow-sm overflow-hidden flex items-stretch">
        <div className="flex-1 px-8 py-4">
          <div className="text-[12px] font-bold text-slate-900">Where</div>
          <input
            value={whereQuery}
            onChange={(e) => setWhereQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                navigateToWhere(whereQuery);
              }
            }}
            onFocus={() => {
              if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
              setOpen(true);
            }}
            onBlur={() => {
              closeTimerRef.current = window.setTimeout(() => setOpen(false), 120);
            }}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none text-sm font-semibold text-slate-600 placeholder:text-slate-400"
          />
        </div>

        <div className="px-3 py-3 flex items-center">
          <button
            type="button"
            onClick={() => navigateToWhere(whereQuery)}
            className="px-6 h-12 rounded-full bg-green-500 text-white font-bold shadow-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <i className="ph-bold ph-magnifying-glass text-xl" />
            <span className="hidden md:block">Search</span>
          </button>
        </div>
      </div>

      {open ? (
        <div className="absolute left-0 right-0 md:right-auto top-full mt-3 w-full md:w-[520px] bg-white rounded-[18px] border border-slate-200 shadow-2xl overflow-hidden">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between gap-3">
            <div className="text-xs font-bold text-slate-600">Suggested destinations</div>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setOpen(false)}
              className="text-sm underline font-bold text-red-500 hover:text-red-900 transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="max-h-[40vh] overflow-y-auto px-2 pb-4">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setWhereQuery("");
                setOpen(false);
              }}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-slate-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <i className="ph-bold ph-navigation-arrow text-2xl text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900">Nearby</div>
                <div className="text-sm text-slate-500">Find what’s around you</div>
              </div>
            </button>

            {filteredOptions.map((locationKey, idx) => {
              const palette = [
                { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600", icon: "ph-buildings" },
                { bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-600", icon: "ph-house-line" },
                { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-600", icon: "ph-map-pin" },
                { bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-600", icon: "ph-mountains" },
                { bg: "bg-cyan-50", border: "border-cyan-100", text: "text-cyan-600", icon: "ph-buildings" },
                { bg: "bg-fuchsia-50", border: "border-fuchsia-100", text: "text-fuchsia-600", icon: "ph-house-line" },
              ];
              const style = palette[idx % palette.length]!;
              const meta = getLocationMeta(locationKey);
              return (
                <button
                  key={locationKey}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setWhereQuery(locationKey);
                    navigateToWhere(locationKey);
                  }}
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-2xl ${style.bg} border ${style.border} flex items-center justify-center`}>
                    <i className={`ph-bold ${style.icon} text-2xl ${style.text}`} />
                  </div>
                  <div className="text-left min-w-0">
                    <div className="font-bold text-slate-900 truncate">{locationKey}</div>
                    <div className="text-sm text-slate-500 truncate">{meta.stateCountry}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
