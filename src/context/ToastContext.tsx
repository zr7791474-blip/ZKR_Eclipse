import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ToastContext } from "./toast-context";
import type { ToastItem, ToastType } from "../types/entities";

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = crypto.randomUUID();

      setToasts((previous) => [
        ...previous,
        {
          id,
          message,
          type,
        },
      ]);

      window.setTimeout(() => {
        dismissToast(id);
      }, 4000);
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      dismissToast,
    }),
    [toasts, showToast, dismissToast],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
