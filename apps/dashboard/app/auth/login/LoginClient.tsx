"use client";

import { AuthInput } from "@/components/auth/AuthInput";
import { AuthLayout } from "@/components/auth/AuthLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import OAuthButtons from "@/components/auth/OAuthButtons";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const redirect = searchParams.get("redirect");
    if (redirect) sessionStorage.setItem("auth_redirect", redirect);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setError("Please enter a valid email");
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const res = await fetch(`/api/users?email=${encodeURIComponent(normalized)}`, { cache: "no-store" });
      const data = (await res.json()) as { user: { id: string } | null };
      if (!data.user) {
        setError("No account found for this email. Create one to continue.");
        return;
      }

      localStorage.setItem("pending_auth", JSON.stringify({ email: normalized, flow: "login" }));
      router.push(`/auth/verify-otp?email=${encodeURIComponent(normalized)}&flow=login`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Log in or sign up" subtitle="Enter your email to get a secure verification code">
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          type="email"
          name="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          variant="dark"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          disabled={isLoading || authLoading}
        />

        <button
          type="submit"
          disabled={isLoading || authLoading || !email.trim()}
          className="w-full px-6 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold transition-all active:scale-95 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending code...
            </>
          ) : (
            "Continue"
          )}
        </button>

        <div className="relative flex items-center gap-4">
          <div className="flex-1 h-px bg-slate-100"></div>
          <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-slate-100"></div>
        </div>

        <OAuthButtons showEmailDivider={false} />

        <p className="text-center text-sm text-slate-500 font-medium">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-bold text-brand-600 hover:text-brand-700 underline underline-offset-4">
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
