"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function WishlistsGatePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) router.replace("/user/favorites");
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-white px-6 pt-10 pb-24">
      <h1 className="text-3xl font-display font-bold text-slate-900">Wishlists</h1>
      <p className="text-slate-600 mt-3 max-w-md">
        Log in to view your wishlists. You can create, view, or edit wishlists once you’ve logged in.
      </p>
      <Link
        href="/auth/login?redirect=/user/favorites"
        className="inline-flex mt-6 items-center justify-center px-8 py-4 rounded-2xl bg-green-500 w-full text-white font-bold"
      >
        Log in
      </Link>
    </main>
  );
}

