"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const mockStats = {
  views: 1247,
  viewsChange: 12.5,
  bookings: 23,
  bookingsChange: 8.2,
  earnings: 3450,
  earningsChange: 15.3,
};

const chartData = [
  { week: 'Week 1', occupancy: 65, bookings: 12 },
  { week: 'Week 2', occupancy: 72, bookings: 19 },
  { week: 'Week 3', occupancy: 68, bookings: 15 },
  { week: 'Week 4', occupancy: 85, bookings: 22 },
];

const maxOccupancy = 100;
const maxBookings = 25;

const mockBookings = [
  {
    id: 1,
    guestName: "Sarah Johnson",
    listing: "Modern Downtown Apartment",
    checkIn: "Mar 20, 2026",
    status: "confirmed",
    amount: "$450",
    avatar: "S"
  },
  {
    id: 2,
    guestName: "Michael Chen",
    listing: "Cozy Studio near Campus",
    checkIn: "Mar 22, 2026",
    status: "pending",
    amount: "$320",
    avatar: "M"
  },
  {
    id: 3,
    guestName: "Emily Davis",
    listing: "Spacious 2-Bedroom Flat",
    checkIn: "Mar 25, 2026",
    status: "confirmed",
    amount: "$680",
    avatar: "E"
  },
  {
    id: 4,
    guestName: "James Wilson",
    listing: "Modern Downtown Apartment",
    checkIn: "Mar 28, 2026",
    status: "confirmed",
    amount: "$450",
    avatar: "J"
  },
  {
    id: 5,
    guestName: "Lisa Anderson",
    listing: "Cozy Studio near Campus",
    checkIn: "Mar 30, 2026",
    status: "cancelled",
    amount: "$0",
    avatar: "L"
  },
];

