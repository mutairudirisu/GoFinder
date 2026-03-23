"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended';
  bookings: number;
  rating: number;
  views: number;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export default function HostingListingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Load host's listings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      // First check the new host listings storage
      const hostListings = localStorage.getItem("gigs_host_listings");
      if (hostListings) {
        const allListings = JSON.parse(hostListings);
        setListings(allListings);
      } else {
        // Fallback to old storage
        const storedListings = localStorage.getItem("gigs_listings");
        if (storedListings) {
          const allListings = JSON.parse(storedListings);
          // Filter to show only listings created by the current user
          const userListings = allListings.filter((listing: any) => listing.hostId === user?.id);
          setListings(userListings);
        }
      }
      setLoading(false);
    }
  }, [user]);

  // Redirect if not authorized
  useEffect(() => {
    if (user && user.role === 'renter') {
      router.replace("/listings");
    }
  }, [user, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'suspended':
        return 'bg-orange-100 text-orange-700';
      case 'draft':
        return 'bg-slate-100 text-slate-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Active';
      case 'pending':
        return 'Pending Review';
      case 'rejected':
        return 'Rejected';
      case 'suspended':
        return 'Suspended';
      case 'draft':
        return 'Draft';
      default:
        return status;
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-4 sm:mb-6 px-4 sm:px-4 lg:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl lg:text-2xl text-slate-800">My Listings</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage your properties</p>
        </div>
        <a 
          href="/listings/create"
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-brand-500 text-white rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm hover:bg-brand-600 transition-colors whitespace-nowrap"
        >
          <i className="ph-bold ph-plus"></i>
          <span className="hidden sm:inline">Add Listing</span>
          <span className="sm:hidden">Add</span>
        </a>
      </div>

      {/* Pending Verification Banner */}
      {listings.some(l => l.status === 'pending') && (
        <div className="px-4 sm:px-4 lg:px-6 mb-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ph-bold ph-clock text-amber-600 text-xl"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-800">Verification in Progress</h4>
              <p className="text-sm text-amber-700 mt-1">
                You have {listings.filter(l => l.status === 'pending').length} listing(s) waiting for admin review. 
                You'll be notified once approved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rejected Listings Banner */}
      {listings.some(l => l.status === 'rejected') && (
        <div className="px-4 sm:px-4 lg:px-6 mb-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ph-bold ph-warning text-red-600 text-xl"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-red-800">Action Required</h4>
              <p className="text-sm text-red-700 mt-1">
                You have {listings.filter(l => l.status === 'rejected').length} rejected listing(s). 
                Please review the feedback and resubmit.
              </p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="px-4 sm:px-4 lg:px-6 flex justify-center">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      ) : listings.length === 0 ? (
        <div className="px-4 sm:px-4 lg:px-6">
          <div className="bg-white rounded-lg sm:rounded-2xl border border-slate-200 p-6 sm:p-8 md:p-12 text-center">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <i className="ph ph-buildings text-3xl sm:text-4xl text-slate-300"></i>
            </div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-slate-800 mb-2">No listings yet</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6 max-w-sm mx-auto">
              Start earning by listing your first property on GIGS Rentals
            </p>
            <a 
              href="/listings/create"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-brand-500 text-white rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm hover:bg-brand-600 transition-colors"
            >
              <i className="ph-bold ph-plus"></i>
              Create Your First Listing
            </a>
          </div>
        </div>
      ) : (
        <div className="px-4 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg sm:rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Listing Image */}
              <div className="relative h-40 sm:h-48 bg-slate-100">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-2 sm:top-3 right-2 sm:right-3 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${getStatusColor(listing.status)}`}>
                  {getStatusLabel(listing.status)}
                </span>
              </div>

              {/* Listing Details */}
              <div className="p-3 sm:p-4">
                <h3 className="font-bold text-sm sm:text-base text-slate-800 mb-1 truncate">{listing.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-3 flex items-center gap-1">
                  <i className="ph ph-map-pin"></i>
                  <span className="truncate">{listing.location}</span>
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-3 sm:mb-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <i className="ph ph-currency-dollar text-brand-500"></i>
                    <span className="font-bold text-brand-600">{listing.price}</span>
                    <span className="text-slate-400">/night</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ph ph-star text-yellow-500"></i>
                    <span className="font-medium text-slate-700">{listing.rating}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 sm:pt-3 border-t border-slate-100">
                  <a
                    href={`/listings/${listing.id}`}
                    className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-center text-xs sm:text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                  >
                    View
                  </a>
                  <a
                    href={`/listings/${listing.id}/edit`}
                    className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-center text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Edit
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Listing Card */}
          <a
            href="/listings/create"
            className="bg-slate-50 rounded-lg sm:rounded-2xl border-2 border-dashed border-slate-200 p-4 sm:p-6 flex flex-col items-center justify-center text-center hover:border-brand-300 hover:bg-brand-50/30 transition-colors min-h-[220px] sm:min-h-[280px]"
          >
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-sm">
              <i className="ph-bold ph-plus text-xl sm:text-2xl text-brand-500"></i>
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-700 mb-1">Add New Listing</h3>
            <p className="text-xs sm:text-sm text-slate-500">Expand your rental portfolio</p>
          </a>
          </div>
        </div>
      )}
    </>
  );
}
