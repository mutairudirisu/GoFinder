"use client";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout title="Check Your Email" subtitle="We've sent a password reset link" showImage={false}>
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 lg:bg-white/10 lg:border-white/10">
              <svg
                className="w-8 h-8 md:w-10 md:h-10 text-brand-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-slate-700 lg:text-white/80">
              We&apos;ve sent a password reset link to <span className="font-bold text-slate-900 lg:text-white">{email}</span>
            </p>
            <p className="text-sm text-slate-500 lg:text-white/60">
              The link will expire in 24 hours. Check your spam folder if you don&apos;t see the
              email.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="block text-center px-6 py-3 md:py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-lg rounded-2xl transition-colors"
          >
            Back to Sign In
          </Link>
          <button
            onClick={() => setSuccess(false)}
            className="w-full text-center text-sm font-semibold text-slate-600 hover:text-slate-900 lg:text-white/70 lg:hover:text-white underline underline-offset-4"
          >
            Try a different email
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
      showImage={false}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
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
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 md:py-4 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-200 lg:disabled:bg-white/10 text-white font-bold text-lg rounded-2xl transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
        <Link
          href="/auth/login"
          className="block text-center text-sm font-semibold text-slate-600 hover:text-slate-900 lg:text-white/70 lg:hover:text-white underline underline-offset-4"
        >
          Back to Sign In
        </Link>
      </form>
    </AuthLayout>
  );
}
