"use client";

import { ReactNode } from "react";

interface LoaderProps {
  /**
   * Size of the loader
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Color of the loader
   * @default "blue"
   */
  color?: "blue" | "gray" | "white";
  /**
   * Optional text to display below the loader
   */
  text?: string;
}

interface FullPageLoaderProps extends LoaderProps {
  /**
   * Optional message to display
   */
  message?: ReactNode;
}

/**
 * Spinner Loader Component
 * A reusable, animated loader component with multiple size options
 */
export const Loader = ({
  size = "md",
  color = "blue",
  text,
}: LoaderProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const colorClasses = {
    blue: "border-blue-500",
    gray: "border-gray-400",
    white: "border-white",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-4 border-opacity-20 border-t-opacity-100 rounded-full animate-spin`}
      />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
};

/**
 * Full Page Loader Component
 * A full-screen loader overlay, useful for page transitions
 */
export const FullPageLoader = ({
  size = "lg",
  color = "blue",
  message,
}: FullPageLoaderProps) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader size={size} color={color} />
        {message && (
          <div className="text-center">
            {typeof message === "string" ? (
              <p className="text-gray-700 font-medium">{message}</p>
            ) : (
              message
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Skeleton Loader Component
 * A placeholder component that mimics the shape of content while loading
 */
interface SkeletonProps {
  /**
   * Width of the skeleton
   * @default "w-full"
   */
  width?: string;
  /**
   * Height of the skeleton
   * @default "h-4"
   */
  height?: string;
  /**
   * Border radius
   * @default "rounded-md"
   */
  rounded?: string;
  /**
   * Number of lines to display (for text skeleton)
   */
  lines?: number;
}

export const Skeleton = ({
  width = "w-full",
  height = "h-4",
  rounded = "rounded-md",
  lines,
}: SkeletonProps) => {
  const baseClass =
    "bg-gray-200 animate-pulse opacity-75";

  if (lines && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClass} ${width} ${height} ${rounded}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`${baseClass} ${width} ${height} ${rounded}`} />
  );
};
