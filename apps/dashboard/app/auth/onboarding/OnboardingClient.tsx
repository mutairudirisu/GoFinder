"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuth } from "@/context/AuthContext";

interface OnboardingClientProps {
  email: string;
}

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Legal name",
    description: "You won’t be able to change this later.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Create password",
    description: "You can always change this later.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m6-6V9a6 6 0 10-12 0v2m-1 0h14a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1v-7a1 1 0 011-1z" />
      </svg>
    ),
  },
];

export default function OnboardingClient({ email }: OnboardingClientProps) {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated, completeProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
  });
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirm: "",
    showPassword: false,
    showConfirm: false,
    agree: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace("/auth/signup");
      return;
    }
  }, [authLoading, isAuthenticated, router]);

  const currentStepData = useMemo(() => onboardingSteps[currentStep - 1], [currentStep]);

  const handleNext = async () => {
    setErrors({});

    if (currentStep === 1) {
      if (!profileData.firstName.trim()) {
        setErrors((prev) => ({ ...prev, firstName: "First name is required" }));
        return;
      }
      if (!profileData.lastName.trim()) {
        setErrors((prev) => ({ ...prev, lastName: "Last name is required" }));
        return;
      }
    }

    if (currentStep === 2) {
      const pw = passwordData.password;
      const okUpper = /[A-Z]/.test(pw);
      const okLower = /[a-z]/.test(pw);
      const okNumber = /\d/.test(pw);
      const okSpecial = /[^A-Za-z0-9]/.test(pw);
      const okLen = pw.length >= 8;
      const match = pw.length > 0 && pw === passwordData.confirm;
      const ok = okUpper && okLower && okNumber && okSpecial && okLen;
      if (!ok) {
        setErrors((prev) => ({ ...prev, password: "Password must meet all requirements" }));
        return;
      }
      if (!match) {
        setErrors((prev) => ({ ...prev, confirm: "Passwords do not match" }));
        return;
      }
      if (!passwordData.agree) {
        setErrors((prev) => ({ ...prev, agree: "Please agree to the Terms and Conditions" }));
        return;
      }
      setIsLoading(true);
      try {
        await completeProfile({
          name: `${profileData.firstName.trim()} ${profileData.lastName.trim()}`.trim() || user?.name,
          firstName: profileData.firstName.trim(),
          lastName: profileData.lastName.trim(),
          security: { hasPassword: true, passwordSetAt: new Date().toISOString() },
        });

        // Check for redirect destination
        const redirectParam = sessionStorage.getItem("auth_redirect") || "";
        sessionStorage.removeItem("auth_redirect");

        const wantsHosting = user?.role === "lister" || redirectParam.includes("create");
        const finalRedirect = wantsHosting ? "/hosting" : "/";

        // Navigate to the redirect destination
        router.push(finalRedirect);
      } catch (error) {
        setErrors({ submit: "An error occurred. Please try again." });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <AuthLayout title="Setting things up" subtitle="One moment..." showImage>
        <div className="space-y-4">
          <div className="h-10 rounded-2xl bg-slate-100 border border-slate-200 animate-pulse lg:bg-white/5 lg:border-white/10" />
          <div className="h-10 rounded-2xl bg-slate-100 border border-slate-200 animate-pulse lg:bg-white/5 lg:border-white/10" />
          <div className="h-10 rounded-2xl bg-slate-100 border border-slate-200 animate-pulse lg:bg-white/5 lg:border-white/10" />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={currentStep === 1 ? "What's your legal name?" : "Create Password"}
      subtitle={currentStep === 1 ? "You won’t be able to change this later." : "You can always change this later."}
      showImage
    >
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-2">
          {onboardingSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-full font-bold text-xs transition-all ${
                  currentStep >= step.id ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-600 lg:bg-white/10 lg:text-white/60"
                }`}
              >
                {step.id}
              </div>
              {index < onboardingSteps.length - 1 ? (
                <div className={`w-10 h-1 mx-1 rounded-full transition-all ${currentStep > step.id ? "bg-brand-500" : "bg-slate-200 lg:bg-white/10"}`} />
              ) : null}
            </div>
          ))}
        </div>

        <div className="space-y-1 text-center">
          {currentStepData ? (
            <>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full text-slate-900 lg:bg-white/10 lg:text-white">
                {currentStepData.icon}
              </div>
              <h2 className="text-xl font-bold">{currentStepData.title}</h2>
              <p className="text-sm text-slate-600 lg:text-white/60">{currentStepData.description}</p>
            </>
          ) : null}
        </div>

        <div className="space-y-5">
          {currentStep === 1 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <AuthInput
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  error={errors.firstName}
                  variant="dark"
                />
                <AuthInput
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  error={errors.lastName}
                  variant="dark"
                />
              </div>
            </div>
          ) : currentStep === 2 ? (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="relative">
                  <AuthInput
                    id="password"
                    name="password"
                    type={passwordData.showPassword ? "text" : "password"}
                    placeholder="Create password"
                    value={passwordData.password}
                    onChange={(e) => {
                      setPasswordData((p) => ({ ...p, password: e.target.value }));
                      if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    error={errors.password}
                    variant="dark"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordData((p) => ({ ...p, showPassword: !p.showPassword }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 lg:text-white/60 lg:hover:text-white"
                    aria-label={passwordData.showPassword ? "Hide password" : "Show password"}
                  >
                    <i className={`ph ${passwordData.showPassword ? "ph-eye-slash" : "ph-eye"} text-xl`} />
                  </button>
                </div>

                <div className="relative">
                  <AuthInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type={passwordData.showConfirm ? "text" : "password"}
                    placeholder="Confirm password"
                    value={passwordData.confirm}
                    onChange={(e) => {
                      setPasswordData((p) => ({ ...p, confirm: e.target.value }));
                      if (errors.confirm) setErrors((prev) => ({ ...prev, confirm: "" }));
                    }}
                    error={errors.confirm}
                    variant="dark"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordData((p) => ({ ...p, showConfirm: !p.showConfirm }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 lg:text-white/60 lg:hover:text-white"
                    aria-label={passwordData.showConfirm ? "Hide password" : "Show password"}
                  >
                    <i className={`ph ${passwordData.showConfirm ? "ph-eye-slash" : "ph-eye"} text-xl`} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Uppercase", ok: /[A-Z]/.test(passwordData.password) },
                  { label: "Lowercase", ok: /[a-z]/.test(passwordData.password) },
                  { label: "Number", ok: /\d/.test(passwordData.password) },
                  { label: "Special character", ok: /[^A-Za-z0-9]/.test(passwordData.password) },
                  { label: "8+ characters", ok: passwordData.password.length >= 8 },
                ].map((r) => (
                  <span
                    key={r.label}
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      r.ok
                        ? "bg-brand-50 text-brand-700 border-brand-200 lg:bg-brand-500/20 lg:text-white lg:border-brand-400/40"
                        : "bg-slate-50 text-slate-600 border-slate-200 lg:bg-white/5 lg:text-white/60 lg:border-white/10"
                    }`}
                  >
                    {r.label}
                  </span>
                ))}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    passwordData.password && passwordData.password === passwordData.confirm
                      ? "bg-brand-50 text-brand-700 border-brand-200 lg:bg-brand-500/20 lg:text-white lg:border-brand-400/40"
                      : "bg-slate-50 text-slate-600 border-slate-200 lg:bg-white/5 lg:text-white/60 lg:border-white/10"
                  }`}
                >
                  Password match
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-start gap-3 text-sm text-slate-600 lg:text-white/70">
                  <input
                    type="checkbox"
                    checked={passwordData.agree}
                    onChange={(e) => {
                      setPasswordData((p) => ({ ...p, agree: e.target.checked }));
                      if (errors.agree) setErrors((prev) => ({ ...prev, agree: "" }));
                    }}
                    className="mt-1 w-5 h-5 rounded border-slate-300 bg-white text-brand-600 focus:ring-brand-200 lg:border-white/20 lg:bg-white/10 lg:focus:ring-brand-accent/30"
                  />
                  <span>
                    I agree to the{" "}
                    <a href="/terms" className="font-bold text-slate-900 lg:text-white underline underline-offset-4">
                      Terms and Conditions
                    </a>
                    .
                  </span>
                </label>
                {errors.agree ? <div className="text-sm font-semibold text-red-700 lg:text-red-200">{errors.agree}</div> : null}
              </div>
            </div>
          ) : null}

          {errors.submit ? (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl">
              <p className="text-sm font-semibold text-red-700 lg:text-red-200">{errors.submit}</p>
            </div>
          ) : null}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || isLoading}
            className="px-6 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 font-bold hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors lg:bg-white/5 lg:border-white/10 lg:text-white lg:hover:bg-white/10"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={
              isLoading ||
              (currentStep === 1 ? !profileData.firstName.trim() || !profileData.lastName.trim() : false) ||
              (currentStep === 2
                ? !passwordData.agree ||
                  passwordData.password !== passwordData.confirm ||
                  !/[A-Z]/.test(passwordData.password) ||
                  !/[a-z]/.test(passwordData.password) ||
                  !/\d/.test(passwordData.password) ||
                  !/[^A-Za-z0-9]/.test(passwordData.password) ||
                  passwordData.password.length < 8
                : false)
            }
            className="flex-1 px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:bg-slate-200 lg:disabled:bg-white/10 text-white font-bold transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? "Saving..." : currentStep === 2 ? "Create account" : "Continue"}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
