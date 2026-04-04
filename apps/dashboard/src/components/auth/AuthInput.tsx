"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
  variant?: "light" | "dark";
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, icon, helperText, variant = "light", className = "", ...props }, ref) => {
    const isDark = variant === "dark";
    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={props.id || props.name}
            className={`block text-sm font-semibold ${isDark ? "text-white/80" : "text-slate-700"}`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDark ? "text-white/60" : "text-brand-600"}`}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={props.id || props.name}
            className={`w-full px-4 py-3 rounded-xl border font-semibold transition-all duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed ${
              isDark
                ? "bg-white/5 border-white/10 text-white placeholder-white/40 focus:border-brand-400/60 focus:ring-brand-accent/20 hover:border-white/20 disabled:bg-white/5"
                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:ring-brand-200 hover:border-slate-300 disabled:bg-slate-50"
            } ${icon ? "pl-12" : ""} ${error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-sm font-semibold text-red-400">{error}</p>}
        {helperText && !error && (
          <p className={`text-xs ${isDark ? "text-white/60" : "text-slate-500"}`}>{helperText}</p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
