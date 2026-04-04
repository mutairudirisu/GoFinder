"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
    <div className="max-w-5xl mx-auto">
      <div>
        <div className="text-2xl font-display font-bold text-slate-900">Trips</div>
        <div className="text-sm text-slate-500 mt-1">Your reservations and join requests.</div>
      </div>

      <div className="mt-6 space-y-3">
        {myTrips.length === 0 ? (
          <div className="bg-white rounded-[28px] border border-slate-200 p-10 text-center">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="ph-bold ph-suitcase text-2xl text-slate-400"></i>
            </div>
            <div className="text-lg font-bold text-slate-900">No trips yet</div>
            <div className="text-sm text-slate-500 mt-1">When you reserve a place, it will show up here.</div>
          </div>
        ) : (
          myTrips.map((b) => {
            const status = (b.status ?? "PENDING") as BookingStatus;
            const kind = (b.kind ?? "RESERVATION") as BookingKind;
            const isCancellable = status === "PENDING" || status === "CONFIRMED";
            return (
              <div key={b.id} className="bg-white rounded-[22px] border border-slate-200 p-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                      {kind === "JOIN_REQUEST" ? "Join request" : "Reservation"}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200">
                      {status}
                    </span>
                  </div>
                  <div className="mt-2 font-bold text-slate-900 line-clamp-1">{b.listingTitle || "Listing"}</div>
                  <div className="text-sm text-slate-600 mt-1">
                    {b.checkIn || b.checkOut ? (
                      <>
                        {b.checkIn || "—"} → {b.checkOut || "—"}
                      </>
                    ) : (
                      "Dates not set"
                    )}
                    {typeof b.guests === "number" ? <> • {b.guests} guest(s)</> : null}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">Requested {new Date(b.createdAt).toLocaleString()}</div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/listings/${encodeURIComponent(String(b.listingId))}`}
                    className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                  >
                    View
                  </Link>
                  {isCancellable ? (
                    <button
                      type="button"
                      onClick={() => cancelBooking(b.id)}
                      className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 font-bold hover:bg-red-100 transition-colors"
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
    </div>
  );
}

