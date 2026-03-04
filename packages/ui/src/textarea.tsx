"use client";

import * as React from "react";

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-base",
  lg: "px-5 py-3 text-lg",
};

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: "sm" | "md" | "lg";
  containerClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className = "",
      containerClassName = "",
      label,
      error,
      helperText,
      size = "md",
      required = false,
      disabled = false,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const borderColor = hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-neutral-border hover:border-primary-light focus:border-primary focus:ring-primary";

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-neutral-dark mb-2 font-heading">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          className={`
            w-full border rounded-lg
            bg-white
            transition-all duration-200
            font-sans placeholder:text-neutral-muted
            resize-vertical
            min-h-[120px]
            focus:outline-none focus:ring-2
            ${sizeClasses[size]}
            ${borderColor}
            ${disabled ? "bg-neutral-light opacity-50 cursor-not-allowed" : ""}
            ${className}
          `}
          ref={ref}
          rows={rows}
          required={required}
          disabled={disabled}
          {...props}
        />
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

Textarea.displayName = "Textarea";
