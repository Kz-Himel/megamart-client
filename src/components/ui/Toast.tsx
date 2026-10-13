"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils/cn";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastType;
  type?: ToastType;
}

export interface ToastContextValue {
  showToast: (props: { type: ToastType; title: string; description?: string }) => void;
  toast: (options: ToastOptions) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <FiCheckCircle className="text-emerald-500 text-lg shrink-0" />,
  error: <FiAlertCircle className="text-rose-500 text-lg shrink-0" />,
  info: <FiInfo className="text-sky-500 text-lg shrink-0" />,
  warning: <FiAlertTriangle className="text-amber-500 text-lg shrink-0" />,
};

const toastStyles: Record<ToastType, string> = {
  success: "border-emerald-200 bg-white text-slate-800",
  error: "border-rose-200 bg-white text-slate-800",
  info: "border-sky-200 bg-white text-slate-800",
  warning: "border-amber-200 bg-white text-slate-800",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, description }: { type: ToastType; title: string; description?: string }) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setToasts((prev) => [...prev, { id, type, title, description }]);

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, description?: string) => showToast({ type: "success", title, description }),
    [showToast]
  );
  const error = useCallback(
    (title: string, description?: string) => showToast({ type: "error", title, description }),
    [showToast]
  );
  const info = useCallback(
    (title: string, description?: string) => showToast({ type: "info", title, description }),
    [showToast]
  );
  const warning = useCallback(
    (title: string, description?: string) => showToast({ type: "warning", title, description }),
    [showToast]
  );
  const toast = useCallback(
    ({ title, description, variant, type }: ToastOptions) => {
      const resolvedType = variant || type || "info";
      showToast({ type: resolvedType, title, description });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, toast, success, error, info, warning }}>
      {children}
      {/* Toast Notification Container */}
      <div
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-xl",
                toastStyles[toast.type]
              )}
            >
              <div className="mt-0.5">{toastIcons[toast.type]}</div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                aria-label="Dismiss notification"
              >
                <FiX className="text-sm" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
