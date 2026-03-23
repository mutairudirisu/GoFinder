"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HostingCalendarPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Mock bookings data
  const bookings = [
    { date: 5, status: "confirmed", guest: "Sarah Johnson", listing: "Modern Downtown Apartment" },
    { date: 8, status: "confirmed", guest: "Michael Chen", listing: "Cozy Studio near Campus" },
    { date: 12, status: "pending", guest: "Emily Davis", listing: "Modern Downtown Apartment" },
    { date: 15, status: "confirmed", guest: "James Wilson", listing: "Spacious 2-Bedroom Flat" },
    { date: 18, status: "confirmed", guest: "Lisa Anderson", listing: "Modern Downtown Apartment" },
    { date: 22, status: "pending", guest: "David Brown", listing: "Cozy Studio near Campus" },
    { date: 25, status: "confirmed", guest: "Anna Martinez", listing: "Modern Downtown Apartment" },
    { date: 28, status: "confirmed", guest: "Robert Taylor", listing: "Spacious 2-Bedroom Flat" },
  ];

  const getBookingForDate = (day: number) => {
    return bookings.find(b => b.date === day);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Redirect if not authorized
  useEffect(() => {
    if (user && user.role === 'renter') {
      router.replace("/listings");
    }
  }, [user, router]);

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="font-display font-bold text-2xl text-slate-800">
          Calendar
        </h2>
        <p className="text-slate-500 mt-1">Manage your availability and bookings</p>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-xl text-slate-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <i className="ph-bold ph-caret-left text-slate-600"></i>
          </button>
          <button
            onClick={() => setCurrentDate(new Date(2026, 2, 1))}
            className="px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <i className="ph-bold ph-caret-right text-slate-600"></i>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-slate-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-sm font-semibold text-slate-500 bg-slate-50">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {/* Empty cells for days before first of month */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="min-h-[100px] border-b border-r border-slate-100 bg-slate-50"></div>
          ))}

          {/* Days of month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const booking = getBookingForDate(day);
            const isToday = currentDate.getMonth() === 2 && day === 17;

            return (
              <div key={day} className="min-h-[100px] border-b border-r border-slate-100 p-2 hover:bg-slate-50 transition-colors">
                <div className={`text-sm font-medium mb-1 ${isToday ? 'w-7 h-7 bg-brand-500 text-white rounded-full flex items-center justify-center' : 'text-slate-700'}`}>
                  {day}
                </div>
                {booking && (
                  <div className={`text-xs p-1.5 rounded-lg mb-1 ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    <p className="font-medium truncate">{booking.guest}</p>
                    <p className="text-xs opacity-75 truncate">{booking.listing}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-sm text-slate-600">Confirmed Booking</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="text-sm text-slate-600">Pending Booking</span>
        </div>
      </div>
    </>
  );
}
