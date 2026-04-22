"use client";

import React, { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BottomTabNav } from "@/components/mobile/BottomTabNav";
import { useAuth } from "@/context/AuthContext";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showImage?: boolean;
  mobileHeaderLabel?: string;
  closeHref?: string;
}

const housingImages = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2340&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2340&q=80",
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=2340&q=80",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=2340&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=2340&q=80",
];

export const AuthLayout = ({
  children,
  title,
  subtitle,
  showImage = true,
  mobileHeaderLabel,
  closeHref = "/",
}: AuthLayoutProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Auto-rotate carousel - only when mounted
  useEffect(() => {
    let isMounted = true;
    const timer = setInterval(() => {
      if (isMounted) {
        setSelectedImage((prev) => (prev + 1) % housingImages.length);
      }
    }, 5000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-200 lg:bg-brand-dark lg:text-white overflow-hidden">
      <div className="lg:hidden fixed inset-0 z-[80] flex flex-col">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mt-auto w-full bg-white rounded-t-[28px] h-[94dvh] max-h-[94dvh] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-900"
              aria-label="Back"
            >
              <i className="ph ph-arrow-left text-xl" />
            </button>
            <div className="text-sm font-bold text-slate-900">
              {mobileHeaderLabel || "Log in or sign up"}
            </div>
            <Link
              href={closeHref}
              className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-900"
              aria-label="Close"
            >
              <i className="ph ph-x text-xl" />
            </Link>
          </div>

          <div className="px-6 pt-2 pb-24 flex-1 overflow-y-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-100">
                <i className="ph-bold ph-house-line text-2xl" />
              </div>
            </div>

            <div className="text-center space-y-2 mb-6">
              <h1 className="text-2xl font-display font-medium tracking-wide text-slate-900">{title}</h1>
              {subtitle ? <p className="text-sm text-slate-600 leading-relaxed">{subtitle}</p> : null}
            </div>

            {children}
          </div>
        </div>

        {!authLoading && !isAuthenticated ? (
          <BottomTabNav
            hidden={false}
            zIndexClassName="z-[90]"
            items={[
              { key: "explore", href: "/", label: "Explore", iconClassName: "ph-bold ph-magnifying-glass text-xl", isActive: pathname === "/" },
              { key: "wishlists", href: "/wishlists", label: "Wishlists", iconClassName: "ph-bold ph-heart text-xl", isActive: pathname.startsWith("/wishlists") },
              { key: "login", href: "/auth/login", label: "Log in", iconClassName: "ph-bold ph-user text-xl", isActive: pathname.startsWith("/auth") },
            ]}
          />
        ) : null}
      </div>

      <div className="hidden lg:flex h-screen items-stretch bg-brand-dark text-white overflow-hidden">
        <div
          className={`w-full ${showImage ? "lg:w-[440px] border-r border-white/10" : ""} flex flex-col px-6 py-12 sm:px-12 bg-gradient-to-b from-brand-dark via-[#0b1220] to-brand-dark relative overflow-hidden overflow-y-auto`}
        >
          <div className="pointer-events-none absolute inset-0 opacity-40 bg-grid-pattern" />
          <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-brand-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-brand-500/15 blur-3xl" />

          <div className={`w-full ${showImage ? "max-w-sm" : "max-w-md"} space-y-8 relative z-10 mx-auto`}>
            <div className="flex justify-start">
              <Link href="/" className="flex items-center gap-2 group">
                <div
                  className="w-10 h-10 bg-brand-500 rounded-xl border border-white/10 flex items-center justify-center"
                  style={{ boxShadow: "0 10px 30px rgba(34, 197, 94, 0.25)" }}
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="font-bold text-2xl tracking-tight text-white">
                  GIGS<span className="text-brand-400">Rentals</span>
                </span>
              </Link>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              {subtitle ? <p className="text-sm text-white/70 leading-relaxed">{subtitle}</p> : null}
            </div>

            {children}
          </div>
        </div>

        {showImage ? (
          <div className="hidden lg:flex flex-1 relative overflow-hidden">
            <img
              src={housingImages[selectedImage]}
              alt={`Stay ${selectedImage + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark via-brand-dark/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />

            <div className="relative z-10 w-full h-full flex items-end p-10">
              <div className="max-w-xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur">
                  <span className="text-xs font-semibold tracking-wide text-white/80">FIND • BOOK • MOVE IN</span>
                </div>
                <h2 className="text-4xl font-bold tracking-tight">Your next stay, sorted</h2>
                <p className="text-white/75">
                  Verified listings, student-friendly spaces, and shared rooms that actually make sense.
                </p>
                <div className="flex items-center gap-2 pt-4">
                  {housingImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === selectedImage ? "w-10 bg-brand-500" : "w-4 bg-white/30 hover:bg-white/50"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedImage((prev) => (prev - 1 + housingImages.length) % housingImages.length)}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur transition-all"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedImage((prev) => (prev + 1) % housingImages.length)}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur transition-all"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AuthLayout;
