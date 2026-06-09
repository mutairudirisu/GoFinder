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
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const didAutoSubmit = useRef(false);

  const [resolvedEmail, setResolvedEmail] = useState(email);
  const [resolvedFlow, setResolvedFlow] = useState<"login" | "signup">(
    flow === "signup" ? "signup" : "login"
  );

  useEffect(() => {
    // Auto-focus hidden input on mount
    const timer = setTimeout(() => {
      hiddenInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setOtp(value);
    
    // Immediately blur to hide keyboard when 6th digit is entered
    if (value.length === 6) {
      hiddenInputRef.current?.blur();
    }
  };

  const handleBoxClick = () => {
    // Ensure hidden input is focused when any box is clicked
    hiddenInputRef.current?.focus();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");

    if (otp.length < 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    // Explicitly blur the hidden input to dismiss mobile keyboard on primary CTA
    hiddenInputRef.current?.blur();

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      if (resolvedFlow === "signup") {
        const ok = await auth.verifyOTP(otp);
        if (!ok) {
          setError("Invalid code. Please try again.");
          setIsLoading(false);
          // Refocus after 10ms as per convention
          setTimeout(() => hiddenInputRef.current?.focus(), 10);
          return;
        }
        localStorage.removeItem("pending_auth");
        router.push("/auth/onboarding");
        return;
      }

      if (!resolvedEmail) {
        setError("Missing email. Please restart sign in.");
        setIsLoading(false);
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
      // Refocus after 10ms as per convention
      setTimeout(() => hiddenInputRef.current?.focus(), 10);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (otp.length < 6) {
      didAutoSubmit.current = false;
      return;
    }
    if (didAutoSubmit.current) return;
    didAutoSubmit.current = true;
    handleSubmit();
  }, [otp, isLoading]);

  const handleResend = async () => {
    setError("");
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResendTimer(60);
      setOtp("");
      setTimeout(() => hiddenInputRef.current?.focus(), 10);
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
      <div className="space-y-8">
        <div className="space-y-6">
          <label className="block text-sm font-semibold text-slate-700 text-center">Enter 6-digit code</label>
          
          <div className="relative flex gap-2 justify-center" onClick={handleBoxClick}>
            {/* Hidden Input Pattern */}
            <input
              ref={hiddenInputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otp}
              onChange={handleOtpChange}
              autoComplete="one-time-code"
              disabled={isLoading}
              className="absolute inset-0 opacity-0 cursor-default"
              aria-hidden="true"
            />
            
            {Array.from({ length: 6 }).map((_, index) => {
              const digit = otp[index] || "";
              const isFocused = otp.length === index && !isLoading;
              
              return (
                <div
                  key={index}
                  className={`w-11 h-11 md:w-14 md:h-14 flex items-center justify-center text-xl md:text-2xl font-bold rounded-2xl border transition-all duration-200 shadow-sm ${
                    isFocused 
                      ? "border-brand-500 ring-4 ring-brand-500/10 bg-white" 
                      : digit 
                        ? "border-slate-300 bg-white text-slate-900" 
                        : "border-slate-200 bg-slate-50 text-slate-400"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-text"}`}
                >
                  {digit}
                  {isFocused && (
                    <span 
                      className="w-0.5 h-6 bg-brand-500 rounded-full" 
                      style={{ 
                        animation: 'blink 0.6s step-end infinite'
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <style jsx global>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <p className="text-sm font-semibold text-red-600 text-center">{error}</p>
          </div>
        )}

        <button
          onClick={() => handleSubmit()}
          disabled={isLoading || otp.length < 6}
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
      </div>
    </AuthLayout>
  );
}