export default function HostingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [pendingActions, setPendingActions] = useState<{ type: string; message: string; count: number }[]>([]);

  // Check for pending actions
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostListings = localStorage.getItem("gigs_host_listings");
      if (hostListings) {
        const listings = JSON.parse(hostListings);
        const actions: { type: string; message: string; count: number }[] = [];
        
        const pendingCount = listings.filter((l: any) => l.status === 'pending').length;
        const rejectedCount = listings.filter((l: any) => l.status === 'rejected').length;
        const draftCount = listings.filter((l: any) => l.status === 'draft').length;
        
        if (pendingCount > 0) {
          actions.push({ type: 'pending', message: `${pendingCount} listing(s) pending verification`, count: pendingCount });
        }
        if (rejectedCount > 0) {
          actions.push({ type: 'rejected', message: `${rejectedCount} listing(s) rejected - action required`, count: rejectedCount });
        }
        if (draftCount > 0) {
          actions.push({ type: 'draft', message: `${draftCount} draft listing(s) - complete to publish`, count: draftCount });
        }
        
        setPendingActions(actions);
      }
    }
  }, []);

  // Redirect if not authorized (handled by layout, but kept for safety)
  useEffect(() => {
    if (user && user.role === 'renter') {
      router.replace("/listings");
    }
  }, [user, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-slate-100 text-slate-500';
      default:
        return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <>
      {/* Dashboard Content */}
      {/* Welcome Message */}
      <div className="mb-4 sm:mb-6">
        <h2 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl text-slate-800">
          Welcome back, {user?.name || 'Host'}! 👋
        </h2>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Here's what's happening with your listings today.</p>
      </div>

      {/* Pending Actions Notifications */}
      {pendingActions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <i className="ph-bold ph-bell text-amber-600"></i>
            </div>
            <h3 className="font-display font-bold text-base sm:text-lg text-amber-800">
              Pending Actions Required
            </h3>
            <span className="ml-auto px-2 py-0.5 bg-amber-200 text-amber-800 text-xs font-bold rounded-full">
              {pendingActions.reduce((acc, a) => acc + a.count, 0)}
            </span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {pendingActions.map((action, index) => (
              <div 
                key={index}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  action.type === 'pending' ? 'bg-yellow-100/50' : 
                  action.type === 'rejected' ? 'bg-red-100/50' : 'bg-slate-100/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  action.type === 'pending' ? 'bg-yellow-200' : 
                  action.type === 'rejected' ? 'bg-red-200' : 'bg-slate-200'
                }`}>
                  <i className={`ph-bold ${
                    action.type === 'pending' ? 'ph-clock text-yellow-600' : 
                    action.type === 'rejected' ? 'ph-warning text-red-600' : 'ph-file text-slate-600'
                  } text-lg`}></i>
                </div>
                <p className={`text-sm font-medium ${
                  action.type === 'pending' ? 'text-yellow-800' : 
                  action.type === 'rejected' ? 'text-red-800' : 'text-slate-700'
                }`}>
                  {action.message}
                </p>
                <a 
                  href="/hosting/listings" 
                  className={`ml-auto text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                    action.type === 'pending' ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 
                    action.type === 'rejected' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-slate-500 text-white hover:bg-slate-600'
                  }`}
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        {/* Total Views */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="ph-bold ph-eye text-brand-600 text-lg sm:text-xl"></i>
            </div>
            <span className="text-xs sm:text-sm font-medium text-green-600 flex items-center gap-1 flex-shrink-0">
              <i className="ph-bold ph-trend-up"></i>
              +{mockStats.viewsChange}%
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm">Total Views</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">{mockStats.views.toLocaleString()}</p>
        </div>

        {/* Total Bookings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="ph-bold ph-calendar-check text-brand-600 text-lg sm:text-xl"></i>
            </div>
            <span className="text-xs sm:text-sm font-medium text-green-600 flex items-center gap-1 flex-shrink-0">
              <i className="ph-bold ph-trend-up"></i>
              +{mockStats.bookingsChange}%
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm">Total Bookings</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">{mockStats.bookings}</p>
        </div>

        {/* Total Earnings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="ph-bold ph-currency-dollar text-brand-600 text-lg sm:text-xl"></i>
            </div>
            <span className="text-xs sm:text-sm font-medium text-green-600 flex items-center gap-1 flex-shrink-0">
              <i className="ph-bold ph-trend-up"></i>
              +{mockStats.earningsChange}%
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm">Total Earnings</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">${mockStats.earnings.toLocaleString()}</p>
        </div>
      </div>

      {/* Booking/Occupancy Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 mb-6 sm:mb-8 overflow-x-auto">
        <h3 className="font-display font-bold text-base sm:text-lg text-slate-800 mb-4 sm:mb-6">Booking & Occupancy Overview</h3>
        <div className="flex items-end justify-between gap-2 sm:gap-4 h-40 sm:h-48 min-w-min sm:min-w-auto">
          {chartData.map((data) => (
            <div key={data.week} className="flex-1 flex flex-col items-center min-w-12 sm:min-w-auto">
              <div className="w-full flex flex-col-reverse items-center gap-0.5 sm:gap-1">
                <span className="text-xs text-slate-500">{data.bookings}b</span>
                <div 
                  className="w-full bg-brand-500 rounded-t-lg transition-all hover:bg-brand-600"
                  style={{ height: `${(data.bookings / maxBookings) * 100}px`, minHeight: '4px' }}
                ></div>
                <div 
                  className="w-full bg-brand-200 rounded-t-lg transition-all"
                  style={{ height: `${(data.occupancy / maxOccupancy) * 50}px`, minHeight: '4px' }}
                ></div>
              </div>
              <span className="text-xs text-slate-500 mt-1 sm:mt-2 truncate">{data.week}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-3 sm:mt-4">
          <div className="flex items-center gap-2">
            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-brand-500 rounded-full"></div>
            <span className="text-xs text-slate-500">Bookings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-brand-200 rounded-full"></div>
            <span className="text-xs text-slate-500">Occupancy</span>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-800">Recent Bookings</h3>
            <Link href="/hosting/calendar" className="text-xs sm:text-sm text-brand-600 hover:text-brand-700 font-medium whitespace-nowrap">
              View Calendar →
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-semibold text-slate-500">Guest</th>
                <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-semibold text-slate-500 hidden md:table-cell">Listing</th>
                <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-semibold text-slate-500 hidden lg:table-cell">Check-in</th>
                <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-semibold text-slate-500">Status</th>
                <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-semibold text-slate-500 hidden sm:table-cell">Amount</th>
                <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-semibold text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50">
                  <td className="px-3 sm:px-6 py-2 sm:py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold text-xs sm:text-sm flex-shrink-0">
                        {booking.avatar}
                      </div>
                      <span className="font-medium text-slate-700 text-xs sm:text-sm truncate">{booking.guestName.split(' ')[0]}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-slate-600 hidden md:table-cell truncate">{booking.listing}</td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-slate-600 hidden lg:table-cell">{booking.checkIn}</td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium capitalize inline-block ${getStatusColor(booking.status)}`}>
                      {booking.status === 'confirmed' ? '✓' : booking.status === 'pending' ? '⏳' : '✗'}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4">
                    <span className="font-bold text-slate-800 text-xs sm:text-sm hidden sm:table-cell">{booking.amount}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4">
                    <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
