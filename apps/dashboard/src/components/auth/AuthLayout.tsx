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
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
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
    <div className="h-screen flex items-stretch bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-green-500 rounded-lg border-2 border-green-900 flex items-center justify-center" style={{ boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="font-bold text-2xl tracking-tight text-green-900">
                GIGS<span className="text-green-600">Rentals</span>
              </span>
            </Link>
          </div>

          {/* Content */}
          <div className="space-y-3 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-green-900">{title}</h1>
            {subtitle && (
              <p className="text-base md:text-lg text-green-600">{subtitle}</p>
            )}
          </div>

          {/* Form */}
          {children}
        </div>
      </div>

      {/* Right Side - Image Carousel */}
      {showImage && (
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-green-100 via-green-50 to-green-50">
          <div className="w-full h-full relative z-10 flex flex-col items-center justify-center p-8">
            <div className="relative w-full max-w-lg h-[500px]">
              {/* Main Image */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={housingImages[selectedImage]}
                  alt={`Housing ${selectedImage + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 via-transparent to-transparent"></div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => setSelectedImage((prev) => (prev - 1 + housingImages.length) % housingImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setSelectedImage((prev) => (prev + 1) % housingImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {housingImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-2 h-2 rounded-full transition-all ${index === selectedImage ? "bg-white w-6" : "bg-white/50"}`}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Content Overlay */}
            <div className="mt-8 text-center max-w-md space-y-4">
              <h2 className="text-4xl font-bold text-green-900 italic">Find Your Tribe</h2>
              <p className="text-green-700">
                Connect with students, find affordable co-living spaces, and split rent securely.
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
                  <div className="w-8 h-8 rounded-full bg-green-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                    +2k
                  </div>
                </div>
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">
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
