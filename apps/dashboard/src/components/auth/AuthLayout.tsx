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
    <div className="min-h-screen bg-[#F8F9FB] overflow-hidden">
      <div className="lg:hidden fixed inset-0 z-[80] flex flex-col">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mt-auto w-full bg-white rounded-t-[32px] h-[94dvh] max-h-[94dvh] flex flex-col overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-900 transition-colors"
              aria-label="Back"
            >
              <i className="ph ph-arrow-left text-xl" />
            </button>
            <div className="text-sm font-bold text-slate-900 uppercase tracking-widest">
              {mobileHeaderLabel || "Log in or sign up"}
            </div>
            <Link
              href={closeHref}
              className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-900 transition-colors"
              aria-label="Close"
            >
              <i className="ph ph-x text-xl" />
            </Link>
          </div>

          <div className="px-8 pt-8 pb-24 flex-1 overflow-y-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-[24px] bg-brand-500/10 text-brand-600 flex items-center justify-center border border-brand-500/20 shadow-sm">
                <i className="ph-bold ph-house-line text-3xl" />
              </div>
            </div>

            <div className="text-center space-y-3 mb-10">
              <h1 className="text-3xl font-display font-semibold tracking-tight text-slate-900">{title}</h1>
              {subtitle ? <p className="text-base text-slate-500 leading-relaxed max-w-xs mx-auto font-medium">{subtitle}</p> : null}
            </div>

            <div className="max-w-md mx-auto">
              {children}
            </div>
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

      <div className="hidden lg:flex h-screen items-stretch bg-[#F8F9FB] text-slate-900 overflow-hidden">
        <div
          className={`w-full ${showImage ? "lg:w-[640px]" : ""} flex flex-col bg-white relative overflow-hidden overflow-y-auto`}
        >
          <div className="pointer-events-none absolute inset-0 opacity-40 bg-grid-pattern brightness-95" />
          <div className="pointer-events-none absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-brand-500/[0.03] blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-[500px] h-[500px] rounded-full bg-brand-500/[0.03] blur-[120px]" />

          <div className={`w-full flex-1 flex flex-col justify-center px-12 py-16 sm:px-20 relative z-10`}>
            <div className={`w-full ${showImage ? "max-w-md" : "max-w-xl"} space-y-12 mx-auto`}>
              <div className="flex justify-start">
                <Link href="/" className="flex items-center gap-3 group">
                  <div
                    className="w-12 h-12 bg-brand-500 rounded-2xl border border-brand-400 flex items-center justify-center transition-transform group-hover:scale-105"
                    style={{ boxShadow: "0 10px 30px rgba(34, 197, 94, 0.25)" }}
                  >
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="font-display font-semibold text-3xl tracking-tight text-slate-900">
                    GIGS<span className="text-brand-600">Rentals</span>
                  </span>
                </Link>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-display font-semibold tracking-tight text-slate-900">{title}</h1>
                {subtitle ? <p className="text-lg text-slate-500 leading-relaxed font-medium">{subtitle}</p> : null}
              </div>

              <div className="pt-2">
                {children}
              </div>
            </div>
          </div>

          <div className="px-12 py-8 border-t border-slate-50 bg-slate-50/30 relative z-10 text-center">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">
              &copy; 2026 GIGS Rentals &bull; Secure Authentication
            </p>
          </div>
        </div>

        {showImage ? (
          <div className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-900 rounded-3xl my-6 mx-6 shadow-2xl">
            <img
              src={housingImages[selectedImage]}
              alt={`Stay ${selectedImage + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/90 via-slate-900/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

            <div className="relative z-10 w-full h-full flex items-end p-16">
              <div className="max-w-xl space-y-0">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                  <span className="text-xs font-bold tracking-widest text-white/90 uppercase">Find &bull; Book &bull; Move In</span>
                </div>
                <h2 className="text-4xl font-display font-semibold tracking-tight text-white leading-tight">Your next stay,<br />perfectly sorted.</h2>
                <p className="text-md text-white/80 font-medium leading-relaxed">
                  Verified listings, student-friendly spaces, and shared rooms that actually make sense.
                </p>
                <div className="flex items-center gap-3 pt-6">
                  {housingImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        index === selectedImage ? "w-12 bg-brand-500" : "w-4 bg-white/20 hover:bg-white/40"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-8 pointer-events-none">
              <button
                onClick={() => setSelectedImage((prev) => (prev - 1 + housingImages.length) % housingImages.length)}
                className="pointer-events-auto bg-white/10 hover:bg-brand-500 text-white w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md transition-all group"
                aria-label="Previous image"
              >
                <i className="ph-bold ph-caret-left text-xl group-hover:scale-110" />
              </button>
              <button
                onClick={() => setSelectedImage((prev) => (prev + 1) % housingImages.length)}
                className="pointer-events-auto bg-white/10 hover:bg-brand-500 text-white w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md transition-all group"
                aria-label="Next image"
              >
                <i className="ph-bold ph-caret-right text-xl group-hover:scale-110" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AuthLayout;
