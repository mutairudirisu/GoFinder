"use client";

import { AuthInput } from "@/components/auth/AuthInput";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import OAuthButtons from "@/components/auth/OAuthButtons";
const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:8888";

export default function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"ROLE" | "EMAIL">("ROLE");
  const [intent, setIntent] = useState<"renter" | "lister" | null>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Store redirect URL from query params
  useEffect(() => {
    const redirect = searchParams.get("redirect");
    if (redirect) {
      sessionStorage.setItem("auth_redirect", redirect);
    }
  }, [searchParams]);

  useEffect(() => {
    const prefillEmail = searchParams.get("email");
    if (prefillEmail && !email) setEmail(prefillEmail);
  }, [searchParams, email]);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (step === "ROLE") {
      if (!intent) {
        setError("Please choose how you'd like to use GIGS Rentals");
        return;
      }
      setStep("EMAIL");
      return;
    }

    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setError("Please enter a valid email");
      return;
    }

    if (!intent) {
      setStep("ROLE");
      setError("Please choose how you'd like to use GIGS Rentals");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const fallbackName = normalized.split("@")[0] || "User";
      localStorage.setItem(
        "pending_signup",
        JSON.stringify({ email: normalized, name: fallbackName, method: "email", roleIntent: intent })
      );
      localStorage.setItem("pending_auth", JSON.stringify({ email: normalized, flow: "signup" }));
      router.push(`/auth/verify-otp?email=${encodeURIComponent(normalized)}&flow=signup`);
    } catch (err) {
      setError("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Fast setup. Verified access. No stress.">
      <form onSubmit={handleContinue} className="space-y-5">
        <div className="flex items-center justify-center gap-3">
          <div className={`h-1.5 rounded-full transition-all ${step === "ROLE" ? "w-10 bg-brand-500" : "w-10 bg-brand-500/50"}`} />
          <div className={`h-1.5 rounded-full transition-all ${step === "EMAIL" ? "w-10 bg-brand-500" : "w-10 bg-white/10"}`} />
          <div className="h-1.5 w-10 rounded-full bg-white/10" />
        </div>

        {step === "ROLE" ? (
          <div className="space-y-4">
            <div className="text-sm text-white/70">How would you like to use GIGS Rentals?</div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setIntent("renter");
                  setError("");
                }}
                className={`w-full text-left p-5 rounded-3xl border transition-all ${
                  intent === "renter" ? "border-brand-400/60 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${intent === "renter" ? "bg-brand-500 text-white" : "bg-white/10 text-white/70"}`}>
                    <i className="ph-bold ph-magnifying-glass text-xl"></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white">Individual / Student</div>
                    <div className="text-sm text-white/60 mt-1">Find accommodation, message hosts, save wishlists, and join roommates.</div>
                  </div>
                  <i className={`ph ph-check-circle text-xl ${intent === "renter" ? "text-brand-300" : "text-white/20"}`}></i>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIntent("lister");
                  setError("");
                }}
                className={`w-full text-left p-5 rounded-3xl border transition-all ${
                  intent === "lister" ? "border-brand-400/60 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${intent === "lister" ? "bg-brand-500 text-white" : "bg-white/10 text-white/70"}`}>
                    <i className="ph-bold ph-storefront text-xl"></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white">Agent / Landlord</div>
                    <div className="text-sm text-white/60 mt-1">Host verified listings, manage inquiries, and publish properties.</div>
                  </div>
                  <i className={`ph ph-check-circle text-xl ${intent === "lister" ? "text-brand-300" : "text-white/20"}`}></i>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <>
            <OAuthButtons isSignup />
            <AuthInput
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              error={error}
              variant="dark"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
              disabled={isLoading}
            />
            <button
              type="button"
              className="text-left text-sm font-semibold text-white/70 hover:text-white underline underline-offset-4"
              onClick={() => {
                setStep("ROLE");
                setError("");
              }}
              disabled={isLoading}
            >
              Change signup option
            </button>
          </>
        )}

        <button
          type="submit"
          disabled={isLoading || (step === "ROLE" ? !intent : !email.trim())}
          className="w-full px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:bg-white/10 text-white font-bold transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending code...
            </>
          ) : (
            step === "ROLE" ? "Continue" : "Verify email"
          )}
        </button>

        <p className="text-center text-sm text-white/70">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-bold text-white hover:text-white/90 underline underline-offset-4">
            Sign in
          </Link>
        </p>

        <p className="text-xs text-center text-white/50 leading-relaxed">
          By continuing, you agree to our{" "}
          <a href={`${WEB_URL}/terms`} className="font-semibold hover:text-white underline underline-offset-4">
            Terms
          </a>{" "}
          and{" "}
          <a href={`${WEB_URL}/privacy`} className="font-semibold hover:text-white underline underline-offset-4">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </AuthLayout>
  );
}
