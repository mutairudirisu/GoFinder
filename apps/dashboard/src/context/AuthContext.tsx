"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "lister" | "renter" | "both";
  avatar?: string;
  isProfileComplete: boolean;
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
    if (typeof window === 'undefined') return; // SSR safety
    
    const storedUser = localStorage.getItem("gigs_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("gigs_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser: User = {
      id: "user_" + Date.now(),
      email,
      name: email.split("@")[0] || "User",
      role: "both",
      isProfileComplete: true,
    };

    setUser(newUser);
    localStorage.setItem("gigs_user", JSON.stringify(newUser));
    setIsLoading(false);
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
        const { email, name } = JSON.parse(pending);

        const newUser: User = {
          id: "user_" + Date.now(),
          email,
          name,
          role: "both",
          isProfileComplete: false,
        };

        localStorage.removeItem("pending_signup");
        setUser(newUser);
        localStorage.setItem("gigs_user", JSON.stringify(newUser));
        setIsLoading(false);
        return true;
      }
    }
    setIsLoading(false);
    return false;
  };

  const completeProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (user) {
      const updatedUser = { ...user, ...data, isProfileComplete: true };
      setUser(updatedUser);
      localStorage.setItem("gigs_user", JSON.stringify(updatedUser));
    }

    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("gigs_user");
  };

  const switchRole = (role: "lister" | "renter") => {
    if (user) {
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
  }), [user, isLoading]);

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
