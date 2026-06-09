"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ViewProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const profileDetails = [
    { icon: "ph ph-balloon", label: "Born in the 90s" },
    { icon: "ph ph-lightbulb", label: "Fun fact: Can play the cello" },
    { icon: "ph ph-translate", label: "Speaks English" },
    { icon: "ph ph-map-pin", label: "Lives in Lagos, Nigeria" },
  ];

  const interests = [
    { icon: "ph ph-bowl-food", label: "Food" },
    { icon: "ph ph-mountains", label: "Outdoors" },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="px-6 pt-6 pb-2 flex items-center justify-between sticky top-0 bg-white z-40">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all shadow-sm"
        >
          <i className="ph ph-arrow-left text-lg"></i>
        </button>
        <Link
          href="/user/profile/edit"
          className="px-6 py-2 rounded-full border border-slate-200 font-semibold text-slate-900 text-sm active:scale-95 transition-all shadow-sm"
        >
          Edit
        </Link>
      </header>

      <main className="px-6 pt-8 max-w-2xl mx-auto space-y-10">
        {/* Profile Card Overlay Style */}
        <section className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-slate-900 text-white font-semibold flex items-center justify-center text-5xl shadow-xl border-4 border-white overflow-hidden">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-brand-500 border-2 border-white flex items-center justify-center shadow-md">
              <i className="ph-fill ph-shield-check text-white text-base"></i>
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-semibold text-slate-900 tracking-tight">
              {user?.name || "User"}
            </h1>
            <p className="text-base font-medium text-slate-500">Lagos, Nigeria</p>
          </div>
        </section>

        {/* Details List */}
        <section className="space-y-6 px-4">
          <div className="space-y-5">
            {profileDetails.map((detail, idx) => (
              <div key={idx} className="flex items-center gap-4 text-slate-700">
                <i className={`${detail.icon} text-2xl text-slate-400`}></i>
                <span className="text-base font-medium">{detail.label}</span>
              </div>
            ))}
            <Link 
              href="/user/profile/verified"
              className="flex items-center gap-4 text-slate-700 group"
            >
              <i className="ph ph-shield-check text-2xl text-slate-400"></i>
              <span className="text-base font-medium underline decoration-2 underline-offset-4 decoration-slate-300 group-hover:decoration-brand-500 transition-colors">
                Identity verified
              </span>
            </Link>
          </div>

          <div className="pt-4">
            <p className="text-[17px] leading-relaxed text-slate-700 font-medium">
              Hi I'm {user?.name || "User"}! I love trying adventurous food!
            </p>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* Interests Section */}
        <section className="space-y-6 px-4">
          <h2 className="text-2xl font-display font-semibold text-slate-900">My interests</h2>
          <div className="grid grid-cols-2 gap-6">
            {interests.map((interest, idx) => (
              <div key={idx} className="flex items-center gap-4 text-slate-700">
                <i className={`${interest.icon} text-3xl text-slate-900`}></i>
                <span className="text-lg font-semibold">{interest.label}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
