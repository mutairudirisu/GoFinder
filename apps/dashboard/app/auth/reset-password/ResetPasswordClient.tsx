"use client";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ResetPasswordClientProps {
  token: string;
}

export default function ResetPasswordClient({ token }: ResetPasswordClientProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (error) {
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Password reset successful"
        subtitle="Your password has been updated"
        showImage={false}
      >
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
          <p className="text-center text-slate-700 lg:text-white/80">You can now sign in with your new password</p>
          <Link
            href="/auth/login"
            className="block text-center px-6 py-3 md:py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-lg rounded-2xl transition-colors"
          >
            Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create a new password"
      subtitle="Please enter a strong password"
      showImage={false}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          id="password"
          type="password"
          name="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          helperText="Must be at least 6 characters"
          variant="dark"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          }
          disabled={isLoading}
        />
        <AuthInput
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          variant="dark"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          disabled={isLoading}
        />
        {errors.submit && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl">
            <p className="text-sm font-semibold text-red-700 lg:text-red-200">{errors.submit}</p>
          </div>
        )}
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
              Resetting...
            </>
          ) : (
            "Reset Password"
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
