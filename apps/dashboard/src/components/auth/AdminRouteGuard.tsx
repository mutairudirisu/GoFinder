"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  const isAdmin = user?.role === "admin" || String(user?.email ?? "").toLowerCase() === "admin@gigs.app";
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname.startsWith("/auth");

  useEffect(() => {
    if (isLoading) return;
    if (isAuthRoute) {
      if (user && isAdmin) router.replace("/admin");
      return;
    }

    if (user && isAdmin && !isAdminRoute) {
      router.replace("/admin");
      return;
    }

    if (isAdminRoute && (!user || !isAdmin)) {
      if (!user) {
        router.replace("/auth/login?redirect=/admin");
      } else {
        router.replace("/user/profile");
      }
    }
  }, [isAdmin, isAdminRoute, isAuthRoute, isLoading, router, user]);

  if (!isLoading) {
    if (user && isAdmin && !isAdminRoute) return null;
    if (isAdminRoute && (!user || !isAdmin)) return null;
    if (isAuthRoute && user && isAdmin) return null;
  }

  return <>{children}</>;
}

