"use client";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface VerifyOtpClientProps {
  email: string;
  flow?: string;
}

export default function VerifyOtpClient({ email, flow }: VerifyOtpClientProps) {
  const router = useRouter();
  const auth = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const didAutoSubmit = useRef(false);

  const [resolvedEmail, setResolvedEmail] = useState(email);
  const [resolvedFlow, setResolvedFlow] = useState<"login" | "signup">(
    flow === "signup" ? "signup" : "login"
  );

  useEffect(() => {
    if (email) setResolvedEmail(email);
    if (flow === "signup" || flow === "login") setResolvedFlow(flow);
    if (typeof window === "undefined") return;
    if (!email) {
      const pendingAuthRaw = localStorage.getItem("pending_auth");
      if (pendingAuthRaw) {
        try {
          const pending = JSON.parse(pendingAuthRaw) as any;
          if (pending?.email) setResolvedEmail(String(pending.email));
          if (pending?.flow === "signup" || pending?.flow === "login") setResolvedFlow(pending.flow);
        } catch {
        }
      }
    }
  }, [email, flow]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    
    const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input if a digit was entered
    if (digit && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input on backspace if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (otp.some((digit) => !digit)) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      const otpCode = otp.join("");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (otpCode.length !== 6) {
        setError("Invalid code");
        return;
      }

      if (resolvedFlow === "signup") {
        const ok = await auth.verifyOTP(otpCode);
        if (!ok) {
          setError("Invalid code. Please try again.");
          return;
        }
        localStorage.removeItem("pending_auth");
        router.push("/auth/onboarding");
        return;
      }

      if (!resolvedEmail) {
        setError("Missing email. Please restart sign in.");
        return;
      }

      await auth.login(resolvedEmail);
      localStorage.removeItem("pending_auth");
      const adminCheck = await fetch(`/api/users?email=${encodeURIComponent(String(resolvedEmail).trim().toLowerCase())}`, { cache: "no-store" });
      const adminData = (await adminCheck.json()) as { user: { role?: string; email?: string } | null };
      const isAdmin = adminData.user?.role === "admin" || String(adminData.user?.email ?? "").toLowerCase() === "admin@gigs.app";
      if (isAdmin) {
        sessionStorage.removeItem("auth_redirect");
        router.push("/admin");
        return;
      }
      const redirect = sessionStorage.getItem("auth_redirect") || "/";
      sessionStorage.removeItem("auth_redirect");
      router.push(redirect);
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (otp.some((d) => !d)) {
      didAutoSubmit.current = false;
      return;
    }
    if (didAutoSubmit.current) return;
    didAutoSubmit.current = true;
    const form = document.getElementById("otp-form") as HTMLFormElement | null;
    if (form) form.requestSubmit();
  }, [otp, isLoading]);

  const handleResend = async () => {
    setError("");
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResendTimer(60);
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={resolvedFlow === "signup" ? "Confirm your email" : "Check your email"}
      subtitle={resolvedEmail ? `We sent a 6-digit code to ${resolvedEmail}` : "We sent a 6-digit verification code"}
      showImage={true}
    >
      <form id="otp-form" onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <label className="block text-sm font-semibold text-slate-700 text-center">Enter 6-digit code</label>
          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-digit-${index}`}
                name={`otp-digit-${index}`}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
                className="w-11 h-11 md:w-14 md:h-14 text-center text-xl md:text-2xl font-bold rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:outline-none transition-all disabled:cursor-not-allowed disabled:bg-slate-50 shadow-sm"
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || otp.some((digit) => !digit)}
          className="w-full px-6 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold transition-all active:scale-95 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 disabled:shadow-none"
        >
          {isLoading ? "Verifying..." : "Verify & Continue"}
        </button>

        <div className="space-y-4 text-center">
          <p className="text-sm text-slate-500 font-medium">Didn&apos;t receive the code?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendTimer > 0 || isLoading}
            className="text-sm font-bold text-brand-600 hover:text-brand-700 disabled:text-slate-400 underline underline-offset-4 transition-colors"
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
          </button>
        </div>

        <p className="text-xs text-center text-slate-400 font-medium tracking-wide">Demo: Enter any 6-digit code</p>
      </form>
    </AuthLayout>
  );
}
