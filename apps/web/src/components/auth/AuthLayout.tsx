"use client";

import React, { useState, useEffect, ReactNode } from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showImage?: boolean;
}

const housingImages = [
  "/images/housing-1.jpg",
  "/images/housing-2.jpg",
  "/images/housing-3.jpg",
  "/images/housing-4.jpg",
  "/images/housing-5.jpg",
];

export const AuthLayout = ({
  children,
  title,
  subtitle,
  showImage = true,
}: AuthLayoutProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

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
    <div className="h-screen flex items-stretch bg-gradient-to-br from-brand-50 via-white to-brand-50">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-brand-500 rounded-lg border-2 border-brand-dark flex items-center justify-center shadow-brutal-sm group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <span className="font-display font-bold text-2xl tracking-tight">
                GIGS<span className="text-brand-600">Rentals</span>
              </span>
            </Link>
          </div>

          {/* Content */}
          <div className="space-y-3 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-900">
              {title}
            </h1>
            {subtitle && (
              <p className="text-base md:text-lg text-brand-600">{subtitle}</p>
            )}
          </div>

          {/* Form */}
          {children}
        </div>
      </div>

      {/* Right Side - Image Carousel */}
      {showImage && (
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-100 via-brand-50 to-brand-50">
          {/* Background Grid Pattern */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')] bg-cover bg-center opacity-10 hidden lg:block"></div>
          <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px]"></div>

          <div className="w-full h-full relative z-10 flex flex-col items-center justify-center p-8">
            <div className="relative w-full max-w-lg h-[500px]">
              {/* Main Image */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={housingImages[selectedImage]}
                  alt={`Housing ${selectedImage + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 via-transparent to-transparent"></div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() =>
                  setSelectedImage(
                    (prev) =>
                      (prev - 1 + housingImages.length) % housingImages.length
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-all"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  setSelectedImage((prev) => (prev + 1) % housingImages.length)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-all"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {housingImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === selectedImage ? "bg-white w-6" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Content Overlay */}
            <div className="mt-8 text-center max-w-md space-y-4">
              <h2 className="text-4xl font-bold font-display italic text-brand-900">
                Find Your Tribe
              </h2>
              <p className="text-brand-700">
                Connect with students, find affordable co-living spaces, and
                split rent securely.
              </p>

              {/* Social Proof */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/150?u=${i}`}
                      alt="User"
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                  <div className="w-8 h-8 rounded-full bg-brand-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                    +2k
                  </div>
                </div>
                <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
                  Students joined already
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthLayout;
