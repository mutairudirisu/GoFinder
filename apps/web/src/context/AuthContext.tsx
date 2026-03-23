"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";

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
  const router = useRouter();
  const pathname = usePathname();

  // Check for stored auth on mount - only once
  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR safety
    
    let isMounted = true;
    try {
      const storedUser = localStorage.getItem("gigs_user");
      if (storedUser && isMounted) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem("gigs_user");
        }
      }
      if (isMounted) {
        setIsLoading(false);
      }
    } catch (e) {
      if (isMounted) {
        setIsLoading(false);
      }
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
    
    // Redirect based on intended destination
    const redirect = localStorage.getItem("auth_redirect") || "/listings";
    localStorage.removeItem("auth_redirect");
    try {
      router.push(redirect);
    } catch (e) {
      console.error("Navigation error:", e);
    }
  };

  const signup = async (email: string, name: string, method: "google" | "email") => {
    setIsLoading(true);
    // Simulate sending OTP
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store pending user data
    localStorage.setItem("pending_signup", JSON.stringify({ email, name, method }));
    setIsLoading(false);
    try {
      router.push("/signup/verify-otp");
    } catch (e) {
      console.error("Navigation error:", e);
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
        
        // Redirect to profile completion
        try {
          router.push("/signup/profile");
        } catch (e) {
          console.error("Navigation error:", e);
        }
        return true;
      }
    }
    setIsLoading(false);
    return false;
  };

  const completeProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (user) {
      const updatedUser = { ...user, ...data, isProfileComplete: true };
      setUser(updatedUser);
      localStorage.setItem("gigs_user", JSON.stringify(updatedUser));
    }
    
    setIsLoading(false);
    
    // Redirect to listings or intended destination
    const redirect = localStorage.getItem("auth_redirect") || "/listings";
    localStorage.removeItem("auth_redirect");
    try {
      router.push(redirect);
    } catch (e) {
      console.error("Navigation error:", e);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("gigs_user");
    try {
      router.push("/");
    } catch (e) {
      console.error("Navigation error:", e);
    }
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
    switchRole
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
