"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function VerifiedInfoPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="px-6 pt-6 pb-2 sticky top-0 bg-white z-40">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all shadow-sm"
        >
          <i className="ph ph-arrow-left text-lg"></i>
        </button>
      </header>

      <main className="px-6 pt-8 max-w-2xl mx-auto space-y-10">
        {/* Gradient Badge Card */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 rounded-[32px] p-8 text-white shadow-2xl">
          {/* Subtle patterns in background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -top-10 -left-10 w-40 h-40 border-8 border-white rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 border-[12px] border-white rounded-full opacity-20"></div>
          </div>

          <div className="relative flex justify-between items-start gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-display font-semibold tracking-tight">
                {user?.name || "User"}
              </h1>
              <p className="text-xl font-medium opacity-90">
                Verified since May 2026
              </p>
              
              <div className="pt-10 max-w-[240px]">
                <p className="text-[15px] leading-snug font-medium opacity-90">
                  Trust is the cornerstone of GIGS' community, and identity verification is part of how we build it.
                </p>
              </div>
            </div>

            <div className="shrink-0 pt-10">
              <div className="w-24 h-32 rounded-[24px] bg-brand-100 overflow-hidden shadow-lg transform rotate-2">
                <div className="w-full h-full flex items-center justify-center text-4xl font-semibold text-brand-700 mix-blend-multiply opacity-50">
                   {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Text */}
        <section className="px-2 space-y-6">
          <p className="text-[17px] leading-relaxed text-slate-700 font-medium">
            Our identity verification process checks a person's information against trusted third-party sources or a government ID. The process has safeguards, but doesn't guarantee that someone is who they say they are.{" "}
            <button className="font-bold underline decoration-2 underline-offset-4 decoration-slate-300 hover:decoration-brand-500 transition-colors">
              Learn more
            </button>
          </p>
        </section>
      </main>
    </div>
  );
}
