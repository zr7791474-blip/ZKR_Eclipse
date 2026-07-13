import { createContext } from "react";
import type { ToastItem, ToastType } from "../types/entities";

export interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(
  undefined,
);
