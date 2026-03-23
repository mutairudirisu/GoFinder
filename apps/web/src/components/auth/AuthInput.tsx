"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, icon, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-brand-800">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-600">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full px-4 py-3 rounded-lg border-2 border-brand-200 font-semibold text-brand-900 placeholder-brand-400 transition-all duration-200 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200 hover:border-brand-300 disabled:bg-brand-50 disabled:cursor-not-allowed ${
              icon ? "pl-12" : ""
            } ${error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm font-semibold text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-brand-600">{helperText}</p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
