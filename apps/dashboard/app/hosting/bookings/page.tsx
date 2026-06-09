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
  guestName?: string;
  createdAt: string;
  guests?: number;
  checkIn?: string;
  checkOut?: string;
  kind?: BookingKind;
  status?: BookingStatus;
  seenByHost?: boolean;
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

export default function HostBookingsPage() {
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

  const myBookings = useMemo(() => {
    const id = user?.id ? String(user.id) : "";
    return all.filter((b) => String(b?.hostId ?? "") === id);
  }, [all, user?.id]);

  const unseenCount = useMemo(() => myBookings.filter((b) => !b.seenByHost).length, [myBookings]);

  const updateBooking = (bookingId: string, patch: Partial<Booking>) => {
    setAll((prev) => {
      const next = prev.map((b) => (b.id === bookingId ? { ...b, ...patch } : b));
      writeBookings(next);
      return next;
    });
  };

  const markAllSeen = () => {
    const hostId = user?.id ? String(user.id) : "";
    setAll((prev) => {
      const next = prev.map((b) => (String(b?.hostId ?? "") === hostId ? { ...b, seenByHost: true } : b));
      writeBookings(next);
      return next;
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-2xl md:text-3xl font-display font-semibold text-slate-900 tracking-tight">Bookings</div>
          <div className="text-sm text-slate-500 mt-1">Incoming reservations and join requests.</div>
        </div>
        <button
          type="button"
          onClick={markAllSeen}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
          disabled={unseenCount === 0}
        >
          Mark all seen
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {myBookings.length === 0 ? (
          <div className="bg-white rounded-[28px] border border-slate-200 p-10 text-center">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="ph-bold ph-suitcase text-2xl text-slate-400"></i>
            </div>
            <div className="text-lg font-bold text-slate-900">No bookings yet</div>
            <div className="text-sm text-slate-500 mt-1">New booking requests will appear here.</div>
          </div>
        ) : (
          myBookings.map((b) => {
            const status = (b.status ?? "PENDING") as BookingStatus;
            const kind = (b.kind ?? "RESERVATION") as BookingKind;
            const isPending = status === "PENDING";
            return (
              <div
                key={b.id}
                className={`bg-white rounded-[24px] border p-5 flex flex-col sm:flex-row items-start justify-between gap-5 ${
                  b.seenByHost ? "border-slate-200" : "border-brand-200 bg-brand-50/30 shadow-lg shadow-brand-500/5"
                }`}
              >
                <div className="min-w-0 w-full sm:w-auto">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200/50">
                      {kind === "JOIN_REQUEST" ? "Join request" : "Reservation"}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                      status === 'PENDING' ? 'text-amber-700 bg-amber-50 border-amber-100/50' :
                      status === 'CONFIRMED' ? 'text-emerald-700 bg-emerald-50 border-emerald-100/50' :
                      'text-slate-700 bg-slate-100 border-slate-200/50'
                    }`}>
                      {status}
                    </span>
                    {!b.seenByHost ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-500 text-white text-[9px] font-black uppercase tracking-tighter rounded-full">
                        <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                        New
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-4 font-bold text-slate-900 text-lg sm:text-base line-clamp-1">{b.listingTitle || "Listing"}</div>
                  <div className="text-sm text-slate-600 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1.5">
                      <i className="ph ph-user text-slate-400"></i>
                      <span className="font-bold text-slate-700">{b.guestName || "Guest"}</span>
                    </span>
                    {b.checkIn || b.checkOut ? (
                      <span className="flex items-center gap-1.5 before:content-['•'] before:mr-2 before:text-slate-300">
                        <i className="ph ph-calendar text-slate-400"></i>
                        {b.checkIn || "—"} → {b.checkOut || "—"}
                      </span>
                    ) : null}
                    {typeof b.guests === "number" ? (
                      <span className="flex items-center gap-1.5 before:content-['•'] before:mr-2 before:text-slate-300">
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

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <Link
                    href={`/listings/${encodeURIComponent(String(b.listingId))}`}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-brand-100 bg-brand-50/30 text-brand-700 font-bold hover:bg-brand-100/80 hover:border-brand-200 transition-all text-center text-sm active:scale-95"
                  >
                    View
                  </Link>
                  {isPending ? (
                    <>
                      <button
                        type="button"
                        onClick={() => updateBooking(b.id, { status: "DECLINED", seenByHost: true })}
                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all text-center text-sm active:scale-95"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => updateBooking(b.id, { status: "CONFIRMED", seenByHost: true })}
                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-all text-center text-sm shadow-lg shadow-brand-500/20 active:scale-95"
                      >
                        Confirm
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => updateBooking(b.id, { seenByHost: true })}
                      className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all text-center text-sm active:scale-95"
                    >
                      Seen
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

