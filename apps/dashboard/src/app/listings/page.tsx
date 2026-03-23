"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { SearchBar, ListingCard } from "@/components/listings";
import { mockProperties, locations, propertyTypes, priceRanges, type PriceRange } from "./data";

const defaultPriceRange: PriceRange = { label: 'Any Price', min: 0, max: Infinity };

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedPrice, setSelectedPrice] = useState<PriceRange>(defaultPriceRange);
  const [showFilters, setShowFilters] = useState(false);

  // Filter properties based on search criteria
  const filteredProperties = useMemo(() => {
    return mockProperties.filter((property: any) => {
      const matchesSearch = 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.amenities.some((a: string) => a.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLocation = 
        selectedLocation === "All Locations" || 
        property.location.toLowerCase().includes(selectedLocation.toLowerCase());

      const matchesType = 
        selectedType === "All Types" || 
        property.type.toLowerCase() === selectedType.toLowerCase();

      const matchesPrice = 
        property.price >= selectedPrice.min && 
        property.price <= selectedPrice.max;

      return matchesSearch && matchesLocation && matchesType && matchesPrice;
    });
  }, [searchQuery, selectedLocation, selectedType, selectedPrice]);

  const handleSearch = (query: string, location: string) => {
    setSearchQuery(query);
    if (location !== "All Locations") {
      setSelectedLocation(location);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("All Locations");
    setSelectedType("All Types");
    setSelectedPrice(defaultPriceRange);
  };

  const activeFiltersCount = [
    selectedLocation !== "All Locations",
    selectedType !== "All Types",
    selectedPrice.label !== "Any Price"
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Listings</h1>
          <Link 
            href="/listings/create" 
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            + Create Listing
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-green-50 via-white to-green-50/30 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="font-bold text-3xl md:text-4xl text-gray-800 mb-3">
              Find Your <span className="text-green-500">Perfect Space</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover verified hostels, apartments, and rooms from trusted landlords across Nigeria
            </p>
          </div>
          <SearchBar onSearch={handleSearch} locations={locations} />
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-8">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-lg text-gray-800">
              {filteredProperties.length} Properties
            </h2>
            
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {selectedLocation !== "All Locations" && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center gap-1">
                    {selectedLocation}
                    <button onClick={() => setSelectedLocation("All Locations")} className="hover:text-green-900">×</button>
                  </span>
                )}
                {selectedType !== "All Types" && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center gap-1">
                    {selectedType}
                    <button onClick={() => setSelectedType("All Types")} className="hover:text-green-900">×</button>
                  </span>
                )}
                {selectedPrice.label !== "Any Price" && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center gap-1">
                    {selectedPrice.label}
                    <button onClick={() => setSelectedPrice(defaultPriceRange)} className="hover:text-green-900">×</button>
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-gray-600 font-medium text-sm"
            >
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="lg:hidden mb-6">
            <div className="flex gap-4 overflow-x-auto pb-2">
              <div className="flex-shrink-0">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Type</p>
                <div className="flex gap-2">
                  {propertyTypes.map((type: string) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                        selectedType === type ? 'bg-green-500 text-white' : 'bg-white border border-gray-200 text-gray-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-shrink-0">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Price</p>
                <div className="flex gap-2">
                  {priceRanges.map((range: PriceRange) => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPrice(range)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                        selectedPrice.label === range.label ? 'bg-green-500 text-white' : 'bg-white border border-gray-200 text-gray-600'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-shrink-0">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Location</p>
                <div className="flex gap-2">
                  {locations.slice(0, 4).map((location: string) => (
                    <button
                      key={location}
                      onClick={() => setSelectedLocation(location)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                        selectedLocation === location ? 'bg-green-500 text-white' : 'bg-white border border-gray-200 text-gray-600'
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Filters */}
        <div className="hidden lg:flex gap-6 mb-10">
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Property Type</h3>
            <div className="space-y-2">
              {propertyTypes.map((type: string) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl ${
                    selectedType === type ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Price Range</h3>
            <div className="space-y-2">
              {priceRanges.map((range: PriceRange) => (
                <button
                  key={range.label}
                  onClick={() => setSelectedPrice(range)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl ${
                    selectedPrice.label === range.label ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Location</h3>
            <div className="space-y-2">
              {locations.map((location: string) => (
                <button
                  key={location}
                  onClick={() => setSelectedLocation(location)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl ${
                    selectedLocation === location ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="mb-6 text-green-600 font-medium hover:text-green-700 flex items-center gap-2"
          >
            Clear all filters
          </button>
        )}

        {/* Listings Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property: any, index: number) => (
              <ListingCard key={property.id} property={property} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏠</span>
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-2">No Properties Found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More */}
        {filteredProperties.length > 0 && (
          <div className="text-center mt-10">
            <button className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-800 font-semibold rounded-2xl hover:border-green-300 hover:shadow-lg transition-all">
              Load More Properties
            </button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="py-12 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-bold text-2xl text-white mb-4">Are You a Landlord?</h2>
          <p className="text-green-100 mb-6">List your property on GIGS Rentals and reach thousands of students</p>
          <Link 
            href="/listings/create" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            + List Your Property
          </Link>
        </div>
      </div>
    </div>
  );
}
