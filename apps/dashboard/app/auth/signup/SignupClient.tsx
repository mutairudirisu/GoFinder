"use client";

import { AuthInput } from "@/components/auth/AuthInput";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      console.log("Google OAuth signup");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Redirect removed - navigate manually until backend API is complete
      console.log("Google signup successful, navigate to /auth/onboarding manually");
    } catch (err) {
      setError("Google authentication failed");
      setIsLoading(false);
    }
  };

  const handleEmailContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    setIsLoading(true);
    try {
      console.log("Sending OTP to:", email);
      
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Store pending user data
      localStorage.setItem("pending_signup", JSON.stringify({ email, name: email.split("@")[0] }));
      
      // Navigate to verify OTP page
      router.push("/auth/verify-otp");
    } catch (err) {
      setError("Failed to send OTP");
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join thousands of students finding housing">
      <form onSubmit={handleEmailContinue} className="space-y-5">
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-green-900 rounded-xl font-bold text-green-900 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center gap-4">
          <div className="flex-1 h-px bg-green-200"></div>
          <span className="text-sm font-medium text-green-600">Or continue with email</span>
          <div className="flex-1 h-px bg-green-200"></div>
        </div>

        <AuthInput
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          error={error}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading || !email.trim()}
          className="w-full px-6 py-3 md:py-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold text-lg rounded-xl border-2 border-green-700 transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
        >
          {isLoading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending verification code...
            </>
          ) : (
            <>
              Continue
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>

        <p className="text-center text-sm md:text-base text-green-700">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-bold text-green-600 hover:text-green-700 underline underline-offset-2">
            Sign in
          </Link>
        </p>

        <p className="text-xs md:text-sm text-center text-green-600">
          By continuing, you agree to our{" "}
          <a href="/terms" className="font-semibold hover:text-green-700 underline underline-offset-2">Terms of Service</a>{" "}
          and{" "}
          <a href="/privacy" className="font-semibold hover:text-green-700 underline underline-offset-2">Privacy Policy</a>
        </p>
      </form>
    </AuthLayout>
  );
}
