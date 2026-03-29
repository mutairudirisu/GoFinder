import { useState, useEffect } from "react";
import { User } from "./header.types";

export function useHeaderAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("gigs_user");
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); }
      catch { localStorage.removeItem("gigs_user"); }
    }
    setIsLoading(false);

    const sync = () => {
      const u = localStorage.getItem("gigs_user");
      setUser(u ? JSON.parse(u) : null);
    };

    window.addEventListener("storage", sync);
    window.addEventListener("gigsAuthChange", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("gigsAuthChange", sync);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("gigs_user");
    setUser(null);
    window.dispatchEvent(new Event("gigsAuthChange"));
  };

  const switchToLister = () => {
    if (!user) return;
    const updated = { ...user, role: "both" as const };
    localStorage.setItem("gigs_user", JSON.stringify(updated));
    setUser(updated);
    window.dispatchEvent(new Event("gigsAuthChange"));
  };

  const isListerMode = user?.role === "lister" || user?.role === "both";

  return { user, isLoading, isAuthenticated: !!user, isListerMode, logout, switchToLister };
}