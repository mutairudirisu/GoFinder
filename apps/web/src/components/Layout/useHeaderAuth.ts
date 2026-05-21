import { useState, useEffect } from "react";
import { User } from "./header.types";

export function useHeaderAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSessionFromCookie = () => {
      if (typeof document === "undefined") return null;
      const name = "gigs_session=";
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        if (!c) continue;
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          try {
            return JSON.parse(c.substring(name.length, c.length));
          } catch {
            return null;
          }
        }
      }
      return null;
    };

    const sync = () => {
      if (typeof window === "undefined") return;

      // 1. Try LocalStorage first (local origin session)
      const storedUser = localStorage.getItem("gigs_user");
      if (storedUser && storedUser !== "undefined") {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed && typeof parsed === "object" && parsed.id) {
            setUser(parsed as User);
            return;
          }
        } catch (e) {
          localStorage.removeItem("gigs_user");
        }
      }

      // 2. Fallback to Cookie (cross-port session from dashboard)
      const cookieUser = getSessionFromCookie();
      if (cookieUser && typeof cookieUser === "object" && cookieUser.id) {
        setUser(cookieUser as User);
        // Cache it locally for this origin
        localStorage.setItem("gigs_user", JSON.stringify(cookieUser));
      } else {
        setUser(null);
      }
    };

    sync();
    setIsLoading(false);

    window.addEventListener("storage", sync);
    window.addEventListener("gigsAuthChange", sync);
    
    // Poll for cookie changes since they don't trigger events
    const interval = setInterval(sync, 2000);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("gigsAuthChange", sync);
      clearInterval(interval);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("gigs_user");
    document.cookie = "gigs_session=; path=/; max-age=0; SameSite=Lax";
    setUser(null);
    window.dispatchEvent(new Event("gigsAuthChange"));
  };

  const switchToLister = () => {
    if (!user) return;
    const updated = { ...user, role: "both" as const };
    localStorage.setItem("gigs_user", JSON.stringify(updated));
    
    // Update the session cookie too
    const data = encodeURIComponent(JSON.stringify(updated));
    document.cookie = `gigs_session=${data}; path=/; max-age=31536000; SameSite=Lax`;
    
    setUser(updated);
    window.dispatchEvent(new Event("gigsAuthChange"));
  };

  const isListerMode = user?.role === "lister" || user?.role === "both";

  return { user, isLoading, isAuthenticated: !!user, isListerMode, logout, switchToLister };
}