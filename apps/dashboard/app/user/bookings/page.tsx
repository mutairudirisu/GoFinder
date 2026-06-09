"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

type BookingStatus = "PENDING" | "CONFIRMED" | "DECLINED" | "CANCELLED";
type BookingKind = "RESERVATION" | "JOIN_REQUEST";

type Booking = {
  id: string;
  listingId: string;
  listingTitle?: string;
  hostId: string;
  guestId?: string;
  createdAt: string;
  guests?: number;
  checkIn?: string;
  checkOut?: string;
  kind?: BookingKind;
  status?: BookingStatus;
};

function readBookings(): Booking[] {
  try {
    const raw = localStorage.getItem("gigs_bookings");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as Booking[]) : [];
  } catch {
    return [];
  }
}

function writeBookings(next: Booking[]) {
  localStorage.setItem("gigs_bookings", JSON.stringify(next));
  window.dispatchEvent(new Event("bookingsUpdated"));
}

export default function UserBookingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [all, setAll] = useState<Booking[]>([]);

  useEffect(() => {
    const load = () => setAll(readBookings());
    load();
    window.addEventListener("bookingsUpdated", load as EventListener);
    window.addEventListener("storage", load as EventListener);
    return () => {
      window.removeEventListener("bookingsUpdated", load as EventListener);
      window.removeEventListener("storage", load as EventListener);
    };
  }, []);

  const myTrips = useMemo(() => {
    const id = user?.id ? String(user.id) : "";
    return all.filter((b) => String(b?.guestId ?? "") === id);
  }, [all, user?.id]);

  const cancelBooking = (bookingId: string) => {
    setAll((prev) => {
      const next = prev.map((b) => (b.id === bookingId ? { ...b, status: "CANCELLED" as BookingStatus } : b));
      writeBookings(next);
      return next;
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <i className="ph ph-arrow-left text-lg"></i>
          </button>
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-slate-900 tracking-tight">Bookings</h2>
            <p className="text-sm text-slate-500 mt-1">Your home reservations and stay details.</p>
          </div>
        </div>

        <div className="space-y-4">
        {myTrips.length === 0 ? (
          <div className="bg-white rounded-[28px] border border-slate-200 p-10 text-center">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="ph-bold ph-calendar-check text-2xl text-slate-400"></i>
            </div>
            <div className="text-lg font-bold text-slate-900">No bookings yet</div>
            <div className="text-sm text-slate-500 mt-1">When you reserve a place, it will show up here.</div>
          </div>
        ) : (
          myTrips.map((b) => {
            const status = (b.status ?? "PENDING") as BookingStatus;
            const kind = (b.kind ?? "RESERVATION") as BookingKind;
            const isCancellable = status === "PENDING" || status === "CONFIRMED";
            return (
              <div key={b.id} className="bg-white rounded-[24px] border border-slate-200 p-5 flex flex-col sm:flex-row items-start justify-between gap-5">
                <div className="min-w-0 w-full sm:w-auto">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200/50">
                      {kind === "JOIN_REQUEST" ? "Join request" : "Reservation"}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100/50">
                      {status}
                    </span>
                  </div>
                  <div className="mt-4 font-bold text-slate-900 text-lg sm:text-base line-clamp-1">{b.listingTitle || "Listing"}</div>
                  <div className="text-sm text-slate-600 mt-1 flex items-center gap-2">
                    <i className="ph ph-calendar text-slate-400"></i>
                    <span>
                      {b.checkIn || b.checkOut ? (
                        <>
                          {b.checkIn || "—"} → {b.checkOut || "—"}
                        </>
                      ) : (
                        "Dates not set"
                      )}
                    </span>
                    {typeof b.guests === "number" ? (
                      <span className="flex items-center gap-1 before:content-['•'] before:mr-1 before:text-slate-300">
                        <i className="ph ph-users text-slate-400"></i>
                        {b.guests} guest(s)
                      </span>
                    ) : null}
                  </div>
                  <div className="text-xs text-slate-400 mt-3 flex items-center gap-1.5 font-medium">
                    <i className="ph ph-clock"></i>
                    Requested {new Date(b.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <Link
                    href={`/listings/${encodeURIComponent(String(b.listingId))}`}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-brand-100 bg-brand-50/30 text-brand-700 font-bold hover:bg-brand-100/80 hover:border-brand-200 transition-all text-center text-sm active:scale-95"
                  >
                    View
                  </Link>
                  {isCancellable ? (
                    <button
                      type="button"
                      onClick={() => cancelBooking(b.id)}
                      className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all text-center text-sm active:scale-95"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
        </div>
      </motion.div>
    </div>
  );
}

