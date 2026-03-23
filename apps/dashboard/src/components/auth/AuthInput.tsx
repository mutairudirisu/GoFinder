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
          <label htmlFor={props.id || props.name} className="block text-sm font-semibold text-green-800">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={props.id || props.name}
            className={`w-full px-4 py-3 rounded-lg border-2 border-green-200 font-semibold text-green-900 placeholder-green-400 transition-all duration-200 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 hover:border-green-300 disabled:bg-green-50 disabled:cursor-not-allowed ${
              icon ? "pl-12" : ""
            } ${error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
        {helperText && !error && <p className="text-xs text-green-600">{helperText}</p>}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
