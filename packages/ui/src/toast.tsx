"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string, duration?: number) => void;
  error: (message: string, title?: string, duration?: number) => void;
  warning: (message: string, title?: string, duration?: number) => void;
  info: (message: string, title?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: React.ReactNode;
  position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
  maxToasts?: number;
}

export function ToastProvider({ 
  children, 
  position = "top-right",
  maxToasts = 5 
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    setToasts((prev) => {
      const updated = [...prev, newToast];
      return updated.slice(-maxToasts);
    });

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, [maxToasts, removeToast]);

  const success = useCallback(
    (message: string, title?: string, duration?: number) => {
      addToast({ message, title, type: "success", duration });
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, title?: string, duration?: number) => {
      addToast({ message, title, type: "error", duration });
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, title?: string, duration?: number) => {
      addToast({ message, title, type: "warning", duration });
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, title?: string, duration?: number) => {
      addToast({ message, title, type: "info", duration });
    },
    [addToast]
  );

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  };

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, warning, info }}
    >
      {children}
      <div className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none`}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const typeStyles = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      iconColor: "text-green-600 dark:text-green-400",
      textColor: "text-green-900 dark:text-green-100",
    },
    error: {
      icon: AlertCircle,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      iconColor: "text-red-600 dark:text-red-400",
      textColor: "text-red-900 dark:text-red-100",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      textColor: "text-yellow-900 dark:text-yellow-100",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      iconColor: "text-blue-600 dark:text-blue-400",
      textColor: "text-blue-900 dark:text-blue-100",
    },
  };

  const style = typeStyles[toast.type];
  const Icon = style.icon;

  return (
    <div
      className={`
        ${style.bgColor}
        ${style.borderColor}
        border rounded-lg shadow-lg p-4 
        pointer-events-auto
        transition-all duration-300 ease-in-out
        ${isExiting ? "opacity-0 translate-x-full scale-95" : "opacity-100 translate-x-0 scale-100"}
        animate-slideIn
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={`${style.iconColor} flex-shrink-0 mt-0.5`} size={20} />
        
        <div className="flex-1 min-w-0">
          {toast.title && (
            <h4 className={`font-semibold text-sm ${style.textColor} mb-1`}>
              {toast.title}
            </h4>
          )}
          <p className={`text-sm ${style.textColor} break-words`}>
            {toast.message}
          </p>
        </div>

        <button
          onClick={handleClose}
          className={`
            ${style.iconColor}
            hover:opacity-70 
            transition-opacity 
            flex-shrink-0
            focus:outline-none 
            focus:ring-2 
            focus:ring-offset-2 
            ${style.iconColor.replace('text-', 'focus:ring-')}
            rounded
          `}
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

// Standalone Toast component (without provider context)
interface StandaloneToastProps {
  title?: string;
  message: string;
  type?: ToastType;
  onClose?: () => void;
  className?: string;
}

export function ToastComponent({
  title,
  message,
  type = "info",
  onClose,
  className = "",
}: StandaloneToastProps) {
  const typeStyles = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      iconColor: "text-green-600 dark:text-green-400",
      textColor: "text-green-900 dark:text-green-100",
    },
    error: {
      icon: AlertCircle,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      iconColor: "text-red-600 dark:text-red-400",
      textColor: "text-red-900 dark:text-red-100",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      textColor: "text-yellow-900 dark:text-yellow-100",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      iconColor: "text-blue-600 dark:text-blue-400",
      textColor: "text-blue-900 dark:text-blue-100",
    },
  };

  const style = typeStyles[type];
  const Icon = style.icon;

  return (
    <div
      className={`
        ${style.bgColor}
        ${style.borderColor}
        border rounded-lg shadow-lg p-4 
        max-w-md w-full
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={`${style.iconColor} flex-shrink-0 mt-0.5`} size={20} />
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`font-semibold text-sm ${style.textColor} mb-1`}>
              {title}
            </h4>
          )}
          <p className={`text-sm ${style.textColor} break-words`}>
            {message}
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className={`
              ${style.iconColor}
              hover:opacity-70 
              transition-opacity 
              flex-shrink-0
              focus:outline-none 
              focus:ring-2 
              focus:ring-offset-2 
              ${style.iconColor.replace('text-', 'focus:ring-')}
              rounded
            `}
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

// CSS for animations (add to your global CSS or use inline styles)
// @keyframes slideIn {
//   from {
//     transform: translateX(100%);
//     opacity: 0;
//   }
//   to {
//     transform: translateX(0);
//     opacity: 1;
//   }
// }
