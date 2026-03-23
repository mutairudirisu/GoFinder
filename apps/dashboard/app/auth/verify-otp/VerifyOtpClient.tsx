"use client";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface VerifyOtpClientProps {
  email: string;
}

export default function VerifyOtpClient({ email }: VerifyOtpClientProps) {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    
    const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
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
      // Demo: accept any 6-digit code
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Get pending signup data
      const pending = localStorage.getItem("pending_signup");
      if (pending) {
        const { email } = JSON.parse(pending);
        
        // Create user object
        const user = {
          id: "user_" + Date.now(),
          email,
          name: email.split("@")[0] || "User",
          role: "both" as const,
          isProfileComplete: false,
        };

        localStorage.removeItem("pending_signup");
        localStorage.setItem("gigs_user", JSON.stringify(user));

        // Navigate to onboarding
        router.push("/auth/onboarding");
      } else {
        router.push("/auth/onboarding");
      }
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
      title="Verify your email"
      subtitle={`We've sent a code to ${email}`}
      showImage={true}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-green-800">
            Enter 6-digit code
          </label>
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
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
                className="w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-bold rounded-lg border-2 border-green-200 focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all disabled:bg-green-50 disabled:cursor-not-allowed"
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || otp.some((digit) => !digit)}
          className="w-full px-6 py-3 md:py-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold text-lg rounded-xl border-2 border-green-700 transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
        >
          {isLoading ? "Verifying..." : "Verify & Continue"}
        </button>

        <div className="space-y-3 text-center">
          <p className="text-sm text-green-700">Didn't receive the code?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendTimer > 0 || isLoading}
            className="text-sm font-bold text-green-600 hover:text-green-700 disabled:text-green-400 transition-colors"
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
          </button>
        </div>

        <p className="text-xs text-center text-green-500">Demo: Enter any 6-digit code</p>
      </form>
    </AuthLayout>
  );
}
