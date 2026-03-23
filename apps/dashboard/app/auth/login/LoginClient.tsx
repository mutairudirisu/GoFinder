"use client";

import { AuthInput } from "@/components/auth/AuthInput";
import { AuthLayout } from "@/components/auth/AuthLayout";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginClient() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      console.log("Login data:", { ...formData, rememberMe });
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const emailPart = formData.email.split("@")[0] || "User";
      const userName = emailPart
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      // Create user object in the format expected by AuthContext
      const user = {
        id: "user_" + Date.now(),
        email: formData.email,
        name: userName,
        role: "both" as const,
        isProfileComplete: true,
      };

      // Store user in localStorage (like AuthContext does)
      localStorage.setItem("gigs_user", JSON.stringify(user));

      // Check for redirect destination
      const redirect = sessionStorage.getItem("auth_redirect") || "/listings";
      sessionStorage.removeItem("auth_redirect");

      // Navigate to the redirect destination
      router.push(redirect);
    } catch (error) {
      setErrors({ submit: "Invalid email or password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account to continue">
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          disabled={isLoading}
        />

        <AuthInput
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
          disabled={isLoading}
        />

        <div className="flex items-center justify-between">
          <label htmlFor="rememberMe" className="flex items-center gap-2 cursor-pointer">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-2 border-green-300 cursor-pointer accent-green-600"
              disabled={isLoading}
            />
            <span className="text-sm font-semibold text-green-700">Remember me</span>
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-sm font-semibold text-green-600 hover:text-green-700 underline underline-offset-2"
          >
            Forgot password?
          </Link>
        </div>

        {errors.submit && (
          <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-sm font-semibold text-red-600">{errors.submit}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 md:py-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold text-lg rounded-xl border-2 border-green-700 transition-all hover:shadow-none hover:translate-x-1 hover:translate-y-1 disabled:cursor-not-allowed gap-2 flex items-center justify-center"
          style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
        >
          {isLoading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>

        <p className="text-center text-sm md:text-base text-green-700">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="font-bold text-green-600 hover:text-green-700 underline underline-offset-2">
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
