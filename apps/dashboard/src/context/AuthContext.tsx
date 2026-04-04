"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "lister" | "renter" | "both" | "admin";
  avatar?: string;
  isProfileComplete: boolean;
  firstName?: string;
  lastName?: string;
  username?: string;
  adminStatus?: "ACTIVE" | "SUSPENDED";
  security?: {
    hasPassword?: boolean;
    passwordSetAt?: string;
  };
  verifications?: {
    email?: { status: "UNVERIFIED" | "VERIFIED"; verifiedAt?: string };
    phone?: {
      status: "UNVERIFIED" | "PENDING" | "VERIFIED";
      verifiedAt?: string;
      requestedAt?: string;
      lastSentAt?: string;
      phone?: string;
    };
    id?: {
      status: "UNVERIFIED" | "PENDING" | "VERIFIED";
      verifiedAt?: string;
      idType?: string;
      files?: { front?: string; back?: string; selfie?: string };
    };
  };
  preferences?: {
    location?: string;
    budget?: string;
    roommates?: string;
  };
  wallet?: {
    currency?: string;
    availableBalance?: number;
    pendingBalance?: number;
  };
  payoutMethods?: Array<{
    id: string;
    type: "bank";
    bankName: string;
    accountNumber: string;
    accountName: string;
    createdAt: string;
  }>;
  paymentMethods?: Array<{
    id: string;
    type: "card";
    brand: string;
    last4: string;
    createdAt: string;
  }>;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, method: "google" | "email") => Promise<void>;
  verifyOTP: (otp: string) => Promise<boolean>;
  completeProfile: (data: Partial<User>) => Promise<void>;
  logout: () => void;
  switchRole: (role: "lister" | "renter") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored auth on mount - only once
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("gigs_user");
    if (!storedUser) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(storedUser) as User;
      setUser(parsed);

      void (async () => {
        try {
          const res = await fetch(`/api/users/${encodeURIComponent(String(parsed.id))}`, { cache: "no-store" });
          if (!res.ok) return;
          const data = (await res.json()) as { user: User };
          if (data.user?.id) {
            setUser(data.user);
            localStorage.setItem("gigs_user", JSON.stringify(data.user));
          }
        } catch {
        }
      })();
    } catch {
      localStorage.removeItem("gigs_user");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const res = await fetch(`/api/users?email=${encodeURIComponent(String(email).trim().toLowerCase())}`, {
        cache: "no-store",
      });
      const data = (await res.json()) as { user: User | null };
      if (!data.user) {
        throw new Error("User not found");
      }
      setUser(data.user);
      localStorage.setItem("gigs_user", JSON.stringify(data.user));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, name: string, method: "google" | "email") => {
    setIsLoading(true);
    // Simulate sending OTP
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store pending user data
    localStorage.setItem("pending_signup", JSON.stringify({ email, name, method }));
    setIsLoading(false);
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo, accept any 6-digit OTP
    if (otp.length === 6) {
      const pending = localStorage.getItem("pending_signup");
      if (pending) {
        const { email, name, roleIntent } = JSON.parse(pending) as any;
        const role: User["role"] =
          roleIntent === "lister" ? "lister" : roleIntent === "renter" ? "renter" : "both";
        try {
          const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              name,
              role,
              isProfileComplete: false,
              verifications: {
                email: { status: "VERIFIED", verifiedAt: new Date().toISOString() },
              },
            }),
          });
          if (!res.ok) {
            setIsLoading(false);
            return false;
          }
          const data = (await res.json()) as { user: User };
          localStorage.removeItem("pending_signup");
          setUser(data.user);
          localStorage.setItem("gigs_user", JSON.stringify(data.user));
          setIsLoading(false);
          return true;
        } catch {
          setIsLoading(false);
          return false;
        }
      }
    }
    setIsLoading(false);
    return false;
  };

  const completeProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (user) {
      try {
        const res = await fetch(`/api/users/${encodeURIComponent(String(user.id))}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, isProfileComplete: true }),
        });
        if (res.ok) {
          const updated = (await res.json()) as { user: User };
          setUser(updated.user);
          localStorage.setItem("gigs_user", JSON.stringify(updated.user));
        } else {
          const updatedUser = { ...user, ...data, isProfileComplete: true };
          setUser(updatedUser);
          localStorage.setItem("gigs_user", JSON.stringify(updatedUser));
        }
      } catch {
        const updatedUser = { ...user, ...data, isProfileComplete: true };
        setUser(updatedUser);
        localStorage.setItem("gigs_user", JSON.stringify(updatedUser));
      }
    }

    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("gigs_user");
  };

  const switchRole = (role: "lister" | "renter") => {
    if (user) {
      if (user.role === "admin") return;
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem("gigs_user", JSON.stringify(updatedUser));
    }
  };

  // Memoize context value to prevent infinite re-renders
  const contextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    verifyOTP,
    completeProfile,
    logout,
    switchRole,
  }), [user, isLoading, login, signup, verifyOTP, completeProfile, logout, switchRole]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
