"use client";

import * as React from "react";

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-base",
  lg: "px-5 py-3 text-lg",
};

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  containerClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className = "",
      containerClassName = "",
      label,
      error,
      helperText,
      options,
      size = "md",
      placeholder = "Select...",
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const borderColor = hasError
      ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500"
      : "border-neutral-border hover:border-primary-light focus-within:border-primary focus-within:ring-primary";

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-neutral-dark mb-2 font-heading">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div
          className={`
            relative flex items-center border rounded-lg
            transition-all duration-200 bg-white
            ${borderColor}
            focus-within:outline-none focus-within:ring-2
            ${disabled ? "bg-neutral-light opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <select
            className={`
              w-full bg-transparent outline-none
              font-sans appearance-none pr-10
              disabled:cursor-not-allowed
              ${sizeClasses[size]}
              ${className}
            `}
            ref={ref}
            required={required}
            disabled={disabled}
            {...props}
          >
            <option value="" className="text-neutral-muted">
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 pointer-events-none text-neutral-gray">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-600 font-sans">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-neutral-muted font-sans">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
