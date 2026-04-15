"use client";
import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { CheckCircle, AlertTriangle, X, Info, AlertCircle } from "lucide-react";

interface Toast {
  id: string; message: string; type: "success" | "error" | "warning" | "info"; duration?: number;
}

interface ToastContextType { toast: (message: string, type?: Toast["type"], duration?: number) => void; }

const ToastContext = createContext<ToastContextType>({ toast: () => {} });
export const useToast = () => useContext(ToastContext);

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    // Listen for custom toast events
    const handler = (e: CustomEvent<{ message: string; type: Toast["type"]; duration?: number }>) => {
      const id = Math.random().toString(36).slice(2);
      const toast: Toast = { id, message: e.detail.message, type: e.detail.type || "info", duration: e.detail.duration || 4000 };
      setToasts(prev => [...prev, toast]);
      setTimeout(() => removeToast(id), toast.duration);
    };
    window.addEventListener("golden-toast" as any, handler as any);
    return () => window.removeEventListener("golden-toast" as any, handler as any);
  }, [removeToast]);

  const icons = { success: CheckCircle, error: AlertCircle, warning: AlertTriangle, info: Info };
  const colors = { success: "bg-green-50 border-green-200 text-green-800", error: "bg-red-50 border-red-200 text-red-800", warning: "bg-yellow-50 border-yellow-200 text-yellow-800", info: "bg-blue-50 border-blue-200 text-blue-800" };
  const iconColors = { success: "text-green-500", error: "text-red-500", warning: "text-yellow-500", info: "text-blue-500" };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] space-y-2 max-w-sm">
      {toasts.map(t => {
        const Icon = icons[t.type];
        return (
          <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-up ${colors[t.type]}`}>
            <Icon size={18} className={iconColors[t.type]} />
            <span className="text-sm font-medium flex-1">{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="p-0.5 rounded hover:bg-black/5"><X size={14} /></button>
          </div>
        );
      })}
    </div>
  );
}

// Global toast function (call from anywhere)
export function showToast(message: string, type: Toast["type"] = "info", duration = 4000) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("golden-toast", { detail: { message, type, duration } }));
  }
}
