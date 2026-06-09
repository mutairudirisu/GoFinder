"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ListingsSearchHeader,
  type ListingsSearchOption,
} from "@/components/listings/ListingsSearchHeader";

type BrowseTab = "homes" | "experiences" | "services";

type Props = {
  browseTab: BrowseTab;
  locationOptions: string[];
  countryLabel?: string;
  placeholder?: string;
  selectedType?: string;
  typeOptions?: ListingsSearchOption[];
  onTypeChange?: (next: string) => void;
  className?: string;
};

export function ExploreLocationSearch({
  browseTab,
  locationOptions,
  countryLabel = "Nigeria",
  placeholder = "Search States/Cities/Neighborhoods",
  selectedType = "ALL",
  typeOptions = [],
  onTypeChange,
  className,
}: Props) {
  const router = useRouter();
  const [whereQuery, setWhereQuery] = useState("");

  const filteredOptions = useMemo(() => {
    const q = whereQuery.trim().toLowerCase();
    const matches = q ? locationOptions.filter((key) => key.toLowerCase().includes(q)) : locationOptions;
    return matches.slice(0, 12);
  }, [locationOptions, whereQuery]);

  const searchOptions = useMemo<ListingsSearchOption[]>(() => {
    const palette = [
      "ph-bold ph-buildings",
      "ph-bold ph-house-line",
      "ph-bold ph-map-pin",
      "ph-bold ph-navigation-arrow",
    ];

    return filteredOptions.map((locationKey, index) => {
      const parts = String(locationKey || "").split(",");
      const city = parts[0]?.trim() || String(locationKey || "").trim();
      const state = parts[1]?.trim() || city;

      return {
        value: locationKey,
        label: locationKey,
        subtitle: `${state}, ${countryLabel}`,
        iconClassName: palette[index % palette.length] ?? "ph-bold ph-map-pin",
      };
    });
  }, [countryLabel, filteredOptions]);

  const resolveLocation = (input: string) => {
    const raw = input.trim();
    if (!raw) return null;
    const normalized = raw.toLowerCase();
    return (
      locationOptions.find((key) => key.toLowerCase() === normalized) ||
      locationOptions.find((key) => key.split(",")[0]?.trim().toLowerCase() === normalized) ||
      locationOptions.find((key) => key.toLowerCase().includes(normalized)) ||
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
    router.push(href);
  };

  const selectedTypeLabel =
    selectedType === "ALL"
      ? "Any type"
      : typeOptions.find((option) => option.value === selectedType)?.label ?? selectedType.replaceAll("_", " ");

  return (
    <ListingsSearchHeader
      className={className}
      browseTab={browseTab}
      locationValue={whereQuery}
      locationPlaceholder={placeholder}
      locationOptions={searchOptions}
      onLocationInputChange={setWhereQuery}
      onLocationSelect={navigateToWhere}
      onLocationSubmit={navigateToWhere}
      selectedType={selectedType}
      typeOptions={typeOptions}
      typePlaceholder="Property type"
      onTypeChange={onTypeChange}
      mobileTitle="Search Properties"
      mobileSubtitle={`Anywhere / Anytime / ${selectedTypeLabel}`}
    />
  );
}
